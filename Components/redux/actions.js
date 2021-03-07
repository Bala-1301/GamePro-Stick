export const ADD_GAME = 'ADD_GAME';
export const UPDATE_GAME = 'UPDATE_GAME';
export const REMOVE_GAME = 'REMOVE_GAME';

export const SET_CURRENT_GAME = 'SET_CURRENT_GAME';
export const REMOVE_CURRENT_GAME = 'REMOVE_CURRENT_GAME';

export const ADD_CLIENT_ADDRESS = 'ADD_CLIENT_ADDRESS';

export const SET_GAMES = 'SET_GAMES';
export const RESET_GAMES = 'RESET_GAMES';

export const SET_CURRENT_CLIENT = 'SET_CURRENT_CLIENT';
export const REMOVE_CURRENT_CLIENT = 'REMOVE_CURRENT_CLIENT';

export const ADD_PLAY_TIME = 'ADD_PLAY_TIME';
export const ADD_PER_DAY_PLAY_TIME = 'ADD_PER_DAY_PLAY_TIME';
export const SET_REMINDER_LIMIT = 'SET_REMINDER_LIMIT';
export const REMOVE_REMINDER_LIMIT = 'REMOVE_REMINDER_LIMIT';
export const SET_REMINDED = 'SET_REMINDED';

export const SET_JOYSTICK_FEEDBACK = 'SET_JOYSTICK_FEEDBACK';

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

export const resetGames = () => ({
  type: RESET_GAMES,
});

export const setCurrentClient = (clientInfo) => ({
  type: SET_CURRENT_CLIENT,
  clientInfo,
});

export const removeCurrentClient = () => ({
  type: REMOVE_CURRENT_CLIENT,
});

export const addPerDayPlayTime = (payload) => ({
  type: ADD_PER_DAY_PLAY_TIME,
  payload,
});

export const addPlayTime = () => ({
  type: ADD_PLAY_TIME,
});

export const setReminderLimit = (payload) => ({
  type: SET_REMINDER_LIMIT,
  payload,
});

export const removeReminderLimit = () => ({
  type: REMOVE_REMINDER_LIMIT,
});

export const setReminded = () => ({
  type: SET_REMINDED,
});

export const setJoystickFeedback = (payload) => ({
  type: SET_JOYSTICK_FEEDBACK,
  payload,
});
