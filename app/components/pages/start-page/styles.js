// REGISTRATION page main styles
import {
    StyleSheet
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  registrationContainer: {
    backgroundColor: Colors.COLOR_WHITE,
    paddingHorizontal: responsiveWidth(10),
    flex: 1,
  },
  privacyText: {
    marginTop: responsiveHeight(4),
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_DARK_GRAY,
  },
  privacyLink: {
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_BLUE_LINK,
    fontWeight: 'bold'
  }
});