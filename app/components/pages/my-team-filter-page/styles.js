// PROFILE page main styles
import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  searchContainer: {
    backgroundColor: Colors.COLOR_WHITE,
  },
  wrapper: {
    padding: responsiveWidth(5),
    margin: responsiveWidth(5),
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingVertical: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY,
    alignItems: 'center'
  },
  tags: {
    flexWrap:'wrap',
    flexDirection: 'row',
    flex: 1
  },
  tag_text: {
    color: Colors.COLOR_DARKERS_GRAY,
    lineHeight: responsiveFontSize(2.5),
    fontSize: responsiveFontSize(1.8),
    backgroundColor: Colors.COLOR_LIGHT_BLUE_2,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    marginRight: 8,
  },
  specText: {
    color: Colors.COLOR_LIGHTDARK_GRAY,
    opacity: 0.8,
    fontSize: responsiveFontSize(1.9),
    lineHeight: responsiveFontSize(2.2),
  }

});