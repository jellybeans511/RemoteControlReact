import { ControlInfo } from "../types/telemetry";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const createInitialControl = (): ControlInfo => ({
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
});

export const createStandardGamepadMapper = () => {
  const state = {
    ptoCount: 0,
    ptoFlag: false,
    upGearFlag: false,
    downGearFlag: false,
    upLinkFlag: false,
    downLinkFlag: false,
    speedUpFlag: false,
    speedDownFlag: false,
    remoteButtonFlag: false,
    setRemoteControl: false,
    maxUpLinkCount: 0,
    minDownLinkCount: 0,
  };
  const monitorRate = 240;

  return (prev: ControlInfo, pad: Gamepad): ControlInfo => {
    const next = { ...prev };
    next.inputSteer = clamp(Math.floor((pad.axes[0] || 0) * 100), -70, 70);
    next.inputEngineCycle = Math.floor((pad.axes[2] || 0) * 1000 - 1000) * -1 + 800;

    if (pad.buttons[2]?.pressed) {
      next.inputShuttle = 1;
    } else if (pad.buttons[0]?.pressed) {
      next.inputShuttle = -1;
    } else if (pad.buttons[1]?.pressed) {
      next.inputShuttle = 0;
    }

    if (pad.buttons[3]?.pressed) {
      state.ptoFlag = true;
      state.ptoCount += 1;
      next.inputPtoOn = 0;
    } else if (!pad.buttons[3]?.pressed && state.ptoFlag) {
      state.ptoCount = 0;
      state.ptoFlag = false;
    }
    if (state.ptoCount > monitorRate) {
      next.inputPtoOn = 1;
    }

    next.inputHorn = pad.buttons[8]?.pressed ? 1 : 0;

    if (pad.buttons[4]?.pressed) {
      state.upGearFlag = true;
    } else if (!pad.buttons[4]?.pressed && state.upGearFlag) {
      next.inputGear = clamp(next.inputGear + 1, 1, 8);
      state.upGearFlag = false;
    }

    if (pad.buttons[5]?.pressed) {
      state.downGearFlag = true;
    } else if (!pad.buttons[5]?.pressed && state.downGearFlag) {
      next.inputGear = clamp(next.inputGear - 1, 1, 8);
      state.downGearFlag = false;
    }

    const axis9 = pad.axes[9] ?? 0;
    if (axis9 === -1) {
      state.upLinkFlag = true;
      state.maxUpLinkCount += 1;
    } else if (Math.round(axis9 * 10) / 10 === 1.3 && state.upLinkFlag) {
      state.maxUpLinkCount = 0;
      state.upLinkFlag = false;
      next.inputPtoHeight = clamp(next.inputPtoHeight + 5, 0, 100);
    }
    if (state.maxUpLinkCount > monitorRate) {
      state.maxUpLinkCount = 0;
      next.inputPtoHeight = 100;
    }
    if (Math.round(axis9 * 10) / 10 === 1.3 && state.maxUpLinkCount !== 0) {
      state.maxUpLinkCount = 0;
    }

    if (Math.floor(axis9 * 10) / 10 === 0.1) {
      state.downLinkFlag = true;
      state.minDownLinkCount += 1;
    } else if (Math.round(axis9 * 10) / 10 === 1.3 && state.downLinkFlag) {
      state.minDownLinkCount = 0;
      state.downLinkFlag = false;
      next.inputPtoHeight = clamp(next.inputPtoHeight - 5, 0, 100);
    }
    if (state.minDownLinkCount > monitorRate) {
      state.minDownLinkCount = 0;
      next.inputPtoHeight = 0;
    }
    if (Math.round(axis9 * 10) / 10 === 1.3 && state.minDownLinkCount !== 0) {
      state.minDownLinkCount = 0;
    }

    if (pad.buttons[21]?.pressed) {
      state.speedUpFlag = true;
    } else if (!pad.buttons[21]?.pressed && state.speedUpFlag) {
      state.speedUpFlag = false;
      next.inputSpeed = clamp(next.inputSpeed + 0.5, 0, 10);
      next.inputSpeed = Math.floor(next.inputSpeed * 10) / 10;
    }
    if (pad.buttons[22]?.pressed) {
      state.speedDownFlag = true;
    } else if (!pad.buttons[22]?.pressed && state.speedDownFlag) {
      state.speedDownFlag = false;
      next.inputSpeed = clamp(next.inputSpeed - 0.5, 0, 10);
      next.inputSpeed = Math.floor(next.inputSpeed * 10) / 10;
    }

    if (pad.buttons[24]?.pressed) {
      state.remoteButtonFlag = true;
    }
    if (!pad.buttons[24]?.pressed && state.remoteButtonFlag) {
      state.remoteButtonFlag = false;
      if (state.setRemoteControl === false) {
        next.inputGear = 1;
        next.inputPtoOn = 0;
        next.inputPtoHeight = 100;
        next.inputShuttle = 0;
        next.inputSpeed = 0;
        next.isRemoteCont = true;
        state.setRemoteControl = true;
      } else {
        next.isRemoteCont = false;
        next.isAutoRunStart = 0;
        state.setRemoteControl = false;
      }
    }

    return next;
  };
};

