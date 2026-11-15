// WARUNG SENJA — adegan screenshot yang deterministik (?shot=<nama>).
// Setiap adegan dirender oleh kode game yang sama (bukan gambar tempelan):
// state dibuat dari seed tetap, waktu dibekukan, lalu satu frame digambar.
// Dipakai untuk 4 screenshot: cover (gameplay langsung), title, play, nightend.
import { mulberry32, NIGHTS, GOAL_COINS } from './config.js';
import { Customer } from './customers.js';
import { seatXPositions } from './render.js';

function stagedCustomer(s, seatIdx, order, patienceFrac, servedFlags) {
  const rng = mulberry32(1000 + seatIdx * 77 + s.night * 13);
  const x = seatXPositions(s.economy.seatCount)[seatIdx];
  const c = new Customer(rng, s.night, x, 630);
  c.walkIn = 1;
  c.setOrder(order, NIGHTS[s.night - 1].patience);
  c.patience = c.patienceMax * patienceFrac;
  if (servedFlags) c.served = servedFlags.slice();
  return c;
}

export function setupShot(s, name) {
  s.shotMode = true;
  s.best = s.best || 0;
  if (name === 'title') {
    s.screen = 'title';
    return;
  }
  if (name === 'victory' || name === 'nightend') {
    s.screen = 'nightend';
    s.night = 2;
    s.nightCfg = NIGHTS[1];
    s.servedTonight = 7;
    s.angryTonight = 0;
    s.economy.coins = 209000;
    s.economy.earnedTonight = 84000;
    s.economy.earnedTotal = 179000;
    s.economy.servedTotal = 13;
    return;
  }
  if (name === 'play') {
    // Malam 3: pesanan kombo, satu pelanggan hampir marah, satu panci gosong.
    s.screen = 'play';
    s.night = 3;
    s.nightCfg = NIGHTS[2];
    s.economy.coins = 210000;
    s.economy.earnedTotal = 180000;
    s.economy.earnedTonight = 96000;
    s.economy.servedTotal = 20;
    s.servedTonight = 6;
    s.angryTonight = 1;
    s.nightClock = 90;
    s.kitchen.stock = { mie: 6, telur: 4, cabai: 5, gyoza: 3, teh: 6 };
    s.kitchen.setPotCount(2);
    const p0 = s.kitchen.pots[0];
    p0.start('kuah', 6);
    p0.progress = 1.35; // lewat waktu -> gosong
    p0.burnt = true;
    const p1 = s.kitchen.pots[1];
    p1.start('gyoza', 5);
    p1.progress = 0.9; // zona sempurna
    s.kitchen.tray = [{ dishId: 'kuah', perfect: true }];
    s.customers = [
      stagedCustomer(s, 0, ['kuah', 'pedas'], 0.2, [false, false]),
      stagedCustomer(s, 1, ['gyoza'], 0.6, [false]),
      stagedCustomer(s, 2, ['teh', 'kuah'], 0.5, [true, false]),
    ];
    s.selected = s.customers[0];
    return;
  }
  // cover (default): malam 2, 3 pelanggan, panci di zona sempurna, nampan terisi.
  s.screen = 'play';
  s.night = 2;
  s.nightCfg = NIGHTS[1];
  s.economy.coins = 125000;
  s.economy.earnedTotal = 95000;
  s.economy.earnedTonight = 62000;
  s.economy.servedTotal = 12;
  s.servedTonight = 4;
  s.angryTonight = 0;
  s.nightClock = 120;
  s.kitchen.stock = { mie: 8, telur: 5, cabai: 5, gyoza: 4, teh: 7 };
  s.kitchen.setPotCount(2);
  const p0 = s.kitchen.pots[0];
  p0.start('kuah', 6);
  p0.progress = 0.82; // zona sempurna
  const p1 = s.kitchen.pots[1];
  p1.start('pedas', 6);
  p1.progress = 0.35;
  s.kitchen.tray = [
    { dishId: 'gyoza', perfect: true },
    { dishId: 'teh', perfect: false },
  ];
  s.customers = [
    stagedCustomer(s, 0, ['kuah'], 0.75, [false]),
    stagedCustomer(s, 1, ['pedas', 'gyoza'], 0.45, [true, false]),
    stagedCustomer(s, 2, ['teh'], 0.85, [false]),
  ];
  s.selected = s.customers[1];
  void GOAL_COINS;
}
