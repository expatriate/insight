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


class CheckAgentModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
    }

    selectAgent(item) {
      EventRegister.emit('TASK_AGENT_SELECTED', item);
      this.props.close();
    }

    render() {

      const agents = this.props.agents.length ? this.props.agents.map((item, index) => {
        return(
          <View key={'agent_' + index} style={styles.itemContainer}>
            <TouchableOpacity style={styles.item} onPress={() => {this.selectAgent(item)}}>
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
              Нет активных представителей
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
                <Text style={styles.modaltitle}>Выберите представителя</Text>
                <TouchableOpacity onPress={() => {this.props.close()}}>
                  <Text style={styles.closeLink}>
                    Закрыть
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                { agents }
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
)(CheckAgentModal);
