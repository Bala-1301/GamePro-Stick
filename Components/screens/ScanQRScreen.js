import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import LottieView from 'lottie-react-native';
import {normalize, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import {Button, TextInput} from 'react-native-paper';

import {ClientContext} from '../../Context';
import {connectToServer} from '../socket';
import {mapDispatchToProps} from '../reusable/mapProps';
import {useIsFocused} from '@react-navigation/native';

function ScanQRScreen(props) {
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [PCName, setPCName] = useState('');
  const [ipData, setIpData] = useState(null);

  const {setClient, removeClient} = useContext(ClientContext);

  const isFocused = useIsFocused();

  useEffect(() => {
    return () => {
      StatusBar.setTranslucent(false);
    };
  });

  const onSuccess = async (e) => {
    setLoading(true);
    const data = JSON.parse(e.data);
    setIpData(data);
    const client = await connectToServer({
      data,
      setClient,
      removeClient,
      setCurrentClient: props.setCurrentClient,
      removeCurrentClient: props.removeCurrentClient,
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
      props.addClientAddress({...ipData, name: PCName});
      props.setCurrentClient({...ipData, name: PCName});
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
      <StatusBar
        translucent={isFocused ? true : false}
        backgroundColor={isFocused ? 'transparent' : null}
      />
      {!showOverlay && (
        <QRCodeScanner
          onRead={onSuccess}
          cameraStyle={styles.qr}
          bottomViewStylee={styles.extraView}
          topViewStyle={styles.extraView}
        />
      )}
      <Overlay isVisible={showOverlay}>
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
    </View>
  );
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  qr: {
    height: height,
  },
  extraView: {
    height: 0,
    flex: 0,
  },
  overlayView: {
    justifyContent: 'center',
    height: height / 4,
  },
});

export default connect(null, mapDispatchToProps)(ScanQRScreen);
