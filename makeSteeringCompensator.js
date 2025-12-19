// makeSteeringCompensator.js
// Ts [s], mu [s], omegaC [rad/s] を設定して関数を生成
// inputSteer -> inputCompedSteer（今回はリードのみ）

export function makeSteeringCompensator({
  Ts = 0.1, // サンプル周期 10 Hz
  mu = 0.337, // 平均遅延 [s]
  omegaC = 2 * Math.PI * 0.3, // 代表帯域 [rad/s]
  shaper = "NO", // "NO" | "ZVD" | "GAUSS5"
} = {}) {
  // --- 位相リード設計（IIR: y[k] = -a1*y[k-1] + b0*u[k] + b1*u[k-1]） ---
  const rho = Math.exp(omegaC * mu);
  const Tb = 1.0 / omegaC;
  const Tl = rho * Tb;
  const K = 2.0 / Ts;

  const a0 = 1 + Tb * K;
  const a1 = 1 - Tb * K;
  const b0 = 1 + Tl * K;
  const b1 = 1 - Tl * K;

  const coef = {
    a1: a1 / a0,
    b0: b0 / a0,
    b1: b1 / a0,
  };

  // --- 状態保持 ---
  let yPrev = 0.0;
  let uPrev = 0.0;

  // --- シェーピング用バッファ（必要時のみ使う） ---
  const d1 = Math.max(1, Math.round(mu / Ts));
  const d2 = 2 * d1;
  const dH = Math.max(1, Math.round((0.5 * mu) / Ts));
  const dH1 = dH,
    dH2 = 2 * dH,
    dH3 = 3 * dH,
    dH4 = 4 * dH;
  const bufLen = Math.max(d2 + 1, dH4 + 1);
  let buf = Array(bufLen).fill(0.0);
  let bufIdx = 0;
  function pushAndTap(u) {
    const N = buf.length;
    bufIdx = (bufIdx + 1) % N;
    buf[bufIdx] = u;
    const tap = (d) => {
      if (d >= N) return 0.0;
      let i = bufIdx - d;
      if (i < 0) i += N;
      return buf[i];
    };
    return tap;
  }

  // --- メイン関数 ---
  return function (inputSteer) {
    const u = inputSteer;

    // (1) 純リード（※ブレンド無し）
    const yLead = -coef.a1 * yPrev + coef.b0 * u + coef.b1 * uPrev;
    let uLead = yLead;
    yPrev = uLead;
    uPrev = u;

    // (2) 平滑化（必要なときのみ）
    if (shaper === "NO") {
      if (uLead > 70) {
        uLead = 70;
      } else if (uLead < -70) {
        uLead = -70;
      }
      return uLead; // ← バグ回避：デフォルトはリード出力をそのまま返す
    }

    const tap = pushAndTap(uLead);
    if (shaper === "ZVD") {
      const u0 = tap(0),
        u1 = tap(d1),
        u2 = tap(d2);
      return 0.25 * u2 + 0.5 * u1 + 0.25 * u0;
    } else if (shaper === "GAUSS5") {
      const u0 = tap(0),
        uH1 = tap(dH1),
        uH2 = tap(dH2),
        uH3 = tap(dH3),
        uH4 = tap(dH4);
      return (1 * u0 + 4 * uH1 + 6 * uH2 + 4 * uH3 + 1 * uH4) / 16.0;
    } else {
      return uLead; // 不明指定はフォールバック
    }
  };
}
