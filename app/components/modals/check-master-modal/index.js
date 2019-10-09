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


class CheckMasterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
    }

    selectMaster(item) {
      EventRegister.emit('TASK_MASTER_SELECTED', item);
      this.props.close();
    }

    render() {

      const masters = this.props.masters.length ? this.props.masters.map((item, index) => {
        return(
          <View key={'master_' + index} style={styles.itemContainer}>
            <TouchableOpacity style={styles.item} onPress={() => {this.selectMaster(item)}}>
              <Text style={styles.name}>
                { item.first_name + ' ' + item.last_name}
              </Text>
            </TouchableOpacity>
            <Text style={styles.phone}>
              { item.phone}
            </Text>
          </View>)
      }) :
          <View>
            <Text style={styles.name}>
              Нет активных бригадиров
            </Text>
          </View>
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
                <Text style={styles.modaltitle}>Выберите бригадира</Text>
                <TouchableOpacity onPress={() => {this.props.close()}}>
                  <Text style={styles.closeLink}>
                    Закрыть
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                { masters }
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
)(CheckMasterModal);
