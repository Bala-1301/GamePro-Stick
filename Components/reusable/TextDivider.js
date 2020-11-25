import React from 'react';
import {View, Text} from 'react-native';

function TextDivider(props) {
  return (
    <View style={{flexDirection: 'row'}}>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: 1,
          marginBottom: 12,
          width: '45%',
        }}></View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 15,
          color: 'grey',
          margin: 5,
        }}>
        {props.text}
      </Text>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: 1,
          marginBottom: 12,
          width: '45%',
        }}></View>
    </View>
  );
}

export default TextDivider;
