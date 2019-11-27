import axios from 'axios';
import qs from 'qs';
import * as types from '../actionTypes.js';
import xmlParse from 'fast-xml-parser';

import {
  Alert,
} from 'react-native';

let options = {
  ignoreAttributes : true,
  ignoreNameSpace : true,
  allowBooleanAttributes : false,
  parseNodeValue : false,
  parseAttributeValue : false,
  trimValues: true,
  parseTrueNumberOnly: false,
};

import { NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import { EventRegister } from 'react-native-event-listeners';

import PushNotification from 'react-native-push-notification';
import firebase from 'react-native-firebase';


getToken = async (sessionid) => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.warn("before fcmToken: ", fcmToken);
  //sendPhoneToken(sessionid, fcmToken)
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.warn("after fcmToken: ", fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      sendPhoneToken(sessionid, fcmToken)
    }
  }
}
requestPermission = async (sessionid) => {
  firebase.messaging().requestPermission()
    .then(() => {
      this.getToken(sessionid);
    })
    .catch(error => {
      console.warn('permission rejected');
    });
}
checkPermission = async (sessionid) => {
  firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        console.warn("Permission granted");
        this.getToken(sessionid);
      } else {
        console.warn("Request Permission");
        this.requestPermission(sessionid);
      }
    });
}

configureIOSNotifications = (sessionid) => {
  PushNotification.configure({

      onRegister: function(token) {
          ////console.warn( 'TOKEN:', token );
          sendPhoneToken(sessionid, token.token)
      },

      onNotification: function(notification) {
          console.warn( 'NOTIFICATION:', JSON.stringify(notification, 0 , 2));
          Alert.alert(
            notification.message.title,
            notification.message.body,
            [
              {
                text: 'Закрыть',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Перейти', onPress: () => {
                if (notification.message.category) {
                  let type = notification.message.category.split(':')[0];
                  let task = notification.message.category.split(':')[1];

                  getTask(sessionid, task);
                }
              }},
            ],
            {cancelable: false},
          );
      },

      //senderID: "568135003489",

      permissions: {
          alert: true,
          badge: true,
          sound: true
      },

      popInitialNotification: true,

      requestPermissions: true,
  });
}


configureANDROIDNotifications = async (sessionid) => {
  this.checkPermission(sessionid);

  showAlert = (notification) => {
    console.log('NOTIFY', notification)
    if (notification._title) {

      Alert.alert(
          notification._title,
          notification_.body,
        [
          {
            text: 'Закрыть',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Перейти', onPress: () => {
            if (notification.message.category) {
              let type = notification.notification.category.split(':')[0];
              let task = notification.notification.category.split(':')[1];

              getTask(sessionid, task);
            }
          }},
        ],
        {cancelable: false},
      );
    }
  }

  firebase.notifications().onNotification((notification) => {
    showAlert(notification)
  });

  const message = await firebase.notifications().getInitialNotification();
  //console.log('NOTIFY1123', message.notification._android._notification)
  if (message.notification._title) {
    showAlert(message)
  }

  firebase.notifications().onNotificationOpened((notificationOpen) => {
    //console.log(notification)
    showAlert(notificationOpen)
  });
}


// Запись данных во внутренный стор телефона
saveAuth = async (phone, password, sessionid = '') => {

  if (Platform.OS === 'ios') {
    // IOS
    console.warn('ios notifications inited')
    configureIOSNotifications(sessionid);
  } else {
    // ANDROID
    console.warn('android notifications inited')
    configureANDROIDNotifications(sessionid);
  }




  try {
    await AsyncStorage.setItem('phone', phone);
    await AsyncStorage.setItem('password', password);
    await AsyncStorage.setItem('sessionid', sessionid);
  } catch(e) {
  }
}

removeAuth = async () => {
  try {
    await AsyncStorage.removeItem('phone');
    await AsyncStorage.removeItem('password');
    await AsyncStorage.removeItem('sessionid');
  } catch(e) {
  }
}

export const sendPhoneToken = (sessionid = '', token = '') => {
  let xmls=
    `
    <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:soap="https://insightapp.ru/api/users/soap?ws=1">
        <soapenv:Header/>
        <soapenv:Body>
            <soap:addUserPhoneToken soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
                <token xsi:type="xsd:string">${token}</token>
            </soap:addUserPhoneToken>
        </soapenv:Body>
    </soapenv:Envelope>`;

    axios.post('https://insightapp.ru/api/users/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res => {
        var result = xmlParse.parse(res.data, options);

        if (result['Envelope']['Body']['Fault']) {
        } else {
          ////console.warn(JSON.stringify(result, 0 , 2))
        }
        //////console.warn('ANSWER', res)
      }).catch(err => {
        ////console.warn(err)
      });
   }

