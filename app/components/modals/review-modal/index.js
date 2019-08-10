import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Modal,
    Alert,
    ScrollView,
    Slider
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import Svg, {
    Path,
    Circle,
    Polygon,
    Defs,
    Stop,
    LinearGradient as LinearGradientSvg
} from 'react-native-svg';

import LinearGradient from 'react-native-linear-gradient';

import FormInput from '../../forms/form-input';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients,
} from '../../styles/colors.js';

import { 
  sendReview
} from '../../../actions';

class ReviewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
          review: undefined,
          rating: 0,
        }

        this.writing = this.writing.bind(this);
        this.sendReviewBtn = this.sendReviewBtn.bind(this);
    }

    componentDidMount() {
    }

    writing(type, text){
      switch(type) {
        case 'review':
          this.setState({
            review: text
          });
        break;
        case 'rating':
          this.setState({
            rating: text.toFixed(2)
          });
        break; 
      }
    }

    sendReviewBtn() {
      let data = {
        user_id: this.props.data.performer.user.id,
        from_id: this.props.data.user.id,
        rating: this.state.rating,
        text: this.state.review,
      };

      this.props.sendReview(data);
      this.props.close();
    }

    render() {
      return (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.visible}
            onRequestClose={() => {
              this.props.close();
            }}>
            <View style={[styles.mainContent]}>
              <View style={[{flexDirection: 'row'}, baseStyles.verticalCenter]}>
                <Text style={[baseStyles.bigText, {flex: 1}]}>Добавить отзыв</Text>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => {
                    this.props.close();
                  }}>
                <Svg width={16} height={16} viewBox="0 0 14 14">
                  <Polygon 
                    fill="#8B98A1" 
                    points="14,1.4 12.6,0 7,5.6 1.4,0 0,1.4 5.6,7 0,12.6 1.4,14 7,8.4 12.6,14 14,12.6 8.4,7 "/>
                </Svg>
                </TouchableHighlight>
              </View>
              <ScrollView>
                <FormInput 
                  multiline={true} 
                  name="title" 
                  style={{marginTop:20}}
                  withoutclear={true}
                  value={this.state.review} 
                  numberOfLines={8}
                  writing={(text) => 
                    {this.writing('review', text)}
                  } 
                  placeholder="Отзыв" />
                <Text style={baseStyles.midText}>
                  Рейтинг
                </Text>
                <View style={{position: 'relative', height: 60, marginBottom: 20}}>
                  <View style={{position: 'absolute', zIndex: 999, left: 0, right: 0, top: 0, bottom: 0, height: 60, width: responsiveWidth(60)}}>
                    <Slider
                        step={0.1}
                        style={{height: 60, width: responsiveWidth(60)}}
                        maximumValue={5}
                        minimumValue={0}
                        minimumTrackTintColor={'transparent'}
                        maximumTrackTintColor={'transparent'}
                        thumbTintColor={'transparent'}
                        onValueChange={(value) => {this.writing('rating', value)}}
                        //value={this.state.rating}
                      />
                  </View>
                  <View style={[{flexDirection: 'row'}, baseStyles.verticalCenter]}>
                    <Svg width={responsiveWidth(60)} height={60} style={styles.refElImage} viewBox="0 0 92 16">
                      <Defs>
                        <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="92" y2="0" id="LinearGradient1">
                          <Stop offset="0" stopColor={Colors.COLOR_YELLOW}></Stop>
                          <Stop offset={(parseFloat(this.state.rating)+0.0001)/5 - 0.001} stopColor={Colors.COLOR_YELLOW}></Stop>
                          <Stop offset={(parseFloat(this.state.rating)+0.0001)/5} stopColor={Colors.COLOR_LIGHT_GRAY}></Stop>
                          <Stop offset="1" stopColor={Colors.COLOR_LIGHT_GRAY}></Stop>
                        </LinearGradientSvg>
                      </Defs>
                      <Path
                        fill="url(#LinearGradient1)"
                        d="M12.947,16L8,12.861L3.053,16l1.31-5.92L0,6.104l5.754-0.517L8,0l2.246,5.575L16,6.092l-4.363,3.976
                          L12.947,16z M31.947,16L27,12.861L22.053,16l1.311-5.92L19,6.104l5.754-0.517L27,0l2.246,5.575L35,6.092l-4.363,3.976L31.947,16z
                           M50.947,16L46,12.861L41.053,16l1.311-5.92L38,6.104l5.754-0.517L46,0l2.246,5.575L54,6.092l-4.363,3.976L50.947,16z M69.947,16
                          L65,12.861L60.053,16l1.311-5.92L57,6.104l5.754-0.517L65,0l2.246,5.575L73,6.092l-4.363,3.976L69.947,16z M88.947,16L84,12.861
                          L79.053,16l1.311-5.92L76,6.104l5.754-0.517L84,0l2.246,5.575L92,6.092l-4.363,3.976L88.947,16z" 
                      />
                    </Svg>
                    <Text style={{color: Colors.COLOR_YELLOW, fontSize:responsiveFontSize(3), marginLeft: 20, justifyContent: 'center', alignItems: 'center'}}>
                      { this.state.rating }
                    </Text>
                  </View>
                </View>
                
                <View style={{flex: 1}}>
                </View>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.sendReviewBtn()}>
                  <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                    <View>
                      <View style={[buttonsStyles.buttonBig]}>
                        <Text style={buttonsStyles.buttonBigText}>Оставить отзыв</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableHighlight>
              </ScrollView>
            </View>
          </Modal>
      );
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      sendReview: (data) => sendReview(data),
    }, dispatch);
}

export default connect(
  state => {
    return {
      user: state.user,
    }
  }, mapDispatchToProps
)(ReviewModal);