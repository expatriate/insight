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


import Svg, {
    Path,
    Polygon,
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateBack,
  navigateToMyFinanceRecharge
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

class MyReviewsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      slideAnimation: new Animated.Value(22),
      refreshing: false,
      nullText: 'Нет записей',
    }
  }

  componentDidMount() {
    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.leftMenu);
  };

  updateMenuState(isOpen) {
    this.setState({
      isOpen
    });
  }

  refreshing = (state) => {
    this.setState({refreshing: true})

    setTimeout(() => {
      this.setState({
        refreshing: false
      })
    }, 1000)
  }

  render() {


    const menu = <LeftMenu user={this.props.user} />;

    const animationFunction = (prop, value) => {
       return Animated.spring(prop, {
          toValue: value,
          friction: 10,
          tension: 10
       });
    };

    const tabs = <ScrollableTabView
      keyboardShouldPersistTaps={'handled'}
      initialPage={this.state.initialTab}
      ref={(tabView) => { this.tabView = tabView; }}
      renderTabBar={() => 
        <ScrollableTabBar
          style={{height: 70, paddingTop: 10, paddingBottom: 10, backgroundColor: Colors.COLOR_LIGHT_BLUE}}
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
                    { page == 0 ? '0' : undefined }
                    { page == 1 ? '0' : undefined }
                  </Text>
                </View>
              </TouchableOpacity>)
            }.bind(this)
            }
          /> 
          }>
        <View tabLabel="Заказчики" style={styles.itemsContainer}>

          <FlatList
            initialNumToRender={2}
            data={this.state.responds}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={function(item, index) {
              return item.id + '_responds'
            }}
            extraData={this.state.refresh}
            style={{paddingTop: 20}}
            ListEmptyComponent={function() {
              return(
                <View style={styles.nullDatacontainer}>
                  <Text style={styles.nullDatacontainer_text}>
                    { this.state.nullText }
                  </Text>
              </View>)
            }.bind(this)}
            renderItem={function({item, separators}) {
              return(
              <View style={{flexDirection: 'row', marginHorizontal: 10, padding: 10, borderBottomWidth: 1, borderColor: Colors.COLOR_LIGHT_GRAY}}>
                <View>
                  <Image style={{width: 50, height: 50, marginRight: 10, borderRadius: 50}} source={require('../../../../assets/images/ava.png')} resizeMode='contain'/>
                </View>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <Text style={[styles.textMiddle, {paddingVertical: 10}]}>
                    { item.name }
                  </Text>
                  <Text style={styles.textSmall}>
                    { item.text }
                  </Text>
                  <Text style={[styles.textMiddle, styles.textBlue]}>
                    { item.details }
                  </Text>
                </View>
                <View style={{width: '20%'}}>
                  <Text style={[styles.textMiddle, styles.textGreen, {paddingVertical: 10}]}>
                    + { item.pay } Р
                  </Text>
                  <Text style={styles.textSmall}>
                    { item.time }
                  </Text>
                </View>
              </View>
            )
            }.bind(this)}
            refreshing={this.state.refreshing}
            onRefresh={()=>{
              this.refreshing()
            }}
          />
        </View>
        <View tabLabel="Исполнители" style={styles.itemsContainer}>
          <FlatList
            initialNumToRender={2}
            data={this.state.performers}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={function(item, index) {
              return item.id + '_performers'
            }}
            ListEmptyComponent={function() {
              return(
                <View style={styles.nullDatacontainer}>
                  <Text style={styles.nullDatacontainer_text}>
                    { this.state.nullText }
                  </Text>
              </View>)
            }.bind(this)}
            renderItem={function({item, separators}) {
              return(
                <View style={{flexDirection: 'row', marginHorizontal: 10, padding: 10, borderBottomWidth: 1, borderColor: Colors.COLOR_LIGHT_GRAY}}>
                  <View>
                    <Image style={{width: 50, height: 50, marginRight: 10, borderRadius: 50}} source={require('../../../../assets/images/ava.png')} resizeMode='contain'/>
                  </View>
                  <View style={{flexDirection: 'column', flex: 1}}>
                    <Text style={[styles.textMiddle, {paddingVertical: 10}]}>
                      { item.name }
                    </Text>
                    <Text style={styles.textSmall}>
                      { item.text }
                    </Text>
                    <Text style={[styles.textMiddle, styles.textBlue]}>
                      { item.details }
                    </Text>
                  </View>
                  <View style={{width: '20%'}}>
                    <Text style={[styles.textMiddle, styles.textGreen, {paddingVertical: 10}]}>
                      + { item.pay } MTR
                    </Text>
                    <Text style={styles.textSmall}>
                      { item.time }
                    </Text>
                  </View>
                </View>
            )}.bind(this)}
            refreshing={this.state.refreshing}
            onRefresh={()=>{
              this.refreshing()
            }}
          />
        </View>
      </ScrollableTabView>

    return (
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
            title={'Отзывы'} 
            menu={true}
            addBtn={true}
            onAdd={() => {
              console.warn('Добавить отзыв')
            }}
            />
            { tabs }
        </View>
        <NavigationEvents
          onWillFocus={() => this._onPageFocus()}
        />
      </SideMenu>
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
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      team: state.team
    }
  }, mapDispatchToProps
)(MyReviewsPage);