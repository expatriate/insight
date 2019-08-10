import * as types from '../actionTypes.js';

const appState = { 
  items: [],
  only_pro: [],
  only_business: [],
  taskview: {
    loaded: false,
    api_tags:[],
    api_files: [],
    api_responds: [],
  },
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
  loaded_items: false,
  loaded_pro: false,
  loaded_business: false,
};

export default tasks = (state = appState, action) => {
    switch (action.type) {
      case types.TASKS_RECIEVED:

        return {
          ...state,
          items: [
            ...action.data
          ],
          loaded_items: true,
        }
      break;
      case types.TASKS_PRO_RECIEVED:
        return {
          ...state,
          only_pro: [
            ...action.data
          ],
          loaded_pro: true,
        }
      break;
      case types.TASKS_BUSINESS_RECIEVED:
        return {
          ...state,
          only_business: [
            ...action.data
          ],
          loaded_business: true,
        }
      break;
      case types.TASKS_FILTER_CHANGED:
        return {
          ...state,
          search: {
            ...state.search,
            ...action.data
          },
          loaded_items: false,
          loaded_pro: false,
          loaded_business: false
        }
      break;
      case types.TASK_FILTER_TAGS_RECIEVED:
        return {
          ...state,
          search: {
            ...state.search,
            tags: action.data
          },
        }
      break;
      case types.TASKS_FILTER_DATA_RECIEVED:
        return {
          ...state,
          only_business: action.data.filter(item => item.only_business && !item.only_pro) || [],
          only_pro: action.data.filter(item => item.only_pro && !item.only_business) || [],
          items: action.data,
          loaded_items: true,
          loaded_pro: true,
          loaded_business: true
        }
      break;
      case types.AWAY_FROM_TASK:
        return {
          ...state,
          taskview: {
            ...state.taskview,
            loaded: false,
          },
        }
      break;
      case types.TASK_RECIEVED:
        return {
          ...state,
          taskview: {
            ...action.data,
            loaded: true,
          }
        }
      break;
      case types.TASK_PERFORMER_DELETED:
        console.warn('TASK_PERFORMER_DELETED')

        return {
          ...state,
          only_business: state.only_business.map((item) => {
            if (item.id !== action.data.taskId) {
              return item
            } else {
              let performer = {};
              if (!Array.isArray(item.api_performers)) {
                performer = item.api_performers;
                delete performer[action.data.performerId+'']
                return {
                  ...item,
                  api_performers: {
                    performer
                  }
                }
              } else {
                return item
              }
            }
          }),
          only_pro: state.only_pro.map((item) => {
            if (item.id !== action.data.taskId) {
              return item
            } else {
              let performer = {};
              if (!Array.isArray(item.api_performers)) {
                performer = item.api_performers;
                delete performer[action.data.performerId+'']
                return {
                  ...item,
                  api_performers: {
                    performer
                  }
                }
              } else {
                return item
              }
            }
          }),
          items: state.items.map((item) => {
            if (item.id !== action.data.taskId) {
              return item
            } else {
              let performer = {};
              if (!Array.isArray(item.api_performers)) {
                performer = item.api_performers;
                delete performer[action.data.performerId+'']
                return {
                  ...item,
                  api_performers: {
                    performer
                  }
                }
              } else {
                return item
              }
            }
          }),
          taskview: {
            ...state.taskview,
            api_performers: !Array.isArray(state.taskview.api_performers) ?
              () => {
                let performer = state.taskview.api_performers;
                delete performer[action.data.performerId+'']
                return { performer }
              }
            : []
          }
        }
      break;
      case types.TASK_RESPOND_DELETED:

      console.warn(action.data.taskId, action.data.respondId)

        return {
          ...state,
          only_business: state.only_business.map((item) => {
            if (item.id !== action.data.taskId) {
              return item
            } else {
              let responder = {};
              if (!Array.isArray(item.api_responds)) {
                responder = item.api_responds;
                delete responder[action.data.respondId+'']
                return {
                  ...item,
                  api_responds: {
                    responder
                  }
                }
              } else {
                return item
              }
            }
          }),
          only_pro: state.only_pro.map((item) => {
            if (item.id !== action.data.taskId) {
              return item
            } else {
              let responder = {};
              if (!Array.isArray(item.api_responds)) {
                responder = item.api_responds;
                delete responder[action.data.respondId+'']
                return {
                  ...item,
                  api_responds: {
                    responder
                  }
                }
              } else {
                return item
              }
            }
          }),
          items: state.items.map((item) => {
            if (item.id !== action.data.taskId) {
              return item
            } else {
              let responder = {};
              if (!Array.isArray(item.api_responds)) {
                responder = item.api_responds;
                delete responder[action.data.respondId+'']
                return {
                  ...item,
                  api_responds: {
                    responder
                  }
                }
              } else {
                return item
              }
            }
          }),
          taskview: {
            ...state.taskview,
            api_responds: !Array.isArray(state.taskview.api_responds) ?
              () => {
                let responder = state.taskview.api_responds;
                delete responder[action.data.respondId+'']
                return { responder }
              }
            : []
          }
        }
      break;
      case types.TASK_RESPOND_APPLIED:
        let taskviewResp = Array.isArray(state.taskview.api_responds) ? {} : state.taskview.api_responds;
        taskviewResp[action.data.respond.task_id+''] = action.data.user;
        return {
          ...state,
          only_business: state.only_business.map((item) => {
            if (item.id !== action.data.respond.task_id) {
              return item
            } else {

              let responds = Array.isArray(item.api_responds) ? {} : item.api_responds;
              responds[action.data.respond.task_id+''] = action.data.user

              return {
                ...item,
                api_responds: {
                  ...responds
                }
              }
            }
          }),
          only_pro: state.only_pro.map((item) => {
            if (item.id !== action.data.respond.task_id) {
              return item
            } else {
              let responds = Array.isArray(item.api_responds) ? {} : item.api_responds;
              responds[action.data.respond.task_id+''] = action.data.user

              return {
                ...item,
                api_responds: {
                  ...responds
                }
              }
            }
          }),
          items: state.items.map((item) => {
            if (item.id !== parseInt(action.data.respond.task_id)) {
              return item
            } else {
              let responds = Array.isArray(item.api_responds) ? {} : item.api_responds;
              responds[action.data.respond.task_id+''] = action.data.user

              return {
                ...item,
                api_responds: {
                  ...responds
                }
              }
            }
          }),
          taskview: {
            ...state.taskview,
            api_responds: {
              ...taskviewResp
            }
          }
        }
      break;
      default:
          return state;
    }
};