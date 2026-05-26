// 2048 音效 — 统一 Q弹音

let audioCtx = null;
function ctx() {
  if (!audioCtx) {
    audioCtx = new (typeof AudioContext !== 'undefined' ? AudioContext : window.webkitAudioContext)();
  }
  return audioCtx;
}

// 清脆短促的"啵"一声
export function playPop(vol = 0.06) {
  try {
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.1);
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.15);
  } catch (e) {}
}

export function playMove() { playPop(0.04); }
export function playMerge() { playPop(0.07); }
export function playWin() { playPop(0.1); playPop(0.1); }
export function playLose() { playPop(0.03); }
export function playUndo() { playPop(0.03); }
