import React, {useEffect, useRef, useState} from 'react';
import {Text, View, FlatList, StyleSheet, Dimensions} from 'react-native';
import {SearchBar, Rating, normalize, Image} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import {ActivityIndicator, Button} from 'react-native-paper';

import {fetchGames, fetchNext} from '../api';

function AddGame(props) {
  const [gameName, setGameName] = useState('');
  const [games, setGames] = useState([]);
  const [next, setNext] = useState(null);
  const listRef = useRef(null);
  const [timeout, setMyTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  });

  const handleSearch = async (text) => {
    setGameName(text);
    setGames([]);
    if (timeout) {
      clearTimeout(timeout);
    }
    setMyTimeout(
      setTimeout(() => {
        getGames(text);
      }, 1500),
    );
  };

  const getGames = async (text) => {
    try {
      const _games = await fetchGames(text);
      if (gameName.length >= 1 && _games !== null) setGames(_games.results);
      else setGames([]);
      if (_games.next != undefined && _games.next != null) setNext(_games.next);
      else setNext(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReachedEnd = async () => {
    if (games.length > 1 && next != null) {
      const _games = await fetchNext(next);
      const _allGamesSet = games.concat(_games.results);
      setGames(_allGamesSet);
      setNext(_games.next);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.gameView}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('Details', {
              item: item,
            })
          }>
          <Image
            defaultSource={require('../../assets/images/game-loader.png')}
            source={
              item.background_image !== null
                ? {uri: item.background_image}
                : require('../../assets/images/game-loader.png')
            }
            style={styles.image}
            PlaceholderContent={
              <LottieView
                source={require('../../assets/animations/image-loader.json')}
                autoPlay
                loop
              />
            }
          />
        </TouchableOpacity>
        <View style={styles.textView}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Details', {
                item: item,
              })
            }>
            <Text style={styles.gameText}>{item.name}</Text>
          </TouchableOpacity>
          <Text>Released : {item.released}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Rating
              readonly
              startingValue={item.rating}
              imageSize={normalize(15.5)}
            />
            <Text>({item.rating})</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={() =>
                props.navigation.navigate('Details', {
                  item: item,
                })
              }>
              View
            </Button>
            <Button
              onPress={() => props.navigation.navigate('Configure', {item})}>
              Add
            </Button>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Enter the PC game name.."
        platform="ios"
        value={gameName}
        onChangeText={handleSearch}
      />
      {games.length !== 0 ? (
        <>
          <FlatList
            data={games}
            renderItem={renderItem}
            ref={listRef}
            keyExtractor={(item) => item.id + '' + item.name}
            onEndReached={handleReachedEnd}
            style={styles.list}
            initialNumToRender={6}
            ListFooterComponent={
              next !== null ? (
                <ActivityIndicator
                  size={30}
                  color="grey"
                  style={{marginTop: 10}}
                />
              ) : null
            }
          />
        </>
      ) : gameName.length !== 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size={normalize(30)} />
        </View>
      ) : null}
    </View>
  );
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  image: {
    width: normalize(150),
    height: normalize(100),
    borderRadius: 10,
  },
  gameView: {
    flexDirection: 'row',
    padding: 5,
    // elevation: 0.1,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 3,
  },
  gameText: {
    fontSize: normalize(16.5),
    flexShrink: 1,
    fontWeight: 'bold',
  },
  textView: {
    flexShrink: 1,
    marginLeft: normalize(10),
    marginRight: normalize(10),
  },
  list: {
    margin: 10,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddGame;
