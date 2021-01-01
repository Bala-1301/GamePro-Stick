import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Overlay} from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import {normalize} from '../reusable/Responsive';
import {orderedButtons} from '../reusable/ButtonData';
import {
  Circle,
  Cross,
  DownArrow,
  Enter,
  LeftArrow,
  Pause,
  RightArrow,
  Square,
  Triangle,
  UpArrow,
} from '../reusable/joystickKeys';
import {getDimensions} from '../reusable/ScreenDimensions';

const {SCREEN_WIDTH, SCREEN_HEIGHT} = getDimensions();

function Configurations(props) {
  const [current, setCurrent] = useState(null);
  const [text, setText] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const {buttons} = props;

  const getKey = (key) => {
    switch (key) {
      case 'up':
        return <UpArrow />;
      case 'down':
        return <DownArrow />;
      case 'left':
        return <LeftArrow />;
      case 'right':
        return <RightArrow />;
      case 'circle':
        return <Circle />;
      case 'square':
        return <Square />;
      case 'triangle':
        return <Triangle />;
      case 'cross':
        return <Cross />;
      case 'pause':
        return <Pause />;
      case 'start':
        return <Enter />;
      default:
        return (
          <Text
            style={{
              fontSize: normalize(18),
              color: '#fff',
              marginLeft: SCREEN_WIDTH * 0.07,
              margin: SCREEN_WIDTH * 0.04,
              flex: 1,
            }}>
            {buttons[key].button}
          </Text>
        );
    }
  };

  return (
    <View>
      {orderedButtons.map((b) => (
        <View
          style={
            props.haveMargin
              ? [
                  styles.view,
                  {marginLeft: lesser * 0.08, marginRight: lesser * 0.08},
                ]
              : [styles.view]
          }
          key={buttons[b].button}>
          <View style={{flex: 1}}>{getKey(b)}</View>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => {
              setCurrent({key: b, item: buttons[b]});
              setShowOverlay(true);
            }}>
            <Text style={{color: '#fff'}}>{buttons[b].key.name}</Text>
            <Feather name="edit-3" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}
      {showOverlay && (
        <Overlay
          animationType="slide"
          isVisible={showOverlay}
          onBackdropPress={() => {
            setShowOverlay(false);
            setText('');
          }}
          overlayStyle={{backgroundColor: '#292827'}}>
          <>
            <View style={{alignItems: 'flex-end'}}>
              <Feather
                name="x"
                size={20}
                onPress={() => {
                  setShowOverlay(false);
                  setText('');
                }}
                color="#fff"
              />
            </View>
            <View style={styles.innerModalView}>
              <TextInput
                mode="outlined"
                label={current.button}
                style={styles.overlayTextInput}
                placeholder="Set Key"
                onChangeText={(text) => setText(text)}
                autoFocus
                theme={{colors: {primary: 'red'}}}
              />
              <FlatList
                data={Object.values(props.availableButtons).filter((item) =>
                  item.name.toLowerCase().includes(text.toLowerCase()),
                )}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.overlayTouchable}
                    onPress={() => {
                      props.onChange(item, current);
                      setShowOverlay(false);
                      setText('');
                    }}>
                    <Text style={styles.overlayText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.value}
                keyboardShouldPersistTaps="always"
              />
            </View>
          </>
        </Overlay>
      )}
    </View>
  );
}

const lesser = SCREEN_WIDTH > SCREEN_WIDTH ? SCREEN_WIDTH : SCREEN_WIDTH;
const greater = SCREEN_WIDTH < SCREEN_WIDTH ? SCREEN_WIDTH : SCREEN_WIDTH;

const styles = StyleSheet.create({
  innerModalView: {
    alignItems: 'center',
    maxHeight: greater / 2.5,
    width: SCREEN_WIDTH * 0.5,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(18),
    flex: 1,
  },
  touchable: {
    height: lesser * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#3b3a39',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    flex: 1,
  },
  overlayTouchable: {
    padding: normalize(10),
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    margin: 3,
  },
  overlayText: {
    textAlign: 'center',
    width: normalize(90),
    color: '#fff',
  },
  overlayTextInput: {width: SCREEN_WIDTH * 0.4, height: SCREEN_WIDTH * 0.125},
});

export default Configurations;
