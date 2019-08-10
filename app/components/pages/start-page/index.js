import React, { Component } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    AsyncStorage
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  login,
  navigateToMainPage,
  navigateToLogin
} from '../../../actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import baseStyles from '../../styles/base.js';

class StartPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          // get at each store's key/value so you can work with it
          let key = store[i][0];
          let value = store[i][1];
          this.state[key] = value
        });
      });
    });
    setTimeout(() => {
      if(this.state.username.length && this.state.password.length){
        let username = this.state.username;
        username = username.replace(/"/g, '')
        let password = this.state.password;
        password = password.replace(/"/g, '')
        this.props.login(username, password)
      }else{
        this.props.navigateToMainPage()
      }
    }, 500);


    setTimeout(() => {
      this.props.navigateToLogin()
    }, 2000)
  };

  componentWillUnmount() {
  };

  render() {
    return (
      <LinearGradient style={baseStyles.contentAtCenter} colors={['#31a3b7', '#3dccc6']}>
        <ActivityIndicator />
      </LinearGradient>
    );
  };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      login: (username, password) => login(username, password),
      navigateToMainPage: navigateToMainPage,
      navigateToLogin: navigateToLogin
    }, dispatch);
}

export default connect(
  state => {
    return {
      app: state.app,
      user: state.user,
    }
  }, mapDispatchToProps
)(StartPage);
