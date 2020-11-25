import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Profile from '../screens/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import {blue_1, blue_2, purple_1, purple_2, purple_3} from '../reusable/colors';
import {Image} from 'react-native';

const Tab = createMaterialBottomTabNavigator();

function TabNavigator(props) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      keyboardHidesNavigationBar
      backBehavior="initialRoute"
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
          tabBarColor: '#16a3db',
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
          tabBarColor: '#727573',
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
          tabBarColor: '#f5a607', //'#ffae03',
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
