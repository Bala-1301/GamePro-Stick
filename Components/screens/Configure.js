import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {Button, RadioButton} from 'react-native-paper';
import {connect, useDispatch, useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import Feather from 'react-native-vector-icons/Feather';

import {availableButtons, defaultButtons} from '../reusable/ButtonData';
import Configurations from './Configurations';
import {normalize} from '../reusable/Responsive';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Header} from 'react-native-elements';
import {getDimensions} from '../reusable/ScreenDimensions';
import {AuthContext} from '../reusable/contexts/AuthContext';
import {addGame, setCurrentGame, updateGame} from '../redux/actions';

const {SCREEN_WIDTH} = getDimensions();

function Configure(props) {
  const currentGame = useSelector((state) => state.currentGame);
  const games = useSelector((state) => state.games);

  const dispatch = useDispatch();

  let item = null;
  if (props.route !== undefined) {
    item = props.route.params.item;
  } else {
    item = currentGame;
  }
  const [_new, setNew] = useState(true);
  const [buttons, setButtons] = useState(defaultButtons);
  const [disabled, setDisabled] = useState(false);

  const {user} = useContext(AuthContext);

  useEffect(() => {
    games.map((game) => {
      if (game.id === item.id) {
        setNew(false);
        setButtons(game.keys);
      }
    });
  }, []);

  const handleChange = (value, obj) => {
    const updated = {
      ...buttons,
      [obj.key]: {button: obj.item.button, key: value},
    };
    setButtons(updated);
  };

  const handleSave = async () => {
    setDisabled(true);

    let game = {
      id: item.id,
      name: item.name,
      // movement: movement,
      image: props.route !== undefined ? item.background_image : item.image,
      keys: {
        ...buttons,
      },
    };
    if (_new) dispatch(addGame(game));
    else dispatch(updateGame(game));
    if (props.route !== undefined) props.navigation.popToTop();
    else {
      dispatch(setCurrentGame(game));
      props.onSave();
    }
    if (user) {
      await database()
        .ref(`/users/${user.uid}`)
        .update({games: [game, ...games]});
    }
  };

  return (
    <>
      <Header
        centerComponent={{
          text: 'Configure Game',
          style: {color: '#fff', fontSize: normalize(20), fontWeight: 'bold'},
        }}
        containerStyle={{backgroundColor: '#000'}}
        leftComponent={
          props.route !== undefined ? (
            <TouchableOpacity
              style={{padding: 10, paddingLeft: 0}}
              onPress={() => props.navigation.goBack()}>
              <Feather
                name="chevron-left"
                color="#fff"
                size={SCREEN_WIDTH * 0.07}
              />
            </TouchableOpacity>
          ) : null
        }
      />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{item.name}</Text>
        <View style={{marginTop: 20}}>
          <Configurations
            buttons={buttons}
            onChange={handleChange}
            availableButtons={availableButtons}
            haveMargin={props.route !== undefined}
          />
        </View>
      </ScrollView>
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        color="red"
        disabled={disabled}>
        Save{_new ? ' & Add' : null}
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    textAlign: 'center',
    fontSize: normalize(19),
    fontWeight: 'bold',
    margin: normalize(10),
    marginLeft: normalize(25),
    marginRight: normalize(25),
    color: '#fff',
  },
  movement: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: normalize(26),
  },
  configName: {
    fontSize: normalize(18),
  },
  button: {
    margin: normalize(10),
  },
  saveButton: {
    borderRadius: 0,
    width: '100%',
  },
});

export default Configure;
