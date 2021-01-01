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
  ADD_PER_DAY_PLAY_TIME,
  ADD_PLAY_TIME,
  SET_REMINDER_LIMIT,
  REMOVE_REMINDER_LIMIT,
  SET_JOYSTICK_FEEDBACK,
  SET_REMINDED,
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
      let client = state.find(
        (info) => info.ipAddress === action.clientInfo.ipAddress,
      );
      if (client === undefined) return [...state, action.clientInfo];
      else return [...state];
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

const joystickFeedbackReducer = (state = INIT_JOYSTICK, action) => {
  if (action.type === SET_JOYSTICK_FEEDBACK) {
    return {feedback: action.payload};
  } else {
    return state;
  }
};

const INIT_PLAY_TIME = {
  totalTime: 0,
  perDayData: {
    reminded: false,
    date: new Date(),
    time: 0,
    games: [],
  },
  allDayData: [
    {
      date: new Date(2020, 11, 1),
      time: 1000 * 60 * 60,
    },
    {
      date: new Date(2020, 11, 2),
      time: 1000 * 60 * 60,
    },

    {
      date: new Date(2020, 11, 3),
      time: 1000 * 60 * 70,
    },
    {
      date: new Date(2020, 11, 4),
      time: 1000 * 60 * 30,
    },
    {
      date: new Date(2020, 11, 5),
      time: 1000 * 60 * 50,
    },
    {
      date: new Date(2020, 11, 6),
      time: 1000 * 60 * 40,
    },
    {
      date: new Date(2020, 11, 7),
      time: 1000 * 60 * 80,
    },
    {
      date: new Date(2020, 11, 8),
      time: 1000 * 60 * 90,
    },
    {
      date: new Date(2020, 11, 9),
      time: 1000 * 60 * 10,
    },

    {
      date: new Date(2020, 11, 10),
      time: 1000 * 60 * 40,
    },
    {
      date: new Date(2020, 11, 11),
      time: 1000 * 60 * 20,
    },
    {
      date: new Date(2020, 11, 12),
      time: 1000 * 60 * 80,
    },
    {
      date: new Date(2020, 11, 13),
      time: 1000 * 60 * 75,
    },
    {
      date: new Date(2020, 11, 14),
      time: 1000 * 60 * 65,
    },
    {
      date: new Date(2020, 11, 15),
      time: 1000 * 60 * 60,
    },
  ],
  reminderLimit: Infinity,
};

const playTimeReducer = (state = INIT_PLAY_TIME, action) => {
  switch (action.type) {
    case ADD_PER_DAY_PLAY_TIME:
      const {gameName, time} = action.payload;
      const {perDayData} = state;
      const {games} = perDayData;
      const index = games.findIndex((game) => game.gameName === gameName);
      if (index !== -1) {
        games[index] = {
          ...games[index],
          time: games[index].time + time,
        };
      } else {
        games.push({gameName, time});
      }

      const date = state.perDayData.date;

      if (date === null) {
        date = new Date();
      }

      return {
        ...state,
        totalTime: state.totalTime + time,
        perDayData: {
          games,
          date,
          time: state.perDayData.time + time,
        },
      };

    case ADD_PLAY_TIME:
      const {allDayData} = state;
      if (allDayData.length >= 15) {
        allDayData.shift();
      }
      allDayData.push(state.perDayData);
      return {
        ...state,
        allDayData: allDayData,
        perDayData: INIT_PLAY_TIME.perDayData,
      };

    case SET_REMINDER_LIMIT:
      return {...state, reminderLimit: action.payload};
    case REMOVE_REMINDER_LIMIT:
      return {...state, reminderLimit: Infinity};

    case SET_REMINDED:
      return {...state, perDayData: {...state.perDayData, reminded: true}};
    default:
      return state;
  }
};

const reducer = combineReducers({
  games: gamesReducer,
  currentGame: currentGameReducer,
  knownClient: knownClientReducer,
  currentClient: currentClientReducer,
  joystickFeedback: joystickFeedbackReducer,
  playTime: playTimeReducer,
});

export default reducer;
