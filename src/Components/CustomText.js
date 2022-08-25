import React from 'react';
import { StyleSheet, Text, Image ,View,PixelRatio,Platform } from 'react-native';
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;


export const CustomText = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.text,style, (style && style.fontSize) && {lineHeight: Platform.OS === 'android' ? style.fontSize : style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextL = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textLight,style, (style && style.fontSize) && {lineHeight: Platform.OS === 'android' ? style.fontSize * 1.3: style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextDL = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textDemiLight,style, (style && style.fontSize) && {lineHeight: Platform.OS === 'android' ? style.fontSize* 1.3 : style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextM = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textMedium,style, (style && style.fontSize) && {lineHeight: Platform.OS === 'android' ? style.fontSize* 1.3: style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextR = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textregular,style, (style && style.fontSize) && {lineHeight: Platform.OS === 'android' ? style.fontSize* 1.3 : style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextB = ( props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textbold,style, (style && style.fontSize) && {lineHeight: Platform.OS === 'android' ? style.fontSize* 1.3 : style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}


export const TextRobotoL = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.robotoLight,style]} {...otherProps}>{props.children}</Text>
    )
}
export const TextRobotoR = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.robotoRegular,style]} {...otherProps}>{props.children}</Text>
    )
}
export const TextRobotoM = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.robotoMedium,style]} {...otherProps}>{props.children}</Text>
    )
}
export const TextRobotoB = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.robotoBold,style]} {...otherProps}>{props.children}</Text>
    )
}

export const DropBoxIcon = () => {
    return (
        <View style={styles.boxWrap}>
            <Image
                source={require('../../assets/icons/dropdown.png')}
                resizeMode={"contain"}
                style={styles.boxIcons}
            />
        </View>   
    )
}

export const DropBoxIconSmall = () => {
    return (
        <View style={styles.boxWrap2}>
            <Image
                source={require('../../assets/icons/dropdown.png')}
                resizeMode={"contain"}
                style={styles.boxIcons2}
            />
        </View>   
    )
}

export const DropBoxIconSmallOpen = () => {
    return (
        <View style={styles.boxWrap2}>
            <Image
                source={require('../../assets/icons/btn_select_open.png')}
                resizeMode={"contain"}
                style={styles.boxIcons2}
            />
        </View>   
    )
}
export const DropBoxIconSmallClose = () => {
    return (
        <View style={styles.boxWrap2}>
            <Image
                source={require('../../assets/icons/btn_select_close.png')}
                resizeMode={"contain"}
                style={styles.boxIcons2}
            />
        </View>   
    )
}


const styles = StyleSheet.create({
    text: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamily
    },
    textLight: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyLight
    },
    textDemiLight: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyDemiLight
    },
    textMedium: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyMedium
    },
    textregular: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular
    },
    textbold: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyBold
    },
    robotoLight: {
        fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyLight
    },
    robotoMedium: {
        fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyMedium
    },
    robotoRegular: {
        fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyRegular
    },
    robotoBold: {
        fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyBold
    },

    boxWrap : {
        position:'absolute',top:15,right:25,width:20,height:20,alignItems:'flex-end',zIndex:10
    },
    boxIcons : {
        width:PixelRatio.roundToNearestPixel(12),height:PixelRatio.roundToNearestPixel(12)
    },
    boxWrap2 : {
        width:10,height:10,zIndex:10,paddingLeft:10,paddingTop:3
    },
    boxIcons2 : {
        width:PixelRatio.roundToNearestPixel(8),height:PixelRatio.roundToNearestPixel(8)
    }
});