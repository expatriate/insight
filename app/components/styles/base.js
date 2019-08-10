import {
  StyleSheet
} from 'react-native';
import { Colors } from './colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
container: {
  flex: 1,
},
contentContainer: {
  flex: 1,
},

flex: {
  flex: 1,
},

row: {
  flex: 1,
  flexDirection: 'row',
},
col: {
  flex: 1,
  flexDirection: 'column'
},
contentAtCenter: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection:'column',
  width: '100%',
},
half: {
  width: '50%',
},
right: {
  justifyContent: 'flex-end'
},
left: {
  justifyContent: 'flex-start'
},
verticalCenter: {
  alignItems: 'center'
},
horizontalCenter: {
  justifyContent: 'center',
},
contentSpaceBetween: {
  justifyContent: 'space-between'
},

alertTitle: {
  fontSize: responsiveFontSize(2), 
  textAlign: 'left', 
  paddingBottom: responsiveHeight(2),
  fontWeight: 'bold', 
  color: Colors.COLOR_WHITE, 
  backgroundColor: 'transparent'
},
messageAlertStyle: {
  fontSize: responsiveFontSize(1.8), 
  lineHeight: responsiveFontSize(2), 
  textAlign: 'left',
  color: Colors.COLOR_WHITE, 
  backgroundColor: 'transparent'
},
defaultAlertTextContainer: {
  flex: 1, 
  padding: responsiveWidth(2)
},
imageAlertStyle: {
  padding: 8,
  marginHorizontal: 16,
  width: 36, 
  height: 36, 
  alignSelf: 'center'
},

bordered: {
  borderBottomWidth: 1,
  borderColor: Colors.COLOR_LIGHT_GRAY,
  padding: responsiveHeight(2),
},

mb_4: {
  marginBottom: responsiveHeight(4),
},

disabled: {
  opacity: 0.3,
},

splitter: {
  borderBottomWidth: 1,
  borderColor: Colors.COLOR_ULTRA_LIGHT_GRAY,
  marginVertical: responsiveWidth(6),
  marginHorizontal: responsiveWidth(5),
},

splitter_smlmg: {
  borderBottomWidth: 1,
  borderColor: Colors.COLOR_ULTRA_LIGHT_GRAY,
  marginVertical: responsiveWidth(1),
  marginHorizontal: responsiveWidth(5),
},

splitter_dark: {
  borderColor: Colors.COLOR_DARK_GRAY_1,
},

splitter_full: {
  borderBottomWidth: 1,
  borderColor: Colors.COLOR_SPLITTER,
},
splitter_full_smlmg: {
  marginVertical: responsiveWidth(2),
  borderColor: Colors.COLOR_ULTRA_LIGHT_GRAY,
},


midText: {
  color: Colors.COLOR_DARKERS_GRAY,
  fontSize: responsiveFontSize(1.9),
  lineHeight: responsiveFontSize(2.5),
  marginTop: responsiveWidth(1.2),
},
midText_gray: {
  color: Colors.COLOR_LIGHTDARK_GRAY,
},
midText_white: {
  color: Colors.COLOR_WHITE,
},
midText_nextline:{
  marginTop: 0,
},

smallText: {
  color: Colors.COLOR_LIGHTDARK_GRAY,
  fontSize: responsiveFontSize(1.7),
  lineHeight: responsiveFontSize(2.3),
  marginTop: responsiveWidth(1.2),
  marginBottom: responsiveWidth(1.2),
},
smallText_black: {
  color: Colors.COLOR_DARKERS_GRAY,
},

bigText: {
  color: Colors.COLOR_DARKERS_GRAY,
  fontSize: responsiveFontSize(2.2),
  lineHeight: responsiveFontSize(3),
  fontWeight: 'bold',
  marginTop: responsiveWidth(1.2),
},

titleText: {
  color: Colors.COLOR_DARKERS_GRAY,
  fontSize: responsiveFontSize(2.8),
  lineHeight: responsiveFontSize(3),
  fontWeight: 'bold',
  marginTop: responsiveWidth(1.2),
},

timeText: {
  color: Colors.COLOR_LIGHTDARK_GRAY,
  fontSize: responsiveFontSize(1.5),
  lineHeight: responsiveFontSize(1.5),
},

tag: {
  borderRadius: 5,
  backgroundColor: Colors.COLOR_LIGHT_BLUE_2,
  fontSize: responsiveFontSize(1.6),
  color: Colors.COLOR_DARKERS_GRAY,
  paddingVertical: responsiveWidth(1),
  paddingHorizontal: responsiveWidth(2),
  marginRight: 4,
},
tag_multiline: {
  marginBottom: 4,
},
overflowEnd: {
  position: 'absolute',
  top: 0,
  right: 0,
  height: '100%',
  width: 30
},
overflowStart: {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: 30
}
});