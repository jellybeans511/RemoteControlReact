type OldSkywayAnswerOptions = {
  apiKey: string;
  localPeerId?: string;
  onOpen?: (peerId: string) => void;
  onData?: (data: unknown) => void;
};

export type OldSkywayAnswerConnection = {
  peerId: string | null;
  dataChannel: RTCDataChannelLike | null;
  setLocalStream: (stream: MediaStream | null) => void;
  close: () => void;
};

type RTCDataChannelLike = {
  readyState: RTCDataChannelState;
  onopen: (() => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;
  send: (data: any) => void;
  close?: () => void;
};

declare const Peer: any; // old SkyWay global

export function createOldSkywayAnswer(options: OldSkywayAnswerOptions): OldSkywayAnswerConnection {
  const { apiKey, localPeerId, onOpen, onData } = options;
  if (typeof Peer === "undefined") {
    throw new Error("SkyWay old SDK (Peer) is not loaded");
  }
  if (!apiKey) throw new Error("SkyWay API key is required");

  const peer = new Peer(localPeerId || undefined, { key: apiKey, debug: 2 });
  let dataConnection: any = null;
  let mediaConnection: any = null;
  let localStream: MediaStream | null = null;

  const dataChannel: RTCDataChannelLike = {
    readyState: "connecting",
    onopen: null,
    onmessage: null,
    send: (data: any) => {
      if (dataConnection && dataConnection.open) {
        dataConnection.send(typeof data === "string" ? data : JSON.stringify(data));
      }
    },
    close: () => {
      try {
        dataConnection && dataConnection.close && dataConnection.close(true);
      } catch (_) {
        /* ignore */
      }
    },
  };

  peer.on("open", (id: string) => {
    onOpen && onOpen(id);
  });

  peer.on("connection", (dc: any) => {
    dataConnection = dc;
    dataChannel.readyState = dc.open ? "open" : "connecting";
    dc.once("open", () => {
      dataChannel.readyState = "open";
      dataChannel.onopen && dataChannel.onopen();
    });
    dc.on("data", (msg: unknown) => {
      dataChannel.onmessage && dataChannel.onmessage({ data: msg });
      onData && onData(msg);
    });
    dc.on("close", () => {
      dataChannel.readyState = "closed";
    });
  });

  peer.on("call", (mc: any) => {
    mediaConnection = mc;
    try {
      mc.answer(localStream || null, {});
    } catch (e) {
      console.error("OldSkyWay Answer: failed to answer media call", e);
    }
  });

  function setLocalStream(stream: MediaStream | null) {
    localStream = stream;
    // If already answered, try to replace tracks
    try {
      if (mediaConnection && mediaConnection.pc && stream) {
        const pc: RTCPeerConnection | undefined = mediaConnection.pc;
        const senders = pc?.getSenders ? pc.getSenders() : [];
        stream.getTracks().forEach((track) => {
          const sender = senders?.find((s) => s.track?.kind === track.kind);
          if (sender && sender.replaceTrack) {
            sender.replaceTrack(track);
          }
        });
      }
    } catch {
      /* ignore */
    }
  }

  function close() {
    try {
      mediaConnection && mediaConnection.close && mediaConnection.close(true);
    } catch (_) {
      /* ignore */
    }
    try {
      dataConnection && dataConnection.close && dataConnection.close(true);
    } catch (_) {
      /* ignore */
    }
    try {
      peer && peer.destroy && peer.destroy();
    } catch (_) {
      /* ignore */
    }
    dataChannel.readyState = "closed";
  }

  return { peerId: null, dataChannel, setLocalStream, close };
}

export type { RTCDataChannelLike };
