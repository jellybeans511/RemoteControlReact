//This repository is develoveped for virtual tractor project.

import {
  prioritizeSelectedVideoCodec,
  setVideoQuality,
  filterSdpByOptions,
  getSdpFilterOptionsFromUi,
  getUseIceServersFromUi,
} from "./webrtcFunction.js";
import {
  onGamepadConnected,
  onGamepadDisconnected,
  getOrderedGamepads,
} from "./gamepad.js";
import {
  gamepadToAutorunInfo,
  drawGamepadInfo,
  farminGamepadToAutorunInfo,
} from "./gamePadFunction.js";
import startCanvasRendering from "./drawCanvas.js";
import { makeSteeringCompensator } from "./makeSteeringCompensator.js";
import { createOfferInferenceController } from "./inference.js";
import { startOldSkywayConnection } from "./adapters/oldSkywayOfferAdapter.js";

// ???Es [s]
const COMP_TS = 0.1;

const compFunc = makeSteeringCompensator();

// ????E?E0Hz?g???K?p?????IEs?????Z?E?E?E
const COMP_TS_MS = Math.round(COMP_TS * 1000);
let lastCompMs = 0;
let lastCompedSteer = 0;
// ????L??/??????UI?`?F?`E???{?b?N?X?????擾?i?f?t?H???`E ?????E?E
const compCheckbox = document.getElementById("enable-compensation");
let isCompensationEnabled = !!(compCheckbox && compCheckbox.checked);
if (compCheckbox) {
  compCheckbox.addEventListener("change", () => {
    isCompensationEnabled = compCheckbox.checked;
    lastCompMs = 0; // ?E?????????????Z?`E??
  });
}

const gamepadToAutorunInfoCon = gamepadToAutorunInfo();
const farminGamepadToAutorunInfoCon = farminGamepadToAutorunInfo();
let signalingWebSocket = null;
const virtualWebSocket = new WebSocket("ws://localhost:9090");
let lastVirtualWarnAt = 0; // to avoid spamming logs when WS is not open
let peerConnection;
let movieChannel;
let dataChannel;
const videoElement = document.getElementById("remote-video");
const canvasElement = document.getElementById("video-canvas");
const canvasSonoki = document.getElementById("video-canvas-sonoki");
const video = document.getElementById("remote-video");
const offerInference = createOfferInferenceController({
  videoElement,
  getDataChannel: () => dataChannel,
});

// --- Network status helpers ---
function setStatus(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function inspectIceCandidate(candidateStr) {
  if (!candidateStr) return;
  if (candidateStr.includes(" typ relay")) {
    setStatus("turn-status", "Enabled");
  }
  if (candidateStr.includes(" typ srflx")) {
    setStatus("stun-status", "Connected");
  }
}

// --- Multi-monitor helpers (peer ids + popup spawner) ---
const qs = new URLSearchParams(window.location.search);
const defaultOfferPeerId =
  qs.get("offerId") ||
  qs.get("offer") ||
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? `offer-${crypto.randomUUID().slice(0, 8)}`
    : `offer-${Math.random().toString(16).slice(2, 6)}`);
const defaultTargetPeerId = qs.get("targetId") || qs.get("target") || "";

const getInputValue = (id, fallback) => {
  const el = document.getElementById(id);
  const v = el && typeof el.value === "string" ? el.value.trim() : "";
  return v || fallback || "";
};

const initMultiInputs = () => {
  const offerInput = document.getElementById("offer-peer-id");
  const targetInput = document.getElementById("target-peer-id");
  if (offerInput && !offerInput.value) offerInput.value = defaultOfferPeerId;
  if (targetInput && !targetInput.value && defaultTargetPeerId) {
    targetInput.value = defaultTargetPeerId;
  }
};

const getOfferPeerId = () => getInputValue("offer-peer-id", defaultOfferPeerId);
const getTargetPeerId = () => getInputValue("target-peer-id", defaultTargetPeerId);

const isMultiMode = () => !!getOfferPeerId();

const sendRegisterOffer = () => {
  if (!signalingWebSocket || signalingWebSocket.readyState !== WebSocket.OPEN) return;
  if (isMultiMode()) {
    signalingWebSocket.send(
      JSON.stringify({
        type: "register",
        payload: { role: "offer", peerId: getOfferPeerId() },
      })
    );
  } else {
    signalingWebSocket.send(
      JSON.stringify({ type: "register-offer", payload: { id: "offer" } })
    );
  }
};

