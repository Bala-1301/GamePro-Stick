import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import Orientation from 'react-native-orientation';
import {GoogleSignin} from '@react-native-community/google-signin';
import database from '@react-native-firebase/database';
import {GOOGLE_WEB_CLIENT_ID} from '@env';

import {AuthContext, LoadingContext} from './Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegistrationStackNavigator from './Components/navigators/RegistrationStackNavigator';
import HomeStackNavigator from './Components/navigators/HomeStackNavigator';
import {connect} from 'react-redux';
import {
  mapDispatchToProps,
  mapStateToProps,
} from './Components/reusable/mapProps';
import LoadingIndicator from './Components/reusable/LoadingIndicator';
import GettingStarted from './Components/screens/registration_screens/GettingStarted';
import WelcomeScreen from './Components/screens/registration_screens/WelcomeScreen';

function Main(props) {
  const [initializing, setInitializing] = useState(true);
  const [firstTime, setFirstTime] = useState(false); // change to false
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const onAuthStateChanged = async (user) => {
    setUser(user);
    if (user !== null) {
      const localGames = props.games;
      const dbVal = await database()
        .ref(`/users/${user.uid}`)
        .once('value')
        .then((snapshot) => {
          return snapshot.val();
        });
      if (dbVal === null) {
        await database().ref(`/users/${user.uid}`).update({games: props.games});
      } else {
        if (localGames.length === 0 && dbVal.games !== undefined) {
          props.setGames(dbVal.games);
        } else if (localGames.length !== 0 && dbVal.games !== undefined) {
          let allGames = localGames.concat(dbVal.games);
          for (let i = 0; i < allGames.length; i++) {
            for (let j = i + 1; j < allGames.length; j++) {
              if (allGames[i].id === allGames[j].id) allGames.splice(j--, 1);
            }
          }
          props.setGames(allGames);
          await database().ref(`/users/${user.uid}`).update({games: allGames});
        } else if (localGames.length !== 0 && dbVal.games === undefined) {
          await database()
            .ref(`/users/${user.uid}`)
            .update({games: props.games});
        }
      }
    }
    hideLoading();
  };

  useEffect(() => {
    (async () => {
      const _firstTime = await AsyncStorage.getItem('first_time');
      if (!_firstTime) {
        setFirstTime(true);
      }
      if (initializing) setInitializing(false);
    })();
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
    });
    Orientation.lockToPortrait();
    const subscriber1 = auth().onAuthStateChanged(onAuthStateChanged);
    const subscriber2 = auth().onUserChanged(onAuthStateChanged);
    return () => {
      subscriber1;
      subscriber2;
    };
  }, []);

  const toggleFirstTime = () => {
    setFirstTime(!firstTime);
  };

  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  if (initializing) return null;

  return (
    <LoadingContext.Provider value={{showLoading, hideLoading, loading}}>
      <AuthContext.Provider value={{toggleFirstTime, user}}>
        {firstTime ? <RegistrationStackNavigator /> : <HomeStackNavigator />}
        {loading && <LoadingIndicator />}
      </AuthContext.Provider>
    </LoadingContext.Provider>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
