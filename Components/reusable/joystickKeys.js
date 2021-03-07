import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDimensions} from './ScreenDimensions';

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

const size = SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT;

export const UpArrow = ({darkTheme}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <MaterialIcons
      name="arrow-drop-up"
      color={darkTheme ? '#fff' : '#000'}
      style={[styles.arrow]}
      size={size * 0.2}
    />
    <Image
      source={
        darkTheme
          ? require('../../assets/images/analog.png')
          : require('../../assets/images/analog-dark.png')
      }
      style={{width: size * 0.09, height: size * 0.06}}
    />
  </View>
);

export const RightArrow = ({darkTheme}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <MaterialIcons
      name="arrow-right"
      color={darkTheme ? '#fff' : '#000'}
      size={size * 0.2}
      style={[styles.arrow]}
    />
    <Image
      source={
        darkTheme
          ? require('../../assets/images/analog.png')
          : require('../../assets/images/analog-dark.png')
      }
      style={{
        width: size * 0.09,
        height: size * 0.06,
        transform: [{rotate: '90deg'}],
      }}
    />
  </View>
);

export const LeftArrow = ({darkTheme}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <MaterialIcons
      name="arrow-left"
      color={darkTheme ? '#fff' : '#000'}
      size={size * 0.2}
      style={[styles.arrow]}
    />
    <Image
      source={
        darkTheme
          ? require('../../assets/images/analog.png')
          : require('../../assets/images/analog-dark.png')
      }
      style={{
        width: size * 0.09,
        height: size * 0.06,
        transform: [{rotate: '-90deg'}],
      }}
    />
  </View>
);

export const DownArrow = ({darkTheme}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <MaterialIcons
      name="arrow-drop-down"
      color={darkTheme ? '#fff' : '#000'}
      size={size * 0.2}
      style={[styles.arrow]}
    />
    <Image
      source={
        darkTheme
          ? require('../../assets/images/analog.png')
          : require('../../assets/images/analog-dark.png')
      }
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

export const Pause = ({darkTheme}) => (
  <Ionicons
    name="pause"
    size={size * 0.1}
    color={darkTheme ? '#fff' : '#000'}
    style={styles.icon}
  />
);

export const Enter = ({darkTheme}) => (
  <Ionicons
    name="play"
    size={size * 0.1}
    color={darkTheme ? '#fff' : '#000'}
    style={styles.icon}
  />
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
