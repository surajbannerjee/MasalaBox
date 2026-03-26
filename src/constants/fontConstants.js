import { Dimensions } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
export const deviceHeight = Dimensions.get('window').height;

//Font constants
export const BIG = RFValue(42, deviceHeight);
export const H1BIG = RFValue(32, deviceHeight);
export const H1 = RFValue(28, deviceHeight);
export const H2 = RFValue(26, deviceHeight);
export const H3 = RFValue(24, deviceHeight);
export const H4 = RFValue(22, deviceHeight);
export const H5 = RFValue(20, deviceHeight);
export const H6 = RFValue(18, deviceHeight);
export const p = RFValue(16, deviceHeight);
export const small = RFValue(14, deviceHeight);
export const smallS = RFValue(12, deviceHeight);