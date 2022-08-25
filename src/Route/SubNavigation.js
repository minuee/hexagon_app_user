import React, {useContext} from 'react';
import { Image,View,TouchableOpacity,Dimensions,PixelRatio} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {useSelector,useDispatch} from 'react-redux';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../Utils/CommonUtil';
import CommonFunction from '../Utils/CommonFunction';
import {CustomTextB} from '../Components/CustomText';
import DrawerMenu from './DrawerMenu';
/* 로그인 홈 */
import IntroScreen from '../Screens/Tabs01/IntroScreen';
import MainScreen from '../Screens/MainScreen';
/* 비 로그인시 */
//import AuthStack from '../Screens/Auth/IntroScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

import 'moment/locale/ko'
import  moment  from  "moment";
const TodayTimeStamp = moment()+840 * 60 * 1000;  // 서울
const NavigationDrawerStructure = (props)=> {    
    const toggleDrawer = () => {      
      props.navigationProps.toggleDrawer();
    };
  
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={()=> toggleDrawer()}>          
          <Image
            source={{uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png'}}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
}

function HomeScreenStack({ navigation }) {    
    return (
        <Stack.Navigator 
            initialRouteName="IntroScreen"
            screenOptions={{          
                headerLeft : (props) => (<View style={{flex:1,flexGrow:1}} />),                     
                headerTitle : () => (
                <View style={{flex:2,justifyContent:'center',alignItems:'center',paddingRight:25}}>
                    <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>핏투데이케어 - 합정점</CustomTextB>
                </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />),
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.base_color, //Set Header color
                }
            }}
            >
            <Stack.Screen
                name="IntroScreen"
                component={IntroScreen}
            />
        </Stack.Navigator>
    );
}


export default function SubNavigation(props) {
    
    const dispatch = useDispatch();    
    const reduxData = useSelector(state => state);
    const {userToken} = reduxData.GlabalStatus;
    //const {userToken} = useContext(UserTokenContext);
    //const userToken = useSelector((store) => store);
    
    return (      
        
        <Drawer.Navigator
            drawerContentOptions={{
            activeTintColor: '#e91e63',
                itemStyle: { marginVertical: 5 },
            }}
            drawerContent={(props) => <DrawerMenu {...props} />}
            //drawerType="slide"
            edgeWidth={250}
            //hideStatusBar={Platform.OS === 'android' ? true : false}
            drawerPosition="left"
            drawerStyle={{
                width: Dimensions.get('window').width * 0.5,
            }}
        >
            <Drawer.Screen 
                name="HomeScreenStack" 
                options={{ drawerLabel: 'First page Option' }} 
                //component={HomeScreenStack} 
            >
                {props => <HomeScreenStack {...props} />}
            </Drawer.Screen>
        </Drawer.Navigator>
       
    );
}

