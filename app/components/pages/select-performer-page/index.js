import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableHighlight,
    ActivityIndicator,
} from 'react-native';
import PageHeader from '../../blocks/page-header';

import DropdownAlert from 'react-native-dropdownalert';

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
  navigateBack,
  setPerformer,
} from '../../../actions';

import { EventRegister } from 'react-native-event-listeners';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors,
} from '../../styles/colors.js';

class SelectPerformerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataloaded: true,
      task: {},
      performers: []
    }
  }

  componentDidMount() {
    let respondsArr = [];
    let task = this.props.nav.routes[this.props.nav.index].params.task;
    if (!Array.isArray(task.responds)) {
      result = Object.keys(task.responds).filter(function(objectKey, index) {
        respondsArr.push(task.responds[objectKey])
      });
    }

    this.setState({
        dataloaded: true,
        task: this.props.nav.routes[this.props.nav.index].params.task.attributes,
        performers: [
        ...respondsArr
      ]
    });

    this.performedChanged = EventRegister.addEventListener('TASK_PERFORMER_CHANGED', () => {
      this.props.navigateBack();
    });
  };

  componentWillUnmount() {
    this.setState({
      dataloaded: false 
    });
    EventRegister.removeEventListener(this.performedChanged);
  };

  render() {

    const performers = this.state.performers.map((item, index) => {

      let before = (((parseFloat(item.user.rating_spec) || 0) + 0.0001)/5 - 0.001).toFixed(3);
      let after = (((parseFloat(item.user.rating_spec) || 0) + 0.0001)/5).toFixed(3);
      if(after < 0) after = 0;
      if(before < 0) before = 0;

      return (
          <View key={`user_${item.id}_${index}`}>
            <View style={styles.performerBlock} key={'performer_'+index}>
              <TouchableHighlight 
                underlayColor="transparent"
                onPress={() => 
                  this.props.navigateToUser(
                    item.user.id,
                    'Пользователь'
                    )
                }>
                {
                  item.photo ?
                  <Image style={styles.avatar_small} source={{uri:`${item.photo}`}} resizeMode='cover'/>
                  :
                  <Image style={styles.avatar_small} source={require('../../../../assets/images/ava.png')} resizeMode='cover'/>
                }
              </TouchableHighlight>
              <View style={{flex: 1}}>
                <Text style={[baseStyles.midText, {flex: 1, marginBottom: 4}]}>
                  { item.user.name + ' ' + item.user.surname }
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                  <Svg width={92} height={16} style={styles.refElImage} viewBox="0 0 92 16">
                    <Defs>
                      <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="92" y2="0" id="LinearGradient1">
                        <Stop offset="0" stopColor={Colors.COLOR_YELLOW}></Stop>
                        <Stop offset={before} stopColor={Colors.COLOR_YELLOW}></Stop>
                        <Stop offset={after} stopColor={Colors.COLOR_LIGHT_GRAY}></Stop>
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
                  <Text style={item.user.rating_spec ? styles.rating_spec : styles.rating_spec_null}>
                    { item.user.rating_spec || '0.00' }
                  </Text>
                  <Svg style={{marginLeft: 10}} width={16} height={16} viewBox="0 0 24 24">
                    <Path
                      d={(item.user.rating_client || 0) <= 2 && (item.user.rating_client || 0) >= 1 ?
                        'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.6225 C17,8.7925 14,8.7925 14,9.6225 C14,10.4525 14.67,11.1225 15.5,11.1225 C16.33,11.1225 17,10.4525 17,9.6225 Z M10,9.6225 C10,8.7925 7,8.7925 7,9.6225 C7,10.4525 7.67,11.1225 8.5,11.1225 C9.33,11.1225 10,10.4525 10,9.6225 Z M6.85643066,16.3927002 C6.85643066,16.3927002 8.43225098,14.7425537 11.8551025,14.8043213 C15.2779541,14.8660889 17.0764307,16.3927002 17.0764307,16.3927002 C16.2764307,14.3527002 14.262251,13.3043213 11.932251,13.3043213 C9.60225098,13.3043213 7.65643066,14.3527002 6.85643066,16.3927002 Z'
                        : (item.user.rating_client || 0) > 2 &&  (item.user.rating_client || 0) <= 3 ?
                        'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 14.67,11 15.5,11 C16.33,11 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 7.67,11 8.5,11 C9.33,11 10,10.33 10,9.5 Z M8,15 L16,15 L16,16 L8,16 L8,15 Z'
                        : (item.user.rating_client || 0) > 3 &&  (item.user.rating_client || 0) <= 4 ?
                        'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 14.67,11 15.5,11 C16.33,11 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 7.67,11 8.5,11 C9.33,11 10,10.33 10,9.5 Z M17.11,14 C17.11,14 15.5341797,15.6501465 12.1113281,15.5883789 C8.68847656,15.5266113 6.89,14 6.89,14 C7.69,16.04 9.70417969,17.0883789 12.0341797,17.0883789 C14.3641797,17.0883789 16.31,16.04 17.11,14 Z'
                        : (item.user.rating_client || 0) > 4 &&  (item.user.rating_client || 0) <= 5 ?
                        'M11.99,2 C6.47,2 2,6.48 2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 L11.99,2 Z M12,20 C7.58,20 4,16.42 4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 L12,20 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 10,10.33 10,9.5 Z M12,16.5 C14.33,16.5 16.31,15.04 17.11,13 L6.89,13 C7.69,15.04 9.67,16.5 12,16.5 L12,16.5 Z'
                        : 'M2,12c0,5.5,4.5,10,10,10s10-4.5,10-10S17.5,2,12,2S2,6.5,2,12z M4,12c0-4.4,3.6-8,8-8c4.4,0,8,3.6,8,8c0,4.399-3.6,8-8,8C7.6,20,4,16.399,4,12z M17,9.5C17,8.699,16.3,8,15.5,8S14,8.699,14,9.5c0,0.8,0.7,1.5,1.5,1.5S17,10.3,17,9.5z M10,9.5C10,8.699,9.3,8,8.5,8S7,8.699,7,9.5C7,10.3,7.7,11,8.5,11S10,10.3,10,9.5z'}
                      fill={(item.user.rating_client || 0) <= 2 && (item.user.rating_client || 0) >= 1 ?
                        '#D4182F'
                        : (item.user.rating_client || 0) > 2 &&  (item.user.rating_client || 0) <= 3 ?
                        '#FFB700'
                        : (item.user.rating_client || 0) > 3 &&  (item.user.rating_client || 0) <= 4 ?
                        '#54B422'
                        : (item.user.rating_client || 0) > 4 &&  (item.user.rating_client || 0) <= 5 ?
                        '#3DCCC6'
                        : '#B0BEC5'}
                    />
                  </Svg>
                </View>
              </View>
              <TouchableHighlight 
                underlayColor="transparent"
                onPress={() => {
                  this.props.setPerformer(this.state.task.id, item.user.id)
                }
                }>
                <Svg viewBox="0 0 24 24" width={36} height={36} style={{marginLeft: 8}}>
                  <Path
                     d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M17,13 L13,13 L13,17 L11,17 L11,13 L7,13 L7,11 L11,11 L11,7 L13,7 L13,11 L17,11 L17,13 L17,13 Z" 
                     fill="#31A3B7"
                  />
              </Svg>
              </TouchableHighlight>
            </View>
            {
              (index + 1) != this.state.performers.length ? 
                <View style={baseStyles.splitter_smlmg}>
                </View>
              : undefined
              
            }
          </View>
        )
      });

    return (
      this.state.dataloaded ?
          <View style={styles.mainContainer}>
            <PageHeader 
              title={'Выбор исполнителя'} 
              back={true}
              onBack={this.props.navigateBack}
              />
            <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={styles.contentContainer}>
              <Text style={[baseStyles.bigText, styles.title]}>
                Выбор исполнителя
              </Text>
              { performers }
            </ScrollView>
          <DropdownAlert
            closeInterval={5000}
            messageNumOfLines={10}
            titleStyle={baseStyles.alertTitle}
            messageStyle={baseStyles.messageAlertStyle}
            defaultTextContainer={baseStyles.defaultAlertTextContainer}
            imageStyle={baseStyles.imageAlertStyle}
            ref={ref => this.messages = ref} />
        </View>
        : 
        <LinearGradient style={baseStyles.contentAtCenter} colors={['#31a3b7', '#3dccc6']}>
          <ActivityIndicator />
        </LinearGradient>
    );
  }
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToUser: (userid, title) => navigateToUser(userid, title),
      navigateBack: navigateBack,
      setPerformer: (taskid, userid) => setPerformer(taskid, userid),
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
)(SelectPerformerPage);