import {
  StyleSheet,
  Platform
} from 'react-native';

import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
catalogItem_wrap: {
  position: 'relative',
},
catalogItem: {
  marginHorizontal: responsiveWidth(5),
  backgroundColor: Colors.COLOR_WHITE,
  borderRadius: 5,
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    }
  }),
  marginTop: responsiveWidth(2.5),
  marginBottom: responsiveWidth(2.5),
},
catalogItemClickable: {
  paddingHorizontal: responsiveWidth(5),
  paddingTop: responsiveWidth(3),
},
catalogItemData: {
  paddingHorizontal: responsiveWidth(5),
  paddingBottom: responsiveWidth(3),
},
catalogItemfooter: {
  flexDirection: 'row',
  backgroundColor: Colors.COLOR_LIGHT_BLUE_2,
  borderBottomLeftRadius: 5,
  borderBottomRightRadius: 5,
},
catalogItemInfo: {
  flexDirection: 'row',
  paddingHorizontal: responsiveWidth(5),
  paddingVertical: responsiveWidth(3),
},
tag: {
  borderRadius: 5,
  backgroundColor: Colors.COLOR_LIGHT_BLUE_2,
  fontSize: responsiveFontSize(1.6),
  color: Colors.COLOR_DARKERS_GRAY,
  paddingVertical: responsiveWidth(1),
  paddingHorizontal: responsiveWidth(2),
  marginRight: responsiveWidth(2)
},
author: {
  paddingTop: 4,
  paddingBottom: 3,
  paddingHorizontal: 8,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: Colors.COLOR_LIGHT_GRAY,
  color: Colors.COLOR_LIGHTDARK_GRAY,
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2),
  marginRight: 8
},
catalogItemStatus: {
  position: 'absolute',
  left:-5,
  width: 5,
  height: '100%',
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5
},
catalogItemWithStatus: {
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5,
  borderTopRightRadius: 5,
  borderTopLeftRadius: 0
},
textButton: {
  color: Colors.COLOR_LIGHT_BLUE,
  fontSize: responsiveFontSize(1.7),
  lineHeight: responsiveFontSize(1.7)
},
avatar_small: {
  width: responsiveWidth(12),
  height: responsiveWidth(12),
  borderRadius: responsiveWidth(6),
  marginRight: 10,
  borderWidth: 2,
  borderColor: Colors.COLOR_LIGHT_BLUE
},
});