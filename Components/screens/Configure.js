import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {Button, RadioButton} from 'react-native-paper';
import {connect} from 'react-redux';
import database from '@react-native-firebase/database';
import Feather from 'react-native-vector-icons/Feather';

import {availableButtons, defaultButtons} from '../ButtonData';
import Configurations from './Configurations';
import {mapDispatchToProps, mapStateToProps} from '../reusable/mapProps';
import {normalize} from '../reusable/Responsive';
import {AuthContext} from '../../Context';
import {TouchableOpacity} from 'react-native-gesture-handler';

function Configure(props) {
  let item = null;
  if (props.route !== undefined) {
    item = props.route.params.item;
  } else {
    item = props.currentGame;
  }
  const [_new, setNew] = useState(true);
  const [movement, setMovement] = useState('Analog');
  const [buttons, setButtons] = useState(defaultButtons);
  const [disabled, setDisabled] = useState(false);

  const {user} = useContext(AuthContext);

  useEffect(() => {
    props.games.map((game) => {
      if (game.id === item.id) {
        setNew(false);
        setButtons(game.keys);
        setMovement(game.movement);
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
      movement: movement,
      image: props.route !== undefined ? item.background_image : item.image,
      keys: {
        ...buttons,
      },
    };
    if (_new) props.addGame(game);
    else props.updateGame(game);
    if (props.route !== undefined) props.navigation.popToTop();
    else {
      props.setCurrentGame(game);
      props.onSave();
    }
    if (user) {
      await database()
        .ref(`/users/${user.uid}`)
        .update({games: [game, ...props.games]});
    }
  };

  return (
    <>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.movement}>
          <Text style={styles.configName}>Movement </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton
                value="Analog"
                status={movement === 'Analog' ? 'checked' : 'unchecked'}
                onPress={() => setMovement('Analog')}
              />
              <Text style={{fontSize: normalize(15)}}>Analog </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton
                value="Arrows"
                status={movement === 'Arrows' ? 'checked' : 'unchecked'}
                onPress={() => setMovement('Arrows')}
              />
              <Text style={{fontSize: normalize(15)}}>Arrows </Text>
            </View>
          </View>
        </View>
        <Configurations
          buttons={buttons}
          onChange={handleChange}
          availableButtons={availableButtons}
        />
      </ScrollView>
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        disabled={disabled}>
        Save{_new ? ' & Add' : null}
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: normalize(19),
    fontWeight: 'bold',
    margin: normalize(10),
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

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
