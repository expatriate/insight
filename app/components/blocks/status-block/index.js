import React, { PureComponent } from 'react';
import {
    View,
    Text,
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

class StatusBlock extends PureComponent {
  constructor(props) {
    super(props);
    //console.warn('PROPS', props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {

    return (
      <View>
        <Text style={styles[`${this.props.color}`]}>
          {this.props.text ? this.props.text : ''}
        </Text>
      </View>
    )
  }
};


export default StatusBlock;
