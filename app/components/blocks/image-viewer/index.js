import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TextInput,
    Alert,
    Modal,
} from 'react-native';

import ImageView from 'react-native-image-zoom-viewer';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import {
  Colors,
  Gradients
} from '../../styles/colors.js';

class ImageViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        onRequestClose={() => this.props.close()}
      >
        <ImageView
          imageUrls={this.props.images}
          index={this.props.index}
          onSwipeDown={() => {
            this.props.close();
          }}
          enableSwipeDown={true}
        />
      </Modal>
    )
  }
};


export default ImageViewer;
