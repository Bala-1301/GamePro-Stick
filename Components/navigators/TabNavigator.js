import React, {useContext, useEffect, useState} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Profile from '../screens/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import {Image, Keyboard, Text} from 'react-native';
// import TrackTime from '../screens/TrackTime';
import AddGame from '../screens/AddGame';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {getDimensions} from '../reusable/ScreenDimensions';
import {ThemeContext} from '../reusable/contexts/ThemeContext';
import {TouchableHighlight} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

const Tab = createMaterialBottomTabNavigator();

function TabNavigator(props) {
  const [addGameFocused, setAddGameFocused] = useState(false);
  const {darkTheme} = useContext(ThemeContext);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, []);

  const keyboardDidShow = () => setKeyboardVisible(true);
  const keyboardDidHide = () => setKeyboardVisible(false);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        keyboardHidesNavigationBar
        backBehavior="initialRoute"
        barStyle={{
          borderTopColor: darkTheme ? '#fff' : '#000',
          borderTopWidth: 1,
        }}
        activeColor={darkTheme ? '#fff' : '#000'}
        shifting={true}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <Ionicons
                name="game-controller-outline"
                size={20}
                color={darkTheme ? '#FFF' : '#000'}
                style={focused ? null : {opacity: 0.5}}
              />
            ),
            tabBarColor: darkTheme ? '#000' : '#fff',
          }}
          listeners={{
            tabPress: () => {
              if (addGameFocused) {
                setAddGameFocused(false);
              }
            },
          }}
        />
        {/* <Tab.Screen
          name="Scan QR"
          component={ScanQRScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <MaterialIcons
                name="qr-code-scanner"
                size={20}
                color="#fff"
                style={focused ? null : {opacity: 0.5}}
              />
            ),
            tabBarColor: '#000',
          }}
        /> */}
        <Tab.Screen
          name="Add Game"
          component={AddGame}
          options={{
            style: {position: 'absolute', backgroundColor: '#fff'},
            tabBarColor: darkTheme ? '#000' : '#fff',
            tabBarColor: darkTheme ? '#000' : '#fff',
            // tabBarLabel: ,
            tabBarIcon: ({focused}) => {
              // setFocused(focused);
              return null;
            },
          }}
          listeners={{
            tabPress: () => {
              if (!addGameFocused) {
                setAddGameFocused(true);
              }
            },
          }}
        />
        {/* <Tab.Screen
          name="Track Time"
          component={TrackTime}
          options={{
            tabBarIcon: ({focused}) => (
              <Ionicons
                name="timer-outline"
                size={20}
                color="#FFF"
                style={focused ? null : {opacity: 0.5}}
              />
            ),
            tabBarColor: '#000',
          }}
        /> */}
        <Tab.Screen
          name="Settings"
          component={Profile}
          options={{
            tabBarIcon: ({focused}) => (
              <Ionicons
                name="settings-outline"
                size={20}
                color={darkTheme ? '#FFF' : '#000'}
                style={focused ? null : {opacity: 0.5}}
              />
            ),
            tabBarColor: darkTheme ? '#000' : '#fff',
          }}
          listeners={{
            tabPress: () => {
              if (addGameFocused) {
                setAddGameFocused(false);
              }
            },
          }}
        />
      </Tab.Navigator>
      {!keyboardVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: addGameFocused
              ? SCREEN_HEIGHT * 0.025
              : SCREEN_HEIGHT * 0.02,
            left: 0,
            right: 0,
            padding: 5,
            alignItems: 'center',
          }}>
          <TouchableNativeFeedback
            onPress={() => {
              if (!addGameFocused) {
                setAddGameFocused(true);
                props.navigation.navigate('Add Game');
              }
            }}
            style={{
              backgroundColor: darkTheme ? '#fff' : 'transparent',
              borderRadius: 60,
            }}
            background={TouchableNativeFeedback.Ripple('#30d1ac', false, 30)}>
            <Image
              source={require('../../assets/images/add_icon.png')}
              style={{
                width: SCREEN_WIDTH * 0.15,
                height: SCREEN_WIDTH * 0.15,
              }}
            />
          </TouchableNativeFeedback>
        </View>
      )}
    </>
  );
}

export default TabNavigator;
