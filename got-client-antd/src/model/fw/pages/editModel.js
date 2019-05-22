import * as EditService from '../../../service/editService.js';


export default {
    namespace: 'edit',
    state: {
        fwParam: {
          oldData:{},
          newData:{},
        }
    },
    reducers: {
        setEditData(state, {payload:{result}}) {
            const r = {...state, fwParam:{...state.fwParam, oldData:result, newData:result}};
            return r;
        },
    },
    effects: {
        *getRefData({payload:{fwCoord, fwParam, otherParams, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {return ({...otherParams, fwParam: {...state.edit.fwParam, ...fwParam}, fwCoord:{...state.fw.fwCoord, ...fwCoord}})});
                const { data:result, headers } = yield call(EditService.getRefData, args);
                if (callback) {
                    callback(result);
                }
            } catch (error) {
                // DO NOTHING
            }
        },

        *getEditData({payload:{fwCoord, fwParam, otherParams, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {
                    return ({
                        ...otherParams,
                        fwParam: {...state.edit.fwParam, ...fwParam, oldData:null,newData:null}, 
                        fwCoord:{...state.fw.fwCoord, ...fwCoord}
                    })
                });
                const { data:result, headers } = yield call(EditService.getEditData, args);
                if (callback) {
                    callback(result);
                } else {
                    yield put({ type: 'setEditData', payload: { result } });
                }
            } catch (error) {
                // DO NOTHING
            }
        },
        
        *saveEditData({payload:{fwCoord, fwParam, callback}}, {call, put, select}) {
            try {
                const args = yield select(state => {return ({fwParam: {...state.edit.fwParam, ...fwParam, selectedData:null}, fwCoord:{...state.fw.fwCoord, ...fwCoord}})});
                const { data:result, headers } = yield call(EditService.saveEditData, args);
                if (callback) {
                    callback(result);
                }
            } catch (error) {
                // DO NOTHING
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                console.info('Edit Model:' + location.pathname);
                if (location.pathname.indexOf('/fw/edit')>=0) {
                    console.info('called setup of sub');
                    /*
                    dispatch({
                        type: 'getEditData',
                        payload: {selectedId: location.query['fwParam.selectedId']?location.query['fwParam.selectedId']:null},
                    });
                    */
                }
               
            })
        },
    },
  };