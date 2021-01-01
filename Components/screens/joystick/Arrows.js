import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Proptypes from 'prop-types';
import {buttonSound} from '../../reusable/ButtonSound';
import {getDimensions} from '../../reusable/ScreenDimensions';
import {useSelector} from 'react-redux';

const {SCREEN_WIDTH, SCREEN_HEIGHT} = getDimensions();

const size = SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_WIDTH : SCREEN_HEIGHT;

function Arrows(props) {
  const {keys} = useSelector((state) => state.currentGame);
  return (
    <View
      style={{
        transform: [{rotate: '45deg'}],
      }}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPressIn={() => {
              props.onArrow(`key:${keys.up.key.value}:down`);
              buttonSound();
            }}
            onPressOut={() => props.onArrow(`key:${keys.up.key.value}:up`)}>
            <MaterialIcons
              name="label"
              color="#fff"
              style={[
                {
                  transform: [{rotate: '45deg'}],
                },
                styles.arrow,
              ]}
              size={size * 0.18}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={() => {
              props.onArrow(`key:${keys.right.key.value}:down`);
              buttonSound();
            }}
            onPressOut={() => props.onArrow(`key:${keys.right.key.value}:up`)}>
            <MaterialIcons
              name="label"
              color="#fff"
              size={size * 0.18}
              style={[
                {
                  transform: [{rotate: '135deg'}],
                },
                styles.arrow,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPressIn={() => {
            props.onArrow(`key:${keys.left.key.value}:down`);
            buttonSound();
          }}
          onPressOut={() => props.onArrow(`key:${keys.left.key.value}:up`)}>
          <MaterialIcons
            name="label"
            color="#fff"
            size={size * 0.18}
            style={[
              {
                transform: [{rotate: '-45deg'}],
              },
              styles.arrow,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => {
            props.onArrow(`key:${keys.down.key.value}:down`);
            buttonSound();
          }}
          onPressOut={() => props.onArrow(`key:${keys.down.key.value}:up`)}>
          <MaterialIcons
            name="label"
            color="#fff"
            size={size * 0.18}
            style={[
              {
                transform: [{rotate: '-135deg'}],
              },
              styles.arrow,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    borderColor: '#000',
    borderWidth: 1.5,
    elevation: 20,
  },
});

Arrows.propTypes = {
  onArrow: Proptypes.func.isRequired,
  keys: Proptypes.object.isRequired,
};

export default Arrows;
