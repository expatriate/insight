import * as types from '../actionTypes.js';

const appState = {
  loaded: true,
  firstJoin: true,
  geolocation: {}
};

export default app = (state = appState, action) => {
    switch (action.type) {
      case types.APP_LOADED:
        return {
          ...state,
          loaded: true,
          firstJoin: false
        }
      break;
      default:
        return state
    }
};
