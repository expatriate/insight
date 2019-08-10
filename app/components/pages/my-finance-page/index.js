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
    Slider
} from 'react-native';
import PageHeader from '../../blocks/page-header';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import FormInput from '../../forms/form-input';
import CheckBox from 'react-native-check-box';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import { NavigationEvents } from 'react-navigation';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';

import Svg, {
    Path,
    Polygon,
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateBack,
  navigateToMyFinanceRecharge,
  refreshFinanceData,
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

class MyFinancePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      slideAnimation: new Animated.Value(22),
      refreshing: false,
      bonuses: {
        text: 'Нет записей'
      },
      refresh: false
    }
  }

  componentDidMount() {
    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });

    this.reload = EventRegister.addEventListener('FINANCE_RELOAD', () => {
      this.refreshing()
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.leftMenu);
    EventRegister.removeEventListener(this.reload);
  };

  updateMenuState(isOpen) {
    this.setState({
      isOpen
    });
  }

  refreshing() {
    this.props.refreshFinanceData(this.props.finance.accounts.map((acc) => { return acc.id}));
    this.setState({
      refresh: !this.state.refresh
    });
  }

  render() {

    const rublesData = [];
    const bonusesData = [];
    const specialBonusesData = [];

    const menu = <LeftMenu user={this.props.user} />;

    const animationFunction = (prop, value) => {
       return Animated.spring(prop, {
          toValue: value,
          friction: 10,
          tension: 10
       });
    };

    const tabs = this.props.finance.loaded ? <ScrollableTabView
      keyboardShouldPersistTaps={'handled'}
      initialPage={this.state.initialTab}
      ref={(tabView) => { this.tabView = tabView; }}
      renderTabBar={() => 
        <ScrollableTabBar
          style={{height: 94, paddingTop: 10, paddingBottom: 10, backgroundColor: Colors.COLOR_LIGHT_BLUE}}
          underlineStyle={{height: 0}}
          renderTab = {
            function (name, page, isTabActive, onPressHandler, onLayoutHandler) {
              return(<TouchableOpacity
                key={`${name}_${page}`}
                underlayColor="transparent"
                onPress={() => onPressHandler(page)}
                onLayout={onLayoutHandler}
                >
                <View style={[isTabActive ? styles.tabHeadb_active : styles.tabHeadb]}>
                  <Text style={[styles.tabHead, isTabActive ? styles.tabHead_active : '']}>
                    { name }
                  </Text>
                  <Text style={[isTabActive ? styles.tabHeadc_active : styles.tabHeadc]}>
                    { 
                      `${this.props.finance.accounts[page].value} ${this.props.finance.accounts[page].symbol}` 
                      || 
                      undefined
                    }
                  </Text>
                </View>
              </TouchableOpacity>)
            }.bind(this)
            }
          />
        }>
      {
        this.props.finance.accounts.map((account, index) => {
          return <View key={'finance__tab_' + index} tabLabel={`${account.title}`} style={styles.itemsContainer}>

          <FlatList
            initialNumToRender={2}
            data={account.history}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={function(item, index) {
              return item.id + '_all'
            }}
            extraData={this.state.refresh}
            style={{paddingTop: 20}}
            ListEmptyComponent={function() {
              return(
                <View style={styles.nullDatacontainer}>
                  <Text style={styles.nullDatacontainer_text}>
                    { this.state.bonuses.text }
                  </Text>
              </View>)
            }.bind(this)}
            renderItem={function({item, separators}) {
              return(
              <View style={{flexDirection: 'row', marginHorizontal: 10, padding: 10, borderBottomWidth: 1, borderColor: Colors.COLOR_LIGHT_GRAY}}>
                <View>
                  <Image 
                    style={{width: 50, height: 50, marginRight: 10, borderRadius: 50}} 
                    source={!item.logo ? require('../../../../assets/images/ava.png') : {uri:`http://myteam.pro${item.logo}`}} 
                    resizeMode='contain'/>
                </View>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <Text style={[styles.textMiddle, {paddingVertical: 10}]}>
                    { item.title }
                  </Text>
                  <Text style={styles.textSmall}>
                    { item.action.title }
                  </Text>
                  <Text style={[styles.textMiddle, styles.textBlue]}>
                    { item.action.status.title }
                  </Text>
                </View>
                <View style={{width: '20%'}}>
                  <Text style={[styles.textMiddle, parseInt(item.summ.val) > 0 ? styles.textGreen : styles.textBlue, {paddingVertical: 10}]}>
                    { item.summ.val } {account.symbol}
                  </Text>
                  <Text style={styles.textSmall}>
                    { distanceInWordsToNow(item.model.updated_at * 1000, {locale: ruLocale, addSuffix: true}) }
                  </Text>
                </View>
              </View>
            )
            }.bind(this)}
            refreshing={this.props.finance.refreshing}
            onRefresh={()=>{
              this.refreshing()
            }}
          />
        </View>
        })
      }
      </ScrollableTabView>
      : null

    return (
      this.props.finance.loaded ? 
      <SideMenu
        menu={menu}
        bounceBackOnOverdraw={false}
        isOpen={this.state.isOpen}
        animationFunction={animationFunction}
        onChange={isOpen => this.updateMenuState(isOpen)}
        openMenuOffset={Dimensions.get('window').width * (6 / 7)}
      >
        <View style={[baseStyles.container, styles.mainContainer]}>
          <PageHeader 
            title={'Мои финансы'} 
            menu={true}
            addBtn={false}
            onAdd={() => {
              console.warn('test')
            }}
            />
            { tabs }
            <View style={{flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: Colors.COLOR_LIGHT_GRAY}}>
              <TouchableOpacity style={[styles.button, {flex: 1}]} onPress={() => this.props.navigateToMyFinanceRecharge()}>
                <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center', padding: 10}}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 10}}>
                    <Path 
                      fill="#31A3B7" 
                      d="M21,18v1c0,1.1-0.9,2-2,2H5c-1.11,0-2-0.9-2-2V5c0-1.1,0.89-2,2-2h14c1.1,0,2,0.9,2,2v1h-2
                      c-1.109,0-2,0.9-2,2v8c0,1.1,0.891,2,2,2H21L21,18z M18.949,14.672C18.953,16.297,22,16,22,16V8c0,0-3.031-0.391-3.051,1.469
                      c0.005,0.671,0.02,2.531,0.02,2.531S18.945,13.672,18.949,14.672z M4.729,11.91l4.99,4.112l4.989-4.112h-3.305l0.005-3.758H8.03
                      l0.005,3.758H4.729z"/>
                  </Svg>
                  <Text style={styles.linkText}>
                    Пополнить счет
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {flex: 1}]} onPress={() => {Alert.alert('Вывод средств', 'Для вывода денежных средств с рублевого счета необходимо написать заявление на payments@myteam.pro')}}>
                <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center', borderLeftWidth: 1, borderColor: Colors.COLOR_LIGHT_GRAY, padding: 10}}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 10}}>
                    <Path 
                      fill="#31A3B7" 
                      d="M21,18v1c0,1.1-0.9,2-2,2H5c-1.11,0-2-0.9-2-2V5c0-1.1,0.89-2,2-2h14c1.1,0,2,0.9,2,2v1h-2
                      c-1.109,0-2,0.9-2,2v8c0,1.1,0.891,2,2,2H21L21,18z M18.949,14.672C18.953,16.297,22,16,22,16V8c0,0-3.031-0.391-3.051,1.469
                      c0.005,0.671,0.02,2.531,0.02,2.531S18.945,13.672,18.949,14.672z M8.035,12.263l-0.006,3.758h3.379l-0.006-3.758h3.306L9.719,8.151
                      l-4.99,4.112H8.035z"/>
                  </Svg>
                  <Text style={styles.linkText}>
                    Вывести средства
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
        </View>
        <NavigationEvents
          onWillFocus={() => this._onPageFocus()}
        />
      </SideMenu>
      :
      <LinearGradient style={baseStyles.contentAtCenter} colors={['#31a3b7', '#3dccc6']}>
        <ActivityIndicator />
      </LinearGradient>
    );
  }

  _onPageFocus() {
    this.setState({
      isOpen: false
    })
  }

  // On user text typing
  writing(type, text){
    switch(type) {
      case 'name':
        this.setState(Object.assign(this.state, {
          search: {
            ...this.state.search,
            name: text
          }
        }));
      break;
    }
  };
};



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateBack: navigateBack,
      navigateToMyFinanceRecharge: navigateToMyFinanceRecharge,
      refreshFinanceData: (accounts) => refreshFinanceData(accounts),
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
)(MyFinancePage);