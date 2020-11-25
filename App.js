import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {PersistGate} from 'redux-persist/integration/react';

import {store, persistor} from './Components/redux/store';
import {ClientContext} from './Context';
import Main from './main';

function App() {
  const [client, _setClient] = useState(null);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const setClient = (client) => {
    _setClient(client);
  };

  const removeClient = () => {
    _setClient(null);
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <PaperProvider>
          <NavigationContainer>
            <ClientContext.Provider value={{client, setClient, removeClient}}>
              <Main />
            </ClientContext.Provider>
            <FlashMessage position="bottom" />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
