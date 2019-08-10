import {
    StyleSheet
} from 'react-native';

import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  menu: {
    flex: 1,
    marginTop: responsiveHeight(0),
    alignItems:'center'
  },
  menuContainer: {
    paddingHorizontal: 20,
    backgroundColor: Colors.COLOR_DARKERS_GRAY,
    borderTopWidth: 10,
    borderColor: Colors.COLOR_DARK_GRAY_3,
  },
  menu__item: {
    width: '100%',
    paddingVertical: responsiveWidth(3),
    borderTopWidth: 1,
    borderColor: Colors.COLOR_DARK_GRAY,
    textAlign: 'left',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu__item_flex: {
    justifyContent: 'space-between'
  },
  menu__item_exit: {
    paddingLeft: 21,
    borderLeftWidth: 1,
    borderColor: Colors.COLOR_DARK_GRAY,
  },
  menu__item_exitText: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.COLOR_DARK_GRAY_4,
  },
  menu__name: {
    fontSize:responsiveFontSize(2),
    color: Colors.COLOR_WHITE,
  },
  name: {
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_WHITE,
    flex: 1,
    marginLeft: responsiveWidth(2)
  },
  counter: {
    backgroundColor: Colors.COLOR_DARK_GRAY,
    borderRadius: 3,
  },
  counter_text: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.COLOR_WHITE,
    paddingTop: 0,
    paddingBottom: 2,
    paddingHorizontal: 8,
  },
  menu__profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    marginBottom: responsiveWidth(3),
    marginTop: responsiveWidth(3),
    marginRight: responsiveWidth(3),
    borderWidth: 2,
    borderColor: Colors.COLOR_LIGHT_BLUE
  },
  menu_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.COLOR_DARK_GRAY_1,
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 20
  },
  menu_header_subitem: {
    backgroundColor: Colors.COLOR_DARK_GRAY_2,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(2),
    flexDirection: 'column'
  },
  header_ourteam: {
    flex: 1,
    textAlign: 'right',
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(1.5),
    lineHeight: responsiveFontSize(2),
  },
  menu_header_subitem_text: {
    color:Colors.COLOR_LIGHT_BLUE_1,
    fontSize: responsiveFontSize(2),
    paddingVertical: responsiveWidth(4),
    width: '100%'
  },
  menu_header_subitem_bordered: {
    borderTopWidth: 1,
    borderColor: Colors.COLOR_DARKERS_GRAY,
  },
  menu__plain: {
    borderTopWidth: 1,
    borderColor: Colors.COLOR_DARK_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(8),
  },
  menu__split: {
    backgroundColor: Colors.COLOR_DARK_GRAY_1,
    flexDirection: 'row',
    paddingVertical: 20,
  },
  menu__split__item: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1
  },
  menu__split__item__bordered: {
    borderLeftWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY_1,
  },
  menu__split__text: {
    fontSize: responsiveFontSize(2),
    textAlign: 'left',
    color: Colors.COLOR_WHITE,
  },
  menu_blue: {
    color:Colors.COLOR_LIGHT_BLUE_1,
  },
  menu__plain__text: {
    fontSize:responsiveFontSize(1.8),
    marginTop:responsiveWidth(2),
  },

























  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
});