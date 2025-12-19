use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
};
use tokio::sync::{mpsc, oneshot, RwLock};

const WS_PORT: u16 = 8080;
const LEGACY_ROOM_ID: &str = "__legacy_single_pair__";

static CONN_ID: AtomicU64 = AtomicU64::new(1);

#[derive(Clone, Debug)]
struct PeerConn {
    conn_id: u64,
    tx: mpsc::UnboundedSender<Message>,
    close_tx: Arc<tokio::sync::Mutex<Option<oneshot::Sender<()>>>>,
}

#[derive(Default, Debug)]
struct Room {
    offers: HashMap<String, PeerConn>,
    answers: HashMap<String, PeerConn>,
}

#[derive(Default)]
struct AppState {
    rooms: RwLock<HashMap<String, Room>>,
}

#[derive(Clone, Debug)]
struct Meta {
    conn_id: u64,
    role: Role,
    room_id: String,
    peer_id: String,
}

#[derive(Clone, Debug, PartialEq, Eq)]
enum Role {
    Offer,
    Answer,
}

impl Role {
    fn normalize(s: &str) -> Option<Self> {
        match s {
            "offer" => Some(Role::Offer),
            "answer" => Some(Role::Answer),
            _ => None,
        }
    }
    fn as_str(&self) -> &'static str {
        match self {
            Role::Offer => "offer",
            Role::Answer => "answer",
        }
    }
}

#[derive(Debug, Deserialize)]
struct IncomingEnvelope {
    #[serde(rename = "type")]
    typ: String,
    payload: Option<Value>,
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::default());

    let app = Router::new()
        .route("/ws", get({
            let state = state.clone();
            move |ws: WebSocketUpgrade| {
                let state = state.clone();
                async move { ws.on_upgrade(move |socket| handle_socket(socket, state)) }
            }
        }));

    let addr = SocketAddr::from(([0, 0, 0, 0], WS_PORT));
    println!("WebSocket server running on ws://localhost:{}/ws", WS_PORT);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn handle_socket(mut socket: WebSocket, state: Arc<AppState>) {
    let conn_id = CONN_ID.fetch_add(1, Ordering::Relaxed);

    // outgoing queue
    let (out_tx, mut out_rx) = mpsc::unbounded_channel::<Message>();

    // close signal (to force-close old connections on replace)
    let (close_tx, mut close_rx) = oneshot::channel::<()>();
    let close_tx = Arc::new(tokio::sync::Mutex::new(Some(close_tx)));

    // sender task
    let (mut ws_sender, mut ws_receiver) = socket.split();

    let sender_task = tokio::spawn(async move {
        while let Some(msg) = out_rx.recv().await {
            if ws_sender.send(msg).await.is_err() {
                break;
            }
        }
    });

    // per-connection meta
    let mut meta: Option<Meta> = None;

    // helper: send JSON to this socket
    let send_self = |v: Value| -> bool {
        out_tx.send(Message::Text(v.to_string())).is_ok()
    };

    // receive loop
    loop {
        tokio::select! {
            _ = &mut close_rx => {
                // forced close
                let _ = ws_receiver.close().await;
                break;
            }
            maybe = ws_receiver.next() => {
                let Some(Ok(msg)) = maybe else { break; };

                match msg {
                    Message::Text(text) => {
                        let parsed: Result<IncomingEnvelope, _> = serde_json::from_str(&text);
                        let Ok(env) = parsed else {
                            send_self(json!({"type":"error","message":"Invalid JSON"}));
                            continue;
                        };

                        match env.typ.as_str() {
                            "register" => {
                                let payload = env.payload.unwrap_or(Value::Null);
                                let role_s = payload.get("role").and_then(|v| v.as_str()).unwrap_or("");
                                let room_id = payload.get("roomId").and_then(|v| v.as_str()).unwrap_or(LEGACY_ROOM_ID);
                                let peer_id = payload.get("peerId").and_then(|v| v.as_str()).unwrap_or("");

                                register_client(
                                    conn_id,
                                    &state,
                                    &out_tx,
                                    &close_tx,
                                    &mut meta,
                                    role_s,
                                    room_id,
                                    peer_id,
                                    false,
                                ).await;
                            }
                            "signal" => {
                                let payload = env.payload.unwrap_or(Value::Null);
                                let room_id = payload.get("roomId").and_then(|v| v.as_str()).unwrap_or(LEGACY_ROOM_ID).to_string();

                                let from = payload.get("from").cloned().unwrap_or(Value::Null);
                                let to = payload.get("to").cloned().unwrap_or(Value::Null);
                                let data = payload.get("data").cloned();

                                let Some(data) = data else {
                                    send_self(json!({"type":"error","message":"signal requires data"}));
                                    continue;
                                };

                                let from_role_s = from.get("role").and_then(|v| v.as_str()).unwrap_or("");
                                let to_role_s = to.get("role").and_then(|v| v.as_str()).unwrap_or("");
                                let to_peer = to.get("peerId").and_then(|v| v.as_str()).unwrap_or("");
                                let from_peer = from.get("peerId").and_then(|v| v.as_str()).unwrap_or("");

                                let Some(from_role) = Role::normalize(from_role_s) else {
                                    send_self(json!({"type":"error","message":"signal roles must be offer|answer"}));
                                    continue;
                                };
                                let Some(to_role) = Role::normalize(to_role_s) else {
                                    send_self(json!({"type":"error","message":"signal roles must be offer|answer"}));
                                    continue;
                                };
                                if to_peer.is_empty() {
                                    send_self(json!({"type":"error","message":"signal requires from/to with role and to.peerId"}));
                                    continue;
                                }

                                route_signal(
                                    &state,
                                    room_id,
                                    from_role,
                                    from_peer.to_string(),
                                    to_role,
                                    to_peer.to_string(),
                                    data,
                                ).await;
                            }

                            // Legacy compatibility
                            "register-offer" => {
                                register_client(
                                    conn_id,
                                    &state,
                                    &out_tx,
                                    &close_tx,
                                    &mut meta,
                                    "offer",
                                    LEGACY_ROOM_ID,
                                    "legacy-offer",
                                    true,
                                ).await;
                            }
                            "register-answer" => {
                                register_client(
                                    conn_id,
                                    &state,
                                    &out_tx,
                                    &close_tx,
                                    &mut meta,
                                    "answer",
                                    LEGACY_ROOM_ID,
                                    "legacy-answer",
                                    true,
                                ).await;
                            }
                            "offer" | "answer" | "ice-offer" | "ice-answer" => {
                                let payload = env.payload.unwrap_or(Value::Null);
                                handle_legacy_relay(&state, env.typ, payload).await;
                            }

                            other => {
                                send_self(json!({"type":"error","message": format!("Unknown type: {}", other)}));
                                eprintln!("[warn] unknown message type: {}", other);
                            }
                        }
                    }
                    Message::Close(_) => break,
                    Message::Binary(_) => {
                        // ignore (signalingはText/JSON前提)
                    }
                    _ => {}
                }
            }
        }
    }

    // cleanup on disconnect
    if let Some(m) = meta.take() {
        cleanup_disconnect(&state, &m).await;
        println!(
            "[disconnect] role={} room={} peer={}",
            m.role.as_str(),
            m.room_id,
            m.peer_id
        );
    }

    // stop sender task
    sender_task.abort();
}

