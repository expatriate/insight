import {
  StyleSheet
} from 'react-native';
import { Colors } from './colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
inputContainer: {
  width: '100%',
  marginBottom: responsiveHeight(2),
  position: 'relative',
},
inputText: {
  width: '100%',
  textAlign: 'left',
  backgroundColor: Colors.COLOR_DARK_GREEN,
  color: Colors.COLOR_WHITE,
  fontSize: responsiveFontSize(2.1),
  // lineHeight: responsiveFontSize(2.1),
  // paddingVertical: responsiveWidth(3),
  paddingHorizontal: responsiveWidth(5),
  borderRadius: 5,
  height: 44
},
inputText_white: {
  flex: 1,
  textAlign: 'left',
  backgroundColor: Colors.COLOR_WHITE,
  color: Colors.COLOR_BLACK,
  fontSize: responsiveFontSize(1.9),
  lineHeight: responsiveFontSize(2),
  paddingVertical: responsiveWidth(2),
  paddingHorizontal: responsiveWidth(3),
  borderRadius: 5,
  height: 44
},
formInputText: {
  flex: 1,
  textAlign: 'left',
  color: Colors.COLOR_BLACK,
  fontSize: responsiveFontSize(1.9),
  lineHeight: responsiveFontSize(2),
  paddingVertical: responsiveWidth(2),
  paddingHorizontal: responsiveWidth(3),
  borderRadius: 5,
  height: 44
},
formInputText__multy: {
  textAlignVertical: 'top',
  textAlign: 'left',
  color: Colors.COLOR_BLACK,
  fontSize: responsiveFontSize(1.9),
  lineHeight: responsiveFontSize(2),
  paddingVertical: responsiveWidth(2),
  paddingHorizontal: responsiveWidth(3),
  borderRadius: 5,
  height: 44
},
inputTextarea: {
  textAlignVertical: 'top',
  width: '100%',
  textAlign: 'left',
  fontSize: responsiveFontSize(2.1),
  lineHeight: responsiveFontSize(2.1),
  paddingVertical: 0,
  paddingHorizontal: 0,
  color: Colors.COLOR_DARK_GRAY,
  borderRadius: 5,
  height: 44
},
textarea: {
  paddingVertical: responsiveWidth(5),
  paddingHorizontal: responsiveWidth(5),
},
inputText_bordered: {
  borderWidth: 1,
  borderColor: Colors.COLOR_LIGHT_GRAY,
  borderRadius: 5,
},
rightInputIcon: {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection:'column',
  position: 'absolute',
  top: 0,
  right:responsiveWidth(3),
  bottom: 0,
},


checkboxContainer: {
  width: '100%',
  marginBottom: responsiveHeight(5),
},
checkboxText: {
  fontSize: responsiveFontSize(2.1),
  color: Colors.COLOR_WHITE,
  paddingLeft: 8,
  top: 10, 
},
checkboxText_dark: {
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2),
  color: Colors.COLOR_BLACK_08,
  paddingLeft: 2,
},
checkboxText_light: {
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2),
  color: Colors.COLOR_WHITE,
  paddingLeft: 2,
},
checkboxTitle_dark: {
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2),
  color: Colors.COLOR_BLACK_08,
  paddingLeft: 2,
  fontWeight: 'bold'
},
checkboxTitle_light: {
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2),
  color: Colors.COLOR_WHITE,
  paddingLeft: 2,
  fontWeight: 'bold'
},

checkboxContainer_smmg: {
  width: '80%',
  marginLeft: responsiveWidth(10),
  marginBottom: responsiveHeight(2),
},

checkboxContainer__normal: {

},

normalTitle__black: {
  marginTop: responsiveWidth(2),
  color: Colors.COLOR_DARK_GRAY,
  fontSize: responsiveFontSize(1.8),
  marginBottom: responsiveWidth(1)
},



picker: {
  textAlign: 'left',
  paddingVertical: 0,
  paddingHorizontal: responsiveWidth(5),
  fontSize: responsiveFontSize(2.1),
  lineHeight: responsiveFontSize(2.1),
  height: 44,
},

