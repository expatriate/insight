import * as types from '../actionTypes.js';
import axios from 'axios';
import xml2js from 'react-native-xml2js';
import {
  Alert
} from 'react-native';

import { EventRegister } from 'react-native-event-listeners';


export const filterTasks = (filter) => {
  return dispatch => {
    dispatch({
      type: types.TASKS_FILTER,
      data: filter
    })
  }
}

export const getAllSpectatorTasks = (sessionid, filter = false, offset = 0) => {
  return dispatch => {

    if (!offset) {
      EventRegister.emit('TASKS_LOADING_START');
    }
    let xmls=
      `<soapenv:Envelope
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:soap="http://insight.mahaonweb.beget.tech/api/spectator/soap?ws=1">
       <soapenv:Header/>
         <soapenv:Body>
            <soap:getAllTasks soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
               <filter xsi:type="soap:app.modules.api.models.TaskFilter">
                ${filter && filter.town ? `<town_id xsi:type="xsd:int">${filter.town}</town_id>` : ``}
                ${filter && filter.status ? `<status xsi:type="xsd:int">${filter.status}</status>` : ``}
                ${filter && filter.project_id ? `<project_id xsi:type="xsd:int">${filter.project_id}</project_id>` : ``}
               </filter>
               <limit xsi:type="xsd:int">10</limit>
               <offset xsi:type="xsd:int">${offset}</offset>
            </soap:getAllTasks>
         </soapenv:Body>
       </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/spectator/soap?ws=1',
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

            const count = result['SOAP-ENV:Body']['ns1:getAllTasksResponse'].return.item[0].value;
            console.warn('COUNT',count)
            let data = result['SOAP-ENV:Body']['ns1:getAllTasksResponse'].return.item[1].value.item;
            console.warn('DATA', count, offset, data)
            if (typeof data === 'object' && !Array.isArray(data) && data.id) {
              data = [data];
            }
            if (data === undefined) {
              data = []
            }
            if (offset === 0) {
              dispatch({
                type: types.TASKS_RECIEVED,
                data: {
                  tasks: data.length ? data.map(item => {
                    return {
                      ...item,
                      key: item.id + '_task'
                    }
                  }) : [],
                  count: count
                }
              })
              EventRegister.emit('TASKS_RECIEVED');
            }

            if (offset > 0) {
              console.warn('TASKS_ADD_RECIEVED', data)
              dispatch({
                type: types.TASKS_ADD_RECIEVED,
                data: {
                  tasks: data.length ? data.map(item => {
                    return {
                      ...item,
                      key: item.id + '_task'
                    }
                  }) : [],
                  offset: offset
                }
              })
              EventRegister.emit('TASKS_ADD_RECIEVED');
            }
          }
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
  }
}


export const getAllTasks = (sessionid, filter = false, offset = 0) => {
  return dispatch => {

    if (!offset) {
      EventRegister.emit('TASKS_LOADING_START');
    }
    let xmls=
      `<soapenv:Envelope
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:soap="http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1">
       <soapenv:Header/>
         <soapenv:Body>
            <soap:getAllTasks soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
               <filter xsi:type="soap:app.modules.api.models.TaskFilter">
                ${filter && filter.town ? `<town_id xsi:type="xsd:int">${filter.town}</town_id>` : ``}
                ${filter && filter.status ? `<status xsi:type="xsd:int">${filter.status}</status>` : ``}
               </filter>
               <limit xsi:type="xsd:int">10</limit>
               <offset xsi:type="xsd:int">${offset}</offset>
            </soap:getAllTasks>
         </soapenv:Body>
       </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1',
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

            const count = result['SOAP-ENV:Body']['ns1:getAllTasksResponse'].return.item[0].value;
            console.warn('COUNT',count)
            let data = result['SOAP-ENV:Body']['ns1:getAllTasksResponse'].return.item[1].value.item;
            console.warn('DATA', count, offset, data)
            if (typeof data === 'object' && !Array.isArray(data) && data.id) {
              data = [data];
            }
            if (data === undefined) {
              data = []
            }
            if (offset === 0) {
              dispatch({
                type: types.TASKS_RECIEVED,
                data: {
                  tasks: data.length ? data.map(item => {
                    return {
                      ...item,
                      key: item.id + '_task'
                    }
                  }) : [],
                  count: count
                }
              })
              EventRegister.emit('TASKS_RECIEVED');
            }

            if (offset > 0) {
              console.warn('TASKS_ADD_RECIEVED', data)
              dispatch({
                type: types.TASKS_ADD_RECIEVED,
                data: {
                  tasks: data.length ? data.map(item => {
                    return {
                      ...item,
                      key: item.id + '_task'
                    }
                  }) : [],
                  offset: offset
                }
              })
              EventRegister.emit('TASKS_ADD_RECIEVED');
            }
          }
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
  }
}

export const getImages = (id) => {
  return dispatch => {
    let xmls=
      `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:getPhotos soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <task_id xsi:type="xsd:int">${id}</task_id>
            </soap:getPhotos>
         </soapenv:Body>
      </soapenv:Envelope>`;

    axios.post('http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1',
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
          } else {

            let imagesArr = [];
            let images = result['SOAP-ENV:Body']['ns1:getPhotosResponse'].return.item;
            //console.warn('IMAGES', images)
            if (!images) {
              images = [];
            }
            if(!Array.isArray(images)) {
              imagesArr.push(images)
            } else {
              imagesArr = images;
            }

            dispatch({
              type: types.TASKS_DETAIL_IMAGES_RECIEVED,
              data: imagesArr
            });
          }
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
  }
}