export const getTask = (sessionid, id) => {
  ////console.warn('getTask')
    let xmls=`
    <soapenv:Envelope
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:soap="https://insightapp.ru/api/tasks/soap?ws=1">
     <soapenv:Header/>
     <soapenv:Body>
           <soap:getTask soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
              <id xsi:type="xsd:int">${id}</id>
           </soap:getTask>
        </soapenv:Body>
     </soapenv:Envelope>`;

    axios.post('https://insightapp.ru/api/tasks/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{
        ////console.warn('getTask resopnse', res)

        var result = xmlParse.parse(res.data, options);

        if (result['Envelope']['Body']['Fault']) {
        } else {
          const task = result['Envelope']['Body']['getTaskResponse'].return;
          if (task.id) {
            EventRegister.emit('PUSH_RECIEVED', task);
          }
        }
     }).catch(err => {
       ////console.warn(err)
     });
}

// Сохранение данных юзера со страницы профиля
export const login = (phone, password, checkStorage = false) => {
  //phone = undefined
  return dispatch => {
    let xmls=
      `<soapenv:Envelope
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soap="https://insightapp.ru/api/auth/soap?ws=1">
        <soapenv:Header/>
        <soapenv:Body>
          <soap:auth soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <login xsi:type="soap:app.modules.api.models.Login">
              <phone xsi:type="xsd:string">${phone}</phone>
              <password xsi:type="xsd:string">${password}</password>
            </login>
          </soap:auth>
        </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('https://insightapp.ru/api/auth/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res => {

        var result = xmlParse.parse(res.data, options);

        if (result['Envelope']['Body']['Fault']) {
          dispatch({
            type: types.RETURN_LOGIN,
          });

          // Убираем данные о предыдущих логине и пароле потому что не верно по ним зашло
          if (checkStorage) {
            removeAuth();
          } else {
            EventRegister.emit('ERROR_LOGIN', result['Envelope']['Body']['Fault'].detail.item);
          }
        } else {
          const sessionid = result['Envelope']['Body']['authResponse'].return.item[0].value;
          const user = result['Envelope']['Body']['authResponse'].return.item[1];

          saveAuth(phone, password, sessionid);

          ////console.warn('TEST1', JSON.stringify(user, 0 , 2))


          dispatch({
            type: types.USER_LOGGED_IN,
            data: {
              sessionid: sessionid,
              user: user.value
            }
          });
          dispatch({
            type: types.REDIRECT_LOGIN,
            data: {
              status: user.value.status
            }
          });
        }

        EventRegister.emit('LOGIN_RECIEVED');
     }).catch(err => {
       dispatch({
         type: types.RETURN_LOGIN,
       });
       EventRegister.emit('LOGIN_RECIEVED');
       EventRegister.emit('ERROR_LOGIN', err);
     });
  }
}

// Получение статусов пользователей
export const getUserStatuses = () => {

  return dispatch => {
    let xmls=
      `<soapenv:Envelope
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:soap="https://insightapp.ru/api/users/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getUserStatuses soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('https://insightapp.ru/api/users/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{

        var result = xmlParse.parse(res.data, options);

        if (result['Envelope']['Body']['Fault']) {
        } else {
          const userStatuses = result['Envelope']['Body']['getUserStatusesResponse'].return.item;
          dispatch({
            type: types.USER_STATUSES_RECIEVED,
            data: userStatuses
          });
        }
     }).catch(err => {
       ////console.warn(err)
     });
  }
}


// получение агентов(представителей)
export const getAgents = (sessionid) => {

  return dispatch => {
    let xmls=
      `<soapenv:Envelope
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:soap="https://insightapp.ru/api/users/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getAgents soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
            </soap:getAgents>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('https://insightapp.ru/api/users/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{

        var result = xmlParse.parse(res.data, options);

        if (result['Envelope']['Body']['Fault']) {
        } else {
          const agents = result['Envelope']['Body']['getAgentsResponse'].return.item;
          ////console.warn('', agents)
          dispatch({
            type: types.USER_AGENTS_RECIEVED,
            data: agents === undefined ? [] : agents
          });
        }
     }).catch(err => {
       ////console.warn(err)
       dispatch({
         type: types.USER_AGENTS_RECIEVED,
         data: []
       });
     });
  }
}
// Получение таскмастеров
export const getTaskMasters = (sessionid) => {

  return dispatch => {
    let xmls=
      `<soapenv:Envelope
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:soap="https://insightapp.ru/api/users/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getTaskMasters soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
            </soap:getTaskMasters>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('https://insightapp.ru/api/users/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{
        var result = xmlParse.parse(res.data, options);

        if (result['Envelope']['Body']['Fault']) {
        } else {
          const taskmasters = result['Envelope']['Body']['getTaskMastersResponse'].return.item;
          ////console.warn('taskmasters', taskmasters)
          dispatch({
            type: types.USER_TASKMASTERS_RECIEVED,
            data: taskmasters === undefined ? [] : taskmasters
          });
        }
     }).catch(err => {
       ////console.warn(err)
       dispatch({
         type: types.USER_TASKMASTERS_RECIEVED,
         data: []
       });
     });
  }
}
