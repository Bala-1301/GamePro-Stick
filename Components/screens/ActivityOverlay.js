import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Overlay} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {getDisplayTime, getTime} from '../helper_functions/checkSameDay';
import SwipeGesture from 'react-native-swipe-gestures';
import {getDimensions} from '../reusable/ScreenDimensions';
import {normalize} from '../reusable/Responsive';
import {Picker} from '@react-native-picker/picker';
import {ThemeContext} from '../reusable/contexts/ThemeContext';
// import {Dropdown} from 'react-native-material-dropdown';

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

export default function ActivityOverlay({
  isVisible,
  onBackdropPress,
  ...props
}) {
  const playTime = useSelector((state) => state.playTime);
  const [current, setCurrent] = useState(playTime.perDayData);
  const allDayData = playTime.allDayData.concat(playTime.perDayData);
  allDayData.reverse();

  const {darkTheme} = useContext(ThemeContext);

  const _renderItem = ({item}) => (
    <View style={[styles.row, styles.item]}>
      <Text
        style={[
          styles.text,
          {
            fontSize: normalize(15),
            flex: 2,
            color: darkTheme ? '#fff' : '#000',
          },
        ]}
        numberOfLines={1}>
        {item.gameName}
      </Text>
      <Text
        style={[
          styles.text,
          {
            fontSize: normalize(15),
            flex: 1,
            textAlign: 'right',
            color: darkTheme ? '#fff' : '#000',
          },
        ]}>
        {getDisplayTime(item.time)}
      </Text>
    </View>
  );

  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={[
        styles.overlay,
        {backgroundColor: darkTheme ? '#292827' : '#fff'},
      ]}
      onBackdropPress={onBackdropPress}>
      <>
        <View
          style={[
            styles.row,
            styles.avgView,
            {borderBottomColor: darkTheme ? '#fff' : '#000'},
          ]}>
          <Text
            style={[
              styles.text,
              styles.bold,
              {color: darkTheme ? '#fff' : '#000'},
            ]}>
            Daily Average
          </Text>
          <Text style={[styles.text, {color: darkTheme ? '#fff' : '#000'}]}>
            {getDisplayTime(
              playTime.totalTime / (playTime.allDayData.length + 1),
            )}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          {/* <Text style={[styles.text, {textAlign: 'right'}]}>
          {new Date(current.date).toUTCString().substr(5, 6)}
        </Text> */}
          <Picker
            selectedValue={current}
            style={{
              height: SCREEN_HEIGHT * 0.03,
              width: SCREEN_WIDTH * 0.3,
              marginRight: normalize(-10),
              borderWidth: 1,
              marginBottom: 10,
            }}
            itemStyle={{
              fontSize: normalize(17),
              textDecorationLine: 'underline',
            }}
            mode="dropdown"
            onValueChange={(item, index) => {
              setCurrent(item);
            }}>
            {allDayData.map((item, index) => (
              <Picker.Item
                key={index}
                label={new Date(item.date).toUTCString().substr(5, 6)}
                value={item}
                color={'#454441'}
              />
            ))}
          </Picker>
          {/* <Dropdown
          label={new Date(current.date).toUTCString().substr(5, 6)}
          data={allDayData}
          onChangeText={(x, y, z) => console.log(x, y, z)}
        /> */}
        </View>
        <View>
          <View style={{marginTop: normalize(10)}}>
            <Text
              style={[
                styles.text,
                ,
                styles.bold,
                {fontSize: normalize(16), color: darkTheme ? '#fff' : '#000'},
              ]}>
              Game(s) Played:
            </Text>
            <FlatList
              data={current.games}
              renderItem={_renderItem}
              keyExtractor={(item, index) => index + ''}
              style={{marginBottom: SCREEN_HEIGHT * 0.22}}
            />
          </View>
        </View>
        <View
          style={[
            styles.row,
            styles.totalTimeView,
            {borderTopColor: darkTheme ? '#fff' : '#000'},
          ]}>
          <Text
            style={[
              styles.text,
              {fontSize: normalize(16), color: darkTheme ? '#fff' : '#000'},
            ]}>
            Total Time
          </Text>
          <Text
            style={[
              styles.text,
              {fontSize: normalize(16), color: darkTheme ? '#fff' : '#000'},
            ]}>
            {getDisplayTime(current.time)}
          </Text>
        </View>
      </>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.61,
    padding: normalize(15),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: normalize(18),
    color: '#454441',
  },
  bold: {
    fontWeight: 'bold',
  },
  avgView: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  item: {
    margin: normalize(10),
    marginBottom: 0,
  },
  totalTimeView: {
    position: 'absolute',
    bottom: 5,
    left: normalize(10),
    right: normalize(10),
    borderTopWidth: 1,
    padding: normalize(10),
  },
});
