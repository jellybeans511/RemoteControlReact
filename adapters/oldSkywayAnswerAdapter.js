// Old SkyWay Answer-side adapter (PeerJS-style)
// Expects global Peer from old SkyWay SDK

export function createOldSkywayAnswerAdapter({ apiKey, localPeerId, onOpen, onData, peer: injectedPeer }) {
  if (typeof Peer === "undefined") {
    throw new Error("SkyWay old SDK (Peer) is not loaded");
  }
  if (!apiKey) throw new Error("SkyWay API key is required");
  // Reuse injected or pre-created global peer if available
  const preCreated = (typeof window !== "undefined" && window.__oldSkywayAnswerPeer) || null;
  const peer = injectedPeer || preCreated || new Peer(localPeerId || undefined, { key: apiKey, debug: 2 });
  let dataConnection = null;
  let mediaConnection = null;
  let localStream = null;

  const dataChannel = {
    readyState: "connecting",
    onopen: null,
    onmessage: null,
    send: (data) => {
      if (dataConnection && dataConnection.open) {
        dataConnection.send(typeof data === "string" ? data : JSON.stringify(data));
      }
    },
  };

  peer.on("open", (id) => {
    try { console.log("[OldSkyWay Answer Adapter] Peer open:", id); } catch (_) {}
    if (typeof onOpen === "function") {
      try { onOpen(id); } catch (_) {}
    }
  });

  peer.on("connection", (dc) => {
    dataConnection = dc;
    dataChannel.readyState = dc.open ? "open" : "connecting";
    dc.once("open", () => {
      try { console.log("[OldSkyWay Answer Adapter] DataConnection open"); } catch (_) {}
      dataChannel.readyState = "open";
      if (typeof dataChannel.onopen === "function") {
        try { dataChannel.onopen(); } catch (_) {}
      }
    });
    dc.on("data", (msg) => {
      try {
        const ts = Date.now();
        console.log("[OldSkyWay Answer Adapter] Received data:", ts, msg);
      } catch (_) {}
      if (typeof dataChannel.onmessage === "function") {
        try { dataChannel.onmessage({ data: msg }); } catch (_) {}
      }
      if (typeof onData === "function") {
        try { onData(msg); } catch (_) {}
      }
    });
    dc.on("close", () => {
      dataChannel.readyState = "closed";
    });
  });

  peer.on("call", (mc) => {
    mediaConnection = mc;
    try {
      mc.answer(localStream || null, {});
    } catch (e) {
      console.error("Failed to answer media call", e);
    }
  });

  function setLocalStream(stream) {
    localStream = stream;
  }

  function close() {
    try { mediaConnection && mediaConnection.close && mediaConnection.close(true); } catch (_) {}
    try { dataConnection && dataConnection.close && dataConnection.close(true); } catch (_) {}
    try { peer && peer.destroy && peer.destroy(); } catch (_) {}
    dataChannel.readyState = "closed";
  }

  return { peer, setLocalStream, dataChannel, close };
}
