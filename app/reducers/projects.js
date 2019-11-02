import * as types from '../actionTypes.js';

const projectsState = {
  items: [],
  loaded: false
};

export default projects = (state = projectsState, action) => {
    switch (action.type) {
      case types.PROJECTS_RECIEVED:
      //console.warn( action.data)
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
