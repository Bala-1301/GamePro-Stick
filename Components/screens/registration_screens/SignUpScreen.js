import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import {Button} from 'react-native-elements';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {normalize} from '../../reusable/Responsive';
import {purple_1, purple_2} from '../../reusable/colors';
import TextDivider from '../../reusable/TextDivider';
import SocialButton from '../../reusable/SocialButton';
import {handleGoogleSignIn} from '../../reusable/socialSignIn';
import LoadingIndicator from '../../reusable/LoadingIndicator';
import {LoadingContext} from '../../reusable/contexts/LoadingContext';
import {AuthContext} from '../../reusable/contexts/AuthContext';

function SignUpScreen(props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {showLoading, loading} = useContext(LoadingContext);
  const {toggleFirstTime} = useContext(AuthContext);

  const validateInput = () => {
    let flag = true;
    if (email.length < 1) {
      setEmailError(true);
      flag = false;
    }
    if (password.length < 6) {
      setPassError(true);
      flag = false;
    }
    if (name.length < 1) {
      setNameError(true);
      flag = false;
    }
    return flag;
  };

  const message = (mes) => {
    showMessage({
      message: mes,
      type: 'default',
      floating: 'true',
      position: 'bottom',
    });
  };

  const authenticateUser = async () => {
    if (validateInput()) {
      showLoading();
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          auth()
            .currentUser.updateProfile({displayName: name})
            .then(() => {
              console.log('updated: ', auth().currentUser);
              toggleFirstTime();
            });
        })
        .catch((err) => {
          if (err.code === 'auth/email-already-in-use') {
            message('Email already in use. Please Login to continue');
          } else if (err.code === 'auth/invalid-email') {
            message('Invalid Email-id');
          } else if (err.code === 'auth/weak-password') {
            message('Please enter a strong password');
          } else {
            message('Some error occurred. Please try again.');
          }
        });
    }
  };

  const onGoogleSignIn = async () => {
    showLoading();
    const logged = await handleGoogleSignIn();
    if (logged) toggleFirstTime();
    else hideLoading();
  };

  return (
    <LinearGradient
      style={loading ? [styles.container, {opacity: 0.5}] : styles.container}
      colors={[purple_1, purple_2]}
      start={{x: 0, y: 0}}
      end={{x: 0.1, y: 0.5}}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SIGN UP</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUp" delay={50}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.footerView}>
            <TextInput
              label="Email"
              onChangeText={(text) => {
                setEmail(text);
                emailError && setEmailError(false);
              }}
              value={email}
              placeholder="Enter your Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  name={() => (
                    <Feather
                      name="mail"
                      size={20}
                      color={emailError ? '#b80617' : 'black'}
                    />
                  )}
                />
              }
              error={emailError}
              style={styles.input}
            />
            <TextInput
              label="Name"
              onChangeText={(text) => {
                setName(text);
                nameError && setNameError(false);
              }}
              value={name}
              placeholder="Enter your Name"
              left={
                <TextInput.Icon
                  name={() => (
                    <Feather
                      name="user"
                      size={20}
                      color={nameError ? '#b80617' : 'black'}
                    />
                  )}
                />
              }
              error={nameError}
              style={styles.input}
            />

            <View style={styles.input}>
              <TextInput
                label="Password"
                onChangeText={(text) => {
                  setPassword(text);
                  passError && setPassError(false);
                }}
                value={password}
                placeholder="Enter your Password"
                secureTextEntry={!showPass}
                autoCapitalize="none"
                left={
                  <TextInput.Icon
                    name={() => (
                      <Feather
                        name="lock"
                        size={20}
                        color={passError ? '#b80617' : 'black'}
                      />
                    )}
                  />
                }
                right={
                  <TextInput.Icon
                    name={() => (
                      <Feather
                        name={!showPass ? 'eye-off' : 'eye'}
                        onPress={() => setShowPass((prev) => !prev)}
                        size={20}
                      />
                    )}
                  />
                }
                error={passError}
              />
              <Text style={{textAlign: 'left', color: 'grey'}}>
                Make sure your password is atleast 6 digits long.
              </Text>
            </View>
            <TouchableOpacity onPress={authenticateUser} style={styles.button}>
              <LinearGradient
                colors={[purple_1, purple_2]}
                style={styles.signIn}>
                <Text style={styles.signInText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TextDivider text="Or" />
            <SocialButton
              icon={
                <Ionicons
                  name="logo-google"
                  size={normalize(20)}
                  color="#ab0916"
                />
              }
              text="Sign In with Google"
              textStyle={{color: '#ab0916'}}
              containerStyle={{backgroundColor: '#fae3e3'}}
              onPress={onGoogleSignIn}
            />
          </View>
        </ScrollView>
      </Animatable.View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6347',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
    padding: 15,
    letterSpacing: 0.5,
  },
  footer: {
    flex: 4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footerView: {
    margin: 20,
  },
  signIn: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newUserView: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newUserText: {
    fontSize: 15,
    color: 'grey',
  },
  input: {
    margin: normalize(10),
  },
  button: {
    marginTop: normalize(10),
    marginLeft: normalize(10),
    marginRight: normalize(10),
  },
});

export default SignUpScreen;
