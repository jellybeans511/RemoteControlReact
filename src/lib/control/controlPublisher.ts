import { ControlInfo } from "../types/telemetry";

export type ControlPayload = ControlInfo & {
  type: "inputAutorunInfo";
};

type Sender = ((payload: ControlPayload) => void) | null;
type ControlProvider = () => ControlInfo;

export const createControlPublisher = (intervalMs = 100) => {
  let sender: Sender = null;
  let getControl: ControlProvider = () => defaultControl;
  let timer: number | null = null;

  const tick = () => {
    if (!sender) return;
    const control = getControl();
    sender(toPayload(control));
  };

  const start = () => {
    if (timer != null) return;
    timer = window.setInterval(tick, intervalMs);
  };

  const stop = () => {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
  };

  const setSender = (next: Sender) => {
    sender = next;
  };

  const setControlSource = (provider: ControlProvider) => {
    getControl = provider;
  };

  return {
    start,
    stop,
    setSender,
    setControlSource,
  };
};

const defaultControl: ControlInfo = {
  isRemoteCont: false,
  inputSteer: 0,
  inputEngineCycle: 0,
  inputShuttle: 0,
  inputPtoOn: 0,
  inputHorn: 0,
  inputGear: 1,
  inputPtoHeight: 0,
  inputSpeed: 0,
  isAutoRunStart: 0,
  isUseSafetySensorInTeleDrive: 0,
};

function toPayload(control: ControlInfo): ControlPayload {
  return {
    type: "inputAutorunInfo",
    ...control,
    // Ensure number fields are numbers
    inputSteer: Number(control.inputSteer) || 0,
    inputEngineCycle: Number(control.inputEngineCycle) || 0,
    inputShuttle: Number(control.inputShuttle) || 0,
    inputPtoOn: Number(control.inputPtoOn) || 0,
    inputHorn: Number(control.inputHorn) || 0,
    inputGear: Number(control.inputGear) || 0,
    inputPtoHeight: Number(control.inputPtoHeight) || 0,
    inputSpeed: Number(control.inputSpeed) || 0,
    isRemoteCont: !!control.isRemoteCont,
    isAutoRunStart: Number(control.isAutoRunStart) || 0,
    isUseSafetySensorInTeleDrive: Number(control.isUseSafetySensorInTeleDrive) || 0,
  };
}
