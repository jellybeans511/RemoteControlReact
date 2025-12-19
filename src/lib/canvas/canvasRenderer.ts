import { ControlInfo, DetectionInfo, RobotInfo } from "../types/telemetry";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

type CanvasRendererConfig = {
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement;
  getRobotInfo: () => RobotInfo;
  getControlInfo: () => ControlInfo;
  getDetectionInfo?: () => DetectionInfo | undefined;
};

type CanvasRenderer = {
  start: () => void;
  stop: () => void;
  show: () => void;
  hide: () => void;
};

export function createCanvasRenderer(config: CanvasRendererConfig): CanvasRenderer {
  const { canvas, video, getRobotInfo, getControlInfo, getDetectionInfo } = config;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2d context not available");
  }

  let animationId: number | null = null;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.hidden = true;

  const render = () => {
    if (canvas.hidden) {
      animationId = requestAnimationFrame(render);
      return;
    }
    if (!video || video.readyState < 2) {
      animationId = requestAnimationFrame(render);
      return;
    }

    const robot = getRobotInfo();
    const control = getControlInfo();
    const detection = getDetectionInfo ? getDetectionInfo() : undefined;

    drawFrame(ctx, video, robot, control, detection);
    animationId = requestAnimationFrame(render);
  };

  const start = () => {
    if (animationId != null) return;
    animationId = requestAnimationFrame(render);
  };

  const stop = () => {
    if (animationId != null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const show = () => {
    canvas.hidden = false;
  };
  const hide = () => {
    canvas.hidden = true;
  };

  return { start, stop, show, hide };
}

function drawFrame(
  context2d: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  robotInfo: RobotInfo,
  controlInfo: ControlInfo,
  detectionInfo?: DetectionInfo
) {
  context2d.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (detectionInfo && detectionInfo.detections && detectionInfo.isEnabled) {
    drawDetections(context2d, detectionInfo.detections);
  }

  if (controlInfo.isRemoteCont) {
    drawTeleMode(context2d, robotInfo);
  } else {
    drawAutoMode(context2d);
  }

  drawCommonUI(context2d, robotInfo, controlInfo);
}

function drawAutoMode(context2d: CanvasRenderingContext2D) {
  context2d.setLineDash([]);
  context2d.lineWidth = 2;
  context2d.fillStyle = "red";
  context2d.font = "Italic 80px serif";
  context2d.fillText("AutoDriving Mode", 10, 1060);
  context2d.strokeStyle = "magenta";
  context2d.strokeText("AutoDriving Mode", 10, 1060);
}

function drawTeleMode(context2d: CanvasRenderingContext2D, robotInfo: RobotInfo) {
  let headingError = Math.max(-90, Math.min(90, robotInfo.headingError || 0));
  const headPix = 960 - Math.floor(1060 * Math.sin((headingError * Math.PI) / 180));

  context2d.beginPath();
  context2d.strokeStyle = "cyan";
  context2d.lineWidth = 10;
  context2d.setLineDash([10, 10]);
  context2d.moveTo(960, 1060);
  context2d.lineTo(headPix, 320);
  context2d.stroke();

  context2d.setLineDash([]);
  context2d.lineWidth = 2;
  context2d.fillStyle = "red";
  context2d.font = "Italic 80px serif";
  context2d.fillText("TeleDriving Mode", 10, 1060);
  context2d.strokeStyle = "magenta";
  context2d.strokeText("TeleDriving Mode", 10, 1060);

  context2d.fillStyle = "blue";
  const lateralErrorText = `Lateral Error : ${Math.floor((robotInfo.lateralError || 0) * 100)} cm`;
  context2d.fillText(lateralErrorText, 1200, 1060);
  context2d.strokeStyle = "cyan";
  context2d.strokeText(lateralErrorText, 1200, 1060);
}

function drawCommonUI(context2d: CanvasRenderingContext2D, robotInfo: RobotInfo, controlInfo: ControlInfo) {
  context2d.font = "Italic 48px serif";
  context2d.lineWidth = 2;
  context2d.fillStyle = "white";
  context2d.strokeStyle = "magenta";

  const speedText = `Speed : ${robotInfo.gnssSpeed || 0} km/h`;
  context2d.fillText(speedText, 10, 50);
  context2d.strokeText(speedText, 10, 50);

  if (controlInfo.isRemoteCont) {
    const ptoStatus = controlInfo.inputPtoOn ? "ON" : "OFF";

    drawText(context2d, `Hitch Height : ${controlInfo.inputPtoHeight || 0}%`, 1470, 50);
    drawText(context2d, `PTO : ${ptoStatus}`, 1470, 105);
    drawText(context2d, `Shuttle : ${controlInfo.inputShuttle || 0}`, 10, 165);
    drawText(context2d, `Set Speed : ${controlInfo.inputSpeed || 0} km/h`, 10, 105);
  }

  context2d.font = "Italic 64px serif";
  context2d.fillStyle = "yellow";
  context2d.strokeStyle = "orange";

  drawText(context2d, "10m", 10, 400);
  drawText(context2d, "5m", 30, 720);
  drawText(context2d, "3m", 200, 820);

  drawGuidelines(context2d);
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
}

function drawDetections(ctx: CanvasRenderingContext2D, detections: DetectionInfo["detections"]) {
  if (!detections || detections.length === 0) return;

  const scaleX = CANVAS_WIDTH / 640;
  const scaleY = CANVAS_HEIGHT / 640;

  const classNames = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat",
    "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
    "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack",
    "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball",
    "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket",
    "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
    "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake",
    "chair", "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop",
    "mouse", "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
    "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush",
  ];

  detections.forEach((detection, idx) => {
    const { bbox } = detection;

    const x = bbox.x * scaleX;
    const y = bbox.y * scaleY;
    const width = bbox.width * scaleX;
    const height = bbox.height * scaleY;

    const hue = (idx * 137.5) % 360;
    const boxColor = `hsl(${hue}, 100%, 50%)`;

    ctx.save();

    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 6;
    ctx.setLineDash([]);
    ctx.strokeRect(x, y, width, height);

    const className = classNames[detection.classId] || `Class ${detection.classId}`;
    const confidence = (detection.confidence * 100).toFixed(1);
    const label = `${className} ${confidence}%`;

    ctx.font = "bold 32px Arial";
    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width;
    const textHeight = 40;

    const labelX = Math.max(0, x);
    const labelY = Math.max(textHeight, y);

    ctx.fillStyle = boxColor;
    ctx.fillRect(labelX, labelY - textHeight, textWidth + 16, textHeight + 8);

    ctx.fillStyle = "white";
    ctx.fillText(label, labelX + 8, labelY - 8);

    ctx.restore();
  });
}

function drawGuidelines(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.setLineDash([10, 10]);
  ctx.lineWidth = 5;
  ctx.moveTo(860, 370);
  ctx.lineTo(1060, 370);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(960, 1060);
  ctx.lineTo(960, 370);
  ctx.lineWidth = 5;
  ctx.setLineDash([5, 5, 60, 5]);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([5, 5, 10]);
  ctx.strokeStyle = "orange";
  ctx.moveTo(230, 710);
  ctx.quadraticCurveTo(960, 210, 1690, 710);
  ctx.strokeStyle = "red";
  ctx.moveTo(395, 790);
  ctx.quadraticCurveTo(960, 310, 1525, 790);
  ctx.stroke();
}
