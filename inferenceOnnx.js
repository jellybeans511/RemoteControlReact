// Unified inference module: exports ONNX engine and the pipeline
// Unified ONNX inference engine (merged from onnxInference.js)
class ONNXInferenceEngine {
  constructor() {
    this.session = null;
    this.inferenceCanvas = null;
    this.inferenceContext = null;
    this.isWebGPUSupported = false;
    this.currentProvider = 'none';
    this._lastRunErrorAt = 0;
    this.modelPath = './best.onnx';
    this.performanceStats = { totalInferences: 0, totalTime: 0, averageTime: 0 };
  }
  async checkWebGPUSupport() {
    if (!navigator.gpu) return false;
    try { const adapter = await navigator.gpu.requestAdapter(); return !!adapter; } catch { return false; }
  }
  async initializeModel(modelPath = null) {
    try {
      if (modelPath) this.modelPath = modelPath;
      try { if (typeof ort !== 'undefined' && ort.env) { ort.env.logLevel = 'warning'; } } catch {}
      this.isWebGPUSupported = await this.checkWebGPUSupport();
      let sessionOptions = {};
      if (this.isWebGPUSupported) {
        sessionOptions = { executionProviders: ['webgpu','wasm'], graphOptimizationLevel: 'all', enableCpuMemArena: false, enableMemPattern: false, executionMode: 'sequential' };
        this.currentProvider = 'webgpu';
      } else {
        sessionOptions = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
        this.currentProvider = 'wasm';
      }
      this.session = await ort.InferenceSession.create(this.modelPath, sessionOptions);
      this.inferenceCanvas = document.createElement('canvas');
      this.inferenceContext = this.inferenceCanvas.getContext('2d');
      try {
        const probe = new ort.Tensor('float32', new Float32Array(1*3*640*640), [1,3,640,640]);
        await this.session.run({ images: probe });
      } catch (probeErr) {
        const switched = await this.switchToWasmFallback();
        if (!switched) return false;
        try {
          const probe = new ort.Tensor('float32', new Float32Array(1*3*640*640), [1,3,640,640]);
          await this.session.run({ images: probe });
        } catch { return false; }
      }
      return true;
    } catch (error) {
      try {
        this.session = await ort.InferenceSession.create(this.modelPath, { executionProviders: ['wasm'] });
        this.currentProvider = 'wasm';
        return true;
      } catch { return false; }
    }
  }
  async switchToWasmFallback() {
    try {
      this.session = await ort.InferenceSession.create(this.modelPath, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
      this.currentProvider = 'wasm';
      return true;
    } catch (e) {
      console.error('Failed to switch to WASM fallback:', e);
      return false;
    }
  }
  preprocessFrame(videoElement) {
    const ctx = this.inferenceContext;
    const canvas = this.inferenceCanvas;
    if (!ctx || !canvas) return null;
    const target = 640;
    const w = videoElement.videoWidth;
    const h = videoElement.videoHeight;
    if (w === 0 || h === 0) return null;
    const scale = Math.min(target / w, target / h);
    const nw = Math.round(w * scale);
    const nh = Math.round(h * scale);
    canvas.width = target; canvas.height = target;
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, target, target);
    const dx = Math.floor((target - nw) / 2);
    const dy = Math.floor((target - nh) / 2);
    ctx.drawImage(videoElement, 0, 0, w, h, dx, dy, nw, nh);
    const imgData = ctx.getImageData(0, 0, target, target);
    const data = imgData.data;
    const chw = new Float32Array(3 * target * target);
    let idxR = 0, idxG = target * target, idxB = 2 * target * target;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255.0; const g = data[i+1] / 255.0; const b = data[i+2] / 255.0;
      const p = i >> 2; chw[idxR + p] = r; chw[idxG + p] = g; chw[idxB + p] = b;
    }
    return chw;
  }
  parseDetectionResults(results) {
    const boxes = results.boxes || results.output0 || Object.values(results)[0];
    const scores = results.scores || results.output1 || Object.values(results)[1];
    const classes = results.classes || results.output2 || Object.values(results)[2];
    const detections = [];
    if (!boxes || !scores || !classes) return detections;
    const target = 640; const confTh = 0.3;
    const dataB = boxes.data || boxes;
    const dataS = scores.data || scores;
    const dataC = classes.data || classes;
    for (let i = 0; i < dataS.length; i++) {
      const conf = dataS[i]; if (conf < confTh) continue;
      const x1 = dataB[i * 4 + 0]; const y1 = dataB[i * 4 + 1];
      const x2 = dataB[i * 4 + 2]; const y2 = dataB[i * 4 + 3];
      const w = Math.max(0, x2 - x1); const h = Math.max(0, y2 - y1);
      detections.push({ bbox: { x: x1, y: y1, width: w, height: h }, confidence: conf, classId: dataC[i], x1, y1, x2, y2 });
    }
    return detections;
  }
  async runInference(videoElement, side = 'unknown') {
    if (!this.session || !videoElement || videoElement.videoWidth === 0) return null;
    try {
      const start = performance.now();
      const input = this.preprocessFrame(videoElement); if (!input) return null;
      const tensor = new ort.Tensor('float32', input, [1,3,640,640]);
      const results = await this.session.run({ images: tensor });
      const inferenceTime = performance.now() - start;
      this.performanceStats.totalInferences++; this.performanceStats.totalTime += inferenceTime; this.performanceStats.averageTime = this.performanceStats.totalTime / this.performanceStats.totalInferences;
      const detections = this.parseDetectionResults(results);
      return { rawResults: results, detections, inferenceTime, performanceStats: { ...this.performanceStats } };
    } catch (error) {
      const now = Date.now(); if (now - this._lastRunErrorAt > 2000) { console.error(`ONNX inference failed on ${side} side:`, error); this._lastRunErrorAt = now; }
      const msg = String(error?.message || error || '');
      if (this.currentProvider === 'webgpu' && /GatherND|Unsupported data type|WebGPU/i.test(msg)) { await this.switchToWasmFallback(); }
      return null;
    }
  }
  getPerformanceStats() { return { ...this.performanceStats }; }
  resetPerformanceStats() { this.performanceStats = { totalInferences: 0, totalTime: 0, averageTime: 0 }; }
  isUsingWebGPU() { return this.isWebGPUSupported && this.session; }
  dispose() { try { this.session?.release?.(); } catch {} this.session = null; this.inferenceCanvas = null; this.inferenceContext = null; }
}
export { ONNXInferenceEngine };

