// 2048 音效 — Web Audio API 专用
// 原生端无音效，不崩就行

let audioCtx = null;
const isWeb = typeof document !== 'undefined';

function ctx() {
  if (!isWeb) return null;
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e) { return null; }
  }
  return audioCtx;
}

function pop(vol = 0.06) {
  if (!isWeb) return;
  const c = ctx();
  if (!c) return;
  try {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(800, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.08);
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.10);
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + 0.12);
  } catch (e) {}
}

export function playMove() { pop(0.04); }
export function playMerge() { pop(0.07); }
export function playWin() { pop(0.1); setTimeout(() => pop(0.1), 120); }
export function playLose() { pop(0.03); }
export function playUndo() { pop(0.03); }
