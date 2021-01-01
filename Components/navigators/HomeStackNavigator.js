import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import Joystick from '../screens/joystick/Joystick';
import Configure from '../screens/Configure';
import TabNavigator from './TabNavigator';
import Details from '../screens/Details';
import {purple_3} from '../reusable/colors';

const Stack = createStackNavigator();

function HomeStackNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName="Tab"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: purple_3,
        },
        headerTitleStyle: {
          color: '#fff',
        },
        headerTintColor: '#fff',
        headerShown: false,
      }}>
      <Stack.Screen
        name="My Games"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Joystick"
        component={Joystick}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Configure"
        component={Configure}
        options={{title: 'Configure Game'}}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={({route}) => ({title: route.params.name, headerShown: false})}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
