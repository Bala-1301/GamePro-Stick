import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Header, Image, Tooltip} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {SwipeListView} from 'react-native-swipe-list-view';
import database from '@react-native-firebase/database';
import {useRoute} from '@react-navigation/native';

import {normalize} from '../reusable/Responsive';
import {showMessage} from 'react-native-flash-message';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {getDimensions} from '../reusable/ScreenDimensions';
import {ClientContext} from '../reusable/contexts/ClientContext';
import {AuthContext} from '../reusable/contexts/AuthContext';
import {connectToServer} from '../helper_functions/socket';
import {
  removeCurrentClient,
  removeGame,
  setCurrentClient,
  setCurrentGame,
} from '../redux/actions';

const {SCREEN_WIDTH, SCREEN_HEIGHT} = getDimensions();

function HomeScreen(props) {
  const {client, setClient, removeClient} = useContext(ClientContext);
  const {user} = useContext(AuthContext);
  const route = useRoute();

  const knownClient = useSelector((state) => state.knownClient);
  const games = useSelector((state) => state.games);
  const currentClient = useSelector((state) => state.currentClient);
  const dispatch = useDispatch();

  useEffect(() => {
    let i = 0;
    const func = async () => {
      if (i >= knownClient.length) {
        clearInterval(interval); // change to i = 0
        return; //
      }
      try {
        const client = await connectToServer({
          data: knownClient[i],
          setClient,
          removeClient,
          setCurrentClient: (client) => dispatch(setCurrentClient(client)),
          removeCurrentClient: () => dispatch(removeCurrentClient()),
        });

        client.on('connect', () => {
          clearInterval(interval);
        });
        client.on('error', () => {
          interval;
          if (route.name === 'Joystick') {
            props.navigation.goBack();
            showMessage({
              message: 'Disconnected from PC',
              floating: true,
              type: 'danger',
            });
          }
          removeClient();
        });
        client.on('disconnect', () => {
          interval;
          if (route.name === 'Joystick') {
            props.navigation.goBack();
            showMessage({
              message: 'Disconnected from PC',
              floating: true,
              type: 'danger',
            });
          }
          removeClient();
        });

        i++;
      } catch (err) {}
    };

    if (knownClient.length !== 0 && client == null) func();

    const interval = setInterval(() => {
      if (knownClient.length !== 0 && client == null) {
        func();
      } else {
        clearInterval(interval);
      }
    }, 3500);
  }, []);

  const handlePlayNow = (game) => {
    if (client !== null) {
      dispatch(setCurrentGame(game));
      props.navigation.navigate('Joystick');
    } else {
      Alert.alert(
        'Not connected to any PC',
        'Connect to a PC by scanning the QR code.',
      );
    }
  };

  const deleteGame = (id) => {
    dispatch(removeGame(id));
    if (user) {
      let _games = games.filter((game) => game.id !== id);
      database().ref(`/users/${user.uid}`).set({games: _games});
    }
  };

  const renderItem = ({item: game}) => (
    <View
      style={{
        marginBottom: 20,
        marginLeft: normalize(19),
        marginRight: normalize(19),
      }}>
      <View style={{alignItems: 'center', marginTop: 5}}>
        <View style={{backgroundColor: '#fff', borderRadius: 10}}>
          <Image
            source={{uri: game.image}}
            style={{
              width: SCREEN_WIDTH * 0.8,
              height: SCREEN_WIDTH * 0.45,
              borderRadius: 10,
            }}
            PlaceholderContent={
              <LottieView
                source={require('../../assets/animations/image-loader.json')}
                autoPlay
                loop
              />
            }
          />
        </View>
      </View>
      <View style={{position: 'absolute', top: SCREEN_WIDTH * 0.4, right: 30}}>
        <Button
          color="red"
          mode="contained"
          onPress={() => handlePlayNow(game)}>
          Play
        </Button>
      </View>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('Details', {
            item: {name: game.name, id: game.id},
          })
        }
        style={{
          position: 'absolute',
          top: 0,
          right: normalize(13),
          padding: normalize(10),
        }}>
        <Feather
          name="info"
          size={normalize(20)}
          color="#000"
          style={{backgroundColor: '#fff', borderRadius: 15}}
        />
      </TouchableOpacity>
      <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
        <View style={{flex: 1.8, marginTop: -3}}>
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.navigate('Configure', {
                item: game,
              })
            }>
            <Text
              style={{
                marginLeft: normalize(19),
                textAlign: 'left',
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: '#fff',
                textDecorationStyle: 'solid',
                textDecorationLine: 'underline',
              }}>
              {game.name}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
          }}>
          {/* <Button color="grey" style={{margin: 0, padding: 0}}>
            Edit Config
          </Button> */}
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Header
        statusBarProps={{barStyle: 'light-content', backgroundColor: '#000'}}
        centerComponent={{
          text: 'GamePro Joystick',
          style: {
            fontSize: normalize(22),
            color: '#fff',
            fontWeight: 'bold',
          },
        }}
        rightComponent={
          <Tooltip
            withOverlay={false}
            closeOnlyOnBackdropPress={false}
            popover={
              <Text style={{color: '#fff'}}>
                {client !== null
                  ? currentClient != null
                    ? `Connected to ${currentClient.name}`
                    : 'Connected'
                  : 'Not Connected'}
              </Text>
            }>
            <Ionicons
              name="ellipse"
              color={client !== null ? '#47d16c' : 'red'}
              size={normalize(13)}
              style={{padding: 5, alignSelf: 'center'}}
            />
          </Tooltip>
        }
        containerStyle={{
          backgroundColor: '#000',
          borderBottomColor: '#a2a3a2',
          borderBottomWidth: 0.2,
        }}
      />
      <View style={styles.container}>
        {games.length !== 0 ? (
          <SwipeListView
            data={games}
            keyExtractor={(item) => item.id + ''}
            renderItem={renderItem}
            disableRightSwipe
            renderHiddenItem={(data, rowMap) => (
              <TouchableOpacity
                style={styles.hidden}
                onPress={() => deleteGame(data.item.id)}>
                <Ionicons
                  name="trash"
                  size={25}
                  color="#fff"
                  style={{marginRight: normalize(23)}}
                />
              </TouchableOpacity>
            )}
            leftOpenValue={0}
            rightOpenValue={-75}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('../../assets/animations/no-games.json')}
              autoPlay
              loop
              style={{width: SCREEN_WIDTH / 2, height: SCREEN_WIDTH / 2}}
            />
            <Text style={styles.emptyText}>Add Games to start playing.</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: normalize(10),
    alignItems: 'center',
  },
  headerText: {fontSize: normalize(14.5), color: 'grey', paddingLeft: 5},

  emptyText: {
    margin: normalize(20),
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: 'grey',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidden: {
    flex: 0.8,
    backgroundColor: 'red',
    alignItems: 'flex-end',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_WIDTH * 0.1,
    marginBottom: SCREEN_WIDTH * 0.15,
    width: SCREEN_WIDTH * 0.78,
  },
});

export default HomeScreen;
