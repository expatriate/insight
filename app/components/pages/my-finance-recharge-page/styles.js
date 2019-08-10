// Catalog performers filter page main styles
import {
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  container: {
    margin: 20,
    //borderRadius: 5,
    flexDirection:'column',
  },
  wrapper: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: Colors.COLOR_WHITE,
    flexDirection:'column',
  },
  wrapper_bottom: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: Colors.COLOR_LIGHT_BLUE_2,
    flexDirection:'column',
  },
  inputLabel: {
    marginLeft: 10,
    fontSize: responsiveFontSize(2)
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginBottom: 20,
    flex: 1,
    textAlign: 'center'
  },
  subtitle: {
    marginBottom: 8,
    fontSize: responsiveFontSize(2)
  },
  lineContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '50%', 
    marginBottom: 20
  },
  btnContainer: {
    padding: 10, 
    borderRadius: 10, 
    borderWidth:2, 
    borderColor: Colors.COLOR_LIGHT_BLUE_1,
    marginBottom: 10
  }

});