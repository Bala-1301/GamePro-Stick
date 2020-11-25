export const ADD_GAME = 'ADD_GAME';
export const UPDATE_GAME = 'UPDATE_GAME';
export const REMOVE_GAME = 'REMOVE_GAME';
export const SET_CURRENT_GAME = 'SET_CURRENT_GAME';
export const REMOVE_CURRENT_GAME = 'REMOVE_CURRENT_GAME';
export const ADD_CLIENT_ADDRESS = 'ADD_CLIENT_ADDRESS';
export const SET_GAMES = 'SET_GAMES';
export const SET_CURRENT_CLIENT = 'SET_CURRENT_CLIENT';
export const REMOVE_CURRENT_CLIENT = 'REMOVE_CURRENT_CLIENT';

export const addGame = (game) => ({
  type: ADD_GAME,
  game,
});

export const updateGame = (game, id) => ({
  type: UPDATE_GAME,
  game,
  id: id,
});

export const removeGame = (id) => ({
  type: REMOVE_GAME,
  id,
});

export const setCurrentGame = (game) => ({
  type: SET_CURRENT_GAME,
  game,
});

export const removeCurrentGame = () => ({
  type: REMOVE_CURRENT_GAME,
});

export const addClientAddress = (clientInfo) => ({
  type: ADD_CLIENT_ADDRESS,
  clientInfo,
});

export const setGames = (games) => ({
  type: SET_GAMES,
  games,
});

export const setCurrentClient = (clientInfo) => ({
  type: SET_CURRENT_CLIENT,
  clientInfo,
});

export const removeCurrentClient = () => ({
  type: REMOVE_CURRENT_CLIENT,
});
