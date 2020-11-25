import {setCurrentClient} from './redux/actions';

const net = require('react-native-tcp');

export const connectToServer = async ({
  data,
  setClient,
  removeClient,
  setCurrentClient,
  removeCurrentClient,
}) => {
  console.log(data);
  try {
    const timeout = 3000;
    let client = net.createConnection(data.port, data.ipAddress);

    client.on('connect', () => {
      clearTimeout(timer);
      setCurrentClient(data);
      setClient(client);
    });

    client.on('error', (err) => {
      clearTimeout(timer);

      if (err.code == 'ENOTFOUND') {
        console.log('[ERROR] No device found at this address!');
        client.destroy();
        return;
      }
      if (err.code == 'ECONNREFUSED') {
        console.log('[ERROR] Connection refused! Please check the IP.');
        client.destroy();
        return;
      }
      console.log('[CONNECTION] Unexpected error!', err);
      removeClient();
      removeCurrentClient();
    });

    client.on('disconnect', function () {
      clearTimeout(timer);
      console.log('[CONNECTION] disconnected!', err);
      removeClient();
      removeCurrentClient();
    });

    const timer = setTimeout(function () {
      console.log('[ERROR] Attempt at connection exceeded timeout value');
      client.end();
      return false;
    }, timeout);
    return client;
  } catch (err) {
    console.log('Connection failed! ' + err);
    return null;
  }
};
