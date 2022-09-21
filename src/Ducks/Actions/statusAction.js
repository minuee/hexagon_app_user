import types from '../types';
import { apiObject } from "../../Screens/Apis";
export function saveNonUserToken(token) {
    return {
        type: types.GLOBAL_STATUS_NONUSER_TOKEN,
        return_userNonToken : token,
    };
}

export function saveUserToken(token) {
    return {
        type: types.GLOBAL_STATUS_USER_TOKEN,
        return_userToken : token,
    };
}

export function fn_getUserCartCount(num) {
    return {
        type: types.GLOBAL_STATUS_USER_CART,
        return_userCartCount : num,
    };
}

export function fn_getUserPoint(num) {
    return {
        type: types.GLOBAL_STATUS_USER_POINT,
        return_userNowPoint : num,
    };
}
export function fn_getUserZzimCount(num) {
    return {
        type: types.GLOBAL_STATUS_USER_ZZIM,
        return_userZzimCount : num,
    };
}

export function fn_getMyZzimList(arr) {
    return {
        type: types.GLOBAL_STATUS_MY_ZZIM_LIST,
        return_myZzimArray : arr,
    };
}
export function fn_getUserOrderingCount(num) {
    return {
        type: types.GLOBAL_STATUS_USER_ORDERING,
        return_userOrderingCount : num,
    };
}

export function fn_UpdateDrawerOpen(bool) {
    return {
        type: types.GLOBAL_STATUS_DRAWER_OPEN,
        return_isDrawerOpen : bool,
    };
}

export function fn_ToggleCategory(bool) {
    return {
        type: types.GLOBAL_STATUS_TOGGLE_CATEGORY,
        return_togglecategory : bool,
    };
}

export function fn_ToggleProduct(bool) {
    return {
        type: types.GLOBAL_STATUS_TOGGLE_PRODUCT,
        return_toggleproduct : bool,
    };
}
export function fn_ToggleNoticeDetail(bool) {
    return {
        type: types.GLOBAL_STATUS_TOGGLE_NOTICE_DETAIL,
        return_toggleNoticeDetail : bool,
    };
}
export function fn_ToggleBannerDetail(bool) {
    return {
        type: types.GLOBAL_STATUS_TOGGLE_BANNER_DETAIL,
        return_toggleBannerDetail : bool,
    };
}
export function fn_ChoiceCategoryArray(arr) {
    return {
        type: types.GLOBAL_STATUS_CHOICE_CATEGORY_ARRAY,
        return_choiceCategoryArray : arr,
    };
}

export function fn_ChoiceProductArray(arr) {
    return {
        type: types.GLOBAL_STATUS_CHOICE_PRODUCT_ARRAY,
        return_choiceProductArray : arr,
    };
}
