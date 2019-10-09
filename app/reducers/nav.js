import { NavigationActions } from 'react-navigation';
import RootNavigator from '../navigators/AppNavigator';
import * as types from '../actionTypes.js';
import {
  Alert
} from 'react-native';

const initialState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams('Start'));
//const initialState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams('Login'));
export default nav = (state = initialState, action) => {
  let nextState;
  switch(action.type) {
    case types.REDIRECT_LOGGED_IN:
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Profile' })
      );
      break;
    case types.REDIRECT_LOGIN:
      // Spectator goes to project first
      //console.warn(action.data)
      if (action.data.status === '5') {
        nextState = RootNavigator.router.getStateForAction(
          NavigationActions.navigate({
            routeName: 'Projects',
            params: {
              companyid: 'SPECTATOR',
            }
          })
        );
      } else {
        nextState = RootNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Companies' })
        );
      }
      /*nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Main' })
      );*/
      break;
    case types.RETURN_LOGIN:
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' })
      );
      break;
    default:
      nextState = RootNavigator.router.getStateForAction(action, state);
    break;
  }
  return nextState || state;
};
