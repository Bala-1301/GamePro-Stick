import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {Immersive} from 'react-native-immersive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {Switch, TouchableOpacity} from 'react-native-gesture-handler';
import {Input, normalize} from 'react-native-elements';
import Proptypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

import Arrows from './Arrows';
import GameButtons from './GameButtons';
import MovementGesture from './MovementGesture';
import {mapStateToProps} from '../../reusable/mapProps';
import {ClientContext} from '../../../Context';
import Extras from './Extras';
import MouseMove from './MouseMove';
import {buttonSound} from '../../reusable/ButtonSound';
import Configure from '../Configure';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

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
      switch: this.props.currentGame.movement === 'Arrows',
      showConfig: false,
    };
    this.keys = this.props.currentGame.keys;
  }

  componentDidMount() {
    Immersive.addImmersiveListener(this.restoreImmersion);
    this.setState({mounted: true});
    const {client} = this.context;
    this.client = client;
  }

  componentDidUpdate() {
    Orientation.lockToLandscape();
    Immersive.on();
  }

  restoreImmersion() {
    Immersive.on();
    Immersive.setImmersive(true);
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    // Orientation.unlockAllOrientations();
    Immersive.off();
    Immersive.setImmersive(false);
    Immersive.removeImmersiveListener();
    clearInterval(this.interval);
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
                placeholder="Cheat code(s)"
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
              <Text>Analog</Text>
              <Switch
                value={this.state.switch}
                onChange={() =>
                  this.setState((prev) => ({switch: !prev.switch}))
                }
              />
              <Text>Arrows</Text>
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
              backgroundColor: '#fff',
            }}>
            <Configure
              currentGame={this.props.currentGame}
              onSave={() => this.setState({showConfig: false})}
            />
            <View style={styles.settingsOpen}>
              <TouchableOpacity
                onPress={() => this.setState({showConfig: false})}>
                <Ionicons name="chevron-back-outline" size={normalize(30)} />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        ) : (
          <View style={styles.settingsClosed}>
            <TouchableOpacity
              onPressIn={() => this.setState({showConfig: true})}>
              <Ionicons name="chevron-forward-outline" size={normalize(30)} />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }
}

const lesser = height > width ? width : height;
const greater = height > width ? height : width;

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
    borderWidth: 1,
    borderBottomStartRadius: lesser * 0.2,
    backgroundColor: '#000',
    width: lesser / 1.5,
    height: lesser / 6,
    alignItems: 'center',
  },
  lButton: {
    paddingTop: 5,
    paddingBottom: 10,
    borderWidth: 1,
    borderBottomEndRadius: lesser * 0.2,
    backgroundColor: '#000',
    width: lesser / 1.5,
    height: lesser / 6,
    alignItems: 'center',
  },
  textInput: {
    height: lesser * 0.009,
    width: width * 0.55,
  },
  text: {
    fontSize: lesser * 0.06,
    fontWeight: 'bold',
    color: '#fff',
  },
  left: {
    position: 'absolute',
    left: greater * 0.05,
    bottom: greater * 0.1,
  },
  arrow: {
    marginLeft: greater * 0.012,
    bottom: greater * 0.09,
  },
  buttons: {
    position: 'absolute',
    right: height * 0.05,
    bottom: height * 0.06,
  },

  centerButtons: {
    flexDirection: 'row',
    position: 'absolute',
    left: height * 0.37,
    bottom: width * 0.45,
    padding: 3,
    alignItems: 'center',
  },
  pause: {
    marginRight: height * 0.07,
    alignItems: 'center',
    padding: lesser * 0.02,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 13,
  },
  start: {
    marginLeft: height * 0.07,
    alignItems: 'center',
    padding: lesser * 0.02,
    borderRadius: 30,
    elevation: 13,
    backgroundColor: '#fff',
  },
  bgImage: {
    width: height,
    height: width,
  },
  mouseLeft: {
    position: 'absolute',
    left: greater * 0.24,
    top: greater * 0.08,
  },
  mouseRight: {
    position: 'absolute',
    right: greater * 0.24,
    top: greater * 0.08,
  },
  switch: {
    position: 'absolute',
    bottom: normalize(10),
    left: normalize(40),
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
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 17,
  },
  settingsOpen: {
    position: 'absolute',
    left: greater * 0.45,
    top: lesser * 0.25,
    backgroundColor: '#fff',
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default connect(mapStateToProps)(Joystick);
