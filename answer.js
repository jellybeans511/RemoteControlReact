import { createAnswerInferenceController } from "./inference.js";

import { createOldSkywayAnswerAdapter } from "./adapters/oldSkywayAnswerAdapter.js";

import {

  filterSdpByOptions,

  getSdpFilterOptionsFromUi,

  getUseIceServersFromUi,

} from "./webrtcFunction.js";



let signalingSocket = null;
const autorunSocket = new WebSocket("ws://127.0.0.1:8081");

let lastAutorunWarnAt = 0; // throttle autorun websocket warnings

let peerConnection;

let remoteDataChannel = null;

let count = 0;

let iceCandidateQueue = []; // ・ｽ・ｽ・ｽ・ｽ・ｽ[・ｽgSDP・ｽﾝ抵ｿｽO・ｽ・ｽICE・ｽ・ｽ・ｽ・ｽﾛ托ｿｽ・ｽ・ｽ・ｽ・ｽL・ｽ・ｽ・ｽ[

let stream = null;

const streamCaptureBtn = document.getElementById("stream-capture");

const cameraSelect = document.getElementById("camera-select");

const localVideoElement = document.getElementById("local-video");

const answerInference = createAnswerInferenceController({

  videoElement: localVideoElement,

  getDataChannel: () => remoteDataChannel,

});

function getSelectedEngine() {
  const els = document.querySelectorAll('input[name="webrtc-engine"]');
  for (const el of els) if (el.checked) return el.value;
  return "pure";
}
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

// --- Multi-answer helpers (peer idsのみ) ---
const qs = new URLSearchParams(window.location.search);
const defaultAnswerPeerId =
  qs.get("answerId") ||
  qs.get("answer") ||
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? `tractor-${crypto.randomUUID().slice(0, 8)}`
    : `tractor-${Math.random().toString(16).slice(2, 6)}`);

const getInputValue = (id, fallback) => {
  const el = document.getElementById(id);
  const v = el && typeof el.value === "string" ? el.value.trim() : "";
  return v || fallback || "";
};

const initMultiInputs = () => {
  const answerInput = document.getElementById("answer-peer-id");
  if (answerInput && !answerInput.value) answerInput.value = defaultAnswerPeerId;
};

const getAnswerPeerId = () => getInputValue("answer-peer-id", defaultAnswerPeerId);
const isMultiMode = () => !!getAnswerPeerId();
// Initialize peer id input early
initMultiInputs();

const connectSignalingFromUi = () => {
  const urlInput = document.getElementById("signaling-url");
  const url = urlInput?.value?.trim() || "ws://localhost:8080";
  try {
    if (signalingSocket) {
      try {
        signalingSocket.close();
      } catch (_) {}
      signalingSocket = null;
    }
    signalingSocket = new WebSocket(url);
    attachSignalingHandlers(signalingSocket);
    setStatus("signaling-status", "Connecting...");
  } catch (e) {
    console.error("Failed to connect signaling", e);
    setStatus("signaling-status", "Error");
  }
};

function updateEngineSections() {
  const mode = getSelectedEngine();
  document.querySelectorAll("[data-engine-section]").forEach((el) => {
    const target = el.getAttribute("data-engine-section");
    el.style.display = target === mode ? "" : "none";
  });
}

let currentOfferPeerId = null;

const sendRegisterAnswer = () => {
  if (!signalingSocket || signalingSocket.readyState !== WebSocket.OPEN) return;
  if (isMultiMode()) {
    signalingSocket.send(
      JSON.stringify({
        type: "register",
        payload: { role: "answer", peerId: getAnswerPeerId() },
      })
    );
  } else {
    signalingSocket.send(
      JSON.stringify({ type: "register-answer", payload: { id: "answer" } })
    );
  }
};

const sendSignalMessage = ({ kind, sdp, candidate, toPeerId }) => {
  if (!signalingSocket || signalingSocket.readyState !== WebSocket.OPEN) return;
  if (isMultiMode()) {
    const target = toPeerId || currentOfferPeerId;
    if (!target) {
      console.warn("target offer peer id is required to send signal in multi mode");
      return;
    }
    signalingSocket.send(
      JSON.stringify({
        type: "signal",
        payload: {
          from: { role: "answer", peerId: getAnswerPeerId() },
          to: { role: "offer", peerId: target },
          data: { kind, sdp, candidate },
        },
      })
    );
  } else {
    const legacyType =
      kind === "offer" ? "offer" : kind === "answer" ? "answer" : kind === "ice" ? "ice-answer" : kind;
    signalingSocket.send(JSON.stringify({ type: legacyType, payload: kind === "ice" ? { candidate } : { sdp } }));
  }
};

