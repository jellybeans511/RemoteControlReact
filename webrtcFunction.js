export function prioritizeSelectedVideoCodec(sdp) {
  // 1. ユーザーが選択したコーデック名を取得（AV1, VP9, H264, VP8 など）
  const codecSelect = document.getElementById("video-codec-select");
  const preferredCodec = codecSelect.value;
  // 例: "AV1", "VP9", "H264", "VP8"

  // 2. SDPのビデオ部分を取得
  const videoSection = sdp.match(/m=video .*\r\n(.*\r\n)+/g)?.[0];
  if (!videoSection) {
    console.warn("No video section found in SDP.");
    return sdp;
  }

  // 3. 取得したコーデックのpayloadTypeを探す
  //    - 例: a=rtpmap:45 AV1/90000 -> (45, "AV1/90000")
  //    - 正規表現のコーデック部は preferredCodec/ (例: "AV1/")
  //    - /90000 などは \d+ でマッチさせる
  const pattern = new RegExp(`a=rtpmap:(\\d+) ${preferredCodec}\\/\\d+`);
  const match = videoSection.match(pattern);
  if (!match) {
    console.warn(`${preferredCodec} codec not found in SDP.`);
    return sdp;
  }
  const preferredPayloadType = match[1]; // 例: "45"

  // 4. m=video行を取り出し
  //    例: "m=video 9 UDP/TLS/RTP/SAVPF 96 97 98 45 49 ..."
  const mLine = videoSection.match(/m=video [^\r\n]+/)?.[0];
  if (!mLine) {
    console.warn("No m=video line found in SDP video section.");
    return sdp;
  }

  // 5. m=video行を空白区切りで分割 -> [ 'm=video','9','UDP/TLS/RTP/SAVPF','96','97','98','45','49',... ]
  let tokens = mLine.split(" ");

  // 最初の3つ('m=video','9','UDP/TLS/RTP/SAVPF')はヘッダ部分、それ以降がコーデックのペイロードタイプ
  const header = tokens.slice(0, 3);
  let payloadTypes = tokens.slice(3);

  // 6. 指定コーデックのペイロードタイプがあれば削除して先頭に移動
  const index = payloadTypes.indexOf(preferredPayloadType);
  if (index !== -1) {
    payloadTypes.splice(index, 1); // 一度削除して
  }
  // 先頭に追加
  payloadTypes.unshift(preferredPayloadType);

  // 7. 新しい m=video行を組み立て
  const newMLine = header.join(" ") + " " + payloadTypes.join(" ");

  // 8. videoセクション内の m=video行だけ置き換え
  const updatedVideoSection = videoSection.replace(mLine, newMLine);

  // 9. SDP全体で videoセクションを置き換え
  return sdp.replace(videoSection, updatedVideoSection);
}

export function obtainStatsInfo(pc) {
  const stats = pc.getStats();
  stats.then((result) => {
    result.forEach((report) => {
      console.log(report);
    });
  });
}

export function setVideoQuality(dataChannel) {
  if (dataChannel && dataChannel.readyState === "open") {
    dataChannel.send(
      JSON.stringify({
        type: "videoQualityChange",
        bitrate: document.getElementById("set-video-bitrate").value,
        framerate: document.getElementById("set-video-framerate").value,
        height: document.getElementById("set-video-height").value,
        width: document.getElementById("set-video-width").value,
      })
    );
    console.log("Video quality settings sent to peer connection.");
  } else {
    console.error("DataChannel is not open");
  }
}

// SDPフィルタリング: チェックボックス指定に基づいて、特定の制御系を削除
// options = {
//   disableTcc: boolean,
//   disableTwccExtmap: boolean,
//   disableRemb: boolean,
//   disableNackPliFir: boolean,
//   disableRtcpRsize: boolean,
// }
export function filterSdpByOptions(sdp, options = {}) {
  const {
    disableTcc = false,
    disableTwccExtmap = false,
    disableRemb = false,
    disableNackPliFir = false,
    disableRtcpRsize = false,
  } = options;

  const lines = sdp.split("\r\n");
  const shouldRemove = (line) => {
    if (!line) return false; // keep trailing blank

    // a=rtcp-fb:* transport-cc
    if (disableTcc && /^a=rtcp-fb:.*\btransport-cc\b/i.test(line)) return true;

    // a=extmap:* transport-wide-cc
    if (disableTwccExtmap && /^a=extmap:.*transport-?wide-?cc/i.test(line))
      return true;

    // a=rtcp-fb:* goog-remb
    if (disableRemb && /^a=rtcp-fb:.*\bgoog-remb\b/i.test(line)) return true;

    // a=rtcp-fb:* nack / pli / fir
    if (disableNackPliFir && /^a=rtcp-fb:.*\b(nack|pli|fir)\b/i.test(line))
      return true;

    // a=rtcp-rsize
    if (disableRtcpRsize && /^a=rtcp-rsize\b/i.test(line)) return true;

    return false;
  };

  const filtered = lines.filter((l) => !shouldRemove(l));
  // Preserve final CRLF if present by keeping trailing empty element
  return filtered.join("\r\n");
}

// UI helper: read checkbox states to build SDP filter options
export function getSdpFilterOptionsFromUi() {
  const byId = (id) => {
    const el = document.getElementById(id);
    return !!(el && el.checked);
  };
  return {
    disableTcc: byId("disable-tcc"),
    disableTwccExtmap: byId("disable-twcc-extmap"),
    disableRemb: byId("disable-remb"),
    disableNackPliFir: byId("disable-nack-pli-fir"),
    disableRtcpRsize: byId("disable-rtcp-rsize"),
  };
}

// UI helper: whether to use STUN/TURN (iceServers)
export function getUseIceServersFromUi() {
  const el = document.getElementById("use-stun-turn");
  return !!(el && el.checked);
}

// Debug helper: scan SDP for disallowed tokens based on options
export function scanBannedSdpTokens(sdp, options = {}) {
  const {
    disableTcc = false,
    disableTwccExtmap = false,
    disableRemb = false,
    disableNackPliFir = false,
    disableRtcpRsize = false,
  } = options;

  const hits = [];
  const lines = (sdp || "").split("\r\n");
  for (const l of lines) {
    if (!l) continue;
    if (disableTcc && /^(a=rtcp-fb:.*\btransport-cc\b)/i.test(l)) hits.push(l);
    if (disableTwccExtmap && /^a=extmap:.*transport-?wide-?cc/i.test(l)) hits.push(l);
    if (disableRemb && /^(a=rtcp-fb:.*\bgoog-remb\b)/i.test(l)) hits.push(l);
    if (disableNackPliFir && /^a=rtcp-fb:.*\b(nack|pli|fir)\b/i.test(l)) hits.push(l);
    if (disableRtcpRsize && /^a=rtcp-rsize\b/i.test(l)) hits.push(l);
  }
  return hits;
}
