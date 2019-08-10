import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import Svg, {
    Path,
    Polygon,
} from 'react-native-svg';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';
import { EventRegister } from 'react-native-event-listeners';

import { 
  Colors, 
  Gradients,
} from '../../styles/colors.js';

class PageHeader extends Component {
  constructor(props) {
    super(props);

    /*
    menu - shows menu at left
    options - shows block at right
    template - theme 
    title - title
    */

    this.state = {
    }
  }

  componentDidMount() {
    
  }

  onClickMenu() {
    EventRegister.emit('OPEN_MENU', '');
  }


  render() {
    const menu = this.props.menu ?
      <TouchableOpacity
        underlayColor="transparent"
        onPress={() => this.onClickMenu()}>
        <Svg width={32} height={32} viewBox="0 0 40 40">
          <Path 
            fill={Colors.COLOR_LIGHT_BLUE_MENU} 
            d="M8.125,27.917h23.75v-2.639H8.125V27.917L8.125,27.917z M8.125,21.32h23.75v-2.639H8.125
              V21.32L8.125,21.32z M8.125,12.083v2.639h23.75v-2.639H8.125L8.125,12.083z"/>
        </Svg>
      </TouchableOpacity>
      : 
      <View style={styles.clearContainer}>
      </View>;

    const back = this.props.back ?
      <TouchableOpacity
        underlayColor="transparent"
        onPress={() => this.props.onBack()}>
        <Svg 
          width={this.props.template == 'dark' || this.props.template == 'light' ? 24 : 32} 
          height={this.props.template == 'dark' || this.props.template == 'light' ? 24 : 32} 
          style={
            this.props.template == 'dark' ? 
              styles.svg_dark 
            : 
               this.props.template == 'light' ?
                styles.svg_light
              :
                null 
          } 
          viewBox="0 0 24 24">
          <Polygon 
            fill={this.props.template !== 'dark' ? Colors.COLOR_LIGHT_BLUE_MENU : Colors.COLOR_WHITE} 
            points="15.4 7.4 14 6 8 12 14 18 15.4 16.6 10.8 12"/>
        </Svg>
      </TouchableOpacity>
      : 
      <View style={styles.clearContainer}>
      </View>;

    const leftblock = 
      this.props.menu ? 
        menu : 
          this.props.back ? 
            back : 
              <View style={styles.clearContainer}>
              </View>

    const options = !this.props.options && !this.props.search && !this.props.addBtn ? 
      <View style={styles.clearContainer}>
      </View>
      : 
      null;

    const addBtn = this.props.addBtn ? 
      <TouchableOpacity
        underlayColor="transparent"
        style={styles.buttonWrapper}
        onPress={() => this.props.onAdd()}>
        <Svg 
          width={32} 
          height={32}
          viewBox="0 0 24 24">
            <Path 
            d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M17,13 L13,13 L13,17 L11,17 L11,13 L7,13 L7,11 L11,11 L11,7 L13,7 L13,11 L17,11 L17,13 L17,13 Z" 
            fill="#31A3B7"/>
          </Svg>
      </TouchableOpacity>
      : 
      null;

    const search = this.props.search ? 
      <TouchableOpacity
        underlayColor="transparent"
        style={styles.buttonWrapper}
        onPress={() => this.props.onSearch()}>
        <Svg 
          width={this.props.template == 'dark' || this.props.template == 'light' ? 24 : 32} 
          height={this.props.template == 'dark' || this.props.template == 'light' ? 24 : 32}
          style={
            this.props.template == 'dark' ? 
              styles.svg_dark 
            : 
               this.props.template == 'light' ?
                styles.svg_light
              :
                null 
          } 
          viewBox="0 0 24 24">
            <Path 
              d="M15.5,14 L14.71,14 L14.43,13.73 C15.41,12.59 16,11.11 16,9.5 C16,5.91 13.09,3 9.5,3 C5.91,3 3,5.91 3,9.5 C3,13.09 5.91,16 9.5,16 C11.11,16 12.59,15.41 13.73,14.43 L14,14.71 L14,15.5 L19,20.49 L20.49,19 L15.5,14 L15.5,14 Z M9.5,14 C7.01,14 5,11.99 5,9.5 C5,7.01 7.01,5 9.5,5 C11.99,5 14,7.01 14,9.5 C14,11.99 11.99,14 9.5,14 L9.5,14 Z" 
              fill="#31A3B7"/>
          </Svg>
      </TouchableOpacity>
      : 
      null;
    
    return (
      <View style={[
        this.props.template == 'dark' ? styles.top_container_dark 
          :  this.props.template == 'light' ? styles.top_container_light
          : styles.top_container,
        styles.pageHeader
        ]}>
        <View style={styles.wrapper}>
          { leftblock }
          { search && addBtn ?
            <View style={styles.clearContainer}>
            </View>
            : null
          }
          <View style={[styles.top_title_container]}>
            <Text style={
              this.props.template == 'dark' 
                ? 
                styles.top_title_dark 
                :  this.props.template == 'light' ?
                    styles.top_title_light
                  : 
                    styles.top_title
                }>
              {this.props.title}
            </Text>
          </View>
          { options }
          { search }
          { addBtn }
        </View>
      </View>
    )
  }
};


export default PageHeader;