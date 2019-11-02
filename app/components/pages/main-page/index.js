import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EventRegister } from 'react-native-event-listeners';

import StatusBlock from '../../blocks/status-block';
import statusColor from '../../helpers/statusColor.js';

import {
  navigateToDetail,
  navigateToFilter,
  navigateBack,
  getAllTasks,
  getAllSpectatorTasks,
  changeStatus
} from '../../../actions';

import Svg, {
    Path,
    Circle,
    Polygon,
    Defs,
    Stop,
    G,
    LinearGradient as LinearGradientSvg
} from 'react-native-svg';

import { SwipeListView } from 'react-native-swipe-list-view';

import styles from './styles';

import {
  Colors,
  Gradients
} from '../../styles/colors.js';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          selected: [],
          isFetching: false,
          loadingMore: false,
          loading: true,
        }
        this.rowSwipeAnimatedValues = {};
    }

    componentDidMount() {
      //if () TODO if status == admin => get task masters

      if (this.props.nav.routes[this.props.nav.index].params && this.props.nav.routes[this.props.nav.index].params.projectid) {
        this.setState({
          projectid: this.props.nav.routes[this.props.nav.index].params.projectid,
          loading: false
        }, () => {
          if (!this.props.user.isSpectator) {
            this.props.getAllTasks(this.props.user.sessionid, false, 0)
          } else {
            this.props.getAllSpectatorTasks(this.props.user.sessionid, {project_id: this.props.nav.routes[this.props.nav.index].params.projectid}, 0)
          }
        });
        //this.props.getImages(this.props.nav.routes[this.props.nav.index].params.task.id)
      }

      this.loadingRecieved = EventRegister.addEventListener('TASKS_LOADING_START', () => {
        //console.warn('TASKS_LOADING_START')
        this.setState({
          loading: true
        })
      })

      this.tasksRecieved = EventRegister.addEventListener('TASKS_RECIEVED', () => {
        //console.warn('TASKS_RECIEVED')
        this.setState({
          isFetching: false,
          loading: false
        })
      })

      this.tasksRecieved = EventRegister.addEventListener('TASKS_ADD_RECIEVED', () => {
        this.setState({
          loadingMore: false,
          loading: false
        })
      })
    }

    closeRow(rowMap, rowKey) {
  		if (rowMap[rowKey]) {
  			rowMap[rowKey].closeRow();
  		}
  	}

  	deleteRow(rowMap, rowKey) {
  		this.closeRow(rowMap, rowKey);
  		const newData = [...this.state.listViewData];
  		const prevIndex = this.state.listViewData.findIndex(item => item.key === rowKey);
  		newData.splice(prevIndex, 1);
  		this.setState({listViewData: newData});
  	}

  	deleteSectionRow(rowMap, rowKey) {
  		this.closeRow(rowMap, rowKey);
  		var [section, row] = rowKey.split('.');
  		const newData = [...this.state.sectionListData];
  		const prevIndex = this.state.sectionListData[section].data.findIndex(item => item.key === rowKey);
  		newData[section].data.splice(prevIndex, 1);
  		this.setState({sectionListData: newData});
  	}

  	onRowDidOpen = (rowKey, rowMap) => {
  		console.log('This row opened', rowKey);
      //console.warn('OPEN', rowKey)
  	}

  	onSwipeValueChange = (swipeData) => {
  		const { key, value } = swipeData;
  		this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  	}

    goToDetail(key) {
      this.props.navigateToDetail(key);
    }

    addToSelected(key) {
      if (this.state.selected.indexOf(key) < 0) {
        this.setState({
          selected: [
            ...this.state.selected,
            key
          ]
        })
      } else {
        this.setState({
          selected: this.state.selected.filter(item => { return item !== key})
        })
      }
    }

    renderCard(data, rowMap) {
      this.rowSwipeAnimatedValues[`${data.item.key}`] = new Animated.Value(0);
      const position= {
        transform: [
          {
            translateX: 75
          }
        ]
      };
      return (
        <TouchableHighlight
          onPress={ _ => this.goToDetail(data.item)}
          style={[styles.rowFront, this.state.openSelect ? position : {}]}
          underlayColor={'#AAA'}
        >

          <View style={[styles.card, this.state.selected.indexOf(data.item.key) >= 0 ? styles.selected : {}]}>
            <View style={{flexDirection: 'row'}}>
              {
                data.item.isVisited === 'false' ?
                  <View style={styles.redCircle}>
                  </View>
                : null
              }
              <View>
              </View>
              <Text style={[styles.title, data.item.isVisited === 'false' ? {fontWeight: 'bold'} : {}]}>{data.item.name}</Text>
            </View>
            <Text style={styles.number}>№ {data.item.id}</Text>
            <Text style={styles.city}>
              Город:&nbsp;
              <Text style={styles.citytext}>{this.props.towns.items.find(item => item.id === parseInt(data.item.town_id)).name}</Text>
            </Text>
            <Text style={styles.user}>
              Представитель:&nbsp;
              <Text style={styles.usertext}>
              {
                data.item.agent && data.item.agent.id ?
                  data.item.agent.last_name + ' ' + data.item.agent.first_name
                : 'Не назначен'}</Text>
            </Text>
            {
              this.props.statuses.items.find(item => parseInt(item.name) === parseInt(data.item.status)) !== undefined ?
              <StatusBlock
                text={this.props.statuses.items.find(item => parseInt(item.name) === parseInt(data.item.status)).value}
                color={statusColor(data.item.status)} />
              :
              null
            }
          </View>
        </TouchableHighlight>
      )
    }

    onRefresh() {
      this.setState({ isFetching: true }, function() {
        this.fetchData()
      });
    }

    fetchData() {
      if (!this.props.user.isSpectator) {
        this.props.getAllTasks(this.props.user.sessionid, this.props.tasks.filter, 0)
      } else {
        this.props.getAllSpectatorTasks(this.props.user.sessionid, {
          ...this.props.tasks.filter,
          project_id: this.props.nav.routes[this.props.nav.index].params.projectid
        }, 0)
      }
    }

    _handleLoadMore = () => {
      if (!this.state.loadingMore && parseInt(this.props.tasks.count) > this.props.tasks.items.length) {
        this.setState({
            loadingMore: true
          },
          () => {
            if (!this.props.user.isSpectator) {
              this.props.getAllTasks(this.props.user.sessionid, this.props.tasks.filter, this.props.tasks.items.length);
            } else {
              this.props.getAllSpectatorTasks(this.props.user.sessionid, {
                ...this.props.tasks.filter,
                project_id: this.props.nav.routes[this.props.nav.index].params.projectid
              }, this.props.tasks.items.length)
            }
          }
        );
      }
    };

    _listEmptyComponent = () => {
    return (
        <View>
            <Text style={styles.nullText}>
                Нет задач, согласно выбранным фильтрам
            </Text>
        </View>
      )
    }

    _renderFooter = () => {
      if (!this.state.loadingMore || parseInt(this.props.tasks.count) === this.props.tasks.items.length) return null;

      return (
        <View
          style={{
            position: 'relative',
            paddingVertical: 20,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    };

    render() {
      return (
        this.props.user.loaded ?
          <View style={styles.main}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.headButton} onPress={() => {
                  this.props.navigateBack()}
                }>
                <Svg height={20} width={20} viewBox="0 0 306 306">
                    <Polygon
                      fill={Colors.COLOR_WHITE}
                      points="247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306 "
                    />
                </Svg>
              </TouchableOpacity>
              <View style={styles.headContainer}>
                <Text style={styles.headTitle}>
                  Все задачи
                </Text>
              </View>
              <TouchableOpacity style={styles.headButton} onPress={() => {this.props.navigateToFilter()}}>
                <Svg width={22} height={22} viewBox="0 0 96.55 96.55">
                  <Path
                    fill={Colors.COLOR_WHITE}
                    d="M73.901,56.376h-26.76c-0.652,0-1.182,0.526-1.182,1.181v14.065c0,0.651,0.529,1.18,1.182,1.18h26.76
                    c0.654,0,1.184-0.526,1.184-1.18V57.555C75.084,56.902,74.555,56.376,73.901,56.376z"/>
                  <Path
                    fill={Colors.COLOR_WHITE}
                    d="M62.262,80.001H47.141c-0.652,0-1.182,0.528-1.182,1.183v14.063c0,0.653,0.529,1.182,1.182,1.182h15.122
                    c0.652,0,1.182-0.526,1.182-1.182V81.182C63.444,80.529,62.916,80.001,62.262,80.001z"/>
                  <Path
                    fill={Colors.COLOR_WHITE}
                    d="M84.122,28.251h-36.98c-0.652,0-1.182,0.527-1.182,1.18v14.063c0,0.652,0.529,1.182,1.182,1.182h36.98
                    c0.651,0,1.181-0.529,1.181-1.182V29.43C85.301,28.778,84.773,28.251,84.122,28.251z"/>
                  <Path
                    fill={Colors.COLOR_WHITE}
                    d="M94.338,0.122H47.141c-0.652,0-1.182,0.529-1.182,1.182v14.063c0,0.654,0.529,1.182,1.182,1.182h47.198
                    c0.652,0,1.181-0.527,1.181-1.182V1.303C95.519,0.651,94.992,0.122,94.338,0.122z"/>
                  <Path
                    fill={Colors.COLOR_WHITE}
                    d="M39.183,65.595h-8.011V2c0-1.105-0.896-2-2-2h-16.13c-1.104,0-2,0.895-2,2v63.595h-8.01c-0.771,0-1.472,0.443-1.804,1.138
                    C0.895,67.427,0.99,68.25,1.472,68.85l18.076,26.954c0.38,0.474,0.953,0.746,1.559,0.746s1.178-0.272,1.558-0.746L40.741,68.85
                    c0.482-0.601,0.578-1.423,0.245-2.117C40.654,66.039,39.954,65.595,39.183,65.595z"/>
                </Svg>
              </TouchableOpacity>
            </View>
            <View style={styles.swipeList}>
            {
              this.state.loading && !this.state.isFetching && this.state.loadingMore || !this.props.tasks.loaded ?
                <View style={{padding: 40}}>
                  <ActivityIndicator />
                </View>
                :
                <SwipeListView
    						data={this.props.tasks.items.filter(item => parseInt(item.project_id) === parseInt(this.state.projectid))}
                closeOnRowOpen={false}
                ref={ref => this.swipelist}
    						renderItem={(data, rowItem) => this.renderCard(data, rowItem)}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
                onEndReached={this._handleLoadMore}
                onEndReachedThreshold={0.2}
                ListEmptyComponent={this._listEmptyComponent}
                disableRightSwipe={true}
                disableLeftSwipe={!this.props.user.isAdmin}
                ListFooterComponent={this._renderFooter}
    						renderHiddenItem={ (data, rowMap) => (
                  <View style={styles.rowBack}>
    								<TouchableOpacity
                      disabled={!this.state.openSelect}
                      style={[styles.backRightBtn, styles.backRightBtnLeft, this.state.openSelect ? {zIndex:99}: {}]}
                      onPress={ _ => this.addToSelected(data.item.key) }>
                      <View style={styles.markBtn}>
      									{
                          this.state.selected.indexOf(data.item.key) >= 0 ?
                          <Svg width={24} height={24} viewBox="0 0 44 44">
                            <Path fill={Colors.COLOR_DARK_RED} d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,15.1l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.6-0.1-0.7-0.3l-7.8-8.4-.2-.2c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.3 0.4,0.9 0,1.3z"/>
                          </Svg>
                          :
                          <View style={styles.round}>
                          </View>
                        }
                      </View>
    								</TouchableOpacity>
    								<TouchableOpacity
                      style={[styles.backRightBtn, styles.backRightBtnRight]}
                      onPress={ _ => this.props.changeStatus(this.props.user.sessionid, data.item.id, 0)/*this.deleteSectionRow(rowMap, data.item.key) */}>
                      <View style={styles.removeBtn}>
                        <Svg width={24} height={24} viewBox="0 0 408.483 408.483">
                          <Path
                            fill={Colors.COLOR_RED}
                            d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316
                            H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293
                            c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329
                            c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355
                            c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356
                            c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"/>
                          <Path
                            fill={Colors.COLOR_RED}
                            d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916
                            c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"/>
                        </Svg>
                        <Text style={styles.backTextWhite}>Удалить</Text>
                      </View>
    								</TouchableOpacity>
    							</View>
    						)}
    						leftOpenValue={75}
    						rightOpenValue={-75}
    						previewRowKey={'0'}
    						previewOpenValue={-40}
    						previewOpenDelay={3000}
    						onRowDidOpen={this.onRowDidOpen}
    						onSwipeValueChange={this.onSwipeValueChange}
    					/>
            }

              </View>
          </View>
          :
          <View>
            <ActivityIndicator />
          </View>
      );
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateToDetail: (task) => navigateToDetail(task),
      navigateToFilter: navigateToFilter,
      getAllTasks: (sessionid, filter, offset) => getAllTasks(sessionid, filter, offset),
      getAllSpectatorTasks: (sessionid, filter, offset) => getAllSpectatorTasks(sessionid, filter, offset),
      changeStatus: (sessionid, id, status) => changeStatus(sessionid, id, status),
      navigateBack: navigateBack
    }, dispatch);
}

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      tasks: state.tasks,
      statuses: state.statuses,
      towns: state.towns
    }
  }, mapDispatchToProps
)(MainPage);
