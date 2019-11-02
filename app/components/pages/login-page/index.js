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
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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
    this.formErrorListener = EventRegister.addEventListener('ERROR_LOGIN', data => {
      let errors = '';
      if (Array.isArray(data)) {
        data.map(item => {
          errors += item.value.string+ '\n';
          return true;
        })
      } else {
        if (data.message) {
          errors = data.message
        } else if (data.value && data.value.string) {
          errors = data.value.string
        } else {
          errors = 'Непредвиденная ошибка. Попробуйте повторить позднее'
        }
      }

      if (errors) {
        this.setState({
          errors: errors
        });
      }
    });

    this.loginListener = EventRegister.addEventListener('LOGIN_RECIEVED', data => {
      this.setState({
        loading: false
      })
    })

    AsyncStorage.getItem('username', (err, result) => {
      AsyncStorage.removeItem('username')
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.formErrorListener);
    EventRegister.removeEventListener(this.loginListener);
  };

  tryToLogin() {
    if (!this.state.loading) {
      this.props.login(this.state.phone, this.state.password);
      this.setState({
        loading: true,
        errors: ''
      })
    }
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
              value={this.state.phone}
              onChangeText={(text) => this.writing('phone', text)}
              onFocus={_ => {this.setState({errors: ''})}}
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
              onFocus={_ => {this.setState({errors: ''})}}
            />
          </View>
          <TouchableOpacity onPress={this.tryToLogin} style={styles.inputButton_wrapper}>
            <View style={[styles.inputButton]}>
              {
                this.state.loading ?
                <ActivityIndicator />
                :
                <Text style={styles.inputText} onPress={() => {this.tryToLogin()}}>Войти</Text>
              }
            </View>
          </TouchableOpacity>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText} numberOfLines={5}>
              {this.state.errors}
            </Text>
          </View>
        </View>
      )
  };

  // On user text typing
  writing(type, text){
    switch(type) {
      case 'phone':
        this.setState({
          phone : text
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
    login: (username, password, checkStorage) => login(username, password, checkStorage)
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
