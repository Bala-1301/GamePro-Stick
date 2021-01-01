import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Proptypes from 'prop-types';
import Animated from 'react-native-reanimated';
import {getDimensions} from '../../reusable/ScreenDimensions';
const {cond, eq, call, Value, event, interpolate, onChange, block} = Animated;

const {SCREEN_HEIGHT, SCREEN_WIDTH} = getDimensions();

class MouseMove extends React.Component {
  constructor(props) {
    super(props);
    this.pressedX = [];
    this.pressedY = [];

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

    this.onMoveXY = ([x, y]) => {
      if (x > 15 && y > 15) {
        this.props.onMouseMove('mouse:SOUTHEAST');
      } else if (x > 15 && y < -15) {
        this.props.onMouseMove('mouse:NORTHEAST');
      } else if (x < -15 && y > 15) {
        this.props.onMouseMove('mouse:SOUTHWEST');
      } else if (x < -15 && y < -15) {
        this.props.onMouseMove('mouse:NORTHWEST');
      } else if (x > 15) {
        this.props.onMouseMove('mouse:EAST');
      } else if (x < -15) {
        this.props.onMouseMove('mouse:WEST');
      } else if (y > 15) {
        this.props.onMouseMove('mouse:SOUTH');
      } else if (y < -15) {
        this.props.onMouseMove('mouse:NORTH');
      }
    };

    this.transX = cond(
      eq(this.gestureState, State.ACTIVE),
      block([call([addX, addY], this.onMoveXY), addX]),
      [],
    );
    this.transY = cond(
      eq(this.gestureState, State.ACTIVE),
      block([call([addX, addY], this.onMoveXY), addY]),
      [],
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

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          // simultaneousHandlers={[this.props.swipeRef, this.props.movesRef]}
          onGestureEvent={this.onGestureEvent}
          // ref={this.props.movesRef}
          // shouldCancelWhenOutside={true}
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
const radius = SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  outerCircle: {
    borderRadius: radius / 10,
    height: radius / 11,
    width: radius / 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 13,
  },
  innerCircle: {
    height: radius / 8,
    width: radius / 8,
    borderRadius: radius / 10,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default MouseMove;