removePhoto = (photoId) => {
  let xmls=
    `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1">
       <soapenv:Header/>
       <soapenv:Body>
          <soap:deletePhoto soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
             <id xsi:type="xsd:int">${photoId}</id>
          </soap:deletePhoto>
       </soapenv:Body>
    </soapenv:Envelope>`;
    console.warn(xmls)

    return axios.post('http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1',
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

          } else {
            const data = result['SOAP-ENV:Body']['ns1:deletePhotoResponse'].return;
          }
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
}

export const saveTask = (sessionid, task, photos = []) => {
  console.warn(JSON.stringify(task, 0 , 2))
  return dispatch => {
    let xmls=
      `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:setTask soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
               <task xsi:type="soap:app.modules.api.models.Task">
                  <project_id xsi:type="xsd:string">${task.project_id}</project_id>
                  <id xsi:type="xsd:int">${task.id}</id>
                  <name xsi:type="xsd:string">${task.name}</name>
                  <town_id xsi:type="xsd:int">${task.town_id}</town_id>
                  <address xsi:type="xsd:string">${task.address}</address>
                  <shop_title xsi:type="xsd:string">${task.shop_title}</shop_title>
                  <type xsi:type="xsd:string">${task.type}</type>
                  <created_at xsi:type="xsd:string">${task.created_at}</created_at>
                  <installation_date xsi:type="xsd:string">${task.installation_date}</installation_date>
                  <status xsi:type="xsd:int">${task.status}</status>
                  ${task.client_id ? `<client_id xsi:type="xsd:int">${task.client_id}</client_id>` : ``}
                  ${task.agent_id ? `<agent_id xsi:type="xsd:int">${task.agent_id}</agent_id>` : ``}
                  ${task.taskMaster_id ? `<taskMaster_id xsi:type="xsd:int">${task.taskMaster_id}</taskMaster_id>` : ``}
               </task>
            </soap:setTask>
         </soapenv:Body>
      </soapenv:Envelope>`;

    if (photos.length) {
      photos.map((item) => {
        removePhoto(item.id).then(() => {
          dispatch({
            type: types.TASKS_DETAIL_IMAGES_REMOVED,
            data: item.id
          });
        });
      });

    }


    axios.post('http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1',
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
          } else {
            const data = result['SOAP-ENV:Body']['ns1:setTaskResponse'].return;
            dispatch({
              type: types.TASK_RECIEVED,
              data: {
                ...data,
                key: data.id + '_task'
              }
            });
            EventRegister.emit('GET_BACK_TO_DETAIL');
            EventRegister.emit('DETAIL_CHANGED', data);
            //Alert.alert('Задача успешно изменена', 'The bomb has been planted')
          }
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
  }
}

export const savePhoto = (extension, data, taskId, last = false) => {
  return dispatch => {
    let xmls=
      `
      <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:setPhoto soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <taskPhoto xsi:type="soap:app.modules.api.models.TaskPhotoIn">
                  <extension xsi:type="xsd:string">${extension}</extension>
                  <data xsi:type="xsd:string">${data}</data>
                  <task_id xsi:type="xsd:int">${taskId}</task_id>
               </taskPhoto>
            </soap:setPhoto>
         </soapenv:Body>
      </soapenv:Envelope>
      `;

    axios.post('http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1',
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

          } else {
            //console.warn(result)
            const data = result['SOAP-ENV:Body']['ns1:setPhotoResponse'].return;
            console.warn('LAST', last)
            if (last) {
              EventRegister.emit('ALL_IMAGES_LOADED');
            }
            /*
            dispatch({
              type: types.TASK_RECIEVED,
              data: {
                ...data,
                key: data.id + '_task'
              }
            });*/
          }
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
  }
};


export const setVisited = (sessionid, taskid) => {
  return dispatch => {
    let xmls=
      `
      <soapenv:Envelope
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:soap="http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1">
          <soapenv:Header/>
          <soapenv:Body>
            <soap:setVisited soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
               <id xsi:type="xsd:int">${taskid}</id>
            </soap:setVisited>
          </soapenv:Body>
        </soapenv:Envelope>
      `;
    axios.post('http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1',
      xmls,
      {
        headers:{
          'Content-Type': 'text/xml',
       }
      }).then(res => {
        dispatch({
          type: types.TASK_VISITED,
          data: taskid
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
  }
}

export const changeStatus = (sessionid, id, status) => {
  return dispatch => {
    let xmls=
      `
      <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1">
         <soapenv:Header/>
         <soapenv:Body>
            <soap:changeStatus soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
               <sessionKey xsi:type="xsd:anyType">${sessionid}</sessionKey>
               <taskStatus xsi:type="soap:app.modules.api.models.TaskStatus">
                  <id xsi:type="xsd:int">${id}</id>
                  <status xsi:type="xsd:int">${status}</status>
               </taskStatus>
            </soap:changeStatus>
         </soapenv:Body>
      </soapenv:Envelope>
      `;

    axios.post('http://insight.mahaonweb.beget.tech/api/tasks/soap?ws=1',
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

          } else {
            //console.warn(result)
            const data = result['SOAP-ENV:Body']['ns1:changeStatusResponse'].return;

            dispatch({
              type: types.TASK_RECIEVED,
              data: {
                ...data,
                key: data.id + '_task'
              }
            });
          }
        });
     }).catch(err => {
       console.warn('ERROR', err)
     });
  }
}
