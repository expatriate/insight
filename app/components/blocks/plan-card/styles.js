import {
    StyleSheet,
    Platform
} from 'react-native';

import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
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
  cardBlue: {
    borderTopWidth: 20,
    borderColor: Colors.COLOR_LIGHT_BLUE_1,
    paddingTop: 20
  },
  cardYellow: {
    borderTopWidth: 20,
    borderColor: Colors.COLOR_YELLOW,
    paddingTop: 20
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
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.9),
    lineHeight: responsiveFontSize(2.4)
  }
});