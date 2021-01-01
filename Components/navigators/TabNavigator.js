import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Profile from '../screens/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import {Image} from 'react-native';
import TrackTime from '../screens/TrackTime';
import AddGame from '../screens/AddGame';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {getDimensions} from '../reusable/ScreenDimensions';

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

const Tab = createMaterialBottomTabNavigator();

function TabNavigator(props) {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        keyboardHidesNavigationBar
        backBehavior="initialRoute"
        barStyle={{borderTopColor: '#fff', borderTopWidth: 1}}
        shifting={true}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <Ionicons
                name="game-controller-outline"
                size={20}
                color="#FFF"
                style={focused ? null : {opacity: 0.5}}
              />
            ),
            tabBarColor: '#000',
          }}
        />
        <Tab.Screen
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
        />
        <Tab.Screen
          name="Add Game"
          component={AddGame}
          options={{
            style: {position: 'absolute', backgroundColor: '#fff'},
            tabBarColor: '#000',
            tabBarLabel: null,
            tabBarIcon: ({focused}) => {
              // setFocused(focused);
              return null;
            },
          }}
        />
        <Tab.Screen
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
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({focused}) => (
              <Ionicons
                name="person-outline"
                size={20}
                color="#FFF"
                style={focused ? null : {opacity: 0.5}}
              />
            ),
            tabBarColor: '#000', //'#ffae03',
          }}
        />
      </Tab.Navigator>
      <View
        style={{
          position: 'absolute',
          top: SCREEN_HEIGHT * 0.838,
          left: 0,
          right: 0,
          padding: 5,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Add Game')}
          style={{backgroundColor: '#fff', borderRadius: 30}}>
          <Image
            source={require('../../assets/images/add_icon.png')}
            style={{width: SCREEN_WIDTH * 0.15, height: SCREEN_WIDTH * 0.15}}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

export default TabNavigator;
