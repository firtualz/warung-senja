// SUNSET STALL — ekonomi: koin, belanja bahan, upgrade, dan target malam.
// Semua harga di sini sama dengan yang terlihat di layar: tidak ada angka palsu.
import { INGREDIENTS, UPGRADES, START_COINS, START_STOCK, MENU } from './config.js';

export class Economy {
  constructor() {
    this.coins = START_COINS;
    this.stock = { ...START_STOCK };
    this.upgrades = { stove: false, chair: false, pot: false };
    this.earnedTonight = 0;
    this.earnedTotal = 0;
    this.servedTotal = 0;
    this.perfectTotal = 0;
  }

  // Kecepatan masak: 1 normal, 0.7 dengan Kompor Cepat.
  get speedMul() {
    return this.upgrades.stove ? 0.7 : 1;
  }
  get potCount() {
    return this.upgrades.pot ? 3 : 2;
  }
  get seatCount() {
    return this.upgrades.chair ? 4 : 3;
  }

  earn(amount) {
    this.coins += amount;
    this.earnedTonight += amount;
    this.earnedTotal += amount;
  }

  buyIngredient(id) {
    const ing = INGREDIENTS[id];
    if (!ing) return false;
    if (this.coins < ing.packPrice) return false;
    this.coins -= ing.packPrice;
    this.stock[id] = (this.stock[id] || 0) + ing.pack;
    return true;
  }

  buyUpgrade(id) {
    const up = UPGRADES[id];
    if (!up || this.upgrades[id]) return false;
    if (this.coins < up.price) return false;
    this.coins -= up.price;
    this.upgrades[id] = true;
    return true;
  }

  // Bisa masak apa pun? Dipakai untuk deteksi bangkrut di toko.
  get canCookAnything() {
    return Object.values(MENU).some((dish) =>
      Object.entries(dish.needs).every(([ing, n]) => (this.stock[ing] || 0) >= n),
    );
  }

  get bankrupt() {
    const cheapest = Math.min(...Object.values(INGREDIENTS).map((i) => i.packPrice));
    return !this.canCookAnything && this.coins < cheapest;
  }

  resetNight() {
    this.earnedTonight = 0;
  }
}
