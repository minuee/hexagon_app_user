import React, { Component } from 'react';
import {View,PixelRatio,BackHandler,Dimensions,TouchableOpacity,Image} from 'react-native';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {Calendar,LocaleConfig} from 'react-native-calendars';
LocaleConfig.locales['kr'] = {
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
    dayNamesShort: ['일','월','화','수','목','금','토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';
  
import CommonUtil from '../Utils/CommonUtil';

import 'moment/locale/ko'
import  moment  from  "moment";

const currentDate =  moment().add(0, 'd').format('YYYY-MM-DD');
const minDate =  moment().add(1, 'd').format('YYYY-MM-DD');
const maxDate =  moment().add(60, 'd').format('YYYY-MM-DD');


const SelectCalendar=(props)=>{            
    return (
        <View style={{flex:1,paddingVertical:10}}>
            
            <Calendar
                // Initially visible month. Default = Date()
                current={ CommonUtil.isEmpty(props.current) ? currentDate : props.current }
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={ CommonUtil.isEmpty(props.minDate) ? minDate : props.minDate }
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={ CommonUtil.isEmpty(props.maxDate) ? maxDate : props.maxDate }
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {
                    props.onDayLongPress(day)
                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={(day) => {console.log('selected day', day)}}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'yyyy년 MM월'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(month) => {console.log('month changed', month)}}
                // Hide month navigation arrows. Default = false
                //hideArrows={true}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                //renderArrow={(direction) => (<Arrow/>)}
                // Do not show days of other months in month page. Default = false
                //hideExtraDays={true}
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                //disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={0}
                // Hide day names. Default = false
                //hideDayNames={true}
                // Show week numbers to the left. Default = false
                //showWeekNumbers={true}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                //onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                //onPressArrowRight={addMonth => addMonth()}
                // Disable left arrow. Default = false
                //disableArrowLeft={true}
                // Disable right arrow. Default = false
                //disableArrowRight={true}
                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                //disableAllTouchEventsForDisabledDays={true}
                /** Replace default month and year title with custom one. the function receive a date as parameter. */
                //renderHeader={(date) => {/*Return JSX*/}}
            />
        </View>
    )
}

export default SelectCalendar;