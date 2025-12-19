# WebRTC Flow (Chrome-only, Monitor=offer, Vehicle=answer)

## å‰æ

- ç›£è¦–å´(offer)ã¯æ˜ åƒã‚’å—ä¿¡ã™ã‚‹ãŸã‚ã€æ˜ åƒãƒˆãƒ©ãƒ³ã‚·ãƒ¼ãƒã¯ recvonly ã‚’åŸºæœ¬ã¨ã™ã‚‹
- è»Šä¸¡å´(answer)ã¯æ˜ åƒã‚’é€ä¿¡ã™ã‚‹ãŸã‚ã€æ˜ åƒãƒˆãƒ©ãƒ³ã‚·ãƒ¼ãƒã¯ sendonly ã‚’åŸºæœ¬ã¨ã™ã‚‹
- åˆ¶å¾¡ãƒ»ãƒ†ãƒ¬ãƒ¡ãƒˆãƒªã¯ RTCDataChannel ã‚’åŸºæœ¬ï¼ˆå¿…è¦ãªã‚‰æ‹¡å¼µï¼‰

## çŠ¶æ…‹ï¼ˆä¾‹ï¼‰

- idle
- acquiring_media
- creating_peer
- negotiating
- exchanging_ice
- connected
- reconnecting
- closing
- closed
- error

## ç›£è¦–å´(offer)ã®ãƒ•ãƒ­ãƒ¼

1. create pc
2. create DataChannel (control)
   - dc = pc.createDataChannel('control', { ordered: true })
3. transceiver ã‚’ recvonly ã§ç”¨æ„ï¼ˆæ˜ åƒå—ä¿¡ç”¨ï¼‰
   - pc.addTransceiver('video', { direction: 'recvonly' })
   - pc.addTransceiver('audio', { direction: 'recvonly' })ï¼ˆå¿…è¦ãªã‚‰ï¼‰
4. offer ä½œæˆ
   - offer = await pc.createOffer()
   - await pc.setLocalDescription(offer)
   - signaling.send({ type:'offer', sdp: pc.localDescription })
5. answer å—ä¿¡
   - await pc.setRemoteDescription(answer)
6. ICE candidate äº¤æ›
7. connected
   - pc.connectionState / iceConnectionState ç›£è¦–
   - ontrack ã§ remote stream ã‚’å—ã‘å–ã‚Š UI ã«æ¸¡ã™

## è»Šä¸¡å´(answer)ã®ãƒ•ãƒ­ãƒ¼

1. acquire local mediaï¼ˆæ˜ åƒé€ä¿¡ç”¨ï¼‰
   - localStream = await getUserMedia({ video:true, audio:false(å¿…è¦ãªã‚‰) })
2. create pc
3. local track ã‚’è¿½åŠ ï¼ˆsendonlyï¼‰
   - localStream.getTracks().forEach(t => pc.addTrack(t, localStream))
   - å¿…è¦ãªã‚‰ transceiver direction ã‚’ sendonly ã«æƒãˆã‚‹
4. offer å—ä¿¡
   - await pc.setRemoteDescription(offer)
5. answer ä½œæˆ
   - answer = await pc.createAnswer()
   - await pc.setLocalDescription(answer)
   - signaling.send({ type:'answer', sdp: pc.localDescription })
6. ICE candidate äº¤æ›
7. DataChannel å—ä¿¡ï¼ˆcontrolï¼‰
   - pc.ondatachannel = (e) => { dc = e.channel; dc.onmessage = ... }

## ICE candidate ã®é †åºå•é¡Œï¼ˆå¿…é ˆï¼‰

- remoteDescription æœªè¨­å®šã®é–“ã« candidate ãŒæ¥ã‚‹å ´åˆãŒã‚ã‚‹
  - queue ã«æºœã‚ã¦ã€remoteDescription è¨­å®šå¾Œã« addIceCandidate

## åˆ‡æ–­/å†æ¥ç¶šï¼ˆæœ€å°æ–¹é‡ï¼‰

- åˆ‡æ–­:
  - dc close
  - pc close
  - ã‚¤ãƒ™ãƒ³ãƒˆãƒãƒ³ãƒ‰ãƒ©è§£é™¤
  - local track stopï¼ˆè»Šä¸¡å´ï¼‰
- å†æ¥ç¶š:
  - æ—§ pc ã‚’å®Œå…¨ã«ç ´æ£„ â†’ æ–° pc ã‚’ä½œæˆ â†’ negotiate ã‚’ã‚„ã‚Šç›´ã™
  - backoffï¼ˆä¾‹: 0.5s, 1s, 2sâ€¦ æœ€å¤§ N å›ï¼‰

