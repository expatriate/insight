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
import KladrInput from '../../forms/kladr-input';
import Geocoder from 'react-native-geocoding-simple';
import CheckBox from 'react-native-check-box';
import Tags from 'react-native-tags';
import LinearGradient from 'react-native-linear-gradient';
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
  navigateToTasksCatalogPage,
  navigateBack,
  filterTasks,
  filterMyTasks,
  navigateToMyTasks,
  navigateToTags,
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

class TasksFilterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {

      temporary: {
        usePretty: true
      },

      search: {
        address: undefined,
        tags: [],
        distance: 20,
        title: undefined,
        only_pro: false,
        arhive: false,
        only_business: false,
      },

      kladr: {
        full: undefined,
        address: null,
      },

      mytasks: false,
    }

    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    
    
    if (this.props.nav.routes[this.props.nav.index].params && this.props.nav.routes[this.props.nav.index].params.mytasks) {
      let adressTemp = this.props.user.search.address && this.props.user.search.address == '_' ? this.props.user.data.address : this.props.user.search.address;
       this.setState({
        search: {
          address: adressTemp,
          tags: this.props.user.search.tags ? this.props.user.search.tags : [],
          distance: this.props.user.search['length'] ? this.props.user.search['length'] : 20,
          title: this.props.user.search.title ? this.props.user.search.title : undefined,
          only_pro: this.props.user.search.only_pro ? true : false,
          arhive: this.props.user.search.arhive ? true : false,
          only_business: this.props.user.search.only_business ? true : false,
          lat: this.props.user.search.lat ? this.props.user.search.lat : 0,
          lng: this.props.user.search.lng ? this.props.user.search.lng : 0,
          price_min: this.props.user.search.price_min ? this.props.user.search.price_min : undefined,
          price_max: this.props.user.search.price_max ? this.props.user.search.price_max : undefined,
        },
        mytasks: true
      })
    } else {
      let adressTemp = this.props.tasks.search.address && this.props.tasks.search.address == '_' ? this.props.user.data.address : this.props.tasks.search.address;
      this.setState({
        search: {
          address: adressTemp,
          tags: this.props.tasks.search.tags ? this.props.tasks.search.tags : [],
          distance: this.props.tasks.search['length'] ? this.props.tasks.search['length'] : 20,
          title: this.props.tasks.search.title ? this.props.tasks.search.title : undefined,
          only_pro: this.props.tasks.search.only_pro ? true : false,
          arhive: this.props.tasks.search.arhive ? true : false,
          only_business: this.props.tasks.search.only_business ? true : false,
          lat: this.props.tasks.search.lat ? this.props.tasks.search.lat : 0,
          lng: this.props.tasks.search.lng ? this.props.tasks.search.lng : 0,
          price_min: this.props.tasks.search.price_min ? this.props.tasks.search.price_min : undefined,
          price_max: this.props.tasks.search.price_max ? this.props.tasks.search.price_max : undefined,
        },
        mytasks: false
      })
    }

    this.filterAppliedListener = EventRegister.addEventListener('FILTER_APPLIED', (data) => {
      this.props.navigateToTasksCatalogPage();
    });

    this.mytasksFilterAppliedListener = EventRegister.addEventListener('MYTASKS_FILTER_APPLIED', (data) => {
      this.props.navigateToMyTasks('Filter');
      EventRegister.emit('OPEN_FILTER_TASKS');
    });

    this.filterTagsAppliedListener = EventRegister.addEventListener('FILTER_TAGS_APPLIED', (data) => {
      this.setState({
        search: {
          ...this.state.search,
          tags: data,
        }
      })
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.filterAppliedListener);
    EventRegister.removeEventListener(this.mytasksFilterAppliedListener);

    EventRegister.removeEventListener(this.filterTagsAppliedListener);
  };

  filter() {

    if (this.props.nav.routes[this.props.nav.index].params && this.props.nav.routes[this.props.nav.index].params.mytasks) {
      this.props.filterMyTasks(this.state.search)
    } else {
      this.props.filterTasks(this.state.search)
    }
  }

  // KLADR
  kladr(type, text, geocode) {
    this.setState(Object.assign(this.state, {
      search: {
        ...this.state.search,
        address: text,
      },
      kladr: {
        ...this.state.kladr,
        address: text
      }
    }));

    if (geocode) {
      Geocoder.from(this.state.search.address)
        .then(json => {

          this.setState({
            search: {
              ...this.state.search,
              lat: json.results[0].geometry.location.lat,
              lng: json.results[0].geometry.location.lng
            },
          });
        })
        .catch(error => console.warn(error));
    }
  }

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

  render() {

    let tags = !this.state.mytasks && this.props.tasks.search.tags ? this.props.tasks.search.tags.map((item, index) => {
      return (
        <Text style={styles.tag_text} key={`search_tag_${index}`}>
          { item.title }
        </Text>)
    }) 
    : 
      this.state.mytasks && this.props.user.search.tags ? this.props.user.search.tags.map((item, index) => {
        return (
          <Text style={styles.tag_text} key={`search_tag_${index}`}>
            { item.title }
          </Text>)
      }) 
      : undefined;

    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{backgroundColor: '#3dccc6'}} style={{backgroundColor: '#3dccc6'}}>
        <LinearGradient colors={['#31a3b7', '#3dccc6']}>
          <View>
            <PageHeader 
              title={'Фильтр задач'} 
              back={true}
              onBack={this.props.navigateBack}
              />
            <View style={[styles.wrapper]}>
              <View style={[formsStyles.inputContainer]}>
                <TouchableHighlight 
                  underlayColor="transparent" 
                  onPress={() => 
                    this.props.navigateToTags(this.props.nav.routes[this.props.nav.index])
                  }>
                  <View style={styles.tagsContainer}>
                    <View style={styles.tags}>
                      {
                        !this.state.mytasks && this.props.tasks.search.tags.length || this.state.mytasks && this.props.user.search.tags.length ?
                          tags
                        :
                        <Text style={styles.specText}>
                          Специализация
                        </Text>
                      }

                    </View>
                    <Svg style={{paddingHorizontal: 8}} width={14} height={14} viewBox="0 -2 12 12">
                      <Polygon 
                        fill={Colors.COLOR_GRAY_ICONS}
                        points="2.6,-0.6 7.2,4 2.6,8.6 4,10 10,4 4,-2"
                      />
                    </Svg>
                  </View>
                </TouchableHighlight>
              </View>
              <FormInput  
                name={'title'} 
                writing={(text) => {this.writing('title', text)}} 
                placeholder={'Название и описание задачи'} 
                search={true}
                withoutclear={true}
                value={this.state.search.title}
              />
              <KladrInput 
                multiline={true} 
                value={this.state.search.address} 
                style={{marginBottom:20}} 
                placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
                name="address"
                writing={(text, geocode) => {this.kladr('address', text, geocode)}} 
                placeholder="Адрес" 
                />
              <View style={[formsStyles.inputContainer]}>
                <View style={[baseStyles.verticalCenter, {flexDirection: 'row'}]}>
                  <Slider
                    step={1}
                    style={{width:'60%'}}
                    maximumValue={100}
                    onValueChange={(value) => {this.writing('distance', value)}}
                    value={this.state.search.distance}
                  />
                  <FormInput  
                    name={'distance'}
                    style={{flex: 1, marginBottom: 0}}
                    writing={(text) => {this.writing('distance', text)}} 
                    placeholder={'Дистанция'}
                    onFocus={() => { this.onDistanceFocus() }}
                    onBlur={() => { this.onDistanceBlur() }}
                    withoutclear={true}
                    keyboardType={'numeric'}
                    value={this.state.temporary.usePretty ? '+ ' + this.state.search.distance + ' км' : this.state.search.distance + ''}
                  />
                </View>
              </View>
              <View style={[formsStyles.inputContainer]}>
                <View style={[baseStyles.verticalCenter, {flexDirection: 'row'}]}>
                  <Text style={[baseStyles.midText, {marginRight: 20}]}>
                    Цена
                  </Text>
                  <FormInput  
                    name={'price_min'}
                    style={{flex: 1, marginRight: 20, marginBottom: 0}}
                    writing={(text) => {this.writing('price_min', text)}} 
                    placeholder={'от'}
                    withoutclear={true}
                    keyboardType={'numeric'}
                    value={this.state.search.price_min}
                  />
                  <FormInput  
                    name={'price_max'}
                    style={{flex: 1, marginBottom: 0}}
                    writing={(text) => {this.writing('price_max', text)}} 
                    placeholder={'до'}
                    withoutclear={true}
                    keyboardType={'numeric'}
                    value={this.state.search.price_max}
                  />
                </View>
              </View>
              <View style={formsStyles.checkboxContainer_smmg}>
                <CheckBox 
                  onClick={()=>{
                    this.setState(Object.assign(this.state, {
                      search: {
                        ...this.state.search,
                        only_pro: !this.state.search.only_pro
                      }
                    }))}
                  }
                  checkedImage={
                    <Svg width={24} height={24}>
                      <Path
                        fill={Colors.COLOR_WHITE}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z"
                      />
                      <Path
                        fill={Colors.COLOR_DARK_GREEN}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z
                          M9.625,19.5L21.5,6.542l-2.291-2.083L9.417,15.75l-4.75-5.333l-1.792,2.004L9.625,19.5z"
                      />
                    </Svg>
                  }
                  unCheckedImage={
                    <Svg width={24} height={24}>
                      <Path
                        fill={Colors.COLOR_DARK_GREEN}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z"
                      />
                    </Svg>
                  }
                  rightTextStyle={formsStyles.checkboxText_dark}
                  isChecked={this.state.search.only_pro}
                  rightText={"Только для Pro"}
                />
              </View>
              <View style={formsStyles.checkboxContainer_smmg}>
                <CheckBox 
                  onClick={()=>{
                    this.setState(Object.assign(this.state, {
                      search: {
                        ...this.state.search,
                        only_business: !this.state.search.only_business
                      }
                    }))}
                  }
                  checkedImage={
                    <Svg width={24} height={24}>
                      <Path
                        fill={Colors.COLOR_WHITE}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z"
                      />
                      <Path
                        fill={Colors.COLOR_DARK_GREEN}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z
                          M9.625,19.5L21.5,6.542l-2.291-2.083L9.417,15.75l-4.75-5.333l-1.792,2.004L9.625,19.5z"
                      />
                    </Svg>
                  }
                  unCheckedImage={
                    <Svg width={24} height={24}>
                      <Path
                        fill={Colors.COLOR_DARK_GREEN}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z"
                      />
                    </Svg>
                  }
                  rightTextStyle={formsStyles.checkboxText_dark}
                  isChecked={this.state.search.only_business}
                  rightText={"Только для Business"}
                />
              </View>
              <View style={formsStyles.checkboxContainer_smmg}>
                <CheckBox 
                  onClick={()=>{
                    this.setState(Object.assign(this.state, {
                      search: {
                        ...this.state.search,
                        arhive: !this.state.search.arhive
                      }
                    }))}
                  }
                  checkedImage={
                    <Svg width={24} height={24}>
                      <Path
                        fill={Colors.COLOR_WHITE}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z"
                      />
                      <Path
                        fill={Colors.COLOR_DARK_GREEN}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z
                          M9.625,19.5L21.5,6.542l-2.291-2.083L9.417,15.75l-4.75-5.333l-1.792,2.004L9.625,19.5z"
                      />
                    </Svg>
                  }
                  unCheckedImage={
                    <Svg width={24} height={24}>
                      <Path
                        fill={Colors.COLOR_DARK_GREEN}
                        d="M24,20c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4V4c0-2.209,1.791-4,4-4h16c2.209,0,4,1.791,4,4V20z"
                      />
                    </Svg>
                  }
                  rightTextStyle={formsStyles.checkboxText_dark}
                  isChecked={this.state.search.arhive}
                  rightText={"Задачи в архиве"}
                />
              </View>
              <TouchableHighlight underlayColor="transparent" onPress={() => {this.filter()}}>
                <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                  <View>
                    <View style={[buttonsStyles.buttonBig]}>
                      <Text style={buttonsStyles.buttonBigText}>Показать результат</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableHighlight>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    );
  }

  // On user text typing
  writing(type, text){
    switch(type) {
      case 'title':
        this.setState(Object.assign(this.state, {
          search: {
            ...this.state.search,
            title: text
          }
        }));
      break;
      case 'address':
        this.setState(Object.assign(this.state, {
          search: {
            ...this.state.search,
            address: text
          }
        }));
      break;
      case 'price_max':
        this.setState(Object.assign(this.state, {
          search: {
            ...this.state.search,
            price_max: text
          }
        }));
      break;
      case 'price_min':
        this.setState(Object.assign(this.state, {
          search: {
            ...this.state.search,
            price_min: text
          }
        }));
      break;
      case 'distance':
        this.setState(Object.assign(this.state, {
          search: {
            ...this.state.search,
            distance: parseFloat(text)
          }
        }));
      break;
    }
  };
};



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToTasksCatalogPage: navigateToTasksCatalogPage,
      navigateBack: navigateBack,
      navigateToTags: (route) => navigateToTags(route),
      filterTasks: (options) => filterTasks(options),
      filterMyTasks: (options) => filterMyTasks(options),
      navigateToMyTasks: (tab) => navigateToMyTasks(tab),
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
)(TasksFilterPage);