const sendSignalMessage = ({ kind, sdp, candidate }) => {
  if (!signalingWebSocket || signalingWebSocket.readyState !== WebSocket.OPEN) return;
  if (isMultiMode()) {
    const targetPeerId = getTargetPeerId();
    if (!targetPeerId) {
      console.warn("targetPeerId is required in multi mode");
      return;
    }
    signalingWebSocket.send(
      JSON.stringify({
        type: "signal",
        payload: {
          from: { role: "offer", peerId: getOfferPeerId() },
          to: { role: "answer", peerId: targetPeerId },
          data: { kind, sdp, candidate },
        },
      })
    );
  } else {
    // legacy
    const legacyType = kind === "offer" ? "offer" : kind === "answer" ? "answer" : kind === "ice" ? "ice-offer" : kind;
    signalingWebSocket.send(JSON.stringify({ type: legacyType, payload: kind === "ice" ? { candidate } : { sdp } }));
  }
};

const attachPopupSpawner = () => {
  const btn = document.getElementById("spawn-monitor-window");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const url = new URL(window.location.href);
    // 新規ウインドウでは接続方式・peerId を改めて入力してもらうためパラメータをクリア
    url.search = "";
    window.open(url.toString(), "_blank", "width=1280,height=900");
  });
};

const connectSignalingFromUi = () => {
  const urlInput = document.getElementById("signaling-url");
  const url = urlInput?.value?.trim() || "ws://localhost:8080";
  try {
    if (signalingWebSocket) {
      try {
        signalingWebSocket.close();
      } catch (_) {}
      signalingWebSocket = null;
    }
    signalingWebSocket = new WebSocket(url);
    attachSignalingHandlers(signalingWebSocket);
    setStatus("signaling-status", "Connecting...");
  } catch (e) {
    console.error("Failed to connect signaling", e);
    setStatus("signaling-status", "Error");
  }
};

// Old SkyWay Peer (offer-side) created via UI button; reused for call
let oldSkywayPeer = null;
let oldSkywayConn = null; // holds last connection object from adapter
let oldSkywaySendTimer = null; // interval id sending inputAutorunInfo

const inputAutorunInfo = {
  type: "inputAutorunInfo",
  inputSteer: 0,
  inputEngineCycle: 0,
  inputGear: 1,
  inputShuttle: 0,
  inputSpeed: 3,
  inputPtoHeight: 100,
  inputPtoOn: 0,
  inputHorn: 0,
  isRemoteCont: 0,
  isAutoRunStart: 0,
  isUseSafetySensorInTeleDrive: 0,
};

const outputAutorunInfo = {
  type: "outputAutorunInfo",
  lat: 0,
  lon: 0,
  gnssQuality: 0,
  gnssSpeed: 0,
  heading: 0,
  headingError: 0,
  lateralError: 0,
  steerAngle: 0,
  realSteerAngle: 0,
  stopStatus: 0,
};

const statsInfo = {
  videoRTT: 0,
  videoBitrate: 0,
  videoFrameRate: 0,
  videoFrameWidth: 0,
  videoFrameHeight: 0,
  networkRTT: 0,
  encodeDelay: 0,
  decodeDelay: 0,
  jitterBufferDelay: 0,
};

const virtualInputInfo = {
  outputLat: 0,
  outputLon: 0,
  outputHeading: 0,
  outputVelocity: 0,
  outputCalcAutoSteer: 0,
  outputSteer: 0,
  inputVelocity: 0,
  inputSteering: 0,
  inputShuttle: 0,
  inputRemoteCont: 0,
  start: false,
};

const delayLogs = []; // ??E?????O?p?z?E
let controllerType = "hori"; // ?R???g???[???[?????i?f?t?H???`E Hori Farming Gamepad?E?E
let rafStarted = false;

function ensureAutorunLoop() {
  if (!rafStarted) {
    rafStarted = true;
    requestAnimationFrame(updateAutorunLoop);
  }
}

// Controller status line updater (1-line)
function refreshControllerInfo(gamepads) {
  const infoEl = document.getElementById("controller-info");
  if (!infoEl) return;
  const list = Array.from(gamepads || []).filter(Boolean);
  if (list.length === 0) {
    infoEl.textContent = "Controller: Disconnected";
    return;
  }
  // Prefer the controller actually used in current mode
  let usedId = "Unknown";
  try {
    if (controllerType === "g29") {
      usedId = list[0]?.id || "Unknown";
    } else {
      const ordered = getOrderedGamepads(gamepads);
      const first = ordered && ordered.find((g) => !!g);
      usedId = first?.id || list[0]?.id || "Unknown";
    }
  } catch (_) {
    usedId = list[0]?.id || "Unknown";
  }
  infoEl.textContent = `Controller: Connected ?E${usedId}`;
}

