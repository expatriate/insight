import * as types from '../actionTypes.js';
import axios from 'axios';
import xmlParse from 'fast-xml-parser';
import { EventRegister } from 'react-native-event-listeners';
import {
  Alert
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

export const getAllCompanies = () => {
  return dispatch => {
    EventRegister.emit('COMPANIES_LOADING_START');
    let xmls=
      `<soapenv:Envelope
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:soap="https://insightapp.ru/api/company/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getCompanies soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('https://insightapp.ru/api/company/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res => {

        var result = xmlParse.parse(res.data, options);

        if (result['Envelope']['Body']['Fault']) {
        } else {
          let data = result['Envelope']['Body']['getCompaniesResponse'].return.item;
          if (typeof data === 'object' && !Array.isArray(data) && data.id) {
            data = [data];
          }
          if (data === undefined) {
            data = []
          }
          dispatch({
            type: types.COMPANIES_RECIEVED,
            data: data.length ?
              data.map((item, index) => {
                let obj = {
                  key: index + '_company'
                };
                item.item.map(el => {
                    obj = {
                      ...obj,
                      [el.key]: el.value
                    }
                    return true
                })
                return obj
              })
              :
              []
          })
          EventRegister.emit('COMPANIES_RECIEVED');
        }
     }).catch(err => {
       ////console.warn('ERROR', err)
     });
  }
}

export const setCompany = (companyid) => {
  return dispatch => {
    dispatch({
      type: types.COMPANY_SELECTED,
      data: companyid
    });
  }
}

export const getUserCompanies = (sessionid) => {
  return dispatch => {

    let xmls=
      `<soapenv:Envelope
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:soap="https://insightapp.ru/api/company/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getUserCompanies soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
            </soap:getUserCompanies>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('https://insightapp.ru/api/company/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res => {

        var result = xmlParse.parse(res.data, options);
        if(result['Envelope']['Body']['Fault']) {
          //EventRegister.emit('ERROR_LOGIN', result['SOAP-ENV:Body'][0]['SOAP-ENV:Fault'][0].detail[0].item[0]);
        } else {
          let data = result['Envelope']['Body']['getUserCompaniesResponse'].return.item;
          if (typeof data === 'object' && !Array.isArray(data) && data.id) {
            data = [data];
          }
          if (data === undefined) {
            data = []
          }
          ////console.warn('COMPANIES1', data.length)
          dispatch({
            type: types.COMPANIES_RECIEVED,
            data: data.length ? data.map(item => {
              return {
                ...item,
                key: item.id + '_company'
              }
            }) : [],
          })
          EventRegister.emit('COMPANIES_RECIEVED');
        }
     }).catch(err => {
       ////console.warn('ERROR', err)
     });
  }
}