// Initialize inputs after helpers exist
initMultiInputs();

window.addEventListener("DOMContentLoaded", () => {
  updateEngineSections();
  document
    .querySelectorAll('input[name="webrtc-engine"]')
    .forEach((r) => r.addEventListener("change", updateEngineSections));
  const connectBtn = document.getElementById("signaling-connect");
  connectBtn?.addEventListener("click", connectSignalingFromUi);
});


// ONNX Inference Engine

// inference state handled in inference.js controller



// Update outbound video (resolution, framerate, bitrate) at sender side

async function updateOutboundVideo({ width, height, framerate, bitrate }) {

  if (!peerConnection) return false;

  const sender = peerConnection

    .getSenders()

    .find((s) => s.track && s.track.kind === "video");

  if (!sender) return false;



  try {

    // 1) Encoder params (bitrate, maxFramerate)

    const params = sender.getParameters() || {};

    if (!params.encodings || params.encodings.length === 0)

      params.encodings = [{}];

    if (Number.isFinite(bitrate)) {

      params.encodings[0].maxBitrate = Number(bitrate);

      params.encodings[0].minBitrate = Number(bitrate);

    }

    if (Number.isFinite(framerate))

      params.encodings[0].maxFramerate = Number(framerate);

    await sender.setParameters(params);

    if (Number.isFinite(bitrate)) console.log(`Applied maxBitrate=${bitrate}`);

    if (Number.isFinite(framerate))

      console.log(`Applied maxFramerate=${framerate}`);



    // 2) Try in-place constraints on current track

    const track = sender.track;

    if (

      track &&

      (Number.isFinite(width) ||

        Number.isFinite(height) ||

        Number.isFinite(framerate))

    ) {

      const cons = {};

      if (Number.isFinite(width)) cons.width = { ideal: Number(width) };

      if (Number.isFinite(height)) cons.height = { ideal: Number(height) };

      if (Number.isFinite(framerate))

        cons.frameRate = { ideal: Number(framerate) };

      try {

        await track.applyConstraints(cons);

        if (track.contentHint !== "motion") track.contentHint = "motion";

        console.log("Applied track.applyConstraints:", cons);

        return true;

      } catch (e) {

        console.warn(

          "applyConstraints failed, fallback to replaceTrack:",

          e?.message || e

        );

      }

    }



    // 3) Fallback: reacquire and replaceTrack

    if (

      Number.isFinite(width) ||

      Number.isFinite(height) ||

      Number.isFinite(framerate)

    ) {

      const gUM = await navigator.mediaDevices.getUserMedia({

        video: {

          width: Number.isFinite(width) ? Number(width) : undefined,

          height: Number.isFinite(height) ? Number(height) : undefined,

          frameRate: Number.isFinite(framerate) ? Number(framerate) : undefined,

          deviceId: String(

            typeof targetDevice !== "undefined" ? targetDevice : "default"

          ),

        },

      });

      const newTrack = gUM.getVideoTracks()[0];

      try {

        if (newTrack) newTrack.contentHint = "motion";

      } catch (_) {}

      const oldTrack = sender.track;

      await sender.replaceTrack(newTrack);

      try {

        oldTrack && oldTrack.stop();

      } catch (_) {}

      stream = gUM;

      const videoElement = document.getElementById("local-video");

      if (videoElement) videoElement.srcObject = stream;

      console.log("Replaced outbound track with new constraints", {

        width,

        height,

        framerate,

      });

    }

    return true;

  } catch (err) {

    console.error("Failed to update outbound video:", err);

    return false;

  }

}



