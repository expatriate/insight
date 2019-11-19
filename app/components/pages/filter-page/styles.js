import {
    StyleSheet, Platform
} from 'react-native';

import { Colors } from '../../styles/colors';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1
  },
  header: {
    backgroundColor: Colors.COLOR_DARK_RED,
    ...ifIphoneX({
        paddingTop: Platform.OS === 'ios' ? 30 : 0
    }, {
        paddingTop: Platform.OS === 'ios' ? 20 : 0
    }),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  headButton: {
    width: 60,
    justifyContent: 'center',
  },
  headButtonText: {
    color: Colors.COLOR_WHITE,
  },
  headTitle: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2.6),
    fontWeight: 'bold',
    paddingVertical: 15
  },
  rowFront: {
    backgroundColor: Colors.COLOR_WHITE,
  },
  filter: {
    paddingHorizontal: 15,
    flex: 1
  },
  line: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_BLACK_01,
    alignItems: 'center',
    marginTop: 10,
  },
  def: {
    width: '40%',
    color: Colors.COLOR_BLACK_04,
    fontSize: responsiveFontSize(2)
  },
  picker: {
    flex: 1
  },

  inputIOS: {
    fontSize: responsiveFontSize(2),
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: responsiveFontSize(2),
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  bottom: {
    paddingHorizontal: 40,
    paddingVertical: 20
  }
});
