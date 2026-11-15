// SUNSET STALL — pelanggan. Datang, memesan, menunggu dengan sabar yang menipis,
// lalu pergi senang (bayar + tip) atau marah (sabar habis).
import { MENU_ORDER, clamp } from './config.js';

const SKINS = ['#f2c9a0', '#e8b88a', '#d9a06b', '#c98d5f', '#8d5524'];
const SHIRTS = ['#e4572e', '#2a9d8f', '#e9c46a', '#7b2fbe', '#ef476f', '#118ab2', '#06d6a0'];
const HAIRS = ['#2b2b2b', '#4a2c14', '#6b4226', '#111111', '#7a7a7a'];
const NAMES = ['Rani', 'Budi', 'Sinta', 'Agus', 'Maya', 'Dedi', 'Laras', 'Joko', 'Putri', 'Andi'];

let nextId = 1;

export class Customer {
  constructor(rng, night, seatX, seatY) {
    this.id = nextId++;
    this.rng = rng;
    this.night = night;
    this.x = seatX;
    this.y = seatY;
    this.skin = SKINS[Math.floor(rng() * SKINS.length)];
    this.shirt = SHIRTS[Math.floor(rng() * SHIRTS.length)];
    this.hair = HAIRS[Math.floor(rng() * HAIRS.length)];
    this.name = NAMES[Math.floor(rng() * NAMES.length)];
    this.hat = rng() < 0.25;
    this.hijab = rng() < 0.2;
    this.walkIn = 0; // 0..1, animasi masuk
    this.bob = rng() * Math.PI * 2;
    this.angryFlash = 0;
    this.happyFlash = 0;
    this.order = [];
    this.served = [];
    this.patience = 1;
    this.patienceMax = 1;
    this.leaving = false;
    this.leaveTimer = 0;
    this.result = null; // 'served' | 'angry'
  }

  // Pesanan: 1 hidangan, atau 2 hidangan (kombo) di malam yang lebih sulit.
  setOrder(orderItems, patienceSeconds) {
    this.order = orderItems.slice();
    this.served = orderItems.map(() => false);
    this.patienceMax = patienceSeconds;
    this.patience = patienceSeconds;
  }

  needs(dishId) {
    for (let i = 0; i < this.order.length; i++) {
      if (this.order[i] === dishId && !this.served[i]) return i;
    }
    return -1;
  }

  serveDish(dishId) {
    const idx = this.needs(dishId);
    if (idx < 0) return false;
    this.served[idx] = true;
    this.happyFlash = 0.6;
    return true;
  }

  get done() {
    return this.order.length > 0 && this.served.every(Boolean);
  }

  get patienceFrac() {
    return clamp(this.patience / this.patienceMax, 0, 1);
  }

  update(dt) {
    this.bob += dt * 3;
    if (this.walkIn < 1) this.walkIn = Math.min(1, this.walkIn + dt * 1.6);
    if (this.angryFlash > 0) this.angryFlash -= dt;
    if (this.happyFlash > 0) this.happyFlash -= dt;
    if (!this.leaving) {
      this.patience -= dt;
      if (this.patience <= 0) {
        this.patience = 0;
        this.leaving = true;
        this.leaveTimer = 0.9;
        this.result = 'angry';
      }
    } else {
      this.leaveTimer -= dt;
    }
  }

  get gone() {
    return this.leaving && this.leaveTimer <= 0;
  }
}

// Pilih hidangan untuk pelanggan baru: menu acak, kombo mengikuti peluang malam.
export function makeOrder(rng, nightCfg) {
  const first = MENU_ORDER[Math.floor(rng() * MENU_ORDER.length)];
  if (rng() < nightCfg.combo) {
    let second = MENU_ORDER[Math.floor(rng() * MENU_ORDER.length)];
    let guard = 0;
    while (second === first && guard++ < 5) {
      second = MENU_ORDER[Math.floor(rng() * MENU_ORDER.length)];
    }
    return [first, second];
  }
  return [first];
}