// --- UI: add RawSteer row under SetSteer (created from JS) ---
function ensureRawSteerRow() {
  if (document.getElementById("set-steer-raw")) return;
  const compSpan = document.getElementById("set-steer");
  if (!compSpan) return; // base row not ready yet
  const th = compSpan.closest("th");
  const tr = th ? th.parentElement : null;
  const table = tr ? tr.parentElement : null;
  if (!table) return;

  const newTr = document.createElement("tr");
  const newTh = document.createElement("th");
  newTh.innerHTML = 'RawSteer:<span id="set-steer-raw"></span>deg';
  newTr.appendChild(newTh);

  // insert after SetSteer row
  if (tr.nextSibling) {
    table.insertBefore(newTr, tr.nextSibling);
  } else {
    table.appendChild(newTr);
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(text);
}

initMultiInputs();
attachPopupSpawner();

window.addEventListener("gamepadconnected", (event) => {
  onGamepadConnected(event);
  ensureAutorunLoop();
  refreshControllerInfo(navigator.getGamepads());
});
window.addEventListener("gamepaddisconnected", onGamepadDisconnected);
window.addEventListener("gamepaddisconnected", () => {
  refreshControllerInfo(navigator.getGamepads());
});

function updateAutorunLoop(ts) {
  const gamepads = navigator.getGamepads();
  refreshControllerInfo(gamepads);

  controllerType === "g29"
    ? (() => {
        const list = Array.from(gamepads || []).filter(Boolean);
        const usingGamepad = list[0];
        if (!usingGamepad) return; // no g29-like controller found
        try {
          ensureRawSteerRow();
          gamepadToAutorunInfoCon(inputAutorunInfo, usingGamepad);
          const rawSteer = inputAutorunInfo.inputSteer;
          // g29?n?????????`E???`E????]???K?p
          const now = typeof ts === "number" ? ts : performance.now();
          if (lastCompMs === 0) {
            lastCompedSteer = compFunc(rawSteer);
            lastCompMs = now;
          } else {
            const elapsed = now - lastCompMs;
            if (elapsed >= COMP_TS_MS) {
              const ticks = Math.floor(elapsed / COMP_TS_MS);
              for (let i = 0; i < ticks; i++) {
                lastCompedSteer = compFunc(rawSteer);
              }
              lastCompMs += ticks * COMP_TS_MS;
            }
          }
          const compSteerInt = Math.trunc(lastCompedSteer);
          inputAutorunInfo.inputSteer = compSteerInt; // ZOH, tractor expects integer
          if (!isCompensationEnabled) {
            inputAutorunInfo.inputSteer = Math.trunc(rawSteer);
          }
          inputAutorunInfo.inputSteerRaw = rawSteer;
          setText("set-steer-raw", Math.trunc(rawSteer));
          //console.log(`[Steer] raw=${rawSteer}, comp=${compSteerInt}`);
          drawGamepadInfo(inputAutorunInfo);
        } catch (e) {
          // protect loop from dying on unexpected mapping errors
          // console.warn('g29 mapping error:', e);
        }
      })()
    : (() => {
        // hori?n?E??n???h??+?p?l????2???O???E?E
        const usingGamepads = getOrderedGamepads(gamepads);
        if (!usingGamepads[0] || !usingGamepads[1]) return; // both required
        try {
          ensureRawSteerRow();
          farminGamepadToAutorunInfoCon(inputAutorunInfo, usingGamepads); // inputSteer?X?V
          const rawSteer = inputAutorunInfo.inputSteer;
          const now = typeof ts === "number" ? ts : performance.now();
          if (lastCompMs === 0) {
            lastCompedSteer = compFunc(rawSteer);
            lastCompMs = now;
          } else {
            const elapsed = now - lastCompMs;
            if (elapsed >= COMP_TS_MS) {
              const ticks = Math.floor(elapsed / COMP_TS_MS);
              for (let i = 0; i < ticks; i++) {
                // ???\?l?????????E inputSteer ???g?p?E????E????????E?????o?`E???@??????????E?E
                lastCompedSteer = compFunc(rawSteer);
              }
              // now????E?????A?e?B?`E??????????i???
              lastCompMs += ticks * COMP_TS_MS;
            }
          }
          // ZOH: ?????E?l?????
          const compSteerInt = Math.trunc(lastCompedSteer);
          inputAutorunInfo.inputSteer = compSteerInt;
          if (!isCompensationEnabled) {
            inputAutorunInfo.inputSteer = Math.trunc(rawSteer);
          }
          inputAutorunInfo.inputSteerRaw = rawSteer;
          setText("set-steer-raw", Math.trunc(rawSteer));
          console.log(`[Steer] raw=${rawSteer}, comp=${compSteerInt}`);
          drawGamepadInfo(inputAutorunInfo);
          console.log(inputAutorunInfo);
        } catch (e) {
          // console.warn('hori mapping error:', e);
        }
      })();
  console.log(inputAutorunInfo);
  requestAnimationFrame(updateAutorunLoop);
}

const attachSignalingHandlers = (socket) => {
  if (!socket) return;
  socket.onmessage = async (event) => {
    const { type, payload } = JSON.parse(event.data);

    const handleAnswerSdp = async (sdp) => {
      const options = getSdpFilterOptionsFromUi();
      const filteredSdp = filterSdpByOptions(sdp, options);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: filteredSdp })
      );
      try {
        const { scanBannedSdpTokens } = await import("./webrtcFunction.js");
        const hits = scanBannedSdpTokens(
          peerConnection.remoteDescription?.sdp || "",
          options
        );
        if (hits.length > 0) {
          console.warn(
            "Banned SDP lines present after setRemoteDescription (offer side)",
            hits
          );
        }
      } catch (_) {}
    };

    const handleIce = async (candidate) => {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    if (type === "signal") {
      const { data, to } = payload || {};
      if (isMultiMode() && to && to.peerId && to.peerId !== getOfferPeerId()) {
        return; // not for me
      }
      if (data?.kind === "answer" && data.sdp) {
        await handleAnswerSdp(data.sdp);
      } else if (data?.kind === "ice" && data.candidate) {
        await handleIce(data.candidate);
      }
      return;
    }

    if (type === "answer") {
      await handleAnswerSdp(payload.sdp);
    } else if (type === "ice" || type === "ice-answer") {
      await handleIce(payload.candidate);
    }
  };

  socket.onopen = () => {
    initMultiInputs();
    sendRegisterOffer();
    setStatus("signaling-status", "Connected");
  };
  socket.onerror = () => setStatus("signaling-status", "Error");
  socket.onclose = () => setStatus("signaling-status", "Disconnected");
};