export function createInferencePipeline({
  side = "offer",
  videoElement,
  largeCanvas,
  overlayCanvas,
  onDetections,
  onResults,
}) {
  let engine = null;
  let running = false;
  let enabled = false;
  let detections = [];
  let dynamicInterval = 33;
  let totalInferenceTime = 0;
  let inferenceCount = 0;
  const targetInputSize = 640;

  const largeCtx = largeCanvas ? largeCanvas.getContext("2d") : null;
  const overlayCtx = overlayCanvas ? overlayCanvas.getContext("2d") : null;

  async function initialize() {
    engine = new ONNXInferenceEngine();
    const ok = await engine.initializeModel();
    if (!ok) throw new Error("Failed to initialize ONNX model");
  }

  function setEnabled(flag) {
    enabled = !!flag;
    if (!enabled) {
      detections = [];
      if (typeof onDetections === "function") onDetections(detections);
      if (overlayCtx && overlayCanvas) overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      if (largeCtx && largeCanvas) largeCtx.clearRect(0, 0, largeCanvas.width, largeCanvas.height);
    }
  }

  function getDetections() {
    return detections;
  }

  function drawOnLargeCanvas(dets) {
    if (!largeCanvas || !largeCtx || !dets || dets.length === 0) return;
    const scaleX = 1920 / targetInputSize;
    const scaleY = 1080 / targetInputSize;
    largeCtx.clearRect(0, 0, largeCanvas.width, largeCanvas.height);
    dets.forEach((d, idx) => {
      const x = d.bbox.x * scaleX;
      const y = d.bbox.y * scaleY;
      const w = d.bbox.width * scaleX;
      const h = d.bbox.height * scaleY;
      const hue = (idx * 137.5) % 360;
      const color = `hsl(${hue},100%,50%)`;
      largeCtx.strokeStyle = color;
      largeCtx.lineWidth = 6;
      largeCtx.strokeRect(x, y, w, h);
      const label = `${(d.classId ?? "")} ${(d.confidence * 100).toFixed(1)}%`;
      largeCtx.font = "bold 32px Arial";
      const tw = largeCtx.measureText(label).width;
      const th = 40;
      const lx = Math.max(0, x);
      const ly = Math.max(th, y);
      largeCtx.fillStyle = color;
      largeCtx.fillRect(lx, ly - th, tw + 16, th + 8);
      largeCtx.fillStyle = "white";
      largeCtx.fillText(label, lx + 8, ly - 8);
    });
  }

  function resizeOverlayToVideo() {
    if (!overlayCanvas || !overlayCtx || !videoElement) return;
    const rect = videoElement.getBoundingClientRect();
    overlayCanvas.width = rect.width;
    overlayCanvas.height = rect.height;
    overlayCanvas.style.width = rect.width + "px";
    overlayCanvas.style.height = rect.height + "px";
  }

  function drawOnOverlay(dets) {
    if (!overlayCanvas || !overlayCtx) return;
    resizeOverlayToVideo();
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    if (!dets || dets.length === 0) return;
    const rect = videoElement.getBoundingClientRect();
    const scaleX = rect.width / targetInputSize;
    const scaleY = rect.height / targetInputSize;
    dets.forEach((d, idx) => {
      const x = d.bbox.x * scaleX;
      const y = d.bbox.y * scaleY;
      const w = d.bbox.width * scaleX;
      const h = d.bbox.height * scaleY;
      const hue = (idx * 137.5) % 360;
      const color = `hsl(${hue},100%,50%)`;
      overlayCtx.strokeStyle = color;
      overlayCtx.lineWidth = 3;
      overlayCtx.strokeRect(x, y, w, h);
    });
  }

  function streamToLargeCanvas() {
    if (!largeCanvas || !largeCtx || !videoElement || videoElement.videoWidth === 0) return;
    largeCtx.drawImage(videoElement, 0, 0, largeCanvas.width, largeCanvas.height);
  }

  async function loop() {
    if (!running) return;
    if (videoElement && videoElement.videoWidth > 0) {
      const start = performance.now();

      streamToLargeCanvas();

      if (enabled && engine) {
        const results = await engine.runInference(videoElement, side);
        if (results && results.detections) {
          detections = results.detections;
          if (typeof onDetections === "function") onDetections(detections);
          drawOnLargeCanvas(detections);
          drawOnOverlay(detections);
          if (typeof onResults === "function") onResults(results);
        }
      } else {
        detections = [];
        if (typeof onDetections === "function") onDetections(detections);
      }

      const end = performance.now();
      const infTime = end - start;
      inferenceCount++;
      totalInferenceTime += infTime;
      if (inferenceCount % 30 === 0) {
        const avg = totalInferenceTime / 30;
        if (avg < 20) dynamicInterval = Math.max(16, dynamicInterval - 2);
        else if (avg < 40) dynamicInterval = Math.max(33, dynamicInterval - 1);
        else if (avg > 80) dynamicInterval = Math.min(200, dynamicInterval + 10);
        totalInferenceTime = 0;
        inferenceCount = 0;
      }
    }
    setTimeout(loop, dynamicInterval);
  }

  async function start() {
    running = true;
    setTimeout(loop, dynamicInterval);
  }

  function stop() { running = false; }

  return { initialize, start, stop, setEnabled, getDetections };
}

