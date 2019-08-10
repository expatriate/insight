import * as types from '../actionTypes.js';
import axios from 'axios';
import {
  Alert
} from 'react-native';

import { EventRegister } from 'react-native-event-listeners';

// Очистка стора от текущего таска
export const awayFromTask = () => {
  return dispatch => {
    dispatch({
      type: types.AWAY_FROM_TASK,
      data: null
    })
  }
}
