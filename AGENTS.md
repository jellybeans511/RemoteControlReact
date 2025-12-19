# AGENTS.md — WebRTC Remote Driving Rewrite

コードの解説は日本語ですること。

## プロジェクト概要

- WebRTC を使った遠隔運転アプリ。
- offer = 監視側（遠隔監視 UI）。主に「映像・テレメトリを受信」し、「操舵などの制御を送信」する。
- answer = 車両側（ブラウザ）。主に「映像を送信」し、「制御を受信」する。
- signaling.js = シグナリングサーバ。
- AnswerToAutorun.js (等) = 車両ネイティブアプリとブラウザを繋ぐ Node.js ブリッジ。

## 目的（最重要）

- 大幅リライトにより、拡張（drawCanvas / gamepad / inference 等）が増えても破綻しない構造にする。
- “常に最新値が参照できる pub/sub” を中心に、各機能が疎結合に連携できるようにする。
- WebRTC/Signaling/UI/Vehicle-Bridge を明確に分離し、差し替えやテストが可能な形にする。

## 非ゴール

- offer.js,offer.html,answer.js,answer.html のリファクタリング
- typescript+React による型付け+再利用コンポーネントを意識した設計

## 技術前提

- 言語: UI 部分は TypeScript+React
- 関数: html 要素に関係ない関数のみで十分な箇所は TypeScript で記述し外部から使用する
- ファイル構成: main となるアプリに加えて、gamepad や canvas,SteerCompensation など多機能なものは外部のファイルにそれぞれ分ける
- ブラウザ: Chrome のみ
- WebRTC: ブラウザ標準 API（RTCPeerConnection / getUserMedia / RTCDataChannel）
- Node: signaling と bridge は Node.js（バージョンは package.json に合わせる）

## コーディング方針（関数型・依存注入・機能分割）

- class は使わない（必要なら plain object + 関数で表現）
- ピュア関数を優先し、副作用（I/O・DOM・WebRTC・WebSocket 等）は adapter に隔離する
- “ファイル同士が最新値を参照” は **TopicStore（最新値保持 + subscribe）** 経由に統一する
- 機能同士は直接 import で結合しない：
  - 各機能は `createX({ deps... }) => { start, stop, ... }` を export
  - 実体（webrtc, ws, dom, storage, logger, clock, bus 等）は app の wiring 層が注入する
  - features/ や packages/ 同士の相互参照は禁止（参照したいなら deps として注入する）

## pub/sub（TopicStore）の要件

- subscribe できる
- 最新値を get() で取れる（BehaviorSubject 的）
- 値は小さく保つ（巨大オブジェクトや video frame を流し過ぎない）

## WebRTC の条件

- offer/answer の役割は “接続の役割” と “送受信方向” を切り分ける：
  - 監視側(offer)は `recvonly`（映像受信）+ 制御用 DataChannel（送信）
  - 車両側(answer)は `sendonly`（映像送信）+ DataChannel（受信）
- 切断時は pc / track / handler / channel を確実に解放する
- ICE / signaling の順序問題は queue と state で吸収する（docs/webrtc-flow.md に従う）

## 抽象化

- Pure WebRTC
  - SFU や TURN を使用しないメッシュの webrtc 接続
  - Signaling は本プロジェクト内に存在、STUN は別途存在しているので offer,asnwer 内に記載済み
- Old Skyway
  - Skyway という外部サービスの使用
  - 独自 API が多いので WebRTC 関連の映像品質調整などは必要なし
  - 遠隔運転をするためのゲームパッドなどは使用するものの、純粋な webrtc と API が異なる部分はスキップ可
- New Skyway
  - 現在開発中で、枠だけ作り、実装は未着手で OK
  - 現在使用が可能となった新 Skyway であるが、Old Skyway とは互換性がない
