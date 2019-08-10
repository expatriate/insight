import React from 'react';
import { createStackNavigator, HeaderBackButton } from 'react-navigation';
import {
  Image,
  View,
  Text,
  Alert
} from 'react-native';
import Svg, {
    Path,
} from 'react-native-svg';
import {
  Colors,
  Gradients
} from '../components/styles/colors.js';
import StartPage from '../components/pages/start-page';
import LoginPage from '../components/pages/login-page';
import MainPage from '../components/pages/main-page';


export default RootNavigator = createStackNavigator({
  Start: {
    screen: StartPage,
    navigationOptions: {
      header: null
    },
  },
  Login: {
    screen: LoginPage,
    navigationOptions: {
      header: null
    }
  },
  Main: {
    screen: MainPage,
    navigationOptions: {
      header: null
    },
  },
});
