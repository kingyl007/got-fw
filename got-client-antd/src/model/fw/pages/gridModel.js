import * as GridService from '../../../service/gridService.js';
import {message} from 'antd';

export default {
    namespace: 'grid',
    state: {
        data: [], 
        fwPage: {
            totalRow: 0, 
            pageSize: 10, 
            pageNumber:1,
        }
    },
    reducers: {
        setGridData(state, {payload:{result}}) {
            return {...state, fwPage:result.page, data:result.data};
        },
        setFwPage(state, {payload:{fwPage}}) {
            return {...state, fwPage};
        },
    },
    effects: {
        *getSelectData({payload:{fwPage, fwParam, fwCoord, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {
                    return ({
                        fwCoord:{...state.fw.fwCoord, ...fwCoord},
                        fwPage: {...state.grid.fwPage, ...fwPage}, 
                        fwParam:{...fwParam}, 
                    })
                });
                const { data:result, headers } = yield call(GridService.getSelectData, args);
                if (result.data) {
                    result.data.map((row, index)=>{row.fw_index = index; row.selected = row.FW_SELECTED});
                }
                if (callback) {
                    callback(result);
                } else {
                    yield put({ type: 'setGridData', payload: { result } });
                }
            } catch (error) {
                // DO NOTHING
            }
        },

        *saveSelectData({payload:{fwCoord, fwParam, callback}}, {call, put, select}) {
            console.info('saveSelectData', 'gridmodel');
            try {
                const args = yield select(state => {return ({fwParam, fwCoord:{...state.fw.fwCoord, ...fwCoord}})});
                const { data:result, headers } = yield call(GridService.saveSelectData, args);
                if (callback) {
                    callback(result);
                }
            } catch (error) {
                // DO NOTHING
            }
        },

        *validDeleteData({payload:{fwCoord, fwParam, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {return ({fwParam, fwCoord:{...state.fw.fwCoord, ...fwCoord}})});
                const { data:result, headers } = yield call(GridService.validDeleteData, args);
                if (callback) {
                    callback(result);
                }
            } catch (error) {
                // DO NOTHING
            }
        },

        *deleteData({payload:{fwCoord, fwParam, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {return ({fwParam, fwCoord:{...state.fw.fwCoord, ...fwCoord}})});
                const { data:result, headers } = yield call(GridService.deleteData, args);
                if (callback) {
                    callback(result);
                }
            } catch (error) {
                // DO NOTHING
            }
        },

        *getGridData({payload:{fwPage, fwParam, fwCoord, otherParams, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {
                    return ({
                        ...otherParams,
                        fwCoord:{...state.fw.fwCoord, ...fwCoord},
                        fwPage: {...state.grid.fwPage, ...fwPage}, 
                        fwParam,
                    })
                });
                const { data:result, headers } = yield call(GridService.getGridData, args);
                if (result.data) {
                    result.data.map((row, index)=>row.fw_index = index);
                }
                if (callback) {
                    callback(result);
                } else {
                    yield put({ type: 'setGridData', payload: { result } });
                }
            } catch (error) {
                // DO NOTHING
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                console.info('Grid Model:' + location.pathname);
                if (location.pathname.indexOf('/fw/grid')>=0) {
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