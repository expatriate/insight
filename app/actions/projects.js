import * as types from '../actionTypes.js';
import axios from 'axios';
import xmlParse from 'fast-xml-parser';
import { EventRegister } from 'react-native-event-listeners';
import {
  Alert
} from 'react-native';

const CancelToken = axios.CancelToken;

let cancel = undefined;

let options = {
  ignoreAttributes : true,
  ignoreNameSpace : true,
  allowBooleanAttributes : false,
  parseNodeValue : false,
  parseAttributeValue : false,
  trimValues: true,
  parseTrueNumberOnly: false,
};

export const getAllSpectatorProjects = (sessionid, firstload = false) => {
  EventRegister.emit('PROJECTS_LOADING_START');
  return dispatch => {
    let xmls=
      `<soapenv:Envelope
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:soap="https://insightapp.ru/api/spectator/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getProjects soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
            </soap:getProjects>
         </soapenv:Body>
      </soapenv:Envelope>`;

    if (cancel !== undefined) {
      cancel();
    }

    firstload && dispatch({
      type: types.PROJECTS_LOADING
    });

    axios.post('https://insightapp.ru/api/spectator/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       },
       cancelToken: new CancelToken(
         function executor(c){
           cancel = c;
         })
      }).then(res => {

        var result = xmlParse.parse(res.data, options);
        if(result['Envelope']['Body']['Fault']) {
          //EventRegister.emit('ERROR_LOGIN', result['SOAP-ENV:Body'][0]['SOAP-ENV:Fault'][0].detail[0].item[0]);
        } else {
          let data = result['Envelope']['Body']['getProjectsResponse'].return.item;

          if (typeof data === 'object' && !Array.isArray(data)) {
            data = [data];
          }
          if (data === undefined) {
            data = []
          }

          dispatch({
            type: types.PROJECTS_RECIEVED,
            data: data.length ?
              data
              :
              []
          })
          EventRegister.emit('PROJECTS_RECIEVED');
        }
     }).catch(err => {
       //console.warn('ERROR', err)
     });
  }
}

export const setProject = (projectid) => {
  return dispatch => {
    dispatch({
      type: types.PROJECT_SELECTED,
      data: projectid
    });
  }
}

export const getUserProjects = (sessionid, company_id, firstload = false) => {
  return dispatch => {
    EventRegister.emit('PROJECTS_LOADING_START');
    let xmls=
      `<soapenv:Envelope
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:soap="https://insightapp.ru/api/project/soap?ws=1">
       <soapenv:Header/>
       <soapenv:Body>
          <soap:getUserProjects soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
             <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
             <company_id xsi:type="xsd:int">${company_id}</company_id>
          </soap:getUserProjects>
       </soapenv:Body>
    </soapenv:Envelope>`;

    if (cancel !== undefined) {
      cancel();
    }

    firstload && dispatch({
      type: types.PROJECTS_LOADING
    });

    axios.post('https://insightapp.ru/api/project/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       },
       cancelToken: new CancelToken(
         function executor(c){
           cancel = c;
         })
      }).then(res => {
        var result = xmlParse.parse(res.data, options);
        if(result['Envelope']['Body']['Fault']) {
          //EventRegister.emit('ERROR_LOGIN', result['SOAP-ENV:Body'][0]['SOAP-ENV:Fault'][0].detail[0].item[0]);
        } else {
          let data = result['Envelope']['Body']['getUserProjectsResponse'].return.item;

          if (typeof data === 'object' && !Array.isArray(data) && data.id) {
            data = [data];
          }
          if (data === undefined) {
            data = []
          }

          dispatch({
            type: types.PROJECTS_RECIEVED,
            data: data.length ? data.map(item => {
              return {
                ...item,
                key: item.id + '_company'
              }
            }) : [],
          })
          EventRegister.emit('PROJECTS_RECIEVED');
        }
     }).catch(err => {
       //console.warn('ERROR', err)
     });
  }
}

export const getAllProjects = (company_id, firstload = false) => {
  EventRegister.emit('PROJECTS_LOADING_START');
  return dispatch => {
    let xmls=
      `<soapenv:Envelope
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:soap="https://insightapp.ru/api/project/soap?ws=1">
       <soapenv:Header/>
       <soapenv:Body>
          <soap:getProjects soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
             <company_id xsi:type="xsd:int">${company_id}</company_id>
          </soap:getProjects>
       </soapenv:Body>
    </soapenv:Envelope>`;

    if (cancel !== undefined) {
      cancel();
    }

    firstload && dispatch({
      type: types.PROJECTS_LOADING
    });

    axios.post('https://insightapp.ru/api/project/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       },
       cancelToken: new CancelToken(
         function executor(c){
           cancel = c;
         })
      }).then(res => {
        var result = xmlParse.parse(res.data, options);
        if(result['Envelope']['Body']['Fault']) {
          //EventRegister.emit('ERROR_LOGIN', result['SOAP-ENV:Body'][0]['SOAP-ENV:Fault'][0].detail[0].item[0]);
        } else {
          let data = result['Envelope']['Body']['getProjectsResponse'].return.item;
          if (typeof data === 'object' && !Array.isArray(data)) {
            data = [data];
          }
          if (data === undefined) {
            data = []
          }
          dispatch({
            type: types.PROJECTS_RECIEVED,
            data: data.length ?
              data.map((item, index) => {
                //console.warn('ITEM', item.item)
                let obj = {
                  key: index + '_company'
                };
                item.item.map(el => {
                    obj = {
                      ...obj,
                      [el.key]: el.value
                    }
                    return true
                });
                return obj
              })
              :
              []
          })
          EventRegister.emit('PROJECTS_RECIEVED');
        }
     }).catch(err => {
       //console.warn('ERROR', err)
     });
  }
}
