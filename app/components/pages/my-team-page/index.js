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
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    Picker,
    TextInput,
    FlatList,
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import PageHeader from '../../blocks/page-header';
import ImageViewer from '../../blocks/image-viewer';
import TaskCard from '../../blocks/task-card';
import UserProfile from '../../blocks/user-profile';

import LinearGradient from 'react-native-linear-gradient';
import DropdownAlert from 'react-native-dropdownalert';

import CreateGroupModal from '../../modals/create-group-modal';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

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
  navigateToMyTeam,
  navigateToMyTeamFilterPage,
  getTeamData
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

class MyTeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      mode: 'contacts',
      initialTab: 0,
      modalCreateGroupDisplay: false,

      slideAnimation: new Animated.Value(22),      
      dataloaded: true,
      filterDirty: false
    }
  }

  componentDidMount() {

    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });

    this.myteamFilterAppliedListener = EventRegister.addEventListener('OPEN_FILTER_TEAM', (data) => {
      this.setState({
        mode: 'filter',
        filterDirty: true,
      })

      setTimeout(() => {
        this.mainTabs.scrollToEnd({animated: true});
      }, 300)
    });
    
  };

  componentWillUnmount() {
    this.setState({
      isOpen: false 
    });
    EventRegister.removeEventListener(this.leftMenu);
    EventRegister.removeEventListener(this.myteamFilterAppliedListener);
  };

  _getContactsData() {
    var groups = [];
    groups.push({
      title: 'Все',
      items: this.props.team.contacts.users,
      id: 0
    });
    
    this.props.team.groups.filter((item) => {
      groups.push({
        title: item.title,
        items: [],
        id: item.id
      })
    });

    this.props.team.contacts.users.filter((item, index) => {
      if (item.group != undefined && item.group.id != undefined) {
        for(var i = 0; i < groups.length; i++) {
          if (item.group.id == groups[i].id) {
            groups[i].items.push(item)
          }
        }
      }
    })

    return groups
  }

  _getRequestsData() {
    var data = [];
    data = this.props.team.query.users;
    return data;
  }

  _getRecomendationsData() {
    var data = [];
    data = this.props.team.recomendations.users;
    var addData = this.props.team.recomendations_performers.users
    /*data = [
      ...data,
      this.props.team.recomendations_performers.users
    ]*/
    return data;
  }

  _getFiltered() {
    var data = [];
    this.props.team.myteamfiltered.filter((item) => {
      data.push(item.user)
    });

    return data;
  }

  setModalVisible(visible) {
    this.setState({modalCreateGroupDisplay: visible});
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

    //var allData = this.props.team.contacts.users;
    var groups = this._getContactsData();
    
    var requests = this._getRequestsData();

    var recomendations = this._getRecomendationsData();

    var filtered = this._getFiltered();

    const filteredTabs = 
      <View style={{marginTop:20}}>
{/*      <Text>
        { JSON.stringify(filtered, 0 , 2)}
      </Text>*/}
        <FlatList
          initialNumToRender={5}
          data={filtered}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={function(item, index) {
            return index + '_filter'
          }}
          ListEmptyComponent={function() {
            return(
              <View style={styles.nullDatacontainer}>
                <Text style={styles.nullDatacontainer_text}>
                  В данной группе пока нет пользователей
                </Text>
            </View>)
          }.bind(this)}
          renderItem={function({item, separators}) {
            return(
            <UserProfile data={item} style={styles.userBlock}/>
          )}.bind(this)}
        />
      </View>

    const recomendationsTabs =
      <View style={{marginTop:20}}>
      <FlatList
        initialNumToRender={5}
        data={recomendations}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={function(item, index) {
          return index + '_recomendations'
        }}
        ListEmptyComponent={function() {
          return(
            <View style={styles.nullDatacontainer}>
              <Text style={styles.nullDatacontainer_text}>
                В данной группе пока нет пользователей
              </Text>
          </View>)
        }.bind(this)}
        renderItem={function({item, separators}) {
          return(
          <UserProfile data={item} style={styles.userBlock}/>
        )}.bind(this)}
      />
      </View>

    const requestsTabs =
      <View style={{marginTop:20}}> 
      <FlatList
        initialNumToRender={5}
        data={requests}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={function(item, index) {
          return index + '_requests'
        }}
        ListEmptyComponent={function() {
          return(
            <View style={styles.nullDatacontainer}>
              <Text style={styles.nullDatacontainer_text}>
                В данной группе пока нет пользователей
              </Text>
          </View>)
        }.bind(this)}
        renderItem={function({item, separators}) {
          return(
          <UserProfile 
            data={item} 
            style={styles.userBlock} 
            maxInfo={true}
            approve={true}/>
        )}.bind(this)}
      />
      </View>

    const contactTabs = 
      <ScrollableTabView
        keyboardShouldPersistTaps={'handled'}
        initialPage={this.state.initialTab}
        renderTabBar={() => 
        <ScrollableTabBar
            style={{paddingTop: 10, paddingBottom: 0, height: 50, backgroundColor: Colors.COLOR_WHITE}}
            underlineStyle={{height: 0}}
            renderTab = {
                function (name, page, isTabActive, onPressHandler, onLayoutHandler) {
                  return(<TouchableHighlight
                    key={`${name}_${page}`}
                    underlayColor="transparent"
                    onPress={() => onPressHandler(page)}
                    onLayout={onLayoutHandler}
                    >
                    <View style={[isTabActive ? styles.tabHeadb_active : styles.tabHeadb]}>
                      <Text style={[styles.tabHead, isTabActive ? styles.tabHead_active : '']}>
                        { name }
                      </Text>
                      <Text style={[isTabActive ? styles.tabHeadc_active : styles.tabHeadc]}>
                      </Text>
                    </View>
                  </TouchableHighlight>)
                }.bind(this)
              }
            /> 
          }>
          {
            groups.map((item, index) => {
              return (
                <View key={'contact_tab_' + index} tabLabel={item.title} style={[styles.tasksContainer, {flex: 1}]}>
                  <TouchableHighlight underlayColor="transparent" onPress={() => {this.setModalVisible(!this.state.modalReviewDisplay);}}>
                    <Text style={styles.editGroup}>
                      Добавить группу
                    </Text>
                  </TouchableHighlight>
                  <FlatList
                    initialNumToRender={5}
                    data={item.items}
                    keyboardShouldPersistTaps={'handled'}
                    keyExtractor={function(item, index) {
                      return index + '_contacts'
                    }}
                    ListEmptyComponent={function() {
                      return(
                        <View style={styles.nullDatacontainer}>
                          <Text style={styles.nullDatacontainer_text}>
                            В данной группе пока нет пользователей
                          </Text>
                      </View>)
                    }.bind(this)}
                    renderItem={function({item, separators}) {
                      return(
                      <UserProfile data={item.user} style={styles.userBlock} group={item.group} selectGroup={true} displayInfo={false}/>
                    )}.bind(this)}
                  />
                </View>
                )
            })
          }
      </ScrollableTabView>

    return (
      <View style={{flex: 1}}>
        {
          this.props.team.loaded ? 
          <SideMenu
            menu={menu}
            bounceBackOnOverdraw={false}
            isOpen={this.state.isOpen}
            animationFunction={animationFunction}
            onChange={isOpen => this.updateMenuState(isOpen)}
            openMenuOffset={Dimensions.get('window').width * (6 / 7)}
          >
            <View style={[styles.profileContainer, {flex: 1}]}>
              <PageHeader 
                title={'Моя команда'}
                search={true} 
                onSearch={this.props.navigateToMyTeamFilterPage}
                menu={true}
                />
                <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'flex-start'}} style={{ flex: 1}}>
                  <View style={[styles.top_wrapper_btns, {flexDirection: 'row'}]}>
                    <ScrollView 
                    horizontal={true} 
                    keyboardShouldPersistTaps='handled' 
                    showsHorizontalScrollIndicator={false}
                    ref={ref => (this.mainTabs = ref)}>
                      <TouchableOpacity
                        underlayColor="transparent"
                        style={this.state.mode == 'contacts' ? styles.tabHeadW_active : styles.tabHeadW}
                        onPress={() => this.changeTab('contacts')}>
                        <View>
                          <Text style={this.state.mode == 'contacts' ? styles.tabHeadH_active : styles.tabHeadH}>
                            Контакты
                          </Text>
                          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Svg width={24} height={24} viewBox="0 0 24 24">
                              <Path
                                fill={Colors.COLOR_GRAY_ICONS}  
                                d="M0.75,3.25v17.5c0,1.375,1.112,2.5,2.5,2.5h17.5c1.375,0,2.5-1.125,2.5-2.5V3.25
                                  c0-1.375-1.125-2.5-2.5-2.5H3.25C1.862,0.75,0.75,1.875,0.75,3.25L0.75,3.25z M15.75,8.25c0,2.075-1.675,3.75-3.75,3.75
                                  s-3.75-1.675-3.75-3.75S9.925,4.5,12,4.5S15.75,6.175,15.75,8.25L15.75,8.25z M4.5,18.25c0-2.5,5-3.875,7.5-3.875
                                  s7.5,1.375,7.5,3.875v1.25h-15V18.25L4.5,18.25z"
                              />
                            </Svg>
                            <Text style={[styles.counterStyle, this.state.mode != 'contacts' ? {color: Colors.COLOR_WHITE} : undefined]}>
                             { this.props.team.contacts.users.length }
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        underlayColor="transparent"
                        style={this.state.mode == 'requests' ? styles.tabHeadW_active : styles.tabHeadW}
                        onPress={() => this.changeTab('requests')}>
                        <View style={{justifyContent: 'center', alignItems:'center'}}>
                          <Text style={this.state.mode == 'requests' ? styles.tabHeadH_active : styles.tabHeadH}>
                            Запросы
                          </Text>
                          <Text style={[styles.counterStyle, styles.counterStyle_red, {color: Colors.COLOR_WHITE}]}>
                           { this.props.team.query.users.length }
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        underlayColor="transparent"
                        style={this.state.mode == 'recomendations' ? styles.tabHeadW_active : styles.tabHeadW}
                        onPress={() => this.changeTab('recomendations')}>
                        <View>
                          <Text style={this.state.mode == 'recomendations' ? styles.tabHeadH_active : styles.tabHeadH}>
                            Рекомендуем
                          </Text>
                          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Svg width={24} height={24} viewBox="0 0 24 24">
                              <Path
                                fill={Colors.COLOR_GRAY_ICONS}  
                                d="M0.75,3.25v17.5c0,1.375,1.112,2.5,2.5,2.5h17.5c1.375,0,2.5-1.125,2.5-2.5V3.25
                                  c0-1.375-1.125-2.5-2.5-2.5H3.25C1.862,0.75,0.75,1.875,0.75,3.25L0.75,3.25z M15.75,8.25c0,2.075-1.675,3.75-3.75,3.75
                                  s-3.75-1.675-3.75-3.75S9.925,4.5,12,4.5S15.75,6.175,15.75,8.25L15.75,8.25z M4.5,18.25c0-2.5,5-3.875,7.5-3.875
                                  s7.5,1.375,7.5,3.875v1.25h-15V18.25L4.5,18.25z"
                              />
                            </Svg>
                            <Text style={[styles.counterStyle, this.state.mode != 'recomendations' ? {color: Colors.COLOR_WHITE} : undefined]}>
                             { this.props.team.recomendations.users.length + this.props.team.recomendations_performers.users.length }
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {
                        this.props.team.myteamfiltered.length ? 
                          <TouchableOpacity
                            underlayColor="transparent"
                            style={this.state.mode == 'filter' ? styles.tabHeadW_active : styles.tabHeadW}
                            onPress={() => this.changeTab('filter')}>
                            <View>
                              <Text style={this.state.mode == 'filter' ? styles.tabHeadH_active : styles.tabHeadH}>
                                Фильтр
                              </Text>
                              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Svg width={24} height={24} viewBox="0 0 24 24">
                                  <Path
                                    fill={Colors.COLOR_GRAY_ICONS}  
                                    d="M0.75,3.25v17.5c0,1.375,1.112,2.5,2.5,2.5h17.5c1.375,0,2.5-1.125,2.5-2.5V3.25
                                      c0-1.375-1.125-2.5-2.5-2.5H3.25C1.862,0.75,0.75,1.875,0.75,3.25L0.75,3.25z M15.75,8.25c0,2.075-1.675,3.75-3.75,3.75
                                      s-3.75-1.675-3.75-3.75S9.925,4.5,12,4.5S15.75,6.175,15.75,8.25L15.75,8.25z M4.5,18.25c0-2.5,5-3.875,7.5-3.875
                                      s7.5,1.375,7.5,3.875v1.25h-15V18.25L4.5,18.25z"
                                  />
                                </Svg>
                                <Text style={[styles.counterStyle, this.state.mode != 'filter' ? {color: Colors.COLOR_WHITE} : undefined]}>
                                 { this.props.team.myteamfiltered.length }
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        : undefined
                      }
                    </ScrollView>
                  </View>
                  <View style={{flex: 1}}>
                    
                  { this.state.mode === 'contacts' ? 
                    contactTabs
                     : 
                    this.state.mode === 'requests' ? 
                    requestsTabs 
                     :
                    this.state.mode === 'recomendations' ? 
                    recomendationsTabs
                     :
                    this.state.mode === 'filter' && this.state.filterDirty ? 
                    filteredTabs
                     : undefined
                  }
                  </View>
                </ScrollView>
            </View>
            <DropdownAlert
              closeInterval={5000}
              messageNumOfLines={10}
              titleStyle={baseStyles.alertTitle}
              messageStyle={baseStyles.messageAlertStyle}
              defaultTextContainer={baseStyles.defaultAlertTextContainer}
              imageStyle={baseStyles.imageAlertStyle}
              ref={ref => this.messages = ref} />
          </SideMenu>
          : 
          <LinearGradient style={baseStyles.contentAtCenter} colors={['#31a3b7', '#3dccc6']}>
            <ActivityIndicator />
          </LinearGradient>
        }
        <CreateGroupModal 
          visible={this.state.modalCreateGroupDisplay}
          close={() => {this.setModalVisible(!this.state.modalCreateGroupDisplay);}}
        />
        <NavigationEvents
          onWillFocus={() => this._onPageFocus()}
        />
      </View>
    );
  }

  changeTab(mode) {
    this.setState({
      mode: mode
    });
  }

  _onPageFocus() {
    this.setState({
      isOpen: false,
    });
    if (this.props.team.first_load) {
      this.props.getTeamData(this.props.user.data.id);
    }
  }

  updateMenuState(isOpen) {
    this.setState({
      isOpen
    });
  }
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateBack: navigateBack,
      getTeamData: (userid) => getTeamData(userid),
      navigateToMyTeamFilterPage: navigateToMyTeamFilterPage
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      team: state.team,
    }
  }, mapDispatchToProps
)(MyTeamPage);