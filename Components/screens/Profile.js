import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';

import {normalize} from '../reusable/Responsive';
import {Header} from 'react-native-elements';
import {AuthContext} from '../reusable/contexts/AuthContext';

function Profile(props) {
  const {user, toggleFirstTime} = useContext(AuthContext);

  return (
    <>
      <Header
        containerStyle={{backgroundColor: '#fff'}}
        centerComponent={{
          text: 'Profile',
          style: {fontSize: normalize(22), color: '#000', fontWeight: 'bold'},
        }}
      />
      <View style={styles.container}>
        {user === null ? (
          <Button
            title="Login"
            onPress={() => toggleFirstTime()}
            mode="contained">
            Login
          </Button>
        ) : (
          <>
            <Text>{user.displayName}</Text>
            <Button
              title="logout"
              onPress={() =>
                GoogleSignin.signOut().then(() =>
                  auth()
                    .signOut()
                    .then(() => console.log('signed out')),
                )
              }>
              LOGOUT
            </Button>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: normalize(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',

    elevation: 13,
  },
  headerText: {
    fontSize: normalize(19),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Profile;
