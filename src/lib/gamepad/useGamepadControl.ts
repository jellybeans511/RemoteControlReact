import { useEffect, useRef, useState } from "react";
import { ControlInfo } from "../types/telemetry";
import { createFarmingGamepadMapper, createInitialControl, createStandardGamepadMapper } from "./mapping";
import { getOrderedGamepads, OrderedGamepads } from "./orderGamepads";

export const useGamepadControl = () => {
  const [control, setControl] = useState<ControlInfo>(createInitialControl());
  const [pads, setPads] = useState<Gamepad[]>([]);
  const [ordered, setOrdered] = useState<OrderedGamepads>([null, null]);
  const controlRef = useRef<ControlInfo>(control);

  useEffect(() => {
    controlRef.current = control;
  }, [control]);

  useEffect(() => {
    let rafId: number | null = null;
    const standardMapper = createStandardGamepadMapper();
    const farmingMapper = createFarmingGamepadMapper();

    const readPads = () => {
      const list = navigator.getGamepads ? (Array.from(navigator.getGamepads()).filter(Boolean) as Gamepad[]) : [];
      setPads(list);
      const orderedPads = getOrderedGamepads(list as (Gamepad | null)[]);
      setOrdered(orderedPads);

      let next = controlRef.current;
      if (orderedPads[0] && orderedPads[1]) {
        next = farmingMapper(next, orderedPads[0], orderedPads[1]);
      } else if (list[0]) {
        next = standardMapper(next, list[0]);
      }

      if (next !== controlRef.current) {
        controlRef.current = next;
        setControl(next);
      }
      rafId = requestAnimationFrame(readPads);
    };

    readPads();

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return { control, pads, ordered };
};