virtualWebSocket.onopen = () => {
  virtualWebSocket.send(
    JSON.stringify({
      type: "from-offer-init",
      payload: inputAutorunInfo,
    })
  );
};

async function startConnectionPure() {
  if (!signalingWebSocket || signalingWebSocket.readyState !== WebSocket.OPEN) {
    alert("Signaling serverに接続してください（Connect ボタン）");
    return;
  }
  const useIce = getUseIceServersFromUi();
  peerConnection = new RTCPeerConnection(
    useIce ? { iceServers: [{ urls: "stun:10.100.0.35:3478" }] } : {}
  );
  console.log("PeerConnection is created!");

  // Reset STUN/TURN visual state on new connection
  if (useIce) {
    setStatus("stun-status", "Waiting...");
    setStatus("turn-status", "Waiting...");
  } else {
    setStatus("stun-status", "Disabled");
    setStatus("turn-status", "Disabled");
  }

  movieChannel = peerConnection.addTransceiver("video", {
    direction: "recvonly",
  });

  dataChannel = peerConnection.createDataChannel("chat");
  dataChannel.onopen = () => {
    console.log("DataChannel is open");
    setInterval(() => {
      dataChannel.send(JSON.stringify(inputAutorunInfo));
      console.log(`Send Gamepad Info: ${inputAutorunInfo}`);
    }, 33);
  };
  dataChannel.onmessage = (event) => {
    console.log("Message from Answer:", event.data);
    const fromAnswerWebRtcData = JSON.parse(event.data);
    console.log("Received data from Answer:", fromAnswerWebRtcData);
    if (fromAnswerWebRtcData.type === "outputAutorunInfo") {
      //console.log("Received outputAutorunInfo is Coming!!!!!!!!!!");
      outputAutorunInfo.lat = fromAnswerWebRtcData.payload.lat;
      outputAutorunInfo.lon = fromAnswerWebRtcData.payload.lon;
      outputAutorunInfo.gnssQuality = fromAnswerWebRtcData.payload.gnssQuality;
      outputAutorunInfo.gnssSpeed = fromAnswerWebRtcData.payload.gnssSpeed;
      outputAutorunInfo.heading = fromAnswerWebRtcData.payload.heading;
      outputAutorunInfo.headingError =
        fromAnswerWebRtcData.payload.headingError;
      outputAutorunInfo.lateralError =
        fromAnswerWebRtcData.payload.lateralError;
      outputAutorunInfo.steerAngle = fromAnswerWebRtcData.payload.steerAngle;
      outputAutorunInfo.realSteerAngle =
        fromAnswerWebRtcData.payload.realSteerAngle;
      outputAutorunInfo.stopStatus = fromAnswerWebRtcData.payload.stopStatus;
      console.log("Received Info is renewed");
    } else if (fromAnswerWebRtcData.type === "inferenceResults") {
      console.log(
        "Received inference results from answer side:",
        fromAnswerWebRtcData.payload
      );
    }
  };

  const remoteStream = new MediaStream();
  peerConnection.ontrack = (event) => {
    console.log("Track received:", event.track);
    remoteStream.addTrack(event.track);
    console.log("Remote video element:", videoElement);
    videoElement.srcObject = remoteStream;

    // Initialize unified inference pipeline when remote video is ready
    prepareVideoInference();
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("Generated ICE Candidate (Offer):", event.candidate);
      inspectIceCandidate(event.candidate.candidate || "");
      sendSignalMessage({ kind: "ice", candidate: event.candidate });
    } else {
      console.log("All ICE candidates sent (Offer).");
    }
  };

  const offer = await peerConnection.createOffer();
  console.log("Generated SDP Offer:", offer.sdp);
  offer.sdp = prioritizeSelectedVideoCodec(offer.sdp);
  console.log("Prioritized SDP Offer:", offer.sdp);

  // Read SDP filtering options from checkboxes (default: do not remove)
  const options = getSdpFilterOptionsFromUi();

  const beforeLen = offer.sdp.length;
  offer.sdp = filterSdpByOptions(offer.sdp, options);
  console.log(
    `Filtered SDP Offer (len ${beforeLen} -> ${offer.sdp.length}) with options:`,
    options
  );

  await peerConnection.setLocalDescription(offer);
  // Verify post-setLocalDescription SDP actually excludes banned lines
  try {
    const { scanBannedSdpTokens } = await import("./webrtcFunction.js");
    const hits = scanBannedSdpTokens(
      peerConnection.localDescription?.sdp || "",
      options
    );
    if (hits.length > 0) {
      console.warn(
        "Banned SDP lines still present after setLocalDescription (offer side)",
        hits
      );
    }
  } catch (_) {}
  sendSignalMessage({ kind: "offer", sdp: offer.sdp });
}

