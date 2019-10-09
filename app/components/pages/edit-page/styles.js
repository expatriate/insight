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
        paddingTop: 30,
    }, {
        paddingTop: 20
    }),
    flexDirection: 'row',
    alignItems: 'center'
  },
  headContainer: {
    width: '50%',
    marginVertical: 10
  },
  card: {
    paddingHorizontal: 15,
  },
  headButton: {
    width: '25%',
    justifyContent: 'center',
  },
  headButtonText: {
    color: Colors.COLOR_WHITE,
    textAlign: 'center',
  },
  headTitle: {
    color: Colors.COLOR_WHITE,
    fontSize: responsiveFontSize(2.4),
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5
  },
  inputWrapper: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_BLACK_01,
    marginBottom: 15
  },
  inputWrapperInactive: {
    paddingVertical: 8,
    marginBottom: 15
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    marginTop: 5
  },
  def: {
    width: '50%',
    color: Colors.COLOR_BLACK_04,
    marginBottom: 10
  },
  value: {
    width: '50%',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  maintext: {
    fontSize: responsiveFontSize(1.7),
    color: Colors.COLOR_BLACK_04,
  },
  sectext: {
    color: Colors.COLOR_BLACK_08,
    fontSize: responsiveFontSize(2),
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems:'center',
  },
  dateText: {
    color: Colors.COLOR_BLACK_08,
    fontSize: responsiveFontSize(2),
    textAlign: 'right',
    paddingRight: 20,
    flex: 1,
  },
  textInput: {
    fontSize: responsiveFontSize(2.4),
    color: Colors.COLOR_BLACK_08,
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
  noPhotoText: {
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_BLACK_04
  },
  taskContainer: {
    paddingBottom: 40,
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
  },
  redRemove: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.COLOR_RED_04,
    borderWidth: 8,
    borderColor: Colors.COLOR_RED,
    justifyContent: 'center',
    alignItems: 'center'
  },
  simpleRemove: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    //backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.COLOR_WHITE
  }
});
