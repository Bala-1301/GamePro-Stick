import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Overlay} from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import {normalize} from '../reusable/Responsive';
import {orderedButtons} from '../ButtonData';

const {width, height} = Dimensions.get('window');

function Configurations(props) {
  const [current, setCurrent] = useState(null);
  const [text, setText] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const {buttons} = props;
  return (
    <View>
      {orderedButtons.map((b) => (
        <View style={styles.view} key={buttons[b].button}>
          <Text style={{fontSize: normalize(18)}}>{buttons[b].button}</Text>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => {
              setCurrent({key: b, item: buttons[b]});
              setShowOverlay(true);
            }}>
            <Text>{buttons[b].key.name}</Text>
            <Feather name="edit-3" size={20} />
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
          }}>
          <>
            <View style={{alignItems: 'flex-end'}}>
              <Feather
                name="x"
                size={20}
                onPress={() => {
                  setShowOverlay(false);
                  setText('');
                }}
              />
            </View>
            <View style={styles.innerModalView}>
              <TextInput
                mode="outlined"
                label={current.button}
                style={styles.overlayTextInput}
                placeholder="Set Key"
                onChangeText={(text) => setText(text)}
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

const lesser = height > width ? width : height;
const greater = height < width ? width : height;

const styles = StyleSheet.create({
  innerModalView: {
    alignItems: 'center',
    maxHeight: greater / 2.5,
    width: width * 0.5,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: normalize(27),
    marginRight: normalize(27),
    marginBottom: normalize(18),
  },
  touchable: {
    width: lesser * 0.35,
    height: lesser * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#c4c4c4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
  },
  overlayTouchable: {
    padding: normalize(10),
    borderWidth: 1,
    borderRadius: 5,
    margin: 3,
  },
  overlayText: {
    textAlign: 'center',
    width: normalize(90),
  },
  overlayTextInput: {width: width * 0.4, height: width * 0.125},
});

export default Configurations;
