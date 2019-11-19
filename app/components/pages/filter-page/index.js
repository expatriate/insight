import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight,
    Picker,
} from 'react-native';

import Svg, {
    Path,
    Circle,
    Polygon,
    Defs,
    Stop,
    G,
    LinearGradient as LinearGradientSvg
} from 'react-native-svg';

import { EventRegister } from 'react-native-event-listeners';

import RNPickerSelect from 'react-native-picker-select';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateBack,
  filterTasks,
  getAllTasks,
  getAllSpectatorTasks,
} from '../../../actions';

import { SwipeListView } from 'react-native-swipe-list-view';

import styles from './styles';
import buttonStyles from '../../styles/buttons';
import { Colors } from '../../styles/colors';

class FilterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
          towns:[],
          statuses: [],
          filterStatus: null,
          filterTown: null
    		};

    }

    componentDidMount() {
      this.setState({
        towns: this.props.towns.items.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        }),
        statuses: this.props.statuses.items.map((item) => {
          return {
            label: item.value,
            value: item.name
          }
        }),
        filterTown: this.props.tasks.filter.town,
        filterStatus: this.props.tasks.filter.status,
      });
    }

    componentWillUnmount() {
      EventRegister.removeEventListener(this.pushRecieved);
    };

    resetFilter() {
      this.props.filterTasks({town: '', status: ''});

      this.setState({
        filterStatus: null,
        filterTown: null
      });

      if (!this.props.user.isSpectator) {
        this.props.getAllTasks(this.props.user.sessionid, {project_id: this.props.projects.selectedProject}, 0)
      } else {
        this.props.getAllSpectatorTasks(this.props.user.sessionid, {project_id: this.props.projects.selectedProject}, 0)
      }

      this.props.navigateBack();
    }

    applyFilter() {
      this.props.filterTasks({town: this.state.filterTown, status: this.state.filterStatus});
      if (!this.props.user.isSpectator) {
        this.props.getAllTasks(this.props.user.sessionid, {
          town: this.state.filterTown,
          project_id: this.props.projects.selectedProject,
          status: this.state.filterStatus
        }, 0)
      } else {
        this.props.getAllSpectatorTasks(this.props.user.sessionid, {
          project_id: this.props.projects.selectedProject,
          town: this.state.filterTown,
          status: this.state.filterStatus
        }, 0)
      }
      this.props.navigateBack();
    }

    render() {
      return (
          <View style={styles.main}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.headButton} onPress={() => {this.props.navigateBack()}}>
                <Svg height={20} width={20} viewBox="0 0 306 306">
                    <Polygon
                      fill={Colors.COLOR_WHITE}
                      points="247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306 "
                    />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.headTitle}>
                Сортировка
              </Text>
              <View style={styles.headButton}>
              </View>
            </View>
            <View style={styles.filter}>
              <View style={styles.line}>
                <Text style={styles.def}>
                  По городу:
                </Text>
                <View style={styles.picker}>
                  <RNPickerSelect
                    value={this.state.filterTown}
                    placeholder={{label:'Все города', value: null, color: Colors.COLOR_BLACK_08}}
                    doneText={'Готово'}
                    style={{
                      placeholder: {
                        fontSize: responsiveFontSize(2),
                        textAlign:'right',
                        paddingRight: 30,
                      },
                      inputIOS: {
                        ...styles.inputIOS,
                      },
                      inputAndroid: {
                        ...styles.inputAndroid
                      },
                      iconContainer: {
                        top: 20,
                        right: 10,
                      },
                    }}
                    Icon={() => {
                      return <Svg width={18} height={18} viewBox={'0 0 292.362 292.362'}>

                      	<Path
                          fill={Colors.COLOR_RED}
                          d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424
                      		C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428
                      		s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z"/>
                      </Svg>
                    }}
                    onValueChange={(value) => {
                      this.setState({
                        filterTown: value,
                      })
                    }

                    }
                    items={this.state.towns}
                  />
                </View>
              </View>
              <View style={styles.line}>
                <Text style={styles.def}>
                  По статусу:
                </Text>
                <View style={styles.picker}>
                  <RNPickerSelect
                    value={this.state.filterStatus}
                    placeholder={{label: 'Все статусы', value: null, color: Colors.COLOR_BLACK_08}}
                    doneText={'Готово'}
                    style={{
                      placeholder: {
                        fontSize: responsiveFontSize(2),
                        textAlign:'right',
                        paddingRight: 30,
                      },
                      inputIOS: {
                        ...styles.inputIOS,
                      },
                      inputAndroid: {
                        ...styles.inputAndroid
                      },
                      iconContainer: {
                        top: 20,
                        right: 10,
                      },
                    }}
                    Icon={() => {
                      return <Svg width={18} height={18} viewBox={'0 0 292.362 292.362'}>

                      	<Path
                          fill={Colors.COLOR_RED}
                          d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424
                      		C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428
                      		s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z"/>
                      </Svg>
                    }}
                    onValueChange={(value) =>
                      this.setState({
                        filterStatus: value,
                      })
                    }
                    items={this.state.statuses}
                  />
                </View>
              </View>
            </View>
            <View style={styles.bottom}>
              <TouchableOpacity style={buttonStyles.redButton} onPress={() => this.applyFilter()}>
                <Text style={buttonStyles.redButtonText}>
                  Применить
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={buttonStyles.lineButton} onPress={() => this.resetFilter()}>
                <Text style={buttonStyles.lineButtonText}>
                  Сбросить сортировку
                </Text>
              </TouchableOpacity>
            </View>
          </View>
      );
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateBack: navigateBack,
      filterTasks: (filter) => filterTasks(filter),
      getAllTasks: (sessionid, filter, offset) => getAllTasks(sessionid, filter, offset),
      getAllSpectatorTasks: (sessionid, filter, offset) => getAllSpectatorTasks(sessionid, filter, offset),
    }, dispatch);
}

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      statuses: state.statuses,
      projects: state.projects,
      towns: state.towns,
      tasks: state.tasks,
      companies: state.companies
    }
  }, mapDispatchToProps
)(FilterPage);
