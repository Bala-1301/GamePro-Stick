import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import LottieView from 'lottie-react-native';
import {Header, normalize, Overlay} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {Button, TextInput} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Camera} from 'expo-camera';

import {getDimensions} from '../reusable/ScreenDimensions';
import {ClientContext} from '../reusable/contexts/ClientContext';
import {connectToServer} from '../helper_functions/socket';
import {
  addClientAddress,
  removeCurrentClient,
  setCurrentClient,
} from '../redux/actions';
import {TouchableOpacity} from 'react-native-gesture-handler';

const iconSize = normalize(100);

function ScanQRScreen(props) {
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [PCName, setPCName] = useState('');
  const [ipData, setIpData] = useState(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();

  const {setClient, removeClient} = useContext(ClientContext);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();
      if (status === 'granted') {
        console.log(status);
      }
      console.log(status);
    })();
  }, []);

  const handleScan = async (e) => {
    setLoading(true);
    setScanned(true);
    const data = JSON.parse(e.data);
    setIpData(data);
    const client = await connectToServer({
      data,
      setClient,
      removeClient,
      setCurrentClient: (client) => dispatch(setCurrentClient(client)),
      removeCurrentClient: () => dispatch(removeCurrentClient()),
    });
    if (client) {
      setLoading(false);
      setShowOverlay(true);
    } else {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (PCName.length !== 0) {
      dispatch(addClientAddress({...ipData, name: PCName}));
      dispatch(setCurrentClient({...ipData, name: PCName}));
      setShowOverlay(false);
      props.navigation.goBack();
    }
  };

  if (loading) {
    return (
      <LottieView
        source={require('../../assets/animations/connecting.json')}
        loop
        autoPlay
        style={styles.animation}
      />
    );
  }

  return (
    <View style={styles.container}>
      {!showOverlay && (
        <>
          <Camera
            onBarCodeScanned={scanned ? null : handleScan}
            style={[StyleSheet.absoluteFillObject]}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
            type={Camera.Constants.Type.back}
          />
          <View style={styles.topLeft}>
            <MaterialIcons
              name="keyboard-arrow-left"
              color="#fff"
              size={iconSize}
            />
          </View>

          <View style={styles.topRight}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color="#fff"
              size={iconSize}
            />
          </View>
          <View style={styles.bottomLeft}>
            <MaterialIcons
              name="keyboard-arrow-left"
              color="#fff"
              size={iconSize}
            />
          </View>
          <View style={styles.bottomRight}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color="#fff"
              size={iconSize}
            />
          </View>
        </>
      )}
      <Header
        leftComponent={
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{padding: normalize(10), paddingLeft: 0}}>
            <Feather name="arrow-left" size={25} color="#fff" />
          </TouchableOpacity>
        }
        backgroundColor="transparent"
        containerStyle={{borderBottomWidth: 0}}
      />

      <Overlay isVisible={showOverlay} overlayStyle={styles.overlay}>
        <View style={styles.overlayView}>
          <Text
            style={{
              fontSize: normalize(17),
              paddingBottom: normalize(10),
              color: '#fff',
            }}>
            Enter a name for this PC
          </Text>
          <TextInput
            mode="flat"
            onChangeText={(text) => setPCName(text)}
            style={{height: 50}}
          />
          <Button onPress={handleSave}>Save</Button>
        </View>
      </Overlay>
    </View>
  );
}

const {SCREEN_HEIGHT} = getDimensions();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  qr: {
    // height: SCREEN_HEIGHT,
    ...StyleSheet.absoluteFillObject,
  },
  extraView: {
    height: 0,
    flex: 0,
  },
  overlayView: {
    justifyContent: 'center',
    height: SCREEN_HEIGHT / 4,
  },
  overlay: {
    backgroundColor: '#000',
  },
  topLeft: {
    transform: [{rotate: '45deg'}],
    position: 'absolute',
    left: 0,
    top: SCREEN_HEIGHT * 0.2,
  },
  topRight: {
    transform: [{rotate: '-45deg'}],
    position: 'absolute',
    right: 0,
    top: SCREEN_HEIGHT * 0.2,
  },
  bottomLeft: {
    transform: [{rotate: '-45deg'}],
    position: 'absolute',
    left: 0,
    bottom: SCREEN_HEIGHT * 0.2,
  },
  bottomRight: {
    transform: [{rotate: '45deg'}],
    position: 'absolute',
    right: 0,
    bottom: SCREEN_HEIGHT * 0.2,
  },
});

export default ScanQRScreen;
