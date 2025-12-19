import WebSocket, { WebSocketServer } from "ws";

type Role = "offer" | "answer";

type PeerRef = {
  role: Role;
  peerId: string;
};

type SignalData =
  | { kind: "offer"; sdp: string }
  | { kind: "answer"; sdp: string }
  | { kind: "ice"; candidate: RTCIceCandidateInit };

type SignalEnvelope = {
  type: "signal";
  roomId?: string;
  from: PeerRef;
  to: PeerRef;
  data: SignalData;
};

type RegisterMessage = {
  type: "register";
  payload: {
    role: Role;
    peerId: string;
    roomId?: string;
  };
};

type LegacyMessage =
  | { type: "register-offer" }
  | { type: "register-answer" }
  | { type: "offer"; payload: { sdp: string } }
  | { type: "answer"; payload: { sdp: string } }
  | { type: "ice-offer"; payload: { candidate: RTCIceCandidateInit } }
  | { type: "ice-answer"; payload: { candidate: RTCIceCandidateInit } };

type SignalingMessage = RegisterMessage | SignalEnvelope | LegacyMessage;

type RoomSockets = {
  offers: Map<string, WebSocket>;
  answers: Map<string, WebSocket>;
};

const LEGACY_ROOM_ID = "__legacy_single_pair__";

const normalizeRole = (role?: string | null): Role | null =>
  role === "offer" || role === "answer" ? role : null;

const safeSend = (socket: WebSocket, payload: unknown) => {
  if (socket.readyState !== WebSocket.OPEN) return false;
  socket.send(JSON.stringify(payload));
  return true;
};

const getRoom = (rooms: Map<string, RoomSockets>, roomId?: string) => {
  const id = roomId || LEGACY_ROOM_ID;
  if (!rooms.has(id)) {
    rooms.set(id, { offers: new Map(), answers: new Map() });
  }
  return rooms.get(id)!;
};

export const createSignalingServer = (port = 8080) => {
  const rooms = new Map<string, RoomSockets>();
  const server = new WebSocketServer({ port });

  const attachMeta = (socket: WebSocket, meta: { role: Role; roomId: string; peerId: string }) => {
    (socket as any).__meta = meta;
  };
  const detachMeta = (socket: WebSocket) => {
    delete (socket as any).__meta;
  };

  const registerClient = (socket: WebSocket, payload: RegisterMessage["payload"], legacy = false) => {
    const normRole = normalizeRole(payload.role);
    if (!normRole) {
      safeSend(socket, { type: "error", message: "Invalid role; expected offer|answer" });
      return;
    }
    const id = payload.peerId || (legacy ? `legacy-${normRole}` : null);
    if (!id) {
      safeSend(socket, { type: "error", message: "peerId is required" });
      return;
    }

    const room = getRoom(rooms, payload.roomId);
    const targetMap = normRole === "offer" ? room.offers : room.answers;

    const prev = targetMap.get(id);
    if (prev && prev !== socket) {
      try {
        prev.close();
      } catch {
        /* ignore */
      }
    }

    targetMap.set(id, socket);
    attachMeta(socket, { role: normRole, roomId: payload.roomId || LEGACY_ROOM_ID, peerId: id });

    safeSend(socket, { type: "registered", role: normRole, roomId: payload.roomId || LEGACY_ROOM_ID, peerId: id });
    console.log(`[register] role=${normRole} room=${payload.roomId || LEGACY_ROOM_ID} peer=${id}`);
  };

  const routeSignal = (payload: SignalEnvelope) => {
    const room = getRoom(rooms, payload.roomId);
    const targetMap = payload.to.role === "offer" ? room.offers : room.answers;
    const targetSocket = targetMap.get(payload.to.peerId);
    if (!targetSocket) {
      console.warn(`[signal] target not found room=${payload.roomId} role=${payload.to.role} peer=${payload.to.peerId}`);
      return;
    }
    safeSend(targetSocket, payload);
    console.log(
      `[signal] ${payload.from.role}:${payload.from.peerId} -> ${payload.to.role}:${payload.to.peerId} room=${
        payload.roomId
      } kind=${payload.data && (payload.data as any).kind}`
    );
  };

  const handleLegacyRelay = (socket: WebSocket, type: string, payload: any) => {
    const room = getRoom(rooms, LEGACY_ROOM_ID);
    const targetRole = type.includes("offer") ? "answer" : "offer";
    const targetMap = targetRole === "offer" ? room.offers : room.answers;
    const targetSocket = targetMap.values().next().value as WebSocket | undefined;
    if (!targetSocket) {
      console.warn(`[legacy] target not connected role=${targetRole}`);
      return;
    }
    safeSend(targetSocket, { type, payload });
    console.log(`[legacy] relayed ${type} to ${targetRole}`);
  };

  server.on("connection", (socket) => {
    socket.on("message", (message) => {
      let data: SignalingMessage;
      try {
        data = JSON.parse(message.toString());
      } catch (error) {
        safeSend(socket, { type: "error", message: "Invalid JSON" });
        return;
      }

      switch (data.type) {
        case "register":
          registerClient(socket, data.payload, false);
          break;
        case "signal":
          if (!data.from || !data.to || !data.to.peerId || !normalizeRole(data.from.role) || !normalizeRole(data.to.role)) {
            safeSend(socket, { type: "error", message: "signal requires from/to with role and to.peerId" });
            break;
          }
          if (!data.data) {
            safeSend(socket, { type: "error", message: "signal requires data" });
            break;
          }
          routeSignal({
            type: "signal",
            from: { role: data.from.role, peerId: data.from.peerId },
            to: { role: data.to.role, peerId: data.to.peerId },
            roomId: data.roomId || LEGACY_ROOM_ID,
            data: data.data,
          });
          break;
        case "register-offer":
          registerClient(socket, { role: "offer", peerId: "legacy-offer", roomId: LEGACY_ROOM_ID }, true);
          break;
        case "register-answer":
          registerClient(socket, { role: "answer", peerId: "legacy-answer", roomId: LEGACY_ROOM_ID }, true);
          break;
        case "offer":
        case "answer":
        case "ice-offer":
        case "ice-answer":
          handleLegacyRelay(socket, data.type, (data as any).payload);
          break;
        default:
          safeSend(socket, { type: "error", message: `Unknown type: ${String((data as any).type)}` });
          console.warn(`[warn] unknown message type: ${String((data as any).type)}`);
      }
    });

    socket.on("close", () => {
      const meta = (socket as any).__meta as { role: Role; roomId: string; peerId: string } | undefined;
      if (meta && meta.roomId) {
        const room = rooms.get(meta.roomId);
        if (room) {
          const targetMap = meta.role === "offer" ? room.offers : room.answers;
          targetMap.delete(meta.peerId);
          if (room.offers.size === 0 && room.answers.size === 0) {
            rooms.delete(meta.roomId);
          }
        }
        console.log(`[disconnect] role=${meta.role} room=${meta.roomId} peer=${meta.peerId}`);
      }
      detachMeta(socket);
    });
  });

  console.log(`WebSocket signaling server running on ws://localhost:${port}`);
  return server;
};
