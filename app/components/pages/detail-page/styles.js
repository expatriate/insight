// PROFILE page main styles
import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  header: {
    backgroundColor: Colors.COLOR_DARK_RED,
    ...ifIphoneX({
        paddingTop: Platform.OS === 'ios' ? 30 : 0
    }, {
        paddingTop: Platform.OS === 'ios' ? 20 : 0
    }),
    flexDirection: 'row',
    alignItems: 'center'
  },
  headContainer: {
    width: '72%',
    marginVertical: 10
  },
  card: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  headButton: {
    width: '14%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  headButtonText: {
    color: Colors.COLOR_WHITE,
    textAlign: 'center',
  },
  headNumber: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
    color: Colors.COLOR_WHITE
  },
  headTitle: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5
  },
  title: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.COLOR_BLACK_08,
  },
  maintext: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.COLOR_BLACK_04,
    marginBottom: 10,
  },
  sectext: {
    color: Colors.COLOR_BLACK_08,
    fontSize: responsiveFontSize(2),
  },
  edittext: {
    color: Colors.COLOR_BLACK_08,
    fontSize: responsiveFontSize(2),
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_BLACK_08,
  },
  applied: {
    marginTop: 4,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.COLOR_DARK_RED,
    backgroundColor: Colors.COLOR_RED_04,
    justifyContent: 'center',
    padding: 2,
    borderRadius: 5
  },
  splitter:{
    width: '100%',
    height: 1,
    backgroundColor: Colors.COLOR_BLACK_01,
    marginVertical: 10,
  },
  slider: {
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderColor:Colors.COLOR_RED,
    borderWidth: 1,
    marginHorizontal: 5
  },
  bottom: {
    paddingHorizontal: 60,
    marginTop: 40
  },
  addPhotoContainer: {
  },
  addContainer: {
  },
  addView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addText: {
    marginTop:2,
    marginLeft:10,
    fontSize:responsiveFontSize(2),
    color: Colors.COLOR_RED
  },

  noPhotoText: {
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_BLACK_04
  },
  noPhotoContainer: {
    marginTop: 20,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    width:120,
    height:120,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY,
    backgroundColor: Colors.COLOR_BLACK_01
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingImagesScrollview: {
    paddingTop: 10,
    paddingLeft: 20,
  },
  loadingImagesWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImagesText: {
    color: Colors.COLOR_RED,
    fontSize: responsiveFontSize(2),
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10
  }
});
