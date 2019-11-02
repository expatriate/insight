import * as types from '../actionTypes.js';
import axios from 'axios';
import xmlParse from 'fast-xml-parser';

import { EventRegister } from 'react-native-event-listeners';

let options = {
  ignoreAttributes : true,
  ignoreNameSpace : true,
  allowBooleanAttributes : false,
  parseNodeValue : false,
  parseAttributeValue : false,
  trimValues: true,
  parseTrueNumberOnly: false,
};

// Получение статусов
export const getTowns = () => {
  return dispatch => {

    let xmls=
      `<soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="https://insightapp.ru/api/towns/soap?ws=1">
            <soapenv:Header/>
            <soapenv:Body>
              <soap:getTowns soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
            </soapenv:Body>
          </soapenv:Envelope>`;

      axios.post('https://insightapp.ru/api/towns/soap?ws=1',
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
            const data = result['Envelope']['Body']['getTownsResponse'].return.item;
            if (data.length) {
              dispatch({
                type: types.TOWNS_RECIEVED,
                data: data
              })
            }
          }
       }).catch(err => {
         //console.warn('ERROR', err)
       });
  }
}
