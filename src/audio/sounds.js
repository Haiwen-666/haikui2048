// 2048 音效 — 统一 Q弹音，Web + Native 双平台

let nativeSound = null;
let audioCtx = null;

export async function initAudio() {
  try {
    const { Audio } = require('expo-av');
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(
      // 短的 440Hz 正弦波 base64，0.1秒
      { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' },
      { shouldPlay: false, volume: 0.3 }
    );
    nativeSound = sound;
  } catch (e) {
    nativeSound = null;
  }
}

export async function playNative() {
  try {
    if (!nativeSound) {
      const { Audio } = require('expo-av');
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' },
        { shouldPlay: false, volume: 0.3 }
      );
      nativeSound = sound;
    }
    if (nativeSound) {
      await nativeSound.setPositionAsync(0);
      await nativeSound.playAsync();
    }
  } catch (e) {}
}

function webCtx() {
  if (!audioCtx) {
    audioCtx = new (typeof AudioContext!=='undefined'?AudioContext:window.webkitAudioContext)();
  }
  return audioCtx;
}

function webPop(vol = 0.06) {
  try {
    const c = webCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, c.currentTime+0.08);
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime+0.10);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime+0.12);
  } catch(e){}
}

const isWeb = typeof document !== 'undefined';

export function playMove() { isWeb ? webPop(0.04) : playNative(); }
export function playMerge() { isWeb ? webPop(0.07) : playNative(); }
export function playWin() { isWeb ? (webPop(0.1), setTimeout(()=>webPop(0.1),120)) : playNative(); }
export function playLose() { isWeb ? webPop(0.03) : playNative(); }
export function playUndo() { isWeb ? webPop(0.03) : playNative(); }