function getSelectedEngine() {
  const els = document.querySelectorAll('input[name="webrtc-engine"]');
  for (const el of els) {
    if (el.checked) return el.value;
  }
  return "pure";
}

function prepareVideoInference() {
  videoElement.addEventListener(
    "loadeddata",
    () => {
      offerInference
        .start()
        .then(() =>
          console.log("Started ONNX inference (pipeline) on offer side")
        )
        .catch((e) => console.error("Inference init failed (offer)", e));

      const inferenceOnRadio = document.getElementById("inference-on");
      const inferenceOffRadio = document.getElementById("inference-off");

      inferenceOnRadio?.addEventListener("change", () => {
        if (inferenceOnRadio.checked) {
          offerInference.setEnabled(true);
          console.log("Offer side inference enabled");
        }
      });
      inferenceOffRadio?.addEventListener("change", () => {
        if (inferenceOffRadio.checked) {
          offerInference.setEnabled(false);
          console.log("Offer side inference disabled");
        }
      });
    },
    { once: true }
  );
}

async function startConnectionOldSkyWay() {
  const apiKey = document.getElementById("skyway-old-api-key")?.value?.trim();
  const remoteId = document
    .getElementById("skyway-old-remote-id")
    ?.value?.trim();
  if (!apiKey || !remoteId) {
    alert("Please input SkyWay API Key and Remote ID.");
    return;
  }

  try {
    // If previous connection exists, close it first
    try {
      oldSkywayConn?.close?.();
    } catch (_) {}
    oldSkywayConn = null;
    if (oldSkywaySendTimer) {
      clearInterval(oldSkywaySendTimer);
      oldSkywaySendTimer = null;
    }

    const conn = await startOldSkywayConnection({
      apiKey,
      remotePeerId: remoteId,
      onStream: (stream) => {
        const remoteStream = new MediaStream();
        stream.getTracks().forEach((t) => remoteStream.addTrack(t));
        videoElement.srcObject = remoteStream;
        prepareVideoInference();
      },
      onOpen: () => {
        console.log("Old SkyWay data connection open");
        oldSkywaySendTimer = setInterval(() => {
          try {
            if (dataChannel?.readyState === "open") {
              dataChannel.send(JSON.stringify(inputAutorunInfo));
            }
          } catch (_) {}
        }, 33);
      },
      peer: oldSkywayPeer || undefined,
    });
    // Use adapter-provided dataChannel facade
    dataChannel = conn.dataChannel;
    oldSkywayConn = conn;
    // Optional: log when the data channel opens
    dataChannel.onopen = () => {
      try {
        console.log("[OldSkyWay Offer] DataChannel open");
      } catch (_) {}
    };
    dataChannel.onmessage = (event) => {
      try {
        console.log("[OldSkyWay Offer] Received raw:", event?.data);
        const fromAnswerWebRtcData =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        console.log(
          "[OldSkyWay Offer] Message type:",
          fromAnswerWebRtcData?.type || typeof fromAnswerWebRtcData
        );
        if (fromAnswerWebRtcData.type === "outputAutorunInfo") {
          outputAutorunInfo.lat = fromAnswerWebRtcData.payload.lat;
          outputAutorunInfo.lon = fromAnswerWebRtcData.payload.lon;
          outputAutorunInfo.gnssQuality =
            fromAnswerWebRtcData.payload.gnssQuality;
          outputAutorunInfo.gnssSpeed = fromAnswerWebRtcData.payload.gnssSpeed;
          outputAutorunInfo.heading = fromAnswerWebRtcData.payload.heading;
          outputAutorunInfo.headingError =
            fromAnswerWebRtcData.payload.headingError;
          outputAutorunInfo.lateralError =
            fromAnswerWebRtcData.payload.lateralError;
          outputAutorunInfo.steerAngle =
            fromAnswerWebRtcData.payload.steerAngle;
          outputAutorunInfo.realSteerAngle =
            fromAnswerWebRtcData.payload.realSteerAngle;
          outputAutorunInfo.stopStatus =
            fromAnswerWebRtcData.payload.stopStatus;
          console.log(
            "[OldSkyWay Offer] outputAutorunInfo:",
            fromAnswerWebRtcData.payload
          );
        } else if (fromAnswerWebRtcData.type === "inferenceResults") {
          console.log(
            "[OldSkyWay Offer] inferenceResults:",
            fromAnswerWebRtcData.payload
          );
        } else {
          console.log(
            "[OldSkyWay Offer] Unhandled message:",
            fromAnswerWebRtcData
          );
        }
      } catch (e) {
        console.warn("Old SkyWay data parse error", e);
      }
    };
  } catch (e) {
    console.error("Old SkyWay connection failed", e);
    alert("Old SkyWay connection failed: " + (e?.message || e));
  }
}

