// SUNSET STALL — input: klik mouse (dipetakan ke koordinat logis 1280x720) dan
// keyboard. Satu tugas saja: mengubah kejadian browser menjadi panggilan handler.
export function attachInput(canvas, handlers) {
  function toLogical(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * canvas.width) / r.width,
      y: ((e.clientY - r.top) * canvas.height) / r.height,
    };
  }
  canvas.addEventListener('pointerdown', (e) => {
    const p = toLogical(e);
    handlers.onPointer(p.x, p.y);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
    handlers.onKey(e.key);
  });
}

// Cari elemen UI (dari daftar hit yang dibangun render) di titik klik.
// Daftar dibangun dalam urutan gambar: elemen terakhir = paling atas.
export function hitUI(ui, x, y) {
  for (let i = ui.length - 1; i >= 0; i--) {
    const r = ui[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r;
  }
  return null;
}
