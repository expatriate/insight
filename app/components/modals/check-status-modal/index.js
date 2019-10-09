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


class CheckStatusModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
    }

    selectStatus(item) {
      EventRegister.emit('TASK_STATUS_SELECTED', item);
      this.props.close();
    }

    render() {

      const statuses = this.props.statuses.map((item, index) => {
        return(
          <View key={'status_' + index} style={styles.itemContainer}>
            <TouchableOpacity style={styles.item} onPress={() => {this.selectStatus(item)}}>
              <Text style={styles.name}>
                { item.value}
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
                <Text style={styles.modaltitle}>Выберите статус</Text>
                <TouchableOpacity onPress={() => {this.props.close()}}>
                  <Text style={styles.closeLink}>
                    Закрыть
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                { statuses }
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
)(CheckStatusModal);
