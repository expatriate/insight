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

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class FormInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentWillMount() {
  }

  render() {

    const title = this.props.title ? 
      <Text style={formsStyles.normalTitle__black}>
        {this.props.title}
      </Text>
        :
      undefined;

    const clear = !this.props.withoutclear ?
        <View style={styles.clearContainer}>
          <TouchableHighlight underlayColor="transparent" style={{paddingHorizontal: 8}} onPress={() => this.props.writing('')}>
            <Svg width={24} height={24} viewBox="0 0 36 36">
              <Polygon 
                fill="#8B98A1" 
                points="25.879,7.841 23.838,5.801 15.679,13.96 7.52,5.801 5.48,7.841 13.639,16 5.48,24.158 
                        7.52,26.199 15.679,18.041 23.838,26.199 25.879,24.158 17.719,16"/>
            </Svg>
          </TouchableHighlight>
        </View>
      :
        undefined;

    const search = this.props.search ?
        <View style={{paddingHorizontal: 14}}>
          <Svg width={20} height={20} viewBox="0 0 18 18">
            <Path 
            fill={Colors.COLOR_LIGHT_BLUE}
            d="M15.5,14 L14.71,14 L14.43,13.73 C15.41,12.59 16,11.11 16,9.5 C16,5.91 13.09,3 9.5,3 C5.91,3 3,5.91 3,9.5 C3,13.09 5.91,16 9.5,16 C11.11,16 12.59,15.41 13.73,14.43 L14,14.71 L14,15.5 L19,20.49 L20.49,19 L15.5,14 L15.5,14 Z M9.5,14 C7.01,14 5,11.99 5,9.5 C5,7.01 7.01,5 9.5,5 C11.99,5 14,7.01 14,9.5 C14,11.99 11.99,14 9.5,14 L9.5,14 Z"
            />
          </Svg>
        </View>
      :
        undefined

    const rightArrow = this.props.rightArrow ? 
        <View style={{paddingHorizontal: 14}}>
          <Svg width={14} height={14} viewBox="0 -2 12 12">
            <Polygon 
              fill={Colors.COLOR_GRAY_ICONS}
              points="2.6,-0.6 7.2,4 2.6,8.6 4,10 10,4 4,-2"
            />
          </Svg>
        </View>
      :
        undefined


    let placeholder = this.props.placeholder ? this.props.placeholder : 'text field';
    let placeholderTextColor = this.props.placeholderTextColor ? this.props.placeholderTextColor : Colors.COLOR_WHITE_06
    let type = this.props.type ? this.props.type : 'name';
    let icon = this.props.icon ? this.props.icon : undefined;
    
    return (
      <View style={[formsStyles.inputContainer, this.props.style]}>

        { title }

          <View style={[formsStyles.inputText_bordered, baseStyles.verticalCenter, styles.whiteBg, {flexDirection: 'row'}, this.props.inputstyle]}>
            { icon }
            <TextInput
              style={[this.props.multiline ? formsStyles.formInputText__multy : formsStyles.formInputText, {flex: 1}]}
              placeholder={placeholder}
              editable={this.props.noteditable ? false : true}
              textContentType={type}
              onFocus={this.props.onFocus || undefined}
              onBlur={this.props.onBlur || undefined}
              value={this.props.value}
              numberOfLines={this.props.multiline && this.props.numberOfLines ? this.props.numberOfLines : (this.props.multiline ? 2 : 1)}
              onChangeText={(text) => this.props.writing(text)}
              multiline={this.props.multiline || false}
              keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
            />
            { search }
            { clear }
            { rightArrow }
          </View>
      </View>
    )
  }
};


export default FormInput;