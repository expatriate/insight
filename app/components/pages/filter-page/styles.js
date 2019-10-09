import {
    StyleSheet
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
        paddingTop: 30,
    }, {
        paddingTop: 20
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
    paddingVertical: 10
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_BLACK_01,
    marginTop: 10
  },
  def: {
    width: '40%',
    color: Colors.COLOR_BLACK_04,
    fontSize: responsiveFontSize(2)
  },
  picker: {
    width: '60%',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },

  bottom: {
    paddingHorizontal: 40,
    paddingVertical: 20
  }
});
