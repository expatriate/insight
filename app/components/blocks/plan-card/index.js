import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import buttonsStyles from '../../styles/buttons.js';

import LinearGradient from 'react-native-linear-gradient';

import Svg, {
    Path,
    Polygon,
    Circle
} from 'react-native-svg';

import { 
  Colors, 
  Gradients,
} from '../../styles/colors.js';

class PlanCard extends PureComponent {
  constructor(props) {
    super(props);

    // this.props.data.topline [white, blue, yellow]

    this.state = {
    }
  }

  componentWillMount() {
    const data = {
      name: this.props.data.title,
      icon: this.props.data.title != 'Free' ? this.props.data.title.toLowerCase() : null,
      button: this.props.appplan.id != this.props.data.id && this.props.data.price != 0 ? true : false,
      topline: 
        this.props.data.title == 'PRO' ?
          'blue'
        : this.props.data.title == 'Business' ?
          'yellow'
        : 'white'
      , descr: 
        this.props.data.title == 'Free' ?
          'Базовый тарифный план, подходит для тестирования сервиса или редкой публикации задач'
        : this.props.data.title == 'PRO' ?
          'Выгодный тариф для тех, кто время от времени пользуется услугами сервиса'
        : this.props.data.title == 'Business' ?
          'Продвинутый тариф для компаний предприни-мателей, которым постоянно требуются исполнители задач или новые клиенты'
        : null
      , items:[{
        text: 'Цена в месяц, руб.',
        value: this.props.data.price
      },{
        text: 'Отклики',
        value: this.props.data.max_responds
      },{
        text: 'Тематические категории',
        value: this.props.data.max_tags
      },{
        text: 'Комиссии по БС',
        value: this.props.data.commission
      },{
        text: 'Наличие QR кода',
        value: this.props.data.qr ? true : false
      },{
        text: 'Скидка на поднятие в ТОП задач',
        value: this.props.data.discount_top ? this.props.data.discount_top + '%' : false
      },{
        text: 'Спецсимволы для повышения внимания к анкете',
        value: this.props.data.spec_char ? true : false
      },{
        text: 'Возможность создать открытую групповую запись',
        value: this.props.data.open_group_record ? true : false
      }]
    }

    this.setState({
      data: data
    })
  }

  renderLine(item, isLast = false, index) {
    return (
      <View key={"option_" + this.state.data.title + index} style={[styles.optLine, isLast ? {borderBottomWidth: 0} : null]}>
        <Text style={styles.optLeft}>
          {
            item.text ?
              item.text
            :
              '-'
          }
        </Text>
        <View style={styles.optRight}>
          {
            typeof(item.value) == 'string' ?
              <Text style={styles.optRight}>
                { item.value }
              </Text>
            :
            item.value ?
            <Svg width={18} height={14} viewBox="0 0 18 14">
              <Polygon
                fill={Colors.COLOR_GREEN}
                points="6,11.2 1.8,7 0.4,8.4 6,14 18,2 16.6,0.6 "/>
            </Svg>
            :
            <Svg width={14} height={14} viewBox="0 0 14 14">
              <Polygon
                fill={Colors.COLOR_DARK_RED}
                points="14,1.4 12.6,0 7,5.6 1.4,0 0,1.4 5.6,7 0,12.6 1.4,14 7,8.4 12.6,14 14,12.6 8.4,7 "/>
            </Svg>
          }
        </View>
      </View>
      )
  }

