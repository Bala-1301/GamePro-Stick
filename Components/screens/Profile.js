import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
// import {Button} from 'react-native-elements';
import {Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';

import {AuthContext} from '../../Context';
import {normalize} from '../reusable/Responsive';

function Profile(props) {
  const {user, toggleFirstTime} = useContext(AuthContext);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
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
