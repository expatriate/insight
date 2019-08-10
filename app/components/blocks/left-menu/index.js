import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Svg, {
    Path,
    Circle,
    Polygon
} from 'react-native-svg';

import {
  navigateToProfile,
  navigateToTasksCatalogPage,
  navigateToMyFinance,
  navigateToCreateTask,
  navigateToMyTasks,
  navigateToMyTeam,
  navigateToStart,
  navigateToPerformersCatalog,
  navigateToProfileUpgrade,
  navigateToMyReviews,
  logout,
} from '../../../actions';

import { 
  Colors, 
  Gradients 
} from '../../styles/colors.js';

import styles from './styles';
import baseStyles from '../../styles/base.js';
import formsStyles from '../../styles/forms.js';
import buttonsStyles from '../../styles/buttons.js';

class LeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {
  }

  logout() {
    this.props.logout()
    this.props.navigateToStart()
  }


  render() {
    
    return (
      <ScrollView style={{backgroundColor: Colors.COLOR_DARK_GRAY_1}}>
        <View style={[baseStyles.container, {width:'100%'}]}>
          <View style={styles.menu_header}>
            <Svg width={150} height={35} viewBox="0 0 170 47">
              <Path fill="#FFFFFF" d="M53.018,21.191h-1.832l-2.964-8.72h-0.173l-0.087,12.12H46.39l0.35-13.342h2.441l2.877,8.632h0.087
                l2.791-8.632h2.355l0.523,13.342h-1.656l-0.087-12.12h-0.087L53.018,21.191z M65.4,24.591v-4.97l-3.924-8.372h1.832l2.877,7.063
                h0.087l2.877-7.063h1.831l-4.01,8.458l0.087,4.884H65.4z M74.123,11.25h9.067v1.482l-3.751-0.087V24.59h-1.567V12.645l-3.751,0.087
                V11.25H74.123z M87.116,24.591V11.25h6.541v1.482l-4.887-0.087l-0.088,4.534h4.536v1.308h-4.536l0.088,4.707h4.887v1.397h-6.541
                V24.591z M103.943,19.708l-1.745-7.15h-0.087l-1.742,7.15H103.943z M99.062,24.591h-1.746l3.75-13.428h2.005l3.75,13.428h-1.744
                l-0.959-3.574h-4.271L99.062,24.591z M117.545,21.191h-1.827l-2.969-8.72h-0.082l-0.091,12.12h-1.654l0.436-13.342h2.352
                l2.877,8.632h0.091l2.787-8.632h2.442l0.435,13.342h-1.653l-0.091-12.12h-0.083L117.545,21.191z"/>
              <Path fill="#54BDBE" d="M127.137,22.938h2.01v1.741h-2.01V22.938z M135.77,18.573c0.877,0.177,1.745,0.263,2.53,0.263
                c0.784,0,1.307-0.088,1.569-0.35c0.348-0.35,0.521-1.395,0.521-3.051c0-1.658-0.26-2.617-0.695-2.877
                c-0.265-0.176-0.871-0.35-1.744-0.35s-1.657,0.087-2.356,0.174v6.191H135.77L135.77,18.573z M135.77,24.591h-1.653l0.088-6.192
                l-0.088-7.15c1.571-0.173,2.963-0.261,4.274-0.261c2.525,0,3.746,1.482,3.746,4.446c0,3.138-1.307,4.709-4.011,4.709l-2.438-0.088
                v4.534L135.77,24.591L135.77,24.591z M148.239,17.79c1.224,0.088,2.183,0.174,3.055,0.174c0.785,0,1.394-0.174,1.746-0.609
                c0.346-0.436,0.524-1.134,0.524-2.181c0-1.482-0.265-2.354-0.786-2.615c-0.265-0.176-0.876-0.263-1.658-0.263
                c-0.786,0-1.745,0.087-2.79,0.176L148.239,17.79z M148.239,24.591h-1.654l0.088-6.365l-0.088-7.063
                c1.224-0.173,2.704-0.262,4.275-0.262c2.877,0,4.271,1.395,4.271,4.186c0,2.182-0.959,3.488-2.878,4.011v0.088l3.052,5.405h-1.919
                l-2.791-5.319l-2.439-0.087v5.405L148.239,24.591L148.239,24.591z M162.63,12.819c-0.434,0.262-0.785,0.785-0.959,1.57
                c-0.177,0.783-0.351,1.918-0.351,3.314c0,1.394,0.091,2.441,0.174,3.138c0.091,0.699,0.351,1.311,0.611,1.658
                c0.265,0.347,0.612,0.612,0.959,0.785c0.348,0.088,0.874,0.174,1.571,0.174c0.694,0,1.307-0.088,1.654-0.347
                c0.876-0.525,1.397-2.183,1.397-5.061c0-2.878-0.44-4.621-1.307-5.143c-0.44-0.263-1.051-0.35-1.833-0.35
                C163.677,12.471,163.064,12.559,162.63,12.819 M166.381,24.591c-0.526,0.174-1.224,0.347-1.92,0.347
                c-0.698,0-1.396-0.083-1.919-0.347c-0.523-0.174-1.05-0.521-1.57-1.045c-0.96-1.046-1.48-2.877-1.48-5.582
                c0-2.704,0.521-4.533,1.48-5.582c0.439-0.523,0.96-0.87,1.57-1.045c0.521-0.174,1.221-0.347,1.919-0.347
                c0.694,0,1.394,0.087,1.92,0.347c0.521,0.176,1.045,0.523,1.569,1.045c0.959,0.959,1.48,2.877,1.48,5.582
                c0,2.705-0.521,4.622-1.48,5.582C167.426,23.979,166.992,24.33,166.381,24.591"/>
              <Path fill="#54BDBE" d="M20.666,2.791c0,1.482-1.219,2.791-2.791,2.791c-1.482,0-2.788-1.219-2.788-2.791
                C15.087,1.222,16.393,0,17.964,0C19.447,0,20.666,1.222,20.666,2.791 M20.666,36.8c0,1.484-1.219,2.791-2.791,2.791
                c-1.482,0-2.788-1.224-2.788-2.791c0-1.57,1.219-2.79,2.788-2.79C19.447,34.097,20.666,35.315,20.666,36.8 M35.403,28.081
                c0,1.48-1.219,2.787-2.791,2.787c-1.481,0-2.791-1.215-2.791-2.787c0-1.484,1.222-2.791,2.791-2.791
                C34.184,25.377,35.403,26.597,35.403,28.081 M5.582,28.081c0,1.48-1.222,2.787-2.792,2.787c-1.481,0-2.703-1.215-2.703-2.787
                c0-1.484,1.222-2.791,2.791-2.791C4.36,25.377,5.582,26.597,5.582,28.081 M35.403,11.512c0,1.482-1.219,2.788-2.791,2.788
                c-1.481,0-2.791-1.219-2.791-2.788c0-1.571,1.222-2.791,2.791-2.791C34.184,8.721,35.403,9.941,35.403,11.512 M5.582,11.512
                c0,1.482-1.222,2.788-2.792,2.788C1.309,14.3,0,13.081,0,11.512c0-1.571,1.308-2.791,2.877-2.791
                C4.36,8.721,5.582,9.941,5.582,11.512 M22.497,19.795c0,2.53-2.004,4.535-4.533,4.535c-2.53,0-4.535-2.004-4.535-4.535
                c0-2.529,2.005-4.535,4.535-4.535C20.493,15.26,22.497,17.267,22.497,19.795"/>
              <Path fill="none" stroke="#54BDBE" stroke-width="0.34" stroke-miterlimit="10" d="M17.789,2.791v17.005L3.052,11.25 M3.139,28.342
                l14.737-8.546V36.8 M17.964,36.8V19.795l14.737,8.546 M32.701,11.25l-14.737,8.546V2.791 M2.964,10.726l15-8.632l14.911,8.632
                v17.354L17.964,36.8l-15-8.719V10.726z"/>
            </Svg>
            <Text style={styles.header_ourteam}>
              Моя команда профессионалов
            </Text>
          </View>
          <View style={styles.menu_header_subitem}>
            <TouchableOpacity  onPress={() => this.props.navigateToPerformersCatalog()}>
              <Text style={styles.menu_header_subitem_text}>
                Каталог исполнителей
              </Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => this.props.navigateToTasksCatalogPage()}>
              <Text style={[styles.menu_header_subitem_text, styles.menu_header_subitem_bordered]}>
                Каталог задач
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[baseStyles.container, styles.menuContainer]}>
            <TouchableOpacity  onPress={() => {console.warn(this.props.nav);this.props.navigateToProfile()}}>
              <View style={styles.menu__profile}>

                {
                  this.props.user.photo && this.props.user.photo.photo.length ?
                    <Image style={[styles.profileAvatar,
                      this.props.app.appplan.title == 'PRO' ?
                      {borderColor: Colors.COLOR_LIGHT_BLUE} :
                        this.props.app.appplan.title == 'Business' ?
                        {borderColor: Colors.COLOR_YELLOW} :
                        {borderColor: Colors.COLOR_WHITE}]}
                        source={{uri:`${this.props.user.photo.path}${this.props.user.photo.photo[0].photo_cropped}`}}
                        resizeMode='cover'/>
                  :
                    <Image style={[styles.profileAvatar,
                      this.props.app.appplan.title == 'PRO' ?
                      {borderColor: Colors.COLOR_LIGHT_BLUE} :
                        this.props.app.appplan.title == 'Business' ?
                        {borderColor: Colors.COLOR_YELLOW} :
                        {borderColor: Colors.COLOR_WHITE}]}
                        source={require('../../../../assets/images/ava.png')}
                        resizeMode='cover'/>
                }
                <View style={baseStyles.col}>
                  <Text style={styles.menu__name}>
                    {this.props.user.data.name}
                  </Text>
                  <Text style={styles.menu__name}>
                    {this.props.user.data.surname}
                  </Text>
                </View>
                {
                  this.props.app.appplan.title == 'PRO' ?
                    <Svg width={50} height={22} viewBox={'-4.875 -2 47.208 22'}>
                      <Path 
                        fill="#36B5BE" stroke="#FCFCFC" stroke-width="3" d="M17.098,8.165c0.916,0.457,0.925,1.198,0,1.66l-17.125,8.561
                          c-1.825,0.914-3.305-0.007-3.305-2.043V1.647c0-2.043,1.483-2.955,3.305-2.044L17.098,8.165z M20.418,9.825
                          c-0.917-0.459-0.925-1.197,0-1.66l17.123-8.562c1.824-0.911,3.308,0.007,3.308,2.044v14.698c0,2.04-1.485,2.955-3.308,2.041
                          L20.418,9.825z"
                        />
                      <Circle 
                        fill="#36B5BE" stroke="#FCFCFC" stroke-width="3" cx="18.758" cy="8.995" r="5.522"
                        />
                    </Svg>
                  : this.props.app.appplan.title == 'Business' ?
                    <Svg width={50} height={32} viewBox="-0.563 0 15 46.625">
                      <Polygon 
                        fill={Colors.COLOR_YELLOW} 
                        points="7,13 1,1 13,1 "/>
                      <Path 
                        fill="none" 
                        stroke="#FFFFFF"
                        d="M7,14.118L0.191,0.5h13.618L7,14.118z"/>
                      <Polygon 
                        fill={Colors.COLOR_YELLOW} 
                        points="7,45 1,33 7,13 13,33 "/>
                      <Path 
                        fill="none" 
                        stroke="#FFFFFF"
                        d="M7,46.118L0.464,33.047L7,11.26l6.536,21.787L7,46.118z"/>
                    </Svg>
                  : undefined
                }
              </View>
            </TouchableOpacity>
            {/*<View style={styles.menu__item}>*/}
              {/*<Text style={styles.name}>Лента новостей</Text>*/}
              {/*<View style={styles.counter}>*/}
                {/*<Text style={styles.counter_text}>*/}
                  {/*22*/}
                {/*</Text>*/}
              {/*</View>*/}
            {/*</View>*/}
            <View style={styles.menu__item}>
              <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigateToMyTeam()}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 8, width:24, height: 24}}>
                    <Path 
                      fill={Colors.COLOR_DARK_GRAY}
                      d="M20,0 L4,0 L4,2 L20,2 L20,0 L20,0 Z M4,24 L20,24 L20,22 L4,22 L4,24 L4,24 Z M20,4 L4,4 C2.9,4 2,4.9 2,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 C22,4.9 21.1,4 20,4 L20,4 Z M12,6.75 C13.24,6.75 14.25,7.76 14.25,9 C14.25,10.24 13.24,11.25 12,11.25 C10.76,11.25 9.75,10.24 9.75,9 C9.75,7.76 10.76,6.75 12,6.75 L12,6.75 Z M17,17 L7,17 L7,15.5 C7,13.83 10.33,13 12,13 C13.67,13 17,13.83 17,15.5 L17,17 L17,17 Z"
                          />
                  </Svg>
                  <Text style={styles.name}>Моя команда</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.menu__item}>
              <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigateToMyTasks()}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Svg width={24} height={24} viewBox="0 0 20 20" style={{marginRight: 8, width:24, height: 24}}>
                    <Path 
                      fill={Colors.COLOR_DARK_GRAY}
                      d="M10,0C4.48,0,0,4.48,0,10c0,5.52,4.48,10,10,10c5.52,0,10-4.48,10-10C20,4.48,15.52,0,10,0
                          L10,0z M8,15l-5-5l1.41-1.41L8,12.17l7.59-7.59L17,6L8,15L8,15z"
                          />
                  </Svg>
                  <Text style={styles.name}>Мои задачи</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.menu__item}>
              <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigateToMyReviews()}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 8, width:24, height: 24}}>
                    <Polygon 
                      fill={Colors.COLOR_DARK_GRAY}
                      points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21"
                          />
                  </Svg>
                  <Text style={styles.name}>Моя отзывы</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/*<View style={styles.menu__item}>*/}
              {/*<Text style={styles.name}>Мои сообщения</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.menu__item}>*/}
              {/*<Text style={styles.name}>Мое расписание</Text>*/}
              {/*<View style={styles.counter}>*/}
                {/*<Text style={styles.counter_text}>*/}
                  {/*22*/}
                {/*</Text>*/}
              {/*</View>*/}
            {/*</View>*/}
            {/*<View style={styles.menu__item}>*/}
              {/*<Text style={styles.name}>Мой блог</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.menu__item}>*/}
              {/*<Text style={styles.name}>Мои услуги</Text>*/}
            {/*</View>*/}
            <View style={styles.menu__item}>
              <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigateToMyFinance()}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" style={{marginRight: 8, width:24, height: 24}}>
                    <Path 
                      fill={Colors.COLOR_DARK_GRAY}
                      d="M21,18 L21,19 C21,20.1 20.1,21 19,21 L5,21 C3.89,21 3,20.1 3,19 L3,5 C3,3.9 3.89,3 5,3 L19,3 C20.1,3 21,3.9 21,5 L21,6 L12,6 C10.89,6 10,6.9 10,8 L10,16 C10,17.1 10.89,18 12,18 L21,18 L21,18 Z M12,16 L22,16 L22,8 L12,8 L12,16 L12,16 Z M16,13.5 C15.17,13.5 14.5,12.83 14.5,12 C14.5,11.17 15.17,10.5 16,10.5 C16.83,10.5 17.5,11.17 17.5,12 C17.5,12.83 16.83,13.5 16,13.5 L16,13.5 Z"
                          />
                  </Svg>
                  <Text style={styles.name}>Мои финансы</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.menu__item, styles.menu__item_flex]}>
              {/*<Text style={styles.name}>Настройки</Text>*/}
              <Text style={styles.name}>{' '}</Text>
              <TouchableOpacity onPress={() => this.logout()} style={styles.menu__item_exit}>
                <Text style={styles.menu__item_exitText}>Выход</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu__plain}>
              <TouchableOpacity onPress={() => this.props.navigateToCreateTask()}>
                <LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>
                  <View>
                    <View style={[buttonsStyles.buttonMiddle]}>
                      <Text style={buttonsStyles.buttonMiddleText}>Создать новую задачу</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menu__split}>
            <View style={styles.menu__split__item}>
              <Text style={styles.menu__split__text}>
                О&nbsp;проекте{'\n'}и&nbsp;помощь
              </Text>
            </View>
            <View style={[styles.menu__split__item, styles.menu__split__item__bordered]}>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.props.navigateToProfileUpgrade()}>
                <Svg viewBox="0 0 24 24" width={24} height={24} style={{marginRight: 10}}>
                  <Circle 
                    fill="#3DCCC6" 
                    cx="12" 
                    cy="12" 
                    r="10"/>
                  <Path 
                    fill="#FFFFFF" 
                    d="M11,14.008L13.004,14C15.209,14,17,12.209,17,10s-1.791-4-4-4h-2v2h2c1.104,0,2,0.896,2,2s-0.896,2-2,2
                    l-2,0.008V14.008z M9,6h2v13H9V6z M10.984,15h0.502H14v2h-2.513h-0.502V15z M8,17v-2h1v2H8z"/>
                </Svg>
                <Text style={[styles.menu__split__text, styles.menu_blue]}>
                  Платные{'\n'}опции
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/*<View style={styles.menu__plain}>*/}
            {/*<TouchableHighlight underlayColor="transparent">*/}
              {/*<LinearGradient style={[buttonsStyles.buttonWrapper, buttonsStyles.round]} colors={['#3dccc6', '#31a3b7']}>*/}
                {/*<View>*/}
                  {/*<View style={[buttonsStyles.buttonMiddle]}>*/}
                    {/*<Text style={buttonsStyles.buttonMiddleText}>Пригласить друга</Text>*/}
                  {/*</View>*/}
                {/*</View>*/}
              {/*</LinearGradient>*/}
            {/*</TouchableHighlight>*/}
            {/*<Text style={styles.menu__plain__text}>*/}
              {/*И получить на счет 100 Р*/}
            {/*</Text>*/}
          {/*</View>*/}
        </View>
      </ScrollView>
    )
  }
};



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      logout: logout,
      navigateToProfile: navigateToProfile,
      navigateToTasksCatalogPage: navigateToTasksCatalogPage,
      navigateToCreateTask: navigateToCreateTask,
      navigateToMyTasks: navigateToMyTasks,
      navigateToMyTeam: navigateToMyTeam,
      navigateToStart: navigateToStart,
      navigateToMyFinance: navigateToMyFinance,
      navigateToPerformersCatalog: navigateToPerformersCatalog,
      navigateToProfileUpgrade: navigateToProfileUpgrade,
      navigateToMyReviews: navigateToMyReviews
    }, dispatch);
};

export default connect(
  state => {
    return {
      user: state.user,
      nav: state.nav,
      app: state.app
    }
  }, mapDispatchToProps
)(LeftMenu);