let mr1000aReceiveInfo = {

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




const attachSignalingHandlers = (socket) => {
  if (!socket) return;
  socket.onmessage = async (event) => {
    if (getSelectedEngine() !== "pure") return;
    const { type, payload } = JSON.parse(event.data);

    const handleOffer = async (remoteSdp) => {
      if (!currentOfferPeerId) currentOfferPeerId = "legacy-offer";
      const useIce = getUseIceServersFromUi();
      peerConnection = new RTCPeerConnection(
        useIce ? { iceServers: [{ urls: "stun:10.100.0.35:3478" }] } : {}
      );
      if (useIce) {
        setStatus("stun-status", "Waiting...");
        setStatus("turn-status", "Waiting...");
      } else {
        setStatus("stun-status", "Disabled");
        setStatus("turn-status", "Disabled");
      }

      const ansOptions = getSdpFilterOptionsFromUi();
      const filteredRemoteOffer = filterSdpByOptions(remoteSdp, ansOptions);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "offer", sdp: filteredRemoteOffer })
      );
      try {
        const { scanBannedSdpTokens } = await import("./webrtcFunction.js");
        const hits = scanBannedSdpTokens(
          peerConnection.remoteDescription?.sdp || "",
          ansOptions
        );
        if (hits.length > 0) {
          console.warn(
            "Banned SDP lines present after setRemoteDescription (answer side)",
            hits
          );
        }
      } catch (_) {}
      console.log("Remote SDP is set!");

      stream.getTracks().forEach((track) => {
        try {
          if (track.kind === "video") track.contentHint = "motion";
        } catch (_) {}
        peerConnection.addTrack(track, stream);
        console.log("Track added:", track);
      });
      console.log("Current senders:", peerConnection.getSenders());

      peerConnection.ondatachannel = (event) => {
        remoteDataChannel = event.channel;

        remoteDataChannel.onopen = () => {
          console.log("DataChannel is open");
          setInterval(() => {
            count++;
          }, 300);
        };

        setInterval(() => {
          if (remoteDataChannel != null) {
            remoteDataChannel.send(
              JSON.stringify({
                type: "outputAutorunInfo",
                payload: mr1000aReceiveInfo,
              })
            );
            console.log(`Send AutorunInfo: ${mr1000aReceiveInfo}`);
          }
        }, 33);

        remoteDataChannel.onmessage = async (event) => {
          console.log("Message from Offer:", event.data);
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "inputAutorunInfo":
              if (autorunSocket && autorunSocket.readyState === WebSocket.OPEN) {
                const remoteDrivingData = data;
                try {
                  autorunSocket.send(
                    JSON.stringify({
                      type: "inputAutorunInfo",
                      payload: { inputInfo: remoteDrivingData },
                    })
                  );
                } catch (e) {
                  const now = Date.now();
                  if (now - lastAutorunWarnAt > 2000) {
                    console.warn("autorunSocket send failed:", e?.message || e);
                    lastAutorunWarnAt = now;
                  }
                }
              } else {
                const now = Date.now();
                if (now - lastAutorunWarnAt > 2000) {
                  console.warn("autorunSocket not open; skip sending");
                  lastAutorunWarnAt = now;
                }
              }
              break;
            case "videoQualityChange":
              await updateOutboundVideo({
                bitrate: Number(data.bitrate),
                framerate: Number(data.framerate),
                width: Number(data.width),
                height: Number(data.height),
              });
              break;
            case "offerInferenceResults":
              console.log(
                "Received inference results from offer side:",
                data.payload
              );
              break;
          }
        };
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Generated ICE Candidate (Answer):", event.candidate);
          inspectIceCandidate(event.candidate.candidate || "");
          sendSignalMessage({ kind: "ice", candidate: event.candidate });
        } else {
          console.log("All ICE candidates sent (Answer).");
        }
      };

      while (iceCandidateQueue.length > 0) {
        const candidate = iceCandidateQueue.shift();
        await peerConnection.addIceCandidate(candidate);
      }

      const answer = await peerConnection.createAnswer();
      console.log("Generated SDP Answer:", answer.sdp);
      const beforeLen = answer.sdp.length;
      const filteredLocalAnswer = filterSdpByOptions(answer.sdp, ansOptions);
      console.log(
        `Filtered SDP Answer (len ${beforeLen} -> ${filteredLocalAnswer.length}) with options:`,
        ansOptions
      );
      await peerConnection.setLocalDescription({
        type: "answer",
        sdp: filteredLocalAnswer,
      });
      try {
        const { scanBannedSdpTokens } = await import("./webrtcFunction.js");
        const hits = scanBannedSdpTokens(
          peerConnection.localDescription?.sdp || "",
          ansOptions
        );
        if (hits.length > 0) {
          console.warn(
            "Banned SDP lines still present after setLocalDescription (answer side)",
            hits
          );
        }
      } catch (_) {}

      sendSignalMessage({
        kind: "answer",
        sdp: filteredLocalAnswer,
        toPeerId: currentOfferPeerId,
      });
    };

    const handleIce = async (candidate) => {
      const ice = new RTCIceCandidate(candidate);
      if (peerConnection && peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(ice);
      } else {
        iceCandidateQueue.push(ice);
      }
    };

    if (type === "signal") {
      const { data, from, to } = payload || {};
      if (isMultiMode() && to && to.peerId && to.peerId !== getAnswerPeerId()) {
        return;
      }
      if (from && from.peerId) currentOfferPeerId = from.peerId;

      if (data?.kind === "offer" && data.sdp) {
        await handleOffer(data.sdp);
      } else if (data?.kind === "ice" && data.candidate) {
        await handleIce(data.candidate);
      }
      return;
    }

    if (type === "offer") {
      await handleOffer(payload.sdp);
    } else if (type === "ice-offer" || type === "ice") {
      await handleIce(payload.candidate);
    }
  };

  socket.onopen = () => {
    sendRegisterAnswer();
    setStatus("signaling-status", "Connected");
  };
  socket.onerror = () => setStatus("signaling-status", "Error");
  socket.onclose = () => setStatus("signaling-status", "Disconnected");
};




