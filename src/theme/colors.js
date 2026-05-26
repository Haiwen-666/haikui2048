// 2048 多皮肤主题系统

// 每套主题独立方块配色
const tileSchemes = {
  space: {
    2:    { bg: '#3A3A4A', text: '#C0B8D0' },
    4:    { bg: '#4A3A5A', text: '#D0C8E0' },
    8:    { bg: '#5A4A6A', text: '#F9F6F2' },
    16:   { bg: '#6A4A5A', text: '#F9F6F2' },
    32:   { bg: '#7A3A4A', text: '#F9F6F2' },
    64:   { bg: '#E94560', text: '#F9F6F2' },
    128:  { bg: '#EDCF72', text: '#F9F6F2' },
    256:  { bg: '#EDCC61', text: '#F9F6F2' },
    512:  { bg: '#EDC850', text: '#F9F6F2' },
    1024: { bg: '#EDC53F', text: '#F9F6F2' },
    2048: { bg: '#EDC22E', text: '#1A1A2E' },
  },
  sakura: {
    2:    { bg: '#F8E8EE', text: '#7B5B6E' },
    4:    { bg: '#F5DCE5', text: '#7B5B6E' },
    8:    { bg: '#E8D5B7', text: '#5C4B3A' },
    16:   { bg: '#D4E8C5', text: '#3A5C2E' },
    32:   { bg: '#C3AED6', text: '#4B3A5C' },
    64:   { bg: '#F4C8A0', text: '#6B3A2E' },
    128:  { bg: '#E8C5D0', text: '#6B4B5E' },
    256:  { bg: '#C5D4E8', text: '#3A4B5C' },
    512:  { bg: '#D4C5E0', text: '#4B3A5C' },
    1024: { bg: '#E8D5A0', text: '#5C4B2E' },
    2048: { bg: '#F4C8D0', text: '#6B2E3A' },
  },
  mint: {
    2:    { bg: '#E8F5E9', text: '#3A5C3E' },
    4:    { bg: '#C8E6C9', text: '#3A5C3E' },
    8:    { bg: '#A5D6A7', text: '#2E4A2E' },
    16:   { bg: '#81C784', text: '#1A3A1A' },
    32:   { bg: '#66BB6A', text: '#FFF' },
    64:   { bg: '#43A047', text: '#FFF' },
    128:  { bg: '#FFD54F', text: '#3A2E1A' },
    256:  { bg: '#FFC107', text: '#3A2E1A' },
    512:  { bg: '#FF9800', text: '#FFF' },
    1024: { bg: '#F57C00', text: '#FFF' },
    2048: { bg: '#E65100', text: '#FFF' },
  },
  ocean: {
    2:    { bg: '#E3F2FD', text: '#1A3A5C' },
    4:    { bg: '#BBDEFB', text: '#1A3A5C' },
    8:    { bg: '#90CAF9', text: '#1A3A5C' },
    16:   { bg: '#64B5F6', text: '#FFF' },
    32:   { bg: '#42A5F5', text: '#FFF' },
    64:   { bg: '#1E88E5', text: '#FFF' },
    128:  { bg: '#FFD54F', text: '#3A2E1A' },
    256:  { bg: '#FFC107', text: '#3A2E1A' },
    512:  { bg: '#26A69A', text: '#FFF' },
    1024: { bg: '#00897B', text: '#FFF' },
    2048: { bg: '#00695C', text: '#FFF' },
  },
};

export function getTileColor(value, skinKey = 'space') {
  const scheme = tileSchemes[skinKey] || tileSchemes.space;
  return scheme[value] || { bg: skinKey === 'space' ? '#3C3A32' : '#E0E0E0', text: skinKey === 'space' ? '#F9F6F2' : '#555' };
}

// 主题定义
export const skins = {
  space: {
    name: '🌙 深空',
    bg: '#1A1A2E',
    gridBg: 'rgba(255,255,255,0.05)',
    cellBg: 'rgba(255,255,255,0.08)',
    text: '#F9F6F2',
    textSecondary: '#B8B5C0',
    accent: '#E94560',
    accentAlt: '#7C5CBF',
    glassBorder: 'rgba(255,255,255,0.1)',
    btnColors: { up: '#6B5B95', down: '#6B5B95', left: '#6B5B95', right: '#6B5B95' },
    btnAll: '#6B5B95',
  },
  sakura: {
    name: '🌸 樱花',
    bg: '#FFF5F7',
    gridBg: 'rgba(255,182,193,0.18)',
    cellBg: 'rgba(255,182,193,0.08)',
    text: '#5C4B6E',
    textSecondary: '#9B8AA0',
    accent: '#FF6B8A',
    accentAlt: '#48C78E',
    glassBorder: 'rgba(200,150,160,0.2)',
    hasPetals: true,
    btnColors: { up: '#E67B79', down: '#E67B79', left: '#E67B79', right: '#E67B79' },
    btnAll: '#E67B79',
  },
  mint: {
    name: '🍃 薄荷',
    bg: '#F0FFF4',
    gridBg: 'rgba(72,199,142,0.12)',
    cellBg: 'rgba(72,199,142,0.06)',
    text: '#2D5A3D',
    textSecondary: '#6B9B7A',
    accent: '#48C78E',
    accentAlt: '#9ECF6E',
    glassBorder: 'rgba(72,199,142,0.2)',
    btnColors: { up: '#00897B', down: '#00897B', left: '#00897B', right: '#00897B' },
    btnAll: '#00897B',
  },
  ocean: {
    name: '🌊 海洋',
    bg: '#F0F8FF',
    gridBg: 'rgba(64,169,255,0.12)',
    cellBg: 'rgba(64,169,255,0.06)',
    text: '#1A3A5C',
    textSecondary: '#5A7A9C',
    accent: '#40A9FF',
    accentAlt: '#36D1DC',
    glassBorder: 'rgba(64,169,255,0.2)',
    btnColors: { up: '#4169E1', down: '#4169E1', left: '#4169E1', right: '#4169E1' },
    btnAll: '#4169E1',
  },
};

export const skinKeys = Object.keys(skins);
