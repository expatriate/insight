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
    Slider
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import PageHeader from '../../blocks/page-header';
import ImageViewer from '../../blocks/image-viewer';
import TaskCard from '../../blocks/task-card';
import FormInput from '../../forms/form-input';
import TagsInput from '../../forms/tags-input';
import Geocoder from 'react-native-geocoding-simple';
import CheckBox from 'react-native-check-box';
import KladrInput from '../../forms/kladr-input';
import DatePicker from 'react-native-datepicker'

import Tags from 'react-native-tags';
import LinearGradient from 'react-native-linear-gradient';
import DropdownAlert from 'react-native-dropdownalert';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import { NavigationEvents } from 'react-navigation';

import Svg, {
    Path,
    Circle,
    Polygon,
    Polyline,
    Defs,
    Stop,
    Rect,
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
  createNewTask,
  getGeolocation,
  getTaskCount,
  getTaskAll,
  getTaskResponds,
  getTaskDelegate,
  getTaskChoice,
  getTaskMake,
  getTaskArhiv
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

class CreateTaskPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      mode: 'all',
      step: 1,

      slideAnimation: new Animated.Value(22),      
      dataloaded: true,

      selected: [],
      search: '',
      tags: [],
      usertags: [],
      results: [],

      temporary: {
        usePretty: true,
      },

      task: {
        price: undefined,
        title: undefined,
        text: undefined,
        currency: 0,
        distance: 20,
        address: undefined,
        lat: 0,
        lng: 0,
        payment_type: 1,
        only_business: false,
        only_pro: false,
        for_all: true,
        paid: false,
        tags: [],
      },

      kladr: {
        full: undefined,
        address: null,
      },
      loadBtn: false
    }

    this.writing = this.writing.bind(this);
    this.removeFromTags = this.removeFromTags.bind(this);
    this.addToTags = this.addToTags.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {

    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });

    let tree = [];
    for(let i = 1; i < this.props.app.tags.length; i++) {
      if (this.props.app.tags[i].depth == 1) {
        tree.push({
          title: this.props.app.tags[i].title,
          items: []
        });
      } else {
        tree[tree.length - 1].items.push(this.props.app.tags[i])
      }
    }

    this.geolocationListener = EventRegister.addEventListener('APP_GEOLOCATION_RECIEVED', (data) => {
      if (data.coords) {
        Geocoder.from({
          lat : data.coords.latitude,
          lng : data.coords.longitude,
          language: 'ru',
        }).then(json => {
            this.setState({
              task: {
                ...this.state.task,
                address: json.results[0] ? json.results[0].formatted_address : '',
                lat: data.coords.latitude,
                lng: data.coords.longitude
              },
            });
          })
          .catch(error => console.warn(error));
      }
    });

    this.formErrorListener = EventRegister.addEventListener('ERROR_EVENT', (data) => {
      this.errors.alertWithType('warn', 'Ошибка при создании задачи', data);
    });
    this.taskCreaterListener = EventRegister.addEventListener('TASK_CREATE_SUCCESS', (data) => {
      this.props.getTaskCount();
      this.props.getTaskAll();
      this.props.getTaskResponds();
      this.props.getTaskDelegate();
      this.props.getTaskChoice();
      this.props.getTaskMake();
      this.props.getTaskArhiv();
      this.props.navigateToTask(data.data.task.id, data.data.task.title)
    });

    this.setState({
      tags: tree,
      usertags: this.props.tasks.search.tags || [],
      task: {
        ...this.state.task,
        address: this.props.user.data.address,
        lat: this.props.user.data.lat,
        lng: this.props.user.data.lng,
        user_id: this.props.user.data.id,
      }
    });
  };

  componentWillUnmount() {
    this.setState({
      isOpen: false 
    });
    EventRegister.removeEventListener(this.leftMenu);
    EventRegister.removeEventListener(this.formErrorListener);
    EventRegister.removeEventListener(this.geolocationListener);
    EventRegister.removeEventListener(this.taskCreaterListener);
  };

  isTagActive(tagid) {
    let tags = this.state.task.tags;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].id == parseInt(tagid)) {
        return true
      }
    }
    return false
  }

  // KLADR
  kladr(type, text, geocode) {
    this.setState(Object.assign(this.state, {
      task: {
        ...this.state.task,
        address: text,
      },
      kladr: {
        ...this.state.kladr,
        address: text
      }
    }));

    if (geocode) {
      Geocoder.from(this.state.task.address)
        .then(json => {

          this.setState({
            task: {
              ...this.state.task,
              lat: json.results[0].geometry.location.lat,
              lng: json.results[0].geometry.location.lng
            },
          });
        })
        .catch(error => console.warn(error));
    }
  }

  removeFromTags(item) {
    let tags = this.state.task.tags;
    let index = -1;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].id == item.id) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      tags.splice(index, 1);
    }

    this.setState({
      ...this.state,
      task: {
        ...this.state.task,
        tags: tags
      }
    })
  }

  addToTags(item) {

    this.setState({
      ...this.state,
      task: {
        ...this.state.task,
        tags: [
          ...this.state.task.tags,
          item
        ]
      }
    });
  }

  search(text){

    let results = [];

    if (text.length) {
      for (let i = 0; i < this.props.app.tags.length; i++) {
        if (results.length > 10) {
          break;
        } else {
          if (this.props.app.tags[i].depth > 1 && this.props.app.tags[i].title.toLowerCase().indexOf(text.toLowerCase()) > -1) {
            results.push(this.props.app.tags[i])
          }
        }
      }
    }

    this.setState({
      search: text,
      results: results
    });
  };

  onDistanceFocus() {
    this.setState({
      temporary: {
        ...this.state.temporary,
        usePretty: false,
      }
    })
  }

  onDistanceBlur() {
    this.setState({
      temporary: {
        ...this.state.temporary,
        usePretty: true,
      }
    })
  }

  getLocation() {
    this.props.getGeolocation();
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

    let popular = 
      this.props.app.popularTags.map((item, index) => {
        const tag = 
        this.isTagActive(item.id) ? 
          <LinearGradient key={'tagskill'+index} colors={['#31a3b7', '#3dccc6']} style={[styles.tag,]}>
            <TouchableHighlight underlayColor="transparent" onPress={() => this.removeFromTags(item)}>
              <View style={[baseStyles.verticalCenter,{flexDirection: 'row'}]}>
                <Text style={[styles.tag_text, styles.tag_text_active]}>
                  { item.title }
                </Text>
                <Svg width={20} height={20} viewBox="0 0 36 36" style={{marginTop:4, marginLeft: 4}}>
                  <Polygon 
                    fill="#ffffff" 
                    points="25.879,7.841 23.838,5.801 15.679,13.96 7.52,5.801 5.48,7.841 13.639,16 5.48,24.158 
                            7.52,26.199 15.679,18.041 23.838,26.199 25.879,24.158 17.719,16"/>
                </Svg>
              </View>
            </TouchableHighlight>
          </LinearGradient>
          :
          <TouchableHighlight key={'tagskill'+index} underlayColor="transparent" style={[styles.tag]} onPress={() => this.addToTags(item)}>
            <View style={[baseStyles.verticalCenter,{flexDirection: 'row'}]}>
              <Text style={[styles.tag_text, {marginTop:2}]}>
                { item.title }
              </Text>
            </View>
          </TouchableHighlight>

        return(tag)
      })


    let all = this.state.tags.map((item, index) => {
      return(<View key={'category'+index} style={styles.tagTitle}>
          <TouchableHighlight underlayColor="transparent"
            onPress={() => {
              this.setState({['category'+index]: !this.state['category'+index]})
            }}>
            <View style={[baseStyles.row, baseStyles.verticalCenter, styles.tag_main]}>
              <Text style={[styles.normalTitle_bold, {flex: 1}]}>
                { item.title }
              </Text>
              { 
                !this.state['category'+index] ? 
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
          <View>
            { 
              this.state['category'+index] ?
                item.items.map((el, elIndex) => {
                  return(<View key={'subcategory'+index+elIndex}>
                      <TouchableHighlight underlayColor="transparent">
                      {
                        this.isTagActive(el.id) ? 
                        <LinearGradient key={'tagskill'+index} colors={['#31a3b7', '#3dccc6']} style={[baseStyles.row, baseStyles.verticalCenter, styles.tag_sub, styles.type_sub_active]}>
                          <Text style={[styles.normalTitle, styles.normalTitle_active]}>
                            { el.title }
                          </Text>
                          <TouchableHighlight underlayColor="transparent" onPress={() => this.removeFromTags(el)}>
                            <Svg width={24} height={24} viewBox="0 0 36 36" style={{marginTop:4}}>
                              <Polygon 
                                fill="#ffffff" 
                                points="25.879,7.841 23.838,5.801 15.679,13.96 7.52,5.801 5.48,7.841 13.639,16 5.48,24.158 
                                        7.52,26.199 15.679,18.041 23.838,26.199 25.879,24.158 17.719,16"/>
                            </Svg>
                          </TouchableHighlight>
                        </LinearGradient>
                        :
                        <TouchableHighlight underlayColor="transparent" style={[baseStyles.row, baseStyles.verticalCenter, styles.tag_sub]} onPress={() => this.addToTags(el)}>
                          <Text style={styles.normalTitle}>
                            { el.title }
                          </Text>
                        </TouchableHighlight>
                      }
                      </TouchableHighlight>
                    </View>)
                })
                : undefined
            }
          </View>
        </View>)
    });

    let results = this.state.results.map((item, index) => {
      return(<View key={'subcategory_found'+index}>
        <TouchableHighlight underlayColor="transparent">
        {
          this.isTagActive(item.id) ? 
          <LinearGradient key={'tagskill'+index} colors={['#31a3b7', '#3dccc6']} style={[baseStyles.row, baseStyles.verticalCenter, styles.tag_sub, styles.type_sub_active]}>
            <Text style={[styles.normalTitle_results, styles.normalTitle_active]}>
              { item.title }
            </Text>
            <TouchableHighlight underlayColor="transparent" onPress={() => this.removeFromTags(item)}>
              <Svg width={24} height={24} viewBox="0 0 36 36" style={{marginTop:4}}>
                <Polygon 
                  fill="#ffffff" 
                  points="25.879,7.841 23.838,5.801 15.679,13.96 7.52,5.801 5.48,7.841 13.639,16 5.48,24.158 
                          7.52,26.199 15.679,18.041 23.838,26.199 25.879,24.158 17.719,16"/>
              </Svg>
            </TouchableHighlight>
          </LinearGradient>
          :
          <TouchableHighlight underlayColor="transparent" style={[baseStyles.row, baseStyles.verticalCenter, styles.tag_sub]} onPress={() => this.addToTags(item)}>
            <Text style={styles.normalTitle_results}>
              { item.title }
            </Text>
          </TouchableHighlight>
        }
        </TouchableHighlight>
      </View>)
    });

    let step1 = 
      <View>
        <ScrollView 
          keyboardShouldPersistTaps={'handled'}
          >
          <PageHeader 
            title={'Создание задачи'}
            menu={true}
            />
          <View style={[baseStyles.row, styles.mainTitle, baseStyles.verticalCenter]}>
            <View style={{flex: 1}}>
              <Text style={[styles.normalTitle_bold, {marginBottom: 0}]}>
                Выберите тип услуги
              </Text>
              <Text style={[styles.normalTitle_bold, {marginBottom: 0}]}>
                которая Вас интересует
              </Text>
            </View>
            <Text style={styles.titleStep}>
              1/4
            </Text>
          </View>
          <View style={[styles.block_light, styles.block_search]}>
            <TagsInput 
              withoutclear={true}
              tags={this.state.task.tags}
              name='tag'
              writing={(text) => {this.search(text)}}
              placeholder='Начните вводить название услуги...'
              placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
              type="none"
              value={this.state.search}
              search={true}
              removeFromTags={this.removeFromTags}
              style={{marginBottom:0, paddingBottom: 0}}/>
              <View style={styles.searchContainer}>
                { results }
                { 
                  this.state.results.length ? 
                  <View style={{height:15}}>
                  </View>
                  :
                  undefined
                }
              </View>
          </View>
          <View style={styles.block_dark}>
            <Text style={[styles.tagsTitle, styles.tagsTitle_white]}>
              Популярные
            </Text>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={styles.popular_container}>
              { popular }
            </ScrollView>
            {
              !this.props.app.popularTags.length ?
              <Text style={styles.emptyText}>
                Не выбрано ни одного тега
              </Text> : undefined
            }
          </View>
          <View style={styles.block_light}>
            <Text style={[styles.tagsTitle, styles.tagsTitle_grey]}>
              Все
            </Text>
            { all }
          </View>
        </ScrollView>
        <View style={styles.editContainerControls}>
          <TouchableHighlight underlayColor="transparent" onPress={() => this.nextStep()}>
            <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
              <View>
                <View style={[buttonsStyles.buttonBig, buttonsStyles.buttonBig__bigpad]}>
                  <Text style={buttonsStyles.buttonBigText}>Далее</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableHighlight>
        </View>
      </View>

    let step2 = 
      <ScrollView 
        keyboardShouldPersistTaps={'handled'}
        >
        <PageHeader 
          title={'Создание задачи'}
          back={true}
          onBack={() => {this.setState({step: 1})}}
          />
        <View style={[baseStyles.row, styles.mainTitle, baseStyles.verticalCenter]}>
          <View style={{flex: 1}}>
            <Text style={[styles.normalTitle_bold, {marginBottom: 0}]}>
              Опишите задачу и укажите
            </Text>
            <Text style={[styles.normalTitle_bold, {marginBottom: 0}]}>
              примерный бюджет
            </Text>
          </View>
          <Text style={styles.titleStep}>
            2/4
          </Text>
        </View>
        <View style={styles.details}>
          <FormInput 
            title="Заголовок" 
            multiline={true} 
            name="title" 
            value={this.state.task.title} 
            writing={(text) => 
              {this.writing('title', text)}
            } 
            placeholder="Название задачи" />
          <View style={[baseStyles.row]}>
            <FormInput 
              title="Примерный бюджет" 
              keyboardType={'numeric'} 
              value={this.state.task.price} 
              name="price" 
              writing={(text) => 
                {
                  this.writing('price', text)
                }
              } 
              withoutclear={true} 
              style={{marginRight: 20, flex: 3}} 
              placeholder="1000" />
            <View style={{flex: 2}}>
              <Text style={[formsStyles.normalTitle__black]}>
                Валюта
              </Text>
              <View style={[formsStyles.pickerWrap]}>
                <Picker
                  selectedValue={this.state.task.currency}
                  style={[formsStyles.picker]}
                  itemStyle={formsStyles.pickerElement}
                  onValueChange={(itemValue, itemIndex) => {this.writing('currency', itemValue)}}>
                  {
                    this.props.app.dictionary.currency.map((item) => {
                      return (<Picker.Item key={`currency_${item.value}`} label={item.name} value={item.value} />)
                    })
                  }
                </Picker>
              </View>
            </View>
          </View>
          <FormInput 
              title="Описание" 
              multiline={true} 
              numberOfLines={5}
              withoutclear={true}
              name="text" 
              value={this.state.task.text} 
              writing={(text) => 
                {this.writing('text', text)}
              } 
              placeholder="Описание задачи" />
          <TouchableHighlight underlayColor="transparent" onPress={() => this.nextStep()}>
            <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
              <View>
                <View style={[buttonsStyles.buttonBig, buttonsStyles.buttonBig__bigpad]}>
                  <Text style={buttonsStyles.buttonBigText}>Далее</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableHighlight>
        </View>
      </ScrollView>

    let step3 = 
      <ScrollView 
        keyboardShouldPersistTaps={'handled'}
        >
        <PageHeader 
          title={'Создание задачи'}
          back={true}
            onBack={() => {this.setState({step: 2})}}
          />
        <View style={[baseStyles.row, styles.mainTitle, baseStyles.verticalCenter]}>
          <View style={{flex: 1}}>
            <Text style={[styles.normalTitle_bold, {marginBottom: 0}]}>
              Укажите время и место
            </Text>
            <Text style={[styles.normalTitle_bold, {marginBottom: 0}]}>
              если это необходимо
            </Text>
          </View>
          <Text style={styles.titleStep}>
            3/4
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
            Место
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom:12}}>
            <View style={[formsStyles.checkboxContainer__normal, {marginRight: 20}]}>
              <CheckBox 
                onClick={()=>{
                  this.setState({
                    ...this.state,
                    task: {
                      ...this.state.task,
                      enableAddress: !this.state.task.enableAddress
                    }
                  })}
                }
                checkedImage={
                  <Svg width={36} height={36} viewBox="0 0 50 50">
                    <Rect stroke-width="1" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                    <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                  </Svg>
                }
                unCheckedImage={
                  <Svg width={36} height={36} viewBox="0 0 50 50">
                    <Rect stroke-width="1" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                  </Svg>
                }
                isChecked={this.state.task.enableAddress}
              />
            </View>
            <KladrInput 
              multiline={true} 
              //noteditable={!this.state.task.enableAddress ? true : false}
              noteditable={true}
              value={this.state.task.address} 
              style={[{marginBottom:0, flex: 1}, !this.state.task.enableAddress ? baseStyles.disabled : undefined]} 
              placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
              name="address"
              location={true}
              getLocation={() => {
                this.getLocation();
              }}
              withoutclear={true}
              writing={(text, geocode) => {this.kladr('address', text, geocode)}} 
              placeholder="Адрес" 
              />
          </View>

          <View style={[baseStyles.verticalCenter, {flexDirection: 'row'}]}>
            <Slider
              step={1}
              style={[{width:'60%'}, !this.state.task.enableAddress ? baseStyles.disabled : undefined]} 
              maximumValue={100}
              disabled={!this.state.task.enableAddress ? true : false}
              onValueChange={(value) => {this.writing('distance', value)}}
              value={this.state.task.distance}
            />
            <FormInput  
              name={'distance'}
              style={[{marginBottom:0, flex: 1}, !this.state.task.enableAddress ? baseStyles.disabled : undefined]} 
              writing={(text) => {this.writing('distance', text)}} 
              noteditable={!this.state.task.enableAddress ? true : false}
              placeholder={'Дистанция'}
              onFocus={() => { this.onDistanceFocus() }}
              onBlur={() => { this.onDistanceBlur() }}
              withoutclear={true}
              keyboardType={'numeric'}
              value={this.state.temporary.usePretty ? '+ ' + this.state.task.distance + ' км' : this.state.task.distance + ''}
            />
          </View>

          <View style={[baseStyles.splitter_full, baseStyles.splitter_full_smlmg]}>
          </View>

          <Text style={[baseStyles.smallText, baseStyles.smallText_black]}>
            Дата и время старта
          </Text>
          <View style={[baseStyles.row]}>
            <View style={{flex: 1, marginRight: 20}}>
              <View style={[formsStyles.pickerWrap, {flexDirection: 'row', alignItems: 'center'}]}>
                
                <DatePicker
                  style={{borderWidth: 0, flex: 1}}
                  date={this.state.task.start_date}
                  mode="date"
                  placeholder="Дата"
                  format="DD.MM.YYYY"
                  showIcon={false}
                  confirmBtnText="Подтвердить"
                  cancelBtnText="Отмена"
                  customStyles={{
                    dateInput: {
                      borderWidth:0,
                    }
                  }}
                  onDateChange={(date) => {
                    this.setState({
                      ...this.state,
                      task: {
                        ...this.state.task,
                        start_date: date
                      }}
                    )}
                  }
                />
                <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 8}}>
                  <Path 
                    fill={Colors.COLOR_GRAY_ICONS}
                    d="M9,11 L7,11 L7,13 L9,13 L9,11 L9,11 Z M13,11 L11,11 L11,13 L13,13 L13,11 L13,11 Z M17,11 L15,11 L15,13 L17,13 L17,11 L17,11 Z M19,4 L18,4 L18,2 L16,2 L16,4 L8,4 L8,2 L6,2 L6,4 L5,4 C3.89,4 3.01,4.9 3.01,6 L3,20 C3,21.1 3.89,22 5,22 L19,22 C20.1,22 21,21.1 21,20 L21,6 C21,4.9 20.1,4 19,4 L19,4 Z M19,20 L5,20 L5,9 L19,9 L19,20 L19,20 Z"/>
                </Svg>
              </View>
            </View>
            <View style={{flex: 1}}>
              <View style={[formsStyles.pickerWrap, {flexDirection: 'row', alignItems: 'center'}]}>
                <DatePicker
                  style={{borderWidth: 0, flex: 1}}
                  date={this.state.task.start_time}
                  mode="time"
                  placeholder="Время"
                  format="HH:mm"
                  confirmBtnText="Подтвердить"
                  cancelBtnText="Отмена"
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      borderWidth:0,
                    }
                  }}
                  onDateChange={(date) => {
                    this.setState({
                      ...this.state,
                      task: {
                        ...this.state.task,
                        start_time: date
                      }}
                    )}
                  }
                />
                <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 8}}>
                  <Path 
                    fill={Colors.COLOR_GRAY_ICONS}
                    d="M22,5.72 L17.4,1.86 L16.11,3.39 L20.71,7.25 L22,5.72 L22,5.72 Z M7.88,3.39 L6.6,1.86 L2,5.71 L3.29,7.24 L7.88,3.39 L7.88,3.39 Z M12.5,8 L11,8 L11,14 L15.75,16.85 L16.5,15.62 L12.5,13.25 L12.5,8 L12.5,8 Z M12,4 C7.03,4 3,8.03 3,13 C3,17.97 7.02,22 12,22 C16.97,22 21,17.97 21,13 C21,8.03 16.97,4 12,4 L12,4 Z M12,20 C8.13,20 5,16.87 5,13 C5,9.13 8.13,6 12,6 C15.87,6 19,9.13 19,13 C19,16.87 15.87,20 12,20 L12,20 Z"/>
                </Svg>
              </View>
            </View>
          </View>

          <Text style={[baseStyles.smallText, baseStyles.smallText_black, {marginTop: 20}]}>
            Дата и время завершения
          </Text>
          <View style={[baseStyles.row, {marginBottom: 20}]}>
            <View style={{flex: 1, marginRight: 20}}>
              <View style={[formsStyles.pickerWrap, {flexDirection: 'row', alignItems: 'center'}]}>
                <DatePicker
                  style={{borderWidth: 0, flex: 1}}
                  date={this.state.task.end_date}
                  mode="date"
                  placeholder="Дата"
                  format="DD.MM.YYYY"
                  confirmBtnText="Подтвердить"
                  cancelBtnText="Отмена"
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      borderWidth:0,
                    }
                  }}
                  onDateChange={(date) => {
                    this.setState({
                      ...this.state,
                      task: {
                        ...this.state.task,
                        end_date: date
                      }}
                    )}
                  }
                />
                <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 8}}>
                  <Path 
                    fill={Colors.COLOR_GRAY_ICONS}
                    d="M9,11 L7,11 L7,13 L9,13 L9,11 L9,11 Z M13,11 L11,11 L11,13 L13,13 L13,11 L13,11 Z M17,11 L15,11 L15,13 L17,13 L17,11 L17,11 Z M19,4 L18,4 L18,2 L16,2 L16,4 L8,4 L8,2 L6,2 L6,4 L5,4 C3.89,4 3.01,4.9 3.01,6 L3,20 C3,21.1 3.89,22 5,22 L19,22 C20.1,22 21,21.1 21,20 L21,6 C21,4.9 20.1,4 19,4 L19,4 Z M19,20 L5,20 L5,9 L19,9 L19,20 L19,20 Z"/>
                </Svg>
              </View>
            </View>
            <View style={{flex: 1}}>
              <View style={[formsStyles.pickerWrap, {flexDirection: 'row', alignItems: 'center'}]}>
                <DatePicker
                  style={{borderWidth: 0, flex: 1}}
                  date={this.state.task.end_time}
                  mode="time"
                  placeholder="Время"
                  format="HH:mm"
                  confirmBtnText="Подтвердить"
                  cancelBtnText="Отмена"
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      borderWidth:0,
                    }
                  }}
                  onDateChange={(date) => {
                    this.setState({
                      ...this.state,
                      task: {
                        ...this.state.task,
                        end_time: date
                      }}
                    )}
                  }
                />
                <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 8}}>
                  <Path 
                    fill={Colors.COLOR_GRAY_ICONS}
                    d="M22,5.72 L17.4,1.86 L16.11,3.39 L20.71,7.25 L22,5.72 L22,5.72 Z M7.88,3.39 L6.6,1.86 L2,5.71 L3.29,7.24 L7.88,3.39 L7.88,3.39 Z M12.5,8 L11,8 L11,14 L15.75,16.85 L16.5,15.62 L12.5,13.25 L12.5,8 L12.5,8 Z M12,4 C7.03,4 3,8.03 3,13 C3,17.97 7.02,22 12,22 C16.97,22 21,17.97 21,13 C21,8.03 16.97,4 12,4 L12,4 Z M12,20 C8.13,20 5,16.87 5,13 C5,9.13 8.13,6 12,6 C15.87,6 19,9.13 19,13 C19,16.87 15.87,20 12,20 L12,20 Z"/>
                </Svg>
              </View>
            </View>
          </View>

          <View style={[baseStyles.splitter_full, baseStyles.splitter_full_smlmg]}>
          </View>

          <TouchableHighlight underlayColor="transparent" onPress={() => this.nextStep()}>
            <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
              <View>
                <View style={[buttonsStyles.buttonBig, buttonsStyles.buttonBig__bigpad]}>
                  <Text style={buttonsStyles.buttonBigText}>Далее</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableHighlight>
        </View>
      </ScrollView>
    
    let step4 = 
      <ScrollView 
        keyboardShouldPersistTaps={'handled'}
        >
        <PageHeader 
          title={'Создание задачи'}
          back={true}
          onBack={() => {this.setState({step: 3})}}
          />
        <View style={[baseStyles.row, styles.mainTitle, baseStyles.verticalCenter]}>
          <View style={{flex: 1}}>
            <Text style={[styles.normalTitle_bold, {marginBottom: 0}]}>
              Дополнительные
            </Text>
            <Text style={[styles.normalTitle_bold, {marginBottom: 0}]}>
              параметры
            </Text>
          </View>
          <Text style={styles.titleStep}>
            4/4
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={[baseStyles.smallText, baseStyles.smallText_black, {marginBottom: 10}]}>
            Доступна к исполнению
          </Text>

          <View style={{marginBottom: 10}}>
            <View style={formsStyles.checkboxContainer__normal}>
              <CheckBox 
                onClick={() => {
                  this.setState({
                    ...this.state,
                    task: {
                      ...this.state.task,
                      only_pro: false,
                      only_business: false,
                      for_all: true
                    }
                  })}
                }
                checkedImage={
                  <Svg width={36} height={36} viewBox="0 0 50 50">
                    <Rect stroke-width="2" fill="#ffffff" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                    <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                  </Svg>
                }
                unCheckedImage={
                  <Svg width={36} height={36} viewBox="0 0 50 50">
                    <Rect stroke-width="2" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                  </Svg>
                }
                rightTextStyle={formsStyles.checkboxText_dark}
                isChecked={this.state.task.for_all}
                rightText={"Всеми"}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
            <View style={[formsStyles.checkboxContainer__normal, {flex: 1}]}>
              <CheckBox 
                onClick={() => {
                  this.setState({
                    ...this.state,
                    task: {
                      ...this.state.task,
                      only_pro: true,
                      only_business: false,
                      for_all: false
                    }
                  })}
                }
                checkedImage={
                  <Svg width={36} height={36} viewBox="0 0 50 50">
                    <Rect stroke-width="2" fill="#ffffff" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                    <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                  </Svg>
                }
                unCheckedImage={
                  <Svg width={36} height={36} viewBox="0 0 50 50">
                    <Rect stroke-width="2" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                  </Svg>
                }
                rightTextStyle={formsStyles.checkboxText_dark}
                isChecked={this.state.task.only_pro}
                rightText="Только Pro"
              />
            </View>
            <View style={[formsStyles.checkboxContainer__normal, {flex: 1}]}>
              <CheckBox 
                onClick={() => {
                  this.setState({
                    ...this.state,
                    task: {
                      ...this.state.task,
                      only_pro: false,
                      only_business: true,
                      for_all: false
                    }
                  })}
                }
                checkedImage={
                  <Svg width={36} height={36} viewBox="0 0 50 50">
                    <Rect stroke-width="2" fill="#ffffff" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                    <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                  </Svg>
                }
                unCheckedImage={
                  <Svg width={36} height={36} viewBox="0 0 50 50">
                    <Rect stroke-width="2" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                  </Svg>
                }
                rightTextStyle={formsStyles.checkboxText_dark}
                isChecked={this.state.task.only_business}
                rightText="Только Business"
              />
            </View>
          </View>

          <View style={styles.paidTask}>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <View style={[formsStyles.checkboxContainer__normal, {flex: 1}]}>
                <CheckBox 
                  onClick={() => {
                    this.setState({
                      ...this.state,
                      task: {
                        ...this.state.task,
                        paid: !this.state.task.paid,
                      }
                    })}
                  }
                  checkedImage={
                    <Svg width={36} height={36} viewBox="0 0 50 50">
                      <Rect stroke-width="2" fill="#ffffff" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                      <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                    </Svg>
                  }
                  unCheckedImage={
                    <Svg width={36} height={36} viewBox="0 0 50 50">
                      <Rect stroke-width="2" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                    </Svg>
                  }
                  rightTextStyle={formsStyles.checkboxText_dark}
                  isChecked={this.state.task.paid}
                  rightText='Платная задача'
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <Text style={[styles.checkboxText_dark, {marginTop: -10}]}>
                Стоимость 500р
              </Text>
            </View>
          </View>

          <LinearGradient colors={this.state.task.payment_type == 3 || this.state.task.payment_type == 1 ? ['#31a3b7', '#3dccc6'] : ['#ffffff', '#ffffff']} style={styles.taskType}>
            <View>
              <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                <View style={[formsStyles.checkboxContainer__normal, {flex: 1}]}>
                  <CheckBox 
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        task: {
                          ...this.state.task,
                          payment_type: 1,
                        }
                      })}
                    }
                    checkedImage={
                      <Svg width={36} height={36} viewBox="0 0 50 50">
                        <Rect stroke-width="2" fill="#ffffff" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                        <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                      </Svg>
                    }
                    unCheckedImage={
                      <Svg width={36} height={36} viewBox="0 0 50 50">
                        <Rect stroke-width="2" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                      </Svg>
                    }
                    rightTextStyle={this.state.task.payment_type == 1 || this.state.task.payment_type == 3 ? formsStyles.checkboxTitle_light : formsStyles.checkboxTitle_dark}
                    isChecked={this.state.task.payment_type == 1 || this.state.task.payment_type == 3}
                    rightText='Обычная сделка'
                  />
                </View>
              </View>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text style={[this.state.task.payment_type == 1 || this.state.task.payment_type == 3 ? styles.checkboxText_light : styles.checkboxText_dark, {marginBottom: 10}]}>
                  Оплата наличными или любым удобным способом для эксперта. Сервис не несет ответственности за процесс сделки.
                </Text>
                <View style={{paddingLeft: 44}}>
                  <CheckBox 
                    disabled={!this.state.task.payment_type == 1 || !this.state.task.payment_type == 3}
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        task: {
                          ...this.state.task,
                          payment_type: 3,
                        }
                      })}
                    }
                    checkedImage={
                      <Svg width={36} height={36} viewBox="0 0 50 50">
                        <Rect stroke-width="2" fill="#ffffff" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                        <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                      </Svg>
                    }
                    unCheckedImage={
                      <Svg width={36} height={36} viewBox="0 0 50 50">
                        <Rect stroke-width="2" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                      </Svg>
                    }
                    isChecked={this.state.task.payment_type == 3}
                    rightTextStyle={this.state.task.payment_type == 1 || this.state.task.payment_type == 3 ? formsStyles.checkboxText_light : formsStyles.checkboxText_dark}
                    rightText='Будет договор'
                  />
                </View>
              </View>
            </View>
          </LinearGradient>

          <LinearGradient colors={this.state.task.payment_type == 2 ? ['#31a3b7', '#3dccc6'] : ['#ffffff', '#ffffff']} style={styles.taskType}>
            <View>
              <View style={[formsStyles.checkboxContainer__normal, {flex: 1}]}>
                <CheckBox 
                  onClick={() => {
                    this.setState({
                      ...this.state,
                      task: {
                        ...this.state.task,
                        payment_type: 2,
                      }
                    })}
                  }
                  checkedImage={
                    <Svg width={36} height={36} viewBox="0 0 50 50">
                      <Rect stroke-width="2" fill="#ffffff" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                      <Polygon fill="#31A3B7" points="8.563,23.625 11.313,20.75 22.25,31.625 43.438,7.688 46.438,10.438 22.438,37.5 "/>
                    </Svg>
                  }
                  unCheckedImage={
                    <Svg width={36} height={36} viewBox="0 0 50 50">
                      <Rect stroke-width="2" fill="none" stroke="#CCDBE3" x="1" y="1" width="48" height="48" rx="8"/>
                    </Svg>
                  }
                  isChecked={this.state.task.payment_type == 2}
                  rightTextStyle={this.state.task.payment_type == 2 ? formsStyles.checkboxTitle_light : formsStyles.checkboxTitle_dark}
                  rightText='Безопасная сделка'
                />
              </View>
              <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                <Text style={this.state.task.payment_type == 2 ? styles.checkboxText_light : styles.checkboxText_dark}>
                  Ваши средства замораживаются и поступают к исполнителю только после подтверждения выполнения задачи. В случае возникновения конфликтной ситуации вы или исполнитель можете обратиться в арбитраж
                </Text>
              </View>
            </View>
          </LinearGradient>

          <TouchableHighlight underlayColor="transparent"
            onPress={() => {
              this.setState({
                loadBtn: true
              })
              this.createTask()
            }}>
            <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
              <View>
                <View style={[buttonsStyles.buttonBig]}>
                  {!this.state.loadBtn ?
                    <Text style={buttonsStyles.buttonBigText}>
                      Опубликовать задачу
                    </Text> :
                    <ActivityIndicator />
                  }

                </View>
              </View>
            </LinearGradient>
          </TouchableHighlight>
        </View>

      </ScrollView>

    return (
      <SideMenu
        menu={menu}
        bounceBackOnOverdraw={false}
        isOpen={this.state.isOpen}
        animationFunction={animationFunction}
        onChange={isOpen => this.updateMenuState(isOpen)}
        openMenuOffset={Dimensions.get('window').width * (6 / 7)}
      >
        <View style={[baseStyles.container, styles.profileContainer]}>
          
          { 
            this.state.step == 1 ?
              step1
            : 
            this.state.step == 2 ?
              step2
            :
            this.state.step == 3 ?
              step3
            :
            this.state.step == 4 ?
              step4
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
          ref={ref => this.errors = ref} />
        <NavigationEvents
          onWillFocus={() => this._onPageFocus()}
        />
      </SideMenu>
    );
  }

  _onPageFocus() {
    this.setState({
      isOpen: false
    })
  }

  createTask() {
    this.props.createNewTask(this.state.task);
  }

  // On user text typing
  writing(type, text){
    switch(type) {
      case 'search':
        this.setState({
          search: text
        });
      break;
      case 'title':
        this.setState({
          task: {
            ...this.state.task,
            title: text
          }
        });
      break;
      case 'currency':
        this.setState({
          task: {
            ...this.state.task,
            currency: text
          }
        });
      break;
      case 'text':
        this.setState({
          task: {
            ...this.state.task,
            text: text
          }
        });
      break;
      case 'price':
        this.setState({
          task: {
            ...this.state.task,
            price: text
          }
        });
      break;
      case 'distance':
        this.setState({
          task: {
            ...this.state.task,
            distance: text
          }
        });
      break;
    }
  };

  nextStep() {
    let errors = '';
    if (this.state.step == 2) {
      if (!this.state.task.title) {
        errors = errors.length ? errors + '\n\n' + 'Поле "Заголовок" не может быть пустым' : 'Поле "Заголовок" не может быть пустым';
      }
      if (!this.state.task.price) {
        errors = errors.length ? errors + '\n\n' + 'Поле "Примерный бюджет" не может быть пустым' : 'Поле "Примерный бюджет" не может быть пустым';
      }
      if (!this.state.task.text) {
        errors = errors.length ? errors + '\n\n' + 'Поле "Описание" не может быть пустым' : 'Поле "Описание" не может быть пустым';
      }
    }

    if (!errors.length) {
      this.setState({
        step: this.state.step + 1
      });
    } else {
      EventRegister.emit('ERROR_EVENT', errors);
    }
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
      navigateToTask: (taskid, title) => navigateToTask(taskid, title),
      navigateToTasksFilter: navigateToTasksFilter,
      navigateBack: navigateBack,
      getNewTasks: (page, type) => getNewTasks(page, type),
      removeRespond: (taskId, respondId) => removeRespond(taskId, respondId),
      applyRespond: (taskId, userid) => applyRespond(taskId, userid),
      createNewTask: (params) => createNewTask(params),
      getGeolocation: getGeolocation,
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
)(CreateTaskPage);