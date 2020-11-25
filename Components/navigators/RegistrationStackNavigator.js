import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-community/google-signin';

import WelcomeScreen from '../screens/registration_screens/WelcomeScreen';
import LoginScreen from '../screens/registration_screens/LoginScreen';
import SignUpScreen from '../screens/registration_screens/SignUpScreen';
import GettingStarted from '../screens/registration_screens/GettingStarted';

const Stack = createStackNavigator();

function RegistrationStackNavigator(props) {
  const [initializing, setInitializing] = useState(true);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    (async () => {
      const _firstTime = await AsyncStorage.getItem('first_time');
      console.log('first', _firstTime);
      if (_firstTime === null) {
        setFirstTime(true);
        await AsyncStorage.setItem('first_time', 'no');
      }
      if (initializing) setInitializing(false);
    })();
  }, []);

  if (initializing) return null;

  return (
    <Stack.Navigator
      initialRouteName={firstTime ? 'Welcome' : 'Login'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Get Started" component={GettingStarted} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default RegistrationStackNavigator;
