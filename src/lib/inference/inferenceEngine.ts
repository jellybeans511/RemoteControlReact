import * as ort from "onnxruntime-web";
import { Detection } from "../types/telemetry";

export type InferenceStats = {
  totalInferences: number;
  totalTime: number;
  averageTime: number;
};

export type InferenceResult = {
  detections: Detection[];
  inferenceTime: number;
  performanceStats: InferenceStats;
  provider: string;
};

export type InferenceEngine = {
  initialize: (modelPath?: string) => Promise<boolean>;
  run: (video: HTMLVideoElement) => Promise<InferenceResult | null>;
  dispose: () => void;
  getProvider: () => string;
};

export const createInferenceEngine = (): InferenceEngine => {
  let session: ort.InferenceSession | null = null;
  let inferenceCanvas: HTMLCanvasElement | null = null;
  let inferenceContext: CanvasRenderingContext2D | null = null;
  let currentProvider = "none";
  let modelPath = "./best.onnx";
  const stats: InferenceStats = { totalInferences: 0, totalTime: 0, averageTime: 0 };

  const checkWebGPUSupport = async () => {
    const gpu = (navigator as any).gpu;
    if (!gpu || typeof gpu.requestAdapter !== "function") return false;
    try {
      const adapter = await gpu.requestAdapter();
      return !!adapter;
    } catch {
      return false;
    }
  };

  const switchToWasmFallback = async () => {
    try {
      session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });
      currentProvider = "wasm";
      return true;
    } catch (e) {
      console.error("Failed to switch to WASM fallback:", e);
      return false;
    }
  };

  const initialize = async (maybeModelPath?: string) => {
    modelPath = maybeModelPath || modelPath;
    const supportsWebGPU = await checkWebGPUSupport();
    try {
      const sessionOptions: ort.InferenceSession.SessionOptions = supportsWebGPU
        ? {
            executionProviders: ["webgpu", "wasm"],
            graphOptimizationLevel: "all",
            enableCpuMemArena: false,
            enableMemPattern: false,
            executionMode: "sequential",
          }
        : { executionProviders: ["wasm"], graphOptimizationLevel: "all" };

      session = await ort.InferenceSession.create(modelPath, sessionOptions);
      currentProvider = supportsWebGPU ? "webgpu" : "wasm";

      inferenceCanvas = document.createElement("canvas");
      inferenceContext = inferenceCanvas.getContext("2d");

      // Probe run
      const probe = new ort.Tensor("float32", new Float32Array(1 * 3 * 640 * 640), [1, 3, 640, 640]);
      try {
        await session.run({ images: probe });
      } catch {
        const switched = await switchToWasmFallback();
        if (!switched) return false;
        const probeFallback = new ort.Tensor("float32", new Float32Array(1 * 3 * 640 * 640), [1, 3, 640, 640]);
        await session.run({ images: probeFallback });
      }
      return true;
    } catch (error) {
      console.error("Inference initialization failed, attempting WASM fallback", error);
      try {
        const ok = await switchToWasmFallback();
        return ok;
      } catch (err) {
        console.error("Fallback failed", err);
        return false;
      }
    }
  };

  const preprocessFrame = (videoElement: HTMLVideoElement) => {
    if (!inferenceCanvas || !inferenceContext) return null;
    const target = 640;
    const w = videoElement.videoWidth;
    const h = videoElement.videoHeight;
    if (w === 0 || h === 0) return null;
    const scale = Math.min(target / w, target / h);
    const nw = Math.round(w * scale);
    const nh = Math.round(h * scale);
    inferenceCanvas.width = target;
    inferenceCanvas.height = target;
    inferenceContext.fillStyle = "black";
    inferenceContext.fillRect(0, 0, target, target);
    const dx = Math.floor((target - nw) / 2);
    const dy = Math.floor((target - nh) / 2);
    inferenceContext.drawImage(videoElement, 0, 0, w, h, dx, dy, nw, nh);
    const imgData = inferenceContext.getImageData(0, 0, target, target);
    const data = imgData.data;
    const chw = new Float32Array(3 * target * target);
    let idxR = 0,
      idxG = target * target,
      idxB = 2 * target * target;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255.0;
      const g = data[i + 1] / 255.0;
      const b = data[i + 2] / 255.0;
      const p = i >> 2;
      chw[idxR + p] = r;
      chw[idxG + p] = g;
      chw[idxB + p] = b;
    }
    return chw;
  };

  const parseDetectionResults = (results: Record<string, ort.Tensor>): Detection[] => {
    const values = Object.values(results);
    const boxes = (results as any).boxes || (results as any).output0 || values[0];
    const scores = (results as any).scores || (results as any).output1 || values[1];
    const classes = (results as any).classes || (results as any).output2 || values[2];

    const detections: Detection[] = [];
    if (!boxes || !scores || !classes) return detections;
    const confTh = 0.3;
    const dataB: number[] = (boxes as any).data || (boxes as any);
    const dataS: number[] = (scores as any).data || (scores as any);
    const dataC: number[] = (classes as any).data || (classes as any);
    for (let i = 0; i < dataS.length; i++) {
      const conf = dataS[i];
      if (conf < confTh) continue;
      const x1 = dataB[i * 4 + 0];
      const y1 = dataB[i * 4 + 1];
      const x2 = dataB[i * 4 + 2];
      const y2 = dataB[i * 4 + 3];
      const w = Math.max(0, x2 - x1);
      const h = Math.max(0, y2 - y1);
      detections.push({
        bbox: { x: x1, y: y1, width: w, height: h },
        confidence: conf,
        classId: dataC[i],
        x1,
        y1,
        x2,
        y2,
      });
    }
    return detections;
  };

  const run = async (videoElement: HTMLVideoElement): Promise<InferenceResult | null> => {
    if (!session || !videoElement || videoElement.videoWidth === 0) return null;
    const input = preprocessFrame(videoElement);
    if (!input) return null;
    const tensor = new ort.Tensor("float32", input, [1, 3, 640, 640]);
    const start = performance.now();
    const results = await session.run({ images: tensor });
    const inferenceTime = performance.now() - start;
    stats.totalInferences += 1;
    stats.totalTime += inferenceTime;
    stats.averageTime = stats.totalTime / stats.totalInferences;
    const detections = parseDetectionResults(results as any);
    return { detections, inferenceTime, performanceStats: { ...stats }, provider: currentProvider };
  };

  const dispose = () => {
    session = null;
    inferenceCanvas = null;
    inferenceContext = null;
  };

  return {
    initialize,
    run,
    dispose,
    getProvider: () => currentProvider,
  };
};
