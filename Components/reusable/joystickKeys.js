import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDimensions} from './ScreenDimensions';

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

const size = SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT;

export const UpArrow = () => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <MaterialIcons
      name="arrow-drop-up"
      color="#fff"
      style={[styles.arrow]}
      size={size * 0.2}
    />
    <Image
      source={require('../../assets/images/analog.png')}
      style={{width: size * 0.09, height: size * 0.06}}
    />
  </View>
);

export const RightArrow = () => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <MaterialIcons
      name="arrow-right"
      color="#fff"
      size={size * 0.2}
      style={[styles.arrow]}
    />
    <Image
      source={require('../../assets/images/analog.png')}
      style={{
        width: size * 0.09,
        height: size * 0.06,
        transform: [{rotate: '90deg'}],
      }}
    />
  </View>
);

export const LeftArrow = () => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <MaterialIcons
      name="arrow-left"
      color="#fff"
      size={size * 0.2}
      style={[styles.arrow]}
    />
    <Image
      source={require('../../assets/images/analog.png')}
      style={{
        width: size * 0.09,
        height: size * 0.06,
        transform: [{rotate: '-90deg'}],
      }}
    />
  </View>
);

export const DownArrow = () => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <MaterialIcons
      name="arrow-drop-down"
      color="#fff"
      size={size * 0.2}
      style={[styles.arrow]}
    />
    <Image
      source={require('../../assets/images/analog.png')}
      style={{
        width: size * 0.09,
        height: size * 0.06,
        transform: [{rotate: '180deg'}],
      }}
    />
  </View>
);

export const Triangle = () => (
  <Image
    source={require('../../assets/images/triangle-button.png')}
    style={styles.imageStyle}
  />
);

export const Circle = () => (
  <Image
    source={require('../../assets/images/circle-button.png')}
    style={styles.imageStyle}
  />
);

export const Square = () => (
  <Image
    source={require('../../assets/images/square-button.png')}
    style={styles.imageStyle}
  />
);

export const Cross = () => (
  <Image
    source={require('../../assets/images/cross-button.png')}
    style={styles.imageStyle}
  />
);

export const Pause = () => (
  <Ionicons name="pause" size={size * 0.1} color="#fff" style={styles.icon} />
);

export const Enter = () => (
  <Ionicons name="play" size={size * 0.1} color="#fff" style={styles.icon} />
);

const styles = StyleSheet.create({
  arrow: {
    padding: 0,
    margin: -10,
  },
  imageStyle: {
    height: size * 0.125,
    width: size * 0.125,
    margin: 8,
    marginLeft: size * 0.08,
  },
  icon: {
    margin: size * 0.02,
    marginLeft: size * 0.1,
  },
});