// --- Old SkyWay: Create/Destroy Peer (Offer side) ---
function setupOldSkywayOfferButtons() {
  const createBtn = document.getElementById("skyway-offer-create-id");
  const destroyBtn = document.getElementById("skyway-offer-destroy-id");
  const callBtn = document.getElementById("skyway-offer-call");
  const hangupBtn = document.getElementById("skyway-offer-hangup");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      const mode = getSelectedEngine();
      if (mode !== "oldskyway") {
        alert("Select Old SkyWay mode first.");
        return;
      }
      if (oldSkywayPeer) {
        alert("Peer already created. ID: " + (oldSkywayPeer.id || "(opening)"));
        return;
      }
      const apiKey = document
        .getElementById("skyway-old-api-key")
        ?.value?.trim();
      if (!apiKey) {
        alert("Enter SkyWay API Key.");
        return;
      }
      try {
        oldSkywayPeer = new Peer({ key: apiKey, debug: 2 });
        const idSpan = document.getElementById("skyway-my-id-offer");
        oldSkywayPeer.once("open", (id) => {
          if (idSpan) idSpan.textContent = id;
        });
        oldSkywayPeer.on("error", (e) => {
          console.error("SkyWay peer error (offer):", e);
          alert("Peer error: " + (e?.message || e));
        });
      } catch (e) {
        console.error("Failed to create SkyWay peer (offer)", e);
        alert("Peer creation failed: " + (e?.message || e));
        oldSkywayPeer = null;
      }
    });
  }
  if (destroyBtn) {
    destroyBtn.addEventListener("click", () => {
      try {
        oldSkywayConn?.close?.();
      } catch (_) {}
      oldSkywayConn = null;
      if (oldSkywaySendTimer) {
        clearInterval(oldSkywaySendTimer);
        oldSkywaySendTimer = null;
      }
      try {
        oldSkywayPeer?.destroy?.();
      } catch (_) {}
      oldSkywayPeer = null;
      const idSpan = document.getElementById("skyway-my-id-offer");
      if (idSpan) idSpan.textContent = "(waiting)";
    });
  }
  if (callBtn) {
    callBtn.addEventListener("click", async () => {
      const mode = getSelectedEngine();
      if (mode !== "oldskyway") {
        alert("Select Old SkyWay mode first.");
        return;
      }
      await startConnectionOldSkyWay();
    });
  }
  if (hangupBtn) {
    hangupBtn.addEventListener("click", () => {
      try {
        oldSkywayConn?.close?.();
      } catch (_) {}
      oldSkywayConn = null;
      if (oldSkywaySendTimer) {
        clearInterval(oldSkywaySendTimer);
        oldSkywaySendTimer = null;
      }
    });
  }
}

