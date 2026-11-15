// WARUNG SENJA — gambar. Semua grafis digambar dengan Canvas 2D (bentuk datar,
// gradien hangat): langit senja Surabaya, lampion, warung kayu, pelanggan, dan HUD.
// Tidak ada gambar atau font dari luar: semua dari kode ini.
import { W, H, MENU, MENU_ORDER, INGREDIENTS, UPGRADES, GOAL_COINS, WIN_TEXT, CONTROLS_TEXT, fmtRp } from './config.js';

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function text(ctx, str, x, y, size, color, align, weight) {
  ctx.font = `${weight || 'bold'} ${size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color || '#fff3d6';
  ctx.fillText(str, x, y);
}

export function outlinedText(ctx, str, x, y, size, color, align, weight) {
  ctx.font = `${weight || 'bold'} ${size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.max(3, size / 5);
  ctx.strokeStyle = 'rgba(30,14,8,0.9)';
  ctx.strokeText(str, x, y);
  ctx.fillStyle = color || '#fff3d6';
  ctx.fillText(str, x, y);
}

// Ikon hidangan kecil (dipakai di bubble pesanan, nampan, dan tombol).
export function drawDishIcon(ctx, dishId, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  const u = s / 2;
  if (dishId === 'kuah' || dishId === 'pedas') {
    // Mangkuk ramen: mangkuk + mi + telur + sumpit; pedas = cabai merah.
    ctx.fillStyle = '#2a6f97';
    ctx.beginPath();
    ctx.moveTo(-u, -u * 0.2);
    ctx.quadraticCurveTo(-u * 0.9, u * 0.9, 0, u * 0.95);
    ctx.quadraticCurveTo(u * 0.9, u * 0.9, u, -u * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f2c14e';
    ctx.fillRect(-u * 0.8, -u * 0.35, u * 1.6, u * 0.3);
    ctx.fillStyle = '#fff3d6';
    ctx.beginPath();
    ctx.arc(-u * 0.3, -u * 0.2, u * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f4a259';
    ctx.beginPath();
    ctx.arc(u * 0.35, -u * 0.2, u * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = u * 0.12;
    ctx.beginPath();
    ctx.moveTo(-u * 0.5, -u * 0.9);
    ctx.lineTo(u * 0.6, -u * 0.5);
    ctx.moveTo(-u * 0.3, -u * 1.0);
    ctx.lineTo(u * 0.8, -u * 0.6);
    ctx.stroke();
    if (dishId === 'pedas') {
      ctx.fillStyle = '#d62828';
      ctx.beginPath();
      ctx.ellipse(u * 0.55, -u * 0.55, u * 0.45, u * 0.18, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Uap
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = u * 0.1;
    ctx.beginPath();
    ctx.moveTo(-u * 0.4, -u * 1.1);
    ctx.quadraticCurveTo(-u * 0.2, -u * 1.4, -u * 0.4, -u * 1.6);
    ctx.moveTo(u * 0.2, -u * 1.1);
    ctx.quadraticCurveTo(u * 0.4, -u * 1.4, u * 0.2, -u * 1.6);
    ctx.stroke();
  } else if (dishId === 'gyoza') {
    // Pangsit: setengah lingkaran bergerigi.
    ctx.fillStyle = '#f7e3b0';
    ctx.beginPath();
    ctx.arc(0, u * 0.3, u * 0.9, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#c98d3f';
    ctx.lineWidth = u * 0.12;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
      const x = -u * 0.8 + (i * u * 1.6) / 4;
      ctx.moveTo(x, -u * 0.55);
      ctx.lineTo(x + u * 0.12, -u * 0.75);
    }
    ctx.stroke();
    ctx.fillStyle = '#e9c46a';
    ctx.beginPath();
    ctx.ellipse(0, u * 0.55, u * 0.7, u * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (dishId === 'teh') {
    // Gelas es teh: gelas + sedotan + es batu.
    ctx.fillStyle = 'rgba(190,230,255,0.85)';
    ctx.beginPath();
    ctx.moveTo(-u * 0.6, -u * 0.7);
    ctx.lineTo(u * 0.6, -u * 0.7);
    ctx.lineTo(u * 0.45, u * 0.9);
    ctx.lineTo(-u * 0.45, u * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c96f2e';
    ctx.fillRect(-u * 0.5, -u * 0.1, u, u * 0.85);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(-u * 0.3, u * 0.1, u * 0.35, u * 0.35);
    ctx.fillRect(u * 0.05, u * 0.35, u * 0.3, u * 0.3);
    ctx.strokeStyle = '#e4572e';
    ctx.lineWidth = u * 0.14;
    ctx.beginPath();
    ctx.moveTo(u * 0.2, -u * 0.6);
    ctx.lineTo(u * 0.45, -u * 1.3);
    ctx.stroke();
  }
  ctx.restore();
}

// --- Latar: langit senja, siluet kota, lampu string, lampion ---
export function drawBackground(ctx, t, seedGlow) {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#241640');
  sky.addColorStop(0.45, '#5b2a63');
  sky.addColorStop(0.75, '#c65a3c');
  sky.addColorStop(1, '#e8724a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Bintang di langit atas.
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 40; i++) {
    const x = (i * 173 + 41) % W;
    const y = ((i * 97 + 13) % 150) + 8;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i));
    ctx.globalAlpha = tw * 0.8;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Matahari terbenam.
  const sunY = 330 + Math.sin(t * 0.2) * 2;
  const glow = ctx.createRadialGradient(1080, sunY, 10, 1080, sunY, 220);
  glow.addColorStop(0, 'rgba(255,214,130,0.95)');
  glow.addColorStop(0.35, 'rgba(255,170,80,0.55)');
  glow.addColorStop(1, 'rgba(255,170,80,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(820, sunY - 230, 520, 460);
  ctx.fillStyle = '#ffd682';
  ctx.beginPath();
  ctx.arc(1080, sunY, 42, 0, Math.PI * 2);
  ctx.fill();

  // Siluet kota Surabaya: gedung + kubah masjid.
  ctx.fillStyle = '#3a1f4d';
  const buildings = [
    [0, 300, 90, 80], [95, 320, 70, 60], [170, 290, 110, 90], [285, 325, 60, 55],
    [350, 305, 90, 75], [445, 330, 70, 50], [520, 295, 100, 85], [625, 325, 80, 55],
    [710, 310, 90, 70], [805, 330, 60, 50], [870, 300, 110, 80], [985, 325, 70, 55],
  ];
  for (const [x, y, w, h] of buildings) ctx.fillRect(x, y, w, h);
  // Kubah masjid + menara.
  ctx.beginPath();
  ctx.arc(1150, 300, 46, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(1104, 300, 92, 80);
  ctx.fillRect(1216, 250, 16, 130);
  ctx.beginPath();
  ctx.moveTo(1210, 250);
  ctx.lineTo(1240, 250);
  ctx.lineTo(1224, 222);
  ctx.closePath();
  ctx.fill();

  // Jendela kota menyala.
  ctx.fillStyle = 'rgba(255,214,130,0.9)';
  for (let i = 0; i < 60; i++) {
    const x = (i * 211 + 53) % 1240 + 10;
    const y = 310 + ((i * 67) % 55);
    if ((i * 7) % 3 !== 0) ctx.fillRect(x, y, 5, 7);
  }

  // Tanah / jalan — hangat dan terang, dengan genangan cahaya lampion.
  const ground = ctx.createLinearGradient(0, 380, 0, H);
  ground.addColorStop(0, '#6b3a4a');
  ground.addColorStop(1, '#452642');
  ctx.fillStyle = ground;
  ctx.fillRect(0, 380, W, H - 380);
  for (const lx of [150, 700, 1180]) {
    const pool = ctx.createRadialGradient(lx, 640, 10, lx, 640, 190);
    pool.addColorStop(0, 'rgba(255,176,66,0.28)');
    pool.addColorStop(1, 'rgba(255,176,66,0)');
    ctx.fillStyle = pool;
    ctx.fillRect(lx - 190, 450, 380, 270);
  }
  // Peti & karung bahan di kiri bawah (mengisi ruang kosong yang gelap).
  ctx.fillStyle = '#7b4b2a';
  ctx.fillRect(70, 580, 70, 60);
  ctx.fillRect(150, 596, 70, 44);
  ctx.fillStyle = '#9c6644';
  ctx.fillRect(70, 580, 70, 10);
  ctx.fillRect(150, 596, 70, 10);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 580, 70, 60);
  ctx.strokeRect(150, 596, 70, 44);
  ctx.fillStyle = '#c9a86a';
  ctx.beginPath();
  ctx.ellipse(280, 622, 46, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(280, 606, 38, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a6d3b';
  ctx.fillRect(268, 588, 24, 10);
  // Papan menu berdiri di kanan bawah.
  ctx.fillStyle = '#2b1a12';
  roundRect(ctx, 1186, 520, 78, 118, 8);
  ctx.fill();
  ctx.strokeStyle = '#ffb347';
  ctx.lineWidth = 2;
  roundRect(ctx, 1186, 520, 78, 118, 8);
  ctx.stroke();
  text(ctx, 'MENU', 1225, 538, 13, '#ffb347');
  text(ctx, 'BROTH 20K', 1225, 562, 11, '#fff3d6');
  text(ctx, 'SPICY 22K', 1225, 582, 11, '#fff3d6');
  text(ctx, 'GYOZA 15K', 1225, 602, 11, '#fff3d6');
  text(ctx, 'TEA 8K', 1225, 622, 11, '#fff3d6');

  // Lampu string melintasi langit.
  ctx.strokeStyle = 'rgba(40,20,10,0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 96);
  ctx.quadraticCurveTo(W / 2, 150, W, 92);
  ctx.stroke();
  for (let i = 0; i < 14; i++) {
    const x = 40 + i * 90;
    const y = 96 + Math.sin((x / W) * Math.PI) * 52 + 8;
    const flick = 0.75 + 0.25 * Math.sin(t * 2 + i * 1.7);
    const g = ctx.createRadialGradient(x, y, 2, x, y, 26);
    g.addColorStop(0, `rgba(255,190,90,${0.85 * flick})`);
    g.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 26, y - 26, 52, 52);
    ctx.fillStyle = '#ffbe5a';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  void seedGlow;
}

// Lampion besar yang menggantung — focal light hangat.
export function drawLantern(ctx, x, y, r, t, phase) {
  const flick = 0.85 + 0.15 * Math.sin(t * 2.2 + phase);
  const glow = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 3.2);
  glow.addColorStop(0, `rgba(255,176,66,${0.5 * flick})`);
  glow.addColorStop(1, 'rgba(255,176,66,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - r - 26);
  ctx.lineTo(x, y - r);
  ctx.stroke();
  ctx.fillStyle = '#ffb347';
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(160,60,20,0.7)';
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(x, y, r * (1 - Math.abs(i) * 0.18), r * 1.15, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#d62828';
  ctx.fillRect(x - r * 0.35, y - r * 1.35, r * 0.7, r * 0.28);
  ctx.fillRect(x - r * 0.35, y + r * 1.05, r * 0.7, r * 0.28);
}

// --- Warung: atap, meja, juru masak ---
export function drawStall(ctx, t, s) {
  // Atap bergaris.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(30, 118);
  ctx.lineTo(760, 118);
  ctx.lineTo(730, 168);
  ctx.lineTo(60, 168);
  ctx.closePath();
  ctx.clip();
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#e4572e' : '#f7ede2';
    ctx.fillRect(30 + i * 62, 118, 62, 50);
  }
  ctx.restore();
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(30, 164, 730, 8);
  // Tiang kayu.
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(44, 168, 14, 240);
  ctx.fillRect(732, 168, 14, 240);

  // Meja kayu (counter) — panci & nampan duduk di atasnya.
  ctx.fillStyle = '#9c6644';
  ctx.fillRect(40, 400, 1200, 22);
  ctx.fillStyle = '#7b4b2a';
  ctx.fillRect(40, 422, 1200, 62);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (let x = 60; x < 1240; x += 90) ctx.fillRect(x, 422, 4, 62);
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(40, 484, 1200, 8);
  // Papan nama warung.
  ctx.fillStyle = '#2b1a12';
  roundRect(ctx, 300, 176, 260, 46, 10);
  ctx.fill();
  ctx.strokeStyle = '#ffb347';
  ctx.lineWidth = 3;
  roundRect(ctx, 300, 176, 260, 46, 10);
  ctx.stroke();
  text(ctx, 'WARUNG SENJA', 430, 200, 26, '#ffb347');

  // Juru masak di balik meja (tengah), mengaduk saat ada yang dimasak.
  const cooking = s.kitchen.pots.some((p) => p.busy);
  const bob = Math.sin(t * (cooking ? 7 : 2)) * (cooking ? 4 : 2);
  const cx = 560;
  ctx.fillStyle = '#2b1a12';
  ctx.beginPath();
  ctx.arc(cx, 330 + bob, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2c9a0';
  ctx.beginPath();
  ctx.arc(cx, 332 + bob, 30, 0, Math.PI * 2);
  ctx.fill();
  // Ikat kepala merah.
  ctx.fillStyle = '#d62828';
  ctx.fillRect(cx - 30, 306 + bob, 60, 12);
  ctx.fillRect(cx + 24, 306 + bob, 22, 10);
  // Mata + senyum.
  ctx.fillStyle = '#2b1a12';
  ctx.beginPath();
  ctx.arc(cx - 11, 330 + bob, 3.5, 0, Math.PI * 2);
  ctx.arc(cx + 11, 330 + bob, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2b1a12';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, 340 + bob, 9, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // Apron biru di balik meja.
  ctx.fillStyle = '#2a6f97';
  ctx.beginPath();
  ctx.moveTo(cx - 34, 400);
  ctx.lineTo(cx + 34, 400);
  ctx.lineTo(cx + 26, 372);
  ctx.lineTo(cx - 26, 372);
  ctx.closePath();
  ctx.fill();
  // Lengan mengaduk.
  ctx.strokeStyle = '#2a6f97';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 26, 384);
  ctx.lineTo(cx - 52, 396 + (cooking ? Math.sin(t * 7) * 5 : 0));
  ctx.moveTo(cx + 26, 384);
  ctx.lineTo(cx + 52, 396 - (cooking ? Math.sin(t * 7) * 5 : 0));
  ctx.stroke();
  ctx.lineCap = 'butt';
}

// --- Pelanggan ---
export function drawCustomer(ctx, c, t, selected) {
  const x = c.x;
  const y = c.y + Math.sin(c.bob) * 2;
  const walk = 1 - c.walkIn;
  const drawX = x + walk * 140; // masuk dari kanan
  const alpha = c.leaving ? Math.max(0, c.leaveTimer / 0.9) : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (selected) {
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(drawX, y + 6, 52, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Bayangan.
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(drawX, y + 4, 40, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  // Badan.
  ctx.fillStyle = c.shirt;
  roundRect(ctx, drawX - 30, y - 78, 60, 80, 16);
  ctx.fill();
  // Kepala.
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.arc(drawX, y - 100, 27, 0, Math.PI * 2);
  ctx.fill();
  if (c.hijab) {
    ctx.fillStyle = c.shirt;
    ctx.beginPath();
    ctx.arc(drawX, y - 102, 30, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(drawX - 30, y - 104, 60, 14);
  } else if (c.hat) {
    ctx.fillStyle = '#2b1a12';
    ctx.beginPath();
    ctx.ellipse(drawX, y - 118, 30, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(drawX - 20, y - 138, 40, 22);
  } else {
    ctx.fillStyle = c.hair;
    ctx.beginPath();
    ctx.arc(drawX, y - 106, 27, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
  }
  // Wajah.
  ctx.fillStyle = '#2b1a12';
  ctx.beginPath();
  ctx.arc(drawX - 9, y - 100, 3, 0, Math.PI * 2);
  ctx.arc(drawX + 9, y - 100, 3, 0, Math.PI * 2);
  ctx.fill();
  if (c.result === 'angry' || c.angryFlash > 0) {
    // Mulut marah.
    ctx.strokeStyle = '#2b1a12';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(drawX, y - 80, 8, 1.15 * Math.PI, 1.85 * Math.PI);
    ctx.stroke();
    // Alis marah.
    ctx.beginPath();
    ctx.moveTo(drawX - 14, y - 112);
    ctx.lineTo(drawX - 4, y - 108);
    ctx.moveTo(drawX + 14, y - 112);
    ctx.lineTo(drawX + 4, y - 108);
    ctx.stroke();
  } else if (c.happyFlash > 0) {
    ctx.strokeStyle = '#2b1a12';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(drawX, y - 92, 9, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#2b1a12';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(drawX, y - 92, 7, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // Bubble pesanan.
  const bw = 118;
  const bh = 62;
  const bx = drawX - bw / 2;
  const by = y - 208;
  ctx.fillStyle = 'rgba(255,250,240,0.97)';
  roundRect(ctx, bx, by, bw, bh, 12);
  ctx.fill();
  ctx.strokeStyle = '#2b1a12';
  ctx.lineWidth = 2;
  roundRect(ctx, bx, by, bw, bh, 12);
  ctx.stroke();
  ctx.fillStyle = '#fffaf0';
  ctx.beginPath();
  ctx.moveTo(drawX - 10, by + bh - 2);
  ctx.lineTo(drawX + 10, by + bh - 2);
  ctx.lineTo(drawX, by + bh + 12);
  ctx.closePath();
  ctx.fill();
  // Ikon hidangan dalam bubble + centang yang sudah disajikan.
  const n = c.order.length;
  c.order.forEach((dishId, i) => {
    const ix = drawX + (i - (n - 1) / 2) * 52;
    drawDishIcon(ctx, dishId, ix, by + 30, 44);
    if (c.served[i]) {
      ctx.strokeStyle = '#2a9d8f';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ix - 14, by + 30);
      ctx.lineTo(ix - 4, by + 40);
      ctx.lineTo(ix + 16, by + 16);
      ctx.stroke();
      ctx.lineCap = 'butt';
    }
  });
  // Bar sabar.
  const frac = c.patienceFrac;
  const barW = 96;
  const barX = drawX - barW / 2;
  const barY = by + bh + 16;
  ctx.fillStyle = 'rgba(20,10,10,0.7)';
  roundRect(ctx, barX - 2, barY - 2, barW + 4, 14, 7);
  ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#06d6a0' : frac > 0.25 ? '#ffb347' : '#ef476f';
  if (frac > 0) {
    roundRect(ctx, barX, barY, barW * frac, 10, 5);
    ctx.fill();
  }
  ctx.restore();
}

// --- Panci & nampan ---
export function drawPot(ctx, pot, t) {
  const x = pot.x;
  const y = pot.y;
  // Panci.
  ctx.fillStyle = '#3d3d3d';
  ctx.beginPath();
  ctx.moveTo(x - 52, y - 18);
  ctx.lineTo(x + 52, y - 18);
  ctx.lineTo(x + 44, y + 22);
  ctx.lineTo(x - 44, y + 22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#555';
  ctx.fillRect(x - 52, y - 22, 104, 8);
  ctx.fillStyle = '#2b2b2b';
  ctx.beginPath();
  ctx.arc(x, y + 22, 10, 0, Math.PI);
  ctx.fill();
  if (pot.busy) {
    // Isi mendidih + uap.
    const col = pot.burnt ? '#3a3a3a' : pot.perfect ? '#8ac926' : '#f4a259';
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(x, y - 18, 46, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Bar progres: abu-abu -> hijau zona sempurna -> merah gosong.
    const bw = 96;
    const bx = x - bw / 2;
    const by = y - 58;
    ctx.fillStyle = 'rgba(20,10,10,0.75)';
    roundRect(ctx, bx - 2, by - 2, bw + 4, 14, 7);
    ctx.fill();
    const p = Math.min(1, pot.progress);
    ctx.fillStyle = pot.burnt ? '#ef476f' : pot.perfect ? '#06d6a0' : '#ffb347';
    roundRect(ctx, bx, by, bw * p, 10, 5);
    ctx.fill();
    // Garis zona sempurna.
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(bx + bw * 0.75 - 1, by - 2, 2, 14);
    if (pot.burnt) {
      text(ctx, 'BURNT!', x, by - 16, 13, '#ef476f');
    } else if (pot.perfect) {
      text(ctx, 'PERFECT!', x, by - 16, 13, '#06d6a0');
    }
    drawDishIcon(ctx, pot.dishId, x, y - 34, 30);
  } else {
    ctx.fillStyle = 'rgba(255,243,214,0.5)';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EMPTY POT', x, y - 32);
  }
}

export function drawTray(ctx, tray, heldIdx) {
  const x0 = 700;
  const y = 388;
  text(ctx, 'SERVING TRAY', x0 + 130, y - 34, 15, '#fff3d6', 'center');
  for (let i = 0; i < 6; i++) {
    const x = x0 + i * 62;
    ctx.fillStyle = 'rgba(255,250,240,0.16)';
    roundRect(ctx, x, y - 26, 54, 54, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,243,214,0.4)';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y - 26, 54, 54, 10);
    ctx.stroke();
  }
  tray.forEach((item, i) => {
    const x = x0 + i * 62 + 27;
    drawDishIcon(ctx, item.dishId, x, y + 1, 44);
    if (item.perfect) {
      ctx.fillStyle = '#ffd166';
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', x + 18, y - 18);
    }
    if (heldIdx === i) {
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 4;
      roundRect(ctx, x0 + i * 62 - 3, y - 29, 60, 60, 12);
      ctx.stroke();
    }
  });
}

// --- HUD & tombol hidangan ---
export function seatXPositions(seatCount) {
  if (seatCount >= 4) return [790, 910, 1030, 1150];
  return [820, 960, 1100];
}

export function drawHUD(ctx, s) {
  ctx.fillStyle = 'rgba(20,10,16,0.72)';
  ctx.fillRect(0, 0, W, 58);
  // Koin.
  text(ctx, '💰 ' + fmtRp(s.economy.earnedTotal), 24, 30, 28, '#ffd166', 'left');
  text(ctx, '/ ' + fmtRp(GOAL_COINS), 24 + 200, 32, 17, '#fff3d6', 'left');
  // Malam + progres sajian.
  text(ctx, `NIGHT ${s.night}/5`, W / 2, 22, 24, '#fff3d6');
  text(ctx, `Served ${s.servedTonight}/${s.nightCfg.target} tonight  ·  Total ${s.economy.servedTotal}`, W / 2, 46, 15, '#ffd166');
  // Sabar warung + skor.
  const angry = s.angryTonight;
  text(ctx, `😡 ${angry}/${3}`, W - 260, 30, 24, angry > 0 ? '#ef476f' : '#fff3d6', 'left');
  text(ctx, 'BEST ' + fmtRp(s.best), W - 24, 30, 16, '#fff3d6', 'right');
  // Jam malam (sisa waktu) — garis tipis di bawah HUD.
  const frac = s.nightClock / s.nightCfg.clock;
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(0, 58, W, 4);
  ctx.fillStyle = frac > 0.3 ? '#06d6a0' : '#ef476f';
  ctx.fillRect(0, 58, W * frac, 4);
}

export function drawGoalBanner(ctx) {
  ctx.fillStyle = 'rgba(43,26,18,0.85)';
  ctx.fillRect(0, 62, W, 56);
  ctx.strokeStyle = 'rgba(255,179,71,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 118);
  ctx.lineTo(W, 118);
  ctx.stroke();
  outlinedText(ctx, '🎯 ' + WIN_TEXT, W / 2, 80, 21, '#ffd166');
  text(ctx, CONTROLS_TEXT, W / 2, 104, 14, '#fff3d6');
}

export function drawDishButtons(ctx, s) {
  const y = 652;
  const h = 60;
  const w = 288;
  const gap = 12;
  MENU_ORDER.forEach((dishId, i) => {
    const dish = MENU[dishId];
    const x = 40 + i * (w + gap);
    const stockOk = Object.entries(dish.needs).every(
      ([ing, n]) => (s.kitchen.stock[ing] || 0) >= n,
    );
    const potFree = s.kitchen.freePot() !== null;
    const enabled = stockOk && potFree && s.screen === 'play';
    ctx.fillStyle = enabled ? '#fffaf0' : 'rgba(60,40,30,0.85)';
    roundRect(ctx, x, y, w, h, 12);
    ctx.fill();
    ctx.strokeStyle = dish.color;
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, w, h, 12);
    ctx.stroke();
    drawDishIcon(ctx, dishId, x + 34, y + 30, 44);
    text(ctx, dish.name, x + 62, y + 20, 19, enabled ? '#2b1a12' : '#9a8a7a', 'left');
    text(ctx, fmtRp(dish.price), x + 62, y + 44, 18, enabled ? '#b3541e' : '#9a8a7a', 'left');
    // Tombol keyboard 1-4.
    ctx.fillStyle = '#2b1a12';
    roundRect(ctx, x + w - 44, y + 8, 34, 24, 6);
    ctx.fill();
    text(ctx, dish.key, x + w - 27, y + 21, 16, '#ffd166');
    // Bahan yang dibutuhkan (titik warna); abu-abu = stok habis.
    let dotX = x + 150;
    for (const [ing, n] of Object.entries(dish.needs)) {
      const have = (s.kitchen.stock[ing] || 0) >= n;
      ctx.fillStyle = have ? INGREDIENTS[ing].color : '#555';
      ctx.beginPath();
      ctx.arc(dotX, y + 44, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      dotX += 16;
    }
    s.ui.push({ id: 'dish:' + dishId, x, y, w, h });
  });
}

// --- Layar-layar ---
function dim(ctx, alpha) {
  ctx.fillStyle = `rgba(16,8,20,${alpha})`;
  ctx.fillRect(0, 0, W, H);
}

function panel(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(30,18,24,0.94)';
  roundRect(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = '#ffb347';
  ctx.lineWidth = 3;
  roundRect(ctx, x, y, w, h, 18);
  ctx.stroke();
}

export function drawTitle(ctx, s, t) {
  dim(ctx, 0.45);
  outlinedText(ctx, 'WARUNG SENJA', W / 2, 190, 84, '#ffb347');
  text(ctx, 'Night Ramen Stall — Surabaya', W / 2, 248, 26, '#fff3d6');
  outlinedText(ctx, '🎯 ' + WIN_TEXT, W / 2, 312, 22, '#ffd166');
  text(ctx, 'Serve the right bowl before patience runs out.', W / 2, 348, 20, '#fff3d6');
  text(ctx, '3 angry customers in one night = stall closed.', W / 2, 378, 18, '#ffb3a0');
  if (s.best > 0) {
    text(ctx, '🏆 BEST SCORE: ' + fmtRp(s.best), W / 2, 424, 24, '#ffd166');
  } else {
    text(ctx, 'No score yet — be the first cook!', W / 2, 424, 20, '#ffd166');
  }
  const pulse = 0.7 + 0.3 * Math.sin(t * 3);
  ctx.globalAlpha = pulse;
  outlinedText(ctx, 'CLICK OR PRESS ENTER TO START', W / 2, 500, 26, '#ffffff');
  ctx.globalAlpha = 1;
  text(ctx, CONTROLS_TEXT, W / 2, 556, 15, '#fff3d6');
  text(ctx, 'An original game — made for make.fun best-game-01', W / 2, 592, 14, 'rgba(255,243,214,0.7)');
}

export function drawShop(ctx, s) {
  dim(ctx, 0.6);
  panel(ctx, 190, 60, 900, 600);
  text(ctx, `SHOP — NIGHT ${s.night} DONE`, W / 2, 100, 30, '#ffb347');
  text(ctx, `Coins: ${fmtRp(s.economy.coins)}   ·   Goal: ${fmtRp(GOAL_COINS)} in 5 nights`, W / 2, 132, 18, '#fff3d6');
  text(ctx, 'BUY INGREDIENTS (per pack of 10)', 230, 168, 20, '#ffd166', 'left');
  let y = 188;
  for (const [id, ing] of Object.entries(INGREDIENTS)) {
    const stock = s.economy.stock[id] || 0;
    ctx.fillStyle = 'rgba(255,250,240,0.08)';
    roundRect(ctx, 220, y, 840, 42, 10);
    ctx.fill();
    ctx.fillStyle = ing.color;
    ctx.beginPath();
    ctx.arc(246, y + 21, 10, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, `${ing.name} — stock ${stock}`, 268, y + 22, 19, '#fff3d6', 'left');
    text(ctx, fmtRp(ing.packPrice) + ' / 10', 800, y + 22, 18, '#ffd166', 'left');
    const afford = s.economy.coins >= ing.packPrice;
    ctx.fillStyle = afford ? '#06d6a0' : 'rgba(120,110,100,0.8)';
    roundRect(ctx, 940, y + 5, 100, 30, 8);
    ctx.fill();
    text(ctx, 'BUY', 990, y + 21, 17, '#10231a');
    s.ui.push({ id: 'buy:' + id, x: 940, y: y + 5, w: 100, h: 30 });
    y += 48;
  }
  text(ctx, 'STALL UPGRADES', 230, 446, 20, '#ffd166', 'left');
  y = 468;
  for (const [id, up] of Object.entries(UPGRADES)) {
    const owned = s.economy.upgrades[id];
    ctx.fillStyle = 'rgba(255,250,240,0.08)';
    roundRect(ctx, 220, y, 840, 42, 10);
    ctx.fill();
    text(ctx, `${up.name} — ${up.desc}`, 240, y + 22, 19, '#fff3d6', 'left');
    if (owned) {
      text(ctx, '✓ OWNED', 940, y + 22, 18, '#06d6a0', 'left');
    } else {
      const afford = s.economy.coins >= up.price;
      ctx.fillStyle = afford ? '#ffb347' : 'rgba(120,110,100,0.8)';
      roundRect(ctx, 940, y + 5, 100, 30, 8);
      ctx.fill();
      text(ctx, fmtRp(up.price), 990, y + 21, 16, '#2b1a12');
      s.ui.push({ id: 'upgrade:' + id, x: 940, y: y + 5, w: 100, h: 30 });
    }
    y += 48;
  }
  const next = s.night + 1;
  ctx.fillStyle = '#e4572e';
  roundRect(ctx, W / 2 - 160, 618, 320, 38, 12);
  ctx.fill();
  text(ctx, `START NIGHT ${next} ▶`, W / 2, 638, 22, '#ffffff');
  s.ui.push({ id: 'next-night', x: W / 2 - 160, y: 618, w: 320, h: 38 });
}

export function drawNightEnd(ctx, s) {
  dim(ctx, 0.6);
  panel(ctx, 340, 180, 600, 330);
  text(ctx, `NIGHT ${s.night} DONE`, W / 2, 226, 32, '#ffb347');
  text(ctx, `Served: ${s.servedTonight} customers`, W / 2, 282, 22, '#fff3d6');
  text(ctx, `Tonight's earnings: ${fmtRp(s.economy.earnedTonight)}`, W / 2, 318, 22, '#06d6a0');
  text(ctx, `Angry customers: ${s.angryTonight}`, W / 2, 354, 22, s.angryTonight > 0 ? '#ef476f' : '#fff3d6');
  text(ctx, `Total earned: ${fmtRp(s.economy.earnedTotal)} / ${fmtRp(GOAL_COINS)}`, W / 2, 390, 22, '#ffd166');
  const pulse = 0.7 + 0.3 * Math.sin(s.t * 3);
  ctx.globalAlpha = pulse;
  text(ctx, 'CLICK TO OPEN SHOP', W / 2, 452, 22, '#ffffff');
  ctx.globalAlpha = 1;
}

export function drawEndScreen(ctx, s, win) {
  dim(ctx, 0.65);
  panel(ctx, 300, 150, 680, 420);
  if (win) {
    outlinedText(ctx, '🎉 STALL SUCCESS!', W / 2, 210, 44, '#ffd166');
    text(ctx, 'Rp750.000 earned — your stall is a sunset legend!', W / 2, 262, 20, '#fff3d6');
  } else {
    outlinedText(ctx, 'STALL CLOSED', W / 2, 210, 44, '#ef476f');
    text(ctx, s.loseReason || 'Your stall did not reach the goal.', W / 2, 262, 20, '#fff3d6');
  }
  text(ctx, `Total earned: ${fmtRp(s.economy.earnedTotal)}`, W / 2, 316, 22, '#ffd166');
  text(ctx, `Customers served: ${s.economy.servedTotal}`, W / 2, 350, 20, '#fff3d6');
  text(ctx, `Perfect dishes: ${s.economy.perfectTotal}`, W / 2, 382, 20, '#fff3d6');
  text(ctx, `Nights reached: ${s.night} / 5`, W / 2, 414, 20, '#fff3d6');
  text(ctx, '🏆 BEST SCORE: ' + fmtRp(s.best), W / 2, 452, 22, '#ffd166');
  const pulse = 0.7 + 0.3 * Math.sin(s.t * 3);
  ctx.globalAlpha = pulse;
  text(ctx, 'PRESS R TO PLAY AGAIN', W / 2, 510, 24, '#ffffff');
  ctx.globalAlpha = 1;
}

export function drawPause(ctx, s) {
  dim(ctx, 0.55);
  outlinedText(ctx, 'PAUSED', W / 2, 330, 56, '#fff3d6');
  text(ctx, 'P to resume  ·  R to restart', W / 2, 392, 20, '#ffd166');
}

// --- Gambar utama per layar ---
export function drawScene(ctx, s, t) {
  s.ui.length = 0;
  drawBackground(ctx, t);
  drawLantern(ctx, 150, 210, 26, t, 0);
  drawLantern(ctx, 700, 196, 22, t, 2.1);
  drawLantern(ctx, 1180, 216, 24, t, 4.2);
  drawStall(ctx, t, s);

  if (s.screen === 'title') {
    drawTitle(ctx, s, t);
    return;
  }
  if (s.screen === 'shop') {
    drawShop(ctx, s);
    return;
  }
  if (s.screen === 'nightend') {
    drawNightEnd(ctx, s);
    return;
  }
  if (s.screen === 'win' || s.screen === 'lose') {
    drawEndScreen(ctx, s, s.screen === 'win');
    return;
  }

  // Layar main (play / paused): panci, nampan, pelanggan, HUD, tombol.
  for (const pot of s.kitchen.pots) {
    drawPot(ctx, pot, t);
    s.ui.push({ id: 'pot:' + s.kitchen.pots.indexOf(pot), x: pot.x - 56, y: pot.y - 62, w: 112, h: 100 });
  }
  drawTray(ctx, s.kitchen.tray, s.heldTray);
  s.kitchen.tray.forEach((item, i) => {
    s.ui.push({ id: 'tray:' + i, x: 700 + i * 62, y: 362, w: 54, h: 54 });
  });
  for (const c of s.customers) {
    drawCustomer(ctx, c, t, s.selected === c);
    s.ui.push({ id: 'cust:' + c.id, x: c.x - 60, y: c.y - 210, w: 120, h: 216 });
  }
  drawHUD(ctx, s);
  drawGoalBanner(ctx);
  drawDishButtons(ctx, s);
  if (s.screen === 'paused') drawPause(ctx, s);
}
