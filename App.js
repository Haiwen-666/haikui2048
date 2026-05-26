import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, PanResponder, Dimensions, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { GameEngine } from './src/engine/GameEngine';
import Board from './src/components/Board';
import ScoreBoard from './src/components/ScoreBoard';
import GameOverModal from './src/components/GameOverModal';
import SharePoster from './src/components/SharePoster';
import { Share } from 'react-native';
import { skins, skinKeys } from './src/theme/colors';
import { playMove, playMerge, playWin, playLose, playUndo } from './src/audio/sounds';

const SCREEN_W = Dimensions.get('window').width;
const BOARD_PAD = 16;
const MAX_BOARD = 380;

// 樱花飘落 CSS + 逻辑
const SAKURA_CSS = `
@keyframes sf {
  0%   { transform: translateY(-60px) rotate(0deg); opacity:0; }
  5%   { opacity:0.6; }
  100% { transform: translateY(105vh) rotate(540deg); opacity:0; }
}
.sp { position:fixed; top:-80px; pointer-events:none; z-index:9999; animation:sf linear forwards; }
`;
let sakuraStyleInjected = false;
let activePetals = [];

function injectSakuraCSS() {
  if (sakuraStyleInjected || typeof document === 'undefined') return;
  const s = document.createElement('style'); s.id = 'sakura-css'; s.textContent = SAKURA_CSS;
  document.head.appendChild(s); sakuraStyleInjected = true;
}

function clearAllPetals() {
  activePetals.forEach(p => { if (p.parentNode) p.remove(); });
  activePetals = [];
}

function spawnPetals(n = 8) {
  if (typeof document === 'undefined') return;
  injectSakuraCSS();
  const E = ['🌸','💮','✿'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div'); p.className = 'sp'; p.textContent = E[Math.floor(Math.random()*E.length)];
    p.style.left = Math.random()*100+'%';
    p.style.animationDuration = (Math.random()*4+5)+'s';
    p.style.fontSize = (Math.random()*10+10)+'px';
    document.body.appendChild(p);
    activePetals.push(p);
    // 落完后自动清理
    const dur = parseFloat(p.style.animationDuration)*1000;
    setTimeout(() => {
      const idx = activePetals.indexOf(p);
      if (idx > -1) activePetals.splice(idx, 1);
      if (p.parentNode) p.remove();
    }, dur + 200);
  }
}

// 信息面板
function InfoPanel({ theme, onClose }) {
  return (
    <View style={{ backgroundColor:theme.cellBg, borderRadius:8, paddingHorizontal:10, paddingVertical:5, marginBottom:6, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderWidth:1, borderColor:theme.glassBorder }}>
      <Text style={{ fontSize:11, color:theme.textSecondary }}>🌸 海葵版2048 v1.0.9</Text>
      <TouchableOpacity onPress={onClose}><Text style={{ fontSize:13, color:theme.textSecondary, fontWeight:'bold' }}>✕</Text></TouchableOpacity>
    </View>
  );
}

