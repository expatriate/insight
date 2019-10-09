// REGISTRATION page main styles
import {
    StyleSheet
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  mainSvg: {
    position: 'absolute',
    left: -2,
    right: -2,
    top: -2,
    bottom: -2,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  activity: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
  }
});
