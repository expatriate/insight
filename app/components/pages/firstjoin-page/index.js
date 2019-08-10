import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Image,
    TextInput,
    TouchableHighlight,
    Alert,
    Button,
    StatusBar,
    Dimensions,
    Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import Video, { ScrollView as ScrollViewVideo } from 'react-native-af-video-player';
import Svg, {
    Polygon,
    Path,
    Defs,
    Stop,
    G,
    LinearGradient as LinearGradientSvg
} from 'react-native-svg';

import { navigateToRegistration, navigateToLogin } from '../../../actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';
import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

const { width, height } = Dimensions.get('window');

class FirstJoinPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      e: undefined,
      stat: undefined,
      context: {
        alala: 'adsad'
      },
      pageNum: 0,
      scrollX: new Animated.Value(0)
    }

    this.goToLogin = this.goToLogin.bind(this);
    this.goToRegistration = this.goToRegistration.bind(this);
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  };

  componentWillUnmount() {
  };

  handleScroll(event){
    /*Alert.alert(JSON.stringify(event, null, 2))
    
    /*Animated.event([{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }], { useNativeDriver: true })*/
    this.setState({
      xPos : event.nativeEvent.contentOffset.x,
    })
  }

  onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    this.setState({
      pageNum : pageNum
    })
  }

  render() {
    var headMov = this.state.scrollX.interpolate({
      /*inputRange: [width*this.state.pageNum, width*(this.state.pageNum + 1)],
      outputRange: [-(width/100)*10 - width*this.state.pageNum, -(width/100)*20 - width*this.state.pageNum]*/
      inputRange: [0, width],
      outputRange: [-(width/100)*10, -(width/100)*20]
    });

    return (
      <View style={baseStyles.container}>
          <LinearGradient style={baseStyles.container} colors={['#2c373e', '#4e5d67', '#fefefe', '#d8e2e7']} locations={[0, 0.5, 0.51, 1]}>
            <View style={styles.top}>
              {/*<Animated.ScrollView
                horizontal 
                scrollEventThrottle={10}
                decelerationRate={0}
                showsHorizontalScrollIndicator={false} 
                snapToInterval={width} 
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }], { useNativeDriver: true })}
                onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                style={[styles.wrapper]}
                 //contentContainerStyle={styles.wrapper} 
                 >*/}
              <Swiper style={styles.wrapper} 
                showsButtons={false} 
                loop={false} 
                dotStyle={styles.dotStyle} 
                activeDotStyle={styles.dotStyleActive} 
                onTouchStart={() => {
                  this.player.pause();
                }}>
                <Animated.View style={styles.slide}>
                  <Text style={styles.title}>Как это работает</Text>
                  <Text style={styles.text}>
                    Посмотрите&nbsp;видео,&nbsp;в&nbsp;котором мы&nbsp;рассказали&nbsp;как&nbsp;устроена система&nbsp;Myteam.pro
                  </Text>
                  <View style={[baseStyles.row, styles.icon_container, {position: 'relative'}]}>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M0,0.378C2.176,0.375,4.352,0.853,6.004,1.81l75.879,43.93
                              c3.299,1.909,93.784,55.26,93.784,55.26s-90.312,51.351-93.784,53.261L6.004,198.187c-1.641,0.952-3.797,1.431-5.957,1.435
                              C0.078,183.876,0,5.922,0,0.378z"
                          />
                      </Svg>
                    </View>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                            <Path
                              fill="url(#LinearGradient2)"
                              d="M199.953,199.621c-2.16-0.004-4.316-0.482-5.957-1.435l-75.879-43.926
                                C114.645,152.351,24.333,101,24.333,101s90.485-53.351,93.784-55.26l75.879-43.93c1.652-0.957,3.828-1.435,6.004-1.432
                                C200,5.922,199.922,183.876,199.953,199.621z" 
                            />
                      </Svg>
                    </View>
                    <View style={{position: 'absolute', left: width*0.1, top: 0, bottom: 0, zIndex: 999}}>
                      <Video url={require('../../../../assets/video/firstjoin.mp4')}
                        ref={(ref) => {
                         this.player = ref
                        }}
                        style={styles.video_container}
                        inlineOnly={true}
                       />
                     </View>
                  </View>
                </Animated.View>
                <Animated.View style={styles.slide}>
                  <Text style={styles.title}>Как это работает</Text>
                  <Text style={styles.text}>
                    Быстрый поиск исполнителя на основе рекомендаций и оценок вашей команды
                  </Text>
                  <View style={[baseStyles.row, styles.icon_container, {position: 'relative'}]}>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M0,0.378C2.176,0.375,4.352,0.853,6.004,1.81l75.879,43.93
                              c3.299,1.909,93.784,55.26,93.784,55.26s-90.312,51.351-93.784,53.261L6.004,198.187c-1.641,0.952-3.797,1.431-5.957,1.435
                              C0.078,183.876,0,5.922,0,0.378z"
                          />
                      </Svg>
                    </View>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                            <Path
                              fill="url(#LinearGradient2)"
                              d="M199.953,199.621c-2.16-0.004-4.316-0.482-5.957-1.435l-75.879-43.926
                                C114.645,152.351,24.333,101,24.333,101s90.485-53.351,93.784-55.26l75.879-43.93c1.652-0.957,3.828-1.435,6.004-1.432
                                C200,5.922,199.922,183.876,199.953,199.621z" 
                            />
                      </Svg>
                    </View>
                    <View style={{position: 'absolute', left: width*0.2, top: 0, bottom: 0, zIndex: 999}}>
                      <Svg height={width * 0.60} width={width * 0.60} viewBox="0 0 200 200">
                        <Defs>
                          <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100" id="LinearGradient1">
                            <Stop offset="0" stopColor="#3DCCC6"></Stop>
                            <Stop offset="1" stopColor="#31A3B7"></Stop>
                          </LinearGradientSvg>
                          <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100" id="LinearGradient2">
                            <Stop offset="0" stopColor="#eaeef1"></Stop>
                            <Stop offset="1" stopColor="#e9edf0"></Stop>
                          </LinearGradientSvg>
                        </Defs>
                        <G>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M94.008,1.81c3.3-1.91,8.684-1.91,11.98,0l75.879,43.93
                              c3.299,1.909,6.078,6.596,6.078,10.418v87.685c0,3.816-2.605,8.508-6.078,10.418l-75.879,43.926c-3.297,1.913-8.681,1.913-11.98,0
                              l-75.876-43.926c-3.3-1.91-6.078-6.602-6.078-10.418V56.158c0-3.822,2.604-8.509,6.078-10.418L94.008,1.81z" 
                          />
                          <Path
                            fill="#34aebb"
                            d="M80.248,72.726l2.459,2.388c0,0,18.668-18.593,39.72,0c2.531-2.388,2.531-2.388,2.531-2.388
                              s-9.115-9.767-22.354-9.331C89.364,63.827,82.201,70.917,80.248,72.726z"
                          />
                          <Path
                            fill="url(#LinearGradient1)"
                            d="M67.153,125.47c0,0-9.272-7.697-10.707-30.532c2.316-35.741,28.793-45.29,46.158-45.868
                              c17.361-0.579,45.867,13.602,45.723,45.29c-0.145,31.687-25.756,46.593-45.723,46.593c-19.97,0-32.016-12.898-32.016-12.898
                              l-22.599,22.6l-2.47-2.521L67.153,125.47z M144.385,95.028c0-23.074-18.706-41.781-41.781-41.781
                              c-23.074,0-41.781,18.706-41.781,41.781c0,23.074,18.707,41.779,41.781,41.779C125.68,136.808,144.385,118.103,144.385,95.028z"
                          />
                        </G>
                      </Svg>
                    </View>
                  </View>
                </Animated.View>
                <Animated.View style={styles.slide}>
                  <Text style={styles.title}></Text>
                  <Text style={styles.text}>
                    Возможность зарабатывать, став частью команды других пользователей
                  </Text>
                  <View style={[baseStyles.row, styles.icon_container, {position: 'relative'}]}>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M0,0.378C2.176,0.375,4.352,0.853,6.004,1.81l75.879,43.93
                              c3.299,1.909,93.784,55.26,93.784,55.26s-90.312,51.351-93.784,53.261L6.004,198.187c-1.641,0.952-3.797,1.431-5.957,1.435
                              C0.078,183.876,0,5.922,0,0.378z"
                          />
                      </Svg>
                    </View>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                            <Path
                              fill="url(#LinearGradient2)"
                              d="M199.953,199.621c-2.16-0.004-4.316-0.482-5.957-1.435l-75.879-43.926
                                C114.645,152.351,24.333,101,24.333,101s90.485-53.351,93.784-55.26l75.879-43.93c1.652-0.957,3.828-1.435,6.004-1.432
                                C200,5.922,199.922,183.876,199.953,199.621z" 
                            />
                      </Svg>
                    </View>
                    <View style={{position: 'absolute', left: width*0.2, top: 0, bottom: 0, zIndex: 999}}>
                      <Svg height={width * 0.60} width={width * 0.60} viewBox="0 0 200 200">
                        <Defs>
                          <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100" id="LinearGradient1">
                            <Stop offset="0" stopColor="#3DCCC6"></Stop>
                            <Stop offset="1" stopColor="#31A3B7"></Stop>
                          </LinearGradientSvg>
                          <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100" id="LinearGradient2">
                            <Stop offset="0" stopColor="#eaeef1"></Stop>
                            <Stop offset="1" stopColor="#e9edf0"></Stop>
                          </LinearGradientSvg>
                        </Defs>
                        <G>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M94.008,1.81c3.3-1.91,8.684-1.91,11.98,0l75.879,43.93
                              c3.299,1.909,6.078,6.596,6.078,10.418v87.685c0,3.816-2.605,8.508-6.078,10.418l-75.879,43.926c-3.297,1.913-8.681,1.913-11.98,0
                              l-75.876-43.926c-3.3-1.91-6.078-6.602-6.078-10.418V56.158c0-3.822,2.604-8.509,6.078-10.418L94.008,1.81z" 
                          />
                          <Path
                            fill="url(#LinearGradient1)"
                            d="M101.036,46.268c6.75,0,13.499,0.026,20.248-0.021c1.398-0.01,2.161,0.486,2.825,1.757
                              c2.348,4.491,6.01,7.73,10.369,10.197c5.494,3.11,11.346,5.242,17.552,6.466c0.615,0.122,1.49,1.233,1.479,1.873
                              c-0.083,5.373-0.199,10.753-0.584,16.112c-0.691,9.617-3.146,18.868-6.423,27.895c-3.708,10.216-8.932,19.616-15.359,28.394
                              c-4.303,5.879-9.238,11.164-14.593,16.019c-4.251,3.853-8.963,7.203-13.546,10.678c-2.185,1.656-2.359,1.677-4.668-0.098
                              c-4.772-3.665-9.508-7.381-14.12-11.242c-7.045-5.9-12.66-13.095-17.729-20.678c-3.656-5.469-6.743-11.287-9.312-17.387
                              c-2.721-6.466-4.993-13.063-6.483-19.904c-0.904-4.158-1.623-8.375-2.087-12.603c-0.53-4.845-0.705-9.731-0.992-14.603
                              c-0.067-1.127-0.24-2.37,0.146-3.361c0.297-0.761,1.321-1.569,2.149-1.74c9.62-1.995,17.55-6.808,24.044-14.095
                              c0.278-0.312,0.534-0.661,0.722-1.033c1.266-2.518,3.643-2.588,5.952-2.607C87.431,46.233,94.234,46.268,101.036,46.268z
                               M100.894,49.697c-6.268,0-12.539-0.099-18.804,0.067c-1.615,0.042-3.502-0.326-4.87,1.251c-1.551,1.789-3.159,3.543-4.871,5.176
                              c-5.667,5.397-12.487,8.745-19.964,10.773c-1.229,0.333-1.413,0.832-1.359,1.835c0.22,4.085,0.267,8.188,0.686,12.253
                              c0.464,4.5,0.976,9.035,1.977,13.436c2.29,10.08,5.707,19.762,10.633,28.917c5.077,9.439,11.441,17.877,18.881,25.53
                              c1.995,2.052,4.171,3.945,6.394,5.753c3.315,2.695,6.723,5.278,10.156,7.822c0.391,0.289,1.387,0.268,1.783-0.032
                              c4.414-3.348,8.959-6.561,13.072-10.253c3.673-3.301,6.917-7.094,10.231-10.777c4.927-5.479,8.87-11.669,12.321-18.147
                              c3.472-6.515,6.247-13.328,8.334-20.432c3.257-11.088,5.002-22.364,4.679-33.939c-0.024-0.893-0.294-1.309-1.167-1.564
                              c-3.122-0.915-6.303-1.708-9.31-2.923c-7.157-2.895-13.628-6.803-17.811-13.613c-0.559-0.909-1.179-1.161-2.188-1.155
                              C113.43,49.718,107.163,49.697,100.894,49.697z"
                          />
                          <Path
                            fill="url(#LinearGradient1)"
                            d="M97.384,106.533c0,1.661,0,3.397,0,5.275c3.912,0,7.746,0,11.695,0c0,1.28,0,2.426,0,3.771
                              c-3.86,0-7.735,0-11.745,0c0,3.385,0,6.575,0,9.876c-1.819,0-3.5,0-5.323,0c0-3.192,0-6.385,0-9.774c-1.754,0-3.381,0-5.107,0
                              c0-1.34,0-2.483,0-3.771c1.602,0,3.188,0,4.905,0c0-1.869,0-3.609,0-5.547c-1.546,0-3.173,0-4.904,0c0-1.446,0-2.698,0-4.093
                              c1.597,0,3.183,0,5.036,0c0-0.696,0-1.257,0-1.818c0-7.393,0.017-14.784-0.018-22.177c-0.006-1.102,0.119-1.85,1.46-1.889
                              c0.83-0.025,1.651-0.377,2.481-0.402c3.274-0.095,6.55-0.123,9.826-0.164c2.957-0.036,5.776,0.542,8.388,1.968
                              c4.257,2.325,6.441,5.984,6.668,10.773c0.145,3.017,0.154,6.028-1.188,8.892c-2.306,4.918-6.392,7.344-11.502,8.138
                              C104.606,106.123,101.086,106.222,97.384,106.533z M97.354,101.559c2.885,0,5.634,0.251,8.318-0.058
                              c4.127-0.474,8.032-1.868,9.084-7.856c0.366-2.082,0.271-4.324-0.048-6.428c-0.426-2.826-2.133-4.955-4.852-5.976
                              c-4.079-1.533-8.274-1.181-12.503-0.601C97.354,87.649,97.354,94.487,97.354,101.559z"
                          />
                        </G>
                      </Svg>
                    </View>
                  </View>
                </Animated.View>
                <Animated.View style={styles.slide}>
                  <Text style={styles.title}></Text>
                  <Text style={styles.text}>
                    Безопасную систему оплаты, как для исполнителей, так и для заказчиков
                  </Text>
                  <View style={[baseStyles.row, styles.icon_container, {position: 'relative'}]}>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M0,0.378C2.176,0.375,4.352,0.853,6.004,1.81l75.879,43.93
                              c3.299,1.909,93.784,55.26,93.784,55.26s-90.312,51.351-93.784,53.261L6.004,198.187c-1.641,0.952-3.797,1.431-5.957,1.435
                              C0.078,183.876,0,5.922,0,0.378z"
                          />
                      </Svg>
                    </View>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                            <Path
                              fill="url(#LinearGradient2)"
                              d="M199.953,199.621c-2.16-0.004-4.316-0.482-5.957-1.435l-75.879-43.926
                                C114.645,152.351,24.333,101,24.333,101s90.485-53.351,93.784-55.26l75.879-43.93c1.652-0.957,3.828-1.435,6.004-1.432
                                C200,5.922,199.922,183.876,199.953,199.621z" 
                            />
                      </Svg>
                    </View>
                    <View style={{position: 'absolute', left: width*0.2, top: 0, bottom: 0, zIndex: 999}}>
                      <Svg height={width * 0.60} width={width * 0.60} viewBox="0 0 200 200">
                        <Defs>
                          <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100" id="LinearGradient1">
                            <Stop offset="0" stopColor="#3DCCC6"></Stop>
                            <Stop offset="1" stopColor="#31A3B7"></Stop>
                          </LinearGradientSvg>
                          <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100" id="LinearGradient2">
                            <Stop offset="0" stopColor="#eaeef1"></Stop>
                            <Stop offset="1" stopColor="#e9edf0"></Stop>
                          </LinearGradientSvg>
                        </Defs>
                        <G>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M94.008,1.81c3.3-1.91,8.684-1.91,11.98,0l75.879,43.93
                              c3.299,1.909,6.078,6.596,6.078,10.418v87.685c0,3.816-2.605,8.508-6.078,10.418l-75.879,43.926c-3.297,1.913-8.681,1.913-11.98,0
                              l-75.876-43.926c-3.3-1.91-6.078-6.602-6.078-10.418V56.158c0-3.822,2.604-8.509,6.078-10.418L94.008,1.81z" 
                          />
                          <Path
                            fill="url(#LinearGradient1)"
                            d="M99.91,146.009c-13.771,0-27.542,0.027-41.313-0.013c-5.859-0.017-9.685-2.788-10.548-7.53
                              c-0.171-0.939-0.15-1.921-0.15-2.883c-0.011-23.332-0.018-46.663-0.014-69.994c0.001-7.396,4.173-11.595,11.564-11.599
                              c26.84-0.013,53.681-0.013,80.52,0c7.91,0.004,12.147,4.267,12.147,12.163c0.002,23.068-0.004,46.135-0.012,69.205
                              c-0.002,7.129-3.415,10.612-10.617,10.637C127.627,146.044,113.769,146.009,99.91,146.009z M51.098,70.832
                              c-0.067,1.264-0.142,2.021-0.142,2.778c-0.014,20.877-0.024,41.754-0.023,62.629c0,4.156,2.215,6.456,6.406,6.712
                              c0.612,0.037,1.228,0.024,1.842,0.024c27.28,0,54.561,0,81.84-0.002c0.615,0,1.229,0.012,1.843-0.028
                              c4.029-0.266,6.295-2.522,6.363-6.533c0.074-4.298,0.018-8.597-0.015-12.896c-0.005-0.569-0.201-1.136-0.342-1.871
                              c-1.622,0-3.104,0.022-4.586-0.005c-4.467-0.076-8.972,0.152-13.395-0.342c-5.839-0.655-9.739-4.236-11.652-9.715
                              c-1.899-5.438-0.644-10.393,3.229-14.606c2.798-3.049,6.33-4.618,10.511-4.618c5.315,0,10.63,0,16.049,0
                              c0-4.408,0.158-8.426-0.05-12.425c-0.162-3.107-2.289-5.417-5.367-5.963c-2.313-0.41-4.703-0.505-7.061-0.508
                              c-24.824-0.034-49.648-0.029-74.473-0.012C58.315,73.454,54.521,73.751,51.098,70.832z M51.373,61.751c1.559,0,2.517,0,3.476,0
                              c26.676,0,53.353-0.001,80.029,0c6.94,0,7.49,0.12,7.449,6.943c0.046,0.712,0.002,1.04,0.026,1.78c3.642,0.1,6.442,1.72,6.86,2.458
                              c0-2.195-0.017-4.282,0.004-6.368c0.063-6.613-2.771-9.524-9.322-9.525c-22.815-0.003-45.63-0.001-68.445,0
                              c-4.388,0-8.775-0.027-13.163,0.012C55.229,57.078,53.028,58.48,51.373,61.751z M51.612,64.722c-0.15,0.272-0.307,0.426-0.296,0.565
                              c0.029,0.344,0.07,0.713,0.219,1.017c1.61,3.267,4.432,4.182,7.842,4.178c25.706-0.028,54.432-0.083,80.139,0
                              c0.011-1.667,0.006-0.639,0.04-2.93c-0.015-2.623-1.387-2.961-3.553-2.958c-27.374,0.043-54.748,0.026-82.121,0.03
                              C53.102,64.625,52.322,64.69,51.612,64.722z M149.036,95.313c-5.697,0-11.131-0.185-16.547,0.049
                              c-6.117,0.266-10.814,5.131-11.024,10.965c-0.227,6.242,4.031,11.659,10.318,12.165c5.651,0.458,11.368,0.098,17.253,0.098
                              C149.036,110.857,149.036,103.266,149.036,95.313z"
                          />
                          <Path
                            fill="url(#LinearGradient1)"
                            d="M132.338,112.902c-3.695,0.022-6.601-2.724-6.67-6.306c-0.071-3.689,2.865-6.697,6.57-6.732
                              c3.719-0.034,6.713,2.933,6.689,6.625C138.903,110.042,135.989,112.878,132.338,112.902z M132.336,102.88
                              c-2.018-0.035-3.816,1.675-3.774,3.587c0.04,1.837,1.693,3.389,3.652,3.425c2.013,0.039,3.603-1.376,3.707-3.3
                              C136.03,104.568,134.435,102.917,132.336,102.88z"
                          />
                        </G>
                      </Svg>
                    </View>
                  </View>
                </Animated.View>
                <Animated.View style={styles.slide}>
                  <Text style={styles.title}></Text>
                  <Text style={styles.text}>
                    Достоверные сведения о качестве работы каждого пользователя. Проверяем специалистов на проф пригодность
                  </Text>
                  <View style={[baseStyles.row, styles.icon_container, {position: 'relative'}]}>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M0,0.378C2.176,0.375,4.352,0.853,6.004,1.81l75.879,43.93
                              c3.299,1.909,93.784,55.26,93.784,55.26s-90.312,51.351-93.784,53.261L6.004,198.187c-1.641,0.952-3.797,1.431-5.957,1.435
                              C0.078,183.876,0,5.922,0,0.378z"
                          />
                      </Svg>
                    </View>
                    <View style={{position: 'relative', zIndex: 99, marginTop: width*0.08}}>
                      <Svg height={width * 0.5} width={width * 0.5} viewBox="0 0 200 200">
                          <Defs>
                            <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200" id="LinearGradient2">
                              <Stop offset="0" stopColor="#eaeef1"></Stop>
                              <Stop offset="1" stopColor="#d6dadd"></Stop>
                            </LinearGradientSvg>
                          </Defs>
                            <Path
                              fill="url(#LinearGradient2)"
                              d="M199.953,199.621c-2.16-0.004-4.316-0.482-5.957-1.435l-75.879-43.926
                                C114.645,152.351,24.333,101,24.333,101s90.485-53.351,93.784-55.26l75.879-43.93c1.652-0.957,3.828-1.435,6.004-1.432
                                C200,5.922,199.922,183.876,199.953,199.621z" 
                            />
                      </Svg>
                    </View>
                    <View style={{position: 'absolute', left: width*0.2, top: 0, bottom: 0, zIndex: 999}}>
                      <Svg height={width * 0.60} width={width * 0.60} viewBox="0 0 200 200">
                        <Defs>
                          <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100" id="LinearGradient1">
                            <Stop offset="0" stopColor="#3DCCC6"></Stop>
                            <Stop offset="1" stopColor="#31A3B7"></Stop>
                          </LinearGradientSvg>
                          <LinearGradientSvg gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100" id="LinearGradient2">
                            <Stop offset="0" stopColor="#eaeef1"></Stop>
                            <Stop offset="1" stopColor="#e9edf0"></Stop>
                          </LinearGradientSvg>
                        </Defs>
                        <G>
                          <Path
                            fill="url(#LinearGradient2)"
                            d="M94.008,1.81c3.3-1.91,8.684-1.91,11.98,0l75.879,43.93
                              c3.299,1.909,6.078,6.596,6.078,10.418v87.685c0,3.816-2.605,8.508-6.078,10.418l-75.879,43.926c-3.297,1.913-8.681,1.913-11.98,0
                              l-75.876-43.926c-3.3-1.91-6.078-6.602-6.078-10.418V56.158c0-3.822,2.604-8.509,6.078-10.418L94.008,1.81z" 
                          />
                          <Path
                            fill="url(#LinearGradient1)"
                            d="M137.503,148.125c-0.549,0.044-1.098,0.128-1.646,0.128c-28.221,0.007-56.442,0.007-84.664-0.001
                              c-0.64,0-1.278-0.103-1.917-0.157c-0.335-7.404-0.179-14.797,0.375-22.189c0.342-4.571,2.351-7.898,6.62-9.655
                              c3.554-1.464,7.162-2.791,10.725-4.235c3.65-1.479,7.293-2.979,10.901-4.558c3.028-1.326,4.384-5.547,2.536-8.399
                              c-1.481-2.286-2.542-4.693-3.11-7.314c-0.201-0.926-0.687-1.368-1.357-1.907c-3.609-2.903-4.566-8.654-1.945-12.5
                              c0.802-1.178,1.168-2.219,0.895-3.555c-2.045-10.029,4.566-16.992,11.289-19.466c8.653-3.186,18.459-0.258,23.336,6.947
                              c2.452,3.621,3.188,7.6,2.453,11.881c-0.27,1.571-0.178,2.856,0.862,4.354c2.61,3.757,1.598,9.395-1.964,12.248
                              c-0.863,0.691-1.268,1.377-1.506,2.443c-0.503,2.25-1.318,4.427-2.704,6.303c-0.645,0.874-0.74,1.796-0.89,2.817
                              c-0.486,3.334,0.729,5.197,3.99,6.328c5.096,1.766,10.045,3.971,15.036,6.034c2.2,0.911,4.383,1.871,6.521,2.915
                              c3.521,1.719,5.347,4.638,5.719,8.527C137.792,132.772,137.8,140.445,137.503,148.125z M93.245,144.804
                              c12.792,0,25.584-0.056,38.375,0.054c2.13,0.02,2.616-0.617,2.559-2.64c-0.13-4.626-0.384-9.256-0.4-13.867
                              c-0.02-5.347-2.408-8.324-7.16-10.122c-6.422-2.431-12.688-5.282-19.138-7.627c-3.963-1.44-6.162-3.553-5.244-8.045
                              c0.325-1.588-0.824-3.519,0.381-4.827c2.609-2.827,3.328-6.298,3.873-9.865c0.154-1.009,0.318-1.515,1.496-1.267
                              c1.652,0.35,2.057-1.111,2.305-2.154c0.376-1.587,0.675-4.421-0.503-4.594c-3.591-0.529-1.786-2.652-1.626-4.127
                              c1.222-11.204-2.633-17.241-12.32-18.833c-9.577-1.573-19.643,5.942-17.368,16.132c0.36,1.614,0.459,3.292,0.589,4.949
                              c0.042,0.539,0.442,1.505-0.586,1.514c-3.541,0.032-1.99,2.76-2.021,4.258c-0.03,1.465,0.348,3.486,2.895,2.857
                              c1.059-0.261,0.813,0.719,0.918,1.277c0.513,2.717,0.638,5.734,2.447,7.826c1.932,2.234,1.966,4.599,1.894,7.171
                              c-0.026,0.925-0.174,1.864-0.052,2.77c0.287,2.136-0.823,3.104-2.601,3.93c-4.16,1.931-8.34,3.796-12.623,5.433
                              c-3.934,1.503-7.877,2.99-11.763,4.612c-2.434,1.016-3.957,2.766-4.215,5.629c-0.519,5.723-0.679,11.447-0.734,17.188
                              c-0.019,2.005,0.663,2.421,2.524,2.41C67.844,144.766,80.544,144.804,93.245,144.804z"
                          />
                          <Path
                            fill="url(#LinearGradient1)"
                            d="M125.138,74.257c1.104-0.028,1.563,0.833,2.109,1.562c3.431,4.571,6.915,9.103,10.249,13.744
                              c1.196,1.664,1.771,1.436,2.811-0.125c7.967-11.961,16.002-23.876,24.021-35.804c0.463-0.687,0.917-1.389,1.457-2.009
                              c0.597-0.683,1.348-0.963,2.201-0.393c0.914,0.61,1.101,1.459,0.664,2.414c-0.266,0.58-0.668,1.098-1.026,1.633
                              c-8.675,12.928-17.349,25.857-26.032,38.779c-2.094,3.114-2.923,3.116-5.201,0.063c-4.08-5.465-8.15-10.937-12.232-16.4
                              c-0.572-0.765-1.08-1.551-0.584-2.525C123.879,74.588,124.41,74.22,125.138,74.257z"
                          />
                        </G>
                      </Svg>
                    </View>
                  </View>
                </Animated.View>
              </Swiper>
              {/*</Animated.ScrollView>*/}

              
            </View>
            <View style={styles.bottom}>
              <View style={[styles.bottom_wrapper]}>
                <TouchableHighlight onPress={this.goToRegistration} style={{marginBottom: 30}} underlayColor="transparent">
                  <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round, {paddingHorizontal: 0, width: width/1.8}]} colors={['#3dccc6', '#31a3b7']}>
                    <View style={[buttonsStyles.buttonBig]}>
                      <Text style={[buttonsStyles.buttonBigText]}>Регистрация</Text>
                    </View>
                  </LinearGradient>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.goToLogin} underlayColor="transparent">
                  <View style={[buttonsStyles.buttonWrapper, buttonsStyles.round, buttonsStyles.buttonBlue, {paddingHorizontal: 0, width: width/1.8}]}>
                    <Text style={buttonsStyles.buttonBlueText}>Вход</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>

            {/*<ScrollView contentContainerStyle={baseStyles.contentContainer}>

                <ActivityIndicator />

            </ScrollView>*/}

        
          </LinearGradient>
            


      </View>
    );
  };

  goToRegistration() {
    this.props.navigateToRegistration();
  }

  goToLogin() {
    this.props.navigateToLogin();
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    navigateToLogin:navigateToLogin,
    navigateToRegistration: navigateToRegistration,
  }, dispatch);
}

export default connect(
  state => {
    return {
      app: state.app,
      user: state.user,
    }
  }, mapDispatchToProps
)(FirstJoinPage);