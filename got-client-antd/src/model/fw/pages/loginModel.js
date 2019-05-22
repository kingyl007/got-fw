import * as LoginService from '../../../service/loginService.js';
import {message} from 'antd';

export default {
    namespace: 'login',
    state: {
    },
    reducers: {
    },
    effects: {

        *login({payload:{loginData, fwParam, fwCoord, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {
                    return ({...loginData, 
                        fwCoord:{...state.fw.fwCoord, ...fwCoord}})});
                const { data:result, headers } = yield call(LoginService.login, args);
                if (callback) {
                    callback(result);
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                console.info('Login Model:' + location.pathname);
                if (location.pathname.indexOf('/fw/login')>=0) {
                    /*
                    dispatch({
                        type: 'getGridData',
                        payload: {},
                    });
                    */
                }
            })
        },
    },
  };