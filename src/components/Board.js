import React from 'react';
import { View } from 'react-native';
import Tile from './Tile';

export default function Board({ board, size, theme, skinKey }) {
  const boardSize = board.length;
  const gap = Math.max(4, 10 - boardSize); // 小棋盘更大间距
  const padding = gap;
  const tileSize = (size - gap * (boardSize + 1)) / boardSize;

  return (
    <View style={{
      width: size,
      height: size,
      backgroundColor: theme.gridBg,
      borderRadius: 12,
      padding: padding,
      borderWidth: 1,
      borderColor: theme.glassBorder,
    }}>
      {board.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: gap, marginBottom: gap }}>
          {row.map((cell, c) => (
            <Tile key={`${r}-${c}`} value={cell} size={tileSize} theme={theme} skinKey={skinKey} />
          ))}
        </View>
      ))}
    </View>
  );
}
