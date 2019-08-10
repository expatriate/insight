import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Alert,
    ScrollView,
    Slider,
    StatusBar,
    Picker,
} from 'react-native';

import { WebView } from 'react-native-webview';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

// import PayuMoney from 'react-native-payumoney';

import { EventRegister } from 'react-native-event-listeners';

import Svg, {
    Path,
    Circle,
    Polygon,
    Defs,
    Stop,
    LinearGradient as LinearGradientSvg
} from 'react-native-svg';

import LinearGradient from 'react-native-linear-gradient';

import FormInput from '../../forms/form-input';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients,
} from '../../styles/colors.js';

import { 
  buyPlan,
  payuGetHash,
  navigateToPayu
} from '../../../actions';

class BuyPlanModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
          planVariant: 'price',
          planMulty: 0,
        }

        this.applyBtn = this.applyBtn.bind(this);
    }

    componentDidMount() {
      StatusBar.setHidden(true);
      this.nofunds = EventRegister.addEventListener('FINANCE_BUYPLAN_NOMONEY', () => {
        Alert.alert('Ошибка при смене тарифного плана', 'Не достаточно средств, Вам необходимо пополнить баланс')
      });

      this.step1 = EventRegister.addEventListener('FINANCE_BUYPLAN_HASHRECIEVED', () => {

        this.props.close();
        this.props.navigateToPayu();
      });
    }

    componentWillUnmount() {
      StatusBar.setHidden(false);
      EventRegister.removeEventListener(this.nofunds);
      EventRegister.removeEventListener(this.step1);
    }

    applyBtn() {

      this.props.payuGetHash({
        ordername: 'Внесение средств на счет',
        orderprice: this.props.data ? this.props.data[this.state.planVariant] * (this.state.planMulty ? this.state.planMulty == 1 ? 6 : 12 : 1) : 0,
        orderq: 1,
        test: false,
        name: this.props.user.name,
        surname: this.props.user.surname,
        email: this.props.user.email,
        phone: this.props.user.phone,
        status: 'upgrade'
      });
    }

    render() {

      const mode = this.props.data ? this.props.data.title.toLowerCase() : null;
      const moneyToPay = this.props.data ? this.props.data[this.state.planVariant] * (this.state.planMulty ? this.state.planMulty == 1 ? 6 : 12 : 1) : 0;
      let balance = this.props.finance.accounts.length ? {item:{value: this.props.finance.accounts[0].value}} : {item:{value: 0}}

      return (
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.visible}
            onRequestClose={() => {
              this.props.close();
            }}>
            <View style={styles.modalMain_centered}>
              <View style={[styles.mainContent]}>
                <View style={[{flexDirection: 'row'}, mode == 'pro' ? styles.proMode : styles.businessMode]}>
                  <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                    <Text style={[baseStyles.bigText, {color: Colors.COLOR_WHITE, flex: 1}]}>
                      Вы подключаете{'\n'}тарифный план {mode == 'pro' ? 'Pro' : 'Business'}
                    </Text>
                    <View style={styles.iconWrap}>
                      {
                        mode == 'pro' ?
                          <Svg width={56} height={25} viewBox="0 0 26 12.587">
                            <Path 
                              fill="#ABF3F0" 
                              d="M12.098,5.842c0.498,0.249,0.502,0.651,0,0.902l-9.302,4.65C1.804,11.891,1,11.391,1,10.285
                              V2.302c0-1.109,0.806-1.606,1.796-1.11L12.098,5.842z"/>
                            <Path 
                              fill="#3DCCC6" 
                              d="M2.065,12.586C0.849,12.586,0,11.64,0,10.285V2.302C0,0.947,0.849,0,2.064,0
                                c0.388,0,0.785,0.1,1.18,0.298l9.301,4.65c0.589,0.295,0.928,0.785,0.928,1.346c0,0.56-0.338,1.051-0.927,1.346l-9.302,4.65
                                C2.849,12.487,2.453,12.586,2.065,12.586z M2.064,2C2.046,2.006,2,2.103,2,2.302v7.982c0,0.199,0.047,0.296,0.063,0.314l0.002-0.013
                                c0.034,0,0.128-0.008,0.284-0.086l8.415-4.207L2.349,2.086C2.193,2.008,2.098,2,2.064,2z"/>
                            <Path 
                              fill="#ABF3F0" 
                              d="M13.902,6.745c-0.499-0.249-0.503-0.651,0-0.902l9.301-4.65C24.195,0.696,25,1.195,25,2.302v7.983c0,1.108-0.807,1.605-1.797,1.109L13.902,6.745z"/>
                            <Path 
                              fill="#3DCCC6" 
                              d="M23.936,12.587c-0.389,0-0.785-0.101-1.181-0.298l-9.3-4.65c-0.59-0.295-0.928-0.785-0.928-1.346
                                c0-0.56,0.338-1.051,0.928-1.346l9.301-4.65C23.15,0.1,23.547,0,23.935,0C25.15,0,26,0.947,26,2.302v7.983
                                C26,11.641,25.151,12.587,23.936,12.587z M15.236,6.293L23.65,10.5c0.232,0.116,0.309,0.085,0.31,0.085
                                c-0.007-0.005,0.04-0.102,0.04-0.3V2.302c0-0.199-0.047-0.296-0.063-0.314C23.901,2,23.806,2.008,23.65,2.086L15.236,6.293z"/>
                            <Circle 
                              fill="#ABF3F0" 
                              cx="13" 
                              cy="6.293" 
                              r="3"/>
                            <Path 
                              fill="#3DCCC6" 
                              d="M13,9.793c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S14.93,9.793,13,9.793z
                               M13,3.793c-1.378,0-2.5,1.122-2.5,2.5c0,1.379,1.122,2.5,2.5,2.5c1.379,0,2.5-1.121,2.5-2.5C15.5,4.915,14.379,3.793,13,3.793z"/>
                          </Svg>
                        :
                          <Svg width={16} height={48} viewBox="0 0 8 24">
                            <Path 
                              fill="#F9EED3" 
                              d="M4,7L1,1h6L4,7z M4,23l-3-6L4,7l3,10L4,23z"/>
                            <Path 
                              fill="#FFFFFF" 
                              d="M4,8C3.621,8,3.275,7.786,3.105,7.447l-3-6c-0.155-0.31-0.138-0.678,0.044-0.973C0.332,0.18,0.653,0,1,0h6
                                c0.347,0,0.668,0.18,0.851,0.474C8.033,0.769,8.05,1.137,7.895,1.447l-3,6C4.725,7.786,4.379,8,4,8z M2.618,2L4,4.764L5.382,2H2.618
                                z M4,24c-0.379,0-0.725-0.214-0.895-0.553l-3-6c-0.114-0.228-0.137-0.49-0.063-0.734l3-10C3.169,6.29,3.559,6,4,6
                                s0.831,0.29,0.958,0.713l3,10c0.073,0.244,0.051,0.507-0.063,0.734l-3,6C4.725,23.786,4.379,24,4,24z M2.072,16.907L4,20.764
                                l1.928-3.856L4,10.48L2.072,16.907z"/>
                          </Svg>
                      }
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.close();
                    }}>
                  <Svg width={16} height={16} viewBox="0 0 14 14">
                    <Polygon 
                      fill={Colors.COLOR_WHITE} 
                      points="14,1.4 12.6,0 7,5.6 1.4,0 0,1.4 5.6,7 0,12.6 1.4,14 7,8.4 12.6,14 14,12.6 8.4,7 "/>
                  </Svg>
                  </TouchableOpacity>
                </View>
                <View style={styles.content}>
                  <View style={[formsStyles.pickerWrap]}>
                    <Picker
                      selectedValue={this.state.planVariant}
                      style={formsStyles.picker}
                      itemStyle={formsStyles.picker}
                      onValueChange={(itemValue, itemIndex) => {this.setState({planVariant: itemValue, planMulty: itemIndex})}}>
                      <Picker.Item label="1 месяц" value={'price'} />
                      <Picker.Item label="6 месяцев" value={'price_6m'} />
                      <Picker.Item label="12 месяцев" value={'price_12m'} />
                    </Picker>
                  </View>
                  <View style={styles.planVariant}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                      <Text style={[styles.title, {fontWeight: 'bold'}]}>
                        { this.props.data ? this.props.data[this.state.planVariant] : '' + ' Р ' }
                      </Text>
                      <Text style={styles.title}>
                        / мес
                      </Text>
                    </View>
                    <Text style={[styles.subTitle, {marginTop: 20, color: Colors.COLOR_LIGHT_GRAY}]}>
                      сумма к оплате
                    </Text>
                    <Text style={[styles.subTitle, {color: Colors.COLOR_LIGHT_GRAY}]}>
                       { moneyToPay } Р
                    </Text>
                  </View>
                  {
                    balance.item.value > moneyToPay ?
                    <View>
                      <Text style={[styles.subTitle, {marginBottom: 20, textAlign: 'center'}]}>
                        Для подключения тарифного плана, на вашем счету должно быть достаточное количество средств
                      </Text>
                      <TouchableOpacity onPress={() => this.applyBtn()}>
                        <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                          <View>
                            <View style={[buttonsStyles.buttonBig]}>
                              <Text style={buttonsStyles.buttonBigText}>Пополнить счет</Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity onPress={() => this.applyBtn()}>
                      <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                        <View>
                          <View style={[buttonsStyles.buttonBig]}>
                            <Text style={buttonsStyles.buttonBigText}>Подключить план</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </View>
          </Modal>
      );
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      buyPlan: (planid, months) => buyPlan(planid, months),
      payuGetHash: (payObject) => payuGetHash(payObject),
      navigateToPayu: navigateToPayu
    }, dispatch);
}

export default connect(
  state => {
    return {
      user: state.user,
      finance: state.finance,
      app: state.app
    }
  }, mapDispatchToProps
)(BuyPlanModal);