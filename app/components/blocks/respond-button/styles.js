import {
    StyleSheet,
    Platform
} from 'react-native';

import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
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
    marginBottom: responsiveWidth(5),
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
  }
});