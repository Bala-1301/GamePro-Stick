import {checkPropTypes} from 'prop-types';
import React from 'react';
import {View, Image, StyleSheet, Text, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Proptypes from 'prop-types';
import {normalize} from '../../reusable/Responsive';
import {buttonSound} from '../../reusable/ButtonSound';
import {getDimensions} from '../../reusable/ScreenDimensions';
import {useSelector} from 'react-redux';

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

function GameButtons(props) {
  const {keys} = useSelector((state) => state.currentGame);
  return (
    <View style={styles.container}>
      <View
        style={{
          transform: [{rotate: '45deg'}],
        }}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPressOut={() =>
                props.onToggle(`key:${keys.triangle.key.value}:up`)
              }
              onPressIn={() => {
                buttonSound();
                props.onToggle(`key:${keys.triangle.key.value}:down`);
              }}
              style={styles.imageContainerStyle}>
              <Image
                source={require('../../../assets/images/triangle-button.png')}
                style={styles.imageStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPressOut={() =>
                props.onToggle(`key:${keys.circle.key.value}:up`)
              }
              onPressIn={() => {
                buttonSound();

                props.onToggle(`key:${keys.circle.key.value}:down`);
              }}
              style={styles.imageContainerStyle}>
              <Image
                source={require('../../../assets/images/circle-button.png')}
                style={styles.imageStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPressOut={() => props.onToggle(`key:${keys.square.key.value}:up`)}
            onPressIn={() => {
              buttonSound();
              props.onToggle(`key:${keys.square.key.value}:down`);
            }}
            style={styles.imageContainerStyle}>
            <Image
              source={require('../../../assets/images/square-button.png')}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPressOut={() => props.onToggle(`key:${keys.cross.key.value}:up`)}
            onPressIn={() => {
              buttonSound();
              props.onToggle(`key:${keys.cross.key.value}:down`);
            }}
            style={styles.imageContainerStyle}>
            <Image
              source={require('../../../assets/images/cross-button.png')}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const rad = SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_WIDTH : SCREEN_HEIGHT;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 70,
  },
  imageStyle: {
    transform: [{rotate: '-45deg'}],
    height: rad * 0.125,
    width: rad * 0.125,
    margin: 8,
  },
  imageContainerStyle: {
    backgroundColor: '#fff',
    margin: normalize(6.5),
    borderRadius: (rad * 0.15) / 2,
    elevation: 13,
  },
});

GameButtons.propTypes = {
  onToggle: Proptypes.func.isRequired,
};

export default GameButtons;
