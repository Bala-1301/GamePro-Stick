import {RAWG_API_KEY} from '@env';

const RAWG_API_URL = 'https://api.rawg.io/api';

const axios = require('axios').default;

export const api_call = async ({
  apiUrl = '/',
  body = null,
  method = 'get',
  applyBaseURL = true,
}) => {
  try {
    if (!applyBaseURL) {
      const response = await axios.get(apiUrl);
      if (response.status.toString().startsWith('2')) {
        return response.data;
      } else return false;
    }
    axios.defaults.baseURL = RAWG_API_URL;

    const config = {
      method,
      url: apiUrl,
      [method === 'get' ? 'params' : 'data']: {...body, key: RAWG_API_KEY},
    };
    console.log(config);

    const response = await axios(config);
    console.log(response.status);
    if (response.status.toString().startsWith('2')) return response.data;
    else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