const resolveElement = (nodeOrId) => {
  if (!nodeOrId) return null;
  if (typeof nodeOrId === "string") return document.getElementById(nodeOrId);
  return nodeOrId;
};

const createSideInferenceController = ({
  side,
  videoElement,
  largeCanvas,
  overlayCanvas,
  resultMessageType,
  getDataChannel = () => null,
}) => {
  let enabled = false;
  let detections = [];
  let pipeline = null;

  const detectionInfo = {
    get detections() {
      return detections;
    },
    get isEnabled() {
      return enabled;
    },
  };

  const sendResults = (results) => {
    if (!resultMessageType) return;
    const channel = getDataChannel ? getDataChannel() : null;
    if (!channel || channel.readyState !== "open") return;
    try {
      channel.send(
        JSON.stringify({
          type: resultMessageType,
          payload: {
            timestamp: Date.now(),
            detectionsCount: results?.detections?.length || 0,
            detections: results?.detections || [],
          },
        })
      );
    } catch (error) {
      console.warn(`[${side}] failed to send inference results`, error);
    }
  };

  const setEnabled = (flag) => {
    enabled = !!flag;
    if (!enabled) detections = [];
    if (pipeline) pipeline.setEnabled(enabled);
  };

  const start = async () => {
    if (pipeline) {
      pipeline.setEnabled(enabled);
      return pipeline;
    }
    const large = resolveElement(largeCanvas);
    const overlay = resolveElement(overlayCanvas);
    pipeline = createInferencePipeline({
      side,
      videoElement,
      largeCanvas: large,
      overlayCanvas: overlay,
      onDetections: (arr) => {
        detections = arr || [];
      },
      onResults: sendResults,
    });
    await pipeline.initialize();
    pipeline.start();
    pipeline.setEnabled(enabled);
    return pipeline;
  };

  const stop = () => {
    if (pipeline) pipeline.stop();
    pipeline = null;
    detections = [];
    enabled = false;
  };

  return {
    start,
    stop,
    setEnabled,
    getDetectionInfo: () => detectionInfo,
    getDetections: () => detections,
    isEnabled: () => enabled,
  };
};

export const createOfferInferenceController = (opts) =>
  createSideInferenceController({
    side: "offer",
    largeCanvas: "large-detection-canvas",
    overlayCanvas: null,
    resultMessageType: "offerInferenceResults",
    ...opts,
  });

export const createAnswerInferenceController = (opts) =>
  createSideInferenceController({
    side: "answer",
    largeCanvas: "large-detection-canvas",
    overlayCanvas: "detection-canvas",
    resultMessageType: "inferenceResults",
    ...opts,
  });
