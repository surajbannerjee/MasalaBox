import Animated from 'react-native-reanimated';
import { hpPx } from '../src/constants/constants';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: hpPx(28),
        lineHeight: hpPx(32),
        marginTop: hpPx(-6),
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}
