import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TextInput,
    Alert,
    Keyboard
} from 'react-native';

import Svg, {
    Polygon,
    Path,
} from 'react-native-svg';

import axios from 'axios';
import qs from 'qs';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class KladrInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
    }

    this.kladr = this.kladr.bind(this);
    this.onChoose = this.onChoose.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide() {
    this.setState({
      cities:[]
    });
  }


  kladr(type, text) {
    this.props.writing(text);
    let sendObject = {
      oneString: true,
      limit: 10,
      query: text,
      withParent: true
    }
    axios({
      method: 'get',
      url: 'api.php',
      params: sendObject,
      baseURL: 'https://kladr-api.ru/',
      transformRequest: [(data, headers) => {
          delete headers.common.Authorization
          return data
      }]
    }).then(response => {
      //console.warn('SUCCESS', response)
      this.setState({
        cities: response.data.result || []
      })
    }).catch(error => {
      //console.warn('ERROR', error)
    });
  }

  onChoose(text) {
    this.props.writing(text, true);
    this.setState({
      cities:[]
    })
  }

  render() {

    const title = this.props.title ? 
      <Text style={styles.normalTitle}>
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
      <Svg width={20} height={20} viewBox="0 0 18 18" style={{paddingHorizontal: 14}}>
        <Path 
        fill={Colors.COLOR_LIGHT_BLUE}
        d="M15.5,14 L14.71,14 L14.43,13.73 C15.41,12.59 16,11.11 16,9.5 C16,5.91 13.09,3 9.5,3 C5.91,3 3,5.91 3,9.5 C3,13.09 5.91,16 9.5,16 C11.11,16 12.59,15.41 13.73,14.43 L14,14.71 L14,15.5 L19,20.49 L20.49,19 L15.5,14 L15.5,14 Z M9.5,14 C7.01,14 5,11.99 5,9.5 C5,7.01 7.01,5 9.5,5 C11.99,5 14,7.01 14,9.5 C14,11.99 11.99,14 9.5,14 L9.5,14 Z"
        />
      </Svg>
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

    const whereami = this.props.location ?
    <TouchableHighlight underlayColor="transparent" onPress={() => this.props.getLocation()} style={{paddingHorizontal: 14}}>
      <Svg width={24} height={24} viewBox="0 0 21 21">
        <Polygon 
          fill={Colors.COLOR_LIGHT_BLUE}
          points="21 3 3 10.53 3 11.51 9.84 14.16 12.48 21 13.46 21"
        />
      </Svg>
    </TouchableHighlight>
    : undefined

    let results = this.state.cities.map((item, index) => {
      let parentIn = 0;
      let parents = item.parents ? item.parents.map((el, elIndex) => {
        if (el.contentType == 'city' || el.contentType == 'street') {
          parentIn++;
          return (parentIn > 1 ? ' ' : ' ') + el.typeShort + ' ' + el.name;
        } else {
          return ''
        }
      }) : '';
      return(
        <TouchableHighlight key={'found'+index} style={styles.item} underlayColor="transparent" onPress={() => this.onChoose(item.fullName)}>
          <Text>
            { parents.toString().replace(',', '') + ' ' + item.type + ' ' + item.name }
          </Text>
        </TouchableHighlight>)
    })
    
    return (
      <View style={[formsStyles.inputContainer, this.props.style]}>

        { title }

        <View style={baseStyles.row}>
          <View style={[baseStyles.row, formsStyles.inputText_bordered, baseStyles.flex, baseStyles.verticalCenter, styles.whiteBg]}>
            <TextInput
              style={formsStyles.inputText_white}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              textContentType={type}
              value={this.props.value}
              editable={this.props.noteditable ? false : true}
              onChangeText={(text) => this.kladr('address', text)}
              multiline={this.props.multiline || false}
            />
            { search }
            { clear }
            { rightArrow }
            { whereami }
          </View>
        </View>
        <View style={{position: 'relative', flex: 1}}>
          <View style={styles.items}>
            { results }
          </View>
        </View>
      </View>
    )
  }
};


export default KladrInput;