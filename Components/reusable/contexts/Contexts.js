import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Client from './ClientContext';
import Loading from './LoadingContext';
import Theme from './ThemeContext';
import TrendingGames from './TrendingGamesContext';

export default function Contexts(props) {
  return (
    <Loading>
      <TrendingGames>
        <Client>
          <Theme>{props.children}</Theme>
        </Client>
      </TrendingGames>
    </Loading>
  );
}

const styles = StyleSheet.create({});
