import * as types from '../actionTypes.js';

const appState = {
  items: [],
  detailImages: [],
  filter: {
    town: '',
    status: ''
  },
  count: 0,
  offset: 0,
  loaded: false,
};

export default tasks = (state = appState, action) => {
    switch (action.type) {
      case types.TASKS_RECIEVED:
      //console.warn('TASKS_RECIEVED')
        return {
          ...state,
          items: action.data.tasks,
          count: action.data.count,
          loaded: true,
        }
      break;
      case types.TASK_VISITED:
      //console.warn('TASK_VISITED', action.data)
        return {
          ...state,
          items: state.items.map(item => {
            if (item.id === action.data) {
              return {
                ...item,
                isVisited: 'true'
              }
            }
            return item
          })
        }
      break;
      case types.TASKS_ADD_RECIEVED:
      //console.warn('TASKS_ADD_RECIEVED')
        return {
          ...state,
          items: state.items.concat(action.data.tasks),
          offset: action.data.offset,
          loaded: true,
        }
      break;
      case types.TASK_RECIEVED:
        return {
          ...state,
          items: state.items.map(item => {
            if (parseInt(item.id) === parseInt(action.data.id)) {
              return action.data
            } else
            return item
          })
        }
      break;
      case types.TASKS_DETAIL_IMAGES_RECIEVED:
        return {
          ...state,
          detailImages: action.data,
        }
      break;
      case types.TASKS_DETAIL_IMAGES_REMOVED:
        return {
          ...state,
          detailImages: state.detailImages.filter(item => (parseInt(item.id) !== parseInt(action.data))),
        }
      break;
      case types.TASKS_FILTER:
        return {
          ...state,
          filter: action.data
        }
      break;
      default:
          return state;
    }
};
