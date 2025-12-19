const WebSocket = require("ws");
const dgram = require("dgram");
const net = require("net");

// Configurable UDP endpoints (env overridable)
const UDP_REMOTE_HOST = process.env.UDP_REMOTE_HOST || "133.50.190.33"; // C++アプリのIP
const UDP_REMOTE_PORT = Number(process.env.UDP_REMOTE_PORT || 50031); // 送信先ポート
const UDP_LOCAL_HOST = process.env.UDP_LOCAL_HOST || "0.0.0.0"; // 受信バインドIP（任意）
const UDP_LOCAL_PORT = Number(process.env.UDP_LOCAL_PORT || 50030); // 受信ポート

// Browser <-> Node 用 WS サーバ
const server = new WebSocket.Server({ port: 8081 });
let remoteControlSocket = null;
let virtualTractorSocket = null;

const {
  parseMR1000AMessage,
  makeMessageMR1000A,
} = require("./node-function.js");
const { latLonToUTM54 } = require("./positioningLib.js");

const inputAutorunInfo = {
  inputSteer: 0,
  inputEngineCycle: 0,
  inputGear: 1,
  inputShuttle: 0,
  inputSpeed: 0,
  inputPtoHeight: 0,
  inputPtoOn: 0,
  inputHorn: 0,
  isRemoteCont: 0,
  isAutoRunStart: 0,
  isUseSafetySensorInTeleDrive: 0,
};

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

// Virtual input mirror (parity with TCP version)
const virtualInputInfo = {
  outputEasting: 0,
  outputNorthing: 0,
  outputHeading: 0,
  outputVelocity: 0,
  inputVelocity: 0,
  inputSteering: 0,
  inputShuttle: 0,
  inputRemoteCont: 0,
  start: false,
};

console.log("WS Server running on ws://localhost:8081");
console.log(
  `UDP bridge configured: recv ${UDP_LOCAL_HOST}:${UDP_LOCAL_PORT} <= native, send => ${UDP_REMOTE_HOST}:${UDP_REMOTE_PORT}`
);

// WebSocket server: handle connections from browser (Answer page)
server.on("connection", (webSocket) => {
  webSocket.on("message", (wsMessage) => {
    try {
      const wsData = JSON.parse(wsMessage);
      if (wsData.type === "remote-control") {
        remoteControlSocket = webSocket;
        console.log("Remote control connected (browser answer)");
      } else if (wsData.type === "virtual-tractor") {
        virtualTractorSocket = webSocket;
        console.log("Virtual tractor connected (browser)");
      } else if (wsData.type === "inputAutorunInfo") {
        // 受信ログ（ブラウザ→Node）
        try {
          console.log(
            "[UDPBridge] inputAutorunInfo from browser:",
            wsData.payload?.inputInfo
          );
        } catch (_) {}
        const info = wsData.payload.inputInfo;
        inputAutorunInfo.inputSteer = info.inputSteer;
        inputAutorunInfo.inputEngineCycle = info.inputEngineCycle;
        inputAutorunInfo.inputGear = info.inputGear;
        inputAutorunInfo.inputShuttle = info.inputShuttle;
        inputAutorunInfo.inputSpeed = info.inputSpeed;
        inputAutorunInfo.inputPtoHeight = info.inputPtoHeight;
        inputAutorunInfo.inputPtoOn = info.inputPtoOn;
        inputAutorunInfo.inputHorn = info.inputHorn;
        inputAutorunInfo.isRemoteCont = info.isRemoteCont;
        inputAutorunInfo.isUseSafetySensorInTeleDrive =
          info.isUseSafetySensorInTeleDrive;
      }
      // Additional browser -> node path (parity with TCP version)
      if (wsData.type === "to-virtual-data") {
        try {
          virtualInputInfo.inputSteering = inputAutorunInfo.inputSteer;
          virtualInputInfo.inputVelocity = inputAutorunInfo.inputSpeed;
          if (typeof wsData === "object" && wsData !== null) {
            Object.keys(virtualInputInfo).forEach((k) => {
              if (Object.prototype.hasOwnProperty.call(wsData, k)) {
                virtualInputInfo[k] = wsData[k];
              }
            });
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error("Error parsing WS message:", err);
    }
  });

  webSocket.on("close", () => {
    if (webSocket === remoteControlSocket) {
      console.log("Remote control disconnected");
      remoteControlSocket = null;
    } else if (webSocket === virtualTractorSocket) {
      console.log("Virtual tractor disconnected");
      virtualTractorSocket = null;
    }
  });
});

// UDP sockets
const udpRecv = dgram.createSocket("udp4"); // receive from native (50030)
const udpSend = dgram.createSocket("udp4"); // send to native (50031)

udpRecv.on("error", (err) => {
  console.error("UDP recv error:", err);
});

udpRecv.on("listening", () => {
  const addr = udpRecv.address();
  console.log(`UDP recv listening on ${addr.address}:${addr.port}`);
});

udpRecv.on("message", (msg, rinfo) => {
  try {
    const message = msg.toString("utf-8");
    console.log("UDP recv raw:", message);
    mr1000aReceiveInfo = parseMR1000AMessage(message);
    // console.log("Parsed MR1000A (UDP):", mr1000aReceiveInfo);
  } catch (err) {
    console.error("Error parsing UDP message:", err);
  }
});

udpRecv.bind(UDP_LOCAL_PORT, UDP_LOCAL_HOST);

// Periodically send inputAutorunInfo to native app via UDP
setInterval(() => {
  try {
    const udpPayload = makeMessageMR1000A(inputAutorunInfo);
    udpSend.send(
      Buffer.from(udpPayload, "utf-8"),
      UDP_REMOTE_PORT,
      UDP_REMOTE_HOST,
      (err) => {
        if (err) console.error("UDP send error:", err);
      }
    );
  } catch (err) {
    console.error("Error building/sending UDP payload:", err);
  }
}, 100);

// Push autorun output to browser (as before)
setInterval(() => {
  if (
    remoteControlSocket &&
    remoteControlSocket.readyState === WebSocket.OPEN
  ) {
    const autorunOutputData = {
      type: "autorun-output-data",
      payload: { outputAutorunInfo: mr1000aReceiveInfo },
    };
    try {
      remoteControlSocket.send(JSON.stringify(autorunOutputData));
    } catch (e) {
      console.warn("WS send to browser failed:", e?.message || e);
    }
  }
}, 33);

// Graceful shutdown
process.on("SIGINT", () => {
  try {
    udpRecv.close();
  } catch (_) {}
  try {
    udpSend.close();
  } catch (_) {}
  try {
    server.close();
  } catch (_) {}
  console.log("Shutdown complete");
  process.exit(0);
});
