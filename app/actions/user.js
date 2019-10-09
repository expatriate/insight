import axios from 'axios';
import qs from 'qs';
import * as types from '../actionTypes.js';
import xml2js from 'react-native-xml2js';

import {
  Alert,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import { EventRegister } from 'react-native-event-listeners';

import PushNotification from 'react-native-push-notification';




// Запись данных во внутренный стор телефона
saveAuth = async (phone, password, sessionid = '') => {

  PushNotification.configure({

      onRegister: function(token) {
          console.warn( 'TOKEN:', token );
          sendPhoneToken(sessionid, token.token)
      },

      onNotification: function(notification) {
          console.warn( 'NOTIFICATION:', notification );
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

      senderID: "YOUR GCM SENDER ID",

      permissions: {
          alert: true,
          badge: true,
          sound: true
      },

      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
  });
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
        xmlns:soap="http://insight.mahaonweb.beget.tech/api/users/soap?ws=1">
        <soapenv:Header/>
        <soapenv:Body>
            <soap:addUserPhoneToken soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
                <token xsi:type="xsd:string">${token}</token>
            </soap:addUserPhoneToken>
        </soapenv:Body>
    </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/users/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res => {
        var parser = new xml2js.Parser({
          explicitRoot: false,
          ignoreAttrs: true,
          explicitArray: false
        });
        parser.parseString(res.data, (err, result) => {
          console.warn(JSON.stringify(result, 0 , 2))
        })
        //console.warn('ANSWER', res)
      }).catch(err => {
        console.warn(err)
      });
   }

export const getTask = (sessionid, id) => {
  console.warn('getTask')
    let xmls=`
    <soapenv:Envelope
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:soap="http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1">
     <soapenv:Header/>
     <soapenv:Body>
           <soap:getTask soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
              <id xsi:type="xsd:int">${id}</id>
           </soap:getTask>
        </soapenv:Body>
     </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{
        console.warn('getTask resopnse', res)
        var parser = new xml2js.Parser({
          explicitRoot: false,
          ignoreAttrs: true,
          explicitArray: false
        });
        parser.parseString(res.data, (err, result) => {
          if (err) {throw (err)}
          if(result['SOAP-ENV:Body']['SOAP-ENV:Fault']) {

          } else {
            const task = result['SOAP-ENV:Body']['ns1:getTaskResponse'].return;

            if (task.id) {
              EventRegister.emit('PUSH_RECIEVED', task);
            }
          }
        });
     }).catch(err => {
       console.warn(err)
     });
}

// Сохранение данных юзера со страницы профиля
export const login = (phone, password, checkStorage = false) => {

  return dispatch => {
    let xmls=
      `<soapenv:Envelope
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soap="http://insight.mahaonweb.beget.tech/api/auth/soap?ws=1">
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

    axios.post('http://insight.mahaonweb.beget.tech/api/auth/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{
        var parser = new xml2js.Parser({
          explicitRoot: false,
          ignoreAttrs: true,
          explicitArray: false
        });
        parser.parseString(res.data, (err, result) => {
          if (err) {throw (err)}
          if(result['SOAP-ENV:Body']['SOAP-ENV:Fault']) {
            dispatch({
              type: types.RETURN_LOGIN,
            });

            // Убираем данные о предыдущих логине и пароле потому что не верно по ним зашло
            if (checkStorage) {
              removeAuth();
            } else {
              EventRegister.emit('ERROR_LOGIN', result['SOAP-ENV:Body']['SOAP-ENV:Fault'].detail.item);
            }
          } else {
            const sessionid = result['SOAP-ENV:Body']['ns1:authResponse'].return.item[0].value;
            const user = result['SOAP-ENV:Body']['ns1:authResponse'].return.item[1];
            saveAuth(phone, password, sessionid);

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
        });
        EventRegister.emit('LOGIN_RECIEVED');
     }).catch(err => {
       dispatch({
         type: types.RETURN_LOGIN,
       });
       EventRegister.emit('LOGIN_RECIEVED');
       console.warn(err)
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
          xmlns:soap="http://insight.mahaonweb.beget.tech/api/users/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getUserStatuses soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/users/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{
        var parser = new xml2js.Parser({
          explicitRoot: false,
          ignoreAttrs: true,
          explicitArray: false
        });
        parser.parseString(res.data, (err, result) => {
          if (err) {throw (err)}
          if(result['SOAP-ENV:Body']['SOAP-ENV:Fault']) {

          } else {
            const userStatuses = result['SOAP-ENV:Body']['ns1:getUserStatusesResponse'].return.item;
            dispatch({
              type: types.USER_STATUSES_RECIEVED,
              data: userStatuses
            });
          }
        });
     }).catch(err => {
       console.warn(err)
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
        xmlns:soap="http://insight.mahaonweb.beget.tech/api/users/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getAgents soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
            </soap:getAgents>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/users/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{
        var parser = new xml2js.Parser({
          explicitRoot: false,
          ignoreAttrs: true,
          explicitArray: false
        });
        parser.parseString(res.data, (err, result) => {
          if (err) {throw (err)}
          if(result['SOAP-ENV:Body']['SOAP-ENV:Fault']) {

          } else {
            let agents = result['SOAP-ENV:Body']['ns1:getAgentsResponse'].return.item;
            console.warn(agents)
            dispatch({
              type: types.USER_AGENTS_RECIEVED,
              data: agents === undefined ? [] : agents
            });
          }
        });
     }).catch(err => {
       console.warn(err)
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
        xmlns:soap="http://insight.mahaonweb.beget.tech/api/users/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getTaskMasters soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
            </soap:getTaskMasters>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/users/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res=>{
        var parser = new xml2js.Parser({
          explicitRoot: false,
          ignoreAttrs: true,
          explicitArray: false
        });
        parser.parseString(res.data, (err, result) => {
          if (err) {throw (err)}
          if(result['SOAP-ENV:Body']['SOAP-ENV:Fault']) {

          } else {
            const taskmasters = result['SOAP-ENV:Body']['ns1:getTaskMastersResponse'].return.item;
            console.warn(taskmasters)
            dispatch({
              type: types.USER_TASKMASTERS_RECIEVED,
              data: taskmasters === undefined ? [] : taskmasters
            });
          }
        });
     }).catch(err => {
       console.warn(err)
       dispatch({
         type: types.USER_TASKMASTERS_RECIEVED,
         data: []
       });
     });
  }
}
