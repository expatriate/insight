import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import buttonsStyles from '../../styles/buttons.js';

import LinearGradient from 'react-native-linear-gradient';

import Svg, {
    Path,
    Polygon,
    Circle
} from 'react-native-svg';

import {
  Colors,
  Gradients,
} from '../../styles/colors.js';

import buttonStyles from '../../styles/buttons.js';

class ApplyButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      abandon: false,
      abandonText: 'Отклонить задачу',
      apply: true,
      applyText: 'Принять задачу',
      visible: true
    }
  }

  handleApply() {
    if(this.props.user.isMaster) {
      this.props.onMasterApply()
    }
    if(this.props.user.isAgent) {
      this.props.onAgentApply()
    }
    if(this.props.user.isClient) {
      this.props.onClientApply()
    }

    this.setState({
      visible: false
    })
  }

  handleDecline() {
    if(this.props.user.isAgent) {
      this.props.onAgentDecline()
    }
    if(this.props.user.isClient) {
      this.props.onClientDecline()
    }
    this.setState({
      visible: false
    })
  }

  componentDidMount() {
    let obj = {
      abandon: false,
      abandonText: '',
      apply: true,
      applyText: '',
      visible: false
    }
    //console.warn(this.props.statuses)

    if (this.props.user.isMaster && this.props.task.status === '4') {
      obj = {
        abandon: false,
        abandonText: '',
        apply: true,
        applyText: 'Завершить задачу',
        visible: true
      }
    }

    if (this.props.user.isAgent && this.props.task.status === '1') {
      obj = {
        abandon: true,
        abandonText: 'Отклонить задачу',
        apply: true,
        applyText: 'Согласовать задачу',
        visible: true
      }
    }

    if (this.props.user.isClient && this.props.task.status === '6') {
      obj = {
        abandon: true,
        abandonText: 'Отклонить задачу',
        apply: true,
        applyText: 'Принять задачу',
        visible: true
      }
    }
    this.setState({
      ...obj
    }, () => {
      //console.warn(this.state)
    })
  }

  render() {

    return (
      <View>
        {
          this.state.visible && this.state.apply ?
            <TouchableOpacity style={buttonStyles.redButton} onPress={() => {this.handleApply()}}>
              <Text style={buttonStyles.redButtonText}>
                { this.state.applyText }
              </Text>
            </TouchableOpacity>
          : null
        }
        {
          this.state.visible && this.state.abandon ?
            <TouchableOpacity style={buttonStyles.lineButton} onPress={() => {this.handleDecline()}}>
              <Text style={buttonStyles.lineButtonText}>
                { this.state.abandonText }
              </Text>
            </TouchableOpacity>
          : null
        }
      </View>
    )
  }
};


export default ApplyButton;
