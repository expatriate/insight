import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
} from 'react-native';

import buttonsStyles from '../../styles/buttons.js';

import LinearGradient from 'react-native-linear-gradient';

import * as tasktypes from '../../../taskTypes.js';

import { 
  Colors, 
  Gradients,
} from '../../styles/colors.js';

class RespondBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {
  }

  onPressBtn(options) {
    if (options.isActive) {
      if (!options.apply) {
        console.warn('onPressBtn remove')
        if (options.isPrivate) {
          this.props.removePerformer();
        } else {
          if (this.props.performer) {
            this.props.removePerformer();
            this.props.refreshing()
          } else {
            this.props.removeRespond();
            this.props.refreshing()
          }
        }
      } else {
        console.warn('onPressBtn apply')
        if (options.isPrivate) {
          this.props.applyPrivate();
          this.props.refreshing()
        } else {
          this.props.applyRespond();
          this.props.refreshing()
        }
      }
    }
  }

  _getOptions() {
    let options = {
      text: 'Откликнуться',
      status: this.props.status,
      apply: false,

      isArhive: this.props.isArhive ? true : false,
      isAuthor: this.props.isAuthor ? true : false,
      isActiveRespond: parseInt(this.props.respondsLeft) > 0 ? true : false,
      isPrivate: this.props.isPrivate ? true : false,
    }

    let text = 'Откликнуться';
    let active = false;
    let apply = false;

    if (options.isActiveRespond) {
      text = 'Откликнуться';
      active = true;
      apply = true;
    }
    if(this.props.performers != undefined) {
      Object.keys(this.props.performers).filter((objectKey, index) => {
        if(this.props.performers[objectKey].user != undefined) {
          if (this.props.performers[objectKey].user.id == this.props.userCurents) {
            text = 'Отказаться';
            active = true;
            apply = false;
          }
        }else if(this.props.performers[objectKey].id != undefined){
          if (this.props.performers[objectKey].id == this.props.userCurents) {
            text = 'Отказаться';
            active = true;
            apply = false;
          }
        }
      });
    }
    console.warn(this.props.responds)
    if(this.props.responds != undefined) {
      Object.keys(this.props.responds).filter((objectKey, index) => {
        if(this.props.responds[objectKey].user != undefined) {
          if (this.props.responds[objectKey].user.id == this.props.userCurents) {
            text = 'Отказаться';
            active = true;
            apply = false;
          }
        }else if(this.props.responds[objectKey].id != undefined){
          if (this.props.responds[objectKey].id == this.props.userCurents) {
            text = 'Отказаться';
            active = true;
            apply = false;
          }
        }
      });
    }

    // if(this.props.responds && this.props.responds.length == undefined) {
    //     if (Object.values(this.props.responds)[0].user.id == this.props.userCurents) {
    //       text = 'Отказаться';
    //       active = true;
    //       apply = false;
    //     }
    // }
    // if(this.props.performers && this.props.performers.length == undefined) {
    //     if (Object.values(this.props.performers)[0].user.id == this.props.userCurents) {
    //       text = 'Отказаться';
    //       active = true;
    //       apply = false;
    //     }
    // }

    if (options.isArhive) {
      text = 'В архиве';
      active = false;
    }

    if (options.isAuthor) {
      text = 'Автор';
      active = false;
    }

    if (options.isPrivate && this.props.status != undefined && this.props.status == tasktypes.STATUS_SEARCH_PERFORMER) {
      text = 'Принять';
      active = true;
      apply = true;
    }

    if ((!options.isPrivate && this.props.alreadyRepond) || (options.isPrivate && this.props.performer && this.props.status != undefined && this.props.status == tasktypes.STATUS_IN_WORK) || (!options.isPrivate && this.props.performer)) {
      text = 'Отказаться';
      active = true;
      apply = false;
    }

    options = {
      ...options,
      text: text,
      isActive: active,
      apply: apply
    }

    return options;
  }

  render() {
    const options = this._getOptions();

    return (
      <View>
        <TouchableHighlight underlayColor="transparent" onPress={() => {this.onPressBtn(options)}}>
          <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} 
            colors={options.isActive ? Gradients.BUTTON_BLUE : Gradients.BUTTON_INACTIVE}>
            <View>
              <View style={[buttonsStyles.buttonMiddle]}>
                <Text style={buttonsStyles.buttonMiddleText}>
                  { options.text }
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableHighlight>
      </View>
    )
  }
};


export default RespondBtn;