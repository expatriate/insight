import * as types from '../actionTypes.js';
import axios from 'axios';
import {
  Alert,
} from 'react-native';

import { EventRegister } from 'react-native-event-listeners';
import Geolocation from 'react-native-geolocation-service';

/// API

// Получаем список тегов
export const getTags = () => {
   return axios.get(`tags`);
}

export const getCurrentUser = () => {
   return axios.get('users/current-user')

}

// Получаем список доступных планов пользователей
export const getPlans = () => {
   return axios.get(`plans`);
}

// Получаем популярные теги
export const getPopularTags = () => {
  return axios.get(`tags/popular`);
}

// Получаем список типов измерений услуг
export const getUnits = () => {
  return axios.get(`service/units`);
}

// Получает текущую позицию юзера на мировой карте
export const getGeolocation = () => {
  return dispatch => {
    Geolocation.getCurrentPosition(
      (position) => {
        EventRegister.emit('APP_GEOLOCATION_RECIEVED', position);
        dispatch({
          type: types.APP_GEOLOCATION_RECIEVED,
          data: position,
        });

      },
      (error) => {
          console.warn(error)
        Alert.alert(JSON.stringify(error.message, 0 , 2 ))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    )
  }
}