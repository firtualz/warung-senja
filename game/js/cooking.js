// WARUNG SENJA — dapur: tempat masak (panci), nampan sajian, dan stok bahan.
// Masak punya jendela "sempurna": ambil di zona hijau = masakan sempurna (+tip).
import { MENU, BASE_POTS, MAX_TRAY, clamp } from './config.js';

// Zona sempurna: progres masak 0.75..1.0. Lewat 1.0 + 1.5 detik = gosong.
export const PERFECT_FROM = 0.75;
export const BURN_AFTER = 1.0;
export const BURN_GRACE = 1.5;

export class Pot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dishId = null;
    this.progress = 0; // 0..1 = matang; >1 = lewat waktu
    this.cookTime = 1;
    this.burnt = false;
    this.flash = 0;
  }

  get busy() {
    return this.dishId !== null;
  }
  get done() {
    return this.busy && this.progress >= PERFECT_FROM && !this.burnt;
  }
  get perfect() {
    return this.busy && this.progress >= PERFECT_FROM && this.progress <= BURN_AFTER;
  }
  get overdone() {
    return this.busy && this.progress > BURN_AFTER;
  }

  start(dishId, cookTime) {
    this.dishId = dishId;
    this.cookTime = cookTime;
    this.progress = 0;
    this.burnt = false;
    this.flash = 0.3;
  }

  update(dt) {
    if (this.flash > 0) this.flash -= dt;
    if (!this.busy) return;
    this.progress += dt / this.cookTime;
    if (this.progress > BURN_AFTER + BURN_GRACE / this.cookTime) {
      this.burnt = true;
    }
  }

  // Ambil masakan: 'perfect' | 'done' | 'early' | 'burnt' | 'empty'
  take() {
    if (!this.busy) return { kind: 'empty' };
    if (this.burnt) {
      const id = this.dishId;
      this.dishId = null;
      this.progress = 0;
      return { kind: 'burnt', dishId: id };
    }
    if (this.progress < PERFECT_FROM) return { kind: 'early' };
    const wasPerfect = this.progress <= BURN_AFTER;
    const id = this.dishId;
    this.dishId = null;
    this.progress = 0;
    return { kind: wasPerfect ? 'perfect' : 'done', dishId: id };
  }

  clear() {
    this.dishId = null;
    this.progress = 0;
    this.burnt = false;
  }
}

export class Kitchen {
  constructor() {
    this.pots = [];
    this.tray = []; // { dishId, perfect }
    this.stock = {};
    this.potCount = BASE_POTS;
    this.relayout();
  }

  relayout() {
    this.pots = [];
    const startX = 170;
    for (let i = 0; i < this.potCount; i++) {
      this.pots.push(new Pot(startX + i * 130, 388));
    }
  }

  setPotCount(n) {
    this.potCount = n;
    this.relayout();
  }

  freePot() {
    return this.pots.find((p) => !p.busy) || null;
  }

  // Mulai masak: cek stok bahan, kurangi, pakai panci kosong.
  startCooking(dishId, speedMul) {
    const dish = MENU[dishId];
    if (!dish) return { ok: false, reason: 'no such dish' };
    for (const [ing, n] of Object.entries(dish.needs)) {
      if ((this.stock[ing] || 0) < n) return { ok: false, reason: 'out of ingredients' };
    }
    const pot = this.freePot();
    if (!pot) return { ok: false, reason: 'pots full' };
    for (const [ing, n] of Object.entries(dish.needs)) {
      this.stock[ing] -= n;
    }
    pot.start(dishId, dish.cookTime * speedMul);
    return { ok: true, pot };
  }

  takeFromPot(pot) {
    const r = pot.take();
    if (r.kind === 'perfect' || r.kind === 'done') {
      if (this.tray.length >= MAX_TRAY) {
        // Nampan penuh: masakan kembali ke panci tidak mungkin; buang dengan pesan.
        return { kind: 'tray-full' };
      }
      this.tray.push({ dishId: r.dishId, perfect: r.kind === 'perfect' });
    }
    return r;
  }

  update(dt) {
    for (const pot of this.pots) pot.update(dt);
  }

  reset() {
    for (const pot of this.pots) pot.clear();
    this.tray.length = 0;
  }
}
