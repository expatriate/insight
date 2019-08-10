import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    Alert,
    Dimensions,
    StatusBar,
    TouchableHighlight,
    ActivityIndicator,
    TextInput,
    FlatList,
    Animated
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import PageHeader from '../../blocks/page-header';
import ImageViewer from '../../blocks/image-viewer';
import TaskCard from '../../blocks/task-card';
import UserProfile from '../../blocks/user-profile';
import RespondBtn from '../../blocks/respond-button';

import textPrepared from '../../helpers/textPrepared';
import getDistanceFromLatLonInKm from '../../helpers/getDistanceFromLatLonInKm';

import MapView, {Marker} from 'react-native-maps'
// import MapView, { PROVIDER_GOOGLE, Marker, Animated as AnimatedMapView, AnimatedRegion } from 'react-native-maps';

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
  navigateBack,
  navigateToTasks,
  getTask,
  awayFromTask,
  removeRespond,
  applyRespond,
  navigateToTasksCatalogPage
} from '../../../actions';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';

import { EventRegister } from 'react-native-event-listeners';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class TasksDetailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,

      slideAnimation: new Animated.Value(22),
      
      dataloaded: true,

      showFilesModal: false
    }

    this.isPerformer = this.isPerformer.bind(this);
  }

  componentDidMount() {

    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });

    if (this.props.nav.routes[this.props.nav.index].params && this.props.nav.routes[this.props.nav.index].params.taskid) {
      this.props.getTask(this.props.nav.routes[this.props.nav.index].params.taskid)
    }
  };

  isPerformer() {
    if (!Array.isArray(this.props.tasks.taskview.api_responds)) {
      Object.keys(this.props.tasks.taskview.api_responds).filter((objectKey, index) => {
        if (this.props.tasks.taskview.api_responds[objectKey].id == this.props.user.data.id) {
          return true;
        }
      });
    }
    return false;
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.leftMenu);
    this.props.awayFromTask();
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

    const tags = this.props.tasks.taskview.api_tags.map((item, index) => {
      return(
        <Text key={`tag_${index}`} style={[styles.tag, index == 0 ? styles.firstTag : undefined]}>
          { item.title }
        </Text>
        )
    });

    const filesModal = <ImageViewer
      close={() => {
        StatusBar.setBackgroundColor('rgba(0,0,0,0)');
        this.setState({showFilesModal: false})}
      }
      visible={this.state.showFilesModal}
      index={this.state.filesModalIndex}
      images={
        this.props.tasks.taskview.api_files.map((img, imgIndex) => {
          return({url: `https://myteam.pro/${img.url}`})
        })
      } />
    const filesImages = this.props.tasks.taskview.api_files.map((img, imgIndex) => {
      return (
        <TouchableHighlight 
          key={'filesImageModal'+imgIndex} 
          underlayColor="transparent" 
          style={imgIndex == 0 ? {marginLeft: 20} : {marginLeft: 0}}
          onPress={() => {
            StatusBar.setBackgroundColor('rgba(0,0,0,1)');
            this.setState({showFilesModal: true, filesModalIndex: imgIndex})}
          }>
            <Image
            style={{width: 120, height: 100, marginRight: 10, marginBottom: 10}} 
            source={{uri:`https://myteam.pro/${img.thumb}`}} 
            resizeMode='contain'
            />
        </TouchableHighlight>)
    });

    let respondCount = 0;
    if (!Array.isArray(this.props.tasks.taskview.api_responds)) {
      Object.keys(this.props.tasks.taskview.api_responds).filter((objectKey, index) => {
        respondCount += 1;
      });
    }

    let backPage = (this.props.nav.routes[this.props.nav.index].params ? this.props.nav.routes[this.props.nav.index].params.back : '')


    return (
      this.props.tasks.taskview.loaded ?
        <SideMenu
          menu={menu}
          bounceBackOnOverdraw={false}
          isOpen={this.state.isOpen}
          animationFunction={animationFunction}
          onChange={isOpen => this.updateMenuState(isOpen)}
          openMenuOffset={Dimensions.get('window').width * (6 / 7)}
        >
          <View style={[baseStyles.container, styles.taskContainer]}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              {console.warn('backPage = ', backPage)}
              <PageHeader
                title={this.props.nav.routes[this.props.nav.index].params ? this.props.nav.routes[this.props.nav.index].params.title : ''} 
                template={this.props.nav.routes[this.props.nav.index].params ? this.props.nav.routes[this.props.nav.index].params.template : ''} 
                back={true}
                onBack={() => {
                  if(backPage != undefined){
                    this.props.navigateToTasksCatalogPage()
                  }else {
                    this.props.navigateToTasks()
                  }
                }}
                />
              <UserProfile data={this.props.tasks.taskview.api_user} />
              <View style={styles.topHeader}>
                <ScrollView keyboardShouldPersistTaps='handled' horizontal={true} contentContainerStyle={[baseStyles.verticalCenter, {flexDirection: 'row'}]}>
                  <Text style={baseStyles.timeText}>
                    { distanceInWordsToNow(this.props.tasks.taskview.created_at * 1000, {locale: ruLocale, addSuffix: true}) }
                  </Text>
                  {
                    this.props.tasks.taskview.payment_type == 3 ?
                    <View style={[baseStyles.verticalCenter, {marginLeft: 18, flex: 1,flexDirection: 'row'}]}>
                      <Svg width={18} height={18} style={{marginRight: 4}} viewBox="0 0 24 24">
                        <Path 
                          d="M14,2 L6,2 C4.9,2 4.01,2.9 4.01,4 L4,20 C4,21.1 4.89,22 5.99,22 L18,22 C19.1,22 20,21.1 20,20 L20,8 L14,2 L14,2 Z" 
                          fill="#3DCCC6"/>
                      </Svg>
                      <Text style={baseStyles.timeText}>
                        По договору
                      </Text>
                    </View>
                    : undefined
                  }

                  {
                    this.props.tasks.taskview.payment_type == 2 ?
                    <View style={[baseStyles.verticalCenter, {marginLeft: 18, flex: 1,flexDirection: 'row'}]}>
                      <Svg width={18} height={18} style={{marginRight: 4}} viewBox="0 0 24 24">
                        <Path 
                        d="M12,1 L3,5 L3,11 C3,16.55 6.84,21.74 12,23 C17.16,21.74 21,16.55 21,11 L21,5 L12,1 L12,1 Z M10,17 L6,13 L7.41,11.59 L10,14.17 L16.59,7.58 L18,9 L10,17 L10,17 Z" 
                        fill="#54B422"/>
                      </Svg>
                      <Text style={baseStyles.timeText}>
                        Сделка без риска
                      </Text>
                    </View>
                    : undefined
                  }
                  {/*<Svg width={16} height={16} style={{marginLeft: 20, marginRight:2}} viewBox="0 0 24 24">
                    <Path 
                      d="M12,1 L3,5 L3,11 C3,16.55 6.84,21.74 12,23 C17.16,21.74 21,16.55 21,11 L21,5 L12,1 L12,1 Z M10,17 L6,13 L7.41,11.59 L10,14.17 L16.59,7.58 L18,9 L10,17 L10,17 Z"
                      fill="#54B422"/>
                  </Svg>
                  <Text style={baseStyles.timeText}>
                    Сделка без риска
                  </Text>*/}
                </ScrollView>
              </View>
              <View style={[styles.margins, {flexDirection: 'row', flex: 1}]}>
                <Text style={[baseStyles.titleText,{flex: 1, paddingRight: 20}]}>
                  { this.props.tasks.taskview.title }
                </Text>
                <Text style={baseStyles.titleText}>
                  { this.props.tasks.taskview.price } ₽
                </Text>
              </View> 
              {
                this.props.tasks.taskview.api_tags.length ?
                  <ScrollView keyboardShouldPersistTaps='handled'
                   horizontal={true} 
                   contentContainerStyle={{flexDirection: 'row', marginTop: 16, marginBottom: 8}} 
                   showsHorizontalScrollIndicator={false}>
                    { tags }
                  </ScrollView>
                :
                undefined
              }
              <View style={[styles.margins, {flexDirection: 'row'}]}>
                { 
                  this.props.tasks.taskview.lat && this.props.tasks.taskview.lng && this.props.app.geolocation.coords ?
                    <View style={{marginRight: 20}}>
                      <Text style={baseStyles.smallText}>
                        От вас
                      </Text>
                      <Text style={baseStyles.midText}>
                        { 
                          getDistanceFromLatLonInKm(
                            this.props.tasks.taskview.lat, 
                            this.props.tasks.taskview.lng, 
                            this.props.app.geolocation.coords.latitude, 
                            this.props.app.geolocation.coords.longitude
                          ) + ' км'
                        }
                      </Text>
                    </View>
                  :
                  undefined
                }
                <View style={{marginRight: 20}}>
                  <Text style={baseStyles.smallText}>
                    Время
                  </Text>
                  <Text style={baseStyles.midText}>
                    { distanceInWordsToNow(this.props.tasks.taskview.start_at * 1000, {locale: ruLocale, addSuffix: true}) }
                  </Text>
                </View>
                <View style={{marginRight: 20}}>
                  <Text style={baseStyles.smallText}>
                    Откликнулось
                  </Text>
                  <Text style={baseStyles.midText}>
                    { respondCount + ' ' + textPrepared(respondCount, 'человек')}
                  </Text>
                </View>
              </View>
              <View style={baseStyles.splitter_smlmg}>
              </View>
              <View style={[styles.catalogItemInfo, baseStyles.verticalCenter]}>
                <View style={{flex: 4, marginRight: 10}}>
                  <Text style={baseStyles.midText}>
                    {textPrepared(parseInt(this.props.user.data.respondsLeft), 'У вас осталось')}
                  </Text>
                  <Text style={[baseStyles.midText, baseStyles.midText_nextline]}>
                    {parseInt(this.props.user.data.respondsLeft)} {textPrepared(parseInt(this.props.user.data.respondsLeft), 'отклик')}
                  </Text>
                </View>
                <View>
                  <RespondBtn
                    onPress={() => console.warn('alala')}
                    respondsLeft={this.props.user.data.respondsLeft}
                    respondsMax={this.props.user.data.respondsMax}
                    removeRespond={() => {
                      let respondId = 0;
                      if (!Array.isArray(this.props.tasks.taskview.api_responds)) {
                        Object.keys(this.props.tasks.taskview.api_responds).filter((objectKey, index) => {
                          if (this.props.tasks.taskview.api_responds[objectKey].id == this.props.user.data.id) {
                             respondId = parseInt(objectKey);
                          }
                        });
                      }
                      if (respondId) {
                        this.props.removeRespond(this.props.tasks.taskview.id, respondId);
                      }
                    }}
                    applyRespond={() => {
                      this.props.applyRespond(this.props.tasks.taskview.id, this.props.user.data.id )
                    }}
                    alreadyRepond={this.isPerformer()}
                    responds={this.props.tasks.taskview.api_responds}
                    performers={this.props.tasks.taskview.api_performers}
                    userCurents={this.props.user.data.id}
                    isAuthor={this.props.user.data.id == this.props.tasks.taskview.api_user.id}
                    isArhive={this.props.tasks.taskview.status == 4}
                  />
                </View>
              </View>
              <View style={baseStyles.splitter_smlmg}>
              </View>

              { 
                this.props.tasks.taskview.api_files && this.props.tasks.taskview.api_files.length ?
                <View>
                  <ScrollView keyboardShouldPersistTaps='handled' horizontal={true} contentContainerStyle={{flexDirection: 'row', marginTop: 16, marginBottom: 8}} showsHorizontalScrollIndicator={false}>
                    { filesImages } 
                  </ScrollView>
                    { filesModal }
                </View>
                : 
                  undefined 
              }

              <Text style={[styles.margins, baseStyles.midText]}>
                { this.props.tasks.taskview.text }
              </Text>

              <View style={baseStyles.splitter_smlmg}>
              </View>

              <View style={[styles.margins, {flexDirection:'row', flex: 1}]}>
                <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
                  <Path
                    fill={Colors.COLOR_LIGHT_BLUE}
                    d="M12,2 C8.14,2 5,5.14 5,9 C5,14.25 12,22 12,22 C12,22 19,14.25 19,9 C19,5.14 15.86,2 12,2 L12,2 Z"
                  />
                </Svg>
                <Text style={[baseStyles.midText, {flex: 1}]}>
                  { this.props.tasks.taskview.address}
                </Text>
                { 
                  this.props.tasks.taskview.lat && this.props.tasks.taskview.lng && this.props.app.geolocation.coords ?
                    <View>
                      <Text style={[baseStyles.midText, {textAlign: 'center'}]}>
                        { 
                          getDistanceFromLatLonInKm(
                            this.props.tasks.taskview.lat, 
                            this.props.tasks.taskview.lng, 
                            this.props.app.geolocation.coords.latitude, 
                            this.props.app.geolocation.coords.longitude
                          )
                        }
                      </Text>
                      <Text style={[baseStyles.smallText, {textAlign: 'center'}]}>
                        км
                      </Text>
                    </View>
                  :
                  undefined
                }
              </View>

              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  // provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: parseFloat(this.props.tasks.taskview.lat)|| 0.00,
                    longitude: parseFloat(this.props.tasks.taskview.lng)|| 0.00,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  >
                  <Marker
                    coordinate={{latitude: parseFloat(this.props.tasks.taskview.lat) || 0.00, longitude: parseFloat(this.props.tasks.taskview.lng) || 0.00}}
                    image={require('../../../../assets/images/location.png')}
                    centerOffset={{x:10, y:0}}
                  />
                </MapView>
              </View>

              <View style={baseStyles.splitter_smlmg}>
              </View>

              <View style={[styles.catalogItemInfo, baseStyles.verticalCenter]}>
                <View style={{flex: 4, marginRight: 10}}>
                  <Text style={baseStyles.midText}>
                    {textPrepared(parseInt(this.props.user.data.respondsLeft), 'У вас осталось')}
                  </Text>
                  <Text style={[baseStyles.midText, baseStyles.midText_nextline]}>
                    { parseInt(this.props.user.data.respondsLeft)} {textPrepared(parseInt(this.props.user.data.respondsLeft), 'отклик')}
                  </Text>
                </View>
                <View>
                  <RespondBtn
                    onPress={() => console.warn('alala')}
                    respondsLeft={this.props.user.data.respondsLeft}
                    respondsMax={this.props.user.data.respondsMax}
                    removeRespond={() => {
                      let respondId = 0;
                      if (!Array.isArray(this.props.tasks.taskview.api_responds)) {
                        Object.keys(this.props.tasks.taskview.api_responds).filter((objectKey, index) => {
                          if (this.props.tasks.taskview.api_responds[objectKey].id == this.props.user.data.id) {
                             respondId = parseInt(objectKey);
                          }
                        });
                      }
                      if (respondId) {
                        this.props.removeRespond(this.props.tasks.taskview.id, respondId);
                      }
                    }}
                    applyRespond={() => {
                      this.props.applyRespond(this.props.tasks.taskview.id, this.props.user.data.id )
                    }}
                    alreadyRepond={this.isPerformer()}
                    isAuthor={this.props.user.data.id == this.props.tasks.taskview.api_user.id}
                    isArhive={this.props.tasks.taskview.status == 4}
                  />
                </View>
              </View>

              <View style={baseStyles.splitter_smlmg}>
              </View>

              <Text>
                { /*JSON.stringify(this.props.tasks.taskview, 0 ,2)*/ }
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

  updateMenuState(isOpen) {
    this.setState({
      isOpen
    });
  }
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToUser: (userid, title) => navigateToUser(userid, title),
      navigateBack: (key) => navigateBack(key),
      navigateToTasks: () => navigateToTasks(),
      navigateToTasksCatalogPage: () => navigateToTasksCatalogPage(),
      getTask: (taskid) => getTask(taskid),
      awayFromTask: awayFromTask,
      removeRespond: (taskId, respondId) => removeRespond(taskId, respondId),
      applyRespond: (taskId, userid) => applyRespond(taskId, userid),
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
)(TasksDetailPage);