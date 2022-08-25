import types from '../types';

const defaultState = {
    nonUserToken: {},
    userToken: {},
    isDrawerOpen : false,    
    togglecategory : false,
    toggleproduct : false,
    toggleNoticeDetail : false ,
    toggleBannerDetail : false ,
    choiceCategoryArray : [],
    choiceProductArray : [],
    userCartCount : 0,
    userZzimCount : 0,
    userOrderingCount : 0,
    userNowPoint : 0
}

export default StatusReducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.GLOBAL_STATUS_NONUSER_TOKEN:
            return {     
            ...state,
            nonUserToken : action.return_userNonToken
        }; 
        case types.GLOBAL_STATUS_USER_TOKEN:
            return {     
            ...state,
            userToken : action.return_userToken
        }; 
        case types.GLOBAL_STATUS_USER_CART:
            return {     
            ...state,
            userCartCount : action.return_userCartCount
        }; 
        case types.GLOBAL_STATUS_USER_ZZIM:
            return {     
            ...state,
            userZzimCount : action.return_userZzimCount
        }; 
        case types.GLOBAL_STATUS_USER_ORDERING:
            return {     
            ...state,
            userOrderingCount : action.return_userOrderingCount
        }; 
        case types.GLOBAL_STATUS_USER_POINT:
            return {     
            ...state,
            userNowPoint : action.return_userNowPoint
        }; 
        case types.GLOBAL_STATUS_DRAWER_OPEN:
            return {     
            ...state,
            isDrawerOpen : action.return_isDrawerOpen
        };  
        case types.GLOBAL_STATUS_TOGGLE_CATEGORY:
            return {     
            ...state,
            togglecategory : action.return_togglecategory
        };  
        case types.GLOBAL_STATUS_TOGGLE_PRODUCT:
            return {     
            ...state,
            toggleproduct : action.return_toggleproduct
        }; 
        case types.GLOBAL_STATUS_TOGGLE_NOTICE_DETAIL:
            return {     
            ...state,
            toggleNoticeDetail : action.return_toggleNoticeDetail
        }; 
        case types.GLOBAL_STATUS_TOGGLE_BANNER_DETAIL:
            return {     
            ...state,
            toggleBannerDetail : action.return_toggleBannerDetail
        }; 
        case types.GLOBAL_STATUS_CHOICE_CATEGORY_ARRAY:
            return {     
            ...state,
            choiceCategoryArray : action.return_choiceCategoryArray
        }; 
        case types.GLOBAL_STATUS_CHOICE_PRODUCT_ARRAY:
            return {     
            ...state,
            choiceProductArray : action.return_choiceProductArray
        };         
        default:
            return state;
    }
};
