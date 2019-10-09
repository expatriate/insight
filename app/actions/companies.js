import * as types from '../actionTypes.js';
import axios from 'axios';
import xml2js from 'react-native-xml2js';
import { EventRegister } from 'react-native-event-listeners';
import {
  Alert
} from 'react-native';

export const getAllCompanies = () => {
  return dispatch => {
    EventRegister.emit('COMPANIES_LOADING_START');
    let xmls=
      `<soapenv:Envelope
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:soap="http://insight.mahaonweb.beget.tech/api/company/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getCompanies soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/company/soap?ws=1',
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
          if (err) {console.warn('THROW'); throw (err)}
          if(result['SOAP-ENV:Body']['SOAP-ENV:Fault']) {
            //EventRegister.emit('ERROR_LOGIN', result['SOAP-ENV:Body'][0]['SOAP-ENV:Fault'][0].detail[0].item[0]);
          } else {

            let data = result['SOAP-ENV:Body']['ns1:getCompaniesResponse'].return.item;
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
        });
     }).catch(err => {
       console.warn('ERROR', err)
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
        xmlns:soap="http://insight.mahaonweb.beget.tech/api/company/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getUserCompanies soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
            </soap:getUserCompanies>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/company/soap?ws=1',
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
          if (err) {console.warn('THROW'); throw (err)}
          if(result['SOAP-ENV:Body']['SOAP-ENV:Fault']) {
            //EventRegister.emit('ERROR_LOGIN', result['SOAP-ENV:Body'][0]['SOAP-ENV:Fault'][0].detail[0].item[0]);
          } else {
            console.warn('COMPANIES1', result['SOAP-ENV:Body'])
            let data = result['SOAP-ENV:Body']['ns1:getUserCompaniesResponse'].return.item;
            if (typeof data === 'object' && !Array.isArray(data) && data.id) {
              data = [data];
            }
            if (data === undefined) {
              data = []
            }
            console.warn('COMPANIES1', data.length)
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
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
  }
}
