import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform, Image } from 'react-native';
import { skins } from '../theme/colors';

function drawPoster(canvas, theme, skinKey, score, highScore, steps, board) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // 背景
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, theme.bg);
  bgGrad.addColorStop(1, skinKey==='sakura'?'#F5E0EA':theme.bg);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 装饰圆
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(Math.random()*W, Math.random()*H, 40+Math.random()*80, 0, Math.PI*2);
    ctx.fillStyle = theme.accent;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 顶部花边
  if (skinKey==='sakura') {
    ctx.fillStyle = '#E8C5D0';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿', W/2, 30);
  }

  // 标题 2048
  ctx.textAlign = 'center';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillText('2048', W/2+3, 95);
  ctx.fillStyle = theme.accent;
  ctx.fillText('2048', W/2, 92);

  // 主题装饰
  const deco = {space:'🪐',sakura:'🌸',mint:'🍀',ocean:'🌊'};
  ctx.font = '24px sans-serif';
  ctx.fillText(deco[skinKey]||'', W/2+100, 92);

  // 分隔线
  ctx.strokeStyle = theme.glassBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 120);
  ctx.lineTo(W-40, 120);
  ctx.stroke();

  // 分数区
  const cx = W/2;
  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = theme.accent;
  ctx.textAlign = 'center';
  ctx.fillText(score.toString(), cx, 155);

  ctx.font = '13px sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText('得分', cx, 172);

  // 最高分
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('🏆 最高 ' + highScore, cx, 200);

  // 步数
  ctx.font = '12px sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText('👣 ' + steps + ' 步', cx, 222);

  // 迷你棋盘
  const bs = board.length;
  const tileS = 22;
  const gap = 2;
  const gridW = bs * (tileS + gap) - gap;
  const gridX = (W - gridW) / 2;
  const gridY = 248;

  ctx.save();
  ctx.fillStyle = theme.gridBg;
  ctx.strokeStyle = theme.glassBorder;
  ctx.lineWidth = 1;
  const rr = 4;
  ctx.beginPath();
  ctx.moveTo(gridX-6+rr, gridY-6);
  ctx.arcTo(gridX+gridW+6, gridY-6, gridX+gridW+6, gridY+gridW+6, rr);
  ctx.arcTo(gridX+gridW+6, gridY+gridW+6, gridX-6, gridY+gridW+6, rr);
  ctx.arcTo(gridX-6, gridY+gridW+6, gridX-6, gridY-6, rr);
  ctx.arcTo(gridX-6, gridY-6, gridX+gridW+6, gridY-6, rr);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  for (let r = 0; r < bs; r++) {
    for (let c = 0; c < bs; c++) {
      const v = board[r][c];
      const x = gridX + c*(tileS+gap);
      const y = gridY + r*(tileS+gap);
      ctx.fillStyle = v ? theme.accent : theme.cellBg;
      ctx.globalAlpha = v ? 0.7 + (Math.log2(v||1)/12) : 0.5;
      ctx.beginPath();
      ctx.moveTo(x+3, y);
      ctx.arcTo(x+tileS, y, x+tileS, y+tileS, 3);
      ctx.arcTo(x+tileS, y+tileS, x, y+tileS, 3);
      ctx.arcTo(x, y+tileS, x, y, 3);
      ctx.arcTo(x, y, x+tileS, y, 3);
      ctx.closePath();
      ctx.fill();
      if (v) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${tileS>18?10:9}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(v.toString(), x+tileS/2, y+tileS/2);
      }
      ctx.globalAlpha = 1;
    }
  }

  // 樱花飘落装饰
  if (skinKey==='sakura') {
    ctx.font = '14px sans-serif';
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = '#E8C5D0';
      ctx.globalAlpha = 0.3 + Math.random()*0.2;
      ctx.fillText('🌸', 20+Math.random()*(W-40), 280+Math.random()*100);
    }
    ctx.globalAlpha = 1;
  }

  // 底部信息
  const today = new Date().toLocaleDateString('zh-CN');
  ctx.font = '12px sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.textAlign = 'center';
  ctx.fillText('🌸 海葵版2048 v1.0.9', W/2, H-30);
  ctx.fillText(today, W/2, H-14);
}

export default function SharePoster({ visible, onClose, theme, skinKey, score, highScore, steps, board }) {
  const canvasRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    const c = canvasRef.current;
    c.width = 320;
    c.height = 440;
    drawPoster(c, theme, skinKey, score, highScore, steps, board);
    setImgUrl(c.toDataURL('image/png'));
  }, [visible, theme, skinKey, score, highScore, steps, board]);

  const handleDownload = () => {
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `2048_${score}.png`;
    a.click();
  };

  if (Platform.OS !== 'web') return null;

  const cardThemes = {
    space:  { bg: '#2A2A3E', text: '#E0DDF0', btnBg: 'rgba(255,255,255,0.1)' },
    sakura: { bg: '#FFF5F7', text: '#5C4B6E', btnBg: 'rgba(92,75,110,0.08)' },
    mint:   { bg: '#F0FFF4', text: '#2D5A3D', btnBg: 'rgba(45,90,61,0.08)' },
    ocean:  { bg: '#F0F8FF', text: '#1A3A5C', btnBg: 'rgba(26,58,92,0.08)' },
  };
  const ct = cardThemes[skinKey] || cardThemes.sakura;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.7)' }}>
        <View style={{ backgroundColor:ct.bg, borderRadius:16, padding:16, alignItems:'center', maxWidth:340 }}>
          <Text style={{ fontSize:16, fontWeight:'bold', color:ct.text, marginBottom:10 }}>分享成绩</Text>
          <canvas ref={canvasRef} style={{ width:320, height:440, borderRadius:12 }} />
          {imgUrl && Platform.OS==='web' && (
            <img src={imgUrl} alt="poster" style={{ display:'none' }} />
          )}
          <View style={{ flexDirection:'row', gap:12, marginTop:12 }}>
            <TouchableOpacity onPress={handleDownload}
              style={{ backgroundColor:theme.accent, borderRadius:10, paddingHorizontal:20, paddingVertical:10 }}
              activeOpacity={0.7}>
              <Text style={{ fontSize:14, fontWeight:'bold', color:'#FFF' }}>💾 保存图片</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}
              style={{ backgroundColor:ct.btnBg, borderRadius:10, paddingHorizontal:20, paddingVertical:10 }}
              activeOpacity={0.7}>
              <Text style={{ fontSize:14, color:ct.text }}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
