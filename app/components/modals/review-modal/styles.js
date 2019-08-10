
import {
    StyleSheet,
    Platform
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  mainContent: {
    marginVertical: responsiveWidth(2),
    marginHorizontal: responsiveWidth(2),
    padding: responsiveWidth(5),
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 5,
    flex: 1,
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

  }
});