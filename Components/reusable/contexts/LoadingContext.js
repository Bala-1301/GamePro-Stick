import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const LoadingContext = React.createContext(null);

export default function Loading({children}) {
  const [loading, setLoading] = useState(false);

  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider value={{showLoading, hideLoading, loading}}>
      {children}
    </LoadingContext.Provider>
  );
}

const styles = StyleSheet.create({});
