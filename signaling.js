const WebSocket = require("ws");

const webSocketPort = 8080;
const server = new WebSocket.Server({ port: webSocketPort });

// roomId -> { offers: Map<peerId, socket>, answers: Map<peerId, socket> }
const rooms = new Map();
const LEGACY_ROOM_ID = "__legacy_single_pair__";

const getRoom = (roomId) => {
  const id = roomId || LEGACY_ROOM_ID;
  if (!rooms.has(id)) {
    rooms.set(id, { offers: new Map(), answers: new Map() });
  }
  return rooms.get(id);
};

const safeSend = (socket, payload) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;
  socket.send(JSON.stringify(payload));
  return true;
};

const normalizeRole = (role) => (role === "offer" || role === "answer" ? role : null);

const attachMeta = (socket, meta) => {
  socket.__meta = meta;
};

const detachMeta = (socket) => {
  delete socket.__meta;
};

const registerClient = (socket, { role, roomId, peerId, legacy = false }) => {
  const normRole = normalizeRole(role);
  if (!normRole) {
    safeSend(socket, { type: "error", message: "Invalid role; expected offer|answer" });
    return;
  }
  const id = peerId || (legacy ? `legacy-${normRole}` : null);
  if (!id) {
    safeSend(socket, { type: "error", message: "peerId is required" });
    return;
  }

  const room = getRoom(roomId);
  const targetMap = normRole === "offer" ? room.offers : room.answers;

  // Replace existing connection for the same peerId (if any)
  const prev = targetMap.get(id);
  if (prev && prev !== socket) {
    try {
      prev.close();
    } catch (_) {}
  }

  targetMap.set(id, socket);
  attachMeta(socket, { role: normRole, roomId: roomId || LEGACY_ROOM_ID, peerId: id });

  safeSend(socket, { type: "registered", role: normRole, roomId: roomId || LEGACY_ROOM_ID, peerId: id });
  console.log(`[register] role=${normRole} room=${roomId || LEGACY_ROOM_ID} peer=${id}`);
};

const routeSignal = ({ from, to, roomId, data }) => {
  const room = getRoom(roomId);
  const targetMap = to.role === "offer" ? room.offers : room.answers;
  const targetSocket = targetMap.get(to.peerId);

  if (!targetSocket) {
    console.warn(`[signal] target not found room=${roomId} role=${to.role} peer=${to.peerId}`);
    return;
  }

  safeSend(targetSocket, {
    type: "signal",
    roomId,
    from,
    to,
    data,
  });
  console.log(`[signal] ${from.role}:${from.peerId} -> ${to.role}:${to.peerId} room=${roomId} kind=${data && data.kind}`);
};

const handleLegacyRelay = (socket, type, payload) => {
  // Legacy schema: single offer/answer pair, message type decides direction.
  const room = getRoom(LEGACY_ROOM_ID);
  const targetRole = type.includes("offer") ? "answer" : "offer";
  const targetMap = targetRole === "offer" ? room.offers : room.answers;
  const targetSocket = targetMap.values().next().value; // first (only) entry
  if (!targetSocket) {
    console.warn(`[legacy] target not connected role=${targetRole}`);
    return;
  }
  safeSend(targetSocket, { type, payload });
  console.log(`[legacy] relayed ${type} to ${targetRole}`);
};

server.on("connection", (socket) => {
  socket.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (error) {
      safeSend(socket, { type: "error", message: "Invalid JSON" });
      return;
    }

    const { type, payload } = data;
    switch (type) {
      case "register": {
        const { role, roomId, peerId } = payload || {};
        registerClient(socket, { role, roomId, peerId });
        break;
      }
      case "signal": {
        // Accept both new-style envelope (top-level fields) and old payload-wrapped shape.
        const envelope = payload || data;
        const { roomId, from, to, data: signalData } = envelope || {};
        if (!from || !to || !from.role || !to.role || !to.peerId) {
          safeSend(socket, { type: "error", message: "signal requires from/to with role and to.peerId" });
          break;
        }
        if (!signalData) {
          safeSend(socket, { type: "error", message: "signal requires data" });
          break;
        }
        const fromRole = normalizeRole(from.role);
        const toRole = normalizeRole(to.role);
        if (!fromRole || !toRole) {
          safeSend(socket, { type: "error", message: "signal roles must be offer|answer" });
          break;
        }
        routeSignal({
          from: { role: fromRole, peerId: from.peerId },
          to: { role: toRole, peerId: to.peerId },
          roomId: roomId || LEGACY_ROOM_ID,
          data: signalData,
        });
        break;
      }
      // Legacy compatibility (single pair)
      case "register-offer":
        registerClient(socket, { role: "offer", roomId: LEGACY_ROOM_ID, peerId: "legacy-offer", legacy: true });
        break;
      case "register-answer":
        registerClient(socket, { role: "answer", roomId: LEGACY_ROOM_ID, peerId: "legacy-answer", legacy: true });
        break;
      case "offer":
      case "answer":
      case "ice-offer":
      case "ice-answer":
        handleLegacyRelay(socket, type, payload);
        break;
      default:
        safeSend(socket, { type: "error", message: `Unknown type: ${type}` });
        console.warn(`[warn] unknown message type: ${type}`);
        break;
    }
  });

  socket.on("close", () => {
    const meta = socket.__meta;
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

console.log(`WebSocket server running on ws://localhost:${webSocketPort}`);
