import React from 'react';
import {View, Text, StyleSheet, ImageBackground, StatusBar} from 'react-native';
import Orientation from 'react-native-orientation';
import {Immersive} from 'react-native-immersive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {Switch, TouchableOpacity} from 'react-native-gesture-handler';
import {Input, normalize, Overlay} from 'react-native-elements';
import Proptypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import {showMessage} from 'react-native-flash-message';

import Arrows from './Arrows';
import GameButtons from './GameButtons';
import MovementGesture from './MovementGesture';
import Extras from './Extras';
import MouseMove from './MouseMove';
import {buttonSound} from '../../reusable/ButtonSound';
import Configure from '../Configure';
import Gyro from './Gyro';
import {checkSameDay, getTime} from '../../helper_functions/checkSameDay';
import {Button} from 'react-native-paper';
import {getDimensions} from '../../reusable/ScreenDimensions';
import {ClientContext} from '../../reusable/contexts/ClientContext';

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

const lesser = SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_WIDTH : SCREEN_HEIGHT;
const greater = SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH;

class Joystick extends React.Component {
  movesRef = React.createRef();
  swipeRef = React.createRef();
  static contextType = ClientContext;

  constructor(props) {
    super(props);
    Orientation.lockToLandscape();
    Immersive.on();
    Immersive.setImmersive(true);
    this.client = this.props.client;
    this.state = {
      mounted: false,
      cheatCode: '',
      switch: false,
      showConfig: false,
      gyro: false,
      time: null,
      showReminder: false,
    };
    this.keys = this.props.currentGame.keys;
  }

  componentDidMount() {
    Immersive.addImmersiveListener(this.restoreImmersion);
    this.setState({mounted: true, time: Date.now()});
    const {client} = this.context;
    this.client = client;
    const {playTime} = this.props;
    if (!playTime.perDayData.reminded && playTime.reminderLimit !== Infinity) {
      const reminder = setInterval(() => {
        if (
          playTime.reminderLimit <=
          playTime.perDayData.time + (this.state.time - Date.now())
        ) {
          this.setState({showReminder: true});
          this.props.setReminded();
          clearInterval(reminder);
        }
      }, 30 * 1000);
    }
  }

  componentDidUpdate() {
    this.keys = this.props.currentGame.keys;
    Orientation.lockToLandscape();
    Immersive.on();
  }

  restoreImmersion() {
    Immersive.on();
    Immersive.setImmersive(true);
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    Immersive.setImmersive(false);
    Immersive.off();
    Immersive.removeImmersiveListener();
    clearInterval(this.interval);

    if (!checkSameDay(this.props.playTime.perDayData.date, new Date())) {
      this.props.addPlayTime();
    }
    this.props.addPerDayPlayTime({
      gameName: this.props.currentGame.name,
      time: Date.now() - this.state.time,
    });
    console.log({
      gameName: this.props.currentGame.name,
      time: Date.now() - this.state.time,
    });
  }

  handleToggle = (key) => {
    try {
      this.client.write(key + '/');
    } catch (err) {
      console.log(err);
    }
  };

  handleMoves = (moves) => {
    if (moves.length !== 0) {
      let m = '';
      moves.forEach((move) => (m += move + '/'));
      try {
        this.client.write(m);
      } catch (err) {
        console.log(err);
      }
    }
  };

  handleMouseMove = (mouseMove) => {
    try {
      this.client.write(`${mouseMove}/`);
    } catch (err) {
      console.log(err);
    }
  };

