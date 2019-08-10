import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SwipeListView } from 'react-native-swipe-list-view';

import styles from './styles';

class MainPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
          data:[
            {key: '1', name: 'Название задачи', city: 'Москва', user: 'Константинопольский Константин Коснтантинович', status: 'Принята представителем', number: '12345678' },
            {key: '2', name: 'Название задачи', city: 'Москва', user: 'Константинопольский Константин Коснтантинович', status: 'Принята представителем', number: '12345678' },
            {key: '3', name: 'Название задачи', city: 'Москва', user: 'Константинопольский Константин Коснтантинович', status: 'Принята представителем', number: '12345678' },
            {key: '4', name: 'Название задачи', city: 'Москва', user: 'Константинопольский Константин Коснтантинович', status: 'Принята представителем', number: '12345678' },
            {key: '5', name: 'Название задачи', city: 'Москва', user: 'Константинопольский Константин Коснтантинович', status: 'Принята представителем', number: '12345678' },
            {key: '6', name: 'Название задачи', city: 'Москва', user: 'Константинопольский Константин Коснтантинович', status: 'Принята представителем', number: '12345678' },
            {key: '7', name: 'Название задачи', city: 'Москва', user: 'Константинопольский Константин Коснтантинович', status: 'Принята представителем', number: '12345678' }
          ],
    			listType: 'FlatList',
    			listViewData: Array(20).fill('').map((_,i) => ({key: `${i}`, text: `item #${i}`})),
    			sectionListData: Array(5).fill('').map((_,i) => ({title: `title${i + 1}`, data: [...Array(5).fill('').map((_, j) => ({key: `${i}.${j}`, text: `item #${j}`}))]})),
    		};

        this.rowSwipeAnimatedValues = {};
    		Array(20).fill('').forEach((_, i) => {
    			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    		});

    }

    componentDidMount() {

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
  	}

  	onSwipeValueChange = (swipeData) => {
  		const { key, value } = swipeData;
  		this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  	}

    render() {
      return (
          <View style={styles.main}>
            <View style={styles.header}>
              <View>
                <TouchableOpacity style={styles.headButton}>
                  <Text>
                    Выбрать
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.headTitle}>
                Все задачи
              </Text>
              <TouchableOpacity style={styles.headButton}>
                <Text>
                  F
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.swipeList}>
              <SwipeListView
    						data={this.state.data}
    						renderItem={ (data, rowMap) => (
    							<TouchableHighlight
    								onPress={ _ => console.log('You touched me') }
    								style={styles.rowFront}
    								underlayColor={'#AAA'}
    							>
    								<View>
    									<Text style={styles.title}>{data.item.name}</Text>
                      <Text style={styles.number}>№ {data.item.number}</Text>
                      <Text style={styles.city}>Город: {data.item.city}</Text>
                      <Text style={styles.user}>Ответственный: {data.item.user}</Text>
                      <View style={styles.applied}>
                        <Text style={styles.statustext}>
                          {data.item.status}
                        </Text>
                      </View>
    								</View>
    							</TouchableHighlight>
    						)}
    						renderHiddenItem={ (data, rowMap) => (
    							<View style={styles.rowBack}>
    								<Text>Left</Text>
    								<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={ _ => this.closeRow(rowMap, data.item.key) }>
    									<Text style={styles.backTextWhite}>Close</Text>
    								</TouchableOpacity>
    							</View>
    						)}
    						leftOpenValue={75}
    						rightOpenValue={-150}
    						previewRowKey={'0'}
    						previewOpenValue={-40}
    						previewOpenDelay={3000}
    						onRowDidOpen={this.onRowDidOpen}
    						onSwipeValueChange={this.onSwipeValueChange}
    					/>
              </View>
          </View>
      );
    }
};

function mapDispatchToProps(dispatch) {
/*    return bindActionCreators({
      login: login,
      getData: getData
    }, dispatch);*/
}

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app
    }
  }//, mapDispatchToProps
)(MainPage);
