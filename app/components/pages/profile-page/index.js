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
    Platform,
    PermissionsAndroid
} from 'react-native';
import MapView, {Marker} from 'react-native-maps'
// import MapView, { PROVIDER_GOOGLE, Marker, Animated as AnimatedMapView, AnimatedRegion } from 'react-native-maps';
import Geocoder from 'react-native-geocoding-simple';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import PageHeader from '../../blocks/page-header';
import FormInput from '../../forms/form-input';
import DatePicker from '../../forms/date-picker';
import KladrInput from '../../forms/kladr-input';
import SocialLogin from '../../blocks/social-login';
import ImageViewer from '../../blocks/image-viewer';
import BuyPlanModal from '../../modals/buy-plan-modal';

import Tags from 'react-native-tags';
import LinearGradient from 'react-native-linear-gradient';
import DropdownAlert from 'react-native-dropdownalert';
import PhotoUpload from 'react-native-photo-upload';
import ImagePicker  from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';
import ModalDropdown from 'react-native-modal-dropdown';

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
  getUserData,
  saveUserData,
  navigateToTags,
  navigateToUser,
  getGeolocation,
  getMyTasks,
  getTeamData,
  getTaskCount,
  getTaskAll,
  getTaskResponds,
  getTaskDelegate,
  getTaskChoice,
  getTaskMake,
  getTaskArhiv, getNewTasks,
  getPerformersData,
  getFinanceAccountData
} from '../../../actions';

import { EventRegister } from 'react-native-event-listeners';

