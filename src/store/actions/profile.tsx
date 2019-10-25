
import * as TYPES from '../action-types';
import { Dispatch, Store } from 'redux';
import { validate, register, login, logout } from '../../api/profile';
import { TypeAnyObject, TypeThunkFunction } from '../../typings/common';
import { push } from 'connected-react-router';
import { message } from 'antd';
export default {
    //这是一个方法，可以传递给组件，让组件调用，用来向服务器发请求
    validate() {
        //redux-promise中间件会拦截掉这个action,判断如果payload是一个promise.那么会等待promise完成，把payload的值变成promise resolve出来的值，重新派发给仓库
        return {
            type: TYPES.VALIDATE,
            payload: validate()
        }
    },
    //注册用户
    register(values: TypeAnyObject): TypeThunkFunction {//redux-thunk
        return async function (dispatch: Dispatch) {
            let result: TypeAnyObject = await register(values);
            if (result.code == 0) {
                dispatch(push('/login'));
            } else {
                message.error(result.error);
            }
        }
    },
    //注册用户
    login(values: TypeAnyObject): TypeThunkFunction {//redux-thunk
        return async function (dispatch: Dispatch) {
            let result: TypeAnyObject = await login(values);
            if (result.code == 0) {
                //如果登录成功了，则可以跳转到个人中心页
                dispatch(push('/profile'));
            } else {
                message.error(result.error);
            }
        }
    },
    logout() {
        return {
            type: TYPES.LOGOUT,
            payload: logout()
        }
    },
    changeAvatar(avatar: string) {
        return {
            type: TYPES.CHANGE_AVATAR,
            payload: avatar
        }
    }
}