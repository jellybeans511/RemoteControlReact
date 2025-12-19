import React from "react";
import { VideoProfile } from "../../lib/types/vehicle";
import { VehicleTopics } from "../state/vehicleTopics";

type CameraControllerDeps = {
  topics: VehicleTopics;
};

export const useCameraController = ({ topics }: CameraControllerDeps) => {
  const stop = React.useCallback(() => {
    const current = topics.stream.get();
    try {
      current?.getTracks().forEach((track) => track.stop());
    } catch {
      /* ignore */
    }
    topics.stream.set(null);
  }, [topics.stream]);

  const capture = React.useCallback(async () => {
    const profile = topics.videoProfile.get();
    const constraints: MediaStreamConstraints = {
      video: {
        width: numberOrUndefined(profile.width),
        height: numberOrUndefined(profile.height),
        frameRate: numberOrUndefined(profile.frameRate),
        deviceId:
          profile.deviceId && profile.deviceId !== "default"
            ? { exact: profile.deviceId }
            : undefined,
      },
      audio: false,
    };
    const gUM = await navigator.mediaDevices.getUserMedia(constraints);
    stop();
    topics.stream.set(gUM);
    const track = gUM.getVideoTracks()[0];
    if (track && typeof track.getCapabilities === "function") {
      const caps = track.getCapabilities();
      topics.capabilities.set({
        widthMax: caps.width?.max,
        heightMax: caps.height?.max,
        frameRateMax: caps.frameRate?.max,
      });
    } else {
      topics.capabilities.set({});
    }
    return gUM;
  }, [stop, topics.stream, topics.videoProfile, topics.capabilities]);

  const applyOutboundConstraints = React.useCallback(
    async (req: Partial<VideoProfile>) => {
      const track = topics.stream.get()?.getVideoTracks()[0];
      if (!track) return;
      const cons: MediaTrackConstraints = {};
      if (Number.isFinite(req.width)) cons.width = { ideal: Number(req.width) };
      if (Number.isFinite(req.height)) cons.height = { ideal: Number(req.height) };
      if (Number.isFinite(req.frameRate)) cons.frameRate = { ideal: Number(req.frameRate) };
      try {
        await track.applyConstraints(cons);
        try {
          track.contentHint = "motion";
        } catch {
          /* ignore */
        }
      } catch (e) {
        console.warn("applyConstraints failed", e);
      }
    },
    [topics.stream]
  );

  const refreshDevices = React.useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = list.filter((d) => d.kind === "videoinput");
      topics.devices.set(videoInputs);
    } catch (e) {
      console.warn("enumerateDevices failed", e);
    }
  }, [topics.devices]);

  React.useEffect(() => {
    void refreshDevices();
    const handle = () => refreshDevices();
    navigator.mediaDevices.addEventListener("devicechange", handle);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handle);
    };
  }, [refreshDevices]);

  return {
    capture,
    stop,
    applyOutboundConstraints,
    refreshDevices,
  };
};

const numberOrUndefined = (value: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;
