import { StyleSheet, Text, type TextProps } from 'react-native';
import { hpPx } from '../src/constants/constants';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: hpPx(16),
    lineHeight: hpPx(24),
  },
  defaultSemiBold: {
    fontSize: hpPx(16),
    lineHeight: hpPx(24),
    fontWeight: '600',
  },
  title: {
    fontSize: hpPx(32),
    fontWeight: 'bold',
    lineHeight: hpPx(32),
  },
  subtitle: {
    fontSize: hpPx(20),
    fontWeight: 'bold',
  },
  link: {
    lineHeight: hpPx(30),
    fontSize: hpPx(16),
    color: '#0a7ea4',
  },
});
