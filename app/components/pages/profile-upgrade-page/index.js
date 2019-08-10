import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    Alert,
    Dimensions,
    SectionList,
    RefreshControl,
    StatusBar,
    Animated,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    Picker,
    TextInput,
    FlatList,
} from 'react-native';
import PageHeader from '../../blocks/page-header';
import SideMenu from 'react-native-side-menu';
import LeftMenu from '../../blocks/left-menu';
import PlanCard from '../../blocks/plan-card';
import LinearGradient from 'react-native-linear-gradient';
import BuyPlanModal from '../../modals/buy-plan-modal';


import Svg, {
    Path,
    Polygon,
} from 'react-native-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  navigateBack,
  navigateToCreateTask,
  navigateToTasksCatalogPage,
} from '../../../actions';

import { EventRegister } from 'react-native-event-listeners';

import { NavigationEvents } from 'react-navigation';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

class ProfileUpgradePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      modalUpgrade: false,
      selectedPlan: null,
      slideAnimation: new Animated.Value(22),
    }
  }

  componentDidMount() {

    this.leftMenu = EventRegister.addEventListener('OPEN_MENU', () => {
      this.setState({
        isOpen: true 
      });
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.leftMenu);
  };

  updateMenuState(isOpen) {
    this.setState({
      isOpen
    });
  }

  render() {

    const menu = <LeftMenu user={this.props.user} />;

    const animationFunction = (prop, value) => {
       return Animated.spring(prop, {
          toValue: value,
          friction: 10,
          tension: 10
       });
    };

    const plans = this.props.app.plans ? this.props.app.plans.map((item, index) => {
      
      return <PlanCard 
        key={'plan_' + index}
        appplan={this.props.app.appplan}
        data={item}
        buy={() => {
          this.setState({ 
            modalUpgrade:!this.state.modalUpgrade,
            selectedPlan: item
          })
        }} 
      />
    }) : null;

    return (
      <SideMenu
          menu={menu}
          bounceBackOnOverdraw={false}
          isOpen={this.state.isOpen}
          animationFunction={animationFunction}
          onChange={isOpen => this.updateMenuState(isOpen)}
          openMenuOffset={Dimensions.get('window').width * (6 / 7)}
        >
        <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{backgroundColor: '#3dccc6'}} style={{backgroundColor: '#3dccc6'}}>
          <LinearGradient colors={['#31a3b7', '#3dccc6']}>
            <View>
              <PageHeader 
                title={'Тарифы'} 
                menu={true}
                />
              <View style={[styles.wrapper]}>
              <Text>
                { JSON.stringify(this.props.finance, 0 , 2)}
              </Text>
                <Svg width={115} height={92} viewBox="0 0 115 92" style={{marginBottom: 20}}>
                  <Path fill="#184355" d="M88,45.5c0,5.238,4.262,9.5,9.5,9.5s9.5-4.262,9.5-9.5s-4.262-9.5-9.5-9.5S88,40.262,88,45.5z M103.2,45.5
                    c0,3.143-2.558,5.7-5.7,5.7s-5.7-2.558-5.7-5.7s2.558-5.7,5.7-5.7S103.2,42.357,103.2,45.5z M108.338,0h-11.5H6.662
                    C2.988,0,0,2.99,0,6.662V85.34C0,89.01,2.988,92,6.662,92H96.84h11.5c3.67,0,6.66-2.99,6.66-6.662V63.25v-3.834V32.583V28.75V6.662
                    C115,2.99,112.01,0,108.338,0z M6.662,88.166c-1.56,0-2.829-1.268-2.829-2.828V6.662c0-1.56,1.269-2.829,2.829-2.829H96.84
                    c1.559,0,2.826,1.269,2.826,2.829V28.75H97.75c-9.511,0-17.25,7.738-17.25,17.25c0,9.512,7.739,17.25,17.25,17.25h1.916v22.088
                    c0,1.561-1.268,2.828-2.828,2.828H6.662z M111.166,85.338c0,1.561-1.268,2.828-2.828,2.828h-5.471
                    c0.018-0.035,0.023-0.078,0.041-0.114c0.124-0.278,0.213-0.569,0.297-0.866c0.042-0.148,0.104-0.285,0.136-0.439
                    c0.102-0.454,0.159-0.924,0.159-1.408V63.25h7.666V85.338z M111.166,59.416H103.5h-3.834H97.75c-7.396,0-13.416-6.02-13.416-13.416
                    s6.02-13.417,13.416-13.417h1.916h3.834h7.666V59.416z M103.5,28.75V6.662c0-0.485-0.058-0.954-0.157-1.409
                    c-0.032-0.151-0.094-0.291-0.136-0.439c-0.086-0.295-0.175-0.588-0.297-0.866c-0.018-0.036-0.023-0.079-0.041-0.115h5.471
                    c1.559,0,2.826,1.269,2.826,2.829V28.75H103.5z M92.58,67.574c-0.362,0.363-0.58,0.885-0.58,1.41c0,0.545,0.218,1.049,0.58,1.432
                    C92.958,70.797,93.48,71,94,71s1.04-0.203,1.42-0.584c0.359-0.383,0.58-0.887,0.58-1.432c0-0.525-0.221-1.049-0.58-1.41
                    C94.66,66.809,93.32,66.809,92.58,67.574z M94,74c-1.1,0-2,0.878-2,2c0,1.1,0.9,2,2,2s2-0.9,2-2C96,74.878,95.1,74,94,74z
                     M92.58,81.559C92.218,81.939,92,82.465,92,82.987c0,0.523,0.218,1.047,0.58,1.409C92.958,84.779,93.458,85,94,85
                    c0.52,0,1.04-0.221,1.42-0.584c0.359-0.382,0.58-0.905,0.58-1.429c0-0.522-0.221-1.048-0.58-1.429
                    C94.66,80.814,93.32,80.814,92.58,81.559z M48,81c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S46.896,81,48,81z M40,81
                    c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S38.896,81,40,81z M56,81c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2
                    S54.896,81,56,81z M25,81c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S23.896,81,25,81z M17,81c1.104,0,2,0.896,2,2s-0.896,2-2,2
                    s-2-0.896-2-2S15.896,81,17,81z M33,81c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S31.896,81,33,81z M79,81c1.104,0,2,0.896,2,2
                    s-0.896,2-2,2s-2-0.896-2-2S77.896,81,79,81z M63,81c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S61.896,81,63,81z M86,81
                    c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S84.896,81,86,81z M71,81c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2
                    S69.896,81,71,81z M8.58,81.559C8.22,81.939,8,82.465,8,82.987c0,0.523,0.22,1.047,0.58,1.429C8.96,84.779,9.48,85,10,85
                    s1.04-0.221,1.42-0.584c0.36-0.382,0.58-0.905,0.58-1.429c0-0.522-0.22-1.048-0.58-1.429C10.66,80.814,9.34,80.814,8.58,81.559z
                     M10,15c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S8.896,15,10,15z M10,22c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2
                    S8.896,22,10,22z M10,51c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S8.896,51,10,51z M10,37c1.104,0,2,0.896,2,2s-0.896,2-2,2
                    s-2-0.896-2-2S8.896,37,10,37z M10,30c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S8.896,30,10,30z M10,59c1.104,0,2,0.896,2,2
                    s-0.896,2-2,2s-2-0.896-2-2S8.896,59,10,59z M10,44c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S8.896,44,10,44z M10,66
                    c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S8.896,66,10,66z M10,73c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2
                    S8.896,73,10,73z M8.58,8.559C8.22,8.939,8,9.442,8,9.987c0,0.523,0.22,1.047,0.58,1.409C8.96,11.779,9.46,12,10,12
                    c0.52,0,1.04-0.221,1.42-0.583C11.78,11.034,12,10.511,12,9.987c0-0.523-0.22-1.048-0.58-1.429C10.66,7.814,9.32,7.814,8.58,8.559z
                     M79,8c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S77.896,8,79,8z M86,8c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2
                    S84.896,8,86,8z M56,8c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S54.896,8,56,8z M63,8c1.104,0,2,0.896,2,2s-0.896,2-2,2
                    s-2-0.896-2-2S61.896,8,63,8z M48,8c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S46.896,8,48,8z M71,8c1.104,0,2,0.896,2,2
                    s-0.896,2-2,2s-2-0.896-2-2S69.896,8,71,8z M33,8c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S31.896,8,33,8z M25,8
                    c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S23.896,8,25,8z M17,8c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S15.896,8,17,8
                    z M40,8c1.104,0,2,0.896,2,2s-0.896,2-2,2s-2-0.896-2-2S38.896,8,40,8z M94,12c0.52,0,1.04-0.221,1.42-0.583
                    C95.779,11.034,96,10.511,96,9.987c0-0.545-0.221-1.048-0.58-1.429c-0.76-0.745-2.1-0.745-2.84,0C92.218,8.939,92,9.464,92,9.987
                    c0,0.523,0.218,1.047,0.58,1.409C92.958,11.779,93.458,12,94,12z M94,19c1.1,0,2-0.884,2-2.01c0-1.105-0.9-1.99-2-1.99
                    s-2,0.884-2,1.99C92,18.116,92.9,19,94,19z M94,25c0.54,0,1.04-0.221,1.42-0.604c0.359-0.365,0.58-0.886,0.58-1.409
                    c0-0.545-0.221-1.048-0.58-1.429c-0.74-0.745-2.1-0.745-2.82,0c-0.379,0.362-0.6,0.883-0.6,1.429c0,0.543,0.218,1.047,0.58,1.409
                    C92.958,24.779,93.458,25,94,25z"/>
                </Svg>
                <Text style={[styles.title, {color: Colors.COLOR_WHITE}]}>
                  Выберите любой тариф, откройте заказ и проверьте удобство и эффективность сервиса MyTeam
                </Text>
              </View>
              <View style={{backgroundColor: Colors.COLOR_LIGHT_BLUE_2, padding: 30}}>
                <Text style={styles.subTitle}>
                  Хотите бесплатно опробовать сервис MyTeam в работе? 
                  {'\n'}Планируете публиковать много задач и пользоваться выгодными ценами?
                  {'\n'}Изучите тарифные планы MyTeam и подключите наиболее подходящий для вас.
                </Text>
              </View>
              <View style={{backgroundColor: Colors.COLOR_LIGHT_BLUE_2, paddingHorizontal: 30}}>

                { plans }

                <BuyPlanModal 
                  visible={this.state.modalUpgrade}
                  data={this.state.selectedPlan}
                  close={() => {this.setState({ modalUpgrade:!this.state.modalUpgrade, selectedPlan: null})}}
                />

                <LinearGradient style={[styles.card, styles.round]} colors={['#31a3b7', '#3dccc6']}>
                  <View>
                    <Image style={styles.image1} source={require('../../../../assets/images/myteamplan1.png')} resizeMode='contain'/>
                    <Text style={[styles.title, {color: Colors.COLOR_WHITE, marginBottom: 20}]}>
                      Выгодная стоимость услуг&nbsp;MyTeam
                    </Text>
                    <Text style={[styles.subTitle, {color: Colors.COLOR_WHITE, marginBottom: 10}]}>
                      При оплате тарифного плана Business за месяц вы тратите всего 
                      {'\n'}63 рубля в день — столько стоит примерно полчашечки кофе в вашем любимом кафе!
                    </Text>
                    <Text style={[styles.subTitle, {color: Colors.COLOR_WHITE}]}>
                      Оплачивайте тарифные планы на 3, 6 или 12 месяцев вперед, цена для вас снизится на 1, 2, 3% соответственно.
                    </Text>
                  </View>
                </LinearGradient>
              </View>
              
              <View>
                <View style={{paddingVertical: 30, backgroundColor: Colors.COLOR_LIGHT_GRAY_2}}>
                  <Text style={[styles.title, {textAlign: 'center', marginBottom: 30}]}>
                    Зарабатывайте ещё больше&nbsp;с&nbsp;MyTeam
                  </Text>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={[styles.tabCard, styles.tabCard_first]}>
                      <Svg width={36} height={28} viewBox="0 0 18 14" style={{marginBottom: 20}}>
                        <Polygon
                          fill={Colors.COLOR_LIGHT_BLUE_1}
                          points="6,11.2 1.8,7 0.4,8.4 6,14 18,2 16.6,0.6 "/>
                      </Svg>
                      <Text style={[styles.subTitle, {fontWeight:'bold', marginBottom: 8}]}>
                        Возврат откликов
                      </Text>
                      <Text style={styles.subTitle}>
                        При отказе или выборе кандидата исполнителем отклик возвращается.
                      </Text>
                    </View>
                    <View style={[styles.tabCard, styles.tabCard_last]}>
                      <Svg width={36} height={28} viewBox="0 0 18 14" style={{marginBottom: 20}}>
                        <Polygon
                          fill={Colors.COLOR_LIGHT_BLUE_1}
                          points="6,11.2 1.8,7 0.4,8.4 6,14 18,2 16.6,0.6 "/>
                      </Svg>
                      <Text style={[styles.subTitle, {fontWeight:'bold', marginBottom: 8}]}>
                        Дополнительные заявки
                      </Text>
                      <Text style={styles.subTitle}>
                        Размещение анкеты исполнителя в ТОП выбранных категорий каталога.
                      </Text>
                    </View>
                  </ScrollView>
                </View>

                <View style={{paddingVertical: 30, backgroundColor: Colors.COLOR_LIGHT_BLUE_2}}>

                  <Text style={[styles.title, {textAlign: 'center', marginBottom: 30, paddingHorizontal: 30}]}>
                    Вам будут доступны следующие способы оплаты
                  </Text>

                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.tabCardQuad}>
                      <Image style={styles.image1} source={require('../../../../assets/images/buy1.jpg')} resizeMode='contain'/>
                      <Text style={[styles.subTitle, {textAlign: 'center', marginBottom: 10}]}>
                        Банковские{'\n'}карты
                      </Text>
                    </View>
                    <View style={[styles.tabCardQuad]}>
                      <Image style={styles.image1} source={require('../../../../assets/images/buy2.jpg')} resizeMode='contain'/>
                      <Text style={[styles.subTitle, {textAlign: 'center', marginBottom: 10}]}>
                        Яндекс.Деньги
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.tabCardQuad}>
                      <Image style={styles.image1} source={require('../../../../assets/images/buy3.jpg')} resizeMode='contain'/>
                      <Text style={[styles.subTitle, {textAlign: 'center', marginBottom: 10}]}>
                        WebMoney
                      </Text>
                    </View>
                    <View style={[styles.tabCardQuad]}>
                      <Image style={styles.image1} source={require('../../../../assets/images/buy4.jpg')} resizeMode='contain'/>
                      <Text style={[styles.subTitle, {textAlign: 'center', marginBottom: 10}]}>
                        Банковские переводы
                      </Text>
                    </View>
                  </View>

                  <View style={{paddingHorizontal: 30, marginTop: 30}}>
                    <Text style={[styles.title, {textAlign: 'left', marginBottom: 30}]}>
                      Почитайте популярные вопросы по тарифным планам
                    </Text>

                    <View style={styles.spoiler}>
                      <TouchableOpacity onPress={function() {this.setState({spoiler1: !this.state.spoiler1})}.bind(this)}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                          <Text style={[styles.subTitle, {fontWeight: 'bold', flex: 1, paddingRight: 30}]}>
                            Сколько времени действует тестовый/бесплатный аккаунт?
                          </Text>
                          {
                            !this.state.spoiler1 ?
                              <Svg width={16} height={16} viewBox="0 0 12 12">
                                <Polygon
                                  fill={Colors.COLOR_LIGHTDARK_GRAY}
                                  points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                                />
                              </Svg>
                            :
                              <Svg width={16} height={16} viewBox="0 0 12 12">
                                <Polygon
                                  fill={Colors.COLOR_LIGHTDARK_GRAY}
                                  points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                                />
                              </Svg>
                          }
                        </View>
                      </TouchableOpacity>
                      {
                        this.state.spoiler1 ? 
                          <View style={{marginVertical: 10}}>
                            <Text style={styles.subTitle}>
                              Изучить все доступные функции сервиса вы можете абсолютно бесплатно на тарифном плане Light, в течение одного месяца. Тестовые аккаунты имеют ограничение по тематическим категориям, количеству откликов и возможности групповой работы. В дальнейшем вы можете оплатить интересующий вас тариф и продолжить работу.
                            </Text>
                          </View>
                        : null
                      }
                    </View>

                    <View style={styles.spoiler}>
                      <TouchableOpacity onPress={function() {this.setState({spoiler2: !this.state.spoiler2})}.bind(this)}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                          <Text style={[styles.subTitle, {fontWeight: 'bold', flex: 1, paddingRight: 30}]}>
                            Что будет, когда закончится оплата?
                          </Text>
                          {
                            !this.state.spoiler2 ?
                              <Svg width={16} height={16} viewBox="0 0 12 12">
                                <Polygon
                                  fill={Colors.COLOR_LIGHTDARK_GRAY}
                                  points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                                />
                              </Svg>
                            :
                              <Svg width={16} height={16} viewBox="0 0 12 12">
                                <Polygon
                                  fill={Colors.COLOR_LIGHTDARK_GRAY}
                                  points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                                />
                              </Svg>
                          }
                        </View>
                      </TouchableOpacity>
                      {
                        this.state.spoiler2 ? 
                          <View style={{marginVertical: 10}}>
                            <Text style={styles.subTitle}>
                              Вы получите уведомление с предложением продлить ваш тарифный план или перейти на другой. По окончании платного тарифного плана вы автоматически переключаетесь на бесплатный тариф Light.
                            </Text>
                          </View>
                        : null
                      }
                    </View>

                    <View style={[styles.spoiler, styles.lastspoiler]}>
                      <TouchableOpacity onPress={function() {this.setState({spoiler3: !this.state.spoiler3})}.bind(this)}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                          <Text style={[styles.subTitle, {fontWeight: 'bold', flex: 1, paddingRight: 30}]}>
                            Можно ли изменить тариф Pro на Business (и обратно)?
                          </Text>
                          {
                            !this.state.spoiler3 ?
                              <Svg width={16} height={16} viewBox="0 0 12 12">
                                <Polygon
                                  fill={Colors.COLOR_LIGHTDARK_GRAY}
                                  points="1.4,2.862 0,4.263 6,10.263 12,4.263 10.6,2.862 6,7.463"
                                />
                              </Svg>
                            :
                              <Svg width={16} height={16} viewBox="0 0 12 12">
                                <Polygon
                                  fill={Colors.COLOR_LIGHTDARK_GRAY}
                                  points="6,5.662 10.6,10.263 12,8.862 6,2.862 0,8.862 1.4,10.263"
                                />
                              </Svg>
                          }
                        </View>
                      </TouchableOpacity>
                      {
                        this.state.spoiler3 ? 
                          <View style={{marginVertical: 10}}>
                            <Text style={styles.subTitle}>
                              Да, вы можете в любое время перейти с одного тарифного плана на другой, не дожидаясь окончания его действия.
                            </Text>
                          </View>
                        : null
                      }
                    </View>
                  </View>

                </View>

                <View style={{backgroundColor: Colors.COLOR_WHITE, paddingHorizontal: 50}}>
                  <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <Image style={styles.image2} source={require('../../../../assets/images/buy5.jpg')} resizeMode='contain'/>
                    </View>
                    <TouchableOpacity onPress={() => {this.props.navigateToTasksCatalogPage()}} underlayColor="transparent">
                      <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                        <View>
                          <View style={[buttonsStyles.buttonBig]}>
                            <Text style={buttonsStyles.buttonBigText}>Найти задачу</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[styles.subTitle, {textAlign: 'center', marginTop: 10, marginBottom: 40}]}>
                      и начать зарабатывать
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.line}>
                    </View>
                    <View style={styles.roundLine}>
                      <Text style={styles.roundLineText}>
                        Или
                      </Text>
                    </View>
                    <View style={styles.line}>
                    </View>
                  </View>
                  <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <Image style={styles.image2} source={require('../../../../assets/images/buy6.jpg')} resizeMode='contain'/>
                    </View>
                    <TouchableOpacity onPress={() => {this.props.navigateToCreateTask()}} underlayColor="transparent">
                      <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                        <View>
                          <View style={[buttonsStyles.buttonBig]}>
                            <Text style={buttonsStyles.buttonBigText}>Опубликовать задачу</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[styles.subTitle, {textAlign: 'center', marginTop: 10, marginBottom: 40}]}>
                      на своих условиях
                    </Text>
                  </View>
                </View>
              
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
        <NavigationEvents
          onWillFocus={() => this._onPageFocus()}
        />
      </SideMenu>
    );
  }

  _onPageFocus() {
    this.setState({
      isOpen: false
    })
  }
};



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      navigateBack: navigateBack,
      navigateToCreateTask: navigateToCreateTask,
      navigateToTasksCatalogPage: navigateToTasksCatalogPage,

    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      app: state.app,
      nav: state.nav,
      finance: state.finance
    }
  }, mapDispatchToProps
)(ProfileUpgradePage);