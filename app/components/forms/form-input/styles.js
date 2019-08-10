import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({

  clearContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
    marginLeft: responsiveWidth(2)
  },
  whiteBg: {
    backgroundColor: Colors.COLOR_WHITE,
  }

});