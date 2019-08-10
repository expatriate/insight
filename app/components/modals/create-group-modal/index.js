import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Modal,
    Alert,
    ScrollView,
    Slider,
    StatusBar,
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
  createNewTeamGroup
} from '../../../actions';

class CreateGroupModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
          title: undefined,
        }

        this.writing = this.writing.bind(this);
        this.applyBtn = this.applyBtn.bind(this);
    }

    componentDidMount() {
      StatusBar.setHidden(true);
    }

    componentWillUnmount() {
      StatusBar.setHidden(false);
    }

    writing(type, text){
      switch(type) {
        case 'title':
          this.setState({
            title: text
          });
        break;
      }
    }

    applyBtn() {
      let data = {
        title: this.state.title,
      };

      this.props.createNewTeamGroup(data);
      this.props.close();
    }

    render() {
      return (
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.visible}
            onRequestClose={() => {
              this.props.close();
            }}>
            <View style={styles.modalMain_centered}>
              <View style={[styles.mainContent]}>
                <View style={[{flexDirection: 'row'}, baseStyles.verticalCenter]}>
                  <Text style={[baseStyles.bigText, {flex: 1}]}>Создать новую группу</Text>
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
                {/*<Text style={baseStyles.midText}>
                  Название
                </Text>*/}
                <FormInput 
                  multiline={true} 
                  name="title"
                  placeholder={'Введите название новой группы'}
                  style={{marginTop:20, marginBottom: 40}}
                  value={this.state.title}
                  writing={(text) => 
                    {this.writing('title', text)}
                  }/>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.applyBtn()}>
                  <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                    <View>
                      <View style={[buttonsStyles.buttonBig]}>
                        <Text style={buttonsStyles.buttonBigText}>Создать</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
      );
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      createNewTeamGroup: (data) => createNewTeamGroup(data),
    }, dispatch);
}

export default connect(
  state => {
    return {
      user: state.user,
    }
  }, mapDispatchToProps
)(CreateGroupModal);