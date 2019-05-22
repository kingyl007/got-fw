import * as CreateService from '../../../service/createService.js';


export default {
  namespace: 'create',
  state: {
    fwParam: {
      oldData:{},
      newData:{},
    }
  },
  reducers: {
    setCreateData(state, {payload:{result}}) {
      const r = {...state, fwParam:{...state.fwParam, oldData:{}, newData:result}};
      return r;
    },
  },
  effects: {
    *getCreateData({payload:{fwCoord, fwParam, callback}}, {call, put, select}) {
      try {
        const args = yield select(state => {return ({fwCoord:{...state.fw.fwCoord, ...fwCoord}, fwParam})});
        const { data:result, headers } = yield call(CreateService.getCreateData, args);
        if (callback) {
            callback(result);
        } else {
            yield put({ type: 'setCreateData', payload: { result } });
        }
      } catch (error) {
        // DO NOTHING
      }
    },
    
    *saveCreateData({payload:{fwCoord, fwParam, callback}}, {call, put, select}) {
      try{
        // 2019.1.4 之前把selectedData清空了，没有必要清空
        const args = yield select(state => {return ({fwParam, fwCoord:{...state.fw.fwCoord, ...fwCoord}})});
        const { data:result, headers } = yield call(CreateService.saveCreateData, args);
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
        console.info('Create Model:' + location.pathname);
        if (location.pathname.indexOf('/fw/create')>=0) {
          /*
          console.info('called setup of sub');
          dispatch({
            type: 'getCreateData',
            payload: {},
          });
          */
        }
        
      })
    },
  },
  };