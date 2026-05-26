import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

export default function GameOverModal({ visible, won, score, onRestart, onContinue, theme }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View
          style={{
            backgroundColor: theme.bg,
            borderRadius: 20,
            padding: 32,
            alignItems: 'center',
            width: 280,
            borderWidth: 1,
            borderColor: theme.glassBorder,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: won ? '#FFD700' : theme.text, marginBottom: 8 }}>
            {won ? '🎉 你赢了！' : '游戏结束'}
          </Text>
          <Text style={{ fontSize: 16, color: theme.textSecondary, marginBottom: 4 }}>
            得分：{score}
          </Text>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              onPress={onRestart}
              style={{ backgroundColor: theme.accent, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>再来一局</Text>
            </TouchableOpacity>
            {won && onContinue && (
              <TouchableOpacity
                onPress={onContinue}
                style={{
                  backgroundColor: theme.cellBg,
                  borderRadius: 10,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: theme.glassBorder,
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>继续</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