## 1:N ‘Î‰ipure WebRTC ‚ğ•¡”Ô—¼‚ÖŠg’£‚·‚éê‡‚Ìwjj

- —vŒ: monitor(offer) ‚ª•¡” vehicle(answer) ‚ğ“¯‚ÉŠÄ‹‚µAŠeÚ‘±‚ÌØ’f/ÄÚ‘±‚ğŒÂ•Ê‚É§Œä‚·‚éB
- ƒVƒOƒiƒŠƒ“ƒO‚É•”‰®–¼EƒyƒA–¼‚ğ‚½‚¹AƒƒbƒZ[ƒW‚ğu‚Ç‚Ì•”‰®‚Ì’Nˆ¶‚Ä‚©v‚ğ–¾¦‚·‚éB
- ŠeÚ‘±ƒ†ƒjƒbƒg‚Í TopicStore ‚ğ’PˆÊ‚É•ªŠ„iconnectionState/control/telemetry/logsjBUI ‚ÍuƒJ[ƒhv‚ğ’Ç‰Á‚µ‚Ä•R•t‚¯‚éB

### ƒVƒOƒiƒŠƒ“ƒO‚ÌƒƒbƒZ[ƒW—á

- register: `{ type: "register", role: "offer"|"answer", roomId, peerId }`
- signaliSDP/ICEj: `{ type: "signal", roomId, from: { role, peerId }, to: { role, peerId }, data: { kind: "offer"|"answer"|"ice", sdp?, candidate? } }`
- ƒT[ƒo‚Í `Map<roomId, { offers: Map, answers: Map }>` ‚ğ‚¿A`roomId` ‚Æ `to.peerId` ‚Å“]‘—æ‚ğŒˆ’è‚·‚éB

### ƒNƒ‰ƒCƒAƒ“ƒg‘¤iofferj‚Ì—¬‚êi‘½‘ä”j

1. UI ‚ÅÔ—¼ƒJ[ƒh‚ğ’Ç‰Á ¨ `roomId`i—á: "farm-a"j‚Æ `targetPeerId`i—á: "tractor-01"j‚ğ“ü—ÍB
2. ŠeƒJ[ƒh‚²‚Æ‚É `createConnectionUnit({ roomId, localPeerId, targetPeerId, transport: "pure-webrtc" })` ‚ğ¶¬B
3. `register` ‚ğ‘—MŒãA‚»‚ÌƒJ[ƒhê—p‚Ì pc ‚ğì¬‚µAoffer/ICE ‚ğ `signal` ƒtƒH[ƒ}ƒbƒg‚Å‘—oB
4. `ontrack` ‚Æ DataChannel ‚ÍƒJ[ƒh‚É•R•t‚¢‚½ video/control UI ‚É‚Ì‚İ”½‰f‚·‚éB

### ƒNƒ‰ƒCƒAƒ“ƒg‘¤ianswerj‚Ì—¬‚êi‘½‘ä”j

1. ‹N“®‚É `roomId` ‚Æ `peerId`iÔ—¼IDj‚ğ“ü—Í‚µ‚Ä `register`B
2. `signal` ‚ğóM‚µ‚½‚ç `roomId` ‚Æ `to.peerId` ‚ª©•ªˆ¶‚Ä‚©‚ğŠm”F‚µ‚Ä‚©‚çˆ—B
3. ˆÈ~‚Í’PˆêÚ‘±‚Æ“¯—l‚É pc ‚ğ¶¬‚µAanswer/ICE ‚ğ `signal` ‚Å•ÔMB

### À‘•ƒƒ‚

- Šù‘¶‚Ì `signaling.js` ‚Í offer/answer ‚ğˆêˆÓ‚É‘z’è‚µ‚Ä‚¢‚é‚½‚ßAã‹L‚Ì message schema ‚É·‚µ‘Ö‚¦‚é•K—v‚ª‚ ‚éiroom ‚²‚Æ‚ÌƒŒƒWƒXƒgƒŠŠÇ—jB
- `apps/monitor-offer` ‚Å‚ÍƒJ[ƒh’Ç‰Áƒ{ƒ^ƒ“‚ÆAŠeƒJ[ƒh—p‚Ì video —v‘fEƒƒO•\¦‚ğ“®“I¶¬‚·‚é UI ‚É’uŠ·‚µ‚Ä‚¢‚­BTopicStore ‚ÅÅV’l‚ğw“Ç‚µA transport Ø‚è‘Ö‚¦ipure/oldskyway/newskywayj‚ÍƒJ[ƒh’PˆÊ‚Å‘I‘ğ‚·‚éB
