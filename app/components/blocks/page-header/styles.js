import {
    StyleSheet,
    Platform
} from 'react-native';

import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  top_container: {
    backgroundColor: Colors.COLOR_WHITE
  },
  top_container_dark: {
    backgroundColor: '#274554',
  },
  top_container_light: {
    backgroundColor: Colors.COLOR_BLOCK_BG_LIGHT,
  },
  top_title: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  top_title_dark: {
    textAlign: 'left',
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_WHITE,
  },
  top_title_light: {
    textAlign: 'left',
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_DARKERS_GRAY,
  },
  clearContainer: {
    width: 32,
    height: 32,
  },
  svg_dark: {
  },
  svg_light: {
  },
  top_title_container:{
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10
  },
  pageHeader: {
  },
  buttonWrapper: {
    marginHorizontal: 8
  }
});