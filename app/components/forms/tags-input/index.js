import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TextInput,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Svg, {
    Polygon,
} from 'react-native-svg';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class TagsInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentWillMount() {

    this.setState({
      maxTags: this.props.maxTags || 99999
    })
  }

  render() {

    let tags = this.props.tags.map((item, index) => {
      return(
        <LinearGradient key={'tagskill'+index} colors={[Colors.COLOR_BLACK_08, Colors.COLOR_BLACK_08]} style={[styles.tag]}>
          <TouchableHighlight underlayColor="transparent" onPress={() => this.props.removeFromTags(item)}>
            <View style={[baseStyles.verticalCenter,{flexDirection: 'row'}]}>
              <Text style={[
                styles.tag_text, 
                styles.tag_text_active, 
                item.is_qualification ? styles.skill_main : undefined, 
                item.active != undefined && item.active == 0 ? styles.skill_inactive : undefined]}>
                { item.title }
              </Text>
              <Svg width={20} height={20} viewBox="0 0 36 36" style={{marginTop:4, marginLeft: 4}}>
                <Polygon 
                  fill="#ffffff" 
                  points="25.879,7.841 23.838,5.801 15.679,13.96 7.52,5.801 5.48,7.841 13.639,16 5.48,24.158 
                          7.52,26.199 15.679,18.041 23.838,26.199 25.879,24.158 17.719,16"/>
              </Svg>
            </View>
          </TouchableHighlight>
        </LinearGradient>)
    });

    let placeholder = this.props.placeholder ? this.props.placeholder : 'text field';
    let placeholderTextColor = this.props.placeholderTextColor ? this.props.placeholderTextColor : Colors.COLOR_WHITE_06
    let type = this.props.type ? this.props.type : 'name';
    
    return (
      <View style={[formsStyles.inputContainer, this.props.style]}>
        <View style={[formsStyles.inputText_bordered, baseStyles.flex, styles.whiteBg, styles.tags]}>
          {
            tags.length ?
              <View style={styles.tagsContainer}>
                { tags }
              </View>
              : tags
          }
          {
            this.props.tags.length >= this.state.maxTags ?
            <Text style={styles.alert}>
              Вы не можете выбрать больше {this.state.maxTags} тегов
            </Text>
            :
            <TextInput
              style={formsStyles.formInputText}
              placeholder={placeholder}
              editable={this.props.noteditable ? false : true}
              textContentType={type}
              onFocus={this.props.onFocus || undefined}
              onBlur={this.props.onBlur || undefined}
              value={this.props.value}
              onChangeText={(text) => this.props.writing(text)}
              multiline={this.props.multiline || false}
              keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
            /> 
          }
          
        </View>
      </View>
    )
  }
};


export default TagsInput;