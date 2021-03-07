import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {Button, Divider, RadioButton} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {normalize} from '../reusable/Responsive';
import {Avatar, Header, Overlay} from 'react-native-elements';
import {AuthContext} from '../reusable/contexts/AuthContext';
import {getDimensions} from '../reusable/ScreenDimensions';
import {useDispatch, useSelector} from 'react-redux';
import {resetGames, setJoystickFeedback} from '../redux/actions';
import {
  NO_FEEDBACK,
  SOUND_FEEDBACK,
  VIBRATE_FEEDBACK,
} from '../reusable/ButtonSound';
import {TouchableOpacity} from 'react-native';
import ActivityOverlay from './ActivityOverlay';
import {ThemeContext} from '../reusable/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {SCREEN_WIDTH, SCREEN_HEIGHT} = getDimensions();

function Profile(props) {
  const [showFeedBack, setShowFeedBack] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  const dispatch = useDispatch();
  const joystickFeedback = useSelector((state) => state.joystickFeedback);

  const {darkTheme, setDarkTheme} = useContext(ThemeContext);
  const {user, toggleFirstTime} = useContext(AuthContext);

  const handleLogout = () => {
    GoogleSignin.signOut().then(() =>
      auth()
        .signOut()
        .then(() => console.log('signed out')),
    );
    dispatch(resetGames());
  };

  const confirmLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure do you want to logout?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Logout',
        onPress: handleLogout,
        style: 'destructive',
      },
    ]);
  };

  const handleFeedbackChange = (type) => {
    dispatch(setJoystickFeedback(type));
  };

  const handleThemeChange = async (value) => {
    setDarkTheme(value);
    AsyncStorage.setItem('darkTheme', `${value}`);
  };

  return (
    <>
      <Header
        statusBarProps={{
          barStyle: darkTheme ? 'light-content' : 'dark-content',
          backgroundColor: darkTheme ? '#000' : '#fff',
        }}
        centerComponent={{
          text: 'Settings',
          style: {
            fontSize: normalize(22),
            color: darkTheme ? '#fff' : '#000',
            fontWeight: 'bold',
          },
        }}
        containerStyle={{
          backgroundColor: darkTheme ? '#000' : '#fff',
          borderBottomColor: '#a2a3a2',
          borderBottomWidth: 0.2,
        }}
      />
      <View style={{backgroundColor: darkTheme ? '#000' : '#fff', flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: normalize(20),
            marginBottom: normalize(30),
            marginTop: normalize(30),
            alignItems: 'center',
          }}>
          {user === null ? (
            <Button
              title="Login"
              onPress={() => toggleFirstTime()}
              mode="contained">
              Login
            </Button>
          ) : (
            <View>
              <Text style={{color: darkTheme ? '#fff' : '#000'}}>
                Logged in as
              </Text>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontWeight: 'bold',
                  color: darkTheme ? '#fff' : '#000',
                }}
                numberOfLines={1}>
                {user.displayName}
              </Text>
              <Text
                numberOfLines={1}
                style={{color: darkTheme ? '#fff' : '#000'}}>
                {user.email}
              </Text>
            </View>
          )}
          <View>
            <Avatar
              rounded
              source={{
                uri: user?.photoURL,
              }}
              icon={{name: 'user', type: 'feather'}}
              size={SCREEN_HEIGHT * 0.1}
            />
          </View>
        </View>

        <Divider
          style={{
            backgroundColor: darkTheme
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          }}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setShowFeedBack(true)}>
            <View style={styles.itemContentOne}>
              <MaterialIcons
                name="volume-up"
                size={SCREEN_WIDTH * 0.07}
                style={styles.icon}
                color={darkTheme ? '#fff' : '#000'}
              />
              <Text
                style={[styles.itemText, {color: darkTheme ? '#fff' : '#000'}]}>
                Set Joystick FeedBack Type
              </Text>
            </View>
            <View style={styles.itemContentTwo}>
              <Feather
                name="chevron-right"
                size={SCREEN_WIDTH * 0.07}
                color={darkTheme ? '#fff' : '#000'}
              />
            </View>
          </TouchableOpacity>
          <Divider
            style={{
              backgroundColor: darkTheme
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
            }}
          />
          <TouchableOpacity
            style={styles.item}
            onPress={() => setShowActivity(true)}>
            <View style={styles.itemContentOne}>
              <MaterialIcons
                name="history"
                size={SCREEN_WIDTH * 0.07}
                style={styles.icon}
                color={darkTheme ? '#fff' : '#000'}
              />

              <Text
                style={[styles.itemText, {color: darkTheme ? '#fff' : '#000'}]}>
                Activity
              </Text>
            </View>
            <View style={styles.itemContentTwo}>
              <Feather
                name="chevron-right"
                size={SCREEN_WIDTH * 0.07}
                color={darkTheme ? '#fff' : '#000'}
              />
            </View>
          </TouchableOpacity>
          <Divider
            style={{
              backgroundColor: darkTheme
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
            }}
          />
          <TouchableWithoutFeedback
            onPress={() => setDarkTheme((prev) => !prev)}>
            <View style={styles.item}>
              <View style={styles.itemContentOne}>
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={SCREEN_WIDTH * 0.07}
                  style={styles.icon}
                  color={darkTheme ? '#fff' : '#000'}
                />
                <Text
                  style={[
                    styles.itemText,
                    {color: darkTheme ? '#fff' : '#000'},
                  ]}>
                  Dark Theme
                </Text>
              </View>
              <View style={styles.itemContentTwo}>
                <Switch value={darkTheme} onValueChange={handleThemeChange} />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Divider
            style={{
              backgroundColor: darkTheme
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
            }}
          />

          {user !== null && (
            <>
              <TouchableOpacity style={styles.item} onPress={confirmLogout}>
                <View style={styles.itemContentOne}>
                  <Feather
                    name="log-out"
                    size={SCREEN_WIDTH * 0.07}
                    style={styles.icon}
                    color={darkTheme ? '#fff' : '#000'}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      {color: darkTheme ? '#fff' : '#000'},
                    ]}>
                    Logout
                  </Text>
                </View>
                <View style={styles.itemContentTwo}>
                  <Feather
                    name="chevron-right"
                    size={SCREEN_WIDTH * 0.07}
                    color={darkTheme ? '#fff' : '#000'}
                  />
                </View>
              </TouchableOpacity>
              <Divider
                style={{
                  backgroundColor: darkTheme
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                }}
              />
            </>
          )}
        </View>
      </View>
      <Overlay
        isVisible={showFeedBack}
        overlayStyle={[
          styles.overlay,
          {backgroundColor: darkTheme ? '#292827' : '#fff'},
        ]}
        onBackdropPress={() => setShowFeedBack(false)}>
        <>
          <TouchableOpacity
            style={{position: 'absolute', top: 0, right: 0, padding: 5}}
            onPress={() => setShowFeedBack(false)}>
            <Feather
              name="x"
              size={SCREEN_WIDTH * 0.055}
              color={darkTheme ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: normalize(17),
                fontWeight: 'bold',
                color: darkTheme ? '#fff' : '#000',
              }}>
              Set Feedback
            </Text>
          </View>
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleFeedbackChange(SOUND_FEEDBACK)}>
            <Text
              style={[styles.itemText, {color: darkTheme ? '#fff' : '#000'}]}>
              Sound
            </Text>
            <RadioButton
              onPress={() => handleFeedbackChange(SOUND_FEEDBACK)}
              value={SOUND_FEEDBACK}
              status={
                joystickFeedback.feedback === SOUND_FEEDBACK
                  ? 'checked'
                  : 'unchecked'
              }
            />
          </TouchableOpacity>
          <Divider
            style={{
              backgroundColor: darkTheme
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
            }}
          />

          <TouchableOpacity
            style={styles.row}
            onPress={() => handleFeedbackChange(VIBRATE_FEEDBACK)}>
            <Text
              style={[styles.itemText, {color: darkTheme ? '#fff' : '#000'}]}>
              Vibrate
            </Text>
            <RadioButton
              value={VIBRATE_FEEDBACK}
              onPress={() => handleFeedbackChange(VIBRATE_FEEDBACK)}
              status={
                joystickFeedback.feedback === VIBRATE_FEEDBACK
                  ? 'checked'
                  : 'unchecked'
              }
            />
          </TouchableOpacity>
          <Divider
            style={{
              backgroundColor: darkTheme
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
            }}
          />

          <TouchableOpacity
            style={styles.row}
            onPress={() => handleFeedbackChange(NO_FEEDBACK)}>
            <Text
              style={[styles.itemText, {color: darkTheme ? '#fff' : '#000'}]}>
              None
            </Text>
            <RadioButton
              onPress={() => handleFeedbackChange(NO_FEEDBACK)}
              value={NO_FEEDBACK}
              status={
                joystickFeedback.feedback === NO_FEEDBACK
                  ? 'checked'
                  : 'unchecked'
              }
            />
          </TouchableOpacity>
          {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Button>Close</Button>
        </View> */}
        </>
      </Overlay>
      {showActivity && (
        <ActivityOverlay
          isVisible={showActivity}
          onBackdropPress={() => setShowActivity(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: normalize(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',

    elevation: 13,
  },
  headerText: {
    fontSize: normalize(19),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    paddingLeft: normalize(15),
    paddingRight: normalize(10),
    paddingTop: normalize(35),
    paddingBottom: normalize(25),

    alignItems: 'center',
    flex: 1,
  },
  footer: {
    marginTop: SCREEN_HEIGHT * 0.05,
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: normalize(15),
  },
  itemContentOne: {
    flex: 5,
    flexDirection: 'row',
  },
  itemContentTwo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overlay: {
    height: SCREEN_HEIGHT * 0.25,
    width: SCREEN_WIDTH * 0.5,
    paddingLeft: normalize(10),
  },
});

export default Profile;