import textPrepared from '../../helpers/textPrepared';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import {
  Colors,
  Gradients
} from '../../styles/colors.js';

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      mode: 'view',
      careersEditIndex: undefined,
      educationsEditIndex: undefined,
      modalUpgrade: false,

      slideAnimation: new Animated.Value(22),
      tabs: {
        active: 0
      },
      userdata: {
        phones: [''],
        tags: [],
        educations: [],
        careers: [],
      },
      kladr: {
        full: undefined,
        address: undefined,
      },
      team:[],
      created: {},
      performed: {},
      services: [],
      titles: {
        task: 'задача',
        customer: 'Заказчик',
        executor: 'Исполнитель',
        repl: 'отзыв',
        article: 'Запись',
      },
      dataloaded: false,
      blogs:[],
      careers: [],


      educationModalIndex: 0,
      showEducationModal: false,

      showAvatarModal: false,

    }

    // Binding functions
    this.writing = this.writing.bind(this);
    this.openImagePicker = this.openImagePicker.bind(this);
    this.openEducationImagePicker = this.openEducationImagePicker.bind(this);
    this.goToTags = this.goToTags.bind(this);
    this.removeCareer = this.removeCareer.bind(this);
    this.removeEducation = this.removeEducation.bind(this);
    this.removeEducationImage = this.removeEducationImage.bind(this);
    this.requestLocationPermission = this.requestLocationPermission.bind(this)
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Example App',
          'message': 'Example App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.props.getGeolocation()
        console.log("You can use the location")
      } else {
        console.log("location permission denied")
      }
    } catch (err) {
      console.log(err)
    }
  }

  componentWillMount() {
    if (!this.props.user.data.name || !this.props.user.data.surname) {
      this.setState({
        mode: 'edit'
      });
    }
  }

  async componentDidMount() {

    await this.requestLocationPermission();
    this.props.getUserData();

    this.setState({
      task_profile: this.props.user.task_profile,
      team: this.props.user.team,
      userdata: {
        userid: this.props.user.data.id,
        email: this.props.user.data.email,
        vk: this.props.user.data.vk,
        insta: this.props.user.data.insta,
        odnoklass: this.props.user.data.odnoklass,
        youtube: this.props.user.data.youtube,
        skype: this.props.user.data.skype,
        facebook: this.props.user.data.facebook,
        about: this.props.user.data.about,
        gender: this.props.user.data.gender,
        name: this.props.user.data.name,
        surname: this.props.user.data.surname,
        phones: this.props.user.phones.map((item) => {
          return item.phone;
        }),
        address: this.props.user.data.address,
        address_comment: this.props.user.data.address_comment,
        lat: this.props.user.data.lat,
        lng: this.props.user.data.lng,
        tags: this.props.user.usertags,
        educations: this.props.user.educations,
        careers: this.props.user.careers,
      }
    });



    // Начинаем фоновую подгрузку "Мои задачи", "Моя команда".
    // this.props.getMyTasks(this.props.user.data.id);

    this.props.getTaskCount();
    this.props.getTaskAll();
    this.props.getTaskResponds();
    this.props.getTaskDelegate();
    this.props.getTaskChoice();
    this.props.getTaskMake();
    this.props.getTaskArhiv();
    this.props.getNewTasks();
    this.props.getFinanceAccountData(this.props.user.data.id);
    this.props.getPerformersData(0, null, {lat: this.props.app.geolocation.lat, lng: this.props.app.geolocation.lng});
    this.props.getPerformersData(0, 'pro', {lat: this.props.app.geolocation.lat, lng: this.props.app.geolocation.lng});
    this.props.getPerformersData(0, 'business', {lat: this.props.app.geolocation.lat, lng: this.props.app.geolocation.lng});
    //console.warn(JSON.stringify(this.props.app.geolocation, 0 , 2))
    this.props.getTeamData(this.props.user.data.id);
    this.userdataloadedListener = EventRegister.addEventListener('USER_DATA_LOADED', (data) => {
      this.setDefaultData();
    });
    EventRegister.addEventListener('MY_TASK_COUNT_LOADED', (data) => {
      // console.warn('event', this.props.user.mytasks_count)
    });

    this.successFormListener = EventRegister.addEventListener('USER_DATA_SAVED', () => {
      this.messages.alertWithType('success', 'Профиль пользователя', 'Данные успешно сохранены');
      this.setDefaultData();
      this.changeTab('view')
    });

    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true
      });
    });

    this.options = {
      title: 'Выберите новое фото профиля',
      quality: 0.7,
      maxWidth: 640,
      maxHeight: 640,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    this.optionsEducation = {
      title: 'Выберите новое изображение диплома',
      quality: 0.7,
      maxWidth: 1200,
      maxHeight: 1200,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.leftMenu);
    EventRegister.removeEventListener(this.userdataloadedListener);
    EventRegister.removeEventListener(this.successFormListener);
  };

  goToTags() {
    this.props.navigateToTags();
  }

    openImagePicker() {
        Platform.OS == 'android' ?
            ImagePicker.showImagePicker(this.options, (response) => {

                if (response.didCancel) {
                    console.warn('User cancelled image picker');
                } else if (response.error) {
                    console.warn('ImagePicker Error: ', response.error);
                } else {
                    this.writing('avatar', response)
                }
            })
            :
            ImagePicker.launchImageLibrary(this.options, (response) => {

                if (response.didCancel) {
                    console.warn('User cancelled image picker');
                } else if (response.error) {
                    console.warn('ImagePicker Error: ', response.error);
                } else {
                    this.writing('avatar', response)
                }
            })
    }

    openEducationImagePicker(index) {
        Platform.OS == 'android' ?

            ImagePicker.showImagePicker(this.optionsEducation, (response) => {

                if (response.didCancel) {
                } else if (response.error) {
                } else {
                    //const source = { uri: response.uri };
                    this.writing('educationImage', response, index)
                }
            })
            :
            ImagePicker.launchImageLibrary(this.optionsEducation, (response) => {

                if (response.didCancel) {
                } else if (response.error) {
                } else {
                    //const source = { uri: response.uri };
                    this.writing('educationImage', response, index)
                }
            })

    }

  removeEducationImage(index, imgIndex) {
    this.setState(Object.assign(this.state, {
      userdata: {
        ...this.state.userdata,
        educations: this.state.userdata.educations.map((item, elIndex) => {
          if (elIndex == index) {
            return {
              ...item,
              api_images: item.api_images.map((img, _imgIndex) => {
                if (_imgIndex == imgIndex) {
                  return {
                    ...img,
                    removed: true
                  }
                } else {
                  return img
                }
              })
            }
          } else {
            return item
          }
        })
      }
    }));
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

    let additionalData = <View>
      { this.props.user.phones ? this.props.user.phones.map((item, index) => {
        return <View key={'addphone'+ index}>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
              <Path
                fill={Colors.COLOR_GRAY_ICONS}
                d="M6.62,10.79 C8.06,13.62 10.38,15.93 13.21,17.38 L15.41,15.18 C15.68,14.91 16.08,14.82 16.43,14.94 C17.55,15.31 18.76,15.51 20,15.51 C20.55,15.51 21,15.96 21,16.51 L21,20 C21,20.55 20.55,21 20,21 C10.61,21 3,13.39 3,4 C3,3.45 3.45,3 4,3 L7.5,3 C8.05,3 8.5,3.45 8.5,4 C8.5,5.25 8.7,6.45 9.07,7.57 C9.18,7.92 9.1,8.31 8.82,8.59 L6.62,10.79 L6.62,10.79 Z"
              />
            </Svg>
            <Text style={[baseStyles.midText, {flex: 1}]}>
              {item.phone}
            </Text>
            <Text style={[baseStyles.smallText, {paddingRight: 10}]}>
              Дополнительный
            </Text>
          </View>
          <View style={[baseStyles.splitter_full, baseStyles.splitter_full_smlmg]}>
          </View>
        </View>
      }) : null}
      {
        this.props.user.data.skype ?
        <View>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
              <Path
                fill={Colors.COLOR_GRAY_ICONS}
                d="M16.674965,15.499785 C16.302565,16.036535 15.755365,16.455485 15.039065,16.7560017 C14.3224483,17.0584183 13.475365,17.2091517 12.496865,17.2091517 C11.3248817,17.2091517 10.3542983,17.004585 9.587965,16.5888017 C9.04393167,16.2927183 8.602815,15.8956183 8.263665,15.3984517 C7.922615,14.9016017 7.75034833,14.4155183 7.75034833,13.9405183 C7.75034833,13.6621683 7.85738167,13.4186517 8.06448167,13.2194683 C8.27443167,13.020285 8.544865,12.920535 8.864065,12.920535 C9.12594833,12.920535 9.34919833,12.9987517 9.53254833,13.155185 C9.713365,13.310985 9.86599833,13.5367683 9.989815,13.8360183 C10.1392817,14.183085 10.3020483,14.4725183 10.4736817,14.7030517 C10.6449983,14.9320017 10.8862983,15.122635 11.1978983,15.2714683 C11.5072817,15.4212517 11.918315,15.4953517 12.4325817,15.4953517 C13.136215,15.4953517 13.7055817,15.343985 14.140365,15.042835 C14.5779983,14.7404183 14.7876317,14.3715017 14.7876317,13.925635 C14.7876317,13.5700183 14.6745817,13.288185 14.4430983,13.0690517 C14.207815,12.8451683 13.904765,12.6751183 13.5288817,12.5570017 C13.1517317,12.436985 12.6453817,12.3103183 12.0107817,12.176685 C11.158315,11.9911183 10.445815,11.7745183 9.86789833,11.5253017 C9.290615,11.276085 8.829865,10.9353517 8.48913167,10.503735 C8.14713167,10.0689517 7.97708167,9.52776833 7.97708167,8.88746833 C7.97708167,8.27630167 8.157265,7.72910167 8.516365,7.254735 C8.877365,6.777835 9.39828167,6.41240167 10.077215,6.15875167 C10.7542483,5.90446833 11.5512983,5.77716833 12.465515,5.77716833 C13.1944817,5.77716833 13.826865,5.86140167 14.361715,6.02955167 C14.8943483,6.19896833 15.339265,6.42285167 15.6929817,6.70310167 C16.0466983,6.983035 16.3069983,7.277535 16.4710317,7.58755167 C16.6356983,7.89725167 16.718665,8.20156833 16.718665,8.49670167 C16.718665,8.77251833 16.612265,9.02236833 16.4035817,9.24055167 C16.1955317,9.46031833 15.9304817,9.57146833 15.6201483,9.57020167 C15.340215,9.57020167 15.120765,9.50655167 14.9684483,9.37006833 C14.8199317,9.23706833 14.6641317,9.02680167 14.495665,8.732935 C14.281915,8.32411833 14.0276317,8.00491833 13.7312317,7.77596833 C13.4414817,7.55271833 12.965215,7.435235 12.3024317,7.437135 C11.6880983,7.437135 11.1978983,7.56285167 10.8273983,7.80826833 C10.4540483,8.05685167 10.275765,8.34565167 10.274815,8.68480167 C10.275765,8.897285 10.3368817,9.07620167 10.460065,9.22820167 C10.5841983,9.383685 10.758365,9.51636833 10.9809817,9.63036833 C11.2042317,9.74405167 11.4306483,9.83271833 11.658965,9.89700167 C11.8894983,9.96191833 12.272665,10.0559683 12.8040317,10.1813683 C13.4702983,10.326085 14.0760817,10.4869517 14.6197983,10.661435 C15.1631983,10.8368683 15.6255317,11.0496683 16.008065,11.302685 C16.393765,11.554435 16.695865,11.8749017 16.9108817,12.2637683 C17.1274817,12.6523183 17.2341983,13.1273183 17.2341983,13.6856017 C17.2351483,14.3585183 17.0479983,14.9636683 16.674965,15.499785 M21.1928483,12.867335 C21.2640983,12.4195683 21.3011483,11.9613517 21.3011483,11.4933183 C21.3011483,6.626785 17.358015,2.68396833 12.4927483,2.68396833 C12.024715,2.68396833 11.565865,2.72165167 11.1180983,2.79226833 C10.306165,2.29066833 9.34919833,1.99996833 8.322565,1.99996833 C5.383265,1.99996833 3.00003167,4.38320167 3.00003167,7.324085 C3.00003167,8.34945167 3.28978167,9.30546833 3.79169833,10.1196183 C3.72298167,10.5686517 3.68498167,11.0249683 3.68498167,11.4933183 C3.68498167,16.3589017 7.62748167,20.3017183 12.492115,20.3017183 C12.9598317,20.3017183 13.4189983,20.2653017 13.866765,20.1940517 C14.6796483,20.6950183 15.636615,20.9863517 16.662615,20.9863517 C19.6025483,20.9863517 21.9857817,18.6021683 21.9857817,15.6638183 C21.9857817,14.6375017 21.695715,13.6802183 21.1928483,12.867335"
              />
            </Svg>
            <Text style={[baseStyles.midText, {flex: 1, color: Colors.COLOR_LIGHT_BLUE}]}>
              {this.props.user.data.skype}
            </Text>
          </View>
          <View style={[baseStyles.splitter_full, baseStyles.splitter_full_smlmg]}>
          </View>
        </View>
        : null
      }
      {
        this.props.user.data.ext_email ?
        <View>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
              <Path
                fill={Colors.COLOR_GRAY_ICONS}
                d="M20,4 L4,4 C2.9,4 2.01,4.9 2.01,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 C22,4.9 21.1,4 20,4 L20,4 Z M20,8 L12,13 L4,8 L4,6 L12,11 L20,6 L20,8 L20,8 Z"
              />
            </Svg>
            <Text style={[baseStyles.midText, {flex: 1, color: Colors.COLOR_LIGHT_BLUE}]}>
              {this.props.user.data.ext_email}
            </Text>
          </View>
          <View style={[baseStyles.splitter_full, baseStyles.splitter_full_smlmg]}>
          </View>
        </View>
        : null
      }
      <View style={styles.socialBlock}>
        <SocialLogin
          partial={true}
          vk={this.props.user.data.vk ? this.props.user.data.vk : false}
          facebook={this.props.user.data.facebook ? this.props.user.data.facebook : false}
          youtube={this.props.user.data.youtube ? this.props.user.data.youtube : false}
          insta={this.props.user.data.insta ? this.props.user.data.insta : false}
          odnoklass={this.props.user.data.odnoklass ? this.props.user.data.odnoklass : false}
          />
      </View>
    </View>

    let blogsinfo = <View style={styles.blog_post}>
      <View style={[baseStyles.row, baseStyles.verticalCenter]}>
        <Text style={styles.blog_post_len}>
          { this.state.task_profile ? this.state.task_profile['blog_count'] : 0 }
        </Text>
        <Text style={styles.blog_post_text}>
          { textPrepared(this.state.task_profile ? this.state.task_profile['blog_count'] : 0, this.state.titles.article) } в&nbsp;блоге
        </Text>
      </View>
        { this.state.task_profile && this.state.task_profile['blog_count'] ?
          <View style={styles.blog_post_counters}>
            <Text style={styles.blog_post_title}>
              {this.state.task_profile ? this.state.task_profile['blog_title'] : ''}
            </Text>
            <View style={[baseStyles.row, baseStyles.verticalCenter]}>
              <Svg width={18} height={18} viewBox='0 0 40 40' style={{marginTop: 2, marginLeft: 2}}>
                <Path fill={Colors.COLOR_GRAY_ICONS}
                  d="M32.729,12.788c-2.996-2.35-7.636-5.152-12.73-5.152c-5.071,0-9.722,2.836-12.73,5.215c-2.976,2.354-5.686,5.41-5.686,6.412
                    c0,1.142,2.605,4.136,5.688,6.536c2.442,1.901,7.342,5.091,12.728,5.091c5.389,0,10.288-3.186,12.729-5.084
                    c3.083-2.397,5.688-5.395,5.688-6.543C38.416,18.191,35.758,15.165,32.729,12.788z M19.999,26.879c-4.204,0-7.614-3.41-7.614-7.615
                    c0-4.206,3.41-7.615,7.614-7.615c4.205,0,7.615,3.409,7.615,7.615C27.614,23.469,24.204,26.879,19.999,26.879z
                  "/>
              </Svg>
              <Text style={styles.blog_post_title}>
                { this.state.task_profile ? this.state.task_profile['blog_view_count'] : 0 }
              </Text>
              <Svg width={14} height={14} viewBox='0 0 20 20' style={{marginTop: 2, marginLeft: 10}}>
                <Path fill={Colors.COLOR_GRAY_ICONS}
                  d="M17.406,0.742H2.594c-1.019,0-1.852,0.833-1.852,1.852v16.664l3.703-3.703h12.961
                    c1.019,0,1.852-0.834,1.852-1.852V2.594C19.258,1.575,18.425,0.742,17.406,0.742L17.406,0.742z
                  "/>
              </Svg>
              <Text style={[styles.blog_post_title, {marginLeft: 2}]}>
                { this.state.task_profile ? this.state.task_profile['blog_comment_count'] : 0 }
              </Text>
            </View>
          </View>
        : null }
    </View>;

    let ratingicon = <Svg style={{marginTop: 0, marginLeft: 10}} width={24} height={24} viewBox="0 0 24 24">
      <Path
        // d='M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.6225 C17,8.7925 14,8.7925 14,9.6225 C14,10.4525 14.67,11.1225 15.5,11.1225 C16.33,11.1225 17,10.4525 17,9.6225 Z M10,9.6225 C10,8.7925 7,8.7925 7,9.6225 C7,10.4525 7.67,11.1225 8.5,11.1225 C9.33,11.1225 10,10.4525 10,9.6225 Z M6.85643066,16.3927002 C6.85643066,16.3927002 8.43225098,14.7425537 11.8551025,14.8043213 C15.2779541,14.8660889 17.0764307,16.3927002 17.0764307,16.3927002 C16.2764307,14.3527002 14.262251,13.3043213 11.932251,13.3043213 C9.60225098,13.3043213 7.65643066,14.3527002 6.85643066,16.3927002 Z'

        d={(this.state.created.rating || 0) <= 2 && (this.state.created.count || 0) > 1 ?
          'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.6225 C17,8.7925 14,8.7925 14,9.6225 C14,10.4525 14.67,11.1225 15.5,11.1225 C16.33,11.1225 17,10.4525 17,9.6225 Z M10,9.6225 C10,8.7925 7,8.7925 7,9.6225 C7,10.4525 7.67,11.1225 8.5,11.1225 C9.33,11.1225 10,10.4525 10,9.6225 Z M6.85643066,16.3927002 C6.85643066,16.3927002 8.43225098,14.7425537 11.8551025,14.8043213 C15.2779541,14.8660889 17.0764307,16.3927002 17.0764307,16.3927002 C16.2764307,14.3527002 14.262251,13.3043213 11.932251,13.3043213 C9.60225098,13.3043213 7.65643066,14.3527002 6.85643066,16.3927002 Z'
          : (this.state.created.rating || 0) > 2 &&  (this.state.created.rating || 0) <= 3 ?
          'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 14.67,11 15.5,11 C16.33,11 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 7.67,11 8.5,11 C9.33,11 10,10.33 10,9.5 Z M8,15 L16,15 L16,16 L8,16 L8,15 Z'
          : (this.state.created.rating || 0) > 3 &&  (this.state.created.rating || 0) <= 4 ?
          'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 14.67,11 15.5,11 C16.33,11 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 7.67,11 8.5,11 C9.33,11 10,10.33 10,9.5 Z M17.11,14 C17.11,14 15.5341797,15.6501465 12.1113281,15.5883789 C8.68847656,15.5266113 6.89,14 6.89,14 C7.69,16.04 9.70417969,17.0883789 12.0341797,17.0883789 C14.3641797,17.0883789 16.31,16.04 17.11,14 Z'
          : (this.state.created.rating || 0) > 4 &&  (this.state.created.rating || 0) <= 5 ?
          'M11.99,2 C6.47,2 2,6.48 2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 L11.99,2 Z M12,20 C7.58,20 4,16.42 4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 L12,20 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 10,10.33 10,9.5 Z M12,16.5 C14.33,16.5 16.31,15.04 17.11,13 L6.89,13 C7.69,15.04 9.67,16.5 12,16.5 L12,16.5 Z'
          : "M-283,420.9c0,5.5,4.5,10,10,10c5.5,0,10-4.5,10-10c0-5.5-4.5-10-10-10 C-278.5,410.9-283,415.4-283,420.9z M-281,420.9c0-4.4,3.6-8,8-8s8,3.6,8,8c0,4.4-3.6,8-8,8S-281,425.3-281,420.9z M-268,418.4 c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5c0,0.8,0.7,1.5,1.5,1.5S-268,419.2-268,418.4z M-275,418.4c0-0.8-0.7-1.5-1.5-1.5 s-1.5,0.7-1.5,1.5c0,0.8,0.7,1.5,1.5,1.5S-275,419.2-275,418.4z"}
        // fill='#D4182F'
        fill={(this.state.created.rating || 0) <= 2 && (this.state.created.count || 0) > 1 ?
          '#D4182F'
          : (this.state.created.rating || 0) > 2 &&  (this.state.created.rating || 0) <= 3 ?
          '#FFB700'
          : (this.state.created.rating || 0) > 3 &&  (this.state.created.rating || 0) <= 4 ?
          '#54B422'
          : (this.state.created.rating || 0) > 4 &&  (this.state.created.rating || 0) <= 5 ?
          '#3DCCC6'
          : '#B0BEC5'}
      />
    </Svg>

    let usersInTeam = this.state.team.map((item, index) => {
      if (item.photo) {
        return (
            <TouchableOpacity
              key={'team'+index}
              onPress={() =>
                this.props.navigateToUser(
                  item.id,
                  'Состоит в команде'
                  )
              }>
              <Image style={[styles.profileAvatar_inteam,
                    ,item.plan && item.plan.title == 'PRO' ?
                    {borderColor: Colors.COLOR_LIGHT_BLUE} :
                      item.plan && item.plan.title == 'Business' ?
                      {borderColor: Colors.COLOR_YELLOW} :
                      {borderColor: Colors.COLOR_WHITE}
                  ]} source={{uri:`${item.photo}`}} resizeMode='cover'/>
            </TouchableOpacity>
          )
      } else
      return null
    })

    let services = <View>
      {
        this.state.services.map((item, index) => {
          return (
            <View key={'service' + index} style={styles.hiddenBlock_container}>
              <Text style={styles.normalTitle_bold}>
                { item.tag.title }
              </Text>{
                item.items.map((el, elIndex) => {
                  return (
                    <View key={'service_info'+elIndex}>
                      <View style={baseStyles.row}>
                        <View>
                          <Text style={[baseStyles.midText, baseStyles.midText_gray]}>
                            { el.title }
                          </Text>
                          <Text style={[baseStyles.smallText, baseStyles.smallText_black, {marginTop: 0}]}>
                            { el.price } Р/услуга
                          </Text>
                        </View>

                      </View>
                      {
                        elIndex + 1 != item.items.length ?
                        <View style={baseStyles.splitter_smlmg}>
                        </View> : null
                      }
                    </View>)
                })
              }
            </View>)
        })
      }
      </View>

    let education = <View>
      { this.props.user.educations.map((item, index) => {

        let title = '';

        let educationImagesModal = <ImageViewer
          close={() => {
            StatusBar.setBackgroundColor('rgba(0,0,0,0)');
            this.setState({showEducationModal: false})}
          }
          visible={this.state.showEducationModal}
          index={this.state.educationModalIndex}
          images={
            item.api_images.map((img, imgIndex) => {
              return({url: `https://myteam.pro/${img.url}`})
            })
          } />
        let educationImages = item.api_images.map((img, imgIndex) => {
          if (!img.removed)
            return (
              <TouchableOpacity
                key={'educationImageEditModal'+imgIndex}
                onPress={() => {
                  StatusBar.setBackgroundColor('rgba(0,0,0,1)');
                  this.setState({showEducationModal: true,educationModalIndex: imgIndex})}
                }>
                  <Image
                  style={{width: 90, height: 100, marginRight: 10, marginBottom: 10}}
                  source={{uri:`https://myteam.pro/${img.url}`}}
                  resizeMode='contain'
                  />
              </TouchableOpacity>)
        });

        // Тип образования
        if (item.type_id == 1) {
          title = 'Среднее образование'
        } else if (item.type_id == 2) {
          title = 'Высшее образование'
        } else {
          title = 'Дополнительное образование'
        }
        return(
          <View key={'education' + index} style={styles.hiddenBlock_container}>
            <Text style={styles.normalTitle_bold}>
              { title }
            </Text>
            <View style={baseStyles.row}>
              <View style={{flex: 1}}>
                <Text style={baseStyles.smallText}>
                  Город
                </Text>
                <Text style={baseStyles.midText}>
                  { item.city || '-'}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={baseStyles.smallText}>
                  Время обучения
                </Text>
                <Text style={baseStyles.midText}>
                  { item.year_start || '-'} - { item.year_end  || '-'}
                </Text>
              </View>
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Text style={baseStyles.smallText}>
                Учебное заведение
              </Text>
              <Text style={baseStyles.midText}>
                { item.school || '-'}
              </Text>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 10}}>
              { educationImages }
              { educationImagesModal }
            </View>
          </View>
          )
        })
      }
    </View>

    let educationEdit = <View>
      { this.state.userdata.educations.map((item, index) => {

        //console.warn(this.state.userdata.educations)
        let educationImages =
          item.api_images.map((img, imgIndex) => {
            if (!img.dirty && !img.removed) {
              return (
                <TouchableOpacity key={'educationImageEdit'+imgIndex} onPress={() => {this.removeEducationImage(index, imgIndex)}}>
                  <Image style={{width: 90, height: 100, marginRight: 10, marginBottom: 10}} source={{uri:`https://myteam.pro/${img.thumb}`}} resizeMode='cover'/>
                </TouchableOpacity>)
            } else if (!img.removed){
              return (
                <TouchableOpacity key={'educationImageEdit'+imgIndex} onPress={() => {this.removeEducationImage(index, imgIndex)}}>
                  <Image onPress={() => {this.removeEducationImage(index, imgIndex)}} style={{width: 90, height: 100, marginRight: 10, marginBottom: 10}} source={{uri:`data:${img.data.type};base64,${img.data.data}`}} resizeMode='cover'/>
                </TouchableOpacity>)
            } else {
              return null
            }
          });

        if (!item.removed)
        return(
          <View key={'education' + index} style={styles.hiddenBlock_container}>
            <View style={[formsStyles.inputContainer, baseStyles.verticalCenter, {flexDirection:'row'}]}>

              <View style={[formsStyles.pickerWrap, {flex: 1}]}>
                <Picker
                  selectedValue={item.type_id}
                  style={formsStyles.picker}
                  itemStyle={formsStyles.picker}
                  onValueChange={(itemValue, itemIndex) => {this.writing('educationsType', itemValue, index)}}>
                  <Picker.Item label="Дополнительное образование" value={3} />
                  <Picker.Item label="Высшее образование" value={2} />
                  <Picker.Item label="Среднее образование" value={1} />
                </Picker>
              </View>
              <TouchableOpacity onPress={() => {this.removeEducation(index)}}>
                <Svg width={24} height={24} viewBox="0 0 36 36" style={{marginLeft: 16}}>
                  <Polygon
                    fill="#8B98A1"
                    points="25.879,7.841 23.838,5.801 15.679,13.96 7.52,5.801 5.48,7.841 13.639,16 5.48,24.158
                            7.52,26.199 15.679,18.041 23.838,26.199 25.879,24.158 17.719,16"/>
                </Svg>
              </TouchableOpacity>
            </View>


            <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
              Город
            </Text>
            <View style={[formsStyles.pickerWrap, formsStyles.inputContainer]}>
              <Picker
                selectedValue={item.city}
                style={formsStyles.picker}
                itemStyle={formsStyles.picker}
                onValueChange={(itemValue, itemIndex) => {this.writing('educationsCity', itemValue, index)}}>
                <Picker.Item label="Москва" value="Москва" />
                <Picker.Item label="Санкт-Петербург" value="Санкт-Петербург" />
              </Picker>
            </View>


            <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
              Учебное заведение
            </Text>
            <View style={[formsStyles.inputContainer]}>
              <TextInput
                style={[formsStyles.editableTextInput, {flex: 1}]}
                placeholder="Укажите учебное заведение"
                multiline={true}
                numberOfLines={2}
                onChangeText={(text) => {this.writing('educationsSchool', text, index)}}
                value={item.school ? item.school.replace(new RegExp('&quot;', 'g'), '"') : ''}
                placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
              />
            </View>

            <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
              Время обучения
            </Text>
            <DatePicker
              from={item.year_start}
              to={item.year_end}
              style={formsStyles.editableDatePicker_container}
              textStyle={[formsStyles.editableDatePicker_text]}
              onSelected={(data) => {this.writing('educationsDate', data, index)}}/>

              <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 10}}>
                { educationImages }
              </View>

              <TouchableOpacity onPress={() => {this.openEducationImagePicker(index)}}>
                <View style={[baseStyles.verticalCenter, {flexDirection:'row'}]}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 12}}>
                    <Path
                      fill={Colors.COLOR_LIGHT_BLUE}
                      d="M3,4 L3,1 L5,1 L5,4 L8,4 L8,6 L5,6 L5,9 L3,9 L3,6 L0,6 L0,4 L3,4 L3,4 Z M6,10 L6,7 L9,7 L9,4 L16,4 L17.83,6 L21,6 C22.1,6 23,6.9 23,8 L23,20 C23,21.1 22.1,22 21,22 L5,22 C3.9,22 3,21.1 3,20 L3,10 L6,10 L6,10 Z M13,19 C15.76,19 18,16.76 18,14 C18,11.24 15.76,9 13,9 C10.24,9 8,11.24 8,14 C8,16.76 10.24,19 13,19 L13,19 Z M9.8,14 C9.8,15.77 11.23,17.2 13,17.2 C14.77,17.2 16.2,15.77 16.2,14 C16.2,12.23 14.77,10.8 13,10.8 C11.23,10.8 9.8,12.23 9.8,14 L9.8,14 Z"
                    />
                  </Svg>
                  <Text style={[buttonsStyles.buttonMiddleText, buttonsStyles.buttonMiddleText_blue]}>Загрузить изображение диплома</Text>
                </View>
              </TouchableOpacity>
          </View>
          )
        })
      }

       <TouchableOpacity onPress={() => this.addAdditionalEducation()}>
        <View style={[styles.careersEditButton, baseStyles.verticalCenter, {flexDirection:'row'}]}>
          <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 12}}>
            <Path
            fill={Colors.COLOR_LIGHT_BLUE}
            d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M17,13 L13,13 L13,17 L11,17 L11,13 L7,13 L7,11 L11,11 L11,7 L13,7 L13,11 L17,11 L17,13 L17,13 Z"
            />
          </Svg>
          <Text style={[buttonsStyles.buttonMiddleText, buttonsStyles.buttonMiddleText_blue]}>Добавить учебное заведение</Text>
        </View>
      </TouchableOpacity>
    </View>

    let careers = <View>
      { this.props.user.careers.map((item, index) => {

        return(
          <View key={'careers' + index} style={styles.hiddenBlock_container}>
            <Text style={styles.normalTitle_bold}>
              { item.title ? item.title.replace(new RegExp('&quot;', 'g'), '"') : '-' }
            </Text>
            <View style={{flex: 1, marginTop: 5}}>
              <Text style={baseStyles.smallText}>
                Должность
              </Text>
              <Text style={baseStyles.midText}>
                { item.post ? item.post.replace(new RegExp('&quot;', 'g'), '"') : '-'}
              </Text>
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Text style={baseStyles.smallText}>
                Время работы
              </Text>
              <Text style={baseStyles.midText}>
                { item.year_start || '-'} - { item.year_end  || '-'}
              </Text>
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Text style={baseStyles.smallText}>
                Должностные обязанности и достижения
              </Text>

              { item.text ?
                <Text style={baseStyles.midText}>
                  { item.text.replace(new RegExp('&quot;', 'g'), '"')}
                </Text>
                : null
              }

              { item.progress ?
                <Text style={baseStyles.midText}>
                  { item.progress.replace(new RegExp('&quot;', 'g'), '"')}
                </Text>
                : null
              }
            </View>
          </View>
          )
        })
      }
    </View>

    let careersEdit = <View>
      { this.state.userdata.careers.map((item, index) => {
        if (!item.removed)
        return(
          <View key={'careersCard' + index} style={styles.careersEditCard}>
            <View style={[formsStyles.inputContainer, baseStyles.verticalCenter, {flexDirection:'row'}]}>
              <TextInput
                style={[formsStyles.editableTitle, {flex: 1}]}
                placeholder="Укажите название компании"
                value={item.title ? item.title.replace(new RegExp('&quot;', 'g'), '"') : ''}
                placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
                onChangeText={(text) => {this.writing('careersTitle', text, index)}}
                selectTextOnFocus={false}
              />
              <TouchableOpacity onPress={() => {this.removeCareer(index)}}>
                <Svg width={24} height={24} viewBox="0 0 36 36" style={{marginLeft: 16}}>
                  <Polygon
                    fill="#8B98A1"
                    points="25.879,7.841 23.838,5.801 15.679,13.96 7.52,5.801 5.48,7.841 13.639,16 5.48,24.158
                            7.52,26.199 15.679,18.041 23.838,26.199 25.879,24.158 17.719,16"/>
                </Svg>
              </TouchableOpacity>
            </View>
            <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
              Должность
            </Text>
            <View style={[formsStyles.inputContainer]}>
              <TextInput
                style={[formsStyles.editableTextInput, {flex: 1}]}
                placeholder="Укажите вашу должность"
                multiline={true}
                numberOfLines={2}
                editable={!this.state.careersEditIndex == index}
                onChangeText={(text) => {this.writing('careersPost', text, index)}}
                value={item.post ? item.post.replace(new RegExp('&quot;', 'g'), '"') : ''}
                placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
              />
            </View>

            <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
              Должностные обязанности
            </Text>
            <View style={[formsStyles.inputContainer]}>
              <TextInput
                style={[formsStyles.editableTextInput, {flex: 1}]}
                placeholder="Укажите ваши должностные обязанности"
                multiline={true}
                numberOfLines={2}
                onChangeText={(text) => {this.writing('careersText', text, index)}}
                value={item.text ? item.text.replace(new RegExp('&quot;', 'g'), '"') : ''}
                placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
              />
            </View>

            <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
              Достижения
            </Text>
            <View style={[formsStyles.inputContainer]}>
              <TextInput
                style={[formsStyles.editableTextInput, {flex: 1}]}
                placeholder="Укажите ваши достижения"
                multiline={true}
                numberOfLines={2}
                onChangeText={(text) => {this.writing('careersProgress', text, index)}}
                value={item.progress ? item.progress.replace(new RegExp('&quot;', 'g'), '"') : ''}
                placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
              />
            </View>

            <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
              Время работы
            </Text>
            <DatePicker
              from={item.year_start}
              to={item.year_end}
              style={formsStyles.editableDatePicker_container}
              textStyle={[formsStyles.editableDatePicker_text]}
              onSelected={(data) => {this.writing('careersDate', data, index)}}/>
              <Text>
                { /*JSON.stringify(this.props.user.careers, null, 2)*/ }
                { /*JSON.stringify(this.state.userdata.careers, null, 2) */}
              </Text>
          </View>
          )
        })
      }

      <TouchableOpacity onPress={() => this.addAdditionalCareers()}>
        <View style={[styles.careersEditButton, baseStyles.verticalCenter, {flexDirection:'row'}]}>
          <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 12}}>
            <Path
            fill={Colors.COLOR_LIGHT_BLUE}
            d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M17,13 L13,13 L13,17 L11,17 L11,13 L7,13 L7,11 L11,11 L11,7 L13,7 L13,11 L17,11 L17,13 L17,13 Z"
            />
          </Svg>
          <Text style={[buttonsStyles.buttonMiddleText, buttonsStyles.buttonMiddleText_blue]}>Добавить место работы</Text>
        </View>
      </TouchableOpacity>
    </View>

    let tags = this.props.user.usertags.map((item, index) => {
      return (
        <View key={'tagskill'+index} style={[!item.active ? formsStyles.tags_item_inactive : formsStyles.tags_item]}>
          <Text style={[styles.skill, item.is_qualification ? styles.skill_main : undefined, !item.active ? styles.skill_inactive : undefined]}>
            { item.title }
          </Text>
        </View>
        )
    });

    let tagsEdit = this.props.user.usertags.map((item, index) => {
      return(<View key={'tagsEdit'+index} style={[!item.active ? formsStyles.tags_item_inactive : formsStyles.tags_item]}>
          <Text style={[styles.skill, item.is_qualification ? styles.skill_main : undefined, !item.active ? styles.skill_inactive_edit : undefined]}>
            { item.title }
          </Text>
        </View>)
    });

    let additionalPhones = this.state.userdata.phones.map((item, index) => {
      return (
        <FormInput
          key={'phone'+index}
          title={'Дополнительный телефон ' + (index + 1)}
          name={'phone' + index}
          writing={(text) => {this.writing('phones', text, index)}}
          placeholder={'Дополнительный телефон ' + (index + 1)}
          type="telephoneNumber"
          value={item}/>
        )
      });

    let viewTab = <View>
      <View style={styles.profile1}>
        <View style={[baseStyles.row]}>
          <View style={styles.profileLeft}>
            {
              <TouchableOpacity
                onPress={() => {
                  StatusBar.setBackgroundColor('rgba(0,0,0,1)');
                  this.setState({showAvatarModal: true})}
                }>
                  {
                    this.props.user.photo  && this.props.user.photo.photo.length  ?
                    <Image style={[styles.profileAvatar,
                      this.props.app.appplan.title == 'PRO' ?
                      {borderColor: Colors.COLOR_LIGHT_BLUE} :
                        this.props.app.appplan.title == 'Business' ?
                        {borderColor: Colors.COLOR_YELLOW} :
                        {borderColor: Colors.COLOR_WHITE}]}
                        source={{uri:`${this.props.user.photo.path}${this.props.user.photo.photo[0].photo_cropped}`}}
                        resizeMode='cover'/>
                    :
                    <Image style={styles.profileAvatar} source={require('../../../../assets/images/ava.png')} resizeMode='contain'/>
                  }
              </TouchableOpacity>
            }
            <ImageViewer
              close={() => {
                StatusBar.setBackgroundColor('rgba(0,0,0,0)');
                this.setState({showAvatarModal: false})}
              }
              visible={this.state.showAvatarModal}
              index={0}
              images={
                this.props.user.photo && this.props.user.photo.photo.length  ?
                  [{url:`${this.props.user.photo.path}${this.props.user.photo.photo[0].photo_cropped}`}]
                  :
                  [require('../../../../assets/images/ava.png')]
              } />
            {
              this.props.app.appplan.title == 'PRO' ?
                <Svg width={50} height={22} style={{marginTop: 10}} viewBox={'-4.875 -2 47.208 22'}>
                  <Path
                    fill="#36B5BE" stroke="#FCFCFC" stroke-width="3" d="M17.098,8.165c0.916,0.457,0.925,1.198,0,1.66l-17.125,8.561
                      c-1.825,0.914-3.305-0.007-3.305-2.043V1.647c0-2.043,1.483-2.955,3.305-2.044L17.098,8.165z M20.418,9.825
                      c-0.917-0.459-0.925-1.197,0-1.66l17.123-8.562c1.824-0.911,3.308,0.007,3.308,2.044v14.698c0,2.04-1.485,2.955-3.308,2.041
                      L20.418,9.825z"
                    />
                  <Circle
                    fill="#36B5BE" stroke="#FCFCFC" stroke-width="3" cx="18.758" cy="8.995" r="5.522"
                    />
                </Svg>
              : this.props.app.appplan.title == 'Business' ?
                <Svg width={50} height={44} style={{marginTop: 10}} viewBox="-0.563 0 15 46.625">
                  <Polygon
                    fill={Colors.COLOR_YELLOW}
                    points="7,13 1,1 13,1 "/>
                  <Path
                    fill="none"
                    stroke="#FFFFFF"
                    d="M7,14.118L0.191,0.5h13.618L7,14.118z"/>
                  <Polygon
                    fill={Colors.COLOR_YELLOW}
                    points="7,45 1,33 7,13 13,33 "/>
                  <Path
                    fill="none"
                    stroke="#FFFFFF"
                    d="M7,46.118L0.464,33.047L7,11.26l6.536,21.787L7,46.118z"/>
                </Svg>
              : undefined
            }

          </View>
          <View style={styles.profileRight}>
            <Text style={styles.profileTitle}>
              {this.props.user.data.name}
            </Text>
            <Text style={styles.profileTitle}>
              {this.props.user.data.surname}
            </Text>
            <View style={[styles.skillContainer, {flexDirection: 'row'}]}>
              { tags }
              {
              !this.props.user.usertags.length ?
                <Text style={styles.emptyText}>
                  Выберите специализацию в редактировании профиля
                </Text> : undefined
              }
            </View>
          </View>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} containerStyle={[baseStyles.row, styles.refers]}>
          <LinearGradient style={[styles.refEl]} colors={['#3ccbc5', '#2a8e8a']}>
            <View>
              <Svg width={36} height={36} style={styles.refElImage}>
                <Path fill='#ffffff'
                  d="M28.483,11.69h-6.012V7.567c0-1.979-0.59-3.414-1.757-4.266c-1.835-1.347-4.332-0.59-4.439-0.554
                    c-0.423,0.131-0.715,0.53-0.715,0.977v4.975c0,3.682-4.332,4.963-4.516,5.01c-0.012,0.006-0.023,0.006-0.03,0.012l-0.495,0.155
                    c-0.56-0.531-1.311-0.853-2.133-0.853H6.511c-1.716-0.005-3.11,1.389-3.11,3.104v10.7c0,1.716,1.394,3.11,3.11,3.11h1.876
                    c0.792,0,1.519-0.298,2.067-0.793c0.787,0.936,1.966,1.537,3.283,1.537h12.178c2.825,0,4.702-1.55,5.029-4.141l1.514-9.502
                    l0.083-0.513c0.036-0.238,0.06-0.482,0.06-0.726C32.594,13.537,30.748,11.69,28.483,11.69z M9.454,26.836
                    c0,0.589-0.477,1.065-1.066,1.065H6.511c-0.59,0-1.067-0.477-1.067-1.065V16.129c0-0.59,0.477-1.067,1.067-1.067h1.876
                    c0.59,0,1.066,0.477,1.066,1.067V26.836z M30.521,16.212l-1.598,10.033c0,0.013-0.005,0.023-0.005,0.036
                    c-0.071,0.583-0.287,2.365-3.004,2.365H13.737c-1.233,0-2.24-1.008-2.24-2.24V16.129c0-0.137-0.012-0.274-0.029-0.411
                    l0.149-0.048c0.435-0.125,5.988-1.829,5.988-6.977V4.564c0.589-0.06,1.364-0.018,1.906,0.387
                    c0.608,0.453,0.917,1.329,0.917,2.616v5.147c0,0.566,0.459,1.025,1.025,1.025h7.03c1.144,0,2.067,0.929,2.067,2.067
                    C30.551,15.938,30.539,16.076,30.521,16.212z"/>
              </Svg>
              <Text style={styles.refElText}>
                Myteam рекомендует
              </Text>
            </View>
          </LinearGradient>
          <LinearGradient style={[styles.refEl]} colors={['#53b321', '#3a7e17']}>
            <View>
              <Svg width={47} height={36} style={styles.refElImage}>
                <Path fill='#ffffff' d="M4.993,14.181H4.958l-2.145,1.095l-0.432-2.117l2.974-1.485h2.179v12.069H4.993V14.181z"/>
                <Path fill='#ffffff' d="M19.537,17.653c0,3.732-1.401,6.294-4.272,6.294c-2.906,0-4.186-2.804-4.203-6.22c0-3.491,1.384-6.257,4.289-6.257
                  C18.36,11.47,19.537,14.348,19.537,17.653z M13.708,17.727c-0.017,2.766,0.605,4.084,1.625,4.084c1.021,0,1.574-1.374,1.574-4.122
                  c0-2.673-0.536-4.085-1.591-4.085C14.348,13.605,13.691,14.923,13.708,17.727z"/>
                <Path fill='#ffffff' d="M29.135,17.653c0,3.732-1.401,6.294-4.271,6.294c-2.905,0-4.186-2.804-4.203-6.22c0-3.491,1.385-6.257,4.289-6.257
                  C27.958,11.47,29.135,14.348,29.135,17.653z M23.307,17.727c-0.018,2.766,0.604,4.084,1.626,4.084c1.02,0,1.573-1.374,1.573-4.122
                  c0-2.673-0.536-4.085-1.592-4.085C23.946,13.605,23.289,14.923,23.307,17.727z"/>
                <Path fill='#ffffff' d="M36.345,15.053c0,2.525-1.486,3.843-3.112,3.843c-1.713,0-3.062-1.374-3.062-3.639c0-2.154,1.228-3.788,3.148-3.788
                  C35.256,11.47,36.345,12.992,36.345,15.053z M32.126,15.183c0,1.263,0.396,2.173,1.158,2.173c0.743,0,1.106-0.817,1.106-2.173
                  c0-1.225-0.311-2.172-1.124-2.172C32.488,13.011,32.126,13.977,32.126,15.183z M33.37,23.947l6.45-12.478h1.419l-6.468,12.478H33.37
                  z M44.438,20.066c0,2.525-1.487,3.844-3.113,3.844c-1.694,0-3.044-1.374-3.061-3.64c0-2.153,1.228-3.787,3.147-3.787
                  C43.349,16.483,44.438,18.005,44.438,20.066z M40.236,20.196c-0.018,1.263,0.381,2.173,1.141,2.173c0.744,0,1.106-0.817,1.106-2.173
                  c0-1.225-0.293-2.172-1.106-2.172C40.582,18.024,40.236,18.989,40.236,20.196z"/>
              </Svg>
              <Text style={styles.refElText}>
                Заказов&nbsp;без проблем
              </Text>
            </View>
          </LinearGradient>
          <LinearGradient style={[styles.refEl]} colors={['#f36104', '#b34500']}>
            <View>
              <Svg width={36} height={36} style={styles.refElImage}>
                <Path fill='#ffffff'
                  d="M18,31.324c-0.138,0-0.276-0.044-0.391-0.133l-6.95-5.263c-2.662-2.017-4.251-5.213-4.251-8.552V8.27
                    c0-0.291,0.194-0.546,0.474-0.624l10.945-3.044c0.113-0.031,0.233-0.031,0.347,0l10.945,3.044c0.279,0.078,0.475,0.333,0.475,0.624
                    v9.107c0,3.339-1.59,6.536-4.252,8.552l-6.95,5.263C18.275,31.28,18.138,31.324,18,31.324z M7.703,8.761v8.615
                    c0,2.936,1.397,5.747,3.737,7.519L18,29.864l6.558-4.969c2.341-1.772,3.739-4.583,3.739-7.519V8.761L18,5.897L7.703,8.761z
                     M16.683,21.045c-0.172,0-0.336-0.069-0.458-0.19l-4.738-4.739c-0.254-0.253-0.254-0.664,0-0.916c0.252-0.252,0.663-0.252,0.916,0
                    l4.281,4.282l6.915-6.916c0.253-0.253,0.664-0.253,0.916,0c0.252,0.252,0.252,0.663,0,0.916l-7.373,7.374
                    C17.019,20.976,16.854,21.045,16.683,21.045z"/>
              </Svg>
              <Text style={styles.refElText}>
                Дает гарантию
              </Text>
            </View>
          </LinearGradient>
          <LinearGradient style={[styles.refEl]} colors={['#fab401', '#b38000']}>
            <View>
              <Svg width={36} height={36} style={styles.refElImage}>
                <Path fill='#ffffff'
                  d="M18.419,5.303c-6.752,0-12.246,5.495-12.246,12.246c0,6.754,5.494,12.248,12.246,12.248
                    c6.753,0,12.247-5.494,12.247-12.248C30.666,10.797,25.172,5.303,18.419,5.303z M18.419,27.19c-5.315,0-9.64-4.325-9.64-9.642
                    c0-5.316,4.325-9.64,9.64-9.64c5.315,0,9.642,4.324,9.642,9.64C28.061,22.865,23.734,27.19,18.419,27.19z"/>
                <Path fill='#ffffff'
                  d="M24.803,17.171h-5.504v-6.617c0-0.557-0.452-1.009-1.009-1.009c-0.557,0-1.008,0.452-1.008,1.009v7.625
                    c0,0.557,0.451,1.01,1.008,1.01h6.513c0.557,0,1.008-0.453,1.008-1.01S25.359,17.171,24.803,17.171z"/>
              </Svg>
              <Text style={styles.refElText}>
                Всегда вовремя
              </Text>
            </View>
          </LinearGradient>
          <LinearGradient style={[styles.refEl, {marginRight: 12}]} colors={['#30a2b6', '#22717e']}>
            <View>
              <Svg width={36} height={36} style={styles.refElImage}>
                <Path fill='#ffffff'
                  d="M17.261,22.75c-0.169,0-0.331-0.069-0.45-0.189l-4.654-4.713c-0.249-0.251-0.088-0.892,0.162-1.142
                    c0.249-0.253,0.811-0.44,1.059-0.188l3.919,3.879l6.293-6.402c0.249-0.252,0.786-0.287,1.151,0.098
                    c0.464,0.469,0.459,0.884,0.211,1.137l-7.242,7.331C17.593,22.681,17.43,22.75,17.261,22.75z"/>
                <Path fill='#ffffff'
                  d="M19.084,30.712c-0.443,0.221-0.515,0.388-1.194,0.388c-0.529,0-0.65-0.137-1.094-0.388
                    c-1.626-0.717-2.447-2.682-4.625-2.665c-2.766,0.023-3.98-1.255-4.164-4.064c-0.081-1.24-0.528-2.155-1.293-3.079
                    c-1.536-1.854-1.551-4.021,0.004-5.86c0.843-0.997,1.246-2.012,1.296-3.316c0.07-1.847,0.963-3.671,2.794-3.68
                    c2.584-0.013,4.187-1.48,5.986-2.826c0.443-0.24,0.422-0.321,1.158-0.321c0.666,0,0.687,0.043,1.13,0.321
                    c2.064,1.169,3.762,2.976,6.497,2.897c1.217-0.036,2.3,1.285,2.364,2.75c0.098,2.23,1.165,3.92,2.58,5.474
                    c0.271,0.587,0.511,0.838,0.511,1.621c0,0.839-0.21,1.072-0.511,1.625c-1.38,1.617-2.625,3.249-2.612,5.593
                    c0.009,1.345-1.075,2.592-2.188,2.594C23,27.783,21.173,29.463,19.084,30.712z M10.335,22.843
                    c-0.245,2.092,0.701,3.171,2.849,3.056c1.323-0.072,2.313,0.358,3.19,1.396c1.026,1.214,2.295,1.245,3.342,0.026
                    c0.941-1.094,2.026-1.485,3.421-1.436c1.763,0.065,2.725-0.87,2.654-2.687c-0.05-1.31,0.227-2.399,1.26-3.297
                    c1.472-1.283,1.385-2.656-0.053-3.916c-0.951-0.835-1.266-1.85-1.2-3.085c0.098-1.908-0.842-2.937-2.735-2.849
                    c-1.407,0.065-2.471-0.374-3.398-1.467c-0.965-1.138-2.217-1.177-3.162-0.042c-0.997,1.196-2.142,1.568-3.609,1.508
                    c-1.825-0.074-2.723,0.971-2.52,2.751c0.158,1.375-0.168,2.37-1.258,3.222c-1.665,1.3-1.593,2.695,0.042,3.982
                    C10.069,20.723,10.652,21.537,10.335,22.843z"/>
              </Svg>
              <Text style={styles.refElText}>
                Прошел проверку
              </Text>
            </View>
          </LinearGradient>
        </ScrollView>
      </View>

      <View style={[baseStyles.row, styles.profile2]}>
        <Text style={styles.profile2_title}>
          Меня рекомендуют:
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}  style={baseStyles.row}>
          { usersInTeam }
          {/*{ this.state.team && this.state.team.length && this.state.team.length > 3 ? */}
            {/*<View style={styles.moreInTeam}>*/}
              {/*<Text style={styles.moreInTeamText}>*/}
                {/*+ {this.state.team.length - 3}*/}
              {/*</Text>*/}
            {/*</View>*/}
          {/*: undefined }*/}
        </ScrollView>
      </View>

      <View style={[baseStyles.row, styles.profile3]}>
        <View style={{flex: 3}}>
          <Text style={styles.addinfo_title}>
            Как исполнитель
          </Text>
          <View style={[baseStyles.row, {paddingTop: 10}]}>
            <Svg width={92} height={16} style={styles.refElImage} viewBox="0 0 92 16">
              <Defs>
                <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="92" y2="0" id="LinearGradient1">
                  <Stop offset="0" stopColor={Colors.COLOR_YELLOW}></Stop>
                  <Stop offset={(this.state.task_profile ? this.state.task_profile.rating_spec : 0)/5} stopColor={Colors.COLOR_YELLOW}></Stop>
                  <Stop offset={(this.state.task_profile ? this.state.task_profile.rating_spec : 0)/5 + 0.01} stopColor={Colors.COLOR_LIGHT_GRAY}></Stop>
                  <Stop offset="1" stopColor={Colors.COLOR_LIGHT_GRAY}></Stop>
                </LinearGradientSvg>
              </Defs>
              <Path
                fill="url(#LinearGradient1)"
                d="M12.947,16L8,12.861L3.053,16l1.31-5.92L0,6.104l5.754-0.517L8,0l2.246,5.575L16,6.092l-4.363,3.976
                  L12.947,16z M31.947,16L27,12.861L22.053,16l1.311-5.92L19,6.104l5.754-0.517L27,0l2.246,5.575L35,6.092l-4.363,3.976L31.947,16z
                   M50.947,16L46,12.861L41.053,16l1.311-5.92L38,6.104l5.754-0.517L46,0l2.246,5.575L54,6.092l-4.363,3.976L50.947,16z M69.947,16
                  L65,12.861L60.053,16l1.311-5.92L57,6.104l5.754-0.517L65,0l2.246,5.575L73,6.092l-4.363,3.976L69.947,16z M88.947,16L84,12.861
                  L79.053,16l1.311-5.92L76,6.104l5.754-0.517L84,0l2.246,5.575L92,6.092l-4.363,3.976L88.947,16z"
              />
            </Svg>
            {/*<Text style={styles.addinfo_text_rating}>
              {this.state.task_profile ? this.state.task_profile['rating_spec'] : 0}
            </Text>*/}
          </View>
          <Text style={styles.addinfo_text}>
            {this.state.task_profile ? this.state.task_profile['rating_spec_count'] : 0} {textPrepared(this.state.task_profile ? this.state.task_profile['rating_spec_count'] : 0, this.state.titles.repl)}
          </Text>
        </View>

        <View style={{flex: 2}}>
          <Text style={styles.big_label}>
            { this.state.task_profile ? this.state.task_profile['performed_clients_count'] : 0}
          </Text>
          <Text style={styles.addinfo_text}>
            { textPrepared(this.state.task_profile ? this.state.task_profile['performed_clients_count'] : 0, this.state.titles.customer) }
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.big_label}>
            {this.state.task_profile ? this.state.task_profile['performed_task_count'] : 0}
          </Text>
          <Text style={styles.addinfo_text}>
            { textPrepared(this.state.task_profile ? this.state.task_profile['performed_task_count'] : 0, this.state.titles.task) }
          </Text>
        </View>
      </View>

      <View style={[baseStyles.row, styles.profile4]}>
        <View style={{flex: 3}}>
          <Text style={styles.addinfo_title}>
            Как заказчик
          </Text>
          <View style={[baseStyles.row, {paddingTop: 10}]}>
            <View>
              <Text style={styles.addinfo_text}>
                {this.state.task_profile ? this.state.task_profile['rating_client_text'] : 'Нет задач'}
              </Text>
              <Text style={styles.addinfo_text}>
                {this.state.task_profile ? this.state.task_profile['rating_client_count'] : 0} {textPrepared(this.state.task_profile ? this.state.task_profile['rating_client_count'] : 0, this.state.titles.repl)} {/*this.state.created.rating || 0*/}
              </Text>
            </View>
            <View>
              { ratingicon }
            </View>
          </View>
        </View>

        <View style={{flex: 2}}>
          <Text style={styles.big_label}>
            {this.state.task_profile ? this.state.task_profile['client_performers_count'] : 0}
          </Text>
          <Text style={styles.addinfo_text}>
            { textPrepared(this.state.task_profile ? this.state.task_profile['client_performers_count'] : 0, this.state.titles.executor) }
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.big_label}>
            {this.state.task_profile ? this.state.task_profile['client_task_count'] : 0}
          </Text>
          <Text style={styles.addinfo_text}>
            { textPrepared(this.state.task_profile ? this.state.task_profile['client_task_count'] : 0, this.state.titles.task) }
          </Text>
        </View>
      </View>

      <View style={[baseStyles.row, styles.profile6]}>
        { blogsinfo }
      </View>

      <View style={[styles.profile6]}>
        <Text style={[styles.normalTitle_bold, {marginBottom: 8}]}>
          Контактные данные
        </Text>
        <View style={baseStyles.row}>
          <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M12,2 C8.13,2 5,5.13 5,9 C5,14.25 12,22 12,22 C12,22 19,14.25 19,9 C19,5.13 15.87,2 12,2 L12,2 Z M12,11.5 C10.62,11.5 9.5,10.38 9.5,9 C9.5,7.62 10.62,6.5 12,6.5 C13.38,6.5 14.5,7.62 14.5,9 C14.5,10.38 13.38,11.5 12,11.5 L12,11.5 Z"
            />
          </Svg>
          <View>
            <Text style={baseStyles.midText}>
              { this.props.user.data.address }
            </Text>
            <Text style={baseStyles.smallText}>
              { this.props.user.data.address_comment }
            </Text>
          </View>
        </View>
      </View>
      <View style={baseStyles.splitter_smlmg}>
      </View>
      <View style={[styles.profile6]}>
        <View style={baseStyles.row}>
          <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M6.62,10.79 C8.06,13.62 10.38,15.93 13.21,17.38 L15.41,15.18 C15.68,14.91 16.08,14.82 16.43,14.94 C17.55,15.31 18.76,15.51 20,15.51 C20.55,15.51 21,15.96 21,16.51 L21,20 C21,20.55 20.55,21 20,21 C10.61,21 3,13.39 3,4 C3,3.45 3.45,3 4,3 L7.5,3 C8.05,3 8.5,3.45 8.5,4 C8.5,5.25 8.7,6.45 9.07,7.57 C9.18,7.92 9.1,8.31 8.82,8.59 L6.62,10.79 L6.62,10.79 Z"
            />
          </Svg>
          <Text style={baseStyles.midText}>
            { this.props.user.data.phone }
          </Text>
        </View>
      </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            // provider={MapView.PROVIDER_GOOGLE}
            mapType={Platform.OS == "android" ? "none" : "standard"}
            initialRegion={{
              latitude: parseFloat(this.props.user.data.lat)|| 0.00,
              longitude: parseFloat(this.props.user.data.lng)|| 0.00,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            >
            <Marker
              coordinate={{latitude: parseFloat(this.props.user.data.lat) || 0.00, longitude: parseFloat(this.props.user.data.lng) || 0.00}}
              image={require('../../../../assets/images/location.png')}
              centerOffset={{x:10, y:0}}
            />
          </MapView>
        </View>

      <View style={[styles.profile6]}>
        <Text style={styles.normalTitle_bold}>
          О себе
        </Text>
        <Text style={baseStyles.midText}>
          { this.props.user.data.about }
        </Text>
      </View>

      <View style={baseStyles.splitter_smlmg}>
      </View>

      <View style={[styles.profile6]}>
        <Text style={styles.normalTitle_bold}>
          Дополнительные контактные данные
        </Text>
        { additionalData }
      </View>

      <View style={[styles.profile7]}>
        <TouchableOpacity onPress={() => this.setState({showServices: !this.state.showServices})}>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
              <Text style={[styles.bigTitle, {flex: 1}]}>
                Услуги
              </Text>
              <Text style={styles.bigTitle_counter}>
                { this.state.services.length || 0 }
              </Text>
              {
                !this.state.showServices ?
                  <Svg width={12} height={12} viewBox="0 0 12 12">
                    <Polygon
                      fill={Colors.COLOR_LIGHTDARK_GRAY}
                      points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                    />
                  </Svg>
                :
                  <Svg width={12} height={12} viewBox="0 0 12 12">
                    <Polygon
                      fill={Colors.COLOR_LIGHTDARK_GRAY}
                      points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                    />
                  </Svg>
              }
          </View>
        </TouchableOpacity>
        { this.state.showServices ? services : undefined }
      </View>

      <View style={baseStyles.splitter_full}>
      </View>

      <View style={[styles.profile7]}>
        <TouchableOpacity onPress={() => this.setState({showEducation: !this.state.showEducation})}>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Text style={[styles.bigTitle, {flex: 1}]}>
              Образование
            </Text>
            <Text style={styles.bigTitle_counter}>
              { this.props.user.educations.length || 0 }
            </Text>
            {
              !this.state.showEducation ?
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Polygon
                    fill={Colors.COLOR_LIGHTDARK_GRAY}
                    points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                  />
                </Svg>
              :
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Polygon
                    fill={Colors.COLOR_LIGHTDARK_GRAY}
                    points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                  />
                </Svg>
              }
          </View>
        </TouchableOpacity>
        { this.state.showEducation ? education : undefined }
      </View>

      <View style={baseStyles.splitter_full}>
      </View>

      <View style={[styles.profile7]}>
        <TouchableOpacity onPress={() => this.setState({showCareers: !this.state.showCareers})}>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Text style={[styles.bigTitle, {flex: 1}]}>
              Опыт работы
            </Text>
            <Text style={styles.bigTitle_counter}>
              { this.props.user.careers.length || 0 }
            </Text>
            {
              !this.state.showCareers ?
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Polygon
                    fill={Colors.COLOR_LIGHTDARK_GRAY}
                    points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                  />
                </Svg>
              :
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Polygon
                    fill={Colors.COLOR_LIGHTDARK_GRAY}
                    points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                  />
                </Svg>
              }
          </View>
        </TouchableOpacity>
        { this.state.showCareers ? careers : undefined }
      </View>
    </View>

    let editTab = <View>
      <View style={styles.edit1}>
        <View style={[styles.editContainer, baseStyles.row]}>
          <View style={{flex: 1}}>
            <View>
               <TouchableOpacity style={styles.profileAvatar_btn} onPress={()=>{this.openImagePicker()}}>
                <View>
                  {
                    this.props.user.photo && this.props.user.photo.photo.length  ?
                      !this.state.userdata.avatar ?
                        <Image style={[styles.profileAvatar,
                          this.props.app.appplan.title == 'PRO' ?
                          {borderColor: Colors.COLOR_LIGHT_BLUE} :
                            this.props.app.appplan.title == 'Business' ?
                            {borderColor: Colors.COLOR_YELLOW} :
                            {borderColor: Colors.COLOR_WHITE}]}
                            source={{uri:`${this.props.user.photo.path}${this.props.user.photo.photo[0].photo_cropped}`}} resizeMode='cover'/>
                        :
                        <Image style={[styles.profileAvatar,
                          this.props.app.appplan.title == 'PRO' ?
                          {borderColor: Colors.COLOR_LIGHT_BLUE} :
                            this.props.app.appplan.title == 'Business' ?
                            {borderColor: Colors.COLOR_YELLOW} :
                            {borderColor: Colors.COLOR_WHITE}]}
                            source={{uri:`data:${this.state.userdata.avatar.type};base64,${this.state.userdata.avatar.data}`}} resizeMode='cover'/>
                      :
                        <Image style={[styles.profileAvatar,
                          this.props.app.appplan.title == 'PRO' ?
                          {borderColor: Colors.COLOR_LIGHT_BLUE} :
                            this.props.app.appplan.title == 'Business' ?
                            {borderColor: Colors.COLOR_YELLOW} :
                            {borderColor: Colors.COLOR_WHITE}]}
                            source={require('../../../../assets/images/ava.png')} resizeMode='cover'/>
                    }
                    <View style={{position: 'absolute', backgroundColor:'rgba(0,0,0,0.2)',borderRadius: responsiveWidth(20), width: responsiveWidth(25), height: responsiveWidth(25)}}>
                      <Svg width={responsiveWidth(5)} height={responsiveWidth(5)} style={{top: responsiveWidth(10), left: responsiveWidth(10)}} viewBox="0 0 24 24">
                        <Path
                          fill="#FFFFFF"
                          d="M3,4 L3,1 L5,1 L5,4 L8,4 L8,6 L5,6 L5,9 L3,9 L3,6 L0,6 L0,4 L3,4 L3,4 Z M6,10 L6,7 L9,7 L9,4 L16,4 L17.83,6 L21,6 C22.1,6 23,6.9 23,8 L23,20 C23,21.1 22.1,22 21,22 L5,22 C3.9,22 3,21.1 3,20 L3,10 L6,10 L6,10 Z M13,19 C15.76,19 18,16.76 18,14 C18,11.24 15.76,9 13,9 C10.24,9 8,11.24 8,14 C8,16.76 10.24,19 13,19 L13,19 Z M9.8,14 C9.8,15.77 11.23,17.2 13,17.2 C14.77,17.2 16.2,15.77 16.2,14 C16.2,12.23 14.77,10.8 13,10.8 C11.23,10.8 9.8,12.23 9.8,14 L9.8,14 Z"
                          />
                      </Svg>
                    </View>
                  </View>
               </TouchableOpacity>
             </View>
          </View>
          <View style={[baseStyles.row, baseStyles.verticalCenter, baseStyles.right, {flex: 1}]}>
            <Text style={[baseStyles.midText, {color: Colors.COLOR_WHITE}]}>
              Пол
            </Text>
            <View style={[formsStyles.pickerWrap, formsStyles.inputContainer, {flex: 0, height: 40, marginBottom: 0, backgroundColor:Colors.COLOR_WHITE, marginLeft: 10}]}>
              {/*<Picker*/}
                {/*selectedValue={this.state.userdata.gender}*/}
                {/*style={formsStyles.picker}*/}
                {/*itemStyle={formsStyles.picker}*/}
                {/*onValueChange={(itemValue, itemIndex) => this.writing('gender', itemValue)}>*/}
                {/*<Picker.Item label="Мужской" value={1} />*/}
                {/*<Picker.Item label="Женский" value={2} />*/}
              {/*</Picker>*/}
              <ModalDropdown
                  style={formsStyles.picker2}
                  textStyle={formsStyles.picker2Text}
                  dropdownStyle={formsStyles.pickerDropdown}
                  options={['Мужской', 'Женский']}
                  onSelect={(itemValue) => this.writing('gender', itemValue)}
                  defaultValue={this.state.userdata.gender == 2 ? 'Женский' : 'Мужской'}
              />
            </View>
          </View>
        </View>
        <View style={[formsStyles.inputContainer, styles.editContainer]}>
          <FormInput name="name" value={this.state.userdata.name} inputstyle={!this.props.user.data.name ? styles.errorContainer : null} writing={(text) => {this.writing('name', text)}} withoutclear={true} placeholder="Имя" />
        </View>
        <View style={[formsStyles.inputContainer, styles.editContainer]}>
          <FormInput name="surname" value={this.state.userdata.surname} writing={(text) => {this.writing('surname', text)}} inputstyle={!this.props.user.data.surname ? styles.errorContainer : null} withoutclear={true} placeholder="Фамилия" />
        </View>
        {
          !this.props.user.data.name || !this.props.user.data.surname ?
          <Text style={styles.errorMessage}>
            Для продолжения работы, необходимо заполнить данные о себе
          </Text>
          : null
        }
        {
          this.props.app.appplan.title !== 'PRO' ?
            <View style={[styles.getPro]}>
              <TouchableOpacity 
                style={[baseStyles.verticalCenter, {borderColor: Colors.COLOR_LIGHT_BLUE, borderWidth: 2, borderRadius: 20}]} 
                onPress={() => {this.setState({ modalUpgrade:!this.state.modalUpgrade})}}>
                <View style={[baseStyles.verticalCenter, {flexDirection: 'row'}]}>
                  <Text style={{paddingVertical: 10, paddingLeft: 25, marginRight: 10, color: Colors.COLOR_WHITE}}>
                    Получить Pro
                  </Text>
                  <Svg width={25} height={11} style={{marginRight: 25}} viewBox={'-4.875 -2 47.208 22'}>
                    <Path
                      fill="#36B5BE" stroke="#FCFCFC" stroke-width="3" d="M17.098,8.165c0.916,0.457,0.925,1.198,0,1.66l-17.125,8.561
                        c-1.825,0.914-3.305-0.007-3.305-2.043V1.647c0-2.043,1.483-2.955,3.305-2.044L17.098,8.165z M20.418,9.825
                        c-0.917-0.459-0.925-1.197,0-1.66l17.123-8.562c1.824-0.911,3.308,0.007,3.308,2.044v14.698c0,2.04-1.485,2.955-3.308,2.041
                        L20.418,9.825z"
                      />
                    <Circle
                      fill="#36B5BE" stroke="#FCFCFC" stroke-width="3" cx="18.758" cy="8.995" r="5.522"
                      />
                  </Svg>
                </View>
              </TouchableOpacity>
              <BuyPlanModal 
                visible={this.state.modalUpgrade}
                data={this.props.app.plans.find(item => item.title == 'PRO')}
                close={() => {this.setState({ modalUpgrade:!this.state.modalUpgrade})}}
              />
            </View>
          : null

        }
        <View style={[styles.editContainer, styles.editContainerPadBottom]}>
          <Text style={styles.middleTitle}>
            Специализации
          </Text>
          <TouchableOpacity onPress={() => this.props.navigateToTags()}>
            <View style={[formsStyles.tags, baseStyles.row, {flexWrap: 'wrap'}]}>
                { tagsEdit }
                {
                  !this.props.user.usertags.length ?
                  <Text style={styles.emptyTextEdit}>
                    Выберите специализацию
                  </Text> : undefined
                }
            </View>
          </TouchableOpacity>
        </View>
    </View>
      <View style={styles.edit2}>
        <View style={styles.message}>
          <View style={baseStyles.row}>
            <View style={{flex: 1}}>
              <Text style={styles.message_text}>
                Сменить основные контактные данные (E-mail и контактный телефон) можно только в
                <Text>
                &nbsp;настройках
                </Text>
              </Text>
            </View>
            <View>
              <Svg width={48} height={48}>
                <Path fill='#D3182F'
                  d="M24.002,2.801c-11.703,0-21.2,9.497-21.2,21.198c0,11.702,9.497,21.2,21.2,21.2
                  c11.699,0,21.196-9.498,21.196-21.2C45.198,12.298,35.701,2.801,24.002,2.801L24.002,2.801z M26.122,34.599h-4.24v-4.24h4.24V34.599
                  L26.122,34.599z M26.122,26.119h-4.24V13.4h4.24V26.119L26.122,26.119z"/>
              </Svg>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.editContainer}>
        <Text style={styles.bigTitle}>
         О себе
        </Text>
        <View style={[formsStyles.inputContainer, formsStyles.textarea, formsStyles.inputText_bordered]}>
          <TextInput
            style={[formsStyles.inputText_white, formsStyles.inputTextarea]}
            placeholder="О себе"
            multiline={true}
            numberOfLines={10}
            value={this.state.userdata.about}
            placeholderTextColor={Colors.COLOR_WHITE_06}
            onChangeText={(text) => {this.writing('about', text)}}
          />
        </View>
      </View>
      <View style={baseStyles.splitter}>
      </View>
      <View style={styles.editContainer}>
        <Text style={styles.bigTitle}>
          Адрес
        </Text>
        <KladrInput multiline={true} value={this.state.userdata.address} style={{marginBottom:0}} name="address" writing={(text, geocode) => {this.kladr('address', text, geocode)}} placeholder="Адрес" />
        <FormInput title="Комментарий к адресу" multiline={true} name="address_comment" value={this.state.userdata.address_comment} writing={(text) => {this.writing('address_comment', text)}} placeholder="Комментарий к адресу" />
      </View>
        <View style={styles.mapContainerEdit}>
          <MapView
              style={styles.map}
              mapType={Platform.OS == "android" ? "none" : "standard"}
              initialRegion={{
                latitude: parseFloat(this.state.userdata.lat)|| 0.00,
                longitude: parseFloat(this.state.userdata.lng)|| 0.00,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
          >
            <Marker
                coordinate={{latitude: parseFloat(this.state.userdata.lat) || 0.00, longitude: parseFloat(this.state.userdata.lng) || 0.00}}
                image={require('../../../../assets/images/location.png')}
                centerOffset={{x:10, y:0}}
            />
          </MapView>
        </View>

      <View style={styles.editContainer}>
        <Text style={styles.bigTitle}>
          Дополнительные контактные данные
        </Text>
        { additionalPhones }

        <View style={baseStyles.row}>
          <TouchableOpacity onPress={() => this.addAdditionalPhone()}>
            <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#eff2f3', '#eff2f3']}>
              <View>
                <View style={[buttonsStyles.buttonMiddle]}>
                  <Text style={[buttonsStyles.buttonMiddleText, buttonsStyles.buttonMiddleText_blue]}>Добавить еще телефон</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <View style={{flex: 1}}>
          </View>
        </View>
      </View>

      <View style={baseStyles.splitter}>
      </View>

      <View style={styles.editContainer}>

        <FormInput title="Почта" name="email" icon={
          <Svg width={24} height={24} viewBox='0 0 24 24' style={{marginLeft:8}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M20,4 L4,4 C2.9,4 2.01,4.9 2.01,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 C22,4.9 21.1,4 20,4 L20,4 Z M20,8 L12,13 L4,8 L4,6 L12,11 L20,6 L20,8 L20,8 Z"
             />
          </Svg>} value={this.state.userdata.email} writing={(text) => {this.writing('email', text)}} placeholder="Почта" type="email"/>

        <FormInput title="Скайп" name="skype" icon={
          <Svg width={24} height={24} viewBox='0 0 24 24' style={{marginLeft:8}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M16.674965,15.499785 C16.302565,16.036535 15.755365,16.455485 15.039065,16.7560017 C14.3224483,17.0584183 13.475365,17.2091517 12.496865,17.2091517 C11.3248817,17.2091517 10.3542983,17.004585 9.587965,16.5888017 C9.04393167,16.2927183 8.602815,15.8956183 8.263665,15.3984517 C7.922615,14.9016017 7.75034833,14.4155183 7.75034833,13.9405183 C7.75034833,13.6621683 7.85738167,13.4186517 8.06448167,13.2194683 C8.27443167,13.020285 8.544865,12.920535 8.864065,12.920535 C9.12594833,12.920535 9.34919833,12.9987517 9.53254833,13.155185 C9.713365,13.310985 9.86599833,13.5367683 9.989815,13.8360183 C10.1392817,14.183085 10.3020483,14.4725183 10.4736817,14.7030517 C10.6449983,14.9320017 10.8862983,15.122635 11.1978983,15.2714683 C11.5072817,15.4212517 11.918315,15.4953517 12.4325817,15.4953517 C13.136215,15.4953517 13.7055817,15.343985 14.140365,15.042835 C14.5779983,14.7404183 14.7876317,14.3715017 14.7876317,13.925635 C14.7876317,13.5700183 14.6745817,13.288185 14.4430983,13.0690517 C14.207815,12.8451683 13.904765,12.6751183 13.5288817,12.5570017 C13.1517317,12.436985 12.6453817,12.3103183 12.0107817,12.176685 C11.158315,11.9911183 10.445815,11.7745183 9.86789833,11.5253017 C9.290615,11.276085 8.829865,10.9353517 8.48913167,10.503735 C8.14713167,10.0689517 7.97708167,9.52776833 7.97708167,8.88746833 C7.97708167,8.27630167 8.157265,7.72910167 8.516365,7.254735 C8.877365,6.777835 9.39828167,6.41240167 10.077215,6.15875167 C10.7542483,5.90446833 11.5512983,5.77716833 12.465515,5.77716833 C13.1944817,5.77716833 13.826865,5.86140167 14.361715,6.02955167 C14.8943483,6.19896833 15.339265,6.42285167 15.6929817,6.70310167 C16.0466983,6.983035 16.3069983,7.277535 16.4710317,7.58755167 C16.6356983,7.89725167 16.718665,8.20156833 16.718665,8.49670167 C16.718665,8.77251833 16.612265,9.02236833 16.4035817,9.24055167 C16.1955317,9.46031833 15.9304817,9.57146833 15.6201483,9.57020167 C15.340215,9.57020167 15.120765,9.50655167 14.9684483,9.37006833 C14.8199317,9.23706833 14.6641317,9.02680167 14.495665,8.732935 C14.281915,8.32411833 14.0276317,8.00491833 13.7312317,7.77596833 C13.4414817,7.55271833 12.965215,7.435235 12.3024317,7.437135 C11.6880983,7.437135 11.1978983,7.56285167 10.8273983,7.80826833 C10.4540483,8.05685167 10.275765,8.34565167 10.274815,8.68480167 C10.275765,8.897285 10.3368817,9.07620167 10.460065,9.22820167 C10.5841983,9.383685 10.758365,9.51636833 10.9809817,9.63036833 C11.2042317,9.74405167 11.4306483,9.83271833 11.658965,9.89700167 C11.8894983,9.96191833 12.272665,10.0559683 12.8040317,10.1813683 C13.4702983,10.326085 14.0760817,10.4869517 14.6197983,10.661435 C15.1631983,10.8368683 15.6255317,11.0496683 16.008065,11.302685 C16.393765,11.554435 16.695865,11.8749017 16.9108817,12.2637683 C17.1274817,12.6523183 17.2341983,13.1273183 17.2341983,13.6856017 C17.2351483,14.3585183 17.0479983,14.9636683 16.674965,15.499785 M21.1928483,12.867335 C21.2640983,12.4195683 21.3011483,11.9613517 21.3011483,11.4933183 C21.3011483,6.626785 17.358015,2.68396833 12.4927483,2.68396833 C12.024715,2.68396833 11.565865,2.72165167 11.1180983,2.79226833 C10.306165,2.29066833 9.34919833,1.99996833 8.322565,1.99996833 C5.383265,1.99996833 3.00003167,4.38320167 3.00003167,7.324085 C3.00003167,8.34945167 3.28978167,9.30546833 3.79169833,10.1196183 C3.72298167,10.5686517 3.68498167,11.0249683 3.68498167,11.4933183 C3.68498167,16.3589017 7.62748167,20.3017183 12.492115,20.3017183 C12.9598317,20.3017183 13.4189983,20.2653017 13.866765,20.1940517 C14.6796483,20.6950183 15.636615,20.9863517 16.662615,20.9863517 C19.6025483,20.9863517 21.9857817,18.6021683 21.9857817,15.6638183 C21.9857817,14.6375017 21.695715,13.6802183 21.1928483,12.867335"
             />
          </Svg>} value={this.state.userdata.skype} writing={(text) => {this.writing('skype', text)}} placeholder="Скайп" />

        <FormInput title="Фейсбук" name="facebook" icon={
          <Svg width={24} height={24} viewBox='0 0 24 24' style={{marginLeft:8}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M17.186,11.978h-3.322v11.477H8.831V11.978H6.437V7.945h2.394v-2.61
                c0-1.866,0.94-4.789,5.078-4.789l3.729,0.015v3.915h-2.705c-0.443,0-1.068,0.209-1.068,1.1v2.374h3.762L17.186,11.978z"
             />
          </Svg>} value={this.state.userdata.facebook} writing={(text) => {this.writing('facebook', text)}} placeholder="Фейсбук" />

        <FormInput title="Инстаграм" name="insta" icon={
          <Svg width={24} height={24} viewBox='0 0 24 24' style={{marginLeft:8}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M7.075,0.073C5.793,0.131,4.918,0.334,4.153,0.632C3.361,0.939,2.69,1.351,2.021,2.021
                C1.352,2.689,0.939,3.36,0.632,4.153c-0.297,0.765-0.5,1.64-0.559,2.921C0.014,8.358,0,8.768,0,12.037
                c0,3.269,0.014,3.68,0.073,4.963c0.059,1.282,0.262,2.157,0.559,2.923c0.308,0.791,0.719,1.463,1.389,2.131
                c0.668,0.669,1.34,1.08,2.132,1.39c0.767,0.297,1.64,0.5,2.922,0.559c1.285,0.058,1.694,0.073,4.962,0.073
                c3.27,0,3.68-0.014,4.963-0.073c1.282-0.059,2.157-0.262,2.923-0.559c0.791-0.31,1.462-0.721,2.132-1.39
                c0.668-0.668,1.08-1.34,1.389-2.131c0.297-0.766,0.502-1.641,0.559-2.923c0.058-1.284,0.072-1.694,0.072-4.963
                c0-3.269-0.015-3.679-0.072-4.963c-0.059-1.281-0.262-2.156-0.559-2.921c-0.309-0.792-0.721-1.463-1.389-2.132
                c-0.669-0.669-1.341-1.081-2.132-1.389c-0.766-0.297-1.641-0.501-2.922-0.559C15.718,0.015,15.307,0,12.039,0
                C8.769,0,8.359,0.014,7.075,0.073 M7.174,21.836C6,21.782,5.362,21.586,4.939,21.421c-0.563-0.218-0.963-0.479-1.385-0.9
                c-0.421-0.421-0.683-0.821-0.9-1.384c-0.166-0.424-0.361-1.062-0.415-2.235c-0.058-1.268-0.07-1.649-0.07-4.864
                c0-3.214,0.013-3.594,0.07-4.865C2.293,6,2.489,5.362,2.654,4.938c0.219-0.562,0.479-0.962,0.9-1.384
                C3.975,3.131,4.375,2.87,4.939,2.652C5.362,2.487,6,2.292,7.174,2.238c1.269-0.059,1.65-0.07,4.863-0.07
                c3.215,0,3.596,0.013,4.864,0.07c1.174,0.054,1.811,0.25,2.236,0.414c0.562,0.218,0.963,0.479,1.385,0.901
                c0.42,0.42,0.681,0.822,0.9,1.384c0.165,0.424,0.36,1.062,0.414,2.235c0.059,1.271,0.069,1.65,0.069,4.865
                c0,3.214-0.011,3.596-0.069,4.864c-0.054,1.174-0.251,1.812-0.414,2.235c-0.22,0.563-0.48,0.963-0.9,1.384
                c-0.422,0.421-0.823,0.683-1.385,0.9c-0.425,0.165-1.063,0.361-2.236,0.415c-1.269,0.058-1.649,0.069-4.864,0.069
                C8.824,21.905,8.443,21.894,7.174,21.836 M17.019,5.611c0,0.797,0.647,1.445,1.445,1.445c0.797,0,1.445-0.647,1.445-1.445
                s-0.646-1.444-1.445-1.444C17.666,4.167,17.019,4.814,17.019,5.611 M5.857,12.037c0,3.414,2.767,6.182,6.18,6.182
                c3.414,0,6.182-2.768,6.182-6.182c0-3.414-2.768-6.181-6.182-6.181C8.624,5.856,5.857,8.624,5.857,12.037 M8.026,12.037
                c0-2.216,1.796-4.013,4.011-4.013c2.217,0,4.014,1.797,4.014,4.013s-1.797,4.014-4.014,4.014
                C9.822,16.051,8.026,14.253,8.026,12.037"
             />
          </Svg>} value={this.state.userdata.insta} writing={(text) => {this.writing('insta', text)}} placeholder="Инстаграм" />

        <FormInput title="Одноклассники" name="odnoklass" icon={
          <Svg width={24} height={24} viewBox='0 0 24 24' style={{marginLeft:8}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M12.036,0.545c-3.176,0-5.759,2.563-5.759,5.713c0,3.148,2.583,5.709,5.759,5.709
                c3.177,0,5.761-2.561,5.761-5.709C17.797,3.107,15.213,0.545,12.036,0.545z M12.036,8.622c-3.099,0-3.432-4.729,0-4.729
                C15.167,3.893,15.292,8.622,12.036,8.622z M14.367,16.627l3.219,3.193c0,0.002,0.002,0.004,0.004,0.004
                c0.656,0.654,0.654,1.711-0.004,2.363c-0.002,0-0.002,0-0.002,0.002c-0.658,0.65-1.725,0.65-2.383-0.002l-3.165-3.139l-3.163,3.139
                c-0.659,0.652-1.728,0.652-2.387,0c-0.659-0.654-0.659-1.713,0-2.367l3.219-3.193c-1.185-0.268-2.315-0.732-3.344-1.373
                c-0.788-0.492-1.025-1.525-0.528-2.308c0,0,0.001-0.001,0.001-0.002c0.496-0.781,1.537-1.016,2.325-0.523
                c2.357,1.47,5.395,1.47,7.754,0c0,0,0-0.001,0.002-0.001c0.789-0.491,1.828-0.255,2.324,0.527c0.496,0.783,0.26,1.816-0.529,2.308
                C16.682,15.895,15.551,16.359,14.367,16.627z"
             />
          </Svg>} value={this.state.userdata.odnoklass} writing={(text) => {this.writing('odnoklass', text)}} placeholder="Одноклассники" />

        <FormInput title="Вконтакте" name="vk" icon={
          <Svg width={24} height={24} viewBox='0 0 24 24' style={{marginLeft:8}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M11.743,18.775h1.435c0,0,0.433-0.045,0.654-0.27c0.203-0.207,0.197-0.596,0.197-0.596
                  s-0.028-1.814,0.865-2.082c0.881-0.264,2.012,1.754,3.21,2.531c0.906,0.586,1.595,0.457,1.595,0.457l3.205-0.041
                  c0,0,1.677-0.098,0.882-1.342c-0.065-0.102-0.463-0.918-2.384-2.6c-2.01-1.76-1.74-1.475,0.682-4.518
                  c1.474-1.853,2.063-2.984,1.879-3.469c-0.176-0.461-1.26-0.339-1.26-0.339l-3.609,0.021c0,0-0.268-0.035-0.465,0.078
                  c-0.195,0.109-0.319,0.365-0.319,0.365s-0.571,1.434-1.333,2.654c-1.606,2.573-2.249,2.709-2.512,2.549
                  c-0.611-0.372-0.459-1.496-0.459-2.294c0-2.494,0.401-3.534-0.78-3.803c-0.393-0.089-0.682-0.148-1.685-0.158
                  c-1.288-0.012-2.377,0.003-2.994,0.289C8.136,6.398,7.819,6.82,8.012,6.845c0.239,0.03,0.779,0.137,1.065,0.504
                  C9.447,7.824,9.434,8.89,9.434,8.89s0.212,2.936-0.496,3.3c-0.486,0.25-1.154-0.261-2.586-2.595
                  C5.618,8.399,5.063,7.077,5.063,7.077S4.957,6.83,4.766,6.697c-0.231-0.16-0.554-0.21-0.554-0.21l-3.43,0.021
                  c0,0-0.515,0.014-0.704,0.225C-0.09,6.92,0.065,7.309,0.065,7.309s2.685,5.924,5.725,8.908
                  C8.578,18.955,11.743,18.775,11.743,18.775"
             />
          </Svg>} value={this.state.userdata.vk} writing={(text) => {this.writing('vk', text)}} placeholder="Вконтакте" />

        <FormInput title="Youtube" name="youtube" icon={
          <Svg width={24} height={24} viewBox='0 0 24 24' style={{marginLeft:8}}>
            <Path
              fill={Colors.COLOR_GRAY_ICONS}
              d="M9.6,16.06V7.022l6.855,4.519L9.6,16.06z M24,7.188c0-1.981-1.605-3.588-3.588-3.588H3.587
                  C1.605,3.601,0,5.207,0,7.188v9.623c0,1.981,1.605,3.588,3.587,3.588h16.825c1.982,0,3.588-1.606,3.588-3.588V7.188z"
             />
          </Svg>} value={this.state.userdata.youtube} writing={(text) => {this.writing('youtube', text)}} placeholder="Youtube" />

      </View>

      <View style={[styles.profile7]}>
        <TouchableOpacity onPress={() => this.setState({showEducationEdit: !this.state.showEducationEdit})}>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Text style={[styles.bigTitle, {flex: 1}]}>
              Образование
            </Text>
            <Text style={styles.bigTitle_counter}>
              { /*this.props.user.educations.length || 0 */}
            </Text>
            {
              !this.state.showEducationEdit ?
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Polygon
                    fill={Colors.COLOR_LIGHTDARK_GRAY}
                    points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                  />
                </Svg>
              :
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Polygon
                    fill={Colors.COLOR_LIGHTDARK_GRAY}
                    points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                  />
                </Svg>
              }
          </View>
        </TouchableOpacity>
        { this.state.showEducationEdit ? educationEdit : undefined }
      </View>

      <View style={baseStyles.splitter_full}>
      </View>

      <View style={[styles.profile7]}>
        <TouchableOpacity onPress={() => this.setState({showCareersEdit: !this.state.showCareersEdit})}>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Text style={[styles.bigTitle, {flex: 1}]}>
              Опыт работы
            </Text>
            <Text style={styles.bigTitle_counter}>
              { /*this.props.user.careers.length || 0*/ }
            </Text>
            {
              !this.state.showCareersEdit ?
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Polygon
                    fill={Colors.COLOR_LIGHTDARK_GRAY}
                    points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                  />
                </Svg>
              :
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Polygon
                    fill={Colors.COLOR_LIGHTDARK_GRAY}
                    points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                  />
                </Svg>
              }
          </View>
        </TouchableOpacity>
        <View>
          { this.state.showCareersEdit ?


          careersEdit


          : undefined }
        </View>
      </View>
    </View>

    return (
      // this.state.dataloaded ?
        <SideMenu
          menu={menu}
          bounceBackOnOverdraw={false}
          isOpen={this.state.isOpen}
          animationFunction={animationFunction}
          onChange={isOpen => this.updateMenuState(isOpen)}
          openMenuOffset={Dimensions.get('window').width * (6 / 7)}
        >
          {/*{console.warn((new Date()).getSeconds(), 'render', this.state)}*/}
          <View style={[baseStyles.container, styles.profileContainer]}>
            <ScrollView keyboardShouldPersistTaps='handled'>
              <PageHeader title={'Мой профиль'} menu={true}/>
              <View style={[styles.top_wrapper]}>
                <View style={[baseStyles.row, baseStyles.contentSpaceBetween, styles.top_wrapper_btns]}>
                  <TouchableOpacity
                    onPress={() => this.changeTab('view')}>
                    <Text style={[styles.tabHead, this.state.mode == 'view' ? styles.tabHead_active : '']}>
                      Просмотр
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity

                    onPress={() => this.changeTab('edit')}>
                    <Text style={[styles.tabHead, this.state.mode == 'edit' ? styles.tabHead_active : '']}>
                      Редактирование
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                { this.state.mode === 'view' ? viewTab : editTab }
              </View>
            </ScrollView>
            {
              this.state.mode != 'view' ?
              <View style={styles.editContainerControls}>
                <View style={{flex: 3}}>
                  <TouchableOpacity onPress={() => this.saveChanges()}>
                    <View style={[baseStyles.verticalCenter, baseStyles.horizontalCenter, {flexDirection: 'row'}]}>
                      <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 10}}>
                        <Path
                          fill={Colors.COLOR_LIGHT_BLUE}
                          d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M10,17 L5,12 L6.41,10.59 L10,14.17 L17.59,6.58 L19,8 L10,17 L10,17 Z"
                        />
                      </Svg>
                      <Text style={[buttonsStyles.buttonMiddleText, buttonsStyles.buttonMiddleText_blue]}>Сохранить изменения</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 2, borderLeftWidth: 1, borderColor: Colors.COLOR_LIGHT_GRAY, paddingTop: 5, paddingBottom: 5}}>
                  <TouchableOpacity onPress={() => {this.setDefaultData(); this.changeTab('view');}}>
                    <Text style={[buttonsStyles.buttonMiddleText, buttonsStyles.buttonMiddleText_grey]}>Отменить</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              undefined
            }
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
            onWillFocus={() => {
              this._onPageFocus();
            }}
          />
        </SideMenu>
    );
  }

  _onPageFocus() {
    //console.warn(this.state.isOpen)
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      })
    }
  }

  onRegionChange(region) {
    this.state.region.setValue(region);
  }

  changeTab(mode) {
    this.setState({
      mode: mode
    });
  }

  saveChanges() {
    this.props.saveUserData(this.state.userdata)
  }


  setDefaultData() {
    //Alert.alert('setDefaultData', JSON.stringify(this.props.user.phones));
    let servicesSorted = [];

    let performed = {
      count: this.props.user.performedtasks.length,
      users:[],
      reviewcount: 0,
      feedback: 0,
      rating: 0,
      ratings: []
    }

    let created = {
      count: this.props.user.createdtasks.length,
      users:[],
      reviewcount: 0,
      feedback: 0,
      rating: 0,
      ratings: []
    }

    // Получаем статистику по выполненным и созданым таскам
    if(Array.isArray(this.props.user.reviews)) {
      this.props.user.reviews.map((item) => {
        // Выполненные
        if (item.type_as == 1) {
          performed.ratings.push(item.rating);
          performed.rating += item.rating;
        }
        // Созданные
        if (item.type_as == 0) {
          created.ratings.push(item.rating);
          created.rating += item.rating;
        }
      });
    }

    performed.feedback = performed.ratings.length;
    performed.rating = (performed.rating/performed.feedback).toFixed(2);

    created.feedback = created.ratings.length;
    created.rating = (created.rating/created.feedback).toFixed(2);


    // Собираем заказчиков и исполнителей
    this.props.user.performedtasks.map((item) => {
      if (performed.users.indexOf(item.user_id) <= 0) {
        performed.users.push(item.user_id);
      }
    });
    this.props.user.createdtasks.map((item) => {
      if (!Array.isArray(item.api_performers)) {
        Object.keys(item.api_performers).map(function(objectKey, index) {
          if (item.api_performers[objectKey] && created.users.indexOf(objectKey) <= 0) {
            created.users.push(objectKey);
          }
        });
      }
    });

    performed.users = performed.users.length;
    created.users = created.users.length;

    this.props.user.services.forEach((item, index) => {
      if (index == 0) {
        servicesSorted.push({tag: this.props.app.tags.find(a => a.id === item.tag_id), items: [item]});
      } else {
        if (item.tag_id == servicesSorted[servicesSorted.length - 1].tag.id) {
          servicesSorted[servicesSorted.length - 1].items.push(item)
        } else {
          servicesSorted.push({tag: this.props.app.tags.find(a => a.id === item.tag_id), items: [item]});
        }
      }
    });

    //.alert(JSON.stringify(servicesSorted))
    this.setState({
      userdata: {
        userid: this.props.user.data.id,
        email: this.props.user.data.email,
        vk: this.props.user.data.vk,
        insta: this.props.user.data.insta,
        odnoklass: this.props.user.data.odnoklass,
        youtube: this.props.user.data.youtube,
        skype: this.props.user.data.skype,
        facebook: this.props.user.data.facebook,
        about: this.props.user.data.about,
        gender: this.props.user.data.gender,
        name: this.props.user.data.name,
        surname: this.props.user.data.surname,
        phones: this.props.user.phones.map((item) => {
          return item.phone;
        }),
        address: this.props.user.data.address,
        address_comment: this.props.user.data.address_comment,
        lat: this.props.user.data.lat,
        lng: this.props.user.data.lng,
        tags: this.props.user.usertags,
        educations: this.props.user.educations,
        careers: this.props.user.careers,
      }
    });


    this.setState({
      performed: performed,
      created: created,
      services: servicesSorted,
      dataloaded: true,
    });


  }

  updateMenuState(isOpen) {
    console.warn('profile',isOpen)
    this.setState({
      isOpen
    });
  }

  // Добавление нового доп телефона
  addAdditionalPhone() {
    var phones = this.state.userdata.phones;

    if (phones.length && phones[phones.length - 1] !== '') {
      phones.push('');
      this.setState(Object.assign(this.state, {
        userdata: {
          ...this.state.userdata,
          phones: phones
        }
      }));
    }
  };


  removeCareer(index) {

    this.setState(Object.assign(this.state, {
      userdata: {
        ...this.state.userdata,
        careers: this.state.userdata.careers.map((item, elIndex) => {
          if (elIndex == index) {
            return {
              ...item,
              removed: true
            }
          } else {
            return item
          }
        })
      }
    }));
  }

  removeEducation(index) {

    this.setState(Object.assign(this.state, {
      userdata: {
        ...this.state.userdata,
        educations: this.state.userdata.educations.map((item, elIndex) => {
          if (elIndex == index) {
            return {
              ...item,
              removed: true
            }
          } else {
            return item
          }
        })
      }
    }));
  }

  // Добавление нового образования
  addAdditionalEducation() {
    this.setState(Object.assign(this.state, {
      userdata: {
        ...this.state.userdata,
        educations: [...this.state.userdata.educations, {
          type_id: 1,
          city: '',
          school: '',
          year_start: '',
          year_end: '',
          new: true,
        }]
      }
    }));
  };

  // Добавление нового опыта работы
  addAdditionalCareers() {
    this.setState(Object.assign(this.state, {
      userdata: {
        ...this.state.userdata,
        careers: [...this.state.userdata.careers, {
          post: '',
          title: '',
          text: '',
          year_start: '',
          year_end: '',
          progress: '',
          new: true
        }]
      }
    }));
  };

  // KLADR
  kladr(type, text, geocode) {
    switch(type) {
      case 'address':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            address: text
          },
          kladr: {
            ...this.state.kladr,
            address: text
          }
        }));

        if (geocode) {
          Geocoder.from(this.state.userdata.address)
            .then(json => {

              this.setState({
                userdata: {
                  ...this.state.userdata,
                  lat: json.results[0].geometry.location.lat,
                  lng: json.results[0].geometry.location.lng
                },
              });
            })
            .catch(error => console.warn(error));
        }

      break;
    }
  }

  // On user text typing
  writing(type, text, index){
    switch(type) {
      case 'educationsType':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            educations: this.state.userdata.educations.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  type_id: text,
                  dirty: true
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
      case 'educationsCity':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            educations: this.state.userdata.educations.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  city: text,
                  dirty: true
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
      case 'educationsSchool':
        this.setState(Object.assign(this.state, {
          userdata: {
              ...this.state.userdata,
              educations: this.state.userdata.educations.map((item, elIndex) => {
                if (elIndex == index) {
                  return {
                    ...item,
                    school: text,
                    dirty: true
                  }
                } else {
                  return item
                }
              })
            }
          }));
      break;
      case 'educationsDate':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            educations: this.state.userdata.educations.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  year_start: text.from,
                  year_end: text.to,
                  dirty: true
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
      case 'careersTitle':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            careers: this.state.userdata.careers.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  title: text,
                  dirty: true
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
      case 'careersPost':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            careers: this.state.userdata.careers.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  post: text,
                  dirty: true
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
      case 'careersText':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            careers: this.state.userdata.careers.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  text: text,
                  dirty: true
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
      case 'careersProgress':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            careers: this.state.userdata.careers.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  progress: text,
                  dirty: true
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
      case 'careersDate':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            careers: this.state.userdata.careers.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  year_start: text.from,
                  year_end: text.to,
                  dirty: true
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
      case 'email':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            email: text
          }
        }));
      break;
      case 'vk':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            vk: text
          }
        }));
      break;
      case 'facebook':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            facebook: text
          }
        }));
      break;
      case 'insta':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            insta: text
          }
        }));
      break;
      case 'odnoklass':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            odnoklass: text
          }
        }));
      break;
      case 'skype':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            skype: text
          }
        }));
      break;
      case 'youtube':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            youtube: text
          }
        }));
      break;
      case 'password':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            password: text
          }
        }));
      break;
      case 'phones':
        this.state.userdata.phones[index] = text;
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            phones: this.state.userdata.phones
          }
        }));
      break;
      case 'about':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            about: text
          }
        }));
      break;
      case 'address_comment':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            address_comment: text
          }
        }));
      break;
      case 'gender':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            gender: text
          }
        }));
      break;
      case 'name':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            name: text
          }
        }));
      break;
      case 'surname':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            surname: text
          }
        }));
      break;
      case 'avatar':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            avatar: text
          }
        }));
      break;
      case 'educationImage':
        this.setState(Object.assign(this.state, {
          userdata: {
            ...this.state.userdata,
            educations: this.state.userdata.educations.map((item, elIndex) => {
              if (elIndex == index) {
                return {
                  ...item,
                  api_images: [
                    ...item.api_images,
                    {
                      data: text,
                      dirty: true,
                    }
                  ]
                }
              } else {
                return item
              }
            })
          }
        }));
      break;
    }
  };
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      getUserData: (userid) => getUserData(userid),
      navigateToTags: (route) => navigateToTags(route),
      navigateToUser: (userid, title) => navigateToUser(userid, title),
      saveUserData: (userdata) => saveUserData(userdata),
      getGeolocation: getGeolocation,
      getMyTasks: (userid) => getMyTasks(userid),
      getTeamData: (userid) => getTeamData(userid),
      getFinanceAccountData: (userid) => getFinanceAccountData(userid),
      getTaskCount: getTaskCount,
      getTaskAll: getTaskAll,
      getTaskResponds: getTaskResponds,
      getTaskDelegate: getTaskDelegate,
      getTaskChoice: getTaskChoice,
      getTaskMake: getTaskMake,
      getTaskArhiv: getTaskArhiv,
      getNewTasks: getNewTasks,
      getPerformersData: (page, type, location) => getPerformersData(page, type, location)
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
)(ProfilePage);