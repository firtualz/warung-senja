// WARUNG SENJA — suara. Semua bunyi dibuat dengan WebAudio (oscillator), tanpa
// file suara: klik, ding masakan selesai, koin, pelanggan marah, dan jingle menang.
export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.master = null;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.25;
        this.master.connect(this.ctx.destination);
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, dur, type, vol, when = 0, slideTo = 0) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.5, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  click() {
    this.tone(660, 0.06, 'triangle', 0.3);
  }
  pop() {
    this.tone(520, 0.07, 'triangle', 0.35, 0, 780);
  }
  ding() {
    this.tone(880, 0.18, 'sine', 0.5);
    this.tone(1318, 0.22, 'sine', 0.35, 0.08);
  }
  coin() {
    this.tone(988, 0.09, 'square', 0.22);
    this.tone(1319, 0.16, 'square', 0.22, 0.07);
  }
  perfect() {
    this.tone(784, 0.1, 'sine', 0.4);
    this.tone(1047, 0.12, 'sine', 0.4, 0.07);
    this.tone(1568, 0.2, 'sine', 0.35, 0.14);
  }
  angry() {
    this.tone(220, 0.25, 'sawtooth', 0.3, 0, 110);
  }
  burn() {
    this.tone(180, 0.3, 'sawtooth', 0.25, 0, 90);
  }
  win() {
    const seq = [523, 659, 784, 1047, 784, 1047, 1319];
    seq.forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.4, i * 0.11));
  }
  lose() {
    const seq = [392, 330, 262, 196];
    seq.forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.35, i * 0.16));
  }
}