  handleCheatCode = ({text}) => {
    this.setState({cheatCode: ''});
    try {
      this.client.write(`code:${text}/`);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <>
        <StatusBar hidden />
        <ImageBackground
          source={{uri: this.props.currentGame.image}}
          onMagicTap={() =>
            this.state.showConfig ? this.setState({showConfig: false}) : null
          }
          fadeDuration={200}
          defaultSource={require('../../../assets/images/gamepad.png')}
          style={styles.bgImage}>
          {/* Header Buttons*/}

          <View style={styles.header}>
            <View>
              <TouchableOpacity
                onPressIn={() => {
                  this.handleToggle(`key:${this.keys.l.key.value}:down`);
                  buttonSound();
                }}
                onPressOut={() =>
                  this.handleToggle(`key:${this.keys.l.key.value}:up`)
                }
                style={styles.lButton}>
                <Text style={styles.text}>L</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textInput}>
              <Input
                placeholder="Type here..."
                style={{
                  textAlign: 'center',
                  backgroundColor: 'white',
                  color: 'black',
                }}
                autoCapitalize="none"
                onSubmitEditing={({nativeEvent}) =>
                  this.handleCheatCode(nativeEvent)
                }
                onChangeText={(text) => this.setState({cheatCode: text})}
                value={this.state.cheatCode}
              />
            </View>
            <View>
              <TouchableOpacity
                style={styles.rButton}
                onPressIn={() => {
                  this.handleToggle(`key:${this.keys.r.key.value}:down`);
                  buttonSound();
                }}
                onPressOut={() =>
                  this.handleToggle(`key:${this.keys.r.key.value}:up`)
                }>
                <Text style={styles.text}>R</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Left  */}

