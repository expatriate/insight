import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight,
  Alert,
  KeyboardAvoidingView,
  StatusBar, AsyncStorage
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TextInputMask } from 'react-native-masked-text';
import { EventRegister } from 'react-native-event-listeners';
import Svg, {
    Polygon,
    Path
} from 'react-native-svg';


import {
  login,
} from '../../../actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';
import {
  Colors,
  Gradients
} from '../../styles/colors.js';

class LoginPage extends Component {

  static navigationOptions = {
    headerVisible: false,
    header: null
  };

  constructor(props) {
      super(props);
      this.state = {
        phone: '',
        password: '',
        isSecureTextEntry: true,
      }

      this.tryToLogin = this.tryToLogin.bind(this);
  };

  componentDidMount() {
    this.formErrorListener = EventRegister.addEventListener('ERROR_EVENT', (data) => {
    });

    AsyncStorage.getItem('username', (err, result) => {
      AsyncStorage.removeItem('username')
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.formErrorListener);
  };

  tryToLogin() {
    this.props.login(this.state.phone, this.state.password);
  };

  render() {
    return(
        <View style={[styles.container]}>
          <View style={styles.inputContainer}>
            <TextInputMask
              type={'custom'}
              options={{
              mask: '+7 999 999 99 99'
              }}
              value={this.state.email}
              onChangeText={(text) => this.writing('email', text)}
              style={styles.input}
              placeholder="+7 XXX XXX XX XX"
              placeholderTextColor={Colors.COLOR_BLACK_04}
              textContentType="emailAddress"
            />

          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Пароль из смс"
              value={this.state.password}
              secureTextEntry={this.state.isSecureTextEntry}
              placeholderTextColor={Colors.COLOR_BLACK_04}
              textContentType="password"
              onChangeText={(text) => this.writing('password', text)}
            />
          </View>
          <TouchableHighlight onPress={this.tryToLogin} underlayColor="transparent" style={styles.inputButton_wrapper}>
            <View style={[styles.inputButton]}>
              <Text style={styles.inputText} onPress={() => {this.tryToLogin()}}>Войти</Text>
            </View>
          </TouchableHighlight>
        </View>
      )
  };

  // On user text typing
  writing(type, text){
    switch(type) {
      case 'email':
        this.setState({
          email : text
        });
      break;
      case 'password':
        this.setState({
          password : text
        });
      break;
    }
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    login: (username, password) => login(username, password)
  }, dispatch);
}

export default connect(
  state => {
    return {
      app: state.app,
      user: state.user,
    }
  }, mapDispatchToProps
)(LoginPage);
