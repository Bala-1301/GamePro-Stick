import {
  addClientAddress,
  addGame,
  setCurrentGame,
  removeCurrentGame,
  updateGame,
  setGames,
  setCurrentClient,
  removeCurrentClient,
  removeGame,
} from '../redux/actions';

export const mapStateToProps = (state) => {
  return {
    games: state.games,
    knownClient: state.knownClient,
    currentGame: state.currentGame,
    currentClient: state.currentClient,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    addClientAddress: (clientInfo) => {
      dispatch(addClientAddress(clientInfo));
    },
    addGame: (game) => {
      dispatch(addGame(game));
    },
    updateGame: (game, id) => {
      dispatch(updateGame(game, id));
    },
    setGames: (games) => {
      dispatch(setGames(games));
    },
    removeGame: (id) => {
      dispatch(removeGame(id));
    },
    setCurrentGame: (game) => {
      dispatch(setCurrentGame(game));
    },
    removeCurrentGame: () => {
      dispatch(removeCurrentGame());
    },

    setCurrentClient: (clientInfo) => {
      dispatch(setCurrentClient(clientInfo));
    },
    removeCurrentClient: () => {
      dispatch(removeCurrentClient());
    },
  };
};
