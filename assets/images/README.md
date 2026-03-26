Place your image files here. Suggested names:

- splash1.png, splash2.png, splash3.png
- login-header.jpg, signup-header.jpg, forgot-header.jpg
- onboarding-1.jpg, onboarding-2.jpg, onboarding-3.jpg

After adding files, update `src/constants/images.js` to use require() instead of remote URLs:

Example:
export const SPLASHSCREEN_IMAGES = {
splash1: require('../../assets/images/splash1.png'),
splash2: require('../../assets/images/splash2.png'),
splash3: require('../../assets/images/splash3.png'),
};
