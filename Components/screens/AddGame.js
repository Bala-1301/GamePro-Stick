import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  SearchBar,
  Rating,
  normalize,
  Image,
  Header,
  Divider,
} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import {ActivityIndicator, Button, TextInput} from 'react-native-paper';

import {api_call} from '../helper_functions/api';
import {showMessage} from 'react-native-flash-message';
import {TrendingGamesContext} from '../reusable/contexts/TrendingGamesContext';

function AddGame(props) {
  const {trendingGames, trendingNext} = useContext(TrendingGamesContext);

  const [gameName, setGameName] = useState('');
  const [games, setGames] = useState(trendingGames);
  const [next, setNext] = useState(trendingNext);
  const listRef = useRef(null);
  const [timeout, setMyTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const handleSearch = async (text) => {
    setGameName(text);
    setGames([]);
    if (timeout) {
      clearTimeout(timeout);
    }
    if (text.length < 1) {
      setGames(trendingGames);
      setNext(trendingNext);
    }
    setMyTimeout(
      setTimeout(() => {
        getGames(text);
      }, 500),
    );
  };

  const getGames = async (text) => {
    if (text.length < 1) return;
    try {
      const _games = await api_call({
        apiUrl: '/games',
        body: {
          page_size: 10,
          search: text,
        },
      });
      if (_games) {
        if (gameName.length >= 1 && _games !== null) setGames(_games.results);
        else setGames([]);
        if (_games.next != undefined && _games.next != null)
          setNext(_games.next);
        else setNext(null);
      } else {
        showMessage({
          message: "Couldn't fetch",
          description: 'Error fetching data. Please try later',
          type: 'danger',
          floating: 'true',
          position: 'center',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleReachedEnd = async () => {
    if (games.length > 1 && next != null) {
      const _games = await api_call({
        apiUrl: next,
        applyBaseURL: false,
      });
      if (_games) {
        const _allGamesSet = games.concat(_games.results);
        setGames(_allGamesSet);
        setNext(_games.next);
      }
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
          }
          style={{justifyContent: 'center', alignItems: 'center'}}>
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
          <Text style={{color: '#fff'}}>Released : {item.released}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Rating
              readonly
              startingValue={item.rating}
              imageSize={normalize(15.5)}
              tintColor="#000"
            />
            <Text style={{color: '#fff'}}>
              ({item.rating}) ({item.ratings_count})
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={() =>
                props.navigation.navigate('Details', {
                  item: item,
                })
              }
              color="red">
              View
            </Button>
            <Button
              color="red"
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
      <Header
        statusBarProps={{barStyle: 'light-content'}}
        containerStyle={{backgroundColor: '#000'}}
        centerComponent={{
          text: 'Add Game',
          style: {fontSize: normalize(22), color: '#fff', fontWeight: 'bold'},
        }}
      />
      <SearchBar
        platform="ios"
        value={gameName}
        onChangeText={handleSearch}
        containerStyle={{backgroundColor: '#000'}}
        inputContainerStyle={{backgroundColor: '#595c5a'}}
        inputStyle={{color: '#fff'}}
        placeholder="Search by Game Name"
      />
      {games.length !== 0 ? (
        <>
          <FlatList
            data={games}
            ListHeaderComponent={() =>
              gameName.length < 1 && (
                <Text
                  style={{
                    fontSize: normalize(18),
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#fff',
                    padding: 5,
                  }}>
                  Popular Games
                </Text>
              )
            }
            renderItem={renderItem}
            ref={listRef}
            keyExtractor={(item) => item.id + '' + item.name}
            onEndReached={handleReachedEnd}
            style={styles.list}
            initialNumToRender={6}
            ItemSeparatorComponent={() => (
              <Divider style={{backgroundColor: '#595c5a'}} />
            )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: normalize(150),
    height: normalize(100),
    borderRadius: 10,
  },
  gameView: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#000',
    borderRadius: 5,
    margin: 3,
  },
  gameText: {
    fontSize: normalize(16.5),
    flexShrink: 1,
    fontWeight: 'bold',
    color: '#fff',
  },
  textView: {
    flexShrink: 1,
    marginLeft: normalize(10),
    marginRight: normalize(10),
  },
  list: {
    marginLeft: 10,
    marginRight: 10,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddGame;
