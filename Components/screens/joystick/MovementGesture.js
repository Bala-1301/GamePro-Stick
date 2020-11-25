import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Proptypes from 'prop-types';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import {mapStateToProps} from '../../reusable/mapProps';
const {cond, eq, call, Value, event, interpolate, onChange, block} = Animated;
let {width, height} = Dimensions.get('window');

class MovementGesture extends React.Component {
  constructor(props) {
    super(props);
    this.pressedX = [];
    this.pressedY = [];

    this.keys = props.currentGame;

    this.oldX = 0;
    this.oldY = 0;
    this.dragX = new Value(0);
    this.dragY = new Value(0);
    this.gestureState = new Value(-1);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationX: this.dragX,
          translationY: this.dragY,
          state: this.gestureState,
        },
      },
    ]);
    const addY = this.dragY;
    const addX = this.dragX;

    this.onMoveX = (x) => {
      if (Math.abs(x - this.oldX) > 30) {
        let pressable = [];

        if (x > 20) {
          pressable.push(`key:${this.keys.right.key.value}`);
        } else if (x < -20) {
          pressable.push(`key:${this.keys.left.key.value}`);
        }

        let toBePressed = pressable.filter(
          (key) => !this.pressedX.includes(key),
        );
        toBePressed = toBePressed.map((key) => key + ':down');

        let toBeReleased = this.pressedX.filter(
          (key) => !pressable.includes(key),
        );
        toBeReleased = toBeReleased.map((key) => key + ':up');

        toBePressed = toBePressed.concat(toBeReleased);

        this.pressedX = pressable;
        this.props.onMoves(toBePressed);
        this.oldX = x;
      }
    };

    this.onMoveY = (y) => {
      if (Math.abs(y - this.oldY) > 30) {
        let pressable = [];

        if (y > 20) {
          pressable.push(`key:${this.keys.down.key.value}`);
        } else if (y < -20) {
          pressable.push(`key:${this.keys.up.key.value}`);
        }
        let toBePressed = pressable.filter(
          (key) => !this.pressedY.includes(key),
        );
        toBePressed = toBePressed.map((key) => key + ':down');

        let toBeReleased = this.pressedY.filter(
          (key) => !pressable.includes(key),
        );
        toBeReleased = toBeReleased.map((key) => key + ':up');

        toBePressed = toBePressed.concat(toBeReleased);

        this.pressedY = pressable;
        this.props.onMoves(toBePressed);
        this.oldY = y;
      }
    };

    this.onEndX = (x) => {
      this.props.onMoves(this.pressedX.map((key) => key + ':up'));
    };

    this.onEndY = (y) => {
      this.props.onMoves(this.pressedY.map((key) => key + ':up'));
    };

    this.transX = cond(
      eq(this.gestureState, State.ACTIVE),
      block([call([addX], this.onMoveX), addX]),
      [cond(eq(this.gestureState, State.END), call([addX], this.onEndX))],
    );
    this.transY = cond(
      eq(this.gestureState, State.ACTIVE),
      block([call([addY], this.onMoveY), addY]),
      [cond(eq(this.gestureState, State.END), call([addX], this.onEndY))],
    );

    this._translateX = interpolate(this.transX, {
      inputRange: [1, 30],
      outputRange: [1, 15],
    });

    this._translateY = interpolate(this.transY, {
      inputRange: [1, 30],
      outputRange: [1, 15],
    });
  }

  componentDidMount() {
    width = Dimensions.get('window').width;
    height = Dimensions.get('window').height;
  }

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          simultaneousHandlers={[this.props.swipeRef, this.props.movesRef]}
          onGestureEvent={this.onGestureEvent}
          ref={this.props.movesRef}
          onHandlerStateChange={this.onGestureEvent}>
          <Animated.View style={styles.outerCircle}>
            <Animated.View
              style={[
                styles.innerCircle,
                {
                  transform: [
                    {
                      translateX: this._translateX,
                    },
                    {
                      translateY: this._translateY,
                    },
                  ],
                },
              ]}></Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const radius = width > height ? height : width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  outerCircle: {
    borderRadius: radius / 6,
    height: radius / 3,
    width: radius / 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 13,
  },
  innerCircle: {
    height: radius / 8,
    width: radius / 8,
    borderRadius: radius / 16,
    backgroundColor: '#000',
  },
});

MovementGesture.propTypes = {
  onMoves: Proptypes.func.isRequired,
  keys: Proptypes.object.isRequired,
};

export default connect(mapStateToProps)(MovementGesture);
