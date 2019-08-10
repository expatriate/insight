// PROFILE page main styles
import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({

  taskContainer: {
    backgroundColor: Colors.COLOR_WHITE
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(5),
    paddingBottom: responsiveWidth(3),
  },
  catalogItemInfo: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(3),
  },
  mapContainer: {
    height: responsiveHeight(30),
    width: responsiveWidth(100),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  margins: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(2),
  },
  firstTag: {
    marginLeft: responsiveWidth(5),
  },
  map: {
   ...StyleSheet.absoluteFillObject,
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