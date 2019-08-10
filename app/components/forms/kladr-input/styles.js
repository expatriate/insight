import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({

  normalTitle: {
    marginTop: responsiveWidth(2),
    color: Colors.COLOR_DARK_GRAY,
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveWidth(1)
  },
  clearContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
    marginLeft: responsiveWidth(2)
  },
  whiteBg: {
    backgroundColor: Colors.COLOR_WHITE,
  },

  item: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(5),
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY,
  },
  items: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      }
    }),
    elevation: 6,
    left: 0,
    position: 'absolute',
    right: 0,
    marginHorizontal: 1,
    top: 0,
    zIndex: 10,
    backgroundColor:'#ffffff'
  }

});