export const createFarmingGamepadMapper = () => {
  const state = {
    ptoCount: 0,
    ptoFlag: false,
    upGearFlag: false,
    downGearFlag: false,
    upLinkFlag: false,
    downLinkFlag: false,
    remoteButtonFlag: false,
    setRemoteControl: false,
    maxUpLinkCount: 0,
    minDownLinkCount: 0,
  };
  const monitorRate = 240;

  return (prev: ControlInfo, handle: Gamepad, panel: Gamepad): ControlInfo => {
    const next = { ...prev };
    const steerValue = handle.axes[0] ?? 0;
    const steerDeadzone = 0.09;
    const maxDeg = 35;
    const steerGamma = 2.5;

    next.inputSteer = Math.floor(
      Math.abs(steerValue) <= steerDeadzone
        ? 0
        : Math.abs(steerValue) >= 0.5
        ? steerValue > 0
          ? maxDeg
          : -maxDeg
        : (steerValue > 0 ? 1 : -1) *
          maxDeg *
          Math.pow((Math.abs(steerValue) - steerDeadzone) / (0.5 - steerDeadzone), steerGamma)
    );

    next.inputEngineCycle = Math.floor((handle.axes[7] ?? 0) * 1000 + 1000) + 800;

    if (handle.buttons[0]?.pressed) {
      next.inputShuttle = 1;
    } else if (handle.buttons[2]?.pressed) {
      next.inputShuttle = -1;
    } else if (handle.buttons[4]?.pressed) {
      next.inputShuttle = 0;
    }

    if (handle.buttons[5]?.pressed) {
      state.ptoFlag = true;
      state.ptoCount += 1;
      next.inputPtoOn = 0;
    } else if (!handle.buttons[5]?.pressed && state.ptoFlag) {
      state.ptoCount = 0;
      state.ptoFlag = false;
    }
    if (state.ptoCount > monitorRate) {
      next.inputPtoOn = 1;
    }

    next.inputHorn = handle.buttons[6]?.pressed ? 1 : 0;

    if (handle.buttons[15]?.pressed) {
      state.upGearFlag = true;
    } else if (!handle.buttons[15]?.pressed && state.upGearFlag) {
      next.inputGear = clamp(next.inputGear + 1, 1, 8);
      state.upGearFlag = false;
    }

    if (handle.buttons[16]?.pressed) {
      state.downGearFlag = true;
    } else if (!handle.buttons[16]?.pressed && state.downGearFlag) {
      next.inputGear = clamp(next.inputGear - 1, 1, 8);
      state.downGearFlag = false;
    }

    const axis9 = handle.axes[9] ?? 0;
    const axis9Rounded = Math.round(axis9 * 100);

    if (axis9Rounded === -100) {
      state.upLinkFlag = true;
      state.maxUpLinkCount += 1;
    } else if (axis9Rounded === 329 && state.upLinkFlag) {
      state.maxUpLinkCount = 0;
      state.upLinkFlag = false;
      next.inputPtoHeight = clamp(next.inputPtoHeight + 5, 0, 100);
    }
    if (state.maxUpLinkCount > monitorRate) {
      state.maxUpLinkCount = 0;
      next.inputPtoHeight = 100;
    }
    if (axis9Rounded === 329 && state.maxUpLinkCount !== 0) {
      state.maxUpLinkCount = 0;
    }

    if (axis9Rounded === 14) {
      state.downLinkFlag = true;
      state.minDownLinkCount += 1;
    } else if (axis9Rounded === 329 && state.downLinkFlag) {
      state.minDownLinkCount = 0;
      state.downLinkFlag = false;
      next.inputPtoHeight = clamp(next.inputPtoHeight - 5, 0, 100);
    }
    if (state.minDownLinkCount > monitorRate) {
      state.minDownLinkCount = 0;
      next.inputPtoHeight = 0;
    }
    if (axis9Rounded === 329 && state.minDownLinkCount !== 0) {
      state.minDownLinkCount = 0;
    }

    const setSpeedKmh = Math.floor(((panel.axes[3] ?? 0) * 2.5 + 2.5) * 10) / 10;
    next.inputSpeed = Math.floor(setSpeedKmh * 10) / 10;

    if (panel.buttons[29]?.pressed) {
      state.remoteButtonFlag = true;
    }
    if (!panel.buttons[29]?.pressed && state.remoteButtonFlag) {
      state.remoteButtonFlag = false;
      if (state.setRemoteControl === false) {
        next.inputGear = 1;
        next.inputPtoOn = 0;
        next.inputPtoHeight = 100;
        next.inputShuttle = 0;
        next.inputSpeed = 0;
        next.isRemoteCont = true;
        state.setRemoteControl = true;
      } else {
        next.isRemoteCont = false;
        next.isAutoRunStart = 0;
        state.setRemoteControl = false;
      }
    }

    return next;
  };
};
