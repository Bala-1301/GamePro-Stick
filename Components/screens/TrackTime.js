import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Svg from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory-native';
import {Button} from 'react-native-paper';
import {Overlay, Header} from 'react-native-elements';
import {WheelPicker} from 'react-native-wheel-picker-android';
import {
  removeReminderLimit,
  REMOVE_REMINDER_LIMIT,
  setReminderLimit,
  SET_REMINDER_LIMIT,
} from '../redux/actions';
import {
  getHours,
  getMins,
  getTimeFromSeconds,
} from '../helper_functions/checkSameDay';
import {normalize} from '../reusable/Responsive';
import {getDimensions} from '../reusable/ScreenDimensions';

const {SCREEN_WIDTH, SCREEN_HEIGHT} = getDimensions();

export default function TrackTime() {
  const playTime = useSelector((state) => state.playTime);
  const dispatch = useDispatch();
  const [showOverlay, setshowOverlay] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [{hours, mins}, setTime] = useState(
    playTime.reminderLimit === Infinity
      ? {
          hours: null,
          mins: null,
        }
      : {
          hours: getHours(playTime.reminderLimit),
          mins: getMins(playTime.reminderLimit),
        },
  );

  const handleSetReminder = () => {
    console.log(hours, mins);
    const milliSeconds = hours * 60 * 60 * 1000 + mins * 60 * 1000;
    if (milliSeconds !== 0) {
      dispatch(setReminderLimit(milliSeconds));
    }
    setShowTimePicker(false);
    setshowOverlay(false);
  };

  const handleRemoveReminder = () => {
    dispatch(removeReminderLimit());
    setshowOverlay(false);
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{
          text: 'Time Spent',
          style: {fontSize: normalize(22), color: '#000', fontWeight: 'bold'},
        }}
        containerStyle={{backgroundColor: '#fff'}}
      />
      <View style={{flex: 1.5}}>
        <Text style={styles.graphTitle}>Past 15 days</Text>
        <Text style={styles.graphText}>
          Press on the Graph's Bar to know{'\n'} details about the particular
          day.
        </Text>
        <Svg>
          <VictoryChart
            width={SCREEN_WIDTH}
            theme={VictoryTheme.material}
            domainPadding={10}>
            <VictoryAxis
              tickFormat={(x) => {
                const date = new Date(x);
                return `${date.toUTCString().substr(0, 11)} `;
              }}
              fixLabelOverlap={true}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => {
                return `${x / 1000000}Hr`;
              }}
            />

            <VictoryBar
              animate={{
                duration: 2000,
                onLoad: {duration: 1000},
              }}
              alignment="m"
              data={allDayData.map((data) => ({
                ...data,
                time: data.time / 3.5,
              }))}
              x="date"
              y="time"
              labels={({datum}) =>
                `${datum.date.toUTCString().substr(4, 7).split(' ').join('\n')}`
              }
              labelComponent={
                <VictoryTooltip
                  flyoutComponent={<CustomLabel />}
                  style={{marginTop: 50}}
                />
              }
            />
          </VictoryChart>
        </Svg>
      </View>
      <View style={styles.outerReminderView}>
        <TouchableOpacity
          style={styles.reminderTextView}
          onPress={() => setshowOverlay(true)}>
          <View style={{padding: 10}}>
            <Ionicons name="alarm-outline" size={SCREEN_WIDTH * 0.1} />
          </View>
          <View>
            <Text style={styles.reminderTitle}>Set Reminder</Text>
            <Text style={styles.reminderSubTitle}>
              We will remind you when your playtime {'\n'} crosses the limit set
              by you.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setshowOverlay(true)}
          style={styles.reminderRightView}>
          <Text style={styles.reminderTimeText}>
            {playTime.reminderLimit === Infinity
              ? 'Not Set'
              : getTimeFromSeconds(playTime.reminderLimit)}
          </Text>
          <Feather
            name="chevron-right"
            size={SCREEN_WIDTH * 0.07}
            color="grey"
          />
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={showOverlay}
        overlayStyle={styles.overlay}
        onBackdropPress={() => setshowOverlay(false)}>
        {showTimePicker || playTime.reminderLimit === Infinity ? (
          <>
            <Text style={[styles.reminderTitle, {textAlign: 'center'}]}>
              Set Reminder Limit
            </Text>
            <View
              style={{flexDirection: 'row', marginLeft: -10, marginTop: 20}}>
              <WheelPicker
                onItemSelected={(i) => setTime((prev) => ({...prev, hours: i}))}
                selectedItem={hours}
                data={Array(24)
                  .fill()
                  .map((_, i) => (i === 1 ? `${i} hour` : `${i} hours`))}
              />
              <WheelPicker
                onItemSelected={(i) =>
                  setTime((prev) => ({...prev, mins: i * 15}))
                }
                selectedItem={mins / 15}
                data={Array(4)
                  .fill()
                  .map((_, i) => `${i * 15} minutes`)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Button
                mode="outlined"
                color="red"
                style={styles.button}
                onPress={() => setShowTimePicker(false)}>
                Cancel
              </Button>
              <Button onPress={handleSetReminder} mode="contained">
                Set Reminder
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.bottomSheet}>
            <Text style={[styles.reminderTitle, {padding: 10}]}>
              Daily Reminder
            </Text>
            <Ionicons
              name="alarm-outline"
              size={SCREEN_WIDTH * 0.3}
              color="#6b6969"
            />
            <Text style={{textAlign: 'center', margin: 5, color: 'grey'}}>
              Your daily remainder is set to{'\n'}
              {getTimeFromSeconds(playTime.reminderLimit, true)}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Button
                color="red"
                mode="outlined"
                style={styles.button}
                onPress={handleRemoveReminder}>
                Remove
              </Button>
              <Button
                style={styles.button}
                mode="contained"
                onPress={() => setShowTimePicker(true)}>
                Edit
              </Button>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.close}
          onPress={() => setshowOverlay(false)}>
          <Feather name="x" size={SCREEN_WIDTH * 0.05} />
        </TouchableOpacity>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  outerReminderView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -100,
  },
  reminderTextView: {
    flex: 4,
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    marginLeft: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reminderRightView: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    marginRight: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: normalize(15),
    fontWeight: 'bold',
  },
  reminderTimeText: {
    fontSize: normalize(12),
    color: 'grey',
    marginRight: -5,
    marginTop: -2,
  },
  reminderSubTitle: {
    color: 'grey',
  },
  bottomSheet: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: '#fff',
    minWidth: SCREEN_WIDTH * 0.75,
    maxWidth: SCREEN_WIDTH,
    minHeight: SCREEN_HEIGHT * 0.2,
    justifyContent: 'center',
    paddingTop: normalize(25),
  },
  button: {
    margin: 10,
    width: SCREEN_WIDTH * 0.3,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  graphTitle: {
    fontSize: normalize(17),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  graphText: {
    textAlign: 'center',
    color: 'grey',
  },
});

