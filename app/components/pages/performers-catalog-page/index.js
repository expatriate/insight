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
    TouchableHighlight,
    ActivityIndicator,
    ImageBackground,
    Picker,
    TextInput,
    FlatList
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import PageHeader from '../../blocks/page-header';
import ImageViewer from '../../blocks/image-viewer';
import UserProfile from '../../blocks/user-profile';

import Tags from 'react-native-tags';
import LinearGradient from 'react-native-linear-gradient';
import DropdownAlert from 'react-native-dropdownalert';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import { NavigationEvents } from 'react-navigation';

import Svg, {
    Path,
    Circle,
    Polygon,
    Defs,
    Stop,
    G,
    LinearGradient as LinearGradientSvg
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { 
  navigateToUser,
  navigateToTask,
  navigateToTasksFilter,
  navigateBack,
  getNewTasks,
  removeRespond,
  applyRespond,
  getPerformersData,
  navigateToPerformersCatalogFilter,
  filterPerformers,
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

class PerformersCatalogPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      mode: 'all',
      all: {
        isLoading: false,
        isRefreshing: false,
      },
      pro: {
        isLoading: false,
        isRefreshing: false,
      },
      business: {
        isLoading: false,
        isRefreshing: false,
      },

      slideAnimation: new Animated.Value(22),      
      dataloaded: true,
      refreshing: false
    }
  }

  componentDidMount() {

    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });

    this.filterListener = EventRegister.addEventListener('OPEN_FILTER_PERFORMED', () => {
      this.setState({
        mode: 'filter' 
      });
    });

  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.leftMenu);
    EventRegister.removeEventListener(this.filterListener);
  };

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {

    const menu = <LeftMenu user={this.props.user} />;

    const animationFunction = (prop, value) => {
       return Animated.spring(prop, {
          toValue: value,
          friction: 10,
          tension: 10
       });
    };

    let allTab =
        <FlatList
          data={this.props.performers.items.data}
          keyboardShouldPersistTaps={'handled'}
          style={{flex: 1}}
              contentContainerStyle={{flex: 1}}
          keyExtractor={(item, index) => {
            return item.id + '_all'
          }}
          renderItem={({item, separators}) => (
            this.props.user.data.id != item.id ?
              <UserProfile data={item} style={styles.userBlock} showControls={true} maxInfo={true} hideUsers={true}/>
            : null
          )}
          ListFooterComponent={() => {
            if (!this.props.performers.items.loaded) {
              return (
                <View
                  style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                  }}
                >
                  <ActivityIndicator animating size="large" />
                </View>)
            }
            return null
          }}
          ListEmptyComponent={() => {
            return (
              <View style={styles.nullDatacontainer}>
                <Text style={styles.nullDatacontainer_text}>
                  К сожалению, не найдено исполнителей по Вашему запросу. 
                </Text>
                <Text style={styles.nullDatacontainer_text}>
                  Попробуйте изменить запрос.
                </Text>
              </View>)
          }}
        />
        

    let proTab =
        <FlatList
          data={this.props.performers.only_pro.data}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={(item, index) => {
            return item.id + '_pro'
          }}
          renderItem={({item, separators}) => (
            this.props.user.data.id != item.id ?
              <UserProfile data={item} style={styles.userBlock} showControls={true} maxInfo={true} hideUsers={true}/>
            : null
          )}
          ListFooterComponent={() => {
            if (!this.props.performers.only_pro.loaded) {
              return (
                <View
                  style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                  }}
                >
                  <ActivityIndicator animating size="large" />
                </View>)
            }
            return null
          }}
          ListEmptyComponent={() => {
            return (
              <View style={styles.nullDatacontainer}>
                <Text style={styles.nullDatacontainer_text}>
                  К сожалению, не найдено исполнителей по Вашему запросу. 
                </Text>
                <Text style={styles.nullDatacontainer_text}>
                  Попробуйте изменить запрос.
                </Text>
              </View>)
          }}
        />

    let businessTab =
        <FlatList
          data={this.props.performers.only_business.data}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={(item, index) => {
            return item.id + '_business'
          }}
          renderItem={({item, separators}) => (
            this.props.user.data.id != item.id ?
              <UserProfile data={item} style={styles.userBlock} showControls={true} maxInfo={true} hideUsers={true}/>
            : null
          )}
          ListFooterComponent={() => {
            if (!this.props.performers.only_business.loaded) {
              return (
                <View
                  style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                  }}
                >
                  <ActivityIndicator animating size="large" />
                </View>)
            }
            return null
          }}
          ListEmptyComponent={() => {
            return (
              <View style={styles.nullDatacontainer}>
                <Text style={styles.nullDatacontainer_text}>
                  К сожалению, не найдено исполнителей по Вашему запросу. 
                </Text>
                <Text style={styles.nullDatacontainer_text}>
                  Попробуйте изменить запрос.
                </Text>
              </View>)
          }}
        />
    let filterTab =
        <FlatList
          data={this.props.performers.filter.data}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={(item, index) => {
            return item.id + '_business'
          }}
          renderItem={({item, separators}) => (
            this.props.user.data.id != item.id ?
              <UserProfile data={item} style={styles.userBlock} showControls={true} maxInfo={true} hideUsers={true}/>
              : null
          )}
          ListFooterComponent={() => {
            if (!this.props.performers.filter.loaded) {
              return (
                <View
                  style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                  }}
                >
                  <ActivityIndicator animating size="large" />
                </View>)
            }
            return null
          }}
          ListEmptyComponent={() => {
            return (
              <View style={styles.nullDatacontainer}>
                <Text style={styles.nullDatacontainer_text}>
                  К сожалению, не найдено исполнителей по Вашему запросу. 
                </Text>
                <Text style={styles.nullDatacontainer_text}>
                  Попробуйте изменить запрос.
                </Text>
              </View>)
          }}
        />

    return (
       this.props.performers.loaded ?
        <SideMenu
          menu={menu}
          bounceBackOnOverdraw={false}
          isOpen={this.state.isOpen}
          animationFunction={animationFunction}
          onChange={isOpen => this.updateMenuState(isOpen)}
          openMenuOffset={Dimensions.get('window').width * (6 / 7)}
        >
          <View style={[baseStyles.container, styles.profileContainer]}>
            <ScrollView 
              keyboardShouldPersistTaps={'handled'}
              onScroll={({nativeEvent}) => {
                if (this.isCloseToBottom(nativeEvent)) {
                    if(Object.keys(this.props.app.geolocation).length) {
                        if (this.state.mode === 'all' && this.props.performers.items.loaded) {
                            this.props.getPerformersData(this.props.performers.items.page, null, {lat: this.props.app.geolocation.coords.latitude, lng: this.props.app.geolocation.coords.longitude})
                        } else if (this.state.mode === 'pro' && this.props.performers.only_pro.loaded) {
                            this.props.getPerformersData(this.props.performers.only_pro.page, 'pro', {lat: this.props.app.geolocation.coords.latitude, lng: this.props.app.geolocation.coords.longitude})
                        } else if (this.state.mode === 'business' && this.props.performers.only_business.loaded) {
                            this.props.getPerformersData(this.props.performers.only_business.page, 'business', {lat: this.props.app.geolocation.coords.latitude, lng: this.props.app.geolocation.coords.longitude})
                        } else if (this.state.mode === 'filter' && this.props.performers.filter.loaded) {
                            this.props.filterPerformers(this.props.performers.search, this.props.performers.filter.page)
                        }
                    }
                }
              }}
              scrollEventThrottle={400}
              >
              <PageHeader 
                title={'Каталог исполнителей'}
                search={true} 
                onSearch={this.props.navigateToPerformersCatalogFilter}
                menu={true}
                />
              <View style={styles.top_wrapper_btns}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => this.changeTab('all')}>
                  <Text style={[styles.tabHead, this.state.mode == 'all' ? styles.tabHead_active : '']}>
                    Все исполнители
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => this.changeTab('pro')}>
                  <Text style={[styles.tabHead, this.state.mode == 'pro' ? styles.tabHead_active : '']}>
                    Pro
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => this.changeTab('business')}>
                  <Text style={[styles.tabHead, this.state.mode == 'business' ? styles.tabHead_active : '']}>
                    Business
                  </Text>
                </TouchableHighlight>
                {
                  this.props.performers.filter.loaded ?
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => this.changeTab('filter')}>
                    <Text style={[styles.tabHead, this.state.mode == 'filter' ? styles.tabHead_active : '']}>
                      Фильтр
                    </Text>
                  </TouchableHighlight>
                  : null
                }
              </View>
              <View style={{backgroundColor: '#ccdae3',}}>
                { 
                  this.state.mode === 'all' ? this.props.performers.loaded ? allTab : <ActivityIndicator />
                    :
                  this.state.mode === 'pro' ? this.props.performers.loaded ? proTab : <ActivityIndicator />
                    : 
                  this.state.mode === 'business' ? this.props.performers.loaded ? businessTab : <ActivityIndicator /> 
                    : 
                  this.state.mode === 'filter' ? this.props.performers.loaded ? filterTab : <ActivityIndicator /> 
                    : null
                  }
              </View>
            </ScrollView>
          </View>
          <DropdownAlert
            closeInterval={5000}
            messageNumOfLines={10}
            titleStyle={baseStyles.alertTitle}
            messageStyle={baseStyles.messageAlertStyle}
            defaultTextContainer={baseStyles.defaultAlertTextContainer}
            imageStyle={baseStyles.imageAlertStyle}
            ref={ref => this.messages = ref} />
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

  changeTab(mode) {
    this.setState({
      mode: mode
    });
  }

  updateMenuState(isOpen) {
    this.setState({
      isOpen
    });
  }
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToUser: (userid, title) => navigateToUser(userid, title),
      navigateToTask: (taskid, title, back) => navigateToTask(taskid, title, back),
      navigateToTasksFilter: navigateToTasksFilter,
      navigateBack: navigateBack,
      getNewTasks: (page, type) => getNewTasks(page, type),
      removeRespond: (taskId, respondId) => removeRespond(taskId, respondId),
      applyRespond: (taskId, user) => applyRespond(taskId, user),
      getPerformersData: (page, type, location) => getPerformersData(page, type, location),
      filterPerformers: (options, page) => filterPerformers(options, page),
      navigateToPerformersCatalogFilter: navigateToPerformersCatalogFilter,
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      performers: state.performers
    }
  }, mapDispatchToProps
)(PerformersCatalogPage);