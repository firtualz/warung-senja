// SUNSET STALL — titik masuk & mesin permainan: state, loop, malam, dan semua aksi.
// Satu kalimat: sajikan mangkuk yang tepat sebelum sabar pelanggan habis.
import {
  W, H, MENU, MENU_ORDER, NIGHTS, TOTAL_NIGHTS, GOAL_COINS, MAX_ANGRY_PER_NIGHT,
  START_COINS, START_STOCK, tipFor, fmtRp, mulberry32,
} from './config.js';
import { SoundFX } from './audio.js';
import { FX } from './fx.js';
import { Customer, makeOrder } from './customers.js';
import { Kitchen } from './cooking.js';
import { Economy } from './economy.js';
import { drawScene, seatXPositions } from './render.js';
import { attachInput, hitUI } from './input.js';
import { setupShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;

// Tangkap error runtime agar terlihat saat playtest (bukan diam-diam mematikan loop).
window.addEventListener('error', (e) => {
  window.__err = e.message;
});

const BEST_KEY = 'warung-senja-best';

function loadBest() {
  try {
    return parseInt(localStorage.getItem(BEST_KEY), 10) || 0;
  } catch {
    return 0;
  }
}

const s = {
  screen: 'title', // title | play | paused | shop | nightend | win | lose
  t: 0,
  night: 1,
  nightCfg: NIGHTS[0],
  nightClock: NIGHTS[0].clock,
  spawnTimer: 2,
  customers: [],
  selected: null,
  heldTray: -1,
  servedTonight: 0,
  angryTonight: 0,
  loseReason: '',
  best: loadBest(),
  ui: [],
  shotMode: false,
  rng: mulberry32((Date.now() % 2147483647) || 1),
  economy: new Economy(),
  kitchen: new Kitchen(),
  fx: new FX(),
  sound: new SoundFX(),
};
s.kitchen.stock = s.economy.stock;

window.__ws = s; // diekspos untuk playtest otomatis (bukan bagian dari skor).

function saveBest() {
  if (s.economy.earnedTotal > s.best) {
    s.best = s.economy.earnedTotal;
    try {
      localStorage.setItem(BEST_KEY, String(s.best));
    } catch {
      /* penyimpanan tidak tersedia: skor tetap ditampilkan sesi ini */
    }
  }
}

function newRun() {
  s.economy = new Economy();
  s.kitchen = new Kitchen();
  s.kitchen.stock = s.economy.stock;
  s.fx.clear();
  s.night = 1;
  s.selected = null;
  s.heldTray = -1;
  s.loseReason = '';
  s.rng = mulberry32((Date.now() % 2147483647) || 1);
  s.screen = 'title';
}

function startNight(n) {
  s.night = n;
  s.nightCfg = NIGHTS[n - 1];
  s.nightClock = s.nightCfg.clock;
  s.spawnTimer = 2;
  s.customers = [];
  s.selected = null;
  s.heldTray = -1;
  s.servedTonight = 0;
  s.angryTonight = 0;
  s.economy.resetNight();
  s.kitchen.reset();
  s.kitchen.setPotCount(s.economy.potCount);
  s.screen = 'play';
}

function endNight() {
  saveBest();
  s.screen = 'nightend';
  s.sound.ding();
}

function winGame() {
  saveBest();
  s.screen = 'win';
  s.sound.win();
}

function loseGame(reason) {
  s.loseReason = reason;
  saveBest();
  s.screen = 'lose';
  s.sound.lose();
}

function freeSeatIndex() {
  const used = new Set(s.customers.map((c) => c.seatIdx));
  for (let i = 0; i < s.economy.seatCount; i++) {
    if (!used.has(i)) return i;
  }
  return -1;
}

function spawnCustomer() {
  const seatIdx = freeSeatIndex();
  if (seatIdx < 0) return;
  const x = seatXPositions(s.economy.seatCount)[seatIdx];
  const c = new Customer(s.rng, s.night, x, 630);
  c.seatIdx = seatIdx;
  const order = makeOrder(s.rng, s.nightCfg);
  const patience = s.nightCfg.patience * (0.9 + s.rng() * 0.2);
  c.setOrder(order, patience);
  s.customers.push(c);
  s.sound.pop();
}

// --- Aksi pemain ---
function startCooking(dishId) {
  const r = s.kitchen.startCooking(dishId, s.economy.speedMul);
  if (r.ok) {
    s.sound.pop();
  } else if (r.reason === 'out of ingredients') {
    s.fx.floater(640, 640, 'Out of ingredients! Buy at the shop between nights.', '#ef476f');
    s.sound.angry();
  } else {
    s.fx.floater(640, 640, 'All pots are full!', '#ffb347');
  }
}

function takePot(i) {
  const pot = s.kitchen.pots[i];
  if (!pot) return;
  const r = s.kitchen.takeFromPot(pot);
  if (r.kind === 'perfect') {
    s.sound.perfect();
    s.fx.burst(pot.x, pot.y - 30, '#ffd166', 12, 110);
  } else if (r.kind === 'done') {
    s.sound.ding();
  } else if (r.kind === 'early') {
    s.fx.floater(pot.x, pot.y - 70, 'Not ready yet!', '#fff3d6');
    s.sound.click();
  } else if (r.kind === 'burnt') {
    s.fx.floater(pot.x, pot.y - 70, 'Burnt! Ingredients lost.', '#ef476f');
    s.sound.burn();
  } else if (r.kind === 'tray-full') {
    s.fx.floater(pot.x, pot.y - 70, 'Tray is full!', '#ffb347');
  }
}

function serveDishTo(cust, dishId, perfect) {
  if (!cust.serveDish(dishId)) {
    s.fx.floater(cust.x, cust.y - 230, 'Not their order!', '#ef476f');
    s.sound.click();
    return false;
  }
  const price = MENU[dishId].price;
  const amount = price + tipFor(price, cust.patienceFrac, perfect);
  s.economy.earn(amount);
  s.fx.floater(cust.x, cust.y - 230, '+' + fmtRp(amount), '#ffd166');
  s.fx.burst(cust.x, cust.y - 120, '#ffd166', 10, 90);
  if (perfect) {
    s.economy.perfectTotal++;
    s.sound.perfect();
  } else {
    s.sound.coin();
  }
  if (cust.done) {
    cust.leaving = true;
    cust.leaveTimer = 0.9;
    cust.result = 'served';
    s.servedTonight++;
    s.economy.servedTotal++;
    if (s.economy.earnedTotal >= GOAL_COINS) winGame();
  }
  return true;
}

function serveSelected() {
  const cust = s.selected;
  if (!cust || cust.leaving) return;
  // Cari hidangan di nampan yang dibutuhkan pelanggan terpilih.
  for (let i = 0; i < s.kitchen.tray.length; i++) {
    const item = s.kitchen.tray[i];
    if (cust.needs(item.dishId) >= 0) {
      s.kitchen.tray.splice(i, 1);
      if (s.heldTray === i) s.heldTray = -1;
      else if (s.heldTray > i) s.heldTray--;
      serveDishTo(cust, item.dishId, item.perfect);
      return;
    }
  }
  s.fx.floater(cust.x, cust.y - 230, 'That dish is not on the tray yet.', '#fff3d6');
}

function clickCustomer(cust) {
  if (s.heldTray >= 0) {
    const item = s.kitchen.tray[s.heldTray];
    if (item) {
      const ok = serveDishTo(cust, item.dishId, item.perfect);
      if (ok) {
        s.kitchen.tray.splice(s.heldTray, 1);
        s.heldTray = -1;
      }
      return;
    }
    s.heldTray = -1;
  }
  s.selected = cust;
  s.sound.click();
}

function clickTray(i) {
  s.heldTray = s.heldTray === i ? -1 : i;
  s.sound.click();
}

function toShop() {
  if (s.economy.bankrupt) {
    loseGame('Bankrupt: no ingredients left and not enough coins to shop.');
    return;
  }
  s.screen = 'shop';
}

function update(dt) {
  // Uap dari panci yang sedang masak.
  for (const pot of s.kitchen.pots) {
    if (pot.busy && Math.random() < dt * 6) s.fx.steam(pot.x, pot.y - 24);
  }
  s.kitchen.update(dt);

  // Pelanggan baru.
  s.spawnTimer -= dt;
  if (s.spawnTimer <= 0) {
    spawnCustomer();
    s.spawnTimer = s.nightCfg.spawn * (0.85 + s.rng() * 0.3);
  }

  // Pelanggan: sabar menipis; yang marah dihitung.
  for (const c of s.customers) {
    const wasLeaving = c.leaving;
    c.update(dt);
    if (c.leaving && !wasLeaving && c.result === 'angry') {
      s.angryTonight++;
      s.fx.floater(c.x, c.y - 230, 'Angry customer!', '#ef476f');
      s.sound.angry();
      if (s.angryTonight >= MAX_ANGRY_PER_NIGHT) {
        loseGame(`Three customers left angry on night ${s.night} — stall closed.`);
        return;
      }
    }
  }
  s.customers = s.customers.filter((c) => !c.gone);
  if (s.selected && (s.selected.gone || !s.customers.includes(s.selected))) s.selected = null;

  // Jam malam.
  s.nightClock -= dt;
  if (s.servedTonight >= s.nightCfg.target || s.nightClock <= 0) {
    if (s.night >= TOTAL_NIGHTS) {
      if (s.economy.earnedTotal >= GOAL_COINS) winGame();
      else loseGame(`Final night over — ${fmtRp(s.economy.earnedTotal)} of the ${fmtRp(GOAL_COINS)} goal.`);
    } else {
      endNight();
    }
    return;
  }
  if (s.economy.earnedTotal >= GOAL_COINS) winGame();
}

// --- Input ---
function handleClick(x, y) {
  s.sound.ensure();
  if (s.screen === 'title') {
    startNight(1);
    return;
  }
  if (s.screen === 'nightend') {
    toShop();
    return;
  }
  if (s.screen === 'win' || s.screen === 'lose') {
    newRun();
    return;
  }
  const hit = hitUI(s.ui, x, y);
  if (!hit) {
    if (s.screen === 'play') {
      s.selected = null;
      s.heldTray = -1;
    }
    return;
  }
  const [kind, arg] = hit.id.split(':');
  if (s.screen === 'shop') {
    if (kind === 'buy') {
      if (s.economy.buyIngredient(arg)) s.sound.coin();
      else s.sound.angry();
    } else if (kind === 'upgrade') {
      if (s.economy.buyUpgrade(arg)) {
        s.sound.perfect();
        s.kitchen.setPotCount(s.economy.potCount);
      } else s.sound.angry();
    } else if (hit.id === 'next-night') {
      startNight(s.night + 1);
    }
    return;
  }
  if (s.screen !== 'play') return;
  if (kind === 'dish') startCooking(arg);
  else if (kind === 'pot') takePot(Number(arg));
  else if (kind === 'tray') clickTray(Number(arg));
  else if (kind === 'cust') {
    const cust = s.customers.find((c) => c.id === Number(arg));
    if (cust && !cust.leaving) clickCustomer(cust);
  }
}

function handleKey(key) {
  s.sound.ensure();
  if (key === 'm' || key === 'M') {
    s.sound.toggleMute();
    return;
  }
  if (s.screen === 'title') {
    if (key === 'Enter' || key === ' ') startNight(1);
    return;
  }
  if (s.screen === 'nightend') {
    if (key === 'Enter' || key === ' ') toShop();
    return;
  }
  if (s.screen === 'win' || s.screen === 'lose') {
    if (key === 'r' || key === 'R' || key === 'Enter') newRun();
    return;
  }
  if (s.screen === 'shop') {
    if (key === 'Enter' || key === ' ') startNight(s.night + 1);
    return;
  }
  if (key === 'p' || key === 'P') {
    s.screen = s.screen === 'play' ? 'paused' : s.screen === 'paused' ? 'play' : s.screen;
    return;
  }
  if (key === 'r' || key === 'R') {
    newRun();
    return;
  }
  if (s.screen !== 'play') return;
  if (key === ' ') {
    serveSelected();
    return;
  }
  const dishId = MENU_ORDER.find((id) => MENU[id].key === key);
  if (dishId) startCooking(dishId);
}

attachInput(canvas, { onPointer: handleClick, onKey: handleKey });

// --- Loop utama ---
const params = new URLSearchParams(location.search);
const shotName = params.get('shot');
if (shotName) {
  setupShot(s, shotName);
  drawScene(ctx, s, 1.7);
  window.__shotReady = true;
} else {
  let last = performance.now();
  function frame(now) {
    try {
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      s.t += dt;
      if (s.screen === 'play') update(dt);
      s.fx.update(dt);
      drawScene(ctx, s, s.t);
    } catch (err) {
      window.__err = String(err && err.message ? err.message : err);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