autorunSocket.onopen = () => {

  autorunSocket.send(JSON.stringify({ type: "remote-control" }));

};



autorunSocket.onmessage = (event) => {

  //console.log("Received message from autorun:", event);

  const nodeData = JSON.parse(event.data);

  // console.log("Received message from autorun:", nodeData);

  // console.log("Received message from autorun:", nodeData.type);

  // console.log("Received message from autorun:", typeof nodeData.type);

  // console.log("Received message from autorun:", nodeData.payload);

  // ・ｽ・ｽM・ｽ・ｽ・ｽ・ｽ・ｽf・ｽ[・ｽ^・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ

  if (nodeData.type === "autorun-output-data") {

    const { outputAutorunInfo } = nodeData.payload;

    console.log("Received message from autorun:", outputAutorunInfo);

    mr1000aReceiveInfo = outputAutorunInfo;

    //console.log("Updated MR1000A Info:", mr1000aReceiveInfo);

  }

};



function populateCameras() {

  if (!("mediaDevices" in navigator)) return;

  navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {

    while (cameraSelect.options.length > 0) {

      cameraSelect.remove(0);

    }

    const defaultOption = document.createElement("option");

    defaultOption.id = "default";

    defaultOption.textContent = "Default Camera";

    cameraSelect.appendChild(defaultOption);



    //console.log(mediaDevices);

    const videoInputDevices = mediaDevices.filter(

      (mediaDevice) => mediaDevice.kind === "videoinput"

    );

    if (videoInputDevices.length > 0) {

      cameraSelect.disabled = false;

    }

    //・ｽv・ｽ・ｽ・ｽ_・ｽE・ｽ・ｽ・ｽﾉカ・ｽ・ｽ・ｽ・ｽ・ｽf・ｽ・ｽ・ｽ・ｽﾇ会ｿｽ・ｽ・ｽ・ｽ驍ｽ・ｽﾟの・ｿｽ・ｽ[・ｽv

    videoInputDevices.forEach((videoInputDevice, index) => {

      if (!videoInputDevice.deviceId) {

        return;

      }

      //console.log(videoInputDevice);

      const option = document.createElement("option");



      option.id = videoInputDevice.deviceId;

      //console.log(option.id);

      option.textContent = videoInputDevice.label || `Camera ${index + 1}`;

      option.selected = deviceId == option.id;

      cameraSelect.appendChild(option);

    });

  });

}



window.addEventListener("DOMContentLoaded", populateCameras);

if ("mediaDevices" in navigator) {

  navigator.mediaDevices.addEventListener("devicechange", populateCameras);

}



