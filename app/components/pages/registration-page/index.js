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
    Button,
    KeyboardAvoidingView,
    StatusBar,
    Linking
} from 'react-native';
import SocialLogin from '../../blocks/social-login';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EventRegister } from 'react-native-event-listeners';
import DropdownAlert from 'react-native-dropdownalert';
import Svg, {
    Path,
    Polygon
} from 'react-native-svg';
import CheckBox from 'react-native-check-box';

import { registration, navigateToLogin } from '../../../actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text'


import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';
import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class RegistrationPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password2: '',
      isSecureTextEntry: true,
      code: '',
      codeShow: false,
      privacy: false,
      loadBtn: false
    }

    this.tryToRegister = this.tryToRegister.bind(this);
    this.writing = this.writing.bind(this);
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');

    this.setState({
      email: '',
      password: '',
      password2: '',
    })

    this.formErrorListener = EventRegister.addEventListener('ERROR_EVENT', (data) => {
      this.errors.alertWithType('warn', 'Ошибка при регистрации', data);
      this.setState({
        loadBtn: false
      })
    });


    this.showCodeListener = EventRegister.addEventListener('showCode', (data) => {
      this.setState({
        codeShow: true,
        loadBtn: false
      })
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.formErrorListener);
    EventRegister.removeEventListener(this.showCodeListener);
  };

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={baseStyles.container} keyboardShouldPersistTaps={'handled'}>
        <LinearGradient colors={['#31a3b7', '#3dccc6']} style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={[styles.container, styles.titleContainer]}>
            <Text style={styles.title}>
              Регистрация
            </Text>
          </View>
          <View style={[styles.container]}>
            <View style={formsStyles.inputContainer}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '+7 (999) 999 99 99'
                }}
                value={this.state.email}
                onChangeText={(text) => this.writing('email', text)}
                style={formsStyles.inputText}
                placeholder="+7 (___) ___ __ __"
                placeholderTextColor={Colors.COLOR_WHITE_06}
                textContentType="emailAddress"
              />
            </View>
            <View style={formsStyles.inputContainer}>
              <TextInput
                style={formsStyles.inputText}
                placeholder="Пароль"
                value={this.state.password}
                placeholderTextColor={Colors.COLOR_WHITE_06}
                textContentType="password"
                secureTextEntry={this.state.isSecureTextEntry}
                onChangeText={(text) => this.writing('password', text)}
              />
              <View style={formsStyles.rightInputIcon}>
                <TouchableHighlight onPress={() => {this.setState({isSecureTextEntry: !this.state.isSecureTextEntry})}} underlayColor="transparent">
                  <Svg width={40} height={40}>
                    <Path 
                      fill={this.state.isSecureTextEntry ? Colors.COLOR_LIGHT_BLUE : Colors.COLOR_DARK_BLUE} 
                      d="M32.729,12.788c-2.996-2.35-7.636-5.152-12.73-5.152c-5.071,0-9.722,2.836-12.73,5.215c-2.976,2.354-5.686,5.41-5.686,6.412
                        c0,1.142,2.605,4.136,5.688,6.536c2.442,1.901,7.342,5.091,12.728,5.091c5.389,0,10.288-3.186,12.729-5.084
                        c3.083-2.397,5.688-5.395,5.688-6.543C38.416,18.191,35.758,15.165,32.729,12.788z M19.999,26.879c-4.204,0-7.614-3.41-7.614-7.615
                        c0-4.206,3.41-7.615,7.614-7.615c4.205,0,7.615,3.409,7.615,7.615C27.614,23.469,24.204,26.879,19.999,26.879z"/>
                  </Svg>
                </TouchableHighlight>
              </View>
            </View>
            <View style={formsStyles.inputContainer}>
              <TextInput
                style={formsStyles.inputText}
                placeholder="Повторите пароль"
                value={this.state.password2}
                placeholderTextColor={Colors.COLOR_WHITE_06}
                textContentType="password"
                secureTextEntry={this.state.isSecureTextEntry}
                onChangeText={(text) => this.writing('password2', text)}
              />
            </View>
            <View style={[formsStyles.checkboxContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
              <CheckBox 
                onClick={()=>{
                this.setState({
                    privacy:!this.state.privacy
                  })
                }}
                checkedImage={
                  <Svg width={24} height={24}>
                    <Path
                      fill={Colors.COLOR_WHITE}
                      d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z"
                    />
                    <Path
                      fill={Colors.COLOR_DARK_GREEN}
                      d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z
                        M9.625,19.5L21.5,6.542l-2.291-2.083L9.417,15.75l-4.75-5.333l-1.792,2.004L9.625,19.5z"
                    />
                  </Svg>
                }
                unCheckedImage={
                  <Svg width={24} height={24}>
                    <Path
                      fill={Colors.COLOR_DARK_GREEN}
                      d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z"
                    />
                  </Svg>
                }
                rightTextStyle={formsStyles.checkboxText}
                isChecked={this.state.privacy}
                rightText={' '}
              />
              <View>
                <Text style={[formsStyles.checkboxText, {paddingRight: 5}]}>
                  Я принимаю{' '}
                  <Text
                    onPress={() => {
                      Linking.openURL('http://hipe.dgprod.ru/rules.pdf').catch(err => console.error('An error occurred', err));
                    }}
                  >
                    <Text style={[formsStyles.checkboxText, {textDecorationLine: "underline", textDecorationStyle: "solid", textDecorationColor: Colors.COLOR_WHITE}]}>
                      пользовательское соглашение
                    </Text>
                  </Text>
                </Text>
              </View>
            </View>
            { this.state.codeShow ?
              <View style={formsStyles.inputContainer}>
                <TextInput
                  style={formsStyles.inputText}
                  placeholder="Код из смс"
                  value={this.state.code}
                  placeholderTextColor={Colors.COLOR_WHITE_06}
                  textContentType="code"
                  secureTextEntry={this.state.isSecureTextEntry}
                  onChangeText={(text) => this.writing('code', text)}
                />
              </View>
              : undefined
            }
            <TouchableHighlight onPress={() => {this.tryToRegister()}} underlayColor="transparent">
              <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                <View>
                  <View style={[buttonsStyles.buttonBig]}>
                    {this.state.loadBtn ?
                      <ActivityIndicator />
                      : <Text style={buttonsStyles.buttonBigText}>Зарегистрироваться</Text>}
                  </View>
                </View>
              </LinearGradient>
            </TouchableHighlight>
          </View>
          <View style={{paddingVertical: 20}}>
            <Text style={styles.gologintext} onPress={() => this.props.navigateToLogin()}>
              У меня уже есть аккаунт в системе
            </Text>
          </View>
          {/*<View style={styles.bottom}>*/}
            {/*<View style={[styles.container]}>*/}
              {/*<Text style={styles.socialText}>*/}
                {/*Войти, используя аккаунт в соцсети*/}
              {/*</Text>*/}
              {/*<SocialLogin />*/}
            {/*</View>*/}
          {/*</View>*/}
        </LinearGradient>
        <DropdownAlert
          closeInterval={5000}
          messageNumOfLines={10}
          titleStyle={baseStyles.alertTitle}
          messageStyle={baseStyles.messageAlertStyle}
          defaultTextContainer={baseStyles.defaultAlertTextContainer}
          imageStyle={baseStyles.imageAlertStyle}
          ref={ref => this.errors = ref} />
      </KeyboardAwareScrollView>
    );
  };

  // On user text typing
  writing(type, text){
    switch(type) {
      case 'email':
        this.setState({
          email: text
        });
      break;
      case 'password':
        this.setState({
          password: text
        });
      break;
      case 'password2':
        this.setState({
          password2: text
        });
      break;
      case 'code':
        this.setState({
          code: text
        });
      break;
    }
  };

  tryToRegister() {
    let errors = '';
    if (!this.state.email.length) {
      errors = errors.length ? errors + '\n\n' + 'Поле Email не может быть пустым' : 'Поле Email не может быть пустым';
    }
    if (!this.state.password.length) {
      errors = errors.length ? errors + '\n\n' + 'Поле Пароль не может быть пустым' : 'Поле Пароль не может быть пустым';
    }
    if (!this.state.password2.length) {
      errors = errors.length ? errors + '\n\n' + 'Поле с повтором пароля не может быть пустым' : 'Поле с повтором пароля не может быть пустым';
    }
    if (this.state.password.length && this.state.password2.length && this.state.password2 !== this.state.password) {
      errors = errors.length ? errors + '\n\n' + 'Введеные пароли не совпадают' : 'Введеные пароли не совпадают';
    }
    if (!this.state.privacy) {
      errors = errors.length ? errors + '\n\n' + 'Необходимо принять пользовательское соглашение' : 'Необходимо принять пользовательское соглашение';
    }
    if (!errors.length) {
      let data = {};
      data.email = this.state.email.replace(/\D+/g,"");
      data.password = this.state.password;
      data.code = this.state.code;
      this.props.registration(data);
      this.setState({
        loadBtn: true
      })
    } else {
      EventRegister.emit('ERROR_EVENT', errors);
    }
  };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      registration: (data) => registration(data),
      navigateToLogin: navigateToLogin,
    }, dispatch);
}

export default connect(
  state => {
    return {
      app: state.app,
      user: state.user,
    }
  }, mapDispatchToProps
)(RegistrationPage);