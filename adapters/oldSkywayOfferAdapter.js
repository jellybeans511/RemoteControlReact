// Adapter for Old SkyWay (PeerJS style)
// Expects global Peer (SkyWay old SDK) to be available when used.

export async function startOldSkywayConnection({
  apiKey,
  remotePeerId,
  onStream,
  onData,
  onOpen,
  peer: injectedPeer,
}) {
  if (typeof Peer === "undefined") {
    console.error("SkyWay old SDK (Peer) is not loaded. Include the SDK script before using this mode.");
    throw new Error("Peer SDK not available");
  }
  if (!apiKey) {
    throw new Error("SkyWay API key is required");
  }
  if (!remotePeerId) {
    throw new Error("SkyWay remote peer ID is required");
  }

  const peer = injectedPeer || new Peer({ key: apiKey, debug: 2 });

  // DataChannel facade to mimic RTCDataChannel minimal surface
  const dataChannel = {
    readyState: "connecting",
    onopen: null,
    onmessage: null,
    send: (data) => {
      if (dc && dc.open) {
        dc.send(typeof data === "string" ? data : JSON.stringify(data));
      } else {
        console.warn("SkyWay data connection not open yet");
      }
    },
  };

  let mc = null; // MediaConnection
  let dc = null; // DataConnection

  const waitOpen = new Promise((resolve, reject) => {
    const onPeerOpen = (id) => {
      try {
        mc = peer.call(remotePeerId, null, {});
        if (mc) {
          mc.on("stream", (stream) => {
            try { onStream && onStream(stream); } catch (_) {}
          });
        }

        dc = peer.connect(remotePeerId);
        dc.once("open", () => {
          dataChannel.readyState = "open";
          if (typeof dataChannel.onopen === "function") {
            try { dataChannel.onopen(); } catch (_) {}
          }
          if (onOpen) {
            try { onOpen(); } catch (_) {}
          }
          resolve();
        });
        dc.on("data", (payload) => {
          // Normalize to RTCDataChannelMessageEvent-like
          if (typeof dataChannel.onmessage === "function") {
            try { dataChannel.onmessage({ data: payload }); } catch (_) {}
          }
          if (onData) {
            try { onData(payload); } catch (_) {}
          }
        });
        dc.on("close", () => {
          dataChannel.readyState = "closed";
        });
      } catch (e) {
        reject(e);
      }
    };
    // If peer is already open (when injected), we may not get 'open' again
    if (peer.open) {
      onPeerOpen(peer.id);
    } else {
      peer.once("open", onPeerOpen);
    }
    peer.on("error", (e) => reject(e));
  });

  await waitOpen;

  function close() {
    try { mc && mc.close && mc.close(true); } catch (_) {}
    try { dc && dc.close && dc.close(true); } catch (_) {}
    try { peer && peer.destroy && peer.destroy(); } catch (_) {}
    dataChannel.readyState = "closed";
  }

  return { peer, mediaConnection: mc, dataConnection: dc, dataChannel, close };
}
