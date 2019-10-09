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
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    FlatList,
    Animated
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import ImagePicker from 'react-native-image-picker';

import StatusBlock from '../../blocks/status-block';
import ApplyButton from '../../blocks/apply-button';
import statusColor from '../../helpers/statusColor.js';
import callNumber from '../../helpers/callNumber.js';
import ImageViewer from '../../blocks/image-viewer';
import CheckMasterModal from '../../modals/check-master-modal';
import Carousel, { Pagination } from 'react-native-snap-carousel';

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
  navigateBack,
  navigateToEdit,
  getImages,
  savePhoto,
  changeStatus,
  setVisited
} from '../../../actions';


import { EventRegister } from 'react-native-event-listeners';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonStyles from '../../styles/buttons.js';

import {
  Colors,
  Gradients
} from '../../styles/colors.js';

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

class DetailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataloaded: false,
      showFilesModal: false,
      filesModalIndex: 1,
      sliderActiveSlide: 0,
      loadingImages: [],
      modalMaster: false
    }

    this.options = {
      title: 'Выберите новое изображение',
      quality: 0.7,
      maxWidth: 1200,
      maxHeight: 1200,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    this.saveTaskImages = this.saveTaskImages.bind(this)
  }

  openImagePicker() {
    Platform.OS == 'android' ?
      ImagePicker.showImagePicker(this.options, (response) => {
          if (response.didCancel) {
          } else if (response.error) {
          } else {
            console.warn(response)
            this.setState({
              loadingImages: [
                ...this.state.loadingImages,
                response
              ]
            });
            //const source = { uri: response.uri };
              //this.writing('detailImage', response)
          }
      })
      :
      ImagePicker.launchImageLibrary(this.options, (response) => {
          if (response.didCancel) {
          } else if (response.error) {
          } else {
            console.warn(response)
            this.setState({
              loadingImages: [
                ...this.state.loadingImages,
                response
              ]
            });
              //const source = { uri: response.uri };
              //this.writing('detailImage', response)
          }
      })
  }

  removeLoadedImage(index) {
    this.setState({
      loadingImages: this.state.loadingImages.filter((img, indexImg) => {
            return indexImg !== index
        })
    });
  }

  componentDidMount() {
    if (this.props.nav.routes[this.props.nav.index].params && this.props.nav.routes[this.props.nav.index].params.task) {
      this.setState({
        task: this.props.nav.routes[this.props.nav.index].params.task,
        dataloaded: true
      }, () => {
        if (this.state.task.isVisited === 'false') {
          this.props.setVisited(this.props.user.sessionid, this.state.task.id)
        }
      });
      this.props.getImages(this.props.nav.routes[this.props.nav.index].params.task.id);
    }

    this.modalPhotoListener = EventRegister.addEventListener('OPEN_PHOTO_MODAL', (index) => {
      this.setState({
        showFilesModal: true,
        filesModalIndex: index
      })
    });

    this.modalPhotoAddListener = EventRegister.addEventListener('OPEN_PHOTO_ADD', () => {
      this.openImagePicker();
    });

    this.masterSelectListener = EventRegister.addEventListener('TASK_MASTER_SELECTED', (item) => {
      this.setState({
        selectedMaster: item.first_name + ' ' + item.last_name,
        selectedMasterId: item.id
      })
    });

    this.detailChangeListener = EventRegister.addEventListener('DETAIL_CHANGED', data => {
      this.setState({
        task: data
      });
    });

    this.imagesLoaded = EventRegister.addEventListener('ALL_IMAGES_LOADED', () => {
      this.props.getImages(this.props.nav.routes[this.props.nav.index].params.task.id)
      this.setState({
        imagesloaded: true,
        loadingImages: []
      })
    })
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.modalPhotoListener);
    EventRegister.removeEventListener(this.modalPhotoAddListener);
    EventRegister.removeEventListener(this.masterSelectListener);
    EventRegister.removeEventListener(this.detailChangeListener);
    EventRegister.removeEventListener(this.imagesLoaded);
  };

  _renderItem ({item, index}) {
    return (
      <TouchableHighlight
        key={'filesImageModal'+index}
        underlayColor="transparent"
        onPress={() => {
          EventRegister.emit('OPEN_PHOTO_MODAL', index);
        }}>
          <Image
          style={{width: wp(90), height: wp(50)}}
          source={{uri:item.imageUrl}}
          resizeMode='cover'
          />
      </TouchableHighlight>
    );
  }

  changeStatus(status) {
    this.setState({
      task: {
        ...this.state.task,
        status: status,
      }
    })
    this.props.changeStatus(this.props.user.sessionid, this.state.task.id, status);
    //console.warn(status)
  }

  saveTaskImages() {
    this.setState({
      imagesloaded: false
    });

    this.state.loadingImages.map((image, index) => {
      this.props.savePhoto(image.type.replace('image/'), image.data, this.state.task.id, index + 1 === this.state.loadingImages.length);
    });
  }

  render() {

    const filesModal = <ImageViewer
      close={() => {
        this.setState({showFilesModal: false})}
      }
      visible={this.state.showFilesModal}
      index={this.state.filesModalIndex}
      images={
        this.props.tasks.detailImages.map((img, imgIndex) => ({url: img.imageUrl}))
      } />

    return (
      this.state.dataloaded ?
          <View style={[baseStyles.container, styles.taskContainer]}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.headButton} onPress={() => {this.props.navigateBack()}}>
                <Svg height={20} width={20} viewBox="0 0 306 306">
                    <Polygon
                      fill={Colors.COLOR_WHITE}
                      points="247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306 "
                    />
                </Svg>
              </TouchableOpacity>
              <View style={styles.headContainer}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headTitle}>
                  {this.state.task.name}
                </Text>
                <Text style={styles.headNumber}>
                  №{this.state.task.id}
                </Text>
              </View>
              {
                this.props.user.isAdmin ?
                <TouchableOpacity style={styles.headButton} onPress={() => this.props.navigateToEdit(this.state.task)}>
                  <Svg height={20} width={20} viewBox="0 0 459 459">
                      <Path
                        fill={Colors.COLOR_WHITE}
                        d="M0,362.1V459h96.9l280.5-283.05l-96.9-96.9L0,362.1z M451.35,102c10.2-10.2,10.2-25.5,0-35.7L392.7,7.649
                          c-10.2-10.2-25.5-10.2-35.7,0l-45.9,45.9l96.9,96.9L451.35,102z"
                      />
                  </Svg>
                </TouchableOpacity>
                :
                <View style={styles.headButton}>
                </View>
              }

            </View>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              <View style={styles.card}>
                <Text style={styles.title}>{this.state.task.name}</Text>
                <Text style={styles.maintext}>
                  Дата постановки задачи:&nbsp;
                  <Text style={styles.sectext}>
                    {this.state.task.created_at}
                  </Text>
                </Text>
                <Text style={styles.maintext}>
                  Дата монтажа:&nbsp;
                  <Text style={styles.sectext}>
                    {this.state.task.installation_date}
                  </Text>
                </Text>
                <View style={{marginVertical: 10}}>
                  {
                    this.props.statuses.items.find(item => parseInt(item.name) === parseInt(this.state.task.status)) !== undefined ?
                    <StatusBlock
                      text={this.props.statuses.items.find(item => parseInt(item.name) === parseInt(this.state.task.status)).value}
                      color={statusColor(this.state.task.status)} />
                    :
                    null
                  }
                </View>
                <View style={styles.splitter}>
                </View>
                <Text style={[styles.maintext,{marginTop: 10}]}>
                  Город:&nbsp;
                  <Text style={styles.sectext}>{this.props.towns.items.find(item => item.id === parseInt(this.state.task.town_id)).name}</Text>
                </Text>
                <Text style={styles.maintext}>
                  Название магазина:&nbsp;
                  <Text style={styles.sectext}>{this.state.task.shop_title}</Text>
                </Text>
                <Text style={styles.maintext}>
                  Тип монтажа:&nbsp;
                  <Text style={styles.sectext}>{this.state.task.type}</Text>
                </Text>
                <Text style={styles.maintext}>
                  Ответственный:&nbsp;
                  <Text style={styles.sectext}>
                    {this.state.task.agent && this.state.task.agent.id ? this.state.task.agent.last_name + ' ' + this.state.task.agent.first_name : 'Не назначен' }
                  </Text>
                </Text>
                <Text style={styles.maintext}>
                  Телефон:&nbsp;
                  <Text style={styles.sectext}>
                    {this.state.task.agent && this.state.task.agent.id ? this.state.task.agent.phone : '-' }
                  </Text>
                </Text>
                <Text style={styles.maintext}>
                  Адрес:&nbsp;
                  <Text style={styles.sectext}>{this.state.task.address}</Text>
                </Text>
                <View style={styles.splitter}>
                </View>
                {/*
                <View>
                  <Text style={[styles.maintext, {marginVertical: 10}]}>
                    Бригадир:&nbsp;
                  </Text>
                  <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({modalMaster: true})}}>
                    <Text style={styles.edittext}>{this.state.selectedMaster || 'Не назначен'}</Text>
                  </TouchableOpacity>
                  <CheckMasterModal
                    visible={this.state.modalMaster}
                    close={() => {this.setState({modalMaster: false})}}
                    masters={this.props.user.taskmasters}
                  />
                </View>
                <View style={styles.splitter}>
                </View>
                */}
                {
                  this.props.user.isMaster && this.state.task.status === '4' ?
                    <View style={styles.addPhotoContainer}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        style={styles.addContainer}
                        onPress={() => {
                          EventRegister.emit('OPEN_PHOTO_ADD');
                        }}>
                        <View style={styles.addView}>
                          <Svg width={26} height={26} viewBox={'0 0 409.848 409.848'}>
                            <Path
                              fill={Colors.COLOR_RED}
                              d="M359.848,49.785H50c-27.614,0-50,22.386-50,50v210.277c0,27.614,22.386,50,50,50h309.848c27.614,0,50-22.386,50-50V99.785
                              C409.848,72.171,387.462,49.785,359.848,49.785z M369.848,310.062c0,5.514-4.486,10-10,10H50c-5.514,0-10-4.486-10-10V99.785
                              c0-5.514,4.486-10,10-10h309.848c5.514,0,10,4.486,10,10V310.062z"/>
                            <Path
                              fill={Colors.COLOR_RED}
                              d="M248.214,174.113c-6.909-6.909-18.111-6.909-25.019,0l-64.973,64.973l-18.271-18.271
                              c-3.317-3.318-7.817-5.181-12.509-5.181s-9.192,1.863-12.509,5.181l-47.318,47.318c-5.059,5.059-6.573,12.668-3.835,19.279
                              c2.738,6.611,9.189,10.921,16.345,10.921h61.561h33.074h154.965c7.155,0,13.606-4.311,16.344-10.921
                              c2.738-6.611,1.225-14.22-3.835-19.279L248.214,174.113z"/>
                            <Circle
                              fill={Colors.COLOR_RED}
                              cx="126.924" cy="149.334" r="26.333"/>
                          </Svg>
                          <Text style={styles.addText}>
                            Загрузить фото
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  : null
                }
              </View>
              {
                this.state.loadingImages.length ?
                  <ScrollView horizontal={true} style={styles.loadingImagesScrollview}>
                    {
                      this.state.loadingImages.map((img, index) => {
                        return(
                          <View style={styles.loadingImagesWrap} key={'image_' + index}>
                            <Image
                              style={{width: 100, height: 100, marginRight: 10}}
                              source={{uri:`data:${img.type};base64,${img.data}`}}
                              resizeMode='cover'/>
                              <TouchableOpacity onPress={() => {this.removeLoadedImage(index)}}>
                                <Text style={styles.loadingImagesText}>
                                  Удалить
                                </Text>
                              </TouchableOpacity>
                          </View>
                        )
                      })
                    }
                  </ScrollView>
                : null
              }

              {
                !this.props.tasks.detailImages.length ?
                  <View style={styles.centered}>
                    <View style={styles.noPhotoContainer}>
                      <Svg width={40} height={40} viewBox={'0 0 409.848 409.848'}>
                        <Path
                          fill={Colors.COLOR_LIGHT_GRAY}
                          d="M359.848,49.785H50c-27.614,0-50,22.386-50,50v210.277c0,27.614,22.386,50,50,50h309.848c27.614,0,50-22.386,50-50V99.785
                          C409.848,72.171,387.462,49.785,359.848,49.785z M369.848,310.062c0,5.514-4.486,10-10,10H50c-5.514,0-10-4.486-10-10V99.785
                          c0-5.514,4.486-10,10-10h309.848c5.514,0,10,4.486,10,10V310.062z"/>
                        <Path
                          fill={Colors.COLOR_LIGHT_GRAY}
                          d="M248.214,174.113c-6.909-6.909-18.111-6.909-25.019,0l-64.973,64.973l-18.271-18.271
                          c-3.317-3.318-7.817-5.181-12.509-5.181s-9.192,1.863-12.509,5.181l-47.318,47.318c-5.059,5.059-6.573,12.668-3.835,19.279
                          c2.738,6.611,9.189,10.921,16.345,10.921h61.561h33.074h154.965c7.155,0,13.606-4.311,16.344-10.921
                          c2.738-6.611,1.225-14.22-3.835-19.279L248.214,174.113z"/>
                        <Circle
                          fill={Colors.COLOR_LIGHT_GRAY}
                          cx="126.924" cy="149.334" r="26.333"/>
                      </Svg>
                      <Text style={styles.noPhotoText}>
                        Нет фото
                      </Text>
                    </View>
                  </View>
                :
                <View>
                  <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.props.tasks.detailImages}
                    renderItem={this._renderItem}
                    sliderWidth={viewportWidth}
                    itemWidth={wp(91)}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    loopClonesPerSide={2}
                    onSnapToItem={(index) => this.setState({ sliderActiveSlide: index }) }
                  />
                  <Pagination
                    dotsLength={this.props.tasks.detailImages.length}
                    activeDotIndex={this.state.sliderActiveSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={Colors.COLOR_RED}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={Colors.COLOR_WHITE}
                    inactiveDotOpacity={1}
                    inactiveDotScale={1}
                    carouselRef={this._carousel}
                    tappableDots={!!this._carousel}
                  />
                  { filesModal }
                </View>
              }

              <View style={styles.bottom}>
                <ApplyButton
                  saveImages={() => this.saveTaskImages()}
                  user={this.props.user}
                  task={this.state.task}
                  statuses={this.props.statuses.items}
                  onMasterApply={() => {
                    this.saveTaskImages(); // Сохраняем новые изображение если есть
                    this.changeStatus('5'); // Монтаж завершен
                  }}
                  onAgentApply={() => {
                    this.changeStatus('2'); // Одобрена представителем
                  }}
                  onAgentDecline={() => {
                    this.changeStatus('3'); // Отклонена представителем
                  }}
                  onClientApply={() => {
                    this.changeStatus('7'); // Закрыта (клиентом)
                  }}
                  onClientDecline={() => {
                    this.changeStatus('8'); // Отклонена клиентом
                  }}/>
              </View>

            </ScrollView>
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
      navigateBack: (key) => navigateBack(key),
      navigateToEdit: (task) => navigateToEdit(task),
      getImages: (id) => getImages(id),
      savePhoto: (extension, data, taskid, last) => savePhoto(extension, data, taskid, last),
      changeStatus: (sessionid, taskid, status) => changeStatus(sessionid, taskid, status),
      setVisited: (sessionid, taskid) => setVisited(sessionid, taskid),
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      towns: state.towns,
      tasks: state.tasks,
      statuses: state.statuses,
    }
  }, mapDispatchToProps
)(DetailPage);
