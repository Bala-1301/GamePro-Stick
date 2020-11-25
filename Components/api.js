import {RAWG_API_KEY} from '@env';

const RAWG_API_URL = 'https://api.rawg.io/api';

let searching = false;

setInterval(() => {
  searching = false;
}, 1000);

export const fetchGames = async (search) => {
  if (!searching) {
    searching = true;
    try {
      const response = await fetch(
        `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&page_size=5&search=${search}&ordering=-rating`,
      );
      const games = await response.json();
      if (response.status.toString().startsWith('2')) {
        return games;
      } else {
        return null;
      }
    } catch (err) {
      console.log('error occurred' + err);
      return null;
    }
  }
};

export const fetchNext = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const fetchGameById = async (id) => {
  try {
    const response = await fetch(
      `${RAWG_API_URL}/games/${id}?key=${RAWG_API_KEY}`,
    );
    if (response.status.toString().startsWith('2')) {
      const game = await response.json();
      return game;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const fetchScreenshots = async (id) => {
  try {
    const response = await fetch(
      `${RAWG_API_URL}/games/${id}/screenshots?key=${RAWG_API_KEY}`,
    );
    if (response.status.toString().startsWith('2')) {
      const screenshots = await response.json();
      return screenshots;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
