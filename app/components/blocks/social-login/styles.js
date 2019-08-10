// SOCIAL LOGIN block main styles
import {
    StyleSheet,
    Platform
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  socialAuth: {
    width: 40,
    height: 40
  },
  socialAuthPartial: {
    marginRight:responsiveWidth(5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      }
    }),
  },
  socialBlock: {
    paddingHorizontal: responsiveWidth(5),
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignContent: 'center',
  },
  socialBlockPartial: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignContent: 'center',
  },
});