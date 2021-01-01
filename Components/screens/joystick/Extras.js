import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {buttonSound} from '../../reusable/ButtonSound';
import {getDimensions} from '../../reusable/ScreenDimensions';

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

function Extras(props) {
  const {keys} = useSelector((state) => state.currentGame);
  return (
    <>
      <View style={styles.upperExtrasView}>
        <TouchableOpacity
          style={[styles.extraButton, styles.extraButtonUp]}
          onPressIn={() => {
            props.onToggle(`key:${keys.e1.key.value}:down`);
            buttonSound();
          }}
          onPressOut={() => props.onToggle(`key:${keys.e1.key.value}:up`)}>
          <Text
            style={
              keys.e1.key.value !== '' && keys.e1.key.value.length > 3
                ? styles.small
                : styles.bold
            }>
            {keys.e1.key.value === '' ? 'E1' : keys.e1.key.value.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.extraButton, styles.extraButtonUp]}
          onPressIn={() => {
            props.onToggle(`key:${keys.e2.key.value}:down`);
            buttonSound();
          }}
          onPressOut={() => props.onToggle(`key:${keys.e2.key.value}:up`)}>
          <Text
            style={
              keys.e2.key.value !== '' && keys.e2.key.value.length > 3
                ? styles.small
                : styles.bold
            }>
            {keys.e2.key.value === '' ? 'E2' : keys.e2.key.value.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lowerExtrasView}>
        <TouchableOpacity
          style={[styles.extraButton, styles.extraButtonDown]}
          onPressIn={() => {
            props.onToggle(`key:${keys.e3.key.value}:down`);
            buttonSound();
          }}
          onPressOut={() => props.onToggle(`key:${keys.e3.key.value}:up`)}>
          <Text
            style={
              keys.e3.key.value !== '' && keys.e3.key.value.length > 3
                ? styles.small
                : styles.bold
            }>
            {keys.e3.key.value === '' ? 'E3' : keys.e3.key.value.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.extraButton, styles.extraButtonDown]}
          onPressIn={() => {
            props.onToggle(`key:${keys.e4.key.value}:down`);
            buttonSound();
          }}
          onPressOut={() => props.onToggle(`key:${keys.e4.key.value}:up`)}>
          <Text
            style={
              keys.e4.key.value !== '' && keys.e4.key.value.length > 3
                ? styles.small
                : styles.bold
            }>
            {keys.e4.key.value === '' ? 'E4' : keys.e4.key.value.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const rad = SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_WIDTH : SCREEN_HEIGHT;

const styles = StyleSheet.create({
  extraButton: {
    height: rad * 0.13,
    width: rad * 0.13,
    borderRadius: (rad * 0.13) / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 16,
  },
  small: {
    fontSize: rad * 0.02,
    fontWeight: 'bold',
    // margin: 3,
  },
  bold: {
    fontWeight: 'bold',
  },
  extraButtonUp: {
    marginLeft: rad * 0.06,
    marginRight: rad * 0.06,
  },
  extraButtonDown: {
    marginLeft: rad * 0.14,
    marginRight: rad * 0.14,
  },
  upperExtrasView: {
    position: 'absolute',
    bottom: rad * 0.25,
    left: rad * 0.75,
    flexDirection: 'row',
  },
  lowerExtrasView: {
    position: 'absolute',
    bottom: rad * 0.05,
    left: rad * 0.58,
    flexDirection: 'row',
  },
});

export default Extras;
