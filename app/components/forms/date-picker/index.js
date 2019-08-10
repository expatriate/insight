import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TextInput,
    Alert
} from 'react-native';

import Svg, {
    Polygon,
    Path,
} from 'react-native-svg';
import Picker from 'react-native-picker';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from: '-',
      to: '-'
    }

    this.data = [
      [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
      [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
    ]

    this.openPicker = this.openPicker.bind(this);
  }

  componentWillMount() {
    this.setState({
      from: this.props.from,
      to: this.props.to,
    });
  }

  openPicker() {
    Picker.init({
        pickerData: this.data,
        pickerFontColor: [0, 0 ,0, 1],
        pickerTitleText: 'Выберите даты',
        pickerConfirmBtnText: 'Подтвердить',
        pickerCancelBtnText: 'Отмена',
        onPickerConfirm: (pickedValue, pickedIndex) => {
          this.setState({
            from: pickedValue[0],
            to: pickedValue[1]
          });
          this.props.onSelected(this.state);
        },
        onPickerCancel: (pickedValue, pickedIndex) => {
        },
        onPickerSelect: (pickedValue, pickedIndex) => {
        }
    });
    Picker.show();
  }

  render() {    
    return (
      <View>
        <TouchableHighlight underlayColor="transparent" onPress={() => this.openPicker()}>
          <View style={[baseStyles.verticalCenter, this.props.style,  {flexDirection: 'row'}]}>
            <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 12}}>
              <Path
                fill={Colors.COLOR_GRAY_ICONS}
                d="M9,11 L7,11 L7,13 L9,13 L9,11 L9,11 Z M13,11 L11,11 L11,13 L13,13 L13,11 L13,11 Z M17,11 L15,11 L15,13 L17,13 L17,11 L17,11 Z M19,4 L18,4 L18,2 L16,2 L16,4 L8,4 L8,2 L6,2 L6,4 L5,4 C3.89,4 3.01,4.9 3.01,6 L3,20 C3,21.1 3.89,22 5,22 L19,22 C20.1,22 21,21.1 21,20 L21,6 C21,4.9 20.1,4 19,4 L19,4 Z M19,20 L5,20 L5,9 L19,9 L19,20 L19,20 Z"
              />
            </Svg>
            <Text style={[this.props.textStyle, {flex: 1}]}>
              { this.state.from } - {this.state.to}
            </Text>
            <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginLeft: 12}}>
              <Polygon
                fill={Colors.COLOR_GRAY_ICONS}
                points="8.301,7.4 12.901,11.999 8.301,16.6 9.701,18 15.699,11.999 9.701,6"
              />
            </Svg>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
};


export default DatePicker;