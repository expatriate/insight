import * as types from '../actionTypes.js';
import axios from 'axios';
import {
  Alert
} from 'react-native';

let userState = {
  is_auth: false,
  access_token: null,
  data: {
    respondsMax: 0,
    respondsLeft: 0,
  },
  educations: [],
  careers: [],
  services: [],
  usertags: [],
  task_profile: [],
  favoritetasks: [],
  respondedtasks: [],
  performedtasks: [],
  createdtasks: [],
  mytasks: [],
  mytasks_count: [],
  mytasks_all: [],
  mytasks_responds: [],
  mytasks_delegate: [],
  mytasks_choice: [],
  mytasks_make: [],
  mytasks_arhiv: [],
  mytasksfiltered: [],
  mytasksloaded: false,
  search: {
    only_pro: false,
    only_business: false,
    length: 0,
    lat: undefined,
    lng: undefined,
    price_min: undefined,
    price_max: undefined,
    arhive: 0,
    title: undefined,
    tags: [],
    address: '_',
  },
};

export default user = (state = userState, action) => {
    switch (action.type) {
      case types.LOGGED_IN:
        // Записываем токен в заголовки по умолчанию после получения авторизационных данных
        axios.defaults.headers.common['Authorization'] = `Bearer ${action.data}`;
        return state = Object.assign({}, state, {is_auth: true, access_token: action.data});
      break;
      case types.USER_DATA_RECIEVED:
        return {
          ...state,
          data: {
            ...action.data.user,
            respondsMax: state.data.respondsMax,
            respondsLeft: state.data.respondsLeft,
          }
        }
      break;
      case types.USER_PHOTO_RECIEVED:
        return {
          ...state,
          photo: {
            ...action.data,
          }
        }
      break;
      case types.USER_TASK_PROFILE:
        return {
          ...state,
          task_profile: {
            ...action.data,
          }
        }
        break;
      case types.MYTASK_PERFORMER_DELETED:
        return {
          ...state,
          mytasks: state.mytasks.filter((item) => {
            if (item.id !== action.data.taskId) {
              return true
            } else {
              return false
            }
          }),
        }
      break;
      case types.MYTASK_RESPOND_DELETED:
        return {
          ...state,
          mytasks: state.mytasks.filter((item) => {
            if (item.id !== action.data.taskId) {
              return true
            } else {
              return false
            }
          }),
        }
      break;
      case types.MYTASK_RESPOND_APPLIED:
        var responders = {};
        return {
          ...state,
          mytasks: state.mytasks.filter((item) => {
            if (item.id == parseInt(action.data.task_id)) {
              responders[action.data.id+''] = item.api_responds[objectKey];
              if (!Array.isArray(item.api_responds)) {

              } else {
                return({
                  ...item,
                  api_responds: {
                    responders,
                  }
                });
              }
            } else {
              return(item)
            }
          })
        }
      break;
      case types.MYTASKS_LOADED:
        return {
          ...state,
          mytasksloaded: action.data
        }
      break;
      case types.TASK_EDITED:
        return {
          ...state,
          mytasks: state.mytasks.map((item) => {
            if (item.id == action.data.id) {
              console.warn(true)
              return action.data
            }
            return item
          }),
          performedtasks: state.performedtasks.map((item) => {
            if (item.id == action.data.id) {
              return action.data
            }
            return item
          }),
          createdtasks: state.createdtasks.map((item) => {
            if (item.id == action.data.id) {
              return action.data
            }
            return item
          }),
          respondedtasks: state.respondedtasks.map((item) => {
            if (item.id == action.data.id) {
              return action.data
            }
            return item
          }),
        }
      break;
      case types.USER_PERFORMEDTASKS_RECIEVED:
        let ids1 = state.mytasks.map((item) => {return item.id});
        let performed = action.data.filter((item) => {
          if (ids1.indexOf(item.id) < 0) {
            return item
          }
        });
        return {
          ...state,
          performedtasks: [
            ...action.data
          ],
          mytasks: [
            ...state.mytasks,
            ...performed
          ]
        }
      break;
      case types.USER_RESPONDEDTASKS_RECIEVED:
        let ids2 = state.mytasks.map((item) => {return item.id});
        let responded = action.data.filter((item) => {
          if (ids2.indexOf(item.id) < 0) {
            return item
          }
        });
        return {
          ...state,
          respondedtasks: [
            ...action.data
          ],
          mytasks: [
            ...state.mytasks,
            ...responded
          ]
        }
      break;
      case types.USER_FAVORITETASKS_RECIEVED:
        return {
          ...state,
          favoritetasks: [
            ...action.data
          ]
        }
      break;
      case types.MY_TASK_COUNT:
        return {
          ...state,
          mytasks_count: {
            ...action.data,
          }
        }
        break;
      case types.MY_TASK_ALL:
        return {
          ...state,
          mytasks_all: {
            ...action.data,
          }
        }
        break;
      case types.MY_TASK_RESPONDS:
        return {
          ...state,
          mytasks_responds: {
            ...action.data,
          }
        }
        break;
      case types.MY_TASK_DELEGATE:
        return {
          ...state,
          mytasks_delegate: {
            ...action.data,
          }
        }
        break;
      case types.MY_TASK_CHOICE:
        return {
          ...state,
          mytasks_choice: {
            ...action.data,
          }
        }
        break;
      case types.MY_TASK_MAKE:
        return {
          ...state,
          mytasks_make: {
            ...action.data,
          }
        }
        break;
      case types.MY_TASK_ARHIV:
        return {
          ...state,
          mytasks_arhiv: {
            ...action.data,
          }
        }
        break;
      case types.USER_CREATEDTASKS_RECIEVED:
        let ids3 = state.mytasks.map((item) => {return item.id});
        let created = [];
        action.data.filter((item) => {
          if (ids3.indexOf(item.id) < 0) {
            created.push({
              ...item,
              api_user: state.data
            });
          }
        });
        return {
          ...state,
          createdtasks: [
            ...action.data
          ],
          mytasks: [
            ...state.mytasks,
            ...created
          ]
        }
      break;
      case types.USER_REVIEWS_RECIEVED:
        return {
          ...state,
          reviews: [
            ...action.data
          ]
        }
      break;
      case types.USER_PRIVATE_STATUS_CHANGE:
        return {
          ...state,
          mytasks: state.mytasks.filter((item) => {
            if (item.id == parseInt(action.data.taskid)) {
              return({
                ...item,
                status: action.data.status,
              });
            } else {
              return(item)
            }
          })
        }
      break;
      case types.TASK_PERFORMER_CHANGED:
        var performer = {};
        return {
          ...state,
          mytasks: state.mytasks.filter((item) => {
            if (item.id == parseInt(action.data.task_id)) {
              //Забираем исполнителя из списка откликнувшихся
              if (!Array.isArray(item.api_responds)) {
                Object.keys(item.api_responds).filter(function(objectKey, index) {
                  if (item.api_responds[objectKey].id == parseInt(action.data.user_id)) {
                    performer[action.data.id+''] = item.api_responds[objectKey];
                  }
                });
              }
              return({
                ...item,
                api_performers: performer,
              });
            } else {
              return(item)
            }
          })
        }
      break;
      case types.USER_PHONES_RECIEVED:
        return {
          ...state,
          phones: [
            ...action.data
          ]
        }
      break;
      case types.USER_TEAMS_RECIEVED:
        return {
          ...state,
          team: [
            ...action.data
          ]
        }
      break;
      case types.USER_BLOGS_RECIEVED:
        return {
          ...state,
          blogs: [
            ...action.data
          ]
        }
      break;
      case types.USER_CAREERS_RECIEVED:
        return {
          ...state,
          careers: [
            ...action.data
          ]
        }
      break;
      case types.USER_EDUCATION_RECIEVED:
        return {
          ...state,
          educations: [
            ...action.data
          ]
        }
      break;
      case types.USER_SERVICES_RECIEVED:
        if (action.data.length) {
          action.data.sort(function(a, b) {
              return a.tag_id - b.tag_id;
          });
        }
        return {
          ...state,
          services: [
            ...action.data
          ]
        }
      break;
      case types.USER_TAGS_RECIEVED:
        return {
          ...state,
          usertags: [
            ...action.data
          ]
        }
      break;
      case types.ALL_USER_DATA_RECIEVED:
        return {
          ...state,
          chats: [
            ...action.data.chats
          ],
          messages: [
            ...action.data.messages
          ],
          data: {
            ...state.data,
            respondsMax: action.data.respondsMax,
            respondsLeft: action.data.respondsLeft,
            plan: action.data.plan,
          }
        }
      break;
      case types.USER_TAGS_REPLACE:
        if (action.data.length) {
          let tags = state.usertags.reduce((acc, curr) => {
            if (action.data.indexOf(curr.id) < 0) acc.push(curr);
            return acc;
          }, []);
          return {
            ...state,
            usertags: [
              ...tags
            ]
          }
        } else {
          return state;
        }
      break;
      case types.USER_EDUCATION_IMAGES_RECIEVED:
        return {
          ...state,
          educationimages: [
            ...action.data
          ]
        }
      break;
      case types.USER_RESPONDS_CHANGE:
        if (action.data.type == 'append') {
          return {
            ...state,
            data: {
              ...state.data,
              respondsLeft: parseInt(state.data.respondsLeft) + 1,
            }
          }
        } else {
          return {
            ...state,
            data: {
              ...state.data,
              respondsLeft: parseInt(state.data.respondsLeft) - 1,
            }
          }
        }
      break;
      case types.USER_TAGS_ADD:
        if (action.data.length) {
          return {
            ...state,
            usertags: action.data
          }
        } else {
          return state;
        }
      break;

      // Фильрация моих тасков
      case types.MYTASKS_FILTER_CHANGED:
        console.warn(JSON.stringify(action.data, 0 , 2))
        return {
          ...state,
          search: {
            ...state.search,
            ...action.data
          },
          mytasksfiltered: state.mytasks.filter((item, index) => {
            let valid = true, tagsValid = false;
            if (action.data.price_min && parseInt(action.data.price_min) > parseInt(item.price)) {
              valid = false;
            }
            if (action.data.price_max && parseInt(action.data.price_max) < parseInt(item.price)) {
              valid = false;
            }
            if (action.data.only_pro != undefined && action.data.only_pro != item.only_pro) {
              valid = false;
            }
            if (action.data.only_business != undefined && action.data.only_business != item.only_business) {
              valid = false;
            }
            if (action.data.arhive != undefined && action.data.arhive != item.arhive) {
              valid = false;
            }
            if (action.data.title && item.title.toLowerCase().indexOf(action.data.title.toLowerCase()) < 0 && item.text.toLowerCase().indexOf(action.data.title.toLowerCase()) < 0) {
              valid = false;
            }
            if (action.data.tags && action.data.tags.length && Array.isArray(item.api_tags) && item.api_tags.length) {
              var tags = [];
              action.data.tags.map(item => {
                tags.push(item.id)
              });
              for (let i = 0; i < item.api_tags.length; i++) {
                if (tags.indexOf(item.api_tags[i].id) >= 0 && !tagsValid) {
                  tagsValid = true
                }
              }
            }
            return valid && (action.data.tags.length ? tagsValid : true)
          })
        }
      break;
      case types.MYTASK_FILTER_TAGS_RECIEVED:
        return {
          ...state,
          search: {
            ...state.search,
            tags: action.data
          },
        }
      break;
      default:
          return state;
    }
};
