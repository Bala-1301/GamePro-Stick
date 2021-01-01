import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {normalize} from 'react-native-elements';
import {TextInput} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {purple_1, purple_2} from '../../reusable/colors';
import TextDivider from '../../reusable/TextDivider';
import SocialButton from '../../reusable/SocialButton';
import {handleGoogleSignIn} from '../../reusable/socialSignIn';
import {getDimensions} from '../../reusable/ScreenDimensions';
import {AuthContext} from '../../reusable/contexts/AuthContext';
import {LoadingContext} from '../../reusable/contexts/LoadingContext';

function LoginScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const {toggleFirstTime} = useContext(AuthContext);

  const {showLoading, hideLoading, loading} = useContext(LoadingContext);

  const validateInput = () => {
    let flag = true;
    if (email.length < 1) {
      setEmailError(true);
      flag = false;
    }
    if (password.length < 1) {
      setPassError(true);
      flag = false;
    }
    return flag;
  };

  const authenticateUser = async () => {
    if (validateInput()) {
      auth()
        .signInWithEmailAndPassword(email, password)
        .catch((err) => console.log(err));

      toggleFirstTime();
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
        <Text style={styles.headerText}>LOGIN</Text>
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

            <View style={styles.input}>
              <TextInput
                label="Password"
                onChangeText={(text) => {
                  setPassword(text);
                  passError && setPassError(false);
                }}
                value={password}
                placeholder="Enter your Password"
                secureTextEntry={showPass}
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
                        onPress={() => setShowPass(!showPass)}
                        size={20}
                      />
                    )}
                  />
                }
                error={passError}
              />
              <TouchableOpacity>
                <Text style={{textAlign: 'right', color: 'grey'}}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={authenticateUser} style={styles.button}>
              <LinearGradient
                colors={[purple_1, purple_2]}
                style={styles.signIn}>
                <Text style={styles.signInText}>Sign In</Text>
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

            <View style={styles.newUserView}>
              <Text style={styles.newUserText}>New User?</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Sign Up')}
                style={styles.signUpButton}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => toggleFirstTime()}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </LinearGradient>
  );
}

const {SCREEN_WIDTH} = getDimensions();

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
    fontSize: normalize(40),
    color: '#fff',
    fontWeight: 'bold',
    padding: normalize(15),
    letterSpacing: 0.5,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footerView: {
    margin: normalize(20),
  },
  signIn: {
    padding: normalize(10),
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(10),
  },
  signInText: {
    color: '#fff',
    fontSize: normalize(17),
    fontWeight: 'bold',
  },
  newUserView: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newUserText: {
    fontSize: normalize(15),
    color: 'grey',
  },

  signUpButton: {
    borderColor: purple_1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: SCREEN_WIDTH * 0.25,
    alignItems: 'center',
  },
  signUpText: {
    fontWeight: 'bold',
    color: purple_1,
  },
  input: {
    margin: normalize(10),
  },
  button: {
    marginTop: normalize(10),
    marginLeft: normalize(10),
    marginRight: normalize(10),
  },
  skipText: {
    margin: normalize(10),
    textAlign: 'center',
    color: 'grey',
    fontSize: normalize(15),
    textDecorationLine: 'underline',
    letterSpacing: 1,
  },
});

export default LoginScreen;
