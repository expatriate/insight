// PROFILE page main styles
import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.COLOR_WHITE,
  },
  linkText: {
    color: Colors.COLOR_LIGHT_BLUE,
    fontSize: responsiveFontSize(1.7)
  },
  textSmall: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.COLOR_LIGHTDARK_GRAY
  },
  textMiddle: {
    fontSize: responsiveFontSize(2),
  },
  textGreen: {
    color: Colors.COLOR_GREEN,
  },
  textBlue: {
    color: Colors.COLOR_LIGHT_BLUE
  },
  wrapper: {
    padding: responsiveWidth(5),
    margin: responsiveWidth(5),
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
  },
  itemsContainer: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  top_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
    marginBottom: 5,
  },
  top_wrapper_btns: {
    width: '100%',
    paddingBottom: responsiveHeight(1),
    paddingTop: responsiveHeight(1),
    backgroundColor: Colors.COLOR_LIGHT_BLUE,
  },
  nullDatacontainer_text: {
    color:Colors.COLOR_LIGHTDARK_GRAY,
    textAlign:'center',
    fontSize: responsiveFontSize(1.8),
    lineHeight: responsiveFontSize(2),
    marginBottom: responsiveWidth(1),

  },
  nullDatacontainer: {
    marginTop: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(5),
  },
  tabHead_active: {
    color: Colors.COLOR_DARK_GRAY,
    fontWeight: 'bold',
  },
  tabHeadc_active: {
    color: Colors.COLOR_DARK_GRAY,
    fontSize:responsiveFontSize(2.1)
  },
  tabHeadc: {
    color: Colors.COLOR_WHITE,
    fontSize:responsiveFontSize(2.1)
  },
  tabHeadb: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(2),
    marginLeft: 10,
  },
  tabHeadb_active: {
    marginLeft: 10,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 4,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(2),
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
  },
  tabHead: {
    fontSize: responsiveFontSize(2),
    paddingBottom: responsiveHeight(1),
    color: Colors.COLOR_WHITE,
    fontWeight: 'bold',
  },

});