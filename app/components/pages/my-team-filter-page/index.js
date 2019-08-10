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


import Svg, {
    Path,
    Polygon,
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateBack,
  filterTeam,
  navigateToMyTeam,
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

class MyteamFilterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {

      temporary: {
        usePretty: true
      },

      search: {
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
        tags: this.props.team.search.tags ? this.props.team.search.tags : [],
        title: this.props.team.search.title ? this.props.team.search.title : undefined,
        only_pro: this.props.team.search.only_pro ? true : false,
        only_business: this.props.team.search.only_business ? true : false,
      },
    })

    /*this.filterAppliedListener = EventRegister.addEventListener('FILTER_APPLIED', (data) => {
      this.props.navigateToTasksCatalogPage();
    });
  */
    this.myteamFilterAppliedListener = EventRegister.addEventListener('TEAM_FILTER_APPLIED', (data) => {
      this.props.navigateToMyTeam();
      EventRegister.emit('OPEN_FILTER_TEAM');
    });

    this.filterTagsAppliedListener = EventRegister.addEventListener('TEAM_FILTER_TAGS_APPLIED', (data) => {
      this.setState({
        search: {
          ...this.state.search,
          tags: data,
        }
      })
    });
  };

  componentWillUnmount() {
    /*EventRegister.removeEventListener(this.filterAppliedListener); */
    EventRegister.removeEventListener(this.myteamFilterAppliedListener);

    EventRegister.removeEventListener(this.filterTagsAppliedListener);
  };

  filter() {
    this.props.filterTeam(this.state.search)
  }

  render() {

    let tags = !this.state.mytasks && this.props.team.search.tags ? this.props.team.search.tags.map((item, index) => {
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
              title={'Фильтр'} 
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
                        this.props.team.search.tags.length ?
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
      filterTeam: (options) => filterTeam(options),
      navigateToMyTeam: navigateToMyTeam,
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      team: state.team
    }
  }, mapDispatchToProps
)(MyteamFilterPage);