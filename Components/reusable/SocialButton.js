import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Proptypes from 'prop-types';

import {normalize} from '../reusable/Responsive';

function SocialButton(props) {
  return (
    <TouchableOpacity
      style={[styles.container, props.containerStyle]}
      onPress={props.onPress}>
      <View style={[styles.icon, props.iconStyle]}>{props.icon}</View>
      <View style={[styles.textView, props.textViewStyle]}>
        <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: normalize(10),
    borderRadius: 5,
    margin: normalize(10),
  },
  icon: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  textView: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: normalize(16),
  },
});

SocialButton.propTypes = {
  icon: Proptypes.element,
  text: Proptypes.string,
  iconStyle: Proptypes.object,
  textStyle: Proptypes.object,
  containerStyle: Proptypes.object,
  textViewStyle: Proptypes.object,
  onPress: Proptypes.func.isRequired,
};

export default SocialButton;