async fn register_client(
    conn_id: u64,
    state: &Arc<AppState>,
    out_tx: &mpsc::UnboundedSender<Message>,
    close_tx: &Arc<tokio::sync::Mutex<Option<oneshot::Sender<()>>>>,
    meta: &mut Option<Meta>,
    role_s: &str,
    room_id_in: &str,
    peer_id_in: &str,
    _legacy: bool,
) {
    let Some(role) = Role::normalize(role_s) else {
        let _ = out_tx.send(Message::Text(
            json!({"type":"error","message":"Invalid role; expected offer|answer"}).to_string(),
        ));
        return;
    };

    let room_id = if room_id_in.is_empty() { LEGACY_ROOM_ID } else { room_id_in }.to_string();
    let peer_id = peer_id_in.to_string();
    if peer_id.is_empty() {
        let _ = out_tx.send(Message::Text(
            json!({"type":"error","message":"peerId is required"}).to_string(),
        ));
        return;
    }

    // build current connection handle
    let conn = PeerConn {
        conn_id,
        tx: out_tx.clone(),
        close_tx: close_tx.clone(),
    };

    // insert & replace existing (force close old)
    {
        let mut rooms = state.rooms.write().await;
        let room = rooms.entry(room_id.clone()).or_insert_with(Room::default);
        let target_map = match role {
            Role::Offer => &mut room.offers,
            Role::Answer => &mut room.answers,
        };

        if let Some(prev) = target_map.insert(peer_id.clone(), conn.clone()) {
            if prev.conn_id != conn_id {
                // ask old connection to close (safe even if already closed)
                if let Some(tx) = prev.close_tx.lock().await.take() {
                    let _ = tx.send(());
                }
            }
        }
    }

    *meta = Some(Meta {
        conn_id,
        role: role.clone(),
        room_id: room_id.clone(),
        peer_id: peer_id.clone(),
    });

    let _ = out_tx.send(Message::Text(
        json!({
            "type":"registered",
            "role": role.as_str(),
            "roomId": room_id,
            "peerId": peer_id
        })
        .to_string(),
    ));

    println!(
        "[register] role={} room={} peer={}",
        role.as_str(),
        room_id,
        peer_id
    );
}

async fn route_signal(
    state: &Arc<AppState>,
    room_id: String,
    from_role: Role,
    from_peer: String,
    to_role: Role,
    to_peer: String,
    data: Value,
) {
    let target = {
        let rooms = state.rooms.read().await;
        let Some(room) = rooms.get(&room_id) else {
            eprintln!("[signal] room not found room={}", room_id);
            return;
        };
        let map = match to_role {
            Role::Offer => &room.offers,
            Role::Answer => &room.answers,
        };
        map.get(&to_peer).cloned()
    };

    let Some(target_conn) = target else {
        eprintln!(
            "[signal] target not found room={} role={} peer={}",
            room_id,
            to_role.as_str(),
            to_peer
        );
        return;
    };

    let payload = json!({
        "type": "signal",
        "roomId": room_id,
        "from": { "role": from_role.as_str(), "peerId": from_peer },
        "to":   { "role": to_role.as_str(),   "peerId": to_peer },
        "data": data
    });

    let _ = target_conn.tx.send(Message::Text(payload.to_string()));
}

async fn handle_legacy_relay(state: &Arc<AppState>, typ: String, payload: Value) {
    let target_role = if typ.contains("offer") { Role::Answer } else { Role::Offer };

    let target = {
        let rooms = state.rooms.read().await;
        let Some(room) = rooms.get(LEGACY_ROOM_ID) else {
            eprintln!("[legacy] room not found");
            return;
        };
        let map = match target_role {
            Role::Offer => &room.offers,
            Role::Answer => &room.answers,
        };
