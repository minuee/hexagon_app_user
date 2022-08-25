import {Dimensions, Platform} from 'react-native';
const  isIphoneX = () => {
    const dimen = Dimensions.get('window');
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((dimen.height === 812 || dimen.height === 844 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    );
}

const DEFAULT_CONSTANTS = {
    appID : 'hexagonuser',
    appName : '슈퍼바인더 관리자',
    superAdminID : 'superbinder',
    logoImage : '',
    androidPackageName : 'com.hexagonadmin',
    iosBundleId : 'kr.co.hexagonadmin',
    iosAppStoreID : 0,
    CommonSaltKey : 'hexagonadmineda40baa4fHynnm4W1',
    defaultFontFamily : 'NotoSansKR-Regular',         // default,
    defaultFontFamilyDemiLight : 'NotoSansKR-Thin',         // Demi Light,
    defaultFontFamilyLight : 'NotoSansKR-Light',         // Light,
    defaultFontFamilyRegular : 'NotoSansKR-Regular',  // Regular
    defaultFontFamilyMedium : 'NotoSansKR-Medium',  // Medium
    defaultFontFamilyBold : 'NotoSansKR-Bold',    // Bold

    robotoFontFamilyLight : 'Roboto-Light',         // Light,
    robotoFontFamilyRegular : 'Roboto-Regular',  // Medium
    robotoFontFamilyMedium : 'Roboto-Medium',  // Regular
    robotoFontFamilyBold : 'Roboto-Bold',    // Bold, Extra Bold

    defaultImageDomain : 'https://hg-prod-file.s3-ap-northeast-1.amazonaws.com',
    apiAdminDomain : 'https://b2e4ceh3wj.execute-api.ap-northeast-1.amazonaws.com/hax-prod-api-stage',
    BottomHeight : isIphoneX() ? 70 : 50,

    return_CashTitle : '포인트로 환급',
    return_ProductTitle : '상품 입고시 배송',

    
    CompanyInfoTitle : "(주)헥사곤무역산업",
    CompanyInfoRegistCode : "127-87-01023",
    CompanyInfoRegistCode2 : "제2020-서울강남-03180호",
    CompanyInfoCEO : "양승혁",
    CompanyInfoAddress : "서울특별시 강남구 선릉로 704, 10층,12층 1006호(청담동,청담벤처프라자)",
    CompanyInfoTel : "02-545-8509",
    CompanyInfoEmail : "ask_any_q@hexagonti.com",

    baseDeliveryCost: 5500,
    bronzeDeliveryFreeCost: 1500000,
    silverDeliveryFreeCost: 1000000,

    //iamport 
    iamPortAPIDomain : 'https://api.iamport.kr',
    iamPortAPIKey : '2385858933222203',
    iamPortAPISecrentKey : '2f800063d3b1f06f2d93bc86c30ac1009b4c0ee8fea6ba0e0653b57e65d0e8b30683f48a96aa6de4'
}

export { DEFAULT_CONSTANTS }

/* 단위 sp */
const DEFAULT_TEXT = {
    head_large : 23,
    head_medium : 20,
    head_small : 15,
    body_14 : 14,
    body_13 : 13,
    body_12 : 12,
    fontSize30:31,
    fontSize29:30,
    fontSize28:29,
    fontSize27:28,
    fontSize26:27,
    fontSize25:26,
    fontSize24:25,    
    fontSize23:24,
    fontSize22:23,
    fontSize21:22,
    fontSize20:21,
    fontSize19:20,
    fontSize18:19,
    fontSize17:18,
    fontSize16:17,
    fontSize15:16,
    fontSize14:15,
    fontSize13:14,
    fontSize12:13, 
    fontSize11:12,
    fontSize10:11,
    fontSize9:10,
    fontSize8:9,
    fontSize7:8,
    fontSize6:7,
    fontSize5:6,
}

export { DEFAULT_TEXT }

const DEFAULT_COLOR = {
    subject_language : '#d50032',
    subject_teacher : '#00abc7',
    base_color : '#0059a9',
    base_background_color : '#f5faff',
    default_bg_color : '#f5f6f8',
    base_color_fff : '#fff',
    base_color_000 : '#000',
    base_color_222 : '#222',
    base_color_444 : '#444',
    base_color_666 : '#666',
    base_color_888:'#888',
    base_color_bbb:'#bbb',
    base_color_ccc:'#ccc',
    input_bg_color2 : '#e5e6e9',
    input_border_color2 : '#eaebee',
    input_bg_color : '#f5f7f8',    
    input_border_color : '#eeeff1',
    myclass_base: '#0e3a48',
}

export { DEFAULT_COLOR }
