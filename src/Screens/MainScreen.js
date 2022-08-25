import React, { Component } from 'react';
import {ScrollView,View,StyleSheet,Platform,Image,PixelRatio} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';
const Tab = createBottomTabNavigator();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../Utils/CommonUtil';

//Tabs 01
import Tabs01Stack from './Tabs01/Tabs01Stack'; 
//import SubNavigation from '../Route/SubNavigation';
//Tabs 02
//import Tabs02Stack from './Tabs02/Tabs02Stack'; 
import { CategoryListStack}  from './Tabs02/CategoryListStack'; 
//Tabs 03
import Tabs03Stack from './Tabs03/Tabs03Stack'; 
//Tabs 04
import Tabs04Stack from './Tabs04/Tabs04Stack'; 
import TabsCenterStack from './Tabs04/Tabs04Stack'; 
import { CustomTextR } from '../Components/CustomText';

const AddButton = () => {
    return null
}

class MainScreen extends React.PureComponent {

    constructor(props) {
        super(props);        
        this.state = {
        }
       
        props.navigation.addListener('tabPress', (e) => {
            // Prevent default behavior
            //e.preventDefault();
            //console.log('MainScreenMainScreen')
          });
    }

    async UNSAFE_componentWillMount() {
        const autoLogin = await AsyncStorage.getItem('autoLoginData');        
        if(!CommonUtil.isEmpty(autoLogin) ) {           
            const autoLogin2 = JSON.parse(autoLogin); 
            await this.props._saveUserToken(autoLogin2);
            setTimeout(() => {
                this.props._saveNonUserToken({uuid : autoLogin2.uuid});
            }, 500);    
        }
    }

    CustomTabsLabel = (str,tcolor = '#fff' ) => {                    
        return (
            <CustomTextR style={[styles.labelText,{color:tcolor}]}>{str}</CustomTextR>
        )
    }

    render() {
        return(
            <Tab.Navigator
                initialRouteName="Tabs01Stack"
                tabBarOptions={{
                    activeTintColor: DEFAULT_COLOR.base_color,
                    activeBackgroundColor: '#ffffff',
                    inactiveBackgroundColor: '#ffffff',
                    inactiveTintColor:  '#979797',
                    style:{}
                }}
                //tabPress={this.actionToggleDrawer()}
            >
                <Tab.Screen
                    name="Tabs01Stack"
                    //component={Tabs01Stack}
                    options={(navigation) => ({
                        tabBarLabel: ({color})=>this.CustomTabsLabel('홈',color),
                        tabBarIcon: ({color}) => 
                        <Image 
                        source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/tab1_on.png') : require('../../assets/icons/tab1_off.png')}
                            style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                        />,
                    })}
                >
                    {props => <Tabs01Stack {...props} screenState={this.state} screenProps={this.props} />}
                </Tab.Screen>
                <Tab.Screen
                    name="CategoryListStack"
                    component={CategoryListStack}
                    options={{    
                        tabBarLabel: ({color})=>this.CustomTabsLabel('카테고리',color),
                        tabBarIcon: ({color}) => (
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/tab2_on.png') : require('../../assets/icons/tab2_off.png')}
                                    resizeMode={'contain'}
                                    style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                                />
                            </View>
                        ),
                        //barStyle: {backgroundColor: '#ffffff'},
                    }}
                    
                />
                {/*
                <Tab.Screen
                    name="AddButton"
                    component={AddButton}
                    options={{
                        tabBarLabel: ({color})=>this.CustomTabsLabel('',color),
                        tabBarIcon: ({color}) => (
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/btn_add.png') : require('../../assets/icons/btn_add.png')}
                                    resizeMode={'contain'}
                                    style={Platform.OS === 'ios' ? styles.tabsWrapiOS2 : styles.tabsWrapAndroid2}
                                />
                            </View>
                        ),                    
                        //barStyle: {backgroundColor: '#ffffff'},
                    }}
                />
                */}
                <Tab.Screen
                    name="Tabs03Stack"
                    component={Tabs03Stack}
                    options={{
                        tabBarLabel: ({color})=>this.CustomTabsLabel('검색',color),
                        tabBarIcon: ({color}) => (
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/tab3_on.png') : require('../../assets/icons/tab3_off.png')}
                                    resizeMode={'contain'}
                                    style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                                />
                            </View>
                        ),                    
                        //barStyle: {backgroundColor: '#ffffff'},
                    }}
                />
                <Tab.Screen
                    name="Tabs04Stack"
                    component={Tabs04Stack}
                    options={{
                        tabBarLabel: ({color})=>this.CustomTabsLabel('마이페이지',color),
                        tabBarIcon: ({color}) => (
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/tab5_on.png') : require('../../assets/icons/tab5_off.png')}
                                    resizeMode={'contain'}
                                    style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                                />
                            </View>
                        ),
                        //barStyle: {backgroundColor: '#ffffff'},
                    }}
                />
            </Tab.Navigator>
        );
    }
    
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelText : { 
        fontSize : DEFAULT_TEXT.fontSize10,        
        margin : 0,padding:0,
        paddingTop:2,
        ...Platform.select({
            ios : {
                marginTop:-5,
                marginBottom:5
            },
            android : {
                marginTop:2,
                marginBottom:-2
            }
        })
    },
    tabsWrapAndroid : {
        width:CommonUtil.dpToSize(22),height:CommonUtil.dpToSize(22),marginTop:15
    },
    tabsWrapiOS : {
        width:CommonUtil.dpToSize(22),height:CommonUtil.dpToSize(22),marginTop:0
    },
    tabsWrapAndroid2 : {
        width:PixelRatio.roundToNearestPixel(44),height:PixelRatio.roundToNearestPixel(44),marginTop:15
    },
    tabsWrapiOS2 : {
        width:PixelRatio.roundToNearestPixel(60),height:PixelRatio.roundToNearestPixel(60),marginTop:0
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        },
        
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(MainScreen);