function setupEngineModeCleanup() {
  const radios = document.querySelectorAll('input[name="webrtc-engine"]');
  radios.forEach((r) => {
    r.addEventListener("change", () => {
      if (getSelectedEngine() !== "oldskyway") {
        // Tear down Old SkyWay peer when leaving mode
        try {
          oldSkywayPeer?.destroy?.();
        } catch (_) {}
        oldSkywayPeer = null;
        const idSpan = document.getElementById("skyway-my-id-offer");
        if (idSpan) idSpan.textContent = "(waiting)";
      }
    });
  });
}

function updateEngineSections() {
  const mode = getSelectedEngine();
  document.querySelectorAll("[data-engine-section]").forEach((el) => {
    const target = el.getAttribute("data-engine-section");
    el.style.display = target === mode ? "" : "none";
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupOldSkywayOfferButtons();
  setupEngineModeCleanup();
  updateEngineSections();
  document
    .querySelectorAll('input[name="webrtc-engine"]')
    .forEach((r) => r.addEventListener("change", updateEngineSections));
  const connectBtn = document.getElementById("signaling-connect");
  connectBtn?.addEventListener("click", connectSignalingFromUi);
});

document
  .getElementById("send-sdp-by-ws")
  .addEventListener("click", async () => {
    const mode = getSelectedEngine();
    if (mode === "pure") {
      await startConnectionPure();
    } else if (mode === "oldskyway") {
      await startConnectionOldSkyWay();
    } else {
      alert("New SkyWay mode is a stub (not implemented yet)");
    }
  });

// Collect both summarized delay logs and full raw stats
const fullStatsLogs = [];

setInterval(async function debugRTCStats() {
  if (!peerConnection) return;
  const stats = await peerConnection.getStats();

  let logRow = {
    timestamp: new Date().toISOString(),
    roundTripTime: null,
    jitter: null,
    packetsLost: null,
    jitterBufferDelay: null,
    jitterBufferEmittedCount: null,
    avgJitterBufferDelay_ms: null,
    encodeDelay: null,
    decodeDelay: null,
  };

  stats.forEach((report) => {
    if (report.type === "candidate-pair" && report.state === "succeeded") {
      logRow.roundTripTime =
        report.currentRoundTripTime ?? report.roundTripTime;
    }
    if (report.type === "inbound-rtp" && !report.isRemote) {
      logRow.jitter = report.jitter;
      logRow.packetsLost = report.packetsLost;
      logRow.jitterBufferDelay = report.jitterBufferDelay ?? null;
      logRow.jitterBufferEmittedCount = report.jitterBufferEmittedCount ?? null;

      if (
        logRow.jitterBufferDelay !== null &&
        logRow.jitterBufferEmittedCount > 0
      ) {
        logRow.avgJitterBufferDelay_ms = (
          (logRow.jitterBufferDelay / logRow.jitterBufferEmittedCount) *
          1000
        ).toFixed(3);
      }
    }
    if (
      report.type === "outbound-rtp" &&
      report.totalEncodeTime !== undefined &&
      report.framesEncoded > 0
    ) {
      logRow.encodeDelay = (
        report.totalEncodeTime / report.framesEncoded
      ).toFixed(6);
    }
    if (
      report.type === "track" &&
      report.totalDecodeTime !== undefined &&
      report.framesDecoded > 0
    ) {
      logRow.decodeDelay = (
        report.totalDecodeTime / report.framesDecoded
      ).toFixed(6);
    }
  });

  // summarized row
  delayLogs.push(logRow);

  // full snapshot (all reports, all fields)
  const snapshotTime = new Date().toISOString();
  const reports = [];
  stats.forEach((report) => {
    const flat = {
      snapshotTime,
      id: report.id,
      type: report.type,
      timestamp: report.timestamp,
    };
    Object.keys(report).forEach((k) => {
      if (k === "id" || k === "type" || k === "timestamp") return;
      try {
        const v = report[k];
        flat[k] =
          typeof v === "object" && v !== null
            ? JSON.parse(JSON.stringify(v))
            : v;
      } catch (_) {
        flat[k] = String(report[k]);
      }
    });
    reports.push(flat);
  });
  fullStatsLogs.push(...reports);
  //console.log("Logged Delay Info:", logRow);
}, 1000);

function saveDelayLogsAsCSV() {
  if (delayLogs.length === 0) return;

  const headers = [
    "timestamp",
    "roundTripTime",
    "jitter",
    "packetsLost",
    "jitterBufferDelay",
    "jitterBufferEmittedCount",
    "avgJitterBufferDelay_ms",
    "encodeDelay",
    "decodeDelay",
  ];

  const csvContent = [
    headers.join(","),
    ...delayLogs.map((log) => headers.map((h) => log[h] ?? "").join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  a.download = `webrtc_delay_log_${timestamp}.csv`;

  a.click();
  URL.revokeObjectURL(url);
}

document
  .getElementById("save-delay-log")
  .addEventListener("click", saveDelayLogsAsCSV);

function saveAllStatsAsCSV() {
  if (fullStatsLogs.length === 0) return;

  const preferred = ["snapshotTime", "id", "type", "timestamp"];
  const escape = (v) => {
    if (v === undefined || v === null) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (s.includes(",") || s.includes("\n") || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const groups = new Map();
  for (const r of fullStatsLogs) {
    const t = r.type || "unknown";
    if (!groups.has(t)) groups.set(t, []);
    groups.get(t).push(r);
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");

  groups.forEach((rowsArr, type) => {
    const keySet = new Set(preferred);
    rowsArr.forEach((row) => Object.keys(row).forEach((k) => keySet.add(k)));
    const headers = Array.from(keySet);
    headers.sort((a, b) => {
      const ia = preferred.indexOf(a);
      const ib = preferred.indexOf(b);
      if (ia !== -1 || ib !== -1)
        return (ia === -1 ? 1 : ia) - (ib === -1 ? 1 : ib);
      return a.localeCompare(b);
    });

    const lines = [headers.join(",")];
    rowsArr.forEach((row) => {
      lines.push(headers.map((h) => escape(row[h])).join(","));
    });

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webrtc_full_stats_${type}_${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

const saveFullBtn = document.getElementById("save-full-stats");
if (saveFullBtn) {
  saveFullBtn.addEventListener("click", saveAllStatsAsCSV);
}

document
  .getElementById("set-video-quality")
  .addEventListener("click", async () => {
    setVideoQuality(dataChannel);
  });

setInterval(() => {
  virtualInputInfo.inputSteering = inputAutorunInfo.inputSteer;
  virtualInputInfo.inputVelocity = inputAutorunInfo.inputSpeed;
  virtualInputInfo.inputShuttle = inputAutorunInfo.inputShuttle;
  virtualInputInfo.inputRemoteCont = inputAutorunInfo.isRemoteCont;
  //console.log("Output Autorun Info", outputAutorunInfo);
  virtualInputInfo.outputLat = outputAutorunInfo.lat;
  virtualInputInfo.outputLon = outputAutorunInfo.lon;
  virtualInputInfo.outputHeading = outputAutorunInfo.heading;
  virtualInputInfo.outputCalcAutoSteer = outputAutorunInfo.steerAngle;
  virtualInputInfo.outputSteer = outputAutorunInfo.realSteerAngle;
  virtualInputInfo.outputVelocity = outputAutorunInfo.gnssSpeed;
  virtualInputInfo.start = true;
  // virtualInputInfo.inputVelocity > 0 &&
  // virtualInputInfo.inputShuttle == 1 &&
  // virtualInputInfo.inputRemoteCont == true
  //   ? true
  //   : false;
  if (virtualWebSocket && virtualWebSocket.readyState === WebSocket.OPEN) {
    try {
      virtualWebSocket.send(
        JSON.stringify({
          type: "to-virtual-inputdata",
          payload: { virtualInputInfo },
        })
      );
    } catch (e) {
      const now = Date.now();
      if (now - lastVirtualWarnAt > 2000) {
        console.warn("virtualWebSocket send failed:", e?.message || e);
        lastVirtualWarnAt = now;
      }
    }
  } else {
    const now = Date.now();
    if (now - lastVirtualWarnAt > 2000) {
      console.warn("virtualWebSocket not open; skip sending");
      lastVirtualWarnAt = now;
    }
  }
}, 33);

// Detection info object for video-canvas rendering
const detectionInfo = offerInference.getDetectionInfo();

startCanvasRendering(
  //canvasElement,
  canvasSonoki,
  videoElement,
  outputAutorunInfo,
  inputAutorunInfo,
  detectionInfo
);
// Controller selection listeners (set early, independent from video load)
(() => {
  const controllerHoriRadio = document.getElementById("controller-hori");
  const controllerG29Radio = document.getElementById("controller-g29");
  if (controllerHoriRadio && controllerG29Radio) {
    controllerHoriRadio.addEventListener("change", () => {
      if (controllerHoriRadio.checked) {
        controllerType = "hori";
        console.log("Controller changed to Hori Farming Gamepad");
      }
    });
    controllerG29Radio.addEventListener("change", () => {
      if (controllerG29Radio.checked) {
        controllerType = "g29";
        console.log("Controller changed to Logicool G29");
      }
    });
  }
  // Start loop regardless of connection; it will no-op without gamepads
  ensureAutorunLoop();
})();
