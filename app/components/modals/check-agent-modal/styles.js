
import {
    StyleSheet,
    Platform
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  mainContent: {
    marginVertical: 50,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 5,
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modaltitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color:Colors.COLOR_BLACK_08,
    flex: 1
  },
  closeLink: {
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_BLACK
  },
  item: {
    width: '100%',
    marginBottom: 4,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.COLOR_LIGHT_GRAY,
    paddingVertical: 10,
    marginBottom: 10
  },
  name: {
    fontSize: responsiveFontSize(2),
    color: Colors.COLOR_BLACK_08,
  },
  phone: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.COLOR_RED,
  }
});
