import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    Alert,
    Dimensions,
    SectionList,
    RefreshControl,
    StatusBar,
    Animated,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    Picker,
    TextInput,
    FlatList,
    Slider,
} from 'react-native';
import PageHeader from '../../blocks/page-header';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import FormInput from '../../forms/form-input';
import CheckBox from 'react-native-check-box';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';

import { WebView } from 'react-native-webview';

import Svg, {
    Path,
    Polygon,
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateToMyFinance,
  payuRefill
} from '../../../actions';

import { EventRegister } from 'react-native-event-listeners';
import DropdownAlert from 'react-native-dropdownalert';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class PayuPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.leftMenu);
  };

  sucessPayment() {
    this.errors.alertWithType('success', 'Оплата', 'Баланс успешно пополнен. Через 5 секунд вы будете перенаправлены на страницу финансов');

    this.props.payuRefill(
      this.props.user.data.id,
      this.props.finance.order.order_price,
      'RUB',
      this.props.finance.order.status == 'refill');

    setTimeout(() => {
      this.props.navigateToMyFinance();
      EventRegister.emit('FINANCE_RELOAD');
    }, 5000)
  }

  errorPayment(error) {
    this.errors.alertWithType('error', 'Оплата', error);
  }

  render() {

    return (
      <View style={[baseStyles.container, styles.mainContainer]}>
           <WebView
            scalesPageToFit
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            mixedContentMode="always"
            originWhitelist={['*']}
            onError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent;
              this.errorPayment(nativeEvent);
              console.warn('WebView error: ', nativeEvent);
            }}
            onLoadEnd={syntheticEvent => {
              const { nativeEvent } = syntheticEvent;
              this.url = nativeEvent.url;
              if (this.url.indexOf('finish.php') > 0) {
                this.sucessPayment();
              }
              console.warn('URL: ', this.url);
            }}
            source={{
              uri: 'https://secure.payu.ru/order/lu.php',
              method: 'POST',
              body:
                'MERCHANT='+ this.props.finance.order.merchant +
                '&ORDER_REF=' + this.props.finance.order.order_ref +
                '&ORDER_DATE=' + this.props.finance.order.order_date +
                '&ORDER_PNAME[]=' + this.props.finance.order.order_name +
                '&ORDER_PCODE[]=' + this.props.finance.order.order_code +
                '&ORDER_PRICE[]=' + this.props.finance.order.order_price + 
                '&ORDER_QTY[]=' + this.props.finance.order.order_qty +
                '&ORDER_VAT[]=' + this.props.finance.order.order_vat +
                '&PRICES_CURRENCY=' + this.props.finance.order.price_currency +
                '&ORDER_PRICE_TYPE[]=' + this.props.finance.order.order_price_type +
                '&BILL_FNAME=' + this.props.user.data.name +
                '&BILL_LNAME=' + this.props.user.data.surname +
                '&BILL_EMAIL=' + this.props.user.data.email +
                '&BILL_PHONE=' + this.props.user.data.phone +
                '&BILL_COUNTRYCODE=' + this.props.finance.order.countrycode +
                '&LANGUAGE=' + this.props.finance.order.language +
                '&ORDER_HASH=' + this.props.finance.order.hash
            }} />
            {/*(this.props.finance.order.testorder ? '&TESTORDER=TRUE' : '') +*/}
            <DropdownAlert
              closeInterval={5000}
              messageNumOfLines={10}
              titleStyle={baseStyles.alertTitle}
              messageStyle={baseStyles.messageAlertStyle}
              defaultTextContainer={baseStyles.defaultAlertTextContainer}
              imageStyle={baseStyles.imageAlertStyle}
              ref={ref => this.errors = ref} />
      </View>
    );
  }

};



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToMyFinance: navigateToMyFinance,
      payuRefill: (userid, sum, code, update) => payuRefill(userid, sum, code, update)
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      finance: state.finance
    }
  }, mapDispatchToProps
)(PayuPage);