          <View style={styles.footer}>
            {this.state.switch ? (
              <View style={[styles.left, styles.arrow]}>
                <Arrows onArrow={this.handleToggle} keys={this.keys} />
              </View>
            ) : (
              <View style={styles.left}>
                {this.state.mounted && (
                  <MovementGesture
                    keys={this.keys}
                    onMoves={this.handleMoves}
                    movesRef={this.movesRef}
                    swipeRef={this.swipeRef}
                  />
                )}
              </View>
            )}
            <View style={styles.switch}>
              <Switch
                value={this.state.switch}
                onChange={() =>
                  this.setState((prev) => ({switch: !prev.switch}))
                }
              />
              <Text>
                {this.state.switch === 'Arrows' ? 'Analog' : 'Arrows'}
              </Text>
            </View>
            {/* Center  */}
            <View style={styles.centerButtons}>
              <TouchableOpacity
                style={styles.pause}
                onPressIn={() => {
                  this.handleToggle(`key:${this.keys.pause.key.value}:down`);
                  buttonSound();
                }}
                onPressOut={() =>
                  this.handleToggle(`key:${this.keys.pause.key.value}:up`)
                }>
                <Ionicons name="pause" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.start}
                onPressIn={() => {
                  this.handleToggle(`key:${this.keys.start.key.value}:down`);
                  buttonSound();
                }}
                onPressOut={() =>
                  this.handleToggle(`key:${this.keys.start.key.value}:up`)
                }>
                <Ionicons name="play" size={30} color="#000" />
              </TouchableOpacity>
            </View>
            {/* Right  */}
            <View style={styles.buttons}>
              <GameButtons onToggle={this.handleToggle} keys={this.keys} />
            </View>

            <View style={[styles.switch, styles.gyro]}>
              <Switch
                value={this.state.gyro}
                onChange={() => this.setState((prev) => ({gyro: !prev.gyro}))}
              />
              <Text>Gyroscope</Text>
            </View>
            {/* Extras */}

            <Extras keys={this.keys} onToggle={this.handleToggle} />

            {/* Mouse  */}

            <View style={styles.mouseLeft}>
              <MouseMove onMouseMove={this.handleMouseMove} />
            </View>
            <View style={styles.mouseRight}>
              <MouseMove onMouseMove={this.handleMouseMove} />
            </View>
          </View>
          <Gyro gyro={this.state.gyro} mouseMove={this.handleMouseMove} />
          {/* Edit Config */}
        </ImageBackground>
        {this.state.showConfig ? (
          <Animatable.View
            animation="fadeInLeftBig"
            style={{
              width: greater * 0.45,
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000',
              borderRightWidth: 1,
              borderRightColor: '#fff',
            }}>
            <Configure
              currentGame={this.props.currentGame}
              onSave={() => this.setState({showConfig: false})}
            />
            <View style={styles.settingsOpen}>
              <TouchableOpacity
                onPress={() => this.setState({showConfig: false})}>
                <Ionicons
                  name="chevron-back-outline"
                  size={normalize(30)}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        ) : (
          <View style={styles.settingsClosed}>
            <TouchableOpacity
              onPressIn={() => this.setState({showConfig: true})}>
              <Ionicons
                name="chevron-forward-outline"
                size={normalize(30)}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        )}

        <Overlay
          isVisible={this.state.showReminder}
          onBackdropPress={() => this.setState({showReminder: false})}
          overlayStyle={styles.overlay}>
          <Ionicons name="alarm-outline" size={lesser * 0.2} />
          <Text style={styles.reminderTitle}>Reminder</Text>
          <Text style={styles.reminderText}>
            You have spent {getTime(this.props.playTime.reminderLimit)} playing.
          </Text>
          <Button onPress={() => this.setState({showReminder: false})}>
            Close
          </Button>
        </Overlay>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    flex: 1,
  },
  rButton: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#fff',
    borderBottomStartRadius: lesser * 0.2,
    backgroundColor: '#000',
    width: lesser / 1.5,
    height: lesser / 6,
    alignItems: 'center',
  },
  lButton: {
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff',
    borderBottomEndRadius: lesser * 0.2,
    backgroundColor: '#000',
    width: lesser / 1.5,
    height: lesser / 6,
    alignItems: 'center',
  },
  textInput: {
    height: lesser * 0.009,
    width: SCREEN_WIDTH * 0.55,
  },
  text: {
    fontSize: lesser * 0.06,
    fontWeight: 'bold',
    color: '#fff',
  },
  left: {
    position: 'absolute',
    left: greater * 0.05,
    bottom: greater * 0.125,
  },
  arrow: {
    marginLeft: greater * 0.012,
    bottom: greater * 0.1,
  },
  buttons: {
    position: 'absolute',
    right: SCREEN_HEIGHT * 0.05,
    bottom: SCREEN_HEIGHT * 0.08,
  },

  centerButtons: {
    flexDirection: 'row',
    position: 'absolute',
    left: SCREEN_HEIGHT * 0.37,
    bottom: SCREEN_WIDTH * 0.45,
    padding: 3,
    alignItems: 'center',
  },
  pause: {
    marginRight: SCREEN_HEIGHT * 0.07,
    alignItems: 'center',
    padding: lesser * 0.02,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 13,
  },
  start: {
    marginLeft: SCREEN_HEIGHT * 0.07,
    alignItems: 'center',
    padding: lesser * 0.02,
    borderRadius: 30,
    elevation: 13,
    backgroundColor: '#fff',
  },
  bgImage: {
    width: greater,
    height: lesser,
  },
  mouseLeft: {
    position: 'absolute',
    left: greater * 0.24,
    bottom: greater * 0.08,
    elevation: 15,
  },
  mouseRight: {
    position: 'absolute',
    right: greater * 0.28,
    bottom: greater * 0.08,
    elevation: 15,
  },
  switch: {
    position: 'absolute',
    bottom: normalize(10),
    left: greater * 0.02,
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5,
    paddingLeft: 5,
  },
  settingsClosed: {
    position: 'absolute',
    left: 0,
    top: lesser * 0.25,
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
    backgroundColor: '#000',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 17,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#fff',
  },

  settingsOpen: {
    position: 'absolute',
    left: greater * 0.45,
    top: lesser * 0.25,
    backgroundColor: '#000',
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#fff',
    marginLeft: -1,
  },

  gyro: {
    // position: 'absolute',
    bottom: 10,
    left: greater * 0.83,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTitle: {
    fontSize: normalize(25),
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: normalize(17),
  },
});

const mapStateToProps = (state) => {
  return {
    currentGame: state.currentGame,
    playTime: state.playTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPerDayPlayTime: (payload) => {
      dispatch(addPerDayPlayTime(payload));
    },
    addPlayTime: () => {
      dispatch(addPlayTime());
    },
    setReminded: () => {
      dispatch(setReminded());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Joystick);
