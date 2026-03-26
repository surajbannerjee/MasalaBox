import { Dimensions, Platform } from "react-native";


export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;

export const platform = Platform.OS;
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 * Responsive helpers:
 * - `hp(percent)` — returns height in pixels for given percent of device height.
 * - `wp(percent)` — returns width in pixels for given percent of device width.
 * Use numeric percent (e.g. `hp(5)` for 5% of screen height).
 */
export const hp = (percent) => (deviceHeight * percent) / 100;
export const wp = (percent) => (deviceWidth * percent) / 100;

// convenience helpers: convert pixel values (px) to hp/wp percentages
export const hpPx = (px) => hp((px / deviceHeight) * 100);
export const wpPx = (px) => wp((px / deviceWidth) * 100);
