import { TypeAction } from '../../typings/common';
import LOGIN_TYPES from '../../typings/login-types';
import * as TYPES from '../action-types';
export interface TypeProfile {
    loginState: LOGIN_TYPES,
    user: any,//如果当前用户已经登录了,需要把登录的用户信息放在这个地方
    error: any //如果请求登录状态失败了，就把失败的原因放在这个地方
}
let initialState: TypeProfile = {
    loginState: LOGIN_TYPES.UN_VALIDATE,
    user: null,
    error: null
}
export default function (state: TypeProfile = initialState, action: TypeAction): TypeProfile {
    switch (action.type) {
        case TYPES.VALIDATE:
            let { code, data, error } = action.payload;
            if (code === 0) {//说明当前正处于登录状态
                return { ...state, loginState: LOGIN_TYPES.LOGINED, user: data, error: null };
            } else {//当前用户未登录
                return { ...state, loginState: LOGIN_TYPES.UNLOGIN, user: null, error };
            }
        case TYPES.LOGOUT:
            return { ...state, loginState: LOGIN_TYPES.UNLOGIN, user: null, error: null };
        case TYPES.CHANGE_AVATAR:
            return { ...state, user: { ...state.user, avatar: action.payload } };
        default:
            return state;
    }
}