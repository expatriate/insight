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
  bottom: {
    height: responsiveHeight(20),
    backgroundColor: Colors.COLOR_LIGHT_BLUE
  },
  container: {
    paddingHorizontal: responsiveWidth(10)
  },
  title: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
    color: Colors.COLOR_WHITE,
    textAlign: 'center'
  },
  titleContainer: {
    marginVertical: responsiveHeight(6),
    alignContent: 'center',
  },
  gologintext: {
    fontSize: responsiveFontSize(2.2),
    color: Colors.COLOR_WHITE,
    textAlign: 'center',
  },
  socialText: {
    marginTop: responsiveHeight(4),
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_WHITE,
    textAlign: 'center',
    marginBottom: responsiveHeight(2),
  },
});