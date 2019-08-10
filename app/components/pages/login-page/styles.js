// LOGIN page main styles
import {
    StyleSheet
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  mainCointainer: {
  },
  free: {
    backgroundColor:Colors.COLOR_LIGHTDARK_GRAY
  },
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(10),
  },
  input: {
    borderColor: Colors.COLOR_ULTRA_LIGHT_GRAY,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 5,
    color: Colors.COLOR_LIGHTDARK_GRAY,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
  },
  inputButton_wrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  inputText: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2.4),
    textAlign: 'center'
  },
  inputButton: {
    borderRadius: 60,
    backgroundColor: Colors.COLOR_RED,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 100,
    height: 100,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
    position: 'relative',
  },
});
