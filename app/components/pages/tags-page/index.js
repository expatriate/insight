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
import PageHeader from '../../blocks/page-header';
import FormInput from '../../forms/form-input';
import TagsInput from '../../forms/tags-input';
import DropdownAlert from 'react-native-dropdownalert';

import LinearGradient from 'react-native-linear-gradient';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import { EventRegister } from 'react-native-event-listeners';

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
  saveUserTags, 
  navigateToProfile,
  navigateBack,
  applyTagsToFilter,
  applyMyTagsToFilter,
  applyMyTeamTagsToFilter,
  applyPerformersCatalogTagsToFilter,
} from '../../../actions';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class TagsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      search: '',
      tags: [],
      usertags: [],
      results: [],

      taskFilter: false,
      teamFilter: false,
      userTags: true,
    }

    this.writing = this.writing.bind(this);
    this.removeFromTags = this.removeFromTags.bind(this);
    this.addToTags = this.addToTags.bind(this);
    this.setDefaultData = this.setDefaultData.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    let options = this.props.app.tags[0];
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

    let route = this.props.nav.routes[this.props.nav.index];
    if (route.params.from) {
      if (route.params.from == 'TasksFilter' && route.params.params.mytasks) {
        this.setState({
          myTaskFilter: true,
          taskFilter: false,
          teamFilter: false,
          userTags: false,
          performersFilter: false,
          tags: tree,
          usertags: this.props.user.search.tags || []
        });
      } else if (route.params.from == 'MyteamFilter') {
        this.setState({
          taskFilter: false,
          userTags: false,
          teamFilter: true,
          myTaskFilter: false,
          performersFilter: false,
          tags: tree,
          usertags: this.props.team.search.tags || []
        });
      } else if (route.params.from == 'PerformersCatalogFilter') {
         this.setState({
          taskFilter: false,
          userTags: false,
          teamFilter: false,
          myTaskFilter: false,
          performersFilter: true,
          tags: tree,
          usertags: this.props.performers.search.tags || []
        });
      } else {
        this.setState({
          taskFilter: true,
          userTags: false,
          teamFilter: false,
          myTaskFilter: false,
          performersFilter: false,
          tags: tree,
          usertags: this.props.tasks.search.tags || []
        });
      }
    } else {
      this.setState({
        tags: tree,
        usertags: this.props.user.usertags || []
      });
    }

    this.successFormListener = EventRegister.addEventListener('USER_TAGS_DATA_SAVED', () => {
      this.messages.alertWithType('success', 'Теги', 'Данные успешно сохранены');
    });
  };

  isTagActive(tagid) {
    let tags = this.state.usertags;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].id == parseInt(tagid)) {
        return true
      }
    }
    return false
  }

  removeFromTags(item) {
    let tags = this.state.usertags;
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
      usertags: [
      ...tags
      ]
    });
  }

  addToTags(item) {

    if (this.state.userTags && this.props.app.appplan.max_tags <= this.state.usertags.length) {
      return false
    }

    this.setState({
      usertags: [
        ...this.state.usertags,
        item
      ]
    });
  }

  setDefaultData() {
    let usertags = [];
    if (this.state.userTags) {
      this.props.user.usertags.map((item, index) => {
        usertags.push(item);
      });
    }
    if (this.state.taskFilter){
      usertags = this.props.tasks.search.tags;
    }
    if (this.state.myTaskFilter){
      usertags = this.props.user.search.tags;
    }
    if (this.state.teamFilter) {
      usertags = this.props.team.search.tags;
    }
    if (this.state.performersFilter) {
      usertags = this.props.performers.search.tags;
    }
    this.setState({
      usertags: usertags,
      search: '',
      results: [],
    });
    this.props.navigateToProfile()
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.successFormListener);
  };

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

  saveChanges() {
    let oldTags = [];

    if (this.state.userTags) {
      this.props.user.usertags.map((item, index) => {
        oldTags.push(item.id);
      });

      this.props.saveUserTags(this.state.usertags, oldTags, this.props.user.data.id);
      this.props.navigateToProfile();

    }
    if (this.state.taskFilter) {
      this.props.applyTagsToFilter(this.state.usertags);
      this.props.navigateBack();
    }

    if (this.state.myTaskFilter) {
      this.props.applyMyTagsToFilter(this.state.usertags);
      this.props.navigateBack();
    }

    if (this.state.teamFilter) {
      this.props.applyMyTeamTagsToFilter(this.state.usertags);
      this.props.navigateBack();
    }

    if (this.state.performersFilter) {
      this.props.applyPerformersCatalogTagsToFilter(this.state.usertags);
      this.props.navigateBack();
    }

  }

  render() {

    //let dataArr = this.state.userTags ? this.props.user.usertags : this.props.tasks.search.tags

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
          <LinearGradient key={'tagskill'+index} colors={[Colors.COLOR_BLACK_08, Colors.COLOR_BLACK_08]} style={[baseStyles.row, baseStyles.verticalCenter, styles.tag_sub, styles.type_sub_active]}>
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

    return (
      <View style={[baseStyles.container, styles.profileContainer]}>
        <ScrollView>
          <PageHeader title={'Выбор специализации (теги)'} back={true} onBack={() => {this.props.navigateBack()}}/>
          <View style={[styles.block_light, styles.block_search]}>
            <TagsInput
              withoutclear={true}
              tags={this.state.usertags}
              name='tag'
              writing={(text) => {this.search(text)}}
              placeholder='Начните вводить название услуги...'
              placeholderTextColor={Colors.COLOR_LIGHTDARK_GRAY}
              type="none"
              value={this.state.search}
              search={true}
              removeFromTags={this.removeFromTags}
              maxTags={this.props.app.appplan.max_tags}
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
            <View>
              </View>
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
          <View style={{flex: 3}}>
            <TouchableHighlight underlayColor="transparent" onPress={() => this.saveChanges()}>
              <View style={[baseStyles.verticalCenter, baseStyles.horizontalCenter, {flexDirection: 'row'}]}>
                <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 10}}>
                  <Path
                    fill={Colors.COLOR_LIGHT_BLUE}
                    d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M10,17 L5,12 L6.41,10.59 L10,14.17 L17.59,6.58 L19,8 L10,17 L10,17 Z"
                  />
                </Svg>
                <Text style={[buttonsStyles.buttonMiddleText, buttonsStyles.buttonMiddleText_blue]}>Сохранить изменения</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{flex: 2, borderLeftWidth: 1, borderColor: Colors.COLOR_LIGHT_GRAY, paddingTop: 5, paddingBottom: 5}}>
            <TouchableHighlight underlayColor="transparent" onPress={() => this.setDefaultData()}>
              <Text style={[buttonsStyles.buttonMiddleText, buttonsStyles.buttonMiddleText_grey]}>Отменить</Text>
            </TouchableHighlight>
          </View>
        </View>
        <DropdownAlert
          closeInterval={5000}
          messageNumOfLines={10}
          titleStyle={baseStyles.alertTitle}
          messageStyle={baseStyles.messageAlertStyle}
          defaultTextContainer={baseStyles.defaultAlertTextContainer}
          imageStyle={baseStyles.imageAlertStyle}
          ref={ref => this.messages = ref} />
      </View>
    );
  }

  // On user text typing
  writing(type, text){
    switch(type) {
      case 'search':
        this.setState({
          search: text
        });
      break;
    }
  };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToProfile: navigateToProfile,
      navigateBack: (route) => navigateBack(route),
      saveUserTags: (newtags, oldtags, userid) => saveUserTags(newtags, oldtags, userid),
      applyTagsToFilter: (tags) => applyTagsToFilter(tags),
      applyMyTagsToFilter: (tags) => applyMyTagsToFilter(tags),
      applyMyTeamTagsToFilter: (tags) => applyMyTeamTagsToFilter(tags),
      applyPerformersCatalogTagsToFilter: (tags) => applyPerformersCatalogTagsToFilter(tags),
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      tasks: state.tasks,
      team: state.team,
      nav: state.nav,
      performers: state.performers
    }
  }, mapDispatchToProps
)(TagsPage);