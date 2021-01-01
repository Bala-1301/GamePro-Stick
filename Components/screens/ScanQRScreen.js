import React, {useContext, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import LottieView from 'lottie-react-native';
import {normalize, Overlay} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {Button, TextInput} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {getDimensions} from '../reusable/ScreenDimensions';
import {ClientContext} from '../reusable/contexts/ClientContext';
import {connectToServer} from '../helper_functions/socket';
import {
  addClientAddress,
  removeCurrentClient,
  setCurrentClient,
} from '../redux/actions';

const iconSize = normalize(100);

function ScanQRScreen(props) {
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [PCName, setPCName] = useState('');
  const [ipData, setIpData] = useState(null);

  const dispatch = useDispatch();

  const {setClient, removeClient} = useContext(ClientContext);

  const onSuccess = async (e) => {
    setLoading(true);
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
      {/* <StatusBar
        translucent={isFocused ? true : false}
        backgroundColor={isFocused ? 'transparent' : null}
      /> */}
      {!showOverlay && (
        <QRCodeScanner
          onRead={onSuccess}
          cameraStyle={styles.qr}
          bottomViewStylee={styles.extraView}
          topViewStyle={styles.extraView}
        />
      )}
      <Overlay isVisible={showOverlay} overlayStyle={styles.overlay}>
        <View style={styles.overlayView}>
          <Text style={{fontSize: normalize(17), paddingBottom: normalize(10)}}>
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
    </View>
  );
}

const {SCREEN_HEIGHT} = getDimensions();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  qr: {
    height: SCREEN_HEIGHT,
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