// 皮肤切换
function SkinSwitcher({ current, onChange, theme }) {
  return (
    <View style={{ flexDirection:'row', gap:4, marginBottom:6, justifyContent:'center', flexWrap:'wrap' }}>
      {skinKeys.map(k => (
        <TouchableOpacity key={k} onPress={()=>onChange(k)}
          style={{ paddingHorizontal:8, paddingVertical:4, borderRadius:12,
            backgroundColor:current===k?theme.accent:theme.cellBg, borderWidth:1, borderColor:theme.glassBorder }}>
          <Text style={{ fontSize:12, color:current===k?'#fff':theme.text }}>{skins[k].name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// 方向按钮 — 圆角正方形 + 互补配色
function DirBtn({ label, onPress, color }) {
  const s = 50;
  return (
    <View
      style={{ width:s, height:s, backgroundColor:color, borderRadius:12, justifyContent:'center', alignItems:'center', cursor:'pointer',
        shadowColor: color, shadowOffset:{w:0,h:2}, shadowOpacity:0.3, shadowRadius:4, elevation:3 }}
      onClick={onPress}>
      <Text style={{ fontSize:20, color:'#FFF', fontWeight:'bold' }}>{label}</Text>
    </View>
  );
}

function DirectionButtons({ engineRef, updateState, theme }) {
  const color = theme.btnAll || '#7B79A0';
  const d = (dir) => { engineRef.current.move(dir); updateState(); };
  return (
    <View style={{ alignItems:'center', gap:8, marginTop:24 }}>
      <DirBtn label="▲" onPress={()=>d('up')} color={color} />
      <View style={{ flexDirection:'row', gap:12 }}>
        <DirBtn label="◀" onPress={()=>d('left')} color={color} />
        <DirBtn label="▼" onPress={()=>d('down')} color={color} />
        <DirBtn label="▶" onPress={()=>d('right')} color={color} />
      </View>
    </View>
  );
}

// 原生平台樱花飘落（与web同逻辑）
function NativeSakura({ on }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!on) { setTick(0); return; }
    const id = setInterval(() => setTick(t => t+1), 5000);
    return () => clearInterval(id);
  }, [on]);
  if (!on) return null;
  return (
    <View style={{ position:'absolute', top:0, left:0, right:0, bottom:0, pointerEvents:'none' }} pointerEvents="none">
      {Array.from({length:8}).map((_,i) => (
        <Text key={i} style={{
          position:'absolute', left:`${5+i*12}%`, top:`${(tick*7+i*11)%100}%`,
          fontSize:12, opacity:0.3,
        }}>{['🌸','💮','✿'][i%3]}</Text>
      ))}
    </View>
  );
}

// 高分配存储 — 每个棋盘尺寸独立
const HS = {};
[3,4,5,6].forEach(sz => {
  try { const v = localStorage.getItem('2048_hs_'+sz); HS[sz] = v ? parseInt(v,10)||0 : 0; } catch(e) { HS[sz]=0; }
});
function loadHS(sz) { return HS[sz] || 0; }
function saveHS(sz, n) { try { HS[sz]=n; localStorage.setItem('2048_hs_'+sz, String(n)); } catch(e){} }

export default function App() {
  const [boardSize, setBoardSize] = useState(4);
  const engineRef = useRef(new GameEngine(4));
  const [board, setBoard] = useState(engineRef.current.board);
  const [score, setScore] = useState(0);
  const [steps, setSteps] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [modal, setModal] = useState(false);
  const [highScore, setHighScore] = useState(loadHS(boardSize));
  const [newHigh, setNewHigh] = useState(false);
  const [skinKey, setSkinKey] = useState('sakura');
  const [showInfo, setShowInfo] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [petalsOn, setPetalsOn] = useState(true);
  const [showPoster, setShowPoster] = useState(false);
  const theme = skins[skinKey];

  const updateState = useCallback(() => {
    const st = engineRef.current.getState();
    setBoard([...st.board.map(r=>[...r])]);
    setScore(st.score);
    setSteps(st.steps);
    setCanUndo(st.canUndo);
    setGameOver(st.gameOver);
    setWon(st.won);
    if (st.score > highScore) { setHighScore(st.score); setNewHigh(true); saveHS(boardSize, st.score); }
    if (st.gameOver || st.won) { setModal(true); playLose(); }
  }, [highScore]);

  const move = useCallback((dir) => {
    const prev = engineRef.current.score;
    if (engineRef.current.move(dir)) {
      if (engineRef.current.score > prev) playMerge(); else playMove();
      updateState();
    }
  }, [updateState]);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx)>15 || Math.abs(gs.dy)>15,
    onPanResponderRelease: (_, gs) => {
      const ax=Math.abs(gs.dx), ay=Math.abs(gs.dy);
      if (ax>ay) move(gs.dx>0?'right':'left'); else move(gs.dy>0?'down':'up');
    },
  })).current;

  const undo = useCallback(() => { if(engineRef.current.undo()){playUndo();updateState();} }, [updateState]);
  const reset = useCallback(() => { engineRef.current.reset(boardSize); setNewHigh(false); setModal(false); updateState(); }, [updateState, boardSize]);
  const cont = useCallback(() => { engineRef.current.continueAfterWin(); setModal(false); updateState(); }, [updateState]);
  const handleShare = useCallback(() => {
    if (Platform.OS==='web') { setShowPoster(true); return; }
    const deco = {space:'🪐',sakura:'🌸',mint:'🍀',ocean:'🌊'};
    Share.share({ message: `${deco[skinKey]||''} 海葵版2048\n得分: ${score}  🏆最高: ${highScore}\n👣 ${steps}步 | ${boardSize}x${boardSize}\n来挑战我吧!` });
  }, [skinKey, score, highScore, steps, boardSize]);
  const changeSize = useCallback((sz) => { setBoardSize(sz); engineRef.current.reset(sz); setNewHigh(false); setHighScore(loadHS(sz)); setModal(false); updateState(); }, [updateState]);

  // 键盘
  useEffect(() => {
    if (Platform.OS!=='web') return;
    const h = (e) => { const m={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}; const d=m[e.key]; if(d){e.preventDefault();move(d);} };
    document.addEventListener('keydown',h);
    return ()=>document.removeEventListener('keydown',h);
  }, [move]);

  // 樱花花瓣（双平台）
  useEffect(() => {
    if (skinKey==='sakura' && petalsOn) {
      if (Platform.OS==='web') {
        injectSakuraCSS();
        spawnPetals(8);
        const t = setInterval(() => spawnPetals(4), 10000);
        return () => { clearInterval(t); clearAllPetals(); };
      }
    } else if (Platform.OS==='web') {
      clearAllPetals();
    }
  }, [skinKey, petalsOn]);

  const boardDim = Math.min(SCREEN_W - BOARD_PAD*2, MAX_BOARD);
  const bg = darkMode ? '#1A1A2E' : theme.bg;

  // 樱花花边（与棋盘等宽对齐）
  const isSakura = skinKey==='sakura';
  const boardOuterW = boardDim;
  const boardInnerW = isSakura ? boardDim - 8 : boardDim;

  return (
    <View style={{ flex:1, backgroundColor:bg, justifyContent:'flex-start', alignItems:'center', paddingHorizontal:BOARD_PAD, paddingTop:30 }}>
      <StatusBar barStyle={darkMode?'light-content':'dark-content'} />
      {Platform.OS!=='web' && <NativeSakura on={skinKey==='sakura' && petalsOn} />}

      {/* === 顶部 Logo 区（不移动）=== */}
      <View style={{ width:boardDim }}>
        <ScoreBoard score={score} highScore={highScore} steps={steps} skinKey={skinKey}
          canUndo={canUndo} onUndo={undo} onReset={reset} theme={theme} newHigh={newHigh} />
      </View>

      {/* === 下方区域（整体下移 42px）=== */}
      <View style={{ width:boardDim, marginTop:42 }}>
        {showInfo && <InfoPanel theme={theme} onClose={()=>setShowInfo(false)} />}

        {/* 尺寸 + 模式 + 花瓣开关 */}
        <View style={{ flexDirection:'row', gap:4, marginBottom:4, justifyContent:'center', flexWrap:'wrap', alignItems:'center' }}>
          {[3,4,5,6].map(sz => (
            <TouchableOpacity key={sz} onPress={()=>changeSize(sz)}
              style={{ paddingHorizontal:6, paddingVertical:3, borderRadius:8,
                backgroundColor:boardSize===sz?theme.accent:theme.cellBg, borderWidth:1, borderColor:theme.glassBorder }}>
              <Text style={{ fontSize:11, color:boardSize===sz?'#fff':theme.text }}>{sz}×{sz}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={()=>setDarkMode(!darkMode)}
            style={{ paddingHorizontal:7, paddingVertical:3, borderRadius:8, backgroundColor:theme.cellBg, borderWidth:1, borderColor:theme.glassBorder }}>
            <Text style={{ fontSize:11, color:theme.text }}>{darkMode?'🌙':'☀️'}</Text>
          </TouchableOpacity>
          {skinKey==='sakura' && (
            <TouchableOpacity onPress={()=>setPetalsOn(!petalsOn)}
              style={{ paddingHorizontal:7, paddingVertical:3, borderRadius:8,
                backgroundColor:petalsOn?theme.accentAlt:theme.cellBg, borderWidth:1, borderColor:theme.glassBorder }}>
              <Text style={{ fontSize:11, color:petalsOn?'#fff':theme.text }}>{petalsOn?'🌸飘':'🌸关'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <SkinSwitcher current={skinKey} onChange={setSkinKey} theme={theme} />

        {/* 花边 + 棋盘 */}
        <View style={{ width:boardOuterW, alignItems:'stretch' }}>
          {isSakura && (
            <View style={{ alignItems:'center', marginBottom:2, height:14, justifyContent:'center' }}>
              <View style={{
                width: boardOuterW,
                borderTopWidth: 1,
                borderColor: 'rgba(230,123,121,0.3)',
                borderStyle: 'dashed',
                position: 'absolute', top: 7,
              }} />
              <Text style={{ fontSize:10, color:'#E8C5D0', backgroundColor:bg, paddingHorizontal:6 }}>✿ ❀ ✿</Text>
            </View>
          )}
          <View {...pan.panHandlers} style={{
            width: boardOuterW, borderRadius: isSakura?16:12,
            borderWidth: isSakura?3:0,
            borderColor: isSakura?'rgba(230,123,121,0.25)':'transparent',
            borderStyle: isSakura?'dashed':'solid',
          }}>
            <Board board={board} size={isSakura?boardOuterW-6:boardOuterW} theme={theme} skinKey={skinKey} />
          </View>
        </View>

        {Platform.OS==='web' && <DirectionButtons engineRef={engineRef} updateState={updateState} theme={theme} />}

        {/* 分享按钮 */}
        <TouchableOpacity onPress={handleShare}
          style={{ marginTop:16, alignSelf:'center', backgroundColor:theme.cellBg, borderRadius:10, paddingHorizontal:16, paddingVertical:8, borderWidth:1, borderColor:theme.glassBorder }}
          activeOpacity={0.7}>
          <Text style={{ fontSize:13, color:theme.text }}>📤 分享成绩</Text>
        </TouchableOpacity>
      </View>

      <GameOverModal visible={modal} won={won} score={score} onRestart={reset}
        onContinue={won?cont:undefined} theme={theme} />

      <SharePoster visible={showPoster} onClose={()=>setShowPoster(false)}
        theme={theme} skinKey={skinKey} score={score} highScore={highScore} steps={steps} board={board} />
    </View>
  );
}