let deviceId = "default";

let targetDevice = "default";

cameraSelect.onchange = (_) => {

  deviceId = cameraSelect.selectedOptions[0].id;

  targetDevice = deviceId;

};



streamCaptureBtn.addEventListener("click", async () => {

  stream = await navigator.mediaDevices.getUserMedia({

    video: {

      width: Number(document.getElementById("video-width").value),

      height: Number(document.getElementById("video-height").value),

      frameRate: Number(document.getElementById("video-rate").value),

      deviceId: String(targetDevice),

    },

  });

  // ・ｽf・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ[・ｽJ・ｽ・ｽ・ｽv・ｽ・ｽ・ｽr・ｽ・ｽ・ｽ[

  const videoElement = document.getElementById("local-video");

  videoElement.srcObject = stream;



  // Initialize ONNX model and start inference when video is ready

  videoElement.addEventListener("loadeddata", async () => {

    await new Promise((resolve) => setTimeout(resolve, 100));

    answerInference

      .start()

      .then(() =>

        console.log("Started ONNX inference (pipeline) on answer side")

      )

      .catch((e) => console.error("Inference init failed (answer)", e));

  });



  // Setup radio button event listeners for inference control

  const inferenceOnRadio = document.getElementById("inference-on");

  const inferenceOffRadio = document.getElementById("inference-off");



  inferenceOnRadio.addEventListener("change", () => {

    if (inferenceOnRadio.checked) {

      answerInference.setEnabled(true);

      console.log("Answer side inference enabled");

    }

  });



  inferenceOffRadio.addEventListener("change", () => {

    if (inferenceOffRadio.checked) {

      answerInference.setEnabled(false);

      console.log("Answer side inference disabled");

    }

  });



  // If Old SkyWay mode, start adapter and bypass pure signaling

  if (getSelectedEngine() === "oldskyway") {

    const apiKey = document.getElementById("skyway-old-api-key")?.value?.trim();

    const localId = document

      .getElementById("skyway-old-local-id")

      ?.value?.trim();

    if (!apiKey) {

      alert("SkyWay API Key・ｽ・ｽ・ｽ・ｽﾍゑｿｽ・ｽﾄゑｿｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽB");

      return;

    }

    try {

      const adapter = createOldSkywayAnswerAdapter({

        apiKey,

        localPeerId: localId || undefined,

        onOpen: (myId) => {

          const span = document.getElementById("skyway-my-id");

          if (span) span.textContent = myId;

        },

      });

      try {

        stream.getVideoTracks().forEach((t) => (t.contentHint = "motion"));

      } catch (_) {}

      adapter.setLocalStream(stream);



      // Bridge data channel semantics

      remoteDataChannel = adapter.dataChannel;

      remoteDataChannel.onmessage = async (event) => {

        try {

          const data =

            typeof event.data === "string"

              ? JSON.parse(event.data)

              : event.data;

          switch (data.type) {

            case "inputAutorunInfo":

              if (

                autorunSocket &&

                autorunSocket.readyState === WebSocket.OPEN

              ) {

                const remoteDrivingData = data;

                autorunSocket.send(

                  JSON.stringify({

                    type: "inputAutorunInfo",

                    payload: { inputInfo: remoteDrivingData },

                  })

                );

              }

              break;

            case "videoQualityChange":

              await updateOutboundVideo({

                bitrate: Number(data.bitrate),

                framerate: Number(data.framerate),

                width: Number(data.width),

                height: Number(data.height),

              });

              break;

            case "offerInferenceResults":

              console.log(

                "Received inference results from offer side:",

                data.payload

              );

              break;

          }

        } catch (e) {

          console.warn("Old SkyWay answer data parse error", e);

        }

      };



      // Periodic send of outputAutorunInfo same as pure path

      setInterval(() => {

        if (remoteDataChannel && remoteDataChannel.readyState === "open") {

          remoteDataChannel.send(

            JSON.stringify({

              type: "outputAutorunInfo",

              payload: mr1000aReceiveInfo,

            })

          );

        }

      }, 33);

    } catch (e) {

      console.error("Old SkyWay answer init failed", e);

      alert("Old SkyWay(Answer) ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽﾉ趣ｿｽ・ｽs: " + (e?.message || e));

    }

  }

});
