import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {blue_1, blue_2, purple_1, purple_2, white} from '../../reusable/colors';

const {height} = Dimensions.get('screen');

function WelcomeScreen(props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Image
          source={require('../../../assets/images/logo.png')}
          animation="zoomIn"
          style={styles.image}
        />
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <View style={styles.footerView}>
          <Text style={styles.mainText}>Welcome!</Text>
          <Text style={styles.subText}>
            Play PC games using your Mobile Phone.
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.replace('Get Started');
            }}
            style={styles.button}>
            <LinearGradient
              colors={[purple_2, purple_1]}
              style={styles.getStarted}>
              <Text style={styles.getStartedText}>Get Started</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8668ED',
  },
  header: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footerView: {
    paddingLeft: 20,
    paddingTop: 20,
  },
  image: {
    width: height * 0.28,
    height: height * 0.28,
  },
  mainText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 13,
    color: 'gray',
  },
  getStarted: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    margin: 20,
  },
  getStartedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
});
