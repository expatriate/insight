import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Image,
  StatusBar, ActivityIndicator
} from 'react-native';

import Svg, {
    Path,
    Polygon,
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateToEditTask,
  applyRespond,
  applyPrivate,
  removeRespond,
  removePrivate,
  removePerformer,
  navigateToSelectPerformer,
  finishTask,
  updatePublishTask, navigateToUser,
} from '../../../actions';

import * as tasktypes from '../../../taskTypes.js';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';
import ImageViewer from '../../blocks/image-viewer';

import LinearGradient from 'react-native-linear-gradient';

import UserProfile from '../../blocks/user-profile';
import RespondBtn from '../../blocks/respond-button';

import textPrepared from '../../helpers/textPrepared';
import getDistanceFromLatLonInKm from '../../helpers/getDistanceFromLatLonInKm';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';

import { 
  Colors, 
  Gradients,
} from '../../styles/colors.js';

class TaskCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilesModal: false,
      isAuthor: false,
      editReady: false,
      publish: false
    }


    //this.statusText = '';
    //this.isPerformer = this.isPerformer.bind(this);

    /*if (this.props.showStatuses) {
      this.setDefaultData();
    }*/
  }

  componentDidMount() {
  }

  _getOptions() {
    let isAuthor = this.props.currentUser || this.props.userid == this.props.data.attributes.user_id ? true : false;
    let options = {
      isAuthor: isAuthor
    };


    if (this.props.data.attributes.status == tasktypes.STATUS_SEARCH_PERFORMER && isAuthor) {
      options = {
        ...options,
        statusText: 'Поиск\nисполнителя',
        statusColor: Colors.COLOR_YELLOW,
        editReady: true,
      }
    }

    if (this.props.data.attributes.private == 1) {
      options = {
        ...options,
        statusText: 'Приватная\nзадача',
        statusColor: Colors.COLOR_ORANGE,
      }
    }

    if (this.props.data.attributes.status == tasktypes.STATUS_IN_WORK) {
      options = {
        ...options,
        statusText: 'В работе',
        statusColor: Colors.COLOR_GREEN,
      }
    }

    if (this.props.data.attributes.status == tasktypes.STATUS_CHOICE_PERFORMER && isAuthor) {
      options = {
        ...options,
        statusText: 'Выбор\nисполнителя',
        statusColor: Colors.COLOR_ORANGE,
      }
    }
    if (isAuthor && this.props.data.attributes.public == tasktypes.PUBLIC_EXPIRED && this.props.data.attributes.status != tasktypes.STATUS_IN_WORK) {
      options = {
        ...options,
        statusText: 'Снята с\nпубликации',
        statusColor: Colors.COLOR_LIGHTDARK_GRAY,
        editReady: true,
      }
    }

    if (this.props.data.attributes.status == tasktypes.STATUS_ARBITRAGE) {
      options = {
        ...options,
        statusText: 'Арбитраж',
        statusColor: Colors.COLOR_RED,
      }
    }

    if (this.props.data.attributes.status == tasktypes.STATUS_COMPLETED) {
      options = {
        ...options,
        statusText: 'Задача выполнена и оплачена',
        statusColor: Colors.COLOR_GREEN,
        finished: true,
      }
    }

    if (isAuthor && this.props.data.attributes.status == tasktypes.STATUS_IN_WORK) {
      options = {
        ...options,
        statusColor: Colors.COLOR_GREEN,
        statusColorAdd: Colors.COLOR_LIGHTDARK_GRAY,
        finishReady: true,
        editReady: false,
        chooseReady: false,
      }
    }

    // Edit btn
    if (isAuthor && (this.props.data.attributes.status != tasktypes.STATUS_INACTIVE && this.props.data.attributes.status != tasktypes.STATUS_IN_WORK && this.props.data.attributes.status != tasktypes.STATUS_COMPLETED)) {
      options = {
        ...options,
        editReady: true,
      }
    }

    // Add publish btn
    if (isAuthor && this.props.data.attributes.public == tasktypes.PUBLIC_EXPIRED) {
      options = {
        ...options,
        publishReady: true,
      }
    }

    // Review btn
     if (isAuthor && this.props.data.attributes.status == tasktypes.STATUS_COMPLETED) {
      options = {
        ...options,
        reviewReady: true,
        editReady: false,
        publishReady: false,
      }
    }

    if (isAuthor && this.props.data.attributes.status == tasktypes.STATUS_CHOICE_PERFORMER) {
      var responds = [];
        if (this.props.data.responds != undefined && !Array.isArray(this.props.data.responds)) {
          Object.keys(this.props.data.responds).filter((objectKey, index) => {
            responds.push(this.props.data.responds[objectKey]);
          });
       }
      // Task has responds
      options = {
        ...options,
        chooseReady: true,
        chooseList: responds,
      }
    }

    return options;
  }

  _getPerformer() {
    let performer = undefined;
    // if (this.props.data.performers != undefined && !Array.isArray(this.props.data.performers)) {
      // Object.keys(this.props.data.performers).filter((objectKey, index) => {
      //   performer = this.props.data.performers[objectKey]
      // });
    // }

    return performer;
  }

  _isRespond() {
    var flag = false;

    // if (this.props.data.responds != undefined && !Array.isArray(this.props.data.responds)) {
      // Object.keys(this.props.data.responds).filter((objectKey, index) => {
      //   if (this.props.data.responds[objectKey].id == this.props.userid) {
      //     flag = true;
      //   }
      // });
    // }
    return flag;
  }

  _getResponds() {
    let respondCount = 0;
    // if (this.props.data.responds != undefined && !Array.isArray(this.props.data.responds)) {
      // Object.keys(this.props.data.responds).filter((objectKey, index) => {
      //   respondCount += 1;
      // });
    // }
    return respondCount;
  }

  _isPerformer() {
    var flag = false;
    // if (!this.props.data.performers != undefined && Array.isArray(this.props.data.performers)) {
      // Object.keys(this.props.data.performers).filter((objectKey, index) => {
      //   if (this.props.data.performers[objectKey].user.id == this.props.userid) {
      //     flag = true;
      //   }
      // });
    // }
    return flag;
  }

  render() {

    const respondCount = this._getResponds();
    const performer = this._getPerformer();
    const options = this._getOptions();
    const isAuthor = this.props.currentUser || this.props.userid == this.props.data.attributes.user_id ? true : false;
    const isPerformer = this._isPerformer();
    const isRespond = this._isRespond();

    const chooseReady = options.chooseList != undefined ?
      options.chooseList.map((item, index) => {
        return (
          <TouchableHighlight
            key={`user_${item.id}_${index}`}
            underlayColor="transparent"
            style={{marginLeft: 20}}
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
          )
      })
    : undefined;
    const tags = this.props.data.attributes.api_tags ? this.props.data.attributes.api_tags.map((item, index) => {
      return (
        <Text style={styles.tag} key={'tag'+this.props.data.attributes.id + '_' + index}>
          { item.title }
        </Text>)
    }) : undefined;

    const filesModal = this.props.data.attributes.api_files ? <ImageViewer
      close={() => {
        StatusBar.setBackgroundColor('rgba(0,0,0,0)');
        this.setState({showFilesModal: false})}
      }
      visible={this.state.showFilesModal}
      index={this.state.filesModalIndex}
      images={
        this.props.data.attributes.api_files.map((img, imgIndex) => {
          return({url: `https://myteam.pro/${img.url}`})
        })
      } /> : undefined;

    const filesImages = this.props.data.attributes.api_files ? this.props.data.attributes.api_files.map((img, imgIndex) => {
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
            style={{width: 120, height: 100, marginRight: 10}}
            source={{uri:`https://myteam.pro/${img.thumb}`}}
            resizeMode='contain'
            />
        </TouchableHighlight>)
    }) : undefined;

    const status = this.props.showStatuses && options.statusText ?
      <View style={{marginRight: 20}}>
        <Text style={baseStyles.smallText}>
          Статус
        </Text>
        <Text style={[baseStyles.midText, {color: !this.state.statusColorAdd ? options.statusColor : options.statusColorAdd}]}>
          { options.statusText }
        </Text>
      </View>
      : undefined

    return (
      <View key={this.props.data.attributes.id + '_all'} style={[styles.catalogItem, this.props.showStatuses && options.statusColor ? styles.catalogItemWithStatus : undefined]}>
        <View style={styles.catalogItem_wrap}>
          <View style={this.props.showStatuses ? [styles.catalogItemStatus, {backgroundColor: options.statusColor}] : undefined}>
          </View>
          <View style={{width: '100%', position: 'relative'}}>
            <ScrollView keyboardShouldPersistTaps='handled' horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={[baseStyles.verticalCenter, styles.catalogItemClickable, {flexDirection: 'row'}]}>
              {
                isAuthor ?
                <Text style={styles.author}>
                  мои задачи
                </Text>
                :
                  /*<Text style={styles.author}>
                    Я исполнитель
                  </Text>*/
                  null
              }

              <Text style={[baseStyles.smallText, {flex: 1}]}>
                { distanceInWordsToNow(this.props.data.attributes.updated_at * 1000, {locale: ruLocale, addSuffix: true}) }
              </Text>
              {
                this.props.data.attributes.payment_type == 3 ?
                <View style={[baseStyles.verticalCenter, {marginLeft: 18, flex: 1,flexDirection: 'row'}]}>
                  <Svg width={18} height={18} style={{marginRight: 4}} viewBox="0 0 24 24">
                    <Path
                      d="M14,2 L6,2 C4.9,2 4.01,2.9 4.01,4 L4,20 C4,21.1 4.89,22 5.99,22 L18,22 C19.1,22 20,21.1 20,20 L20,8 L14,2 L14,2 Z"
                      fill="#3DCCC6"/>
                  </Svg>
                  <Text style={baseStyles.smallText}>
                    По договору
                  </Text>
                </View>
                : undefined
              }
              {
                this.props.data.attributes.payment_type == 2 ?
                <View style={[baseStyles.verticalCenter, {marginLeft: 18, flex: 1,flexDirection: 'row'}]}>
                  <Svg width={18} height={18} style={{marginRight: 4}} viewBox="0 0 24 24">
                    <Path
                    d="M12,1 L3,5 L3,11 C3,16.55 6.84,21.74 12,23 C17.16,21.74 21,16.55 21,11 L21,5 L12,1 L12,1 Z M10,17 L6,13 L7.41,11.59 L10,14.17 L16.59,7.58 L18,9 L10,17 L10,17 Z"
                    fill="#54B422"/>
                  </Svg>
                  <Text style={baseStyles.smallText}>
                    Сделка без риска
                  </Text>
                </View>
                : undefined
              }
            </ScrollView>
            {/* <LinearGradient style={baseStyles.overflowStart} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#fff', 'transparent']} /> */}
            {/* <LinearGradient style={baseStyles.overflowEnd} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['transparent', '#fff']} /> */}
          </View>
          <TouchableHighlight
            underlayColor="transparent"
            style={styles.catalogItemClickable}
            onPress={() => this.props.onPressTask(this.props.data.attributes.id, 'Задачи', this.props.backPage)}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[baseStyles.bigText, {flex: 1, marginRight: 20}]}>
                { this.props.data.attributes.title }
              </Text>
              <Text style={baseStyles.bigText}>
                { this.props.data.attributes.price } ₽
              </Text>
            </View>
          </TouchableHighlight>
          <View style={styles.catalogItemData}>
            {
              this.props.data.attributes.api_tags ?
                <ScrollView keyboardShouldPersistTaps='handled' horizontal={true} contentContainerStyle={{flexDirection: 'row', marginTop: 16, marginBottom: 8}} showsHorizontalScrollIndicator={false}>
                  { tags }
                </ScrollView>
              :
              undefined
            }
            <View style={{width: '100%', position: 'relative'}}>
              <ScrollView horizontal={true} keyboardShouldPersistTaps={'handled'} contentContainerStyle={{flexDirection: 'row'}} showsHorizontalScrollIndicator={false}>
                {
                  this.props.data.attributes.lat && this.props.data.attributes.lng && this.props.geolocation.coords ?
                    <View style={{marginRight: 20}}>
                      <Text style={baseStyles.smallText}>
                        От вас
                      </Text>
                      <Text style={baseStyles.midText}>
                        {
                          getDistanceFromLatLonInKm(
                            this.props.data.attributes.lat,
                            this.props.data.attributes.lng,
                            this.props.geolocation.coords.latitude,
                            this.props.geolocation.coords.longitude
                          ) + ' км'
                        }
                      </Text>
                    </View>
                  :
                  undefined
                }
                {
                  !options.finished ?
                    <View style={{marginRight: 20}}>
                      <Text style={baseStyles.smallText}>
                        Время
                      </Text>
                      <Text style={baseStyles.midText}>
                        { distanceInWordsToNow(this.props.data.attributes.public_updated * 1000, {locale: ruLocale, addSuffix: true}) }
                      </Text>
                    </View>
                    : undefined
                }
                {
                  respondCount && !options.finished && !this.props.data.attributes.private ?
                    <View style={{marginRight: 20}}>
                      <Text style={baseStyles.smallText}>
                        Откликнулось
                      </Text>
                      <Text style={baseStyles.midText}>
                        { respondCount + ' ' + textPrepared(respondCount, 'человек')}
                      </Text>
                    </View>
                    : undefined
                }
                { status }
              </ScrollView>
              {/* <LinearGradient style={baseStyles.overflowEnd} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['transparent', '#fff']} /> */}
            </View>
          </View>
          {
            this.props.data.attributes.api_files ?
            <View>
              <ScrollView keyboardShouldPersistTaps='handled' horizontal={true} contentContainerStyle={{flexDirection: 'row', marginTop: 4, marginBottom: 4}} showsHorizontalScrollIndicator={false}>
                { filesImages }
              </ScrollView>
              { filesModal }
            </View>
            :
              undefined
          }
          {
            options.chooseReady ?
              <View>
                <View style={baseStyles.splitter_smlmg}>
                </View>
                <View style={[{flexDirection: 'row'}, baseStyles.verticalCenter]}>
                  <ScrollView keyboardShouldPersistTaps='handled' horizontal={true} contentContainerStyle={{flexDirection: 'row', marginBottom: 4}} showsHorizontalScrollIndicator={false}>
                    { chooseReady }
                  </ScrollView>
                  <TouchableHighlight underlayColor="transparent" onPress={() => {this.props.navigateToSelectPerformer(this.props.data)}}>
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'column', alignItems: 'center', padding: 10}]}>
                      <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginBottom:8}}>
                        <Path
                          fill="#31A3B7"
                          d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M10,17 L5,12 L6.41,10.59 L10,14.17 L17.59,6.58 L19,8 L10,17 L10,17 Z"/>
                      </Svg>
                      <View>
                        <Text style={[styles.textButton, {textAlign: 'center'}]}>
                          { 'Выбрать\nисполнителя' }
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            : undefined
          }
          {
            isAuthor && this.props.data.attributes.status == tasktypes.STATUS_IN_WORK ?
            <View>
               <View style={baseStyles.splitter_smlmg}>
              </View>
              <View style={[styles.catalogItemInfo, baseStyles.verticalCenter]}>
                <TouchableHighlight underlayColor="transparent" onPress={() => {this.props.finishTask(this.props.data.attributes, performer, this.props.data.user)}}>
                  <View style={[buttonsStyles.buttonMiddle, buttonsStyles.buttonGreen]}>
                    <Text style={[buttonsStyles.buttonMiddleText, {paddingHorizontal: 20}]}>
                      Завершить задачу
                    </Text>
                  </View>
                </TouchableHighlight>
                {/*<View style={[{flex: 1}, baseStyles.verticalCenter]}>
                  <Text style={baseStyles.midText}>
                    Арбитраж
                  </Text>
                </View>*/}
              </View>
            </View>
            : undefined
          }
          {
            !isAuthor && this.props.data.attributes.status != tasktypes.STATUS_COMPLETED ?
            <View>
              <View style={baseStyles.splitter_smlmg}>
              </View>
              <View style={[styles.catalogItemInfo, baseStyles.verticalCenter]}>
                <View style={{flex: 4, marginRight: 10}}>
                    <Text style={baseStyles.midText}>
                      {textPrepared(parseInt(this.props.respondsLeft), 'У вас осталось')}
                    </Text>
                    <Text style={[baseStyles.midText, baseStyles.midText_nextline]}>
                      { parseInt(this.props.respondsLeft)} {textPrepared(parseInt(this.props.respondsLeft), 'отклик')}
                    </Text>
                </View>
              </View>
              <View style={[styles.catalogItemInfo, baseStyles.verticalCenter]}>
                <View style={this.props.data.attributes.private == 1 && this.props.data.attributes.status == tasktypes.STATUS_SEARCH_PERFORMER ? {flex: 1} : undefined}>
                  <RespondBtn
                    onPress={() => console.warn('alala')}
                    removeRespond={() => {
                      let respondId = 0;
                      if (this.props.data.responds) {
                        Object.keys(this.props.data.responds).filter((objectKey, index) => {
                          if (this.props.data.responds[objectKey].user.id == this.props.userid) {
                             respondId = parseInt(objectKey);
                          }
                        });
                      }
                      if (respondId) {
                        this.props.removeRespond(this.props.data.attributes.id, respondId);
                      }
                    }}
                    removePerformer={() => {
                      let performerId = 0;
                      if (this.props.data.performers) {
                        Object.keys(this.props.data.performers).filter((objectKey, index) => {
                          if (this.props.data.performers[objectKey].id == this.props.userid) {
                             performerId = parseInt(objectKey);
                          }
                        });
                      }
                      if (performerId && this.props.data.attributes.private) {
                        this.props.removePrivate(this.props.data.attributes.id, performerId);
                      }
                      if (performerId && this.props.data.attributes.private != 1) {
                        this.props.removePerformer(this.props.data.attributes.id, performerId);
                      }
                    }}
                    applyRespond={() => {
                      this.props.applyRespond(this.props.data.attributes.id, this.props.user.data)
                    }}
                    applyPrivate={() => {
                      this.props.applyPrivate(this.props.data.attributes.id, this.props.user.data)
                    }}
                    respondsLeft={this.props.respondsLeft}
                    respondsMax={this.props.respondsMax}
                    alreadyRepond={isRespond}
                    performer={isPerformer}
                    isAuthor={isAuthor}
                    responds={this.props.data.responds}
                    performers={this.props.data.performers}
                    userCurents={this.props.user.data.id}
                    isPrivate={this.props.data.attributes.private == 1 ? true : false}
                    status={this.props.data.attributes.status}
                    isArhive={this.props.data.attributes.status == tasktypes.STATUS_COMPLETED}
                    refreshing={this.props.refreshing}
                  />
                </View>
                {/*<Text>
                  { JSON.stringify(this.props.data.attributes.responds, 0 , 2)}
                </Text>*/}
                {
                  this.props.data.attributes.private == 1 && this.props.data.attributes.status == tasktypes.STATUS_SEARCH_PERFORMER ?
                    <View style={{flex: 1}}>
                      <TouchableHighlight underlayColor="transparent"

                        onPress={() => {
                          let respondId = 0;
                          if (!Array.isArray(this.props.data.attributes.responds)) {
                            Object.keys(this.props.data.attributes.responds).filter((objectKey, index) => {
                              if (this.props.data.attributes.responds[objectKey].id == this.props.userid) {
                                 respondId = parseInt(objectKey);
                              }
                            });
                          }
                          if (respondId) {
                            this.props.removeRespond(this.props.data.attributes.id, respondId);
                          }
                        }}>
                        <View style={[baseStyles.verticalCenter, { flexDirection: 'row', alignItems: 'center', paddingLeft: 20, justifyContent:'center'}]}>
                          <Svg width={18} height={18} viewBox="0 0 14 14" style={{marginRight:8}}>
                            <Polygon
                              fill={Colors.COLOR_LIGHTDARK_GRAY}
                              points="14,1.4 12.6,0 7,5.6 1.4,0 0,1.4 5.6,7 0,12.6 1.4,14 7,8.4 12.6,14 14,12.6 8.4,7"/>
                          </Svg>
                          <View>
                            <Text style={[styles.textButton, {color: Colors.COLOR_LIGHTDARK_GRAY}]}>
                              Отклонить
                            </Text>
                          </View>
                        </View>
                      </TouchableHighlight>

                    </View>

                  : undefined
                }
              </View>
          </View>
          :
          undefined
        }
        </View>
          {
            isAuthor && this.props.data.attributes.status == tasktypes.STATUS_IN_WORK && performer ?
              <View style={[styles.catalogItemfooter]}>
                {/*<View style={{justifyContent: 'center', flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                                  <UserProfile
                                    data={this.state.performer}
                                    style={{borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}
                                    showControls={this.props.showControls && !(this.props.currentUser || this.props.userid == this.props.data.attributes.api_user.id)} />
                                </View>*/}
                <View style={baseStyles.splitter_smlmg}>
                </View>
              </View>
            : undefined
          }
        <View style={[styles.catalogItemfooter]}>
          {
            isAuthor && (options.editReady || options.publishReady) ?
            <View style={{justifyContent: 'center', flex: 1, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 20}}>
              {
                options.publishReady ?
                  <TouchableHighlight underlayColor="transparent" onPress={() => {this.props.updatePublishTask(true, this.props.data.attributes.id, (new Date().getTime()/1000).toFixed(0))}}>
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'row', alignItems: 'center', padding: 20}]}>
                      <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight:8}}>
                        <Path
                          fill="#31A3B7"
                          d="M5,10 L9,10 L9,16 L15,16 L15,10 L19,10 L12,3 L5,10 L5,10 Z M5,18 L5,20 L19,20 L19,18 L5,18 L5,18 Z"/>
                      </Svg>
                      <View>
                        <Text style={styles.textButton}>
                          Опубликовать
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                : undefined
              }
              {
                isAuthor && options.editReady ?
                  <TouchableHighlight underlayColor="transparent" onPress={() => {this.props.navigateToEditTask(this.props.data.attributes.id)}}>
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'row', alignItems: 'center', padding: 20}]}>
                      <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight:8}}>
                        <Path
                          fill="#31A3B7"
                          d="M3,17.25 L3,21 L6.75,21 L17.81,9.94 L14.06,6.19 L3,17.25 L3,17.25 Z M20.71,7.04 C21.1,6.65 21.1,6.02 20.71,5.63 L18.37,3.29 C17.98,2.9 17.35,2.9 16.96,3.29 L15.13,5.12 L18.88,8.87 L20.71,7.04 L20.71,7.04 Z"/>
                      </Svg>
                      <View>
                        <Text style={styles.textButton}>
                          Редактировать
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                : undefined
              }
              {
                isAuthor && options.editReady && this.props.data.attributes.public == tasktypes.PUBLIC_ACTIVE ?
                  <TouchableHighlight underlayColor="transparent"
                                      onPress={() => {
                                        if(!this.state.publish) {
                                          this.props.updatePublishTask(false, this.props.data.attributes.id, (new Date().getTime() / 1000).toFixed(0))
                                          setTimeout(() => {
                                            this.props.refreshing()
                                          }, 1000)
                                        }
                                      }}

                  >
                    <View style={[baseStyles.verticalCenter, {flexDirection: 'row', alignItems: 'center', padding: 20}]}>
                      {!this.state.publish ?
                        <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight:8}}>
                          <Path
                            fill="#31A3B7"
                            d="M5,13l7,7l7-7h-4V7H9v6H5L5,13z M5,5h14V3H5V5L5,5z"/>
                        </Svg>
                        : undefined
                      }

                      <View>
                        <Text style={styles.textButton}>
                          {'Снять\nс публикации'}
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                : undefined
              }
              {
                options.reviewReady && performer ?
                <TouchableHighlight underlayColor="transparent" onPress={() => {this.props.onOpenModal(this.props.data, performer)}}>
                  <View style={[baseStyles.verticalCenter, {flexDirection: 'row', alignItems: 'center', padding: 20}]}>
                    <Svg width={24} height={24} viewBox="0 0 500 500" style={{marginRight:8}}>
                      <Path
                        fill="#31A3B7"
                        d="M492.272,198.128l-163.637-13.636L265,34.491l-63.636,150.001L37.727,198.128l125,106.818
                          l-36.364,159.091l140.909-84.091l140.909,84.091l-36.363-159.091L492.272,198.128L492.272,198.128z M265,339.037l-86.364,52.272
                          l22.728-97.728l-75-65.908l100-9.091L265,127.674l38.637,90.909l100,9.091l-75,65.908l22.728,97.728L265,339.037L265,339.037z"/>
                    </Svg>
                    <View>
                      <Text style={styles.textButton}>
                        Оценить исполнителя
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
                : undefined
              }
            </View>
            :
            undefined
          }
          {
            !options.editReady && !options.publishReady ?
            <UserProfile
              data={this.props.data.user}
              taskText={this.props.data.attributes.text}
              style={{borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}
              userProfileTaskDetails={this.props.userProfileTaskDetails || false}
              displayInfo={true}
              showControls={this.props.showControls && !isAuthor} />

              : undefined
          }
        </View>
      </View>
    )
  }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToEditTask: (taskId) => navigateToEditTask(taskId),
      applyRespond: (taskId, user) => applyRespond(taskId, user),
      applyPrivate: (taskId, user) => applyPrivate(taskId, user),
      removeRespond: (taskId, userId) => removeRespond(taskId, userId),
      removePerformer: (taskId, userId) => removePerformer(taskId, userId),
      removePrivate: (taskId, userId) => removePrivate(taskId, userId),
      navigateToSelectPerformer: (task) => navigateToSelectPerformer(task),
      navigateToUser: (userid, title) => navigateToUser(userid, title),
      finishTask: (task, performer, user) => finishTask(task, performer, user),
      updatePublishTask: (publish, taskId, newdate) => updatePublishTask(publish, taskId, newdate),
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
)(TaskCard);