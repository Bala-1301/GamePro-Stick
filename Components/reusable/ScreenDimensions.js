import {Dimensions} from 'react-native';

export const getDimensions = () => {
  const {width, height} = Dimensions.get('screen');
  return {SCREEN_WIDTH: width, SCREEN_HEIGHT: height};
};
