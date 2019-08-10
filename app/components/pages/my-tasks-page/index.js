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
    FlatList,
    Button,
    Modal
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import PageHeader from '../../blocks/page-header';
import ImageViewer from '../../blocks/image-viewer';
import TaskCard from '../../blocks/task-card';

import ReviewModal from '../../modals/review-modal';

import Tags from 'react-native-tags';
import LinearGradient from 'react-native-linear-gradient';
import DropdownAlert from 'react-native-dropdownalert';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import {OptimizedFlatList} from 'react-native-optimized-flatlist';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

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
  navigateToCreateTask,
  getTaskCount, getTaskAll, getTaskResponds, getTaskDelegate, getTaskChoice, getTaskMake, getTaskArhiv
} from '../../../actions';

import { NavigationEvents } from 'react-navigation';

import { EventRegister } from 'react-native-event-listeners';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class MyTasksPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      refresh: true,
      initialTab: 0,
      mode: 'all',
      data: {
        items: [],
        text: ''
      },
      all: {
        items: [],
        text: '',
      },
      responded: {
        items: [],
        text: ''
      },
      choice: {
        items: [],
        text: ''
      },
      delegate: {
        items: [],
        text: ''
      },
      arhive: {
        items: [],
        text: ''
      },
      performed: {
        items: [],
        text: ''
      },
      allData: [
        ...this.props.user.performedtasks,
        ...this.props.user.respondedtasks,
        ...this.props.user.createdtasks
      ],
      slideAnimation: new Animated.Value(22),
      reviewItem: undefined,
      modalReviewDisplay: false,
      refreshing: false
    };

    this.setDefaultData = this.setDefaultData.bind(this);
    this.setDefaultData();

  }

  componentWillMount() {
    //this.setDefaultData()
    
  }

  componentDidMount() {

    //Alert.alert('ON COMPONENT MOUNT')

    this.setState({
      isOpen: false,
    });


    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });

    /*let route = this.props.nav.routes[this.props.nav.index];
    if (route.params.tab && route.params.tab == 'Filter') {
      this.setState({
        initialTab: 6
      })
    }*/
    this.openReview = EventRegister.addEventListener('TASK_REVIEW_SHOW', (data) => {
      // console.warn(JSON.stringify(data, 0 , 2))
      this.setState({
        modalReviewDisplay: true,
        reviewItem: {
          ...data.task,
          performer: data.performer,
          user: data.user,
        }
      })
    });
    this.openFilterTasks = EventRegister.addEventListener('OPEN_FILTER_TASKS', () => {
      if (this.tabView) {
        setTimeout(() => this.tabView.goToPage(6), 300);
      }
    });


  };

  activePerformer(data, userid) {
    if (!Array.isArray(data) && data.hasOwnProperty(userid))
      return true
    return false
  }

  isUserPerformer(data, userid) {
    let result = [];
    if (!Array.isArray(data)) {
      result = Object.keys(data).filter(function(objectKey, index) {
        if (parseInt(data[objectKey].id) == parseInt(userid)){
          return true
        }
      });
    }
    return result.length
  }

  isOwner(data, userid) {
    if (data.api_user) {
      if (data.api_user.id == userid) {
        return true;
      }
      return false;
    }
    return false;
  }

  setDefaultData() {
  }

  componentWillUnmount() {
    this.setState({
      isOpen: false 
    });
    EventRegister.removeEventListener(this.leftMenu);
    EventRegister.removeEventListener(this.openReview);
    EventRegister.removeEventListener(this.openFilterTasks);
};


  refreshing = (state) => {
    this.setState({refreshing: true})
    this.props.getTaskCount();
    this.props.getTaskAll();
    this.props.getTaskResponds();
    this.props.getTaskDelegate();
    this.props.getTaskChoice();
    this.props.getTaskMake();
    this.props.getTaskArhiv();
    EventRegister.addEventListener('MY_TASK_ARHIV_LOADED', (data) => {
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

    var ids = [];

    // Все задачи
    // const allData = this.props.user.mytasks.filter((item) => {
    //   if (parseInt(item.status) != 0 && parseInt(item.status) != 4 && parseInt(item.public) == 1) {
    //     if (ids.indexOf(item.id) < 0) {
    //       ids.push(item.id)
    //       return item
    //     }
    //   }
    // }) || [];
    const allData = this.props.user.mytasks_all ? Object.values(this.props.user.mytasks_all).map((item) => {
        if (ids.indexOf(item.attributes.id) < 0) {
          ids.push(item.attributes.id)
          let items = {}
          items.attributes = item.attributes;
          items.user = item.user;
          items.tags = item.tags;
          items.responds = item.responds != undefined ? item.responds : [];
          items.performers = item.performers != undefined ? item.performers : [];
          items.note = item.note;
          return items
        }
    }) : [];

    // Выбираю исполнителя +
    const choiceData = this.props.user.mytasks_choice ? Object.values(this.props.user.mytasks_choice).map((item) => {
      let items = {}
      items.attributes = item.attributes;
      items.user = item.user;
      items.tags = item.tags;
      items.responds = item.responds != undefined ? item.responds : [];
      items.performers = item.performers != undefined ? item.performers : [];
      items.note = item.note;
      return items
    }) : [];

    // Мои отклики +
    const respondedData = this.props.user.mytasks_responds ? Object.values(this.props.user.mytasks_responds).map((item) => {
      let items = {}
      items.attributes = item.attributes;
      items.user = item.user;
      items.tags = item.tags;
      items.responds = item.responds != undefined ? item.responds : [];
      items.performers = item.performers != undefined ? item.performers : [];
      items.note = item.note;
      return items
    }) : [];



    // Поручил +
    const delegateData = this.props.user.mytasks_delegate ? Object.values(this.props.user.mytasks_delegate).map((item) => {
      let items = {}
      items.attributes = item.attributes;
      items.user = item.user;
      items.tags = item.tags;
      items.responds = item.responds != undefined ? item.responds : [];
      items.performers = item.performers != undefined ? item.performers : [];
      items.note = item.note;
      return items
    }) : [];

    // Архив +
    const arhiveData = this.props.user.mytasks_arhiv ? Object.values(this.props.user.mytasks_arhiv).map((item) => {
      let items = {}
      items.attributes = item.attributes;
      items.user = item.user;
      items.tags = item.tags;
      items.responds = item.responds != undefined ? item.responds : [];
      items.performers = item.performers != undefined ? item.performers : [];
      items.note = item.note;
      return items
    }) : [];

    // Делаю +
    const performedData = this.props.user.mytasks_make ? Object.values(this.props.user.mytasks_make).map((item) => {
      let items = {}
      items.attributes = item.attributes;
      items.user = item.user;
      items.tags = item.tags;
      items.responds = item.responds != undefined ? item.responds : [];
      items.performers = item.performers != undefined ? item.performers : [];
      items.note = item.note;
      return items
    }) : [];

    const tabs = <ScrollableTabView
                keyboardShouldPersistTaps={'handled'}
                initialPage={this.state.initialTab}
                ref={(tabView) => { this.tabView = tabView; }}
                renderTabBar={() => 
                  <ScrollableTabBar
                      style={{height: 94, paddingTop: 10, paddingBottom: 10, backgroundColor: Colors.COLOR_LIGHT_BLUE}}
                      underlineStyle={{height: 0}}
                      renderTab = {
                          function (name, page, isTabActive, onPressHandler, onLayoutHandler) {
                            return(<TouchableHighlight
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
                                  { page == 0 ? this.props.user.mytasks_count.all : undefined }
                                  { page == 1 ? this.props.user.mytasks_count.my_responds : undefined }
                                  { page == 2 ? this.props.user.mytasks_count.choice : undefined }
                                  { page == 3 ? this.props.user.mytasks_count.make : undefined }
                                  { page == 4 ? this.props.user.mytasks_count.delegate : undefined }
                                  { page == 5 ? this.props.user.mytasks_count.end : undefined }
                                  { page == 6 ? this.props.user.mytasksfiltered.length : undefined}
                                </Text>
                              </View>
                            </TouchableHighlight>)
                          }.bind(this)
                        }
                      /> 
                    }>
                  <View tabLabel="Все задачи" style={styles.tasksContainer}>

                   <FlatList
                      initialNumToRender={2}
                      data={allData}
                      keyboardShouldPersistTaps={'handled'}
                      keyExtractor={function(item, index) {
                        return item.id + '_all'
                      }}
                      extraData={this.state.refresh}
                      ListEmptyComponent={function() {
                        return(
                          <View style={styles.nullDatacontainer}>
                            <Text style={styles.nullDatacontainer_text}>
                              { this.state != undefined ? this.state.all.text : '' }
                            </Text>
                        </View>)
                      }}
                      renderItem={function({item, separators}) {
                        return(
                        <TaskCard
                          separators={separators}
                          showStatuses={true}
                          data={!Array.isArray(item.user) ?
                            item :
                            {
                              ...item,
                              user: {
                                ...this.props.user.data,
                                photo: '/userphoto/'+this.props.user.photo.photo[0].photo_cropped,
                                reviews: this.props.user.reviews,
                                teamUsers: this.props.user.team
                              }
                            }}
                          geolocation={this.props.app.geolocation}
                          respondsMax={this.props.user.data.respondsMax}
                          respondsLeft={this.props.user.data.respondsLeft}
                          removeRespond={this.props.removeRespond}
                          onOpenModal={(data, performer) => {
                            this.setState({
                              modalReviewDisplay: !this.state.modalReviewDisplay,
                              reviewItem: {
                                ...data,
                                performer: performer
                              }
                            })
                          }}
                          applyRespond={function(){
                            this.setState({
                              refresh: !this.state.refresh
                            })
                            this.props.applyRespond()
                          }.bind(this)}
                          onPressTask={(taskid, title) => this.props.navigateToTask(taskid, title)}
                          userid={this.props.user.data.id}
                          currentUser={Array.isArray(item.user)}
                          showControls={true}
                          refreshing={this.refreshing}
                          />
                      )
                      }.bind(this)}
                      refreshing={this.state.refreshing}
                      onRefresh={()=>{
                        this.refreshing()
                      }}
                    />
                  </View>
                  <View tabLabel="Мои отклики" style={styles.tasksContainer}>
                    <FlatList
                      initialNumToRender={2}
                      data={respondedData}
                      keyboardShouldPersistTaps={'handled'}
                      keyExtractor={function(item, index) {
                        return item.id + '_responded'
                      }}
                      ListEmptyComponent={function() {
                        return(
                          <View style={styles.nullDatacontainer}>
                            <Text style={styles.nullDatacontainer_text}>
                              { this.state != undefined ? this.state.responded.text : ''}
                            </Text>
                        </View>)
                      }.bind(this)}
                      renderItem={function({item, separators}) {
                        return(
                        <TaskCard
                          separators={separators}
                          showStatuses={true}
                          data={!Array.isArray(item.api_user) ?
                            item :
                            {
                              ...item,
                              user: {
                                ...this.props.user.data,
                                photo: '/userphoto/'+this.props.user.photo.photo[0].photo_cropped,
                                reviews: this.props.user.reviews,
                                teamUsers: this.props.user.team
                              }
                            }}
                          geolocation={this.props.app.geolocation}
                          respondsMax={this.props.user.data.respondsMax}
                          respondsLeft={this.props.user.data.respondsLeft}
                          removeRespond={this.props.removeRespond}
                          onOpenModal={(data, performer) => {
                            this.setState({
                              modalReviewDisplay: !this.state.modalReviewDisplay,
                              reviewItem: {
                                ...data,
                                performer: performer
                              }
                            })
                          }}
                          applyRespond={function(){
                            this.setState({
                              refresh: !this.state.refresh
                            })
                            this.props.applyRespond()
                          }.bind(this)}
                          onPressTask={(taskid, title) => this.props.navigateToTask(taskid, title)}
                          userid={this.props.user.data.id}
                          currentUser={Array.isArray(item.api_user)}
                          showControls={true}
                          refreshing={this.refreshing}

                        />
                      )}.bind(this)}
                      refreshing={this.state.refreshing}
                      onRefresh={()=>{
                        this.refreshing()
                      }}
                    />
                  </View>
                  <View tabLabel="Выбираю исполнителя" style={styles.tasksContainer}>
                    <FlatList
                      initialNumToRender={2}
                      data={choiceData}
                      keyboardShouldPersistTaps={'handled'}
                      keyExtractor={function(item, index) {
                        return item.id + '_choice'
                      }}
                      ListEmptyComponent={function() {
                        return(
                          <View style={styles.nullDatacontainer}>
                            <Text style={styles.nullDatacontainer_text}>
                              { this.state != undefined ? this.state.choice.text : ''}
                            </Text>
                        </View>)
                      }.bind(this)}
                      renderItem={function({item, separators}) {
                        return(
                        <TaskCard
                          separators={separators}
                          showStatuses={true}
                          data={!Array.isArray(item.api_user) ?
                            item :
                            {
                              ...item,
                              user: {
                                ...this.props.user.data,
                                photo: '/userphoto/'+this.props.user.photo.photo[0].photo_cropped,
                                reviews: this.props.user.reviews,
                                teamUsers: this.props.user.team
                              }
                            }}
                          geolocation={this.props.app.geolocation}
                          respondsMax={this.props.user.data.respondsMax}
                          respondsLeft={this.props.user.data.respondsLeft}
                          removeRespond={this.props.removeRespond}
                          onOpenModal={(data, performer) => {
                            this.setState({
                              modalReviewDisplay: !this.state.modalReviewDisplay,
                              reviewItem: {
                                ...data,
                                performer: performer
                              }
                            })
                          }}
                          applyRespond={function(){
                            this.setState({
                              refresh: !this.state.refresh
                            })
                            this.props.applyRespond()
                          }.bind(this)}
                          onPressTask={(taskid, title) => this.props.navigateToTask(taskid, title)}
                          userid={this.props.user.data.id}
                          currentUser={Array.isArray(item.api_user)}
                          showControls={true}
                          refreshing={this.refreshing}

                        />
                      )}.bind(this)}
                      refreshing={this.state.refreshing}
                      onRefresh={()=>{
                        this.refreshing()
                      }}
                    />
                  </View>
                  <View tabLabel="Делаю" style={styles.tasksContainer}>
                  <FlatList
                      initialNumToRender={2}
                      data={performedData}
                      keyboardShouldPersistTaps={'handled'}
                      keyExtractor={function(item, index) {
                        return item.id + '_performed'
                      }}
                      ListEmptyComponent={function() {
                        return(
                          <View style={styles.nullDatacontainer}>
                            <Text style={styles.nullDatacontainer_text}>
                              { this.state != undefined ? this.state.performed.text : ''}
                            </Text>
                        </View>)
                      }.bind(this)}
                      renderItem={function({item, separators}) {
                        return(
                        <TaskCard
                          separators={separators}
                          showStatuses={true}
                          data={!Array.isArray(item.api_user) ?
                            item :
                            {
                              ...item,
                              user: {
                                ...this.props.user.data,
                                photo: '/userphoto/'+this.props.user.photo.photo[0].photo_cropped,
                                reviews: this.props.user.reviews,
                                teamUsers: this.props.user.team
                              }
                            }}
                          geolocation={this.props.app.geolocation}
                          respondsMax={this.props.user.data.respondsMax}
                          respondsLeft={this.props.user.data.respondsLeft}
                          removeRespond={this.props.removeRespond}
                          onOpenModal={(data, performer) => {
                            this.setState({
                              modalReviewDisplay: !this.state.modalReviewDisplay,
                              reviewItem: {
                                ...data,
                                performer: performer
                              }
                            })
                          }}
                          applyRespond={function(){
                            this.setState({
                              refresh: !this.state.refresh
                            })
                            this.props.applyRespond()
                          }.bind(this)}
                          onPressTask={(taskid, title) => this.props.navigateToTask(taskid, title)}
                          userid={this.props.user.data.id}
                          currentUser={Array.isArray(item.api_user)}
                          showControls={true}
                          refreshing={this.refreshing}

                        />
                      )}.bind(this)}
                      refreshing={this.state.refreshing}
                      onRefresh={()=>{
                        this.refreshing()
                      }}
                    />
                  </View>
                  <View tabLabel="Поручил" style={styles.tasksContainer}>
                  <FlatList
                      initialNumToRender={2}
                      data={delegateData}
                      keyboardShouldPersistTaps={'handled'}
                      keyExtractor={function(item, index) {
                        return item.id + '_delegate'
                      }}
                      ListEmptyComponent={function() {
                        return(
                          <View style={styles.nullDatacontainer}>
                            <Text style={styles.nullDatacontainer_text}>
                              { this.state != undefined ? this.state.delegate.text : ''}
                            </Text>
                        </View>)
                      }.bind(this)}
                      renderItem={function({item, separators}) {
                        return(
                        <TaskCard
                          separators={separators}
                          showStatuses={true}
                          data={!Array.isArray(item.api_user) ?
                            item :
                            {
                              ...item,
                              api_user: {
                                ...this.props.user.data,
                                photo: '/userphoto/'+this.props.user.photo.photo[0].photo_cropped,
                                reviews: this.props.user.reviews,
                                teamUsers: this.props.user.team
                              }
                            }}
                          geolocation={this.props.app.geolocation}
                          respondsMax={this.props.user.data.respondsMax}
                          respondsLeft={this.props.user.data.respondsLeft}
                          removeRespond={this.props.removeRespond}
                          onOpenModal={(data, performer) => {
                            this.setState({
                              modalReviewDisplay: !this.state.modalReviewDisplay,
                              reviewItem: {
                                ...data,
                                performer: performer
                              }
                            })
                          }}
                          applyRespond={function(){
                            this.setState({
                              refresh: !this.state.refresh
                            })
                            this.props.applyRespond()
                          }.bind(this)}
                          onPressTask={(taskid, title) => this.props.navigateToTask(taskid, title)}
                          userid={this.props.user.data.id}
                          currentUser={Array.isArray(item.api_user)}
                          showControls={true}
                          refreshing={this.refreshing}

                        />
                      )}.bind(this)}
                      refreshing={this.state.refreshing}
                      onRefresh={()=>{
                        this.refreshing()
                      }}
                    />
                  </View>
                  <View tabLabel="Архив" style={styles.tasksContainer}>
                    <FlatList
                      initialNumToRender={2}
                      data={arhiveData}
                      keyboardShouldPersistTaps={'handled'}
                      keyExtractor={function(item, index) {
                        return item.id + '_arhive'
                      }}
                      ListEmptyComponent={function() {
                        return(
                          <View style={styles.nullDatacontainer}>
                            <Text style={styles.nullDatacontainer_text}>
                              { this.state.arhive.text }
                            </Text>
                          </View>)
                      }.bind(this)}
                      renderItem={function({item, separators}) {
                        return(
                          <TaskCard
                            separators={separators}
                            showStatuses={true}
                            data={!Array.isArray(item.api_user) ?
                              item :
                              {
                                ...item,
                                user: {
                                  ...this.props.user.data,
                                  photo: '/userphoto/'+this.props.user.photo.photo[0].photo_cropped,
                                  reviews: this.props.user.reviews,
                                  teamUsers: this.props.user.team
                                }
                              }}
                            geolocation={this.props.app.geolocation}
                            respondsMax={this.props.user.data.respondsMax}
                            respondsLeft={this.props.user.data.respondsLeft}
                            removeRespond={this.props.removeRespond}
                            onOpenModal={(data, performer) => {
                              this.setState({
                                modalReviewDisplay: !this.state.modalReviewDisplay,
                                reviewItem: {
                                  ...data,
                                  performer: performer
                                }
                              })
                            }}
                            applyRespond={function(){
                              this.setState({
                                refresh: !this.state.refresh
                              })
                              this.props.applyRespond()
                            }.bind(this)}
                            onPressTask={(taskid, title) => this.props.navigateToTask(taskid, title)}
                            userid={this.props.user.data.id}
                            currentUser={Array.isArray(item.api_user)}
                            showControls={true}
                            refreshing={this.refreshing}

                          />
                        )}.bind(this)}
                      refreshing={this.state.refreshing}
                      onRefresh={()=>{
                        this.refreshing()
                      }}
                    />
                  </View>
                    {
                      this.props.user.mytasksfiltered.length ?
                        <View tabLabel="Фильтр" style={styles.tasksContainer}>
                          <ScrollView>
                          {
                            this.props.user.mytasksfiltered.map((item, index) => {
                              return(
                                <TaskCard 
                                  key={'task_arhive_'+index}
                                  showStatuses={true}
                                  data={!Array.isArray(item.api_user) ? 
                                    item :
                                    {
                                      ...item,
                                      api_user: {
                                        ...this.props.user.data,
                                        photo: '/userphoto/'+this.props.user.photo.photo[0].photo_cropped,
                                        reviews: this.props.user.reviews,
                                        teamUsers: this.props.user.team
                                      }
                                    }}
                                  geolocation={this.props.app.geolocation}
                                  respondsMax={this.props.user.data.respondsMax}
                                  respondsLeft={this.props.user.data.respondsLeft}
                                  removeRespond={this.props.removeRespond}
                                  onOpenModal={(data, performer) => {
                                    this.setState({
                                      modalReviewDisplay: !this.state.modalReviewDisplay,
                                      reviewItem: {
                                        ...data,
                                        performer: performer
                                      }
                                    })
                                  }}
                                  applyRespond={function(){
                                    this.setState({ 
                                      refresh: !this.state.refresh
                                    })
                                    this.props.applyRespond()
                                  }.bind(this)}
                                  onPressTask={(taskid, title) => this.props.navigateToTask(taskid, title)}
                                  userid={this.props.user.data.id}
                                  currentUser={Array.isArray(item.api_user)}
                                  showControls={true}
                                  />
                                )
                            })
                          }
                          </ScrollView>
                          </View>
                      : undefined
                    }
                </ScrollableTabView>

    return (
      <View style={{flex: 1}}>
      {
        this.props.user.mytasksloaded ? 
          <SideMenu
            menu={menu}
            bounceBackOnOverdraw={false}
            isOpen={this.state.isOpen}
            animationFunction={animationFunction}
            onChange={isOpen => this.updateMenuState(isOpen)}
            openMenuOffset={Dimensions.get('window').width * (6 / 7)}
          >
            <View style={[baseStyles.container, styles.profileContainer]}>
              <PageHeader 
                title={'Мои задачи'}
                menu={true}
                addBtn={true}
                onAdd={() => {
                  this.props.navigateToCreateTask();
                }}
                search={true}
                onSearch={() => {this.props.navigateToTasksFilter(true)}}
                />
                 { tabs }
                <ReviewModal 
                  visible={this.state.modalReviewDisplay}
                  data={this.state.reviewItem}
                  close={() => {this.setModalVisible(!this.state.modalReviewDisplay);}}
                />
            </View>
            <DropdownAlert
                  closeInterval={5000}
                  messageNumOfLines={10}
                  titleStyle={baseStyles.alertTitle}
                  messageStyle={baseStyles.messageAlertStyle}
                  defaultTextContainer={baseStyles.defaultAlertTextContainer}
                  imageStyle={baseStyles.imageAlertStyle}
                  ref={ref => this.messages = ref} />
          </SideMenu>
          : 
          <LinearGradient style={baseStyles.contentAtCenter} colors={['#31a3b7', '#3dccc6']}>
            <ActivityIndicator />
          </LinearGradient>
      }
      <NavigationEvents
        onWillFocus={() => this._onPageFocus()}
      />
      </View>
    );
  }

  _onPageFocus() {
    this.setState({
      isOpen: false,
    });


    this.props.getTaskCount()

    if(
      this.props.user.mytasks_count
      && this.props.user.mytasks_all
    ){
      this.props.user.mytasksloaded = true;
    }else{
        this.props.getTaskCount()
        this.props.getTaskAll()
      EventRegister.addEventListener('MY_TASK_ALL_LOADED', (data) => {
        this.props.user.mytasksloaded = true;
      });
    }

    if(!this.props.user.mytasks_responds){
      this.props.getTaskResponds()
    }
    if(!this.props.user.mytasks_delegate){
      this.props.getTaskDelegate()
    }
    if(!this.props.user.mytasks_choice){
      this.props.getTaskChoice()
    }
    if(!this.props.user.mytasks_make){
      this.props.getTaskMake()
    }
    if(!this.props.user.mytasks_arhiv){
      this.props.getTaskArhiv()
    }
  }


  setModalVisible(visible) {
    this.setState({modalReviewDisplay: visible});
  }

  changeTab(mode) {
    this.setState({
      refresh: true
    })
    this.setState({
      mode: mode,
      data: this.state[mode],
      refresh: false
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
      navigateToTask: (taskid, title) => navigateToTask(taskid, title),
      navigateToTasksFilter: (mytasks) => navigateToTasksFilter(mytasks),
      navigateBack: navigateBack,
      getNewTasks: (page, type) => getNewTasks(page, type),
      removeRespond: (taskId, respondId) => removeRespond(taskId, respondId),
      applyRespond: (taskId, userid) => applyRespond(taskId, userid),
      navigateToCreateTask: navigateToCreateTask,
      getTaskCount: () => getTaskCount(),
      getTaskAll: () => getTaskAll(),
      getTaskResponds: () => getTaskResponds(),
      getTaskDelegate: () => getTaskDelegate(),
      getTaskChoice: () => getTaskChoice(),
      getTaskMake: () => getTaskMake(),
      getTaskArhiv: () => getTaskArhiv(),
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
)(MyTasksPage);