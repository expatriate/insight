import {
    StyleSheet
} from 'react-native';
import { Colors } from './colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  touchWrapper: {
    width: '100%',
  },
  buttonWrapper: {
    paddingHorizontal: responsiveWidth(10)
  },

  round: {
    borderRadius: responsiveWidth(10),
  },

  
  buttonBig: {
    borderRadius: responsiveWidth(10),
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(2),
    alignItems: 'center'
  },
  buttonBig__bigpad: {
    paddingHorizontal: responsiveWidth(6),
  },
  buttonBigText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.4),
    color: Colors.COLOR_WHITE,
    fontWeight: '600'
  },

  buttonMiddle: {
    borderRadius: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(1),
    alignItems: 'center'
  },
  buttonMiddleText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
    color: Colors.COLOR_WHITE,
  },
  buttonMiddleText_blue: {
    color: Colors.COLOR_LIGHT_BLUE_MENU,
  },
  buttonMiddleText_grey: {
    color: Colors.COLOR_LIGHT_GRAY,
  },

  buttonGray: {
    backgroundColor: Colors.COLOR_MEDIUM_GRAY,
    borderRadius: responsiveWidth(3),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(5),
  },
  buttonGrayText: {
    textAlign: 'left',
    color: Colors.COLOR_DARK_GRAY,
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    position: 'relative'
  },

  buttonWhiteText: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2.2),
  },

  buttonBlueText: {
    color: Colors.COLOR_LIGHT_BLUE,
    fontSize: responsiveFontSize(2.2),
  },
  buttonWhite: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.COLOR_WHITE,
    paddingVertical: responsiveHeight(2),
    //paddingHorizontal: responsiveWidth(10),

  },

  buttonGreen: {
    borderColor: Colors.COLOR_GREEN,
    backgroundColor: Colors.COLOR_GREEN
  },

  buttonBlue: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.COLOR_LIGHT_BLUE,
    paddingVertical: responsiveHeight(2),
    //paddingHorizontal: responsiveWidth(10),

  },

  textSizeH: {
    fontSize: responsiveFontSize(2),
  },
  buttonGrayArrow: {
  },
  buttonGrayIcon: {
  },


  buttonLined: {
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 1
  },
  blue: {
    color: Colors.COLOR_LIGHT_BLUE,
    borderColor: Colors.COLOR_LIGHT_BLUE,
  },
  buttonMidSize: {
    fontSize: responsiveFontSize(1.8)
  }


});