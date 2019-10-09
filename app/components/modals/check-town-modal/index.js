import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';

import styles from './styles';

import {
  Colors,
  Gradients,
} from '../../styles/colors.js';


class CheckTownModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
    }

    selectTown(item) {
      EventRegister.emit('TASK_TOWN_SELECTED', item);
      this.props.close();
    }

    render() {

      const towns = this.props.towns.map((item, index) => {
        return(
          <View key={'town_' + index} style={styles.itemContainer}>
            <TouchableOpacity style={styles.item} onPress={() => {this.selectTown(item)}}>
              <Text style={styles.name}>
                { item.name}
              </Text>
            </TouchableOpacity>
          </View>)
      });
      return (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.visible}
            onRequestClose={() => {
              this.props.close();
            }}>
            <View style={[styles.mainContent]}>
              <View style={[{flexDirection: 'row', alignItems: 'center', marginBottom: 20}]}>
                <Text style={styles.modaltitle}>Выберите город</Text>
                <TouchableOpacity onPress={() => {this.props.close()}}>
                  <Text style={styles.closeLink}>
                    Закрыть
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                { towns }
              </ScrollView>
            </View>
          </Modal>
      );
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

export default connect(
  state => {
    return {
      user: state.user,
    }
  }, mapDispatchToProps
)(CheckTownModal);
