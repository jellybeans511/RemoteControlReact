export type OrderedGamepads = [Gamepad | null, Gamepad | null]; // [handle, panel]

export function getOrderedGamepads(raw: (Gamepad | null)[]): OrderedGamepads {
  const ordered: OrderedGamepads = [null, null];

  for (let i = 0; i < raw.length; i++) {
    const gamepad = raw[i];
    if (!gamepad) continue;

    const vendorMatch = gamepad.id.match(/Vendor: ([0-9a-f]+)/i);
    const productMatch = gamepad.id.match(/Product: ([0-9a-f]+)/i);

    if (vendorMatch && productMatch) {
      const vendorId = vendorMatch[1].toLowerCase();
      const productId = productMatch[1].toLowerCase();

      if (vendorId === "0f0d") {
        if (productId === "0182") {
          ordered[0] = gamepad;
        } else if (productId === "0183") {
          ordered[1] = gamepad;
        }
      }
    }

    if (!ordered[0] && gamepad.id.toUpperCase().includes("STEERING")) {
      ordered[0] = gamepad;
    }
    if (!ordered[1] && gamepad.id.toUpperCase().includes("PANEL")) {
      ordered[1] = gamepad;
    }
  }

  return ordered;
}
