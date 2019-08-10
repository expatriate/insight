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
import PageHeader from '../../blocks/page-header';
import FormInput from '../../forms/form-input';
import CheckBox from 'react-native-check-box';
import LinearGradient from 'react-native-linear-gradient';
import Geocoder from 'react-native-geocoding-simple';
import KladrInput from '../../forms/kladr-input';


import Svg, {
    Path,
    Polygon,
    Rect
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateBack,
  filterPerformers,
  navigateToPerformersCatalog,
  navigateToTags,
  getGeolocation
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

class PerformersCatalogFilterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {


      search: {
        address: undefined,
        enableAddress: true,
        tags: [],
        name: undefined,
        only_pro: false,
        only_business: false,
      },
    }

    this.filter = this.filter.bind(this);
  }

  componentDidMount() {

    this.setState({
      search: {
        tags: this.props.performers.search.tags ? this.props.performers.search.tags : [],
        title: this.props.performers.search.fio ? this.props.performers.search.fio : undefined,
        only_pro: this.props.performers.search.only_pro ? true : false,
        only_business: this.props.performers.search.only_business ? true : false,
        enableAddress: this.props.performers.search.enableAddress,
        lat: this.props.performers.search.lat,
        lng: this.props.performers.search.lng,
        address: this.props.performers.search.address,
      },
    })

    /*this.filterAppliedListener = EventRegister.addEventListener('FILTER_APPLIED', (data) => {
      this.props.navigateToTasksCatalogPage();
    });
  */
    this.myteamFilterAppliedListener = EventRegister.addEventListener('PERFORMED_FILTER_APPLIED', (data) => {
      this.props.navigateToPerformersCatalog();
      EventRegister.emit('OPEN_FILTER_PERFORMED');
    });

    this.filterTagsAppliedListener = EventRegister.addEventListener('PERFORMERS_CATALOG_FILTER_TAGS_APPLIED', (data) => {
      this.setState({
        search: {
          ...this.state.search,
          tags: data,
        }
      })
    });
    this.geolocationListener = EventRegister.addEventListener('APP_GEOLOCATION_RECIEVED', (data) => {
      if (data.coords) {
        Geocoder.from({
          lat : data.coords.latitude,
          lng : data.coords.longitude,
          language: 'ru',
        }).then(json => {
            this.setState({
              search: {
                ...this.state.search,
                address: json.results[0] ? json.results[0].formatted_address : '',
                lat: data.coords.latitude,
                lng: data.coords.longitude
              },
            });
          })
          .catch(error => console.warn(error));
      }
    });
  };

  componentWillUnmount() {
    /*EventRegister.removeEventListener(this.filterAppliedListener); */
    EventRegister.removeEventListener(this.myteamFilterAppliedListener);
    EventRegister.removeEventListener(this.filterTagsAppliedListener);
    EventRegister.removeEventListener(this.geolocationListener);
  };

  filter() {
    this.props.filterPerformers(this.state.search)
  }

  // KLADR
  kladr(type, text, geocode) {
    this.setState(Object.assign(this.state, {
      kladr: {
        ...this.state.kladr,
        address: text
      },
      search: {
        address: text,
      }
    }));

    if (geocode) {
      Geocoder.from(this.state.address)
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

  getLocation() {
    this.props.getGeolocation();
  }

  render() {

    let tags = !this.state.mytasks && this.props.performers.search.tags ? this.props.performers.search.tags.map((item, index) => {
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
              title={'Фильтр исполнителей'} 
              back={true}

              onBack={this.props.navigateBack}
              />
            <View style={[styles.wrapper]}>
              <FormInput  
                name={'name'} 
                writing={(text) => {this.writing('name', text)}} 
                placeholder={'Имя'} 
                search={true}
                withoutclear={true}
                value={this.state.search.name}
              />
              <View style={[formsStyles.inputContainer]}>
                <TouchableHighlight 
                  underlayColor="transparent" 
                  onPress={() => 
                    this.props.navigateToTags(this.props.nav.routes[this.props.nav.index])
                  }>
                  <View style={styles.tagsContainer}>
                    <View style={styles.tags}>
                      {
                        this.props.performers.search.tags.length ?
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
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom:12}}>
                <View style={[formsStyles.checkboxContainer__normal, {marginRight: 20}]}>
                  <CheckBox 
                    onClick={()=>{
                      this.setState({
                        search: {
                          ...this.state.search,
                          enableAddress: !this.state.search.enableAddress
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
                    isChecked={this.state.search.enableAddress}
                  />
                </View>
                <KladrInput 
                  multiline={true} 
                  //noteditable={!this.state.task.enableAddress ? true : false}
                  noteditable={true}
                  value={this.state.search.address} 
                  style={[{marginBottom:0, flex: 1}, !this.state.search.enableAddress ? baseStyles.disabled : undefined]} 
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
      case 'name':
        this.setState(Object.assign(this.state, {
          search: {
            ...this.state.search,
            name: text
          }
        }));
      break;
    }
  };
};



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateBack: navigateBack,
      navigateToTags: (route) => navigateToTags(route),
      filterPerformers: (options) => filterPerformers(options),
      navigateToPerformersCatalog: navigateToPerformersCatalog,
      getGeolocation: getGeolocation,
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      performers: state.performers
    }
  }, mapDispatchToProps
)(PerformersCatalogFilterPage);