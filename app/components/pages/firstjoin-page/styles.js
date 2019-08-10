// FIRST JOIN page main styles
import {
    StyleSheet,
    Platform
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  firstjoinContainer: {
    backgroundColor: Colors.COLOR_WHITE,
    paddingHorizontal: responsiveWidth(10),
    flex: 1,
  },
  wrapper: {
  },
  restoreText: {
    marginTop: responsiveHeight(4),
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: Colors.COLOR_LIGHT_GRAY,
  },
  slide: {
    paddingTop: responsiveHeight(8),
    //paddingHorizontal: responsiveWidth(6),
    flex: 1,
    width: responsiveWidth(100),
    paddingBottom: responsiveHeight(40),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(2.9),
    color: Colors.COLOR_WHITE,
    fontWeight: 'bold',
    height: responsiveHeight(5),
  },
  text: {
    color: '#fff',
    fontSize: responsiveFontSize(2.1),
    lineHeight: responsiveFontSize(3),
    paddingHorizontal: responsiveWidth(5),
    textAlign: 'center',
    marginTop: responsiveHeight(2),
    height: responsiveHeight(12),
  },
  top: {
    flex: 1
  },
  video_container: {
    width: responsiveWidth(80),
    height: responsiveHeight(28),
    marginTop: responsiveHeight(4),

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      }
    }),
  },
  icon_container: {
    width: '100%',
    //height: responsiveWidth(60),
    marginTop: responsiveHeight(2),
    /*justifyContent: 'center',*/
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    height: responsiveHeight(28),
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottom_wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotStyle: {
    bottom: responsiveHeight(25),
    marginLeft: 10,
    marginRight: 10,
    width: 14,
    height: 14,
    borderRadius: 14,
  },
  dotStyleActive: {
    backgroundColor: Colors.COLOR_LIGHT_BLUE,
    bottom: responsiveHeight(25),
    marginLeft: 10,
    marginRight: 10,
    width: 14,
    height: 14,
    borderRadius: 14,
  }
});