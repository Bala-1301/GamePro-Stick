import Sound from 'react-native-sound';
import {Vibration} from 'react-native';
import {store} from '../redux/store';

Sound.setCategory('Ambient', true);

const sound = new Sound(
  require('../../assets/sounds/button-press1.mp3'),
  (error) => console.log(error),
);

const {joystickFeedback} = store.getState();

export const buttonSound = () => {
  if (joystickFeedback.feedback === 'Sound') {
    sound.setCurrentTime(0);
    sound.setVolume(0.1);
    sound.play();
  } else if (joystickFeedback.feedback === 'Vibrate') Vibration.vibrate();
};
