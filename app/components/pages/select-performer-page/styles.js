// PROFILE page main styles
import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ccdae3',
    flex: 1,
  },
  contentContainer: {
    margin: responsiveWidth(5),
    paddingBottom: responsiveWidth(5),
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 5,
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
  title: {
    padding: responsiveWidth(5),
  },
  performerBlock: {
    paddingHorizontal:responsiveWidth(5),
    paddingVertical: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar_small: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(8),
    marginRight: 10,
    borderWidth: 2,
    borderColor: Colors.COLOR_LIGHT_BLUE
  },
  rating_spec: {
    fontWeight: 'bold',
    color: Colors.COLOR_YELLOW,
    fontSize: responsiveFontSize(1.6),
    marginLeft: 4
  },
  rating_spec_null: {
    fontSize: responsiveFontSize(1.6),
    marginLeft: 4,
    color: Colors.COLOR_LIGHTDARK_GRAY,
  },















  top_wrapper: {
    backgroundColor: '#ccdae3',
    paddingHorizontal: responsiveWidth(15),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
  },
  top_wrapper_btns: {
    width: '100%',
    paddingBottom: responsiveHeight(3),
    paddingTop: responsiveHeight(4),
  },
  tabHead_active: {
    borderBottomWidth: 4,
    borderColor: Colors.COLOR_LIGHT_BLUE,
    color: Colors.COLOR_DARK_GRAY,
  },
  tabHead: {
    fontSize: responsiveFontSize(2),
    paddingBottom: responsiveHeight(1),
    color: Colors.COLOR_LIGHT_BLUE,
  },
  profile1: {
    backgroundColor:'rgba(50,73,85, 0.8)',
    width: '100%'
  },
  edit1: {
    backgroundColor:'rgba(50,73,85, 0.8)',
    width: '100%',
    paddingTop: responsiveWidth(7.5),
  },
  edit2: {
    backgroundColor: Colors.COLOR_LIGHT_BLUE_2
  },
  profile2: {
    backgroundColor:'rgba(34,68,85, 0.9)',
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    alignItems: 'center',
  },
  profile3: {
    backgroundColor:'rgba(97,78,66, 0.8)',
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    alignItems: 'center',
  },
  profile4: {
    backgroundColor:'rgba(59,127,131, 0.8)',
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    alignItems: 'center',
  },
  profile5: {
    backgroundColor:'rgba(57,74,83, 0.8)',
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    alignItems: 'center',
  },
  profile6: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(2),
  },
  profile7: {
    backgroundColor: Colors.COLOR_LIGHT_BLUE_2,
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(1),
  },

  educationImage: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    marginTop: responsiveWidth(5),
    marginRight: responsiveWidth(5),
  },
  profileAvatar_btn: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    position: 'relative',
    marginBottom: responsiveWidth(5),
  },
  profileAvatar: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(20),
    borderWidth: 2,
    borderColor: Colors.COLOR_LIGHT_BLUE
  },
  profileAvatar_lightbox: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(20),
    marginBottom: 10,
  },
  profileTitle: {
    color: Colors.COLOR_WHITE,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.3),
  },
  profileRight: {
    flex: 1,
    paddingLeft: responsiveWidth(4),
    paddingRight: responsiveWidth(2),
    paddingVertical: responsiveWidth(5),
  },
  profileLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: responsiveWidth(5),
    paddingVertical: responsiveWidth(5),
  },
  qr_title: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(1.8),
    width: responsiveWidth(15),
    textAlign: 'center',
  },
  status_title: {
    color: Colors.COLOR_LIGHT_BLUE,
    fontSize: responsiveFontSize(2.1),
    fontWeight: 'bold',
    marginTop: 5
  },

  skillContainer: {
    marginTop: responsiveHeight(3),
    flexWrap: 'wrap',
  },
  skill: {
    lineHeight: responsiveFontSize(2.5),
    fontSize: responsiveFontSize(1.8),
    color: Colors.COLOR_WHITE,
    backgroundColor: Colors.COLOR_BLACK_02,
    borderRadius: 5,
  },
  skill_main: {
    color: Colors.COLOR_GREEN
  },
  verifyContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_BLACK_02,
    marginTop: responsiveHeight(3),
    marginRight:responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 5,
  },
  verifyContainer_title: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(1.6),
    marginBottom: responsiveWidth(1),
  },
  verifyItems: {
    flexWrap: 'wrap',
  },
  verify_item: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  verify_title: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(1.6),
  },
  profile2_title: {
    fontSize:responsiveFontSize(2.3),
    color: Colors.COLOR_LIGHTDARK_GRAY,
    width: responsiveWidth(30)
  },
  profileAvatar_inteam: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(8),
    marginRight: 10,
    borderWidth: 2,
    borderColor: Colors.COLOR_LIGHT_BLUE
  },
  moreInTeam: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(8),
    backgroundColor: Colors.COLOR_MEDIUM_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  moreInTeamText: {
    color: Colors.COLOR_LIGHTDARK_GRAY,
    fontSize: responsiveFontSize(2),
  },
  big_label: {
    fontSize: responsiveFontSize(4),
    color: Colors.COLOR_LIGHT_GRAY,
  },
  addinfo_text: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(1.8),
  },
  addinfo_text_rating: {
    color: Colors.COLOR_YELLOW,
    fontSize: responsiveFontSize(1.8),
    paddingLeft: responsiveWidth(2.5),
    lineHeight: responsiveFontSize(2.1),
  },
  addinfo_title: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  blog_post: {
    padding: responsiveWidth(2),
    backgroundColor: Colors.COLOR_WHITE,
    width: '50%',
    borderRadius: 5,

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
  blog_post_len: {
    fontSize: responsiveFontSize(4),
    color: Colors.COLOR_LIGHT_BLUE,
    fontWeight: '100'
  },
  blog_post_text: {
    fontWeight:'bold',
    color: Colors.COLOR_DARKERS_GRAY,
    fontSize: responsiveFontSize(2),
    lineHeight: responsiveFontSize(2),
    width: responsiveWidth(20),
    marginLeft: responsiveWidth(4),
    marginTop: 3,
  },
  blog_post_title: {
    marginTop: responsiveWidth(0.8),
    paddingHorizontal: responsiveWidth(0.8),
    marginBottom: responsiveWidth(0.8),
    fontSize: responsiveFontSize(1.4),
    color: Colors.COLOR_LIGHTDARK_GRAY,
    fontWeight: '200',
  },
  blog_post_counters: {
    padding: responsiveWidth(0.8),
  },

  blog_post_counter: {
    padding: responsiveWidth(0.8),
  },
  nullDatacontainer_text: {
    color:Colors.COLOR_LIGHTDARK_GRAY,
    textAlign:'center',
    fontSize: responsiveFontSize(1.8),
    lineHeight: responsiveFontSize(2),
    marginBottom: responsiveWidth(1),
  },
  nullDatacontainer: {
    paddingHorizontal: responsiveWidth(5),
  },

});