# Migration Plan (stepwise rewrite skeleton)

## What changed in this step
- Added wiring entrypoints: `apps/monitor-offer/main.js`, `apps/vehicle-answer/main.js`.
- Added shared utilities: `packages/pubsub/topicStore.js`, `packages/logging/createLogger.js`, `packages/protocol/README.md`.
- Added service placeholders: `services/signaling/README.md`, `services/bridge-autorun/README.md`.
- Centralized inference wiring into `createOfferInferenceController` / `createAnswerInferenceController` inside `inference.js`; legacy inference code was removed from `offer.js`/`answer.js`.

## How to run legacy flow (baseline check)
1) Start signaling server (legacy remains unchanged): `node signaling.js`.
2) Optional: start the vehicle bridge if you use the native app: `node AnswerToAutorun.js` (or `AnswerToAutorunUDP.js`).
3) Serve static files from the repo root (module imports require a server): for example `npx http-server . -p 8000` or `python -m http.server 8000`.
4) Open monitor UI: `http://localhost:8000/offer.html` (loads legacy `offer.js`).
5) Open vehicle UI: `http://localhost:8000/answer.html` (loads legacy `answer.js`).
6) Confirm signaling connects (console/log output) and video/control paths still behave as before.

## Trying the new wiring (still delegates to legacy)
- Swap the script tag in your HTML to the new entrypoint when ready:
  - Monitor: `<script type="module" src="./apps/monitor-offer/main.js" defer></script>`
  - Vehicle: `<script type="module" src="./apps/vehicle-answer/main.js" defer></script>`
- These files create shared topics (`connectionState`, `control`, `telemetry`, `logs`) and a logger, then import the legacy modules so behavior stays the same while exposing topics for future features.

## TopicStore / Logger quick example
```js
import { createTopicStore } from "./packages/pubsub/topicStore.js";
import { createLogger } from "./packages/logging/createLogger.js";

const topics = { logs: createTopicStore({ initialValue: [] }) };
const logger = createLogger({ logsTopic: topics.logs, namespace: "demo" });

topics.logs.subscribe((buffer) => console.debug("log buffer", buffer.slice(-1)));
logger.info({ event: "demo.start", message: "hello" });
```
