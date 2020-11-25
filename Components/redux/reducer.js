import {combineReducers} from 'redux';

import {
  ADD_GAME,
  SET_CURRENT_GAME,
  REMOVE_CURRENT_GAME,
  ADD_CLIENT_ADDRESS,
  UPDATE_GAME,
  SET_GAMES,
  SET_CURRENT_CLIENT,
  REMOVE_CURRENT_CLIENT,
  REMOVE_GAME,
} from './actions';

const gamesReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_GAME:
      let game = {...action.game};
      return [game, ...state];
    case UPDATE_GAME:
      return state.map((game) => {
        if (game.id === action.game.id) {
          return {
            ...game,
            keys: action.game.keys,
            movement: action.game.movement,
          };
        } else {
          return game;
        }
      });
    case SET_GAMES:
      return action.games;
    case REMOVE_GAME:
      return state.filter((game) => game.id !== action.id);
    default:
      return state;
  }
};

const currentGameReducer = (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_GAME:
      return {...action.game};
    case REMOVE_CURRENT_GAME:
      return null;
    default:
      return state;
  }
};

const knownClientReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_CLIENT_ADDRESS:
      return [...state, action.clientInfo];
    default:
      return state;
  }
};

const currentClientReducer = (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_CLIENT:
      return action.clientInfo;
    case REMOVE_CURRENT_CLIENT:
      return null;
    default:
      return state;
  }
};

const INIT_JOYSTICK = {
  feedback: 'Vibrate',
};

const joystickPreferenceReducer = (state = INIT_JOYSTICK, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const reducer = combineReducers({
  games: gamesReducer,
  currentGame: currentGameReducer,
  knownClient: knownClientReducer,
  currentClient: currentClientReducer,
  joystickPreference: joystickPreferenceReducer,
});

export default reducer;
