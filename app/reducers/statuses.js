import * as types from '../actionTypes.js';

const statusesState = {
  items: [],
  project_items: [],
  loaded: false
};

export default statuses = (state = statusesState, action) => {
    switch (action.type) {
      case types.STATUSES_RECIEVED:
        return {
          ...state,
          items: [
            ...action.data
          ],
          loaded: true,
        }
      break;
      case types.PROJECT_STATUSES_RECIEVED:
        return {
          ...state,
          project_items: [
            ...action.data
          ],
          loaded: true,
        }
      break;
      default:
          return state;
    }
};
