import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({

  normalTitle: {
    marginTop: responsiveWidth(2),
    color: Colors.COLOR_DARK_GRAY,
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveWidth(1)
  },
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