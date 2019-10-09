import * as types from '../actionTypes.js';
import axios from 'axios';
import {
  Alert
} from 'react-native';

let userState = {
  sessionid: '',
  loaded: false
};

export default user = (state = userState, action) => {
    switch (action.type) {
      case types.USER_LOGGED_IN:
      //action.data.user.status = 3;
        return state = {
          ...state,
          sessionid: action.data.sessionid,
          data: action.data.user,
          isSpectator: action.data.user.status === '5',
          isMaster: action.data.user.status === '4',
          isAgent: action.data.user.status === '3',
          isClient: action.data.user.status === '2',
          isAdmin: action.data.user.status === '1',
          loaded: true
        }
      break;
      case types.USER_STATUSES_RECIEVED:
        return state = {
          ...state,
          statuses: action.data,
        }
      break;
      case types.USER_TASKMASTERS_RECIEVED:
        return state = {
          ...state,
          taskmasters: action.data,
        }
      break;
      case types.USER_AGENTS_RECIEVED:
        return state = {
          ...state,
          agents: action.data,
        }
      break;
      default:
          return state;
    }
};
