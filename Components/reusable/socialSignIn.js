import {useContext} from 'react';
import {GoogleSignin} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// const {toggleFirstTime}

export const handleGoogleSignIn = async () => {
  console.log('here');
  try {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);
    return true;
  } catch (err) {
    console.log('error :', err);
    return false;
  }
};
