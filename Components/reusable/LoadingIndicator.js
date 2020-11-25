import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {normalize} from './Responsive';

function LoadingIndicator(props) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size={normalize(25)} />
    </View>
  );
}

export default LoadingIndicator;
