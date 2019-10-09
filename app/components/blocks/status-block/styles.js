import {
    StyleSheet,
    Platform
} from 'react-native';

import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  GRAY_STATUS: {
    textAlign: 'center',
    color: Colors.COLOR_LIGHT_GRAY,
    fontSize: responsiveFontSize(2),
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY,
    backgroundColor: Colors.COLOR_WHITE,
    padding: 5,
    borderRadius: 5
  },
  GREEN_STATUS: {
    textAlign: 'center',
    color: Colors.COLOR_GREEN,
    fontSize: responsiveFontSize(2),
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.COLOR_GREEN,
    backgroundColor: Colors.COLOR_GREEN_04,
    padding: 5,
    borderRadius: 5
  },
  YELLOW_STATUS: {
    textAlign: 'center',
    color: Colors.COLOR_YELLOW,
    fontSize: responsiveFontSize(2),
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.COLOR_YELLOW,
    backgroundColor: Colors.COLOR_YELLOW_04,
    padding: 5,
    borderRadius: 5
  },
  RED_STATUS: {
    textAlign: 'center',
    color: Colors.COLOR_RED,
    fontSize: responsiveFontSize(2),
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.COLOR_RED,
    backgroundColor: Colors.COLOR_RED_04,
    padding: 5,
    borderRadius: 5
  },
  BLUE_STATUS: {
    textAlign: 'center',
    color: Colors.COLOR_BLUE,
    fontSize: responsiveFontSize(2),
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.COLOR_BLUE,
    backgroundColor: Colors.COLOR_BLUE_04,
    padding: 5,
    borderRadius: 5
  },
});
