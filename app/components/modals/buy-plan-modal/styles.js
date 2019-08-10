
import {
    StyleSheet,
    Platform
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  mainContent: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),

  },
  content: {
    padding: 20,
  },
  modalMain_centered: {
    flex: 1, 
    backgroundColor:Colors.COLOR_BLACK_04,
    justifyContent: 'center',
  },
  proMode: {
    backgroundColor: Colors.COLOR_LIGHT_BLUE,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 20
  },
  businessMode: {
    backgroundColor: Colors.COLOR_YELLOW,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 20
  },
  iconWrap: {
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20
  },
  subTitle: {
    fontSize: responsiveFontSize(1.9),
    lineHeight: responsiveFontSize(2.4)
  },
  title: {
    fontSize: responsiveFontSize(4.1),
    lineHeight: responsiveFontSize(4.5)
  },
  planVariant: {
    marginVertical: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});