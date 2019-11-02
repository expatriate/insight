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
    Animated,
    KeyboardAvoidingView
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
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
  saveTask,
} from '../../../actions';

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

import { EventRegister } from 'react-native-event-listeners';

import DateTimePicker from "react-native-modal-datetime-picker";
import StatusBlock from '../../blocks/status-block';
import statusColor from '../../helpers/statusColor.js';

import CheckMasterModal from '../../modals/check-master-modal';
import CheckTownModal from '../../modals/check-town-modal';
import CheckAgentModal from '../../modals/check-agent-modal';
import CheckStatusModal from '../../modals/check-status-modal';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import {
  Colors,
  Gradients
} from '../../styles/colors.js';

class EditPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDateTimePickerVisible: false,
      task: {
        name: 'Название задачи/ Если длинное то написано в несколько строк',
        number: '1234567',
        start: '01.07.2019',
        end: '09.07.2019',
        status: '2',
        shopname: 'Неспрессо',
        type: 'Промо-стойка',
        user: 'Константинопольский Константин Константинович',
        phone: '+74956872398',
        address: '12345, Москва, ул. Горького, д. 123',
        photos: [],
      },
      modalTown: false,
      modalAgent: false,
      modalMaster: false,
      modalStatus: false,
      imagesToRemove: [],
      loaded: false
    }

    this.tryToSave = this.tryToSave.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    let month = (new Date(date).getMonth()+1).toString();
    month = month.length < 2 ? '0'+month : month;
    let dateT = `${new Date(date).getFullYear()}-${month}-${new Date(date).getDate()}`;
    this.change('installation_date', dateT);
    this.hideDateTimePicker();
  };

  componentDidMount() {
    if (this.props.nav.routes[this.props.nav.index].params && this.props.nav.routes[this.props.nav.index].params.task) {
      this.setState({
        task: this.props.nav.routes[this.props.nav.index].params.task,
        images: this.props.tasks.detailImages,
        loaded: true
      });

      //this.props.getImages(this.props.nav.routes[this.props.nav.index].params.task.id)
      //console.warn(this.props.nav.routes[this.props.nav.index].params.task)
    }


    this.townListener = EventRegister.addEventListener('TASK_TOWN_SELECTED', (item) => {
      //console.warn(item)
      this.setState({
        task: {
          ...this.state.task,
          town_id: item.id
        }
      }, () => {
        //console.warn(this.state.task)
      })
    });

    this.taskmasterListener = EventRegister.addEventListener('TASK_MASTER_SELECTED', (item) => {
      this.setState({
        task: {
          ...this.state.task,
          taskMaster_id: item.id,
          taskMaster: item
        }
      })
    });

    this.agentListener = EventRegister.addEventListener('TASK_AGENT_SELECTED', (item) => {
      this.setState({
        task: {
          ...this.state.task,
          agent_id: item.id,
          agent: item
        }
      })
    });

    this.statusListener = EventRegister.addEventListener('TASK_STATUS_SELECTED', (item) => {
      this.setState({
        task: {
          ...this.state.task,
          status: item.name,
        }
      })
    });


    this.getbackListener = EventRegister.addEventListener('GET_BACK_TO_DETAIL', () => {
      this.props.navigateBack();
    })

    this.onImagePrepareToRemove = EventRegister.addEventListener('TOGGLE_IMAGE_TO_REMOVE', (image) => {
      //console.warn('IMAGE',image)
      if (!this.state.imagesToRemove.length) {
        this.setState({
          imagesToRemove: [
            image
          ]
        });
      } else {
        let images = []
        if (this.state.imagesToRemove.find(item => parseInt(item.id) === parseInt(image.id))) {
          images = this.state.imagesToRemove.filter(item => (parseInt(item.id) !== parseInt(image.id)))
        } else {
          images.push(image);
          images = images.concat(this.state.imagesToRemove);
        }
        this.setState({
          imagesToRemove: images
        })
      }
    })
  };

  tryToSave() {
    this.props.saveTask(this.props.user.sessionid, this.state.task, this.state.imagesToRemove);
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.townListener);
    EventRegister.removeEventListener(this.taskmasterListener);
    EventRegister.removeEventListener(this.agentListener);
    EventRegister.removeEventListener(this.getbackListener);
    EventRegister.removeEventListener(this.statusListener);
  };

  change(type, value) {
    this.setState({
      ...this.state,
      task: {
        ...this.state.task,
        [type]: value
      }
    })
  }

  _renderItem ({item, index}) {
    return (
      <TouchableHighlight
        key={'filesImageModal'+index}
        underlayColor="transparent"
        onPress={() => {
          EventRegister.emit('TOGGLE_IMAGE_TO_REMOVE', item);
        }}>
          <View style={{position:'relative'}}>
            <Image
            style={{width: wp(90), height: wp(50)}}
            source={{uri:item.imageUrl}}
            resizeMode='cover'
            />
            <View style={[this.state.imagesToRemove.find(img => img.id === item.id) ? styles.redRemove : styles.simpleRemove]}>
              <View style={styles.removeBtn}>
              <Svg width={24} height={24} viewBox="0 0 408.483 408.483">
                <Path
                  fill={Colors.COLOR_DARK_RED}
                  d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316
                  H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293
                  c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329
                  c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355
                  c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356
                  c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"/>
                <Path
                  fill={Colors.COLOR_DARK_RED}
                  d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916
                  c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"/>
              </Svg>
              </View>
            </View>
          </View>
      </TouchableHighlight>
    );
  }

  render() {

    return (
      this.state.loaded ?
          <KeyboardAvoidingView style={[baseStyles.container, styles.taskContainer]} behavior="padding" enabled>
            <View style={styles.header}>
              <TouchableOpacity style={styles.headButton} onPress={() => {this.props.navigateBack()}}>
                <Text style={styles.headButtonText}>
                   Отменить
                </Text>
              </TouchableOpacity>
              <View style={styles.headContainer}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headTitle}>
                  №{this.state.task.id}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.headButton}
                onPress={() => {
                  this.tryToSave()
                }}>
                <Text style={styles.headButtonText}>
                  Сохранить
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{paddingBottom: 40}}>
              <View style={styles.card}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={this.state.task.name}
                    multiline = {true}
                    numberOfLines = {4}
                    style={styles.textInput}
                    onChangeText={(text) => this.change('name', text)}
                    />
                </View>
                <View style={styles.line}>
                  <Text style={[styles.maintext, styles.def]}>
                    Дата постановки задачи:
                  </Text>
                  <View style={[styles.inputWrapperInactive, styles.value]}>
                    <Text style={styles.dateText}>
                      {this.state.task.created_at}
                    </Text>
                  </View>
                </View>

                <View style={styles.line}>
                  <Text style={[styles.maintext, styles.def]}>
                    Дата монтажа:&nbsp;
                  </Text>
                  <View style={[styles.inputWrapper, styles.value]}>
                    <TouchableOpacity onPress={() => this.showDateTimePicker()}>
                      <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>
                          {this.state.task.installation_date}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                />

                <View style={{marginVertical: 10}}>
                  <TouchableOpacity onPress={() => {this.setState({modalStatus: true})}}>
                    <StatusBlock
                      text={this.props.statuses.items.find(item => parseInt(item.name) === parseInt(this.state.task.status)).value}
                      color={statusColor(this.state.task.status)} />
                  </TouchableOpacity>
                </View>
                <View style={styles.splitter}>
                </View>
                <Text style={styles.maintext}>
                  Город:&nbsp;
                </Text>
                <View style={styles.inputWrapper}>
                  <TouchableOpacity onPress={() => {this.setState({modalTown: true})}}>
                    <Text style={styles.textInput}>
                      { this.props.towns.items.find(item => item.id === parseInt(this.state.task.town_id)).name }
                    </Text>
                  </TouchableOpacity>

                </View>

                <Text style={styles.maintext}>
                  Название магазина:&nbsp;
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state.task.shop_title}
                    onChangeText={(text) => this.change('shop_title', text)}
                    onSubmitEditing={(text) => {}}/>
                </View>

                <Text style={styles.maintext}>
                  Тип:&nbsp;
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state.task.type}
                    onChangeText={(text) => this.change('type', text)}/>
                </View>
                <Text style={styles.maintext}>
                  Представитель:&nbsp;
                </Text>
                <View style={styles.inputWrapper}>
                  <TouchableOpacity onPress={() => {this.setState({modalAgent: true})}}>
                    <Text style={styles.textInput}>
                      {this.state.task.agent && this.state.task.agent.id ? this.state.task.agent.last_name + ' ' + this.state.task.agent.first_name : 'Не назначен' }
                    </Text>
                  </TouchableOpacity>

                </View>
                <Text style={styles.maintext}>
                  Бригадир:&nbsp;
                </Text>
                <View style={styles.inputWrapper}>
                  <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({modalMaster: true})}}>
                    <Text style={styles.textInput}>
                      {this.state.task.taskMaster && this.state.task.taskMaster.id ? this.state.task.taskMaster.last_name + ' ' + this.state.task.taskMaster.first_name : 'Не назначен' }
                    </Text>
                  </TouchableOpacity>

                </View>
                <Text style={styles.maintext}>
                  Телефон:&nbsp;
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state.task.agent && this.state.task.agent.id ? this.state.task.agent.phone : '-' }
                    onChangeText={(text) => this.change('phone', text)}
                    />
                </View>
                <Text style={styles.maintext}>
                  Адрес:&nbsp;
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state.task.address}
                    onChangeText={(text) => this.change('address', text)}/>
                </View>
                <CheckTownModal
                  visible={this.state.modalTown}
                  close={() => {this.setState({modalTown: false})}}
                  towns={this.props.towns.items}
                />
                <CheckAgentModal
                  visible={this.state.modalAgent}
                  close={() => {this.setState({modalAgent: false})}}
                  agents={this.props.user.agents}
                />
                <CheckMasterModal
                  visible={this.state.modalMaster}
                  close={() => {this.setState({modalMaster: false})}}
                  masters={this.props.user.taskmasters}
                />
                <CheckStatusModal
                  visible={this.state.modalStatus}
                  close={() => {this.setState({modalStatus: false})}}
                  statuses={this.props.statuses.items}
                />

              </View>
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
                </View>
              }
            </ScrollView>
          </KeyboardAvoidingView>
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
      saveTask: (sessionid, task, images) => saveTask(sessionid, task, images),
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      statuses: state.statuses,
      tasks: state.tasks,
      nav: state.nav,
      towns: state.towns
    }
  }, mapDispatchToProps
)(EditPage);
