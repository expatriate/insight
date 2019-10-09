import * as types from '../actionTypes.js';
import axios from 'axios';
import xml2js from 'react-native-xml2js';

import { EventRegister } from 'react-native-event-listeners';

// Получение статусов
export const getTowns = () => {
  return dispatch => {

    let xmls=
      `<soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://insight.mahaonweb.beget.tech/api/towns/soap?ws=1">
            <soapenv:Header/>
            <soapenv:Body>
              <soap:getTowns soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
            </soapenv:Body>
          </soapenv:Envelope>`;

      axios.post('http://insight.mahaonweb.beget.tech/api/towns/soap?ws=1',
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
              const data = result['SOAP-ENV:Body']['ns1:getTownsResponse'].return.item;
              if (data.length) {
                dispatch({
                  type: types.TOWNS_RECIEVED,
                  data: data
                })
              }
            }
          });
       }).catch(err => {
         console.warn('ERROR', err)
       });
  }
}
