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
import TaskCard from '../../blocks/task-card';

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

class TasksCatalogPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      mode: 'all',
      all: {
        page: 0,
        isLoading: false,
        isRefreshing: false,
      },
      pro: {
        page: 0,
        isLoading: false,
        isRefreshing: false,
      },
      business: {
        page: 0,
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
  };

  componentWillUnmount() {
    this.setState({
      isOpen: false 
    });
    EventRegister.removeEventListener(this.leftMenu);
  };
  //
  // handleRefresh = () => {
  //   this.setState({
  //     all: {
  //       page: this.state.all.page,
  //       isLoading: false,
  //       isRefreshing: true,
  //     },
  //   }, () => {
  //     this.props.getNewTasks(this.state.all.page);
  //   });
  // };

  // handleLoadMore = () => {
  //   console.warn('handleLoadMore')
  //   this.setState({
  //     all: {
  //       page: this.state.all.page + 1,
  //       isLoading: false,
  //       isRefreshing: true,
  //     },
  //   }, () => {
  //     console.warn('GETNEWTASKS')
  //     this.props.getNewTasks(this.state.all.page);
  //   });
  // };

  refreshing = () => {
    this.setState({refreshing: true})
    this.props.getNewTasks(this.state.all.page);
    EventRegister.addEventListener('NEW_TASK_LOADED', (data) => {
      this.setState({
        refreshing: false
      })
    });

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

    {/*refreshing={this.state.all.isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0}*/}

    let allTab =
    this.props.tasks.items.length ?
      <FlatList
        data={this.props.tasks.items}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={(item, index) => {
          return item.id + '_all'
        }}
        renderItem={({item, separators}) => (
          <TaskCard
            separators={separators}
            data={item}
            geolocation={this.props.app.geolocation}
            respondsMax={this.props.user.data.respondsMax}
            respondsLeft={this.props.user.data.respondsLeft}
            removeRespond={this.props.removeRespond}
            applyRespond={this.props.applyRespond}
            onPressTask={(taskid, title, back) => this.props.navigateToTask(taskid, title, back)}
            userProfileTaskDetails={true}
            userid={this.props.user.data.id}
            refreshing={this.refreshing}
            backPage={'TasksCatalog'}

          />
        )}
      />
      :
      <View style={styles.nullDatacontainer}>
        <Text style={styles.nullDatacontainer_text}>
          К сожалению, заказчики еще не опубликовали задачи по Вашему запросу.
        </Text>
        <Text style={styles.nullDatacontainer_text}>
          Пожалуйста, зайдите немного позже.
        </Text>
      </View>

    let proTab =
      this.props.tasks.only_pro.length ?
        <FlatList
          data={this.props.tasks.only_pro}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={(item, index) => {
            return item.id + '_pro'
          }}
          renderItem={({item, separators}) => (
            <TaskCard 
              separators={separators}
              data={item}
              geolocation={this.props.app.geolocation}
              respondsMax={this.props.user.data.respondsMax}
              respondsLeft={this.props.user.data.respondsLeft}
              removeRespond={this.props.removeRespond}
              applyRespond={this.props.applyRespond}
              onPressTask={(taskid, title, back) => this.props.navigateToTask(taskid, title, back)}
              userProfileTaskDetails={true}
              backPage={'TasksCatalog'}
              userid={this.props.user.data.id}
              refreshing={this.refreshing}

            />
          )}
        />
      :
      <View style={styles.nullDatacontainer}>
        <Text style={styles.nullDatacontainer_text}>
          К сожалению, заказчики еще не опубликовали задачи по Вашему запросу. 
        </Text>
        <Text style={styles.nullDatacontainer_text}>
          Пожалуйста, зайдите немного позже.
        </Text>
      </View>

    let businessTab =
      this.props.tasks.only_business.length ?
        <FlatList
          data={this.props.tasks.only_business}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={(item, index) => {
            return item.id + '_business'
          }}
          renderItem={({item, separators}) => (
            <TaskCard
              separators={separators}
              data={item}
              geolocation={this.props.app.geolocation}
              respondsMax={this.props.user.data.respondsMax}
              respondsLeft={this.props.user.data.respondsLeft}
              removeRespond={this.props.removeRespond}
              applyRespond={this.props.applyRespond}
              onPressTask={(taskid, title, back) => this.props.navigateToTask(taskid, title, back)}
              userProfileTaskDetails={true}
              userid={this.props.user.data.id}
              refreshing={this.refreshing}
              backPage={'TasksCatalog'}
            />
          )}
        />
      :
      <View style={styles.nullDatacontainer}>
        <Text style={styles.nullDatacontainer_text}>
          К сожалению, заказчики еще не опубликовали задачи по Вашему запросу. 
        </Text>
        <Text style={styles.nullDatacontainer_text}>
          Пожалуйста, зайдите немного позже.
        </Text>
      </View>


    return (
      // this.props.tasks.loaded_items && this.props.tasks.loaded_pro && this.props.tasks.loaded_business ?
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
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.refreshing}
                />
              }
              >
              <PageHeader 
                title={'Каталог задач'}
                search={true} 
                onSearch={this.props.navigateToTasksFilter}
                menu={true}
                />
              <View style={[styles.top_wrapper]}>
                <View style={[baseStyles.row, baseStyles.contentSpaceBetween, styles.top_wrapper_btns]}>
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => this.changeTab('all')}>
                    <Text style={[styles.tabHead, this.state.mode == 'all' ? styles.tabHead_active : '']}>
                      Для всех
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor="transparent"
                    
                    onPress={() => this.changeTab('pro')}>
                    <Text style={[styles.tabHead, this.state.mode == 'pro' ? styles.tabHead_active : '']}>
                      Для Pro
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor="transparent"
                    
                    onPress={() => this.changeTab('business')}>
                    <Text style={[styles.tabHead, this.state.mode == 'business' ? styles.tabHead_active : '']}>
                      Для Business
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
              <View style={{backgroundColor: '#ccdae3',}}>
                {allTab}
                {/* { this.state.mode === 'all' ?
                  allTab :
                  this.state.mode === 'pro' ? proTab : businessTab } */}
              </View>
              <Text>
                {
                  /*this.props.user ?
                    JSON.stringify(this.props.user.data)
                  : undefined*/
                }
                {/*JSON.stringify(this.props.app.units, null, 2)*/}
              </Text>
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
        // :
        // <LinearGradient style={baseStyles.contentAtCenter} colors={['#31a3b7', '#3dccc6']}>
        //   <ActivityIndicator />
        // </LinearGradient>
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
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      tasks: state.tasks,
    }
  }, mapDispatchToProps
)(TasksCatalogPage);