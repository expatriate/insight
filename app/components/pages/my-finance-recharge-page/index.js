import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import PageHeader from '../../blocks/page-header';
import FormInput from '../../forms/form-input';
import CheckBox from 'react-native-check-box';
import LinearGradient from 'react-native-linear-gradient';


import Svg, {
    Path,
    Polygon,
    Rect
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateBack,
  navigateToPayu,
  payuGetHash,
} from '../../../actions';

import { EventRegister } from 'react-native-event-listeners';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class myFinanceRechargePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: null
    }
  }

  componentDidMount() {
    this.step1 = EventRegister.addEventListener('FINANCE_BUYPLAN_HASHRECIEVED', () => {
      this.props.navigateToPayu();
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.step1);
  };

  onRecharge() {
    this.props.payuGetHash({
      ordername: 'Внесение средств на счет',
      orderprice: this.state.amount,
      orderq: 1,
      test: false,
      name: this.props.user.name,
      surname: this.props.user.surname,
      email: this.props.user.email,
      phone: this.props.user.phone,
      status: 'refill'
    });
  }

  render() {

    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{backgroundColor: '#3dccc6'}} style={{backgroundColor: '#3dccc6'}}>
        <LinearGradient colors={['#31a3b7', '#3dccc6']}>
          <View>
            <PageHeader 
              title={'Мои финансы'} 
              back={true}
              onBack={this.props.navigateBack}
              />
            <View style={styles.container}>
              <View style={styles.wrapper}>
                <Text style={styles.title}>
                  Пополнение счета
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity style={styles.btnContainer}>
                    <Svg width={100} height={60} viewBox="0 0 60.179 30.011">
                      <Path
                        fill="#BAD000"
                        d="M56.473,10.583c-0.004,0.463-0.287,0.736-0.75,0.742c-0.596,0.005-1.193,0-1.791-0.001
                          c0,0,0.047,4.961-0.018,7.442c-0.075,2.999-1.674,5.038-4.563,5.836c-2.441,0.675-4.911,0.671-7.325-0.149
                          c-2.456-0.834-3.806-2.596-4.081-5.179c-0.037-0.368-0.049-0.736-0.049-1.106c0-2.955-0.002-5.911,0-8.866
                          c0-1.333,0.396-1.747,1.725-1.806c0.72-0.032,1.439-0.061,2.152,0.073c0.663,0.124,1,0.502,1.063,1.179
                          c0.023,0.255,0.035,0.512,0.037,0.766c0.001,2.965,0,5.931,0.001,8.894c0,0.837,0.235,1.557,1.03,1.975
                          c0.391,0.205,0.816,0.295,1.254,0.336c0.683,0.063,1.359,0.059,2.033-0.08c1.141-0.232,1.734-0.928,1.777-2.094
                          c0.002-0.086,0-0.172,0-0.256c0.004-3.061,0.008-6.12,0.014-9.179c0-0.17,0.017-0.342,0.043-0.509
                          c0.092-0.584,0.445-0.917,1.018-1.034c0.324-0.066,0.654-0.07,0.981-0.086v0.001h0.422c0,0-0.001-0.4,0.012-0.523
                          c0.044-0.412,0.288-0.68,0.695-0.686c1.202-0.017,2.405-0.018,3.608-0.002c0.439,0.006,0.709,0.312,0.711,0.761
                          C56.479,8.215,56.48,9.399,56.473,10.583z M0,16.884C0,14.763,0,12.641,0.001,10.52c0-0.398,0.019-0.795,0.113-1.184
                          C0.381,8.237,1.16,7.564,2.36,7.518c1.977-0.076,3.958-0.14,5.931,0.054c1.263,0.125,2.417,0.554,3.277,1.555
                          c0.618,0.72,0.917,1.581,1.047,2.505c0.174,1.23,0.156,2.454-0.185,3.659c-0.477,1.685-1.625,2.655-3.289,3.068
                          c-0.748,0.186-1.511,0.244-2.28,0.244C5.47,18.6,4.077,18.608,2.685,18.594c-0.256-0.002-0.314,0.072-0.312,0.318
                          c0.011,1.648,0.004,3.297,0.005,4.944c0,0.24-0.018,0.479-0.168,0.675c-0.316,0.416-1.695,0.423-2.024,0.016
                          c-0.091-0.113-0.145-0.244-0.154-0.391c-0.013-0.207-0.03-0.416-0.03-0.623C0,21.317,0,19.101,0,16.884z M2.379,13.459
                          c0,0.89,0.007,1.78-0.005,2.671c-0.003,0.2,0.051,0.249,0.249,0.248c1.468-0.008,2.936-0.002,4.404-0.006
                          c0.398-0.001,0.794-0.041,1.187-0.112c1.111-0.202,1.805-0.825,1.995-1.824c0.169-0.891,0.181-1.79-0.002-2.68
                          C10,10.753,9.414,10.105,8.395,9.877C7.986,9.786,7.572,9.74,7.156,9.737c-1.24-0.009-2.481-0.005-3.722-0.001
                          c-0.141,0-0.284,0.017-0.422,0.046c-0.33,0.07-0.534,0.275-0.587,0.611c-0.028,0.177-0.042,0.358-0.043,0.537
                          C2.377,11.773,2.379,12.616,2.379,13.459z M27.934,30.008c-0.626,0.014-0.866-0.176-1.006-0.793
                          c-0.042-0.184-0.087-0.369-0.105-0.557c-0.04-0.412,0.12-0.621,0.53-0.696c0.363-0.066,0.734-0.093,1.092-0.179
                          c0.842-0.203,1.442-0.721,1.833-1.488c0.173-0.338,0.317-0.686,0.438-1.045c0.031-0.091,0.13-0.199,0.046-0.285
                          c-0.065-0.066-0.179,0.001-0.269,0.018c-0.452,0.085-0.904,0.087-1.355,0.006c-0.942-0.172-1.541-0.762-1.918-1.606
                          c-0.399-0.894-0.597-1.851-0.855-2.788c-0.714-2.587-1.416-5.179-2.119-7.77c-0.245-0.902-0.041-1.164,0.894-1.161
                          c0.076,0,0.152,0,0.228,0.003c0.678,0.026,0.975,0.254,1.159,0.911c0.234,0.837,0.457,1.677,0.686,2.516
                          c0.606,2.225,1.213,4.448,1.821,6.673c0.021,0.082,0.053,0.162,0.08,0.242c0.297,0.884,0.678,1.074,1.689,0.949
                          c0.373-0.046,0.586-0.324,0.725-0.653c0.227-0.534,0.319-1.106,0.455-1.665c0.648-2.672,1.289-5.347,1.934-8.02
                          c0.168-0.697,0.461-0.935,1.172-0.954c0.236-0.006,0.473-0.015,0.708,0.034c0.387,0.081,0.526,0.253,0.519,0.651
                          c-0.006,0.239-0.075,0.466-0.133,0.695c-0.997,3.994-1.994,7.989-3,11.981c-0.268,1.06-0.644,2.078-1.275,2.984
                          c-0.801,1.15-1.924,1.757-3.292,1.944c-0.15,0.021-0.301,0.039-0.452,0.053C28.085,30.014,28.009,30.008,27.934,30.008z
                           M23.345,18.196c0,0.994,0.024,1.988-0.005,2.982c-0.055,1.805-0.952,3.002-2.687,3.5c-1.76,0.506-3.552,0.574-5.319,0.038
                          c-1.935-0.587-2.78-2.066-2.697-4c0.042-1.001,0.319-1.901,1.096-2.587c0.591-0.521,1.307-0.787,2.064-0.951
                          c0.714-0.155,1.44-0.21,2.17-0.211c0.928-0.001,1.856-0.01,2.784,0.006c0.257,0.004,0.326-0.076,0.311-0.322
                          c-0.03-0.491,0.018-0.983-0.036-1.475c-0.083-0.753-0.479-1.261-1.18-1.523c-0.796-0.298-1.631-0.313-2.465-0.285
                          c-0.852,0.029-1.698,0.117-2.533,0.302c-0.604,0.134-0.897-0.101-0.935-0.722c-0.06-1,0.106-1.252,1.097-1.426
                          c1.804-0.315,3.615-0.388,5.404,0.092c1.228,0.329,2.202,0.996,2.672,2.243c0.192,0.51,0.271,1.04,0.27,1.584
                          c-0.002,0.918,0,1.837,0,2.755C23.352,18.196,23.348,18.196,23.345,18.196z M21.058,19.972c0-0.274-0.015-0.55,0.004-0.823
                          c0.016-0.225-0.055-0.292-0.283-0.289c-1.003,0.012-2.007,0.004-3.011,0.006c-0.389,0-0.774,0.043-1.155,0.119
                          c-1.067,0.217-1.55,0.717-1.664,1.718c-0.114,1.005,0.323,1.805,1.234,2.078c1.256,0.376,2.528,0.323,3.764-0.115
                          c0.656-0.233,0.987-0.759,1.071-1.445C21.069,20.805,21.055,20.388,21.058,19.972z M60.179,4.425c0,0.426,0.002,0.851-0.001,1.277
                          c-0.002,0.382-0.192,0.589-0.565,0.591c-0.87,0.003-1.74,0.001-2.61-0.007c-0.325-0.003-0.539-0.2-0.544-0.529
                          c-0.012-0.898-0.013-1.797,0.003-2.695c0.006-0.349,0.219-0.53,0.57-0.532c0.851-0.005,1.701-0.005,2.553,0
                          c0.401,0.002,0.592,0.196,0.594,0.591C60.181,3.555,60.179,3.99,60.179,4.425z M53.936,1.244c0-0.284-0.005-0.568,0-0.852
                          c0.006-0.277,0.122-0.39,0.4-0.391C54.914,0,55.49,0,56.068,0.002c0.275,0.001,0.4,0.116,0.403,0.393
                          c0.007,0.577,0.007,1.154,0.001,1.731c-0.003,0.278-0.141,0.419-0.422,0.423c-0.568,0.007-1.136,0.006-1.703-0.001
                          c-0.281-0.003-0.412-0.142-0.416-0.424c-0.005-0.293-0.002-0.587-0.002-0.88C53.932,1.244,53.934,1.244,53.936,1.244z"
                          />
                      <Path
                        fill="#AEB702"
                        d="M53.936,11.321c-0.549-0.002-1.1-0.028-1.647,0c-0.479,0.024-0.853-0.286-0.837-0.849
                          c0.023-0.919,0.018-2.073,0.004-2.991c0,0,0.132,0.004,0.201,0.007c0.435,0.017,0.869,0.005,1.297,0.118
                          c0.512,0.134,0.817,0.441,0.918,0.965c0.092,0.48,0.043,0.963,0.054,1.445c0.009,0.436,0.006,0.871,0.009,1.307
                          C53.933,11.323,53.936,11.321,53.936,11.321z"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <Text style={styles.subtitle}>
                  Сумма
                </Text>
                <View style={styles.lineContainer}>
                  <FormInput 
                    writing={(text) => {this.writing('amount', text)}} 
                    placeholder={'Сумма'} 
                    withoutclear={true}
                    keyboardType={'numeric'}
                    value={this.state.amount}
                    style={{flex: 1, marginBottom: 0}}
                  />
                  <Text style={styles.inputLabel}>
                    Рублей
                  </Text>
                </View>
              </View>
              <View style={styles.wrapper_bottom}>
                <View style={[formsStyles.checkboxContainer__normal, {flexDirection: 'row', alignItems: 'center', marginVertical: 20}]}>
                  <CheckBox 
                    onClick={ function() {
                      this.setState({
                        applyRules: !this.state.applyRules
                      })
                    }.bind(this)}
                    checkedImage={
                      <Svg width={36} height={36} viewBox="0 0 50 50">
                        <Rect stroke-width="1" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                        <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                      </Svg>
                    }
                    unCheckedImage={
                      <Svg width={36} height={36} viewBox="0 0 50 50">
                        <Rect stroke-width="1" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                      </Svg>
                    }
                    isChecked={this.state.applyRules}
                  />
                  <Text style={styles.inputLabel}>
                    Я ознакомлен с правилами
                  </Text>
                </View>

                
                <TouchableOpacity underlayColor="transparent" onPress={() => {this.onRecharge()}}>
                  <LinearGradient 
                    style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} 
                    colors={this.state.amount && this.state.applyRules ? [Gradients.BUTTON_BLUE[0], Gradients.BUTTON_BLUE[1]] : [Gradients.BUTTON_INACTIVE[0], Gradients.BUTTON_INACTIVE[1]]}>
                    <View>
                      <View style={[buttonsStyles.buttonBig]}>
                        <Text style={buttonsStyles.buttonBigText}>Пополнить</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    );
  }

  // On user text typing
  writing(type, text){
    switch(type) {
      case 'amount':
        this.setState({
          amount: text
        });
      break;
    }
  };
};



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateBack: navigateBack,
      navigateToPayu: navigateToPayu,
      payuGetHash: (payObj) => payuGetHash(payObj),
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
    }
  }, mapDispatchToProps
)(myFinanceRechargePage);