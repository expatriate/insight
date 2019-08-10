import {
    StyleSheet,
    Platform
} from 'react-native';

import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  avatar: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    marginRight: 10,
    borderWidth: 2,
    borderColor: Colors.COLOR_LIGHT_BLUE
  },
  avatar_small: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: responsiveWidth(4),
    marginLeft: 10,
    borderWidth: 2,
  },
  refElImage: {
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(5),
    alignItems: 'center',
    flex: 1,
    paddingBottom: responsiveHeight(2),
    paddingTop: responsiveHeight(2),
  },
  containerWithPad: {
    paddingHorizontal: responsiveWidth(2),
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.COLOR_LIGHT_BLUE_2,
  },
  container2: {
    flex: 1
  },
  smallText: {
    color: Colors.COLOR_LIGHTDARK_GRAY,
    fontSize: responsiveFontSize(1.7),
    lineHeight: responsiveFontSize(1.8),
  },
  splitter: {
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY,
    marginVertical: responsiveWidth(1),
  },
  commentCount: {
    marginLeft: 4,
    color: Colors.COLOR_LIGHTDARK_GRAY,
    fontSize: responsiveFontSize(1.6),
  },
  spoilerContent: {
    /*paddingVertical: responsiveWidth(2),*/
    backgroundColor: Colors.COLOR_LIGHT_BLUE_2,
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  addUsers_text: {
    color:Colors.COLOR_LIGHTDARK_GRAY,
    textAlign: 'center',
    lineHeight: responsiveWidth(8)
  },
  addUsers: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    marginLeft: 10,
    alignItems: 'center',
  },
  textButton: {
    color: Colors.COLOR_LIGHT_BLUE,
    fontSize: responsiveFontSize(1.7),
    lineHeight: responsiveFontSize(1.7),
  },
  addinfoabout: {
    color: Colors.COLOR_LIGHTDARK_GRAY,
    fontSize: responsiveFontSize(1.7),
    marginTop: 4,
  },
  tagcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rating_spec: {
    fontWeight: 'bold',
    color: Colors.COLOR_YELLOW,
    fontSize: responsiveFontSize(1.6),
    marginLeft: 4
  },
  rating_spec_null: {
    fontSize: responsiveFontSize(1.6),
    marginLeft: 4,
    color: Colors.COLOR_LIGHTDARK_GRAY,
  }

});