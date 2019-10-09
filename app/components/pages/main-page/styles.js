import {
    StyleSheet
} from 'react-native';

import { Colors } from '../../styles/colors';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  header: {
    backgroundColor: Colors.COLOR_DARK_RED,
    ...ifIphoneX({
        paddingTop: 30,
    }, {
        paddingTop: 20
    }),
    flexDirection: 'row',
    alignItems: 'center'
  },
  headButton: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  nullText: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    fontSize: responsiveFontSize(2.2),
    textAlign: 'center'
  },
  headButtonText: {
    color: Colors.COLOR_WHITE,
    textAlign: 'center',
  },
  selected: {
    //backgroundColor: Colors.COLOR_BLACK_02
  },
  headContainer: {
    width: '50%',
    marginVertical: 10
  },
  headTitle: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2.6),
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center'
  },
  rowFront: {
    backgroundColor: Colors.COLOR_WHITE,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backTextWhite: {
    color: Colors.COLOR_RED,
    fontSize: responsiveFontSize(1.8),
    marginTop: 10
  },
  backRightBtnRight: {
    padding: 5,
    width: 75,
    height: '100%',
  },
  backRightBtnLeft: {
    backgroundColor: Colors.COLOR_WHITE,
    height: '100%',
    flex: 1
  },
  markBtn: {
    width: 75,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  swipeList: {
    flex: 1
  },
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  card: {
    marginTop:10,
    marginHorizontal: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_BLACK_02,
  },
  title: {
    fontSize: responsiveFontSize(2.4),
    marginBottom: 4,
    color: Colors.COLOR_BLACK,
  },
  round: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.COLOR_BLACK_04,
  },
  number: {
    fontSize: responsiveFontSize(2.2),
    color: Colors.COLOR_DARK_RED,
    marginBottom: 4,
  },
  city: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.COLOR_BLACK_04,
    marginBottom: 4,
  },
  citytext: {
    color: Colors.COLOR_BLACK,
    fontSize: responsiveFontSize(2),
  },
  user: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.COLOR_BLACK_04,
    marginBottom: 4,
  },
  usertext: {
    color: Colors.COLOR_BLACK,
    fontSize: responsiveFontSize(2),
  },

  redCircle: {
    width: 9,
    height: 9,
    backgroundColor: Colors.COLOR_RED,
    borderRadius: 10,
    marginTop: 8,
    marginRight: 10
  }
});
