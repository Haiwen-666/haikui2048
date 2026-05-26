// 2048 音效 — 防崩溃版，Web+Native 双平台
let audioCtx = null;

function webCtx() {
  if (!audioCtx) audioCtx = new (typeof AudioContext!=='undefined'?AudioContext:window.webkitAudioContext)();
  return audioCtx;
}
function webPop(vol=0.06) {
  try { const c=webCtx(); const o=c.createOscillator(); const g=c.createGain(); o.type='sine'; o.frequency.setValueAtTime(800,c.currentTime); o.frequency.exponentialRampToValueAtTime(400,c.currentTime+0.08); g.gain.setValueAtTime(vol,c.currentTime); g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.10); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime+0.12); } catch(e){}
}

async function nativePop() {
  try {
    const { Audio } = require('expo-av');
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync({ uri:'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' }, { shouldPlay:false, volume:0.3 });
    await sound.setPositionAsync(0);
    await sound.playAsync();
    setTimeout(() => { try { sound.unloadAsync(); } catch(e){} }, 500);
  } catch(e) {}
}

const isWeb = typeof document !== 'undefined';
let nativeReady = false;

export function playMove() { isWeb ? webPop(0.04) : nativePop(); }
export function playMerge() { isWeb ? webPop(0.07) : nativePop(); }
export function playWin() { isWeb ? (webPop(0.1), setTimeout(()=>webPop(0.1),120)) : nativePop(); }
export function playLose() { isWeb ? webPop(0.03) : nativePop(); }
export function playUndo() { isWeb ? webPop(0.03) : nativePop(); }
