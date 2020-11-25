import React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import {normalize} from 'react-native-elements';
import {purple_2} from '../../reusable/colors';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Button} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

const {width, height} = Dimensions.get('window');

function GettingStarted(props) {
  const _renderItem = ({item}) => (
    <View key={item.key + ''} style={styles.footer}>
      <View>
        <Text style={styles.headerText}>{item.step}</Text>
        <Text style={styles.headerText}>{item.title}</Text>
      </View>
      <View style={{flex: 1, alignItems: 'center', marginTop: width * 0.1}}>
        <LottieView
          source={item.json}
          style={{width: width * 0.7, height: width * 0.7}}
          autoPlay
          loop
        />
        <View style={styles.descriptionView}>
          <Text style={styles.description}>{item.text}</Text>
          <Text style={styles.description}>{item.text2}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainHeader}>Getting Started</Text>
      </View>
      <Animatable.View style={styles.mainFooter} animation="fadeInUp">
        <AppIntroSlider
          data={walkthrough}
          renderItem={_renderItem}
          onDone={() => props.navigation.navigate('Login')}
          showPrevButton
          prevLabel="Previous"
          renderNextButton={() => (
            <View>
              <Button>Next</Button>
            </View>
          )}
          renderPrevButton={() => (
            <View>
              <Button>Previous</Button>
            </View>
          )}
          renderDoneButton={() => (
            <View>
              <Button>Done</Button>
            </View>
          )}
          activeDotStyle={{backgroundColor: '#000'}}
        />
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainHeader: {
    textAlign: 'center',

    fontSize: normalize(35),
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: purple_2,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    color: '#3d3d3c',
    textAlign: 'center',
  },
  mainFooter: {
    flex: 5,
    backgroundColor: '#fff',
    borderTopStartRadius: normalize(35),
    borderTopEndRadius: normalize(35),
    paddingTop: normalize(30),
  },
  footer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  descriptionView: {
    margin: normalize(20),
  },
  description: {
    color: '#595854',
    fontSize: normalize(18),
    textAlign: 'center',
  },
});

export default GettingStarted;

const walkthrough = [
  {
    key: '1',
    step: 'Step 1 :',
    title: 'Download PC App',
    text:
      'Go to www.dummyfornow.com in your PC and download the desktop application.',
    json: require('../../../assets/animations/typing.json'),
  },
  {
    key: '2',
    step: 'Step 2 :',

    title: 'Scan QR-Code',
    text:
      'Launch the desktop application and scan the QR code using app-name in your mobile phone.',
    json: require('../../../assets/animations/scan.json'),
  },
  {
    key: '3',
    step: 'Step 3 :',

    title: 'Add Games',
    text: 'Add games by searching for its name.',
    json: require('../../../assets/animations/add.json'),
  },
  {
    key: '4',
    step: 'Step 4 :',

    title: 'Configure Game',
    text:
      'Configure your game by specifying which keyboard key shoud correspond to which joystick button.',
    json: require('../../../assets/animations/customize.json'),
  },
  {
    key: '5',
    step: 'Step 5 :',

    title: 'Start Playing',
    text: "That's it.",
    text2: ' Start playing by using the Play Now button.',
    json: require('../../../assets/animations/start-playing.json'),
  },
];
