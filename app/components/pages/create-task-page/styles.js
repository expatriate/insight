// PROFILE page main styles
import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  mainTitle: {
    backgroundColor: Colors.COLOR_BLOCK_BG_LIGHT,
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveWidth(1),
    paddingTop: responsiveWidth(5),
  },
  profileContainer: {
    backgroundColor: Colors.COLOR_BLOCK_BG_LIGHT,
  },
  tagsTitle: {
    fontSize: responsiveFontSize(1.9),
    lineHeight: responsiveFontSize(2.5),
    marginTop: responsiveWidth(1.2),
    marginBottom: responsiveWidth(2),
    textAlign:'center',
    fontWeight: 'bold'
  },
  tagsTitle_white: {
    color: Colors.COLOR_WHITE,
  },
  tagsTitle_grey: {
    color: Colors.COLOR_DARKERS_GRAY,
  },

  block_light: {
    backgroundColor: Colors.COLOR_BLOCK_BG_LIGHT,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
  },
  block_dark: {
    backgroundColor:'rgba(50,73,85, 0.8)',
    paddingVertical: responsiveWidth(2),
  },
  popular_container: {
    paddingHorizontal: responsiveWidth(5),
    width: responsiveWidth(500),
    flexWrap: 'wrap',
  },
  tag: {
    paddingTop:5,
    paddingBottom: 6,
    paddingHorizontal:12,
    marginBottom: 8,
    marginRight: 8,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 5,
  },
  tag_text: {
    color: Colors.COLOR_DARKERS_GRAY,
    lineHeight: responsiveFontSize(2.5),
    fontSize: responsiveFontSize(1.8),
  },
  tag_text_active: {
    color: Colors.COLOR_WHITE,
  },
  tag_main: {
    paddingHorizontal: responsiveWidth(5),
  },
  tagTitle: {
    backgroundColor: Colors.COLOR_WHITE,
    marginBottom: responsiveWidth(2),
    paddingVertical: responsiveWidth(2),
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  tag_sub: {
    paddingVertical: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(5),
  },
  type_sub_active: {
    backgroundColor: "#123321",
  },
  middleTitle: {
    marginTop: responsiveWidth(5),
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveWidth(1)
  },
  normalTitle: {
    flex: 1,
    marginTop: responsiveWidth(2),
    lineHeight: responsiveFontSize(2.8),
    color: Colors.COLOR_DARK_GRAY,
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveWidth(1.8)
  },
  normalTitle_results: {
    flex: 1,
    marginTop: responsiveWidth(1.8),
    lineHeight: responsiveFontSize(2.2),
    color: Colors.COLOR_DARK_GRAY,
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveWidth(1.6)
  },
  normalTitle_bold: {
    color: Colors.COLOR_DARKERS_GRAY,
    fontSize: responsiveFontSize(2.3),
    marginTop: responsiveWidth(2),
    lineHeight: responsiveFontSize(2.3),
    marginBottom: responsiveWidth(1),
    fontWeight: 'bold'
  },
  normalTitle_active: {
    color: Colors.COLOR_WHITE,
  },
  titleStep: {
    color: Colors.COLOR_LIGHT_BLUE,
    fontSize: responsiveFontSize(5),
    lineHeight: responsiveFontSize(5.2),
    height: responsiveFontSize(5.2),
  },
  bigTitle: {
    color:Colors.COLOR_DARKERS_GRAY,
    fontSize:responsiveFontSize(2.4),
    marginTop: responsiveWidth(3.5),
    marginBottom: responsiveWidth(3),
    fontWeight: 'bold'
  },
  bigTitle_counter: {
    fontSize:responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(3),
  },
  block_search: {
    position: 'relative'
  },
  searchContainer: {
    marginTop: -2,
    borderTopWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY,
    backgroundColor: Colors.COLOR_WHITE,
    zIndex: 999,
  },
  emptyText: {
    color:Colors.COLOR_LIGHT_GRAY,
    fontSize: responsiveFontSize(1.8),
    lineHeight: responsiveFontSize(2),
    textAlign: 'center',
    paddingVertical: responsiveWidth(5),
  },
  editContainerControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80
  },
  details: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(1),
    paddingBottom: responsiveWidth(5),
    margin: responsiveWidth(5),
    marginBottom: 0,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 4,
    zIndex: 0,
    position: 'relative',
    flex: 1,

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
  paidTask: {
    backgroundColor: Colors.COLOR_SALAD_GREEN, 
    marginBottom: 10,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(3),
    borderRadius: 4
  },
  taskType: {
    marginBottom: 10,
    padding: responsiveWidth(5),
    borderRadius: 4
  },
  checkboxText_light: {
    paddingLeft: 48,
    color: Colors.COLOR_WHITE 
  },
  checkboxText_dark: {
    paddingLeft: 48,
    color: Colors.COLOR_LIGHTDARK_GRAY
  }
});