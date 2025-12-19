# Architecture

## ゴール

- WebRTC / Signaling / UI / Vehicle-Bridge を分離し、拡張（overlay / input / inference）が増えても破綻しない。
- “最新値が参照できる pub/sub” による疎結合連携を確立する。
- 研究用途のため、ログと観測を最初から組み込む。

## 役割と境界

### apps/monitor-offer（監視側）

- 映像受信（remote stream）
- 操作入力（gamepad 等）→ control topic に出力
- 制御を DataChannel 経由で車両へ送信
- overlay 表示（drawCanvas：映像 + topics）

### apps/vehicle-answer（車両側）

- 映像送信（local stream / カメラ）
- DataChannel 経由で制御を受信 → vehicle command topic
- 必要なら bridge 経由で車両ネイティブへ転送
- テレメトリ（車両状態）を topics に出して送信（DataChannel 等）

### services/signaling（シグナリング）

- room 管理（最小）
- offer/answer/candidate の中継

### services/bridge-autorun（Node ブリッジ）

- 車両ネイティブアプリ ↔ ブラウザ（車両側）の橋渡し
- プロトコル詳細は docs/protocol.md に従う（実装は adapter として注入可能にする）

## レイヤ（推奨）

- packages/pubsub : TopicStore（最新値保持）
- packages/core : 純粋ロジック（変換/状態機械/計算）
- packages/adapters:
  - webrtc（RTCPeerConnection の薄いラッパ）
  - signaling-ws（WebSocket 等の薄いラッパ）
  - media（getUserMedia 等）
  - bridge（Node/UDP/WS など：車両連携）
- packages/features:
  - call（接続ユースケース：connect/reconnect/close）
  - control（control を送る/受ける）
  - telemetry（テレメトリ送受信）
  - overlay（描画）
  - inference（推論実行、結果 topic 化）

## “相互参照禁止” の具体

- packages 配下は「他 packages を import しない」
- createX は deps を引数で受け取る
- apps/ の wiring だけが import して繋ぐ

## 重いデータの扱い（重要）

- video frame や巨大配列は topic に載せない
- topic には「推論結果」「操作量」「状態」「メトリクス」など軽量データを流す
- drawCanvas / inference は video 要素や stream を直接受け取り、結果だけ topic に出す
