import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import Joystick from '../screens/joystick/Joystick';
import AddGame from '../screens/AddGame';
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
      <Stack.Screen name="Add Game" component={AddGame} />
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

const styles = StyleSheet.create({
  scannerIcon: {
    marginRight: 10,
  },
  menuIcon: {
    marginLeft: 5,
  },
});

export default HomeStackNavigator;
