import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator,
    FlatList
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EventRegister } from 'react-native-event-listeners';

import StatusBlock from '../../blocks/status-block';
import statusColor from '../../helpers/statusColor.js';

import {
  navigateToMainPage,
  navigateBack,
  getUserProjects,
  getAllProjects,
  getAllSpectatorProjects,
  setProject
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

class ProjectsPage extends Component {
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

      if (this.props.nav.routes[this.props.nav.index].params && this.props.nav.routes[this.props.nav.index].params.companyid) {

        if (!this.props.user.isSpectator) {
        //if (this.props.nav.routes[this.props.nav.index].params.companyid !== 'SPECTATOR') {
          this.setState({
            companyid: this.props.nav.routes[this.props.nav.index].params.companyid,
            loading: true
          }, () => {
            if (this.props.user.isAdmin) {
              this.props.getAllProjects(this.state.companyid, true)
            } else {
              this.props.getUserProjects(this.props.user.sessionid, this.state.companyid, true)
            }
          });
        } else {
          this.setState({
            companyid: this.props.nav.routes[this.props.nav.index].params.companyid,
            loading: true
          }, () => {
            this.props.getAllSpectatorProjects(this.props.user.sessionid, true)
          });
        }
      }

      this.loadingRecieved = EventRegister.addEventListener('PROJECTS_LOADING_START', () => {
        //console.warn('PROJECTS_LOADING_START')
        this.setState({
          loading: true
        })
      })

      this.projectsRecieved = EventRegister.addEventListener('PROJECTS_RECIEVED', () => {
        //console.warn('PROJECTS_RECIEVED')
        this.setState({
          isFetching: false,
          loading: false
        })
      })
    }

    componentWillUnmount() {
      EventRegister.removeEventListener(this.loadingRecieved);
      EventRegister.removeEventListener(this.projectsRecieved);
    };


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
  		//console.log('This row opened', rowKey);
      //console.warn('OPEN', rowKey)
  	}

  	onSwipeValueChange = (swipeData) => {
  		const { key, value } = swipeData;
  		this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  	}

    goToMain(projectid) {
      this.props.setProject(projectid);
      this.props.navigateToMainPage(projectid);
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
      let status = this.props.statuses.project_items.find(item => parseInt(item.name) === parseInt(data.item.status));
      return (
        <TouchableHighlight
          onPress={ _ => this.goToMain(data.item.id)}////console.warn('You touched me') }
          style={[styles.rowFront, this.state.openSelect ? position : {}]}
          underlayColor={'#AAA'}
        >

          <View style={[styles.card, this.state.selected.indexOf(data.item.key) >= 0 ? styles.selected : {}]}>
            <Text style={styles.number}>
              №&nbsp;{data.item.id}&nbsp;&nbsp;
            <Text style={styles.title}>{data.item.name}</Text>
            </Text>
            <View style={{marginVertical: 0}}>
            {
              /*this.props.statuses.project_items.find(item => parseInt(item.name) === parseInt(data.item.status)).value ?
              <StatusBlock
                text={this.props.statuses.project_items.find(item => parseInt(item.name) === parseInt(data.item.status)).value}
                color={statusColor(data.item.status, true)} />
                : null*/
            }
            {
              <StatusBlock text={status.value} color={statusColor(data.item.status, true)} />
            }

            </View>
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
      if (this.props.user.isAdmin) {
        this.props.getAllProjects(this.state.companyid)
      } else if (this.props.user.isSpectator) {
          this.props.getAllSpectatorProjects(this.props.user.sessionid)
      } else {
        this.props.getUserProjects(this.props.user.sessionid, this.state.companyid)
      }
    }

    _listEmptyComponent = () => {
    return (
        <View>
            <Text style={styles.nullText}>
                У выбранной компании нет проектов
            </Text>
        </View>
      )
    }

    render() {
      return (
        this.props.user.loaded ?
          <View style={styles.main}>
            <View style={styles.header}>
            {
              !this.props.user.isSpectator ?
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
                :
                <View style={styles.headButton}>
                </View>
            }


              <View style={styles.headContainer}>
                <Text style={styles.headTitle}>
                  Проекты
                </Text>
              </View>
              <View style={styles.headButton}>
              </View>
            </View>
            <View style={styles.swipeList}>
            {
              this.state.loading && !this.state.isFetching && this.state.loadingMore || !this.props.projects.loaded ?
                <View style={{padding: 40}}>
                  <ActivityIndicator />
                </View>
                :
                <FlatList
                  data={this.props.projects.items}
                  closeOnRowOpen={false}
                  ref={ref => this.swipelist}
                  renderItem={(data, rowItem) => this.renderCard(data, rowItem)}
                  onRefresh={() => this.onRefresh()}
                  refreshing={this.state.isFetching}
                  ListEmptyComponent={this._listEmptyComponent}
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
      navigateToMainPage: (projectid) => navigateToMainPage(projectid),
      getUserProjects: (sessionid, companyid, firsttime) => getUserProjects(sessionid, companyid, firsttime),
      getAllProjects: (companyid, firsttime) => getAllProjects(companyid, firsttime),
      getAllSpectatorProjects: (sessionid, firsttime) => getAllSpectatorProjects(sessionid, firsttime),
      setProject: (projectid) => setProject(projectid),
      navigateBack: navigateBack
    }, dispatch);
}

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      statuses: state.statuses,
      projects: state.projects,
    }
  }, mapDispatchToProps
)(ProjectsPage);
