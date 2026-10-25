// One global pointer, read by the cursor, the hero fluid and the 3D scene.
// Values are in CSS pixels; nx / ny are normalized to [-1, 1].

export const pointer = {
  x: typeof window === "undefined" ? 0 : window.innerWidth / 2,
  y: typeof window === "undefined" ? 0 : window.innerHeight / 2,
  nx: 0,
  ny: 0,
  active: false,
  lastMove: 0,
};

let bound = false;

export function bindPointer() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  const update = (x: number, y: number) => {
    pointer.x = x;
    pointer.y = y;
    pointer.nx = (x / window.innerWidth) * 2 - 1;
    pointer.ny = -((y / window.innerHeight) * 2 - 1);
    pointer.active = true;
    pointer.lastMove = performance.now();
  };
  window.addEventListener("pointermove", (e) => update(e.clientX, e.clientY), { passive: true });
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) update(t.clientX, t.clientY);
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
}
