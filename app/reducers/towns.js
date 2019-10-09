import * as types from '../actionTypes.js';

const townsState = {
  items: [],
  loaded: false
};

export default towns = (state = townsState, action) => {
    switch (action.type) {
      case types.TOWNS_RECIEVED:
        return {
          ...state,
          items: action.data.map(item => {
              return {
                id: parseInt(item.item[0].value),
                name: item.item[1].value
              }
          }),
          loaded: true,
        }
      break;
      default:
          return state;
    }
};
