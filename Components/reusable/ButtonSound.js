import Sound from 'react-native-sound';
import {Vibration} from 'react-native';
import {store} from '../redux/store';

Sound.setCategory('Ambient', true);

export const SOUND_FEEDBACK = 'Sound';
export const VIBRATE_FEEDBACK = 'Vibrate';
export const NO_FEEDBACK = null;

const sound = new Sound(
  require('../../assets/sounds/button-press1.mp3'),
  (error) => console.log(error),
);

export const buttonSound = () => {
  const {joystickFeedback} = store.getState();

  console.log('here');
  if (joystickFeedback.feedback === SOUND_FEEDBACK) {
    sound.setCurrentTime(0);
    sound.setVolume(0.1);
    sound.play();
  } else if (joystickFeedback.feedback === VIBRATE_FEEDBACK)
    Vibration.vibrate(5);
};
