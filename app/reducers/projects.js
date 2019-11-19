import * as types from '../actionTypes.js';

const projectsState = {
  items: [],
  selectedProject: null,
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
      case types.PROJECT_SELECTED:
        return {
          ...state,
          selectedProject: action.data
        }
      break;
      case types.PROJECTS_LOADING:
        return {
          ...state,
          loaded: false
        }
      default:
          return state;
    }
};
