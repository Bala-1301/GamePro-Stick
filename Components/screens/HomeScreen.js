import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Card} from 'react-native-elements';
import {FAB, Button} from 'react-native-paper';
import {connect} from 'react-redux';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {SwipeListView} from 'react-native-swipe-list-view';
import database from '@react-native-firebase/database';
import * as Animatable from 'react-native-animatable';

import {connectToServer} from '../socket';
import {mapDispatchToProps, mapStateToProps} from '../reusable/mapProps';
import {AuthContext, ClientContext} from '../../Context';
import {normalize} from '../reusable/Responsive';
import {showMessage} from 'react-native-flash-message';
import {purple_3} from '../reusable/colors';

const {width, height} = Dimensions.get('window');

function HomeScreen(props) {
  const {client, setClient, removeClient} = useContext(ClientContext);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    let i = 0;
    const func = async () => {
      if (i >= props.knownClient.length) {
        return;
      }
      try {
        const client = await connectToServer({
          data: props.knownClient[i],
          setClient,
          removeClient,
          setCurrentClient: props.setCurrentClient,
          removeCurrentClient: props.removeCurrentClient,
        });

        client.on('connect', () => {
          clearInterval(interval);
        });
        client.on('error', () => {
          debugger;

          interval;
          removeClient();
        });
        client.on('disconnect', () => {
          interval;
          removeClient();
        });
        i++;
        if (i >= props.knownClient.length) {
          clearInterval(interval);
        }
      } catch (err) {}
    };

    if (props.knownClient.length !== 0 && client == null) func();

    const interval = setInterval(() => {
      if (props.knownClient.length !== 0 && client == null) {
        func();
      } else {
        clearInterval(interval);
      }
    }, 3500);
  }, []);

  const handlePlayNow = (game) => {
    if (client !== null) {
      props.setCurrentGame(game);
      props.navigation.navigate('Joystick');
    } else {
      Alert.alert(
        'Not connected to any PC',
        'Connect to a PC by scanning the QR code.',
      );
    }
  };

  const deleteGame = (id) => {
    props.removeGame(id);
    if (user) {
      let _games = props.games.filter((game) => game.id !== id);
      database().ref(`/users/${user.uid}`).set({games: _games});
    }
  };

  const renderItem = ({item: game}) => (
    <Card key={game.id + ''} containerStyle={{elevation: 7}}>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('Details', {
            item: {name: game.name, id: game.id},
          })
        }>
        <View style={{position: 'absolute', top: 0, right: 0}}>
          <Feather name="info" size={normalize(20)} color="#3797db" />
        </View>

        <Text
          style={{
            fontSize: normalize(16),
            textAlign: 'center',
            marginBottom: 5,
            marginRight: normalize(20),
            marginLeft: normalize(20),
            fontWeight: 'bold',
            color: '#636566',
          }}>
          {game.name}
        </Text>

        <Card.Image
          source={{uri: game.image}}
          PlaceholderContent={
            <LottieView
              source={require('../../assets/animations/image-loader.json')}
              autoPlay
              loop
            />
          }
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Button
          onPress={() =>
            props.navigation.navigate('Configure', {
              item: game,
            })
          }>
          Edit Config
        </Button>
        <Button onPress={() => handlePlayNow(game)}>Play Now</Button>
      </View>
    </Card>
  );

  return (
    <>
      <StatusBar backgroundColor={purple_3} />
      <View
        style={{
          paddingBottom: normalize(14),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: purple_3,
          elevation: 10,
          paddingTop: normalize(10),
        }}>
        <Text
          style={{
            fontSize: normalize(17),
            fontWeight: 'bold',
            letterSpacing: 0.5,
            color: '#fff',
          }}>
          My Games
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            name="ellipse"
            color={client !== null ? '#47d16c' : 'red'}
            size={normalize(13)}
          />
          <Text style={styles.headerText}>
            {client !== null
              ? props.currentClient != null
                ? `Connected to ${props.currentClient.name}`
                : 'Connected'
              : 'Not Connected to any PC'}
          </Text>
        </View>
        {props.games.length !== 0 ? (
          <SwipeListView
            data={props.games}
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
              style={{width: width / 2, height: width / 2}}
            />
            <Text style={styles.emptyText}>Add Games to start playing.</Text>
          </View>
        )}
        <FAB
          style={styles.fab}
          icon="plus"
          color="#f5f1e9"
          onPress={() => props.navigation.navigate('Add Game')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: normalize(10),
    alignItems: 'center',
  },
  headerText: {fontSize: normalize(14.5), color: 'grey', paddingLeft: 5},
  fab: {
    position: 'absolute',
    bottom: width * 0.04,
    right: width * 0.04,
  },
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
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
