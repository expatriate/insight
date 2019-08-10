import * as types from '../actionTypes.js';

const appState = {
  contacts: {
    users:[]
  },
  query:  {
    users:[]
  },
  invited: {
    users: []
  },
  recomendations:  {
    users:[]
  },
  recomendations_performers:  {
    users:[]
  },
  groups: [],
  search: {
    tags: [],
    name: undefined,
    only_pro: false,
    only_business: false,
  },
  myteamfiltered: [],
  loaded: false,
  first_load: true,
};

export default team = (state = appState, action) => {
    switch (action.type) {
      case types.TEAM_DATA_LOADED: 
        return {
          ...state, 
          loaded: action.data,
          first_load: action.data ? false : true,
        } 
      break;
      case types.TEAM_CONTACTS_RECIEVED:
        return {
          ...state,
          contacts: action.data
        }
      break;
      case types.TEAM_QUERY_RECIEVED:
        return {
          ...state,
          query: action.data
        }
      break;
      case types.TEAM_RECOM_RECIEVED:
        return {
          ...state,
          recomendations: action.data
        }
      break;
      case types.TEAM_RECOM_PERFORMERS_RECIEVED:
        return {
          ...state,
          recomendations_performers: action.data
        }
      break;
      case types.TEAM_GROUPS_RECIEVED:
        return {
          ...state,
          groups: action.data
        }
      break;
      case types.TEAM_GROUP_ADDED:
        return {
          ...state,
          groups: [
            ...state.groups,
            action.data
          ]
        }
      break;
      case types.TEAM_FILTER_TAGS_RECIEVED:
        return {
          ...state,
          search: {
            ...state.search,
            tags: action.data
          },
        }
      break;
      case types.TEAM_USER_GROUP_REMOVED:
        return {
          ...state,
          contacts: {
            ...state.contacts,
            users: state.contacts.users.map((item) => {
              if (item.user.id == action.data.user) {
                return ({
                  user: item.user,
                  group: []
                })
              }
              return(item)
            })
          }
        }
      break;
      case types.TEAM_USER_GROUP_APPLIED:
        return {
          ...state,
          contacts: {
            ...state.contacts,
            users: state.contacts.users.map((item) => {
              if (item.user.id == action.data.user) {
                return ({
                  user: item.user,
                  group: action.data.group
                })
              }
              return(item)
            })
          }
        }
      break;
      case types.TEAM_FILTER_CHANGED:
        console.warn(JSON.stringify(action.data, 0 , 2))
        return {
          ...state,
          search: {
            ...state.search,
            ...action.data
          },
          myteamfiltered: state.contacts.users.filter((item, index) => {
            let valid = true, tagsValid = false;
            if (action.data.only_pro != undefined && action.data.only_pro && item.user.plan.title != 'PRO') {
              valid = false;
            }
            if (action.data.only_business != undefined && action.data.only_business && item.user.plan.title != 'Business') {
              valid = false;
            }
            if (action.data.name && 
              (item.user.name.toLowerCase() + ' ' + item.user.surname.toLowerCase()).indexOf(action.data.name.toLowerCase()) < 0) {
              valid = false;
            }
            /*if (action.data.tags && action.data.tags.length && Array.isArray(item.api_tags) && item.api_tags.length) {
              var tags = [];
              action.data.tags.map(item => {
                tags.push(item.id)
              });
              for (let i = 0; i < item.api_tags.length; i++) {
                if (tags.indexOf(item.api_tags[i].id) >= 0 && !tagsValid) {
                  tagsValid = true
                }
              }
            }*/
            tagsValid = true;
            return valid && (action.data.tags.length ? tagsValid : true)
          })
        }
      break;
      case types.TEAM_QUERY_CANCELED:
        return {
          ...state,
          query: {
            ...state.query,
            users: state.query.users.filter((item) => {
              return item.id != action.data
            })
          }
        }
      break;
      case types.TEAM_INVITED:
        var queryEl = {
          user: action.data,
          group: []
        };
        return {
          ...state,
          invited: {
            ...state.invited,
            users: [
              ...state.invited.users,
              queryEl,
            ]
          }
        }
      break;
      case types.TEAM_QUERY_ACCEPTED:
      console.warn('TEAM_QUERY_ACCEPTED')
        var queryEl = {
          user: {},
          group: []
        };
        return {
          ...state,
          query: {
            ...state.query,
            users: state.query.users.filter((item) => {
              if (item.id == action.data) {
                queryEl.user = item
              }
              return item.id != action.data
            })
          },
          contacts: {
            ...state.contacts,
            users: [
              ...state.contacts.users,
              queryEl
            ]
          }
        }
      break;
      default:
          return state;
    }
};