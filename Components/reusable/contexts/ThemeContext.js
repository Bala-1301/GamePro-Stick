import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const ThemeContext = createContext(null);

export default function Theme(props) {
  const [darkTheme, setDarkTheme] = useState(null);

  useEffect(() => {
    (async () => {
      const _darkTheme = await AsyncStorage.getItem('darkTheme');
      if (_darkTheme !== null) {
        if (_darkTheme === 'true') {
          setDarkTheme(true);
        } else {
          setDarkTheme(false);
        }
      } else {
        setDarkTheme(true);
        AsyncStorage.setItem('darkTheme', 'true');
      }
    })();
  }, []);

  if (darkTheme === null) return null;

  return (
    <ThemeContext.Provider value={{darkTheme, setDarkTheme}}>
      {props.children}
    </ThemeContext.Provider>
  );
}
