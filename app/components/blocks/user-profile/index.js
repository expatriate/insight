import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    Easing,
    Picker,
    ActivityIndicator,
} from 'react-native';

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
import { EventRegister } from 'react-native-event-listeners';
import { connect } from 'react-redux';

import { 
  navigateToUser,
  approveUserToTeam,
  declineUserToTeam,
  inviteToTeam,
  changeTeamUserGroup,
  removeTeamUserGroup
} from '../../../actions';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import LinearGradient from 'react-native-linear-gradient';

import { 
  Colors, 
  Gradients,
} from '../../styles/colors.js';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    /*
    type:
    full, small

    */
    this.state = {
      key: parseInt(Math.random()* 10000),
      type: 'small',
      loadingApprove: false,
      loadingDecline: false,
      showInfo: false,
    }
  }


  componentWillMount() {
    this.setDefaultData();

    this.loading = EventRegister.addEventListener('CONTROL_EVENT', (data) => {
      if (this.state.key == data.key) {

        if (data.type == 'APPROVE') {
          this.setState({
            loadingApprove: false,
          })
        }

        if (data.type == 'DECLINE') {
          this.setState({
            loadingDecline: false,
          })
        }
      }
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.loading);
  }

  setDefaultData() {
    let servicesSorted = [];

    this.setState({
      services: servicesSorted,
      dataloaded: true,
    });
  }

  userinTeamQuery() {
    var inTeamQuery = this.props.team.invited.users.find((item) => {
      return (parseInt(item.user.id) == this.props.data.id)
    });

    return inTeamQuery != undefined ? true : false
  }

  userInTeam() {
    var inTeam = this.props.user.team.find((item) => {
      return(parseInt(item.id) == this.props.data.id )
    });

    return inTeam != undefined ? true : false
  }

  changeGroup(data) {
    let group = undefined;
    if (data != 'all') {
      group = this.props.team.groups.find((item) => {return(item.title === data)});

      this.props.changeTeamUserGroup(this.props.data.id ,group)
    } else {
      this.props.removeTeamUserGroup(this.props.data.id)
    }
  }

  acceptTeamRequest() {
    if (!this.state.loadingDecline && !this.state.loadingApprove) {
      this.setState({
        loadingApprove: true
      })
      this.props.approveUserToTeam(this.props.data.id, this.state.key)
    }
  }

  declineTeamRequest() {
    if (!this.state.loadingDecline && !this.state.loadingApprove) {
      this.setState({
        loadingDecline: true
      })
      this.props.declineUserToTeam(this.props.data.id, this.state.key)
    }
  }

  render() {

    const users = this.props.data.id == this.props.user.data.id ? this.props.user.team : this.props.data.teamUsers;
    const group = this.props.selectGroup && !Array.isArray(this.props.group) && this.props.group.title ? this.props.group.title : 'all';

    const info = 
      <View style={[styles.spoilerContent,  this.props.style]}>
        {
          this.props.maxInfo && this.props.data.services ?
            <View>
              {
                this.props.data.services.map((item, index) => {
                  return(
                    <View key={'user_service'+index} style={{flexDirection: 'row'}}>
                      <Text numberOfLines={4} ellipsizeMode={'tail'} style={{flex: 3}}>
                        { item.text }
                      </Text>
                      <Text style={{flex: 2, textAlign: 'center'}}>
                        { item.price } Р/{ item.unit.title }
                      </Text>
                    </View>
                    )
                })
              }
            </View> 
          : undefined
        }
        {
          users && users.length && !this.props.hideUsers ? 
          <View> 
            <View style={styles.splitter}>
            </View>
            <View style={styles.element}>
              <View style={styles.elementSize}>
                <Text style={styles.smallText}>
                  Рекомендуют из моей команды:
                </Text>
              </View>
              {
                users.map((item, index) => {
                  if (index < 3)
                  return (
                    <TouchableHighlight 
                      key={`user_${this.props.data.id}_${index}`}
                      underlayColor="transparent" 
                      onPress={() => 
                        this.props.navigateToUser(
                          item.id, 
                          'Состоит в команде'
                          )
                      }>
                      {
                        item.photo ?
                        <Image style={[
                          styles.avatar_small, 
                          item.plan && item.plan.title == 'PRO' ? 
                            {borderColor: Colors.COLOR_LIGHT_BLUE} :
                              item.plan && item.plan.title == 'Business' ?
                              {borderColor: Colors.COLOR_YELLOW} :
                              {borderColor: Colors.COLOR_WHITE}]} 
                            source={{uri:`${item.photo}`}} resizeMode='cover'/>
                        :
                        <Image style={[
                          styles.avatar_small, 
                          item.plan && item.plan.title == 'PRO' ? 
                            {borderColor: Colors.COLOR_LIGHT_BLUE} :
                              item.plan && item.plan.title == 'Business' ?
                              {borderColor: Colors.COLOR_YELLOW} :
                              {borderColor: Colors.COLOR_WHITE}]} source={require('../../../../assets/images/ava.png')} resizeMode='cover'/>
                      }
                    </TouchableHighlight>
                    )
                })
              }
              {
                users.length > 3 ?
                <View style={styles.addUsers}>
                  <Text style={styles.addUsers_text}>
                    +{users.length - 3}
                  </Text>
                </View>
                :
                undefined
              }
            </View>
          </View>
          :
          undefined
        }
        {
          this.props.userProfileTaskDetails ?
          <Text style={[baseStyles.midText, {padding: 20, paddingTop: 0}]}>
            { this.props.taskText }
          </Text>
          : null
        }
      </View>

    let before = (((parseFloat(this.props.data.rating_spec) || 0) + 0.0001)/5 - 0.001).toFixed(3);
    let after = (((parseFloat(this.props.data.rating_spec) || 0) + 0.0001)/5).toFixed(3);
    if(after < 0) after = 0;
    if(before < 0) before = 0;
    return (
      <View style={[styles.wrapper, this.props.style]}>
        <View style={[
            styles.container,
            !this.props.maxInfo ? styles.containerWithPad : undefined]}>
          <View style={[baseStyles.verticalCenter, {flexDirection: 'row', flex: 1}]}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigateToUser(
                  this.props.data.id,
                  'Пользователь'
                  )
              }>
              {
                this.props.data.photo ?
                <Image style={[
                  styles.avatar,
                  this.props.data.plan && this.props.data.plan.title == 'PRO' ?
                    {borderColor: Colors.COLOR_LIGHT_BLUE} :
                      this.props.data.plan && this.props.data.plan.title == 'Business' ?
                      {borderColor: Colors.COLOR_YELLOW} :
                      {borderColor: Colors.COLOR_WHITE}]}
                    source={{uri:`${this.props.data.photo}`}} resizeMode='cover'/>
                :
                <Image style={[
                  styles.avatar,
                  this.props.data.plan && this.props.data.plan.title == 'PRO' ?
                    {borderColor: Colors.COLOR_LIGHT_BLUE} :
                      this.props.data.plan && this.props.data.plan.title == 'Business' ?
                      {borderColor: Colors.COLOR_YELLOW} :
                      {borderColor: Colors.COLOR_WHITE}]}  source={require('../../../../assets/images/ava.png')} resizeMode='cover'/>
              }
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <Text style={[baseStyles.midText, {flex: 1, marginBottom: 4}]}>
                { this.props.data.name + ' ' + this.props.data.surname }
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Svg width={92} height={16} style={styles.refElImage} viewBox="0 0 92 16">
                  <Defs>
                    <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="92" y2="0" id="LinearGradient1">
                      <Stop offset="0" stopColor={Colors.COLOR_YELLOW}></Stop>
                      {/* <Stop offset={((parseFloat(this.props.data.rating_spec) || 0) + 0.0001)/5 - 0.001} stopColor={Colors.COLOR_YELLOW}></Stop> */}
                      {/* <Stop offset={((parseFloat(this.props.data.rating_spec) || 0) + 0.0001)/5} stopColor={Colors.COLOR_LIGHT_GRAY}></Stop> */}
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
                <Text style={this.props.data.rating_spec ? styles.rating_spec : styles.rating_spec_null}>
                  { this.props.data.rating_spec || '0.00' }
                </Text>
                <Svg style={{marginLeft: 10}} width={16} height={16} viewBox="0 0 24 24">
                  <Path
                    d={(this.props.data.rating_client || 0) <= 2 && (this.props.data.rating_client || 0) >= 1 ?
                      'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.6225 C17,8.7925 14,8.7925 14,9.6225 C14,10.4525 14.67,11.1225 15.5,11.1225 C16.33,11.1225 17,10.4525 17,9.6225 Z M10,9.6225 C10,8.7925 7,8.7925 7,9.6225 C7,10.4525 7.67,11.1225 8.5,11.1225 C9.33,11.1225 10,10.4525 10,9.6225 Z M6.85643066,16.3927002 C6.85643066,16.3927002 8.43225098,14.7425537 11.8551025,14.8043213 C15.2779541,14.8660889 17.0764307,16.3927002 17.0764307,16.3927002 C16.2764307,14.3527002 14.262251,13.3043213 11.932251,13.3043213 C9.60225098,13.3043213 7.65643066,14.3527002 6.85643066,16.3927002 Z'
                      : (this.props.data.rating_client || 0) > 2 &&  (this.props.data.rating_client || 0) <= 3 ?
                      'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 14.67,11 15.5,11 C16.33,11 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 7.67,11 8.5,11 C9.33,11 10,10.33 10,9.5 Z M8,15 L16,15 L16,16 L8,16 L8,15 Z'
                      : (this.props.data.rating_client || 0) > 3 &&  (this.props.data.rating_client || 0) <= 4 ?
                      'M2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 C6.47,2 2,6.48 2,12 Z M4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 C7.58,20 4,16.42 4,12 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 14.67,11 15.5,11 C16.33,11 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 7.67,11 8.5,11 C9.33,11 10,10.33 10,9.5 Z M17.11,14 C17.11,14 15.5341797,15.6501465 12.1113281,15.5883789 C8.68847656,15.5266113 6.89,14 6.89,14 C7.69,16.04 9.70417969,17.0883789 12.0341797,17.0883789 C14.3641797,17.0883789 16.31,16.04 17.11,14 Z'
                      : (this.props.data.rating_client || 0) > 4 &&  (this.props.data.rating_client || 0) <= 5 ?
                      'M11.99,2 C6.47,2 2,6.48 2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 L11.99,2 Z M12,20 C7.58,20 4,16.42 4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 L12,20 Z M17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 17,10.33 17,9.5 Z M10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 10,10.33 10,9.5 Z M12,16.5 C14.33,16.5 16.31,15.04 17.11,13 L6.89,13 C7.69,15.04 9.67,16.5 12,16.5 L12,16.5 Z'
                      : 'M2,12c0,5.5,4.5,10,10,10s10-4.5,10-10S17.5,2,12,2S2,6.5,2,12z M4,12c0-4.4,3.6-8,8-8c4.4,0,8,3.6,8,8c0,4.399-3.6,8-8,8C7.6,20,4,16.399,4,12z M17,9.5C17,8.699,16.3,8,15.5,8S14,8.699,14,9.5c0,0.8,0.7,1.5,1.5,1.5S17,10.3,17,9.5z M10,9.5C10,8.699,9.3,8,8.5,8S7,8.699,7,9.5C7,10.3,7.7,11,8.5,11S10,10.3,10,9.5z'}
                    fill={(this.props.data.rating_client || 0) <= 2 && (this.props.data.rating_client || 0) >= 1 ?
                      '#D4182F'
                      : (this.props.data.rating_client || 0) > 2 &&  (this.props.data.rating_client || 0) <= 3 ?
                      '#FFB700'
                      : (this.props.data.rating_client || 0) > 3 &&  (this.props.data.rating_client || 0) <= 4 ?
                      '#54B422'
                      : (this.props.data.rating_client || 0) > 4 &&  (this.props.data.rating_client || 0) <= 5 ?
                      '#3DCCC6'
                      : '#B0BEC5'}
                  />
                </Svg>
                {
                  this.props.data.review_count ?
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'row'}]}>
                      <Svg width={14} height={14} viewBox='0 0 20 20' style={{marginLeft: 10}}>
                        <Path fill={Colors.COLOR_LIGHTDARK_GRAY}
                          d="M17.406,0.742H2.594c-1.019,0-1.852,0.833-1.852,1.852v16.664l3.703-3.703h12.961
                            c1.019,0,1.852-0.834,1.852-1.852V2.594C19.258,1.575,18.425,0.742,17.406,0.742L17.406,0.742z
                          "/>
                      </Svg>
                      <Text style={styles.commentCount}>
                        { this.props.data.review_count}
                      </Text>
                    </View>
                    : null
                }
              </View>
              {
                this.props.data.is_performer != undefined && this.props.data.is_performer || this.props.data.is_client != undefined && this.props.data.is_client ?
                <Text style={[styles.addinfoabout]}>
                  {
                    this.props.data.is_performer ? 'ИСПОЛНИТЕЛЬ ' : ''
                  }
                  {
                    this.props.data.is_performer && this.props.data.is_client ? ' И ' : ''
                  }
                  {
                    this.props.data.is_client ? 'ЗАКАЗЧИК ' : ''
                  }
                </Text>
                : undefined
              }
              {
                  this.props.selectGroup ?
                  <View style={[baseStyles.verticalCenter, {flexDirection: 'row', marginTop: 10}]}>
                    <Text style={[baseStyles.midText, {marginRight: 10}]}>
                      Группа:
                    </Text>
                    <View style={[formsStyles.pickerWrap, {flex: 1}]}>
                      <Picker
                        selectedValue={group}
                        style={[formsStyles.picker]}
                        onValueChange={(itemValue, itemIndex) => {this.changeGroup(itemValue)}}>
                        <Picker.Item label="Все" value="all" />
                        {
                          this.props.team.groups ?
                          this.props.team.groups.map((item) => {
                            return(
                              <Picker.Item key={'user_group_'+this.props.data.id} label={item.title} value={item.title} />
                              )
                          })
                          : undefined
                        }
                      </Picker>
                    </View>
                  </View>
                  : undefined
                }

            </View>

          </View>
          {

            (this.props.displayInfo == undefined || this.props.displayInfo) && !this.props.maxInfo ?
              <TouchableOpacity
                onPress={() => {
                  this.setState({showInfo: !this.state.showInfo});
                  }
                }
                style={{height: 40, width:40, justifyContent:'center', alignItems: 'center'}}
              >
                {
                  !this.state.showInfo ?
                    <Svg width={24} height={24} viewBox="0 0 12 12">
                      <Polygon
                        fill={Colors.COLOR_LIGHTDARK_GRAY}
                        points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                      />
                    </Svg>
                  :
                    <Svg width={24} height={24} viewBox="0 0 12 12">
                      <Polygon
                        fill={Colors.COLOR_LIGHTDARK_GRAY}
                        points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                      />
                    </Svg>
                }
              </TouchableOpacity>
            : undefined
          }
        </View>
        {
          this.state.showInfo || this.props.maxInfo ?
            info
          :
            undefined
        }
        {
          this.props.showControls ?
          <View>
            <View style={styles.splitter}>
            </View>
            <View style={[baseStyles.verticalCenter, {flexDirection: 'row', flex: 1, justifyContent: 'space-around'}]}>
             {
              !this.userInTeam() && !this.userinTeamQuery() ?
              <TouchableOpacity onPress={() => {this.props.inviteToTeam(this.props.data)}}>
                <View style={[baseStyles.verticalCenter, {flexDirection: 'row', alignItems: 'center', padding: 20}]}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight:8}}>
                    <Path
                      d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M17,13 L13,13 L13,17 L11,17 L11,13 L7,13 L7,11 L11,11 L11,7 L13,7 L13,11 L17,11 L17,13 L17,13 Z"
                      fill="#31A3B7"/>
                  </Svg>
                  <View>
                    <Text style={styles.textButton}>
                      Добавить
                    </Text>
                    <Text style={styles.textButton}>
                       в команду
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              : this.userinTeamQuery() ?
                <Text style={[styles.textButton, {paddingVertical: 22, textAlign: 'center'}]}>
                  {'Запрос в команду\nотправлен'}
                </Text>
                : null
             }

            </View>
          </View>
          : null
        }
        {
          this.props.approve ?
          <View>
            <View style={styles.splitter}>
            </View>
            <View style={[baseStyles.verticalCenter, {flexDirection: 'row', flex: 1, justifyContent: 'space-around'}]}>
              <TouchableOpacity onPress={() => {
                this.acceptTeamRequest()
              }}>

                {
                    this.state.loadingApprove ?
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'row', alignItems: 'center', padding: 20}]}>
                      <ActivityIndicator />
                    </View>
                    :
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'row', alignItems: 'center', padding: 20}]}>
                      <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight:8}}>
                        <Path
                          d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M17,13 L13,13 L13,17 L11,17 L11,13 L7,13 L7,11 L11,11 L11,7 L13,7 L13,11 L17,11 L17,13 L17,13 Z"
                          fill="#31A3B7"/>
                      </Svg>
                      <Text style={[styles.textButton,  {marginBottom: 0, paddingBottom: 0}]}>
                        Принять
                      </Text>
                    </View>
                  }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.declineTeamRequest();
              }}>

                  {
                    this.state.loadingDecline ?
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'row',alignItems: 'center', padding: 20}]}>
                      <ActivityIndicator />
                    </View>
                    :
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'row',alignItems: 'center', padding: 20}]}>
                      <Svg width={24} height={24} viewBox="0 0 36 36" style={{marginRight:8}}>
                        <Polygon
                          points="25.879,7.841 23.838,5.801 15.679,13.96 7.52,5.801 5.48,7.841 13.639,16 5.48,24.158
                            7.52,26.199 15.679,18.041 23.838,26.199 25.879,24.158 17.719,16"
                          fill={Colors.COLOR_LIGHT_GRAY}/>
                      </Svg>
                        <Text style={[styles.textButton, {color:Colors.COLOR_LIGHT_GRAY, marginBottom: 0, paddingBottom: 0}]}>
                          Отменить
                        </Text>
                    </View>
                  }
              </TouchableOpacity>
            </View>
          </View>
          : undefined
        }
      </View>
    )

  }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToUser: (userid, title) => navigateToUser(userid, title),
      approveUserToTeam: (userid, controlkey) => approveUserToTeam(userid, controlkey),
      declineUserToTeam: (userid, controlkey) => declineUserToTeam(userid, controlkey),
      inviteToTeam: (user) => inviteToTeam(user),
      changeTeamUserGroup: (userid, group) => changeTeamUserGroup(userid, group),
      removeTeamUserGroup: (userid) => removeTeamUserGroup(userid),
    }, dispatch);
};

export default connect(
  state => {
    return {
      nav: state.nav,
      user: state.user,
      team: state.team,
      app: state.app
    }
  }, mapDispatchToProps
)(UserProfile);