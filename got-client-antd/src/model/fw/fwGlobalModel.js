import * as FwService from '../../service/fwService.js';
import {message} from 'antd';
import * as Render from '../../logic/render.js';
import * as Logic from '../../logic/logic.js';
import styles from '../fw.css';

export default {
  namespace: 'fw',
  state: {
    fwCoord: {
      'project':null,
      'function':null,
      'view':null,
      'ui':null,
      'lang':null
    },
    layout: {
      loading:true,
      title:'',
      columns: [],
      actions: [],
      displayActions:[],
      otherActions:{},
      actionArgs:{},
      pks: [],
    },

  },
  

  reducers: {
    setCoord(state, {payload:{fwCoord}}) {
      return {...state, fwCoord};
    },
    setLayout(state, {payload:{layout}}) {
      // return {...state, columns:layout.columns, actions:layout.actions, pks, displayActions, otherActions, actionArgs};
      return {...state, layout};
    },
  },
  effects: {
    *changePassword({payload:{fwCoord, fwParam, otherParams, callback}}, {call, put, select}) {
        try {
            const args = yield select(state => {return ({fwParam: {...state.edit.fwParam, ...fwParam, selectedData:null}, fwCoord:{...state.fw.fwCoord, ...fwCoord}, ...otherParams})});
            const { data:result, headers } = yield call(FwService.changePassword, args);
            if (callback) {
                callback(result);
            }
        } catch (error) {
            // DO NOTHING
        }
    },
    *loadLayout({ payload: {fwCoord, fwParam, callback} }, { call, put , select}) {
      try {
        const args = yield select(state => ({fwCoord:{...state.fw.fwCoord, ...fwCoord}, fwParam}));
        const { data:layout } = yield call(FwService.loadLayout, args);
        if (layout.success != undefined) {
          return;
        }
        const dictMap = {};
        if (layout.dictList) {
          Object.keys(layout.dictList).map(key=> {
            dictMap[key] = {};
            layout.dictList[key].map(item=> {
              dictMap[key][item.value] = item.label;
            })
          })
        }
        const groups = {};
        if (layout.groups) {
            layout.groups.map(g=> {g.arrayIndex = -1; g.key = g.id; groups[g.id] = g;});
        }
        const displayActions = [];
        const otherActions = {};
        const actionArgs = {};
        if (layout.actions) {
          layout.actions.map(act=> {
            act.key = act.id;
            if (groups[act.group]) {
              if (groups[act.group].arrayIndex == -1) {
                displayActions.push(groups[act.group]);
                groups[act.group].label = groups[act.group].title;
                groups[act.group].arrayIndex = displayActions.length - 1;
                groups[act.group].tag = 'group';
              }
              groups[act.group].children.push(act);
            } else {
              if (act.group) {
                if (!otherActions[act.group]) {
                  otherActions[act.group] = [];
                }
                otherActions[act.group] = [...otherActions[act.group], act];
              } else {
                displayActions.push(act);
              }
            }
            actionArgs[act.id] = act;
          });
        } else {
          layout.actions = [];
        }
        const columnMap = {};
        if (layout.columns) {
          layout.columns.map(col=>columnMap[col.id] = col);
        } else {
          layout.columns = [];
        }
        const newLayout =  {...layout, displayActions, otherActions, actionArgs, columnMap, dictMap};
        if (callback) {
          callback(newLayout);
        } else {
          yield put({ type: 'setLayout', payload: { layout:newLayout } });
        }
      } catch (error) {
        // DO NOTHING
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        console.info('Global Model:' + location.pathname);
        // if (location.pathname.indexOf('/fw')>=0) 
        dispatch({
          type: 'setCoord', 
          payload:
          {
            fwCoord:{
              'function': location.query['fwCoord.function']?location.query['fwCoord.function']:null,
              'project': location.query['fwCoord.project']?location.query['fwCoord.project']:null,
              'view': location.query['fwCoord.view']?location.query['fwCoord.view']:null,
              'ui': location.query['fwCoord.ui']?location.query['fwCoord.ui']:'antd',
              'lang': location.query['fwCoord.lang']?location.query['fwCoord.lang']:null,
            }
          }
        });
        if (location.pathname.indexOf('/fw')>=0 /*|| location.query['fwCoord.function']*/)
        {
          dispatch({
            type: 'setCoord', 
            payload:
            {
              fwCoord:{
                'function': location.query['fwCoord.function']?location.query['fwCoord.function']:null,
                'project': location.query['fwCoord.project']?location.query['fwCoord.project']:null,
                'view': location.query['fwCoord.view']?location.query['fwCoord.view']:null,
                'ui': location.query['fwCoord.ui']?location.query['fwCoord.ui']:'antd',
                'lang': location.query['fwCoord.lang']?location.query['fwCoord.lang']:null,
              }
            }
          });
          dispatch({
              type: 'loadLayout',
              payload: {},
          });
        }
      })
    },
  },
};
  //*/