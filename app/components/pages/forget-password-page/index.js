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
    StatusBar,
} from 'react-native';
import SocialLogin from '../../blocks/social-login';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EventRegister } from 'react-native-event-listeners';
import DropdownAlert from 'react-native-dropdownalert';

import { TextInputMask } from 'react-native-masked-text'

import Svg, {
    Polygon,
    Path
} from 'react-native-svg';

import { 
  registration,
  navigateToRegistration,
  navigateToLogin,
  forgot
} from '../../../actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';
import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class ForgetPasswordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loadBtn: false
    }

    this.tryToRegister = this.tryToRegister.bind(this);
    this.goToForgot = this.goToForgot.bind(this);
    this.writing = this.writing.bind(this);
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    this.formErrorListener = EventRegister.addEventListener('ERROR_EVENT', (data) => {
      this.errors.alertWithType('warn', 'Ошибка при востановлении', data);
      this.setState({
        loadBtn: false
      })
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.formErrorListener);
  };


  render() {
    return(
      <KeyboardAwareScrollView contentContainerStyle={baseStyles.container}>
        <LinearGradient colors={['#31a3b7', '#3dccc6']} style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={[styles.container, styles.titleContainer]}>
            <Text style={styles.title}>
              Восстановление пароля
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
            <TouchableHighlight onPress={this.goToForgot} underlayColor="transparent">
              <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                <View style={[buttonsStyles.buttonBig]}>
                  {this.state.loadBtn ?
                    <ActivityIndicator />
                    : <Text style={buttonsStyles.buttonBigText}>Восстановить</Text>
                  }
                </View>
              </LinearGradient>
            </TouchableHighlight>
          </View>
          <View style={[{marginTop: 20}]}>
            <Text style={styles.gologintext} onPress={() => this.props.navigateToLogin()}>
              У меня уже есть аккаунт в системе
            </Text>
          </View>
          <View style={[{marginBottom: 20}]}>
            <Text style={styles.gologintext} onPress={() => this.props.navigateToRegistration()}>
              Я еще не зарегистрирован
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
          email : text
        });
      break;
    }
  };

  goToForgot() {
    let errors = '';
    if (!this.state.email.length) {
      errors = errors.length ? errors + '\n\n' + 'Поле Телефон не может быть пустым' : 'Поле Телефон не может быть пустым';
    }
    if (!errors.length) {
      let data = {};
      data.email = this.state.email.replace(/\D+/g,"");
      this.props.forgot(data);
      this.setState({
        loadBtn: true
      })
    } else {
      EventRegister.emit('ERROR_EVENT', errors);
    }
  };

  tryToRegister() {
    this.props.registration(this.state);
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    registration: (data) => registration(data),
    navigateToLogin: navigateToLogin,
    navigateToRegistration: navigateToRegistration,
    forgot: (data) => forgot(data),
  }, dispatch);
}

export default connect(
  state => {
    return {
      app: state.app,
      user: state.user,
    }
  }, mapDispatchToProps
)(ForgetPasswordPage);