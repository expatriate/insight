// PROFILE page main styles
import {
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  wrapper: {
    padding: 30,
  },
  title: {
    fontSize: responsiveFontSize(2.7),
    lineHeight: responsiveFontSize(3.3)
  },
  subTitle: {
    fontSize: responsiveFontSize(1.9),
    lineHeight: responsiveFontSize(2.4)
  },
  card: {
    padding: 30,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 10,
    marginBottom: 20,
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
  optLine: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_BORDER,
    paddingVertical: 5,
  },
  optLeft: {
    flex: 1,
    fontSize: responsiveFontSize(1.9),
    lineHeight: responsiveFontSize(2.4),
    marginRight: 10,
  },
  optRight: {
    width: '15%', 
    justifyContent: 'center', 
    alignItems: 'center',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.9),
    lineHeight: responsiveFontSize(2.4)
  },
  image1: {
    width: 150,
    height: 150
  },
  image2: {
    marginTop: 30,
    height: 120, 
    width: 200,
    alignSelf: 'center',
  },
  tabCard: {
    padding: 30,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 10,
    marginBottom: 20,
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
    borderTopWidth: 20,
    borderColor: Colors.COLOR_LIGHT_BLUE_1,
    paddingTop: 20,
    marginHorizontal:responsiveWidth(5),
    width: responsiveWidth(70)
  },
  tabCardQuad: {
    padding: 15,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 10,
    marginBottom: 20,
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
    paddingTop: 20,
    marginLeft:responsiveWidth(5),
    width: responsiveWidth(42.5)
  },
  tabCardQuad_last: {
  },
  tabCard_first: {
    marginLeft:responsiveWidth(15),
  },
  tabCard_last: {
    marginRight:responsiveWidth(15),
  },
  spoiler: {
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_WHITE,
    marginBottom: 20
  },
  lastspoiler: {
    borderBottomWidth: 0,
  },
  line: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY
  },
  roundLine: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY
  }
});