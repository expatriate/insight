import {
    StyleSheet
} from 'react-native';

import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  header: {
    backgroundColor: Colors.COLOR_RED,
    paddingTop: 44,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  headButton: {
    width: 60,
    backgroundColor: Colors.COLOR_WHITE,
    justifyContent: 'center',
  },
  headTitle: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2.6),
    fontWeight: 'bold',
    paddingVertical: 10
  },
  rowFront: {
    backgroundColor: Colors.COLOR_WHITE,
    paddingVertical: 10
  },
  swipeList: {
  },
  main: {
  },
  title: {
    fontSize: responsiveFontSize(2.4),
    marginBottom: 2,
    color: Colors.COLOR_BLACK,
  }
});