picker2: {
  textAlign: 'left',
  paddingVertical: 0,
  paddingHorizontal: responsiveWidth(5),
  height: 44,

},
picker2Text: {
  textAlign: 'left',
  paddingTop: 12,
  fontSize: responsiveFontSize(2.1),
  lineHeight: responsiveFontSize(2.1),
},
pickerDropdown: {
  width: 127,
  height: 88,
  paddingVertical: responsiveWidth(5),
  paddingHorizontal: responsiveWidth(5),
  fontSize: responsiveFontSize(2.1),
  lineHeight: responsiveFontSize(2.1),

},
pickerElement: {
  paddingHorizontal: responsiveWidth(5),
  height: 44,
},
pickerWrap: {
  borderWidth: 1,
  borderColor: Colors.COLOR_LIGHT_GRAY,
  borderRadius: 5,
},

pickerWrap__disabled: {
  borderWidth: 1,
  borderColor: Colors.COLOR_ULTRA_LIGHT_GRAY,
  borderRadius: 5,
},

tags: {
  justifyContent: 'flex-start',
  backgroundColor: Colors.COLOR_WHITE,
  borderRadius: 5,
  padding: responsiveWidth(5)
},
tags_item: {
  borderRadius: 5,
  paddingVertical: 3,
  paddingHorizontal: 5,
  backgroundColor: Colors.COLOR_BLACK_08,
  marginRight: 5,
  marginBottom: 5
},
tags_item_inactive: {
  borderRadius: 5,
  paddingVertical: 3,
  paddingHorizontal: 5,
  backgroundColor: Colors.COLOR_BLACK_04,
  marginRight: 5,
  marginBottom: 5
},
tags_text: {
  color:Colors.COLOR_WHITE,
  fontSize: responsiveFontSize(1.8),
},
tags_input: {
  backgroundColor: Colors.COLOR_WHITE
},






editableTitle: {
  borderRadius: 3,
  paddingVertical: 3,
  paddingHorizontal: 5,
  borderWidth: 1,
  color: Colors.COLOR_DARKERS_GRAY,
  borderColor: Colors.COLOR_LIGHT_GRAY,
  fontSize: responsiveFontSize(2),
  lineHeight: responsiveFontSize(2.5),
  fontWeight: 'bold',
  height: 44
},
noteditableTitle: {
  borderColor: Colors.COLOR_ULTRA_LIGHT_GRAY,
  borderRadius: 3,
  paddingVertical: 3,
  paddingHorizontal: 5,
  borderWidth: 1,
  color: Colors.COLOR_LIGHTDARK_GRAY,
  fontSize: responsiveFontSize(2),
  lineHeight: responsiveFontSize(2.5),
  fontWeight: 'bold',
  height: 44
},
editableTextInput: {
  borderRadius: 3,
  paddingVertical: 3,
  paddingHorizontal: responsiveWidth(5),
  borderWidth: 1,
  color: Colors.COLOR_DARKERS_GRAY,
  borderColor: Colors.COLOR_LIGHT_GRAY,
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2.2),
  height: 44
},
noteditableTextInput: {
  borderColor: Colors.COLOR_ULTRA_LIGHT_GRAY,
  borderRadius: 3,
  paddingVertical: 3,
  paddingHorizontal: responsiveWidth(5),
  borderWidth: 1,
  color: Colors.COLOR_LIGHTDARK_GRAY,
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2.2),
  height: 44
},
editableDatePicker_container: {
  borderRadius: 3,
  paddingVertical: 6,
  paddingHorizontal: responsiveWidth(3),
  borderWidth: 1,
  borderColor: Colors.COLOR_LIGHT_GRAY,
},
noteditableDatePicker_container: {
  borderRadius: 3,
  paddingVertical: 6,
  paddingHorizontal: responsiveWidth(3),
  borderWidth: 1,
  borderColor: Colors.COLOR_ULTRA_LIGHT_GRAY,
},
editableDatePicker_text: {
  color: Colors.COLOR_DARKERS_GRAY,
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2.2),
},
noteditableDatePicker_text: {
  color: Colors.COLOR_LIGHTDARK_GRAY,
  fontSize: responsiveFontSize(1.8),
  lineHeight: responsiveFontSize(2.2),
},
});