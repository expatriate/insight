import axios from 'axios';
import qs from 'qs';
import * as types from '../actionTypes.js';

import {
  Alert,
  AsyncStorage
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import { EventRegister } from 'react-native-event-listeners';

// Сохранение данных юзера со страницы профиля
export const login = (login, password) => {

  return dispatch => {
    console.warn(login, password)

    dispatch({
      type: types.REDIRECT_LOGIN,
    });
  }
}
