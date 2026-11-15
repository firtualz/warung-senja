// WARUNG SENJA — data & tuning. Semua angka ekonomi di sini nyata dan dipakai
// langsung oleh permainan: harga jual, biaya bahan, target malam, dan upgrade.
export const W = 1280;
export const H = 720;

// Satu kalimat permainan: sajikan mangkuk yang tepat sebelum sabar pelanggan habis.
export const GOAL_COINS = 750000;
export const TOTAL_NIGHTS = 5;
export const WIN_TEXT = 'EARN Rp750.000 IN 5 NIGHTS';
export const CONTROLS_TEXT =
  '1-4 COOK  ·  CLICK POT TO TAKE DISH  ·  CLICK CUSTOMER TO SELECT  ·  SPACE SERVE  ·  P PAUSE  ·  R RESTART  ·  M SOUND';

export const MENU = {
  kuah: {
    id: 'kuah',
    name: 'BROTH RAMEN',
    price: 20000,
    needs: { mie: 1, telur: 1 },
    cookTime: 6,
    color: '#f4a259',
    key: '1',
  },
  pedas: {
    id: 'pedas',
    name: 'SPICY RAMEN',
    price: 22000,
    needs: { mie: 1, cabai: 1 },
    cookTime: 6,
    color: '#e4572e',
    key: '2',
  },
  gyoza: {
    id: 'gyoza',
    name: 'GYOZA',
    price: 15000,
    needs: { gyoza: 1 },
    cookTime: 5,
    color: '#e9c46a',
    key: '3',
  },
  teh: {
    id: 'teh',
    name: 'ICED TEA',
    price: 8000,
    needs: { teh: 1 },
    cookTime: 2.5,
    color: '#8ac926',
    key: '4',
  },
};
export const MENU_ORDER = ['kuah', 'pedas', 'gyoza', 'teh'];

// Bahan: harga per bungkus 10 buah.
export const INGREDIENTS = {
  mie: { name: 'Noodles', pack: 10, packPrice: 15000, color: '#f2c14e' },
  telur: { name: 'Egg', pack: 10, packPrice: 9000, color: '#fff3d6' },
  cabai: { name: 'Chili', pack: 10, packPrice: 6000, color: '#d62828' },
  gyoza: { name: 'Gyoza', pack: 10, packPrice: 24000, color: '#e9c46a' },
  teh: { name: 'Tea', pack: 10, packPrice: 6000, color: '#8ac926' },
};

export const UPGRADES = {
  stove: {
    id: 'stove',
    name: 'Fast Stove',
    desc: 'Cook 30% faster',
    price: 80000,
  },
  chair: {
    id: 'chair',
    name: 'Extra Seat',
    desc: '+1 customer can queue',
    price: 120000,
  },
  pot: {
    id: 'pot',
    name: 'Big Pot',
    desc: '+1 cooking spot',
    price: 100000,
  },
};

// Per malam: interval pelanggan baru, sabar (detik), target sajian, peluang pesanan ganda.
export const NIGHTS = [
  { spawn: 7.0, patience: 30, target: 6, combo: 0.0, clock: 180 },
  { spawn: 6.0, patience: 27, target: 7, combo: 0.0, clock: 180 },
  { spawn: 5.0, patience: 24, target: 8, combo: 0.3, clock: 180 },
  { spawn: 4.5, patience: 21, target: 9, combo: 0.5, clock: 180 },
  { spawn: 4.0, patience: 18, target: 10, combo: 0.7, clock: 180 },
];

export const START_COINS = 30000;
export const START_STOCK = { mie: 10, telur: 6, cabai: 6, gyoza: 6, teh: 6 };
export const MAX_ANGRY_PER_NIGHT = 3;
export const MAX_TRAY = 6;
export const BASE_POTS = 2;
export const BASE_SEATS = 3;

// Tip: sampai +50% harga saat sabar masih penuh; masakan sempurna +10% lagi.
export function tipFor(price, patienceFrac, perfect) {
  let tip = Math.round(price * 0.5 * patienceFrac);
  if (perfect) tip += Math.round(price * 0.1);
  return tip;
}

export function fmtRp(n) {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

// RNG kecil yang bisa di-seed (untuk screenshot yang deterministik).
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}
export function lerp(a, b, t) {
  return a + (b - a) * t;
}
