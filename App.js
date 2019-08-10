import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from "./app/reducers/index.js";
import axios from 'axios';
import RootNavigator from './app/navigators/AppNavigator';
import {
  StatusBar,
  BackHandler,
} from 'react-native';
import {
  NavigationActions,
  createStackNavigator,
  HeaderBackButton
} from "react-navigation";
//import Geocoder from 'react-native-geocoding-simple';
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';
//axios.defaults.baseURL = 'http://api.myteam.pro/v1/';

const navReducer = createNavigationReducer(RootNavigator);
const appReducer = combineReducers({
  nav: navReducer,
  ...reducers
});

const middleware = createReactNavigationReduxMiddleware(
  state => state.nav
);

const App = createReduxContainer(RootNavigator)
const mapStateToProps = state => ({
  state: state.nav
});
const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(
  appReducer,
  applyMiddleware(thunk, middleware)
);

export default class Root extends Component {

  componentDidMount() {

    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const state = store.getState();
    const nav = state.nav;
    if (nav.index === 0) {
      return false;
    }
    store.dispatch(NavigationActions.back());
    return true;
  };

  render() {
    return (
      <Provider store={store}>
       <AppWithNavigationState />
      </Provider>
    );
  }
}
