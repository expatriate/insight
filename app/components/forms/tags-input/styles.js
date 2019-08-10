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
    marginLeft: responsiveWidth(2),
  },
  whiteBg: {
    backgroundColor: Colors.COLOR_WHITE,
  },
  tags: {
    flexDirection: 'column',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(3),
  },
  tag: {
    paddingTop:5,
    paddingBottom: 6,
    paddingHorizontal:12,
    marginBottom: 8,
    marginRight: 8,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 5,
  },
  tag_text: {
    color: Colors.COLOR_DARKERS_GRAY,
    lineHeight: responsiveFontSize(2.5),
    fontSize: responsiveFontSize(1.8),
  },
  tag_text_active: {
    color: Colors.COLOR_WHITE,
  },
  alert: {
    paddingHorizontal: responsiveWidth(3),
    color: Colors.COLOR_RED,
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
    marginBottom: responsiveWidth(3)
  },
  skill_main: {
    color: Colors.COLOR_GREEN
  },
  skill_inactive: {
    color: Colors.COLOR_INACTIVE_TAG
  }

});