  render() {

    const options = this.state.data.items && this.state.data.items.length ? 
      this.state.data.items.map((item, index) => {
        return (this.renderLine(item, index == this.state.data.items.length - 1, index))
      })
    : null

    const icon = this.state.data.icon && this.state.data.icon == 'pro' ?
      <Svg width={28} height={12.587} viewBox="0 0 26 12.587" style={{marginBottom: 10}}>
        <Path 
          fill="#ABF3F0" 
          d="M12.098,5.842c0.498,0.249,0.502,0.651,0,0.902l-9.302,4.65C1.804,11.891,1,11.391,1,10.285
          V2.302c0-1.109,0.806-1.606,1.796-1.11L12.098,5.842z"/>
        <Path 
          fill="#3DCCC6" 
          d="M2.065,12.586C0.849,12.586,0,11.64,0,10.285V2.302C0,0.947,0.849,0,2.064,0
            c0.388,0,0.785,0.1,1.18,0.298l9.301,4.65c0.589,0.295,0.928,0.785,0.928,1.346c0,0.56-0.338,1.051-0.927,1.346l-9.302,4.65
            C2.849,12.487,2.453,12.586,2.065,12.586z M2.064,2C2.046,2.006,2,2.103,2,2.302v7.982c0,0.199,0.047,0.296,0.063,0.314l0.002-0.013
            c0.034,0,0.128-0.008,0.284-0.086l8.415-4.207L2.349,2.086C2.193,2.008,2.098,2,2.064,2z"/>
        <Path 
          fill="#ABF3F0" 
          d="M13.902,6.745c-0.499-0.249-0.503-0.651,0-0.902l9.301-4.65C24.195,0.696,25,1.195,25,2.302v7.983c0,1.108-0.807,1.605-1.797,1.109L13.902,6.745z"/>
        <Path 
          fill="#3DCCC6" 
          d="M23.936,12.587c-0.389,0-0.785-0.101-1.181-0.298l-9.3-4.65c-0.59-0.295-0.928-0.785-0.928-1.346
            c0-0.56,0.338-1.051,0.928-1.346l9.301-4.65C23.15,0.1,23.547,0,23.935,0C25.15,0,26,0.947,26,2.302v7.983
            C26,11.641,25.151,12.587,23.936,12.587z M15.236,6.293L23.65,10.5c0.232,0.116,0.309,0.085,0.31,0.085
            c-0.007-0.005,0.04-0.102,0.04-0.3V2.302c0-0.199-0.047-0.296-0.063-0.314C23.901,2,23.806,2.008,23.65,2.086L15.236,6.293z"/>
        <Circle 
          fill="#ABF3F0" 
          cx="13" 
          cy="6.293" 
          r="3"/>
        <Path 
          fill="#3DCCC6" 
          d="M13,9.793c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S14.93,9.793,13,9.793z
           M13,3.793c-1.378,0-2.5,1.122-2.5,2.5c0,1.379,1.122,2.5,2.5,2.5c1.379,0,2.5-1.121,2.5-2.5C15.5,4.915,14.379,3.793,13,3.793z"/>
      </Svg>
    : this.state.data.icon && this.state.data.icon == 'business' ?
      <Svg width={8} height={24} viewBox="0 0 8 24" style={{marginBottom: 10}}>
        <Path 
          fill="#F9EED3" 
          d="M4,7L1,1h6L4,7z M4,23l-3-6L4,7l3,10L4,23z"/>
        <Path 
          fill="#FFB700" 
          d="M4,8C3.621,8,3.275,7.786,3.105,7.447l-3-6c-0.155-0.31-0.138-0.678,0.044-0.973C0.332,0.18,0.653,0,1,0h6
            c0.347,0,0.668,0.18,0.851,0.474C8.033,0.769,8.05,1.137,7.895,1.447l-3,6C4.725,7.786,4.379,8,4,8z M2.618,2L4,4.764L5.382,2H2.618
            z M4,24c-0.379,0-0.725-0.214-0.895-0.553l-3-6c-0.114-0.228-0.137-0.49-0.063-0.734l3-10C3.169,6.29,3.559,6,4,6
            s0.831,0.29,0.958,0.713l3,10c0.073,0.244,0.051,0.507-0.063,0.734l-3,6C4.725,23.786,4.379,24,4,24z M2.072,16.907L4,20.764
            l1.928-3.856L4,10.48L2.072,16.907z"/>
      </Svg>
    : null

    return (
      <View style={[
        styles.card,
        this.state.data.topline == 'blue' ?
          styles.cardBlue
        : 
        this.state.data.topline == 'yellow' ?
          styles.cardYellow
        : null]}>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.title, {marginBottom: 10, flex: 1}]}>
            { this.state.data.name }
          </Text>
          { icon }
        </View>

        {
          this.state.data.descr ?
          <Text style={styles.subTitle}>
            { this.state.data.descr }
          </Text>
          : null
        }

        {
          this.state.data.items ?
          <View style={{marginVertical: 20}}>
            { options }
          </View>
          : null
        }

        {
          this.state.data.button ?
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity style={[buttonsStyles.buttonLined, buttonsStyles.blue]} onPress={() => this.props.buy()}>
                <Text style={[buttonsStyles.blue, buttonsStyles.buttonMidSize]}>
                  Подключить
                </Text>
              </TouchableOpacity>
            </View>
          : null
        }

      </View>
    )
  }
};


export default PlanCard;