function CustomLabel(props) {
  // console.log('custom ', props);

  const {datum} = props;

  return (
    <View
      style={{
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.42,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
      }}>
      <View
        style={{
          backgroundColor: '#fff',
          width: SCREEN_WIDTH * 0.8,
        }}>
        <VictoryChart
          width={SCREEN_WIDTH * 0.8}
          height={SCREEN_HEIGHT * 0.3}
          theme={VictoryTheme.material}
          domainPadding={20}>
          <VictoryAxis
            tickFormat={(x) => {
              if (x.split(' ').length > 1) {
                return x
                  .split(' ')
                  .map((a) => a[0])
                  .join('');
              }
              return x;
            }}
            fixLabelOverlap={true}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => {
              console.log(x);
              return `${x / 1000000}Hr`;
            }}
          />
          <VictoryBar
            alignment="middle"
            data={datum.games.map((data) => ({
              ...data,
              time: data.time / 3.5,
            }))}
            x="gameName"
            y="time"
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const allDayData = [
  {
    date: new Date(2020, 11, 1),
    time: 1000 * 60 * 60,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 2),
    time: 1000 * 60 * 60,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },

  {
    date: new Date(2020, 11, 3),
    time: 1000 * 60 * 70,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 4),
    time: 1000 * 60 * 30,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 5),
    time: 1000 * 60 * 50,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 6),
    time: 1000 * 60 * 40,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 7),
    time: 1000 * 60 * 80,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 8),
    time: 1000 * 60 * 90,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 9),
    time: 1000 * 60 * 10,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },

  {
    date: new Date(2020, 11, 10),
    time: 1000 * 60 * 40,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 11),
    time: 1000 * 60 * 20,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 12),
    time: 1000 * 60 * 80,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 13),
    time: 1000 * 60 * 75,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 14),
    time: 1000 * 60 * 65,
    games: [
      {gameName: 'NFS', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
  {
    date: new Date(2020, 11, 15),
    time: 1000 * 60 * 60,
    games: [
      {gameName: 'Need For Speed: Most Wanted', time: 1000 * 60 * 20},
      {gameName: 'GTA', time: 1000 * 60 * 10},
      {gameName: 'Witcher', time: 1000 * 60 * 30},
    ],
  },
];
