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
import CompaniesPage from '../components/pages/companies-page';
import ProjectsPage from '../components/pages/projects-page';
import DetailPage from '../components/pages/detail-page';
import FilterPage from '../components/pages/filter-page';
import EditPage from '../components/pages/edit-page';


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
  Detail: {
    screen: DetailPage,
    navigationOptions: {
      header: null
    },
  },
  Companies: {
    screen: CompaniesPage,
    navigationOptions: {
      header: null
    },
  },
  Projects: {
    screen: ProjectsPage,
    navigationOptions: {
      header: null
    },
  },
  Filter: {
    screen: FilterPage,
    navigationOptions: {
      header: null
    },
  },
  Edit: {
    screen: EditPage,
    navigationOptions: {
      header: null
    },
  },
});
