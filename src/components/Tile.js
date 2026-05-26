import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { getTileColor } from '../theme/colors';

export default function Tile({ value, size, theme, skinKey }) {
  const animScale = useRef(new Animated.Value(value === 0 ? 0 : 1)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === 0 && value !== 0) {
      animScale.setValue(0.6);
      Animated.spring(animScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
    } else if (prevValue.current !== 0 && value !== 0 && prevValue.current !== value) {
      animScale.setValue(1.06);
      Animated.spring(animScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
    }
    prevValue.current = value;
  }, [value]);

  const isDark = skinKey === 'space';

  // 空方块：凹陷内嵌效果
  if (value === 0) {
    return (
      <View style={{
        width: size, height: size, borderRadius: 8,
        backgroundColor: theme.cellBg,
        // 内阴影：顶部暗，底部稍亮
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1,
        boxShadow: `inset 0 1px 3px rgba(0,0,0,0.12), inset 0 -1px 1px rgba(255,255,255,0.05)`,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
      }} />
    );
  }

  const colors = getTileColor(value, skinKey);

  // 3D 效果：底部阴影 + 顶部高光
  const shadowCol = isDark
    ? `rgba(0,0,0,0.45)`
    : value <= 16
      ? `rgba(0,0,0,0.18)`
      : `${colors.bg}99`;

  return (
    <Animated.View style={{
      width: size, height: size, borderRadius: 8,
      backgroundColor: colors.bg,
      justifyContent: 'center', alignItems: 'center',
      transform: [{ scale: animScale }],
      // 底部深色阴影
      borderBottomWidth: 2,
      borderBottomColor: 'rgba(0,0,0,0.15)',
      // 右侧深色
      borderRightWidth: 2,
      borderRightColor: 'rgba(0,0,0,0.08)',
      // 顶部高光
      borderTopWidth: 2,
      borderTopColor: 'rgba(255,255,255,0.2)',
      // 左侧高光
      borderLeftWidth: 2,
      borderLeftColor: 'rgba(255,255,255,0.12)',
      // 外层阴影
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: value >= 128 ? 0.35 : 0.2,
      shadowRadius: value >= 128 ? 5 : 3,
      elevation: 4,
      boxShadow: `0 3px 6px ${shadowCol}`,
    }}>
      {/* 顶部光泽渐变 */}
      <View style={{
        position: 'absolute', top: 0, left: 3, right: 3, height: '40%',
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.10)',
      }} />
      <Text style={{
        fontSize: value >= 100 ? (value >= 1000 ? 18 : 24) : 32,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.15)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
      }}>
        {value}
      </Text>
    </Animated.View>
  );
}
