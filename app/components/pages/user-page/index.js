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
    TextInput
} from 'react-native';
import MapView, {Marker} from 'react-native-maps'
// import MapView, { PROVIDER_GOOGLE, Marker, Animated as AnimatedMapView, AnimatedRegion } from 'react-native-maps';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import PageHeader from '../../blocks/page-header';
import FormInput from '../../forms/form-input';
import SocialLogin from '../../blocks/social-login';
import ImageViewer from '../../blocks/image-viewer';

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
  getUserData, 
  navigateToUser, 
  navigateToProfile, 
  navigateTo, 
  navigateBack 
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

class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      mode: 'view',
      careersEditIndex: undefined,
      educationsEditIndex: undefined,

      slideAnimation: new Animated.Value(22),
      refreshing: false,
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
  }

  componentDidMount() {

    this.props.getUserData(this.props.nav.routes[this.props.nav.index].params.userid);

    this.userdataloadedListener = EventRegister.addEventListener('USER_DATA_LOADED', (data) => {
      this.setProfileDefaultData();
    });

    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.leftMenu);
    EventRegister.removeEventListener(this.userdataloadedListener);
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
    let additionalData = <View>
      { this.props.profile.phones ? this.props.profile.phones.map((item, index) => {
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
      }) : undefined}
      {
        this.props.profile.data.skype ? 
        <View>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
              <Path
                fill={Colors.COLOR_GRAY_ICONS}
                d="M16.674965,15.499785 C16.302565,16.036535 15.755365,16.455485 15.039065,16.7560017 C14.3224483,17.0584183 13.475365,17.2091517 12.496865,17.2091517 C11.3248817,17.2091517 10.3542983,17.004585 9.587965,16.5888017 C9.04393167,16.2927183 8.602815,15.8956183 8.263665,15.3984517 C7.922615,14.9016017 7.75034833,14.4155183 7.75034833,13.9405183 C7.75034833,13.6621683 7.85738167,13.4186517 8.06448167,13.2194683 C8.27443167,13.020285 8.544865,12.920535 8.864065,12.920535 C9.12594833,12.920535 9.34919833,12.9987517 9.53254833,13.155185 C9.713365,13.310985 9.86599833,13.5367683 9.989815,13.8360183 C10.1392817,14.183085 10.3020483,14.4725183 10.4736817,14.7030517 C10.6449983,14.9320017 10.8862983,15.122635 11.1978983,15.2714683 C11.5072817,15.4212517 11.918315,15.4953517 12.4325817,15.4953517 C13.136215,15.4953517 13.7055817,15.343985 14.140365,15.042835 C14.5779983,14.7404183 14.7876317,14.3715017 14.7876317,13.925635 C14.7876317,13.5700183 14.6745817,13.288185 14.4430983,13.0690517 C14.207815,12.8451683 13.904765,12.6751183 13.5288817,12.5570017 C13.1517317,12.436985 12.6453817,12.3103183 12.0107817,12.176685 C11.158315,11.9911183 10.445815,11.7745183 9.86789833,11.5253017 C9.290615,11.276085 8.829865,10.9353517 8.48913167,10.503735 C8.14713167,10.0689517 7.97708167,9.52776833 7.97708167,8.88746833 C7.97708167,8.27630167 8.157265,7.72910167 8.516365,7.254735 C8.877365,6.777835 9.39828167,6.41240167 10.077215,6.15875167 C10.7542483,5.90446833 11.5512983,5.77716833 12.465515,5.77716833 C13.1944817,5.77716833 13.826865,5.86140167 14.361715,6.02955167 C14.8943483,6.19896833 15.339265,6.42285167 15.6929817,6.70310167 C16.0466983,6.983035 16.3069983,7.277535 16.4710317,7.58755167 C16.6356983,7.89725167 16.718665,8.20156833 16.718665,8.49670167 C16.718665,8.77251833 16.612265,9.02236833 16.4035817,9.24055167 C16.1955317,9.46031833 15.9304817,9.57146833 15.6201483,9.57020167 C15.340215,9.57020167 15.120765,9.50655167 14.9684483,9.37006833 C14.8199317,9.23706833 14.6641317,9.02680167 14.495665,8.732935 C14.281915,8.32411833 14.0276317,8.00491833 13.7312317,7.77596833 C13.4414817,7.55271833 12.965215,7.435235 12.3024317,7.437135 C11.6880983,7.437135 11.1978983,7.56285167 10.8273983,7.80826833 C10.4540483,8.05685167 10.275765,8.34565167 10.274815,8.68480167 C10.275765,8.897285 10.3368817,9.07620167 10.460065,9.22820167 C10.5841983,9.383685 10.758365,9.51636833 10.9809817,9.63036833 C11.2042317,9.74405167 11.4306483,9.83271833 11.658965,9.89700167 C11.8894983,9.96191833 12.272665,10.0559683 12.8040317,10.1813683 C13.4702983,10.326085 14.0760817,10.4869517 14.6197983,10.661435 C15.1631983,10.8368683 15.6255317,11.0496683 16.008065,11.302685 C16.393765,11.554435 16.695865,11.8749017 16.9108817,12.2637683 C17.1274817,12.6523183 17.2341983,13.1273183 17.2341983,13.6856017 C17.2351483,14.3585183 17.0479983,14.9636683 16.674965,15.499785 M21.1928483,12.867335 C21.2640983,12.4195683 21.3011483,11.9613517 21.3011483,11.4933183 C21.3011483,6.626785 17.358015,2.68396833 12.4927483,2.68396833 C12.024715,2.68396833 11.565865,2.72165167 11.1180983,2.79226833 C10.306165,2.29066833 9.34919833,1.99996833 8.322565,1.99996833 C5.383265,1.99996833 3.00003167,4.38320167 3.00003167,7.324085 C3.00003167,8.34945167 3.28978167,9.30546833 3.79169833,10.1196183 C3.72298167,10.5686517 3.68498167,11.0249683 3.68498167,11.4933183 C3.68498167,16.3589017 7.62748167,20.3017183 12.492115,20.3017183 C12.9598317,20.3017183 13.4189983,20.2653017 13.866765,20.1940517 C14.6796483,20.6950183 15.636615,20.9863517 16.662615,20.9863517 C19.6025483,20.9863517 21.9857817,18.6021683 21.9857817,15.6638183 C21.9857817,14.6375017 21.695715,13.6802183 21.1928483,12.867335"
              />
            </Svg>
            <Text style={[baseStyles.midText, {flex: 1, color: Colors.COLOR_LIGHT_BLUE}]}>
              {this.props.profile.data.skype}
            </Text>
          </View>
          <View style={[baseStyles.splitter_full, baseStyles.splitter_full_smlmg]}>
          </View>
        </View>
        : undefined
      }
      {
        this.props.profile.data.ext_email ? 
        <View>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
              <Path
                fill={Colors.COLOR_GRAY_ICONS}
                d="M20,4 L4,4 C2.9,4 2.01,4.9 2.01,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 C22,4.9 21.1,4 20,4 L20,4 Z M20,8 L12,13 L4,8 L4,6 L12,11 L20,6 L20,8 L20,8 Z"
              />
            </Svg>
            <Text style={[baseStyles.midText, {flex: 1, color: Colors.COLOR_LIGHT_BLUE}]}>
              {this.props.profile.data.ext_email}
            </Text>
          </View>
          <View style={[baseStyles.splitter_full, baseStyles.splitter_full_smlmg]}>
          </View>
        </View>
        : undefined
      }
      <View style={styles.socialBlock}>
        <SocialLogin 
          partial={true} 
          vk={this.props.profile.data.vk ? this.props.profile.data.vk : false} 
          facebook={this.props.profile.data.facebook ? this.props.profile.data.facebook : false} 
          youtube={this.props.profile.data.youtube ? this.props.profile.data.youtube : false} 
          insta={this.props.profile.data.insta ? this.props.profile.data.insta : false} 
          odnoklass={this.props.profile.data.odnoklass ? this.props.profile.data.odnoklass : false} 
          />
      </View>
    </View>

    let blogsinfo = <View style={styles.blog_post}>
      <View style={[baseStyles.row, baseStyles.verticalCenter]}>
        <Text style={styles.blog_post_len}>
          { this.state.blogs.length }
        </Text>
        <Text style={styles.blog_post_text}>
          { textPrepared(this.state.blogs.length, this.state.titles.article) } в&nbsp;блоге
        </Text>
      </View>
        { this.state.blogs.length ? 
          <View style={styles.blog_post_counters}>
            <Text style={styles.blog_post_title}>
              { this.state.blogs[0].title }
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
                { this.state.blogs[0].view }
              </Text>
              <Svg width={14} height={14} viewBox='0 0 20 20' style={{marginTop: 2, marginLeft: 10}}>
                <Path fill={Colors.COLOR_GRAY_ICONS}
                  d="M17.406,0.742H2.594c-1.019,0-1.852,0.833-1.852,1.852v16.664l3.703-3.703h12.961
                    c1.019,0,1.852-0.834,1.852-1.852V2.594C19.258,1.575,18.425,0.742,17.406,0.742L17.406,0.742z
                  "/>
              </Svg>
              <Text style={[styles.blog_post_title, {marginLeft: 2}]}>
                { this.state.blogs[0].is_comment }
              </Text>
            </View>
          </View> 
        : undefined }
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
            <TouchableHighlight 
              key={'team'+index} 
              underlayColor="transparent" 
              onPress={() => {
                if (this.props.user.data.id !== item.photo.photo[0].user_id) {
                  this.props.navigateToUser(
                    item.photo.photo[0].user_id, 
                    'Состоит в команде'
                    )
                } else {
                  this.props.navigateToProfile()
                }
              }
            }>
              <Image style={styles.profileAvatar_inteam} source={{uri:`${item.photo.path}${item.photo.photo[0].photo_cropped}`}} resizeMode='cover'/>
            </TouchableHighlight>
          )
      }
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
                        </View> : undefined
                      }
                    </View>)
                })
              } 
            </View>)
        })
      }
      </View>

    let education = <View>
      { this.props.profile.educations.map((item, index) => {
        
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
              <TouchableHighlight 
                key={'educationImageEditModal'+imgIndex} 
                underlayColor="transparent" 
                onPress={() => {
                  StatusBar.setBackgroundColor('rgba(0,0,0,1)');
                  this.setState({showEducationModal: true,educationModalIndex: imgIndex})}
                }>
                  <Image
                  style={{width: 90, height: 100, marginRight: 10, marginBottom: 10}} 
                  source={{uri:`https://myteam.pro/${img.url}`}} 
                  resizeMode='contain'
                  />
              </TouchableHighlight>)
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

    let careers = <View>
      { this.props.profile.careers.map((item, index) => {

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
                : undefined
              }

              { item.progress ? 
                <Text style={baseStyles.midText}>
                  { item.progress.replace(new RegExp('&quot;', 'g'), '"')}
                </Text>
                : undefined
              }
            </View>
          </View>
          )
        })
      }
    </View>

    let tags = this.props.profile.usertags.map((item, index) => {
      return (
        <View key={'tagskill'+index} style={formsStyles.tags_item}>
          <Text style={[styles.skill, item.is_qualification ? styles.skill_main : undefined]}>
            { item.title }
          </Text>
        </View>
        )
    });

    let viewTab = <View>
      <View style={styles.profile1}>
        <View style={[baseStyles.row]}>
          <View style={styles.profileLeft}>
            { 
              <TouchableHighlight 
                underlayColor="transparent" 
                onPress={() => {
                  StatusBar.setBackgroundColor('rgba(0,0,0,1)');
                  this.setState({showAvatarModal: true})}
                }>
                  {
                    this.props.profile.photo ? 
                    <Image style={styles.profileAvatar} source={{uri:`${this.props.profile.photo.path}${this.props.profile.photo.photo[0].photo_cropped}`}} resizeMode='cover'/>
                    :
                    <Image style={styles.profileAvatar} source={require('../../../../assets/images/ava.png')} resizeMode='contain'/>
                  }
              </TouchableHighlight>
            }
            <ImageViewer
              close={() => {
                StatusBar.setBackgroundColor('rgba(0,0,0,0)');
                this.setState({showAvatarModal: false})}
              }
              visible={this.state.showAvatarModal}
              index={0}
              images={
                this.props.profile.photo ?
                  [{url:`${this.props.profile.photo.path}${this.props.profile.photo.photo[0].photo_cropped}`}]
                  :
                  [require('../../../../assets/images/ava.png')]
              } />
            <Svg width={50} height={22} viewBox={'-4.875 -2 47.208 22'}>
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
          <View style={styles.profileRight}>
            <Text style={styles.profileTitle}>
              {this.props.profile.data.name}
            </Text>
            <Text style={styles.profileTitle}>
              {this.props.profile.data.surname}
            </Text>
            <View style={[styles.skillContainer, {flexDirection: 'row'}]}>
              { tags }
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
      
      {
        this.state.team && this.state.team.length ?
          <View style={[baseStyles.row, styles.profile2]}>
            <Text style={styles.profile2_title}>
              Состоит в&nbsp;команде:
            </Text>
            <View style={baseStyles.row}>
              { usersInTeam }
              { this.state.team && this.state.team.length && this.state.team.length > 3 ? 
                <View style={styles.moreInTeam}>
                  <Text style={styles.moreInTeamText}>
                    + {this.state.team.length - 3}
                  </Text>
                </View>
              : undefined }
            </View>
          </View>
        : undefined
      }

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
                  <Stop offset={(this.state.performed.rating)/5 - 0.001} stopColor={Colors.COLOR_YELLOW}></Stop>
                  <Stop offset={(this.state.performed.rating)/5} stopColor={Colors.COLOR_LIGHT_GRAY}></Stop>
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
            <Text style={styles.addinfo_text_rating}>
              { Number.isNaN(this.state.performed.rating) || this.state.performed.rating == 'NaN' ? '' : this.state.performed.rating }
            </Text>
          </View>
          <Text style={styles.addinfo_text}>
            {this.state.performed.feedback || 0} {textPrepared(this.state.performed.feedback || 0, this.state.titles.repl)} 
          </Text>
        </View>

        <View style={{flex: 2}}>
          <Text style={styles.big_label}>
            { this.state.performed.users || 0}
          </Text>
          <Text style={styles.addinfo_text}>
            { textPrepared(this.state.performed.users || 0, this.state.titles.customer) }
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.big_label}>
            {this.state.performed.count || 0}
          </Text>
          <Text style={styles.addinfo_text}>
            { textPrepared(this.state.performed.count || 0, this.state.titles.task) }
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
                {
                  (this.state.created.rating || 0) <= 2 && (this.state.created.count || 0) > 1 ?
                  'Плохо!' 
                  : (this.state.created.rating || 0) > 2 &&  (this.state.created.rating || 0) <= 3 ? 
                  'Нормально!'
                  : (this.state.created.rating || 0) > 3 &&  (this.state.created.rating || 0) <= 4 ?
                  'Отлично!'
                  : (this.state.created.rating || 0) > 4 &&  (this.state.created.rating || 0) <= 5 ?
                  'Супер!'
                  : 'Нет задач'
                }
              </Text>
              <Text style={styles.addinfo_text}>
                {this.state.created.feedback || 0} {textPrepared(this.state.created.feedback || 0, this.state.titles.repl)} {/*this.state.created.rating || 0*/}
              </Text>
            </View>
            <View>
              { ratingicon }
            </View>
          </View>
        </View>

        <View style={{flex: 2}}>
          <Text style={styles.big_label}>
            {this.state.created.users || 0}
          </Text>
          <Text style={styles.addinfo_text}>
            { textPrepared(this.state.created.users || 0, this.state.titles.executor) }
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.big_label}>
            {this.state.created.count || 0}
          </Text>
          <Text style={styles.addinfo_text}>
            { textPrepared(this.state.created.count || 0, this.state.titles.task) }
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
          <View>
            <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginTop: 6, marginRight: 6}}>
              <Path
                fill={Colors.COLOR_GRAY_ICONS}
                d="M12,2 C8.13,2 5,5.13 5,9 C5,14.25 12,22 12,22 C12,22 19,14.25 19,9 C19,5.13 15.87,2 12,2 L12,2 Z M12,11.5 C10.62,11.5 9.5,10.38 9.5,9 C9.5,7.62 10.62,6.5 12,6.5 C13.38,6.5 14.5,7.62 14.5,9 C14.5,10.38 13.38,11.5 12,11.5 L12,11.5 Z"
              />
            </Svg>
          </View>
          <View>
            <Text style={baseStyles.midText}>
              { this.props.profile.data.address }
            </Text>
            <Text style={baseStyles.smallText}>
              { this.props.profile.data.address_comment }
            </Text>
          </View>
        </View>
      </View>
      {
        this.props.profile.data.phone ?
          <View>
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
                  { this.props.profile.data.phone }
                </Text>
              </View>
            </View>
          </View>

        : undefined
      }
        this.props.profile.data.lat && this.props.profile.data.lng ?
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              // provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: parseFloat(this.props.profile.data.lat)|| 0.00,
                longitude: parseFloat(this.props.profile.data.lng)|| 0.00,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              >
              <Marker
                coordinate={{latitude: parseFloat(this.props.profile.data.lat) || 0.00, longitude: parseFloat(this.props.profile.data.lng) || 0.00}}
                image={require('../../../../assets/images/location.png')}
                centerOffset={{x:10, y:0}}
              />
            </MapView>
          </View>
        : undefined


      {
        this.props.profile.data.about ?
          <View style={[styles.profile6]}>
            <Text style={styles.normalTitle_bold}>
              О себе
            </Text>
            <Text style={baseStyles.midText}>
              { this.props.profile.data.about }
            </Text>
          </View>
        : undefined
      }

      <View style={baseStyles.splitter_smlmg}>
      </View>
      {
        this.props.profile.phones && this.props.profile.length ||
        this.props.profile.data.skype ||
        this.props.profile.data.ext_email || 
        this.props.profile.data.vk ||
        this.props.profile.data.facebook ||
        this.props.profile.data.insta ||
        this.props.profile.data.odnoklass ||
        this.props.profile.data.youtube
        ? 
        <View style={[styles.profile6]}>
          <Text style={styles.normalTitle_bold}>
            Дополнительные контактные данные
          </Text>
          { additionalData }
        </View>
        : undefined
      }

      <View style={[styles.profile7]}>
        <TouchableHighlight underlayColor="transparent" onPress={() => this.setState({showServices: !this.state.showServices})}>
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
        </TouchableHighlight>
        { this.state.showServices ? services : undefined }
      </View>

      <View style={baseStyles.splitter_full}>
      </View>

      <View style={[styles.profile7]}>
        <TouchableHighlight underlayColor="transparent" onPress={() => this.setState({showEducation: !this.state.showEducation})}>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Text style={[styles.bigTitle, {flex: 1}]}>
              Образование
            </Text>
            <Text style={styles.bigTitle_counter}>
              { this.props.profile.educations.length || 0 }
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
        </TouchableHighlight>
        { this.state.showEducation ? education : undefined }
      </View>

      <View style={baseStyles.splitter_full}>
      </View>

      <View style={[styles.profile7]}>
        <TouchableHighlight underlayColor="transparent" onPress={() => this.setState({showCareers: !this.state.showCareers})}>
          <View style={[baseStyles.row, baseStyles.verticalCenter]}>
            <Text style={[styles.bigTitle, {flex: 1}]}>
              Опыт работы
            </Text>
            <Text style={styles.bigTitle_counter}>
              { this.props.profile.careers.length || 0 }
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
        </TouchableHighlight>
        { this.state.showCareers ? careers : undefined }
      </View>
    </View>

    return (
      this.state.dataloaded ? 
        <SideMenu
          menu={menu}
          bounceBackOnOverdraw={false}
          isOpen={this.state.isOpen}
          animationFunction={animationFunction}
          onChange={isOpen => this.updateMenuState(isOpen)}
          openMenuOffset={Dimensions.get('window').width * (6 / 7)}
        >
          <View style={[baseStyles.container, styles.profileContainer]}>
            <ScrollView keyboardShouldPersistTaps='handled'>
              <PageHeader 
                title={this.props.nav.routes[this.props.nav.index].params ? this.props.nav.routes[this.props.nav.index].params.title : ''} 
                template={this.props.nav.routes[this.props.nav.index].params ? this.props.nav.routes[this.props.nav.index].params.template : ''} 
                back={true}
                onBack={() => {this.props.navigateBack(null)}}
                />
              { viewTab }
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

  setProfileDefaultData() {
    this.setState({
      userdata: {
        userid: this.props.profile.data.id,
        email: this.props.profile.data.email,
        vk: this.props.profile.data.vk,
        insta: this.props.profile.data.insta,
        odnoklass: this.props.profile.data.odnoklass,
        youtube: this.props.profile.data.youtube,
        skype: this.props.profile.data.skype,
        facebook: this.props.profile.data.facebook,
        about: this.props.profile.data.about,
        gender: this.props.profile.data.gender,
        name: this.props.profile.data.name,
        surname: this.props.profile.data.surname,
        phones: this.props.profile.phones.map((item) => {
          return item.phone;
        }),
        address: this.props.profile.data.address,
        address_comment: this.props.profile.data.address_comment,
        lat: this.props.profile.data.lat,
        lng: this.props.profile.data.lng,
        tags: this.props.profile.usertags,
        educations: this.props.profile.educations,
        careers: this.props.profile.careers,
      }
    });

    let servicesSorted = [];

    let performed = {
      count: this.props.profile.performedtasks.length,
      users:[],
      reviewcount: 0,
      feedback: 0,
      rating: 0,
      ratings: []
    }

    let created = {
      count: this.props.profile.createdtasks.length,
      users:[],
      reviewcount: 0,
      feedback: 0,
      rating: 0,
      ratings: []
    }

    // Получаем статистику по выполненным и созданым таскам
    this.props.profile.reviews.map((item) => {
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

    //console.warn(JSON.stringify(performed, 0 ,2))
    performed.feedback = performed.ratings.length;
    performed.rating = (performed.rating/performed.feedback).toFixed(2);
    performed.rating = Number.isNaN(performed.rating) ? 0 : performed.rating

    created.feedback = created.ratings.length;
    created.rating = (created.rating/created.feedback).toFixed(2);


    // Собираем заказчиков и исполнителей
    this.props.profile.performedtasks.map((item) => {
      if (performed.users.indexOf(item.user_id) <= 0) {
        performed.users.push(item.user_id);
      }
    });
    this.props.profile.createdtasks.map((item) => {
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

    this.props.profile.services.forEach((item, index) => {
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

    this.setState({
      performed: performed,
      created: created,
      team: this.props.profile.team,
      blogs: this.props.profile.blogs,
      services: servicesSorted,
      dataloaded: true,
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
      getUserData: (userid) => getUserData(userid),
      navigateToUser: (userid) => navigateToUser(userid),
      navigateToProfile: navigateToProfile,
      navigateTo: (key) => navigateTo(key),
      navigateBack: (key) => navigateBack(key),
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      profile: state.profile,
    }
  }, mapDispatchToProps
)(UserPage);