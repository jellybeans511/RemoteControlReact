export type DetectionBBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Detection = {
  bbox: DetectionBBox;
  confidence: number;
  classId: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
};

export type DetectionInfo = {
  isEnabled: boolean;
  detections: Detection[];
};

export type RobotInfo = {
  gnssSpeed?: number;
  headingError?: number;
  lateralError?: number;
};

export type ControlInfo = {
  isRemoteCont: boolean;
  inputSteer: number;
  inputSteerRaw?: number;
  inputEngineCycle: number;
  inputShuttle: number;
  inputPtoOn: number;
  inputHorn: number;
  inputGear: number;
  inputPtoHeight: number;
  inputSpeed: number;
  isAutoRunStart?: number;
  isUseSafetySensorInTeleDrive?: number;
};

export type TelemetryBundle = {
  robot: RobotInfo;
  control: ControlInfo;
  detection: DetectionInfo;
};
