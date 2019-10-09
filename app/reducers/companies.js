import * as types from '../actionTypes.js';

const companiesState = {
  items: [],
  loaded: false
};

export default companies = (state = companiesState, action) => {
    switch (action.type) {
      case types.COMPANIES_RECIEVED:
        return {
          ...state,
          items: action.data,
          loaded: true,
        }
      break;
      default:
          return state;
    }
};
