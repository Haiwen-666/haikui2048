import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const LOGO_DECOR = { space: '🪐', sakura: '🌸', mint: '🍀', ocean: '🌊' };

export default function ScoreBoard({ score, highScore, steps, canUndo, onUndo, onReset, theme, newHigh, skinKey }) {
  const decor = LOGO_DECOR[skinKey] || '';
  return (
    <View style={{ marginBottom: 10, marginTop: 4 }}>
      {/* 顶行：Logo + 控制区 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo + 主题装饰 */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
          <Text style={{
            fontSize: 42, fontWeight: '900', color: theme.accent, letterSpacing: 3,
            textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 1,
          }}>2048</Text>
          <Text style={{ fontSize: 18, color: theme.textSecondary }}>{decor}</Text>
        </View>

        {/* 右侧控制栏 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          {/* 撤回 */}
          <TouchableOpacity onPress={onUndo} disabled={!canUndo}
            style={{
              backgroundColor: canUndo ? theme.cellBg : 'rgba(0,0,0,0.03)',
              borderRadius: 8, padding: 7, borderWidth: 1, borderColor: theme.glassBorder,
              opacity: canUndo ? 1 : 0.3,
            }} activeOpacity={0.7}>
            <Text style={{ fontSize: 15, color: theme.text }}>↩</Text>
          </TouchableOpacity>

          {/* 分数 */}
          <View style={{
            backgroundColor: theme.cellBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5,
            borderWidth: 1, borderColor: theme.glassBorder, minWidth: 56,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
              <Text style={{ fontSize: 10, color: theme.textSecondary }}>分数</Text>
              {newHigh && <Text style={{ fontSize: 10, color: '#FFD700' }}>🏆</Text>}
            </View>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: theme.accent, textAlign: 'center' }}>{score}</Text>
          </View>

          {/* 最高分 */}
          <View style={{
            backgroundColor: theme.cellBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5,
            borderWidth: 1, borderColor: theme.glassBorder, minWidth: 56,
          }}>
            <Text style={{ fontSize: 10, color: theme.textSecondary, textAlign: 'center' }}>最高</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFD700', textAlign: 'center' }}>{highScore}</Text>
          </View>

          {/* 开局 */}
          <TouchableOpacity onPress={onReset}
            style={{ backgroundColor: theme.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9 }}
            activeOpacity={0.7}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>开局</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 底行：步数徽章 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 4,
          backgroundColor: theme.cellBg,
          borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
          borderWidth: 1, borderColor: theme.glassBorder,
        }}>
          <Text style={{ fontSize: 11, color: theme.textSecondary }}>👣</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: theme.textSecondary }}>步数</Text>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: theme.accent }}>{steps}</Text>
        </View>
      </View>
    </View>
  );
}
