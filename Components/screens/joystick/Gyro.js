import React, {useEffect, useState} from 'react';
import {Gyroscope} from 'expo-sensors';

// const {max, abs} = Math;

export default function Gyro({gyro, mouseMove}) {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (gyro) {
      _subscribe();
    } else {
      if (subscription) _unsubscribe();
    }

    return () => {
      _unsubscribe();
    };
  }, [gyro]);

  const handleMovement = (data) => {
    const {x, y} = data;

    let move = null;

    if (x > 0.5 && y > 0.5) {
      move = 'mouse:SOUTHEAST';
    } else if (x > 0.5 && y < -0.5) {
      move = 'mouse:NORTHEAST';
    } else if (x < -0.5 && y > 0.5) {
      move = 'mouse:SOUTHWEST';
    } else if (x < -0.5 && y < -0.5) {
      move = 'mouse:NORTHWEST';
    } else if (x > 0.5) {
      move = 'mouse:EAST';
    } else if (x < -0.5) {
      move = 'mouse:WEST';
    } else if (y > 0.5) {
      move = 'mouse:SOUTH';
    } else if (y < -0.5) {
      move = 'mouse:NORTH';
    }
    if (move != null) {
      mouseMove(move);
    }
  };

  const _subscribe = () => {
    let subscription = Gyroscope.addListener(handleMovement);
    Gyroscope.setUpdateInterval(70);
    setSubscription(subscription);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  return null;
}
