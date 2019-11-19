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
  navigateToProjects,
  getAllCompanies,
  navigateToDetail,
  getTaskMasters,
  getUserCompanies,
  getAgents,
  setCompany
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

class CompaniesPage extends Component {
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
      this.props.getAgents(this.props.user.sessionid);
      if (this.props.user.isAdmin) {
        this.props.getTaskMasters(this.props.user.sessionid);
        this.props.getAllCompanies();
      } else {
        this.props.getUserCompanies(this.props.user.sessionid);
      }

      this.loadingRecieved = EventRegister.addEventListener('COMPANIES_LOADING_START', () => {
        //console.warn('COMPANIES_LOADING_START')
        this.setState({
          loading: true
        })
      })

      this.companiesRecieved = EventRegister.addEventListener('COMPANIES_RECIEVED', () => {
        //console.warn('COMPANIES_RECIEVED')
        this.setState({
          isFetching: false,
          loading: false
        })
      })

      this.pushRecieved = EventRegister.addEventListener('PUSH_RECIEVED', (task) => {
        //console.warn('PUSH_RECIEVED', task);

        this.props.navigateToDetail(task)
      })
    }

    componentWillUnmount() {
      EventRegister.removeEventListener(this.loadingRecieved);
      EventRegister.removeEventListener(this.companiesRecieved);
      EventRegister.removeEventListener(this.pushRecieved);
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
  		console.log('This row opened', rowKey);
      //console.warn('OPEN', rowKey)
  	}

  	onSwipeValueChange = (swipeData) => {
  		const { key, value } = swipeData;
  		this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  	}

    goToProjects(companyid) {
      this.props.setCompany(companyid);
      this.props.navigateToProjects(companyid);
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

    openAll() {
      this.setState({
        openSelect: !this.state.openSelect,
      })
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
          onPress={ _ => this.goToProjects(data.item.id)}////console.warn('You touched me') }
          style={[styles.rowFront, this.state.openSelect ? position : {}]}
          underlayColor={'#AAA'}
        >

          <View style={[styles.card, this.state.selected.indexOf(data.item.key) >= 0 ? styles.selected : {}]}>

            <Text style={styles.number}>
              <Text style={styles.title}>{data.item.name}</Text>
            </Text>
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
        this.props.getAllCompanies();
      } else {
        this.props.getUserCompanies(this.props.user.sessionid);
      }
    }

    _listEmptyComponent = () => {
    return (
        <View>
            <Text style={styles.nullText}>
                В компаниях пока пусто
            </Text>
        </View>
      )
    }

    render() {
      return (
        this.props.user.loaded ?
          <View style={styles.main}>
            <View style={styles.header}>
                <View style={styles.headButton}>
                </View>
              <View style={styles.headContainer}>
                <Text style={styles.headTitle}>
                  Компании
                </Text>
              </View>
              <View style={styles.headButton}>
              </View>
            </View>
            <View style={styles.swipeList}>
            {
              this.state.loading && !this.state.isFetching && this.state.loadingMore || !this.props.companies.loaded ?
                <View style={{padding: 40}}>
                  <ActivityIndicator />
                </View>
                :
                <SwipeListView
    						data={this.props.companies.items}
                closeOnRowOpen={false}
                ref={ref => this.swipelist}
    						renderItem={(data, rowItem) => this.renderCard(data, rowItem)}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
                ListEmptyComponent={this._listEmptyComponent}
                disableRightSwipe={true}
                disableLeftSwipe={true}
    						renderHiddenItem={ (data, rowMap) => (
                  <View style={styles.rowBack}>
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
      navigateToProjects: (company) => navigateToProjects(company),
      getAllCompanies: getAllCompanies,
      getUserCompanies: (sessionid) => getUserCompanies(sessionid),
      navigateToDetail: (task) => navigateToDetail(task),
      getTaskMasters: (sessionid) => getTaskMasters(sessionid),
      getAgents: (sessionid) => getAgents(sessionid),
      setCompany: (companyid) => setCompany(companyid)
    }, dispatch);
}

export default connect(
  state => {
    return {
      user: state.user,
      tasks: state.tasks,
      companies: state.companies,
      projects: state.projects,
    }
  }, mapDispatchToProps
)(CompaniesPage);
