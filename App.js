import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {PersistGate} from 'redux-persist/integration/react';

import {store, persistor} from './Components/redux/store';
import Main from './main';
import {navigationRef} from './Components/helper_functions/RootNavigation';

import {LogBox} from 'react-native';
import Loading from './Components/reusable/contexts/LoadingContext';
import TrendingGames from './Components/reusable/contexts/TrendingGamesContext';
import Client from './Components/reusable/contexts/ClientContext';
import Contexts from './Components/reusable/contexts/Contexts';

LogBox.ignoreAllLogs();

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <PaperProvider
          theme={{
            ...DefaultTheme,
            colors: {...DefaultTheme.colors, primary: 'red'},
          }}>
          <NavigationContainer ref={navigationRef}>
            <Contexts>
              <Main />
            </Contexts>
            <FlashMessage position="bottom" />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
