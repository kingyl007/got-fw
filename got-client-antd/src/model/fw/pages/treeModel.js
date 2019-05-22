import * as TreeService from '../../../service/treeService.js';
import {message} from 'antd';

export default {
    namespace: 'tree',
    state: {
        treeData: []
    },
    reducers: {
        setTreeData(state, {payload:{result}}) {
            return {...state, treeData:result.data};
        },
    },
    effects: {
        *getTreeData({payload:{fwParam, fwCoord, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {
                    return ({
                        fwCoord:{...state.fw.fwCoord, ...fwCoord},
                        fwParam:{...fwParam}, 
                    })
                });
                const { data:result, headers } = yield call(TreeService.getTreeData, args);
                if (result.data) {
                    result.data.map((row, index)=>row.fw_index = index);
                }
                if (callback) {
                    callback(result);
                } else {
                    yield put({ type: 'setTreeData', payload: { result } });
                }
            } catch (error) {
                // DO NOTHING
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                console.info('Tree Model:' + location.pathname);
                if (location.pathname.indexOf('/fw/tree')>=0) {
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