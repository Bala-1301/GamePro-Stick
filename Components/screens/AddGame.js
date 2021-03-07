import React, {useEffect, useRef, useState, useContext} from 'react';
import {Text, View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
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
import {ThemeContext} from '../reusable/contexts/ThemeContext';

function AddGame(props) {
  const {trendingGames, fetchNext} = useContext(TrendingGamesContext);
  const {darkTheme} = useContext(ThemeContext);

  const [gameName, setGameName] = useState('');
  const [games, setGames] = useState([]);
  const [next, setNext] = useState();
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
    if (games.length > 0 && next != null) {
      const _games = await api_call({
        apiUrl: next,
        applyBaseURL: false,
      });
      if (_games) {
        const _allGamesSet = games.concat(_games.results);
        setGames(_allGamesSet);
        setNext(_games.next);
      } else {
        console.log('Error fetching next');
      }
    } else if (trendingGames.length > 0) {
      fetchNext();
    }
  };

  const renderItem = ({item}) => (
    <View
      style={[styles.gameView, {backgroundColor: darkTheme ? '#000' : '#fff'}]}>
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
          <Text style={[styles.gameText, {color: darkTheme ? '#fff' : '#000'}]}>
            {item.name}
          </Text>
        </TouchableOpacity>
        <Text style={{color: darkTheme ? '#fff' : '#000'}}>
          Released : {item.released}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Rating
            readonly
            startingValue={item.rating}
            imageSize={normalize(15.5)}
            tintColor={darkTheme ? '#000' : '#fff'}
            ratingColor="grey"
            ratingBackgroundColor="grey"
            ratingTextColor="grey"
          />
          <Text style={{color: darkTheme ? '#fff' : '#000'}}>
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

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: darkTheme ? '#000' : '#fff'},
      ]}>
      <Header
        statusBarProps={{
          barStyle: darkTheme ? 'light-content' : 'dark-content',
          backgroundColor: darkTheme ? '#000' : '#fff',
        }}
        containerStyle={{backgroundColor: darkTheme ? '#000' : '#fff'}}
        centerComponent={{
          text: 'Add Game',
          style: {
            fontSize: normalize(22),
            color: darkTheme ? '#fff' : '#000',
            fontWeight: 'bold',
          },
        }}
      />
      <SearchBar
        platform="ios"
        value={gameName}
        onChangeText={handleSearch}
        containerStyle={{backgroundColor: darkTheme ? '#000' : '#fff'}}
        inputContainerStyle={{
          backgroundColor: darkTheme ? '#595c5a' : '#dbd7d7',
        }}
        inputStyle={{color: darkTheme ? '#fff' : '#000'}}
        placeholder="Search by Game Name"
      />
      {games.length !== 0 ||
      (gameName.length === 0 ? trendingGames.length !== 0 : false) ? (
        <>
          <FlatList
            data={games.length > 0 ? games : trendingGames}
            ListHeaderComponent={() =>
              gameName.length < 1 && (
                <Text
                  style={{
                    fontSize: normalize(18),
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: darkTheme ? '#fff' : '#000',
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
  },
  image: {
    width: normalize(150),
    height: normalize(100),
    borderRadius: 10,
  },
  gameView: {
    flexDirection: 'row',
    padding: 5,
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
