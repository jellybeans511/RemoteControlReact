import { ControlInfo } from "../types/telemetry";

type OldSkywayOfferOptions = {
  apiKey: string;
  remotePeerId?: string;
  localPeerId?: string;
  onStream?: (stream: MediaStream) => void;
  onData?: (data: unknown) => void;
  onOpen?: (peerId: string) => void;
};

export type OldSkywayOfferConnection = {
  peerId: string | null;
  dataChannel: RTCDataChannelLike | null;
  close: () => void;
};

type RTCDataChannelLike = {
  readyState: RTCDataChannelState;
  onopen: (() => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;
  send: (data: string | ControlInfo | any) => void;
  close?: () => void;
};

declare const Peer: any; // old SkyWay global

export async function startOldSkywayOffer(options: OldSkywayOfferOptions): Promise<OldSkywayOfferConnection> {
  const { apiKey, remotePeerId, localPeerId, onStream, onData, onOpen } = options;

  if (typeof Peer === "undefined") {
    throw new Error("SkyWay old SDK (Peer) is not loaded. Please include the SkyWay script.");
  }
  if (!apiKey) throw new Error("SkyWay API key is required");

  const peer = new Peer(localPeerId || undefined, { key: apiKey, debug: 2 });

  const dataChannel: RTCDataChannelLike = {
    readyState: "connecting",
    onopen: null,
    onmessage: null,
    send: (data) => {
      if (dc && dc.open) {
        dc.send(typeof data === "string" ? data : JSON.stringify(data));
      } else {
        console.warn("[OldSkyWay Offer] data connection not open yet");
      }
    },
    close: () => {
      try {
        dc && dc.close && dc.close(true);
      } catch (_) {
        /* ignore */
      }
    },
  };

  let mc: any = null; // MediaConnection
  let dc: any = null; // DataConnection

  await new Promise<void>((resolve, reject) => {
    peer.once("open", (id: string) => {
      if (onOpen) onOpen(id);
      if (!remotePeerId) {
        // No remote yet: just expose peer id
        resolve();
        return;
      }
      try {
        mc = peer.call(remotePeerId, null, {});
        if (mc) {
          mc.on("stream", (stream: MediaStream) => {
            onStream && onStream(stream);
          });
        }

        dc = peer.connect(remotePeerId);
        dc.once("open", () => {
          dataChannel.readyState = "open";
          dataChannel.onopen && dataChannel.onopen();
          resolve();
        });
        dc.on("data", (payload: unknown) => {
          dataChannel.onmessage && dataChannel.onmessage({ data: payload });
          onData && onData(payload);
        });
        dc.on("close", () => {
          dataChannel.readyState = "closed";
        });
        dc.on("error", (e: Error) => {
          console.error("[OldSkyWay Offer] DataConnection error", e);
        });
      } catch (e) {
        reject(e);
      }
    });
    peer.on("error", (e: Error) => reject(e));
  });

  const close = () => {
    try {
      mc && mc.close && mc.close(true);
    } catch (_) {
      /* ignore */
    }
    try {
      dc && dc.close && dc.close(true);
    } catch (_) {
      /* ignore */
    }
    try {
      peer && peer.destroy && peer.destroy();
    } catch (_) {
      /* ignore */
    }
    dataChannel.readyState = "closed";
  };

  return { peerId: peer.id || null, dataChannel, close };
}

export type { RTCDataChannelLike };
