import {Input, Menu, Dropdown, Icon, Button,DatePicker, Select, Col, Popconfirm } from 'antd';

import * as got from '../../logic/got';

const { RangePicker } = DatePicker;
const Option = Select.Option;


export function getActionEntry(view, logicId) {
  if (!view.actionEntry) {
    view.actionEntry = {
      '_default':{
        id:'_default',
        layout: function(view, actionId, record, recordIndex) {
          this.view = view;
          this.action = view.getLayout().actionArgs[actionId];
          return (
            <Popconfirm  key={this.action.fw_index} title={this.action.label + ' ' + this.action.id + ' 待实现'}
            onConfirm={(event) => this.logic(view, actionId, record, recordIndex, event)}>
            <a href="javascript:;"><Icon type={this.action.icon} />{this.action.label} </a>
            </Popconfirm>
          )
        },
        logic: function(view, actionId, record, recordIndex, event) {
          alert(actionId);
        },
  
        isValid: function(view, actionId, record) {
          return true;
        },
      }
    };
  }

  if (view.actionEntry[logicId]) {
    //DO NOTHING
  } else {
    try {
      const clientLogicInfo = view.getLayout().clientLogicMap[logicId];
      if (!clientLogicInfo) {
        console.warn("Can't find clientLogic ", logicId);
      }
      const file = require(`../../logic/${clientLogicInfo.file}`);
      if (file) {
        const entry = {id:logicId,
          onRef: function(ref) {
              this.dialog = ref;
          },
          isValid: function(view, actionId, record) {
            this.view = view;
            this.action = view.getLayout().actionArgs[actionId];
            // this.record = record;
            if (this.action.argument) {
              // <!-- showByColumn:根据某一列的值显示，showValue:对应要显示按钮的值，showByEmpty:值为空时是否显示， 
              // setValue:操作后要设置的值， showInColumn:将按钮直接显示在对应的列里 ，showConfirm:是否显示确认修改对话框，默认显示-->
              const {showByColumn, showValue, showByEmpty, setValue, showInColumn} = this.action.argument;
              if (showByColumn) {
                const columnValue = record[showByColumn];
                if (String(showValue).split(',').some(val=> val == columnValue)) {
                  return true;
                } else if ((columnValue == null || columnValue == undefined || columnValue === '') && showByEmpty) {
                  return true;
                }
                return false;
              }
              return true;
            }
            return true;
          },
        };
        view.actionEntry[logicId] = entry;
        if (file.logic) {
          entry.logic = file.logic;//(view, actionId, record, recordIndex, event) => file.logic(view, actionId, record, recordIndex, event);
        }
        if (file.layout) {
          entry.layout = file.layout;//(view, actionId, record, recordIndex)=> file.layout(view, actionId, record, recordIndex);
        } else {
          entry.layout = view.actionEntry['_default'].logic;//(view, actionId, record, recordIndex)=> view.actionEntry['_default'].logic(view, actionId, record, recordIndex);
        }
        if (file.handleOk) {
          entry.handleOk = file.handleOk;// (e) => file.handleOk(e);
        }
        if (file.handleCancel) {
          entry.handleCancel = file.handleCancel;//(e) => file.handleCancel(e);
        }
        if (file.isValid) {
          entry.isValid = file.isValid;
        }
      } else {
        console.warn('logic file is null', logicId);
        view.actionEntry[logicId] =  view.actionEntry['_default'];
      }
    } catch (error) {
      console.warn('Load client logic file error', logicId,  error);
      view.actionEntry[logicId] =  view.actionEntry['_default'];
    }
  }
  return {...view.actionEntry[logicId]};
}


export function buildGridQueryArea(view) {
  if (!view.getLayout()) {
    console.info('can not find layout', view);
    return null;
  }
    const queryPanels = [];
    const compMap = {};
      // 如果检索条件超过3个则显示
    if (view.getLayout().argument && view.getLayout().argument.queryColumns) {
      // TODO split queryFields,check type and add query input 
      const queryColumns = new String(view.getLayout().argument.queryColumns).split(';').filter(f=>f&&f!='');
      if (queryColumns) {
        queryColumns.map(colName=> {
          const connectedColumns = colName.split(',').filter(f=>f&&f!='');
          let label = '';
          let component = null;
          let minWidth = 100;
          if (connectedColumns.length > 1) {
            component = <Input key={colName} placeholder='请输入' value={view.state.queryColumnValues[colName]} style={{width:100}} onChange={(e)=>view.handleQueryInputChange(colName, e)}></Input>
            label = connectedColumns.filter(f=>view.getLayout().columnMap[f]&&view.getLayout().columnMap[f].toUser && !got.isEmpty(view.getLayout().columnMap[f].label)).map(f=>view.getLayout().columnMap[f].label).join('/');
          } else {
            const col = view.getLayout().columnMap[connectedColumns[0]];
            if (col && col.toUser) {
              label = col.label;
              if (col.type == 'DATE' || col.type == 'DATETIME') {
                minWidth += 100;
                component = <RangePicker style={{width:200}} onChange={(dates, dateStr)=>view.handleQueryDateRangeChange(colName, dates, dateStr)} />
              } else if (col.dictionary && view.getLayout().dictMap[col.dictionary]) {
                const dic = view.getLayout().dictMap[col.dictionary];
                const showDic = {};
                Object.keys(dic).map(key=>showDic[dic[key]]?showDic[dic[key]].push(key):showDic[dic[key]] = [key]);
                component = <Select allowClear={true} placeholder='请选择' defaultValue={col.multiSelect?['']:''} mode={col.multiSelect?'multiple':null} style={{width:120}} onChange={(value, option)=>view.handleQuerySelectChange(colName, value)}>
                  <Option key='_FW_ALL' value=''>全部</Option>
                  {Object.keys(showDic).map(key=> <Option key={key} value={showDic[key].join(',')}>{key}</Option>)}
                </Select>
              } else {
                component = <Input key={colName} placeholder='请输入' value={view.state.queryColumnValues[colName]} style={{width:150}} onChange={(e)=>view.handleQueryInputChange(colName, e)}></Input>
              }
            }
          }
          minWidth += label.length * 10;
          if (component) {
            compMap[label] = component;
            // queryPanels.push(<Col key={colName} span={parseInt(22 / queryColumns.length)} style={{minWidth:minWidth}}>{label} : {component}</Col>)
            queryPanels.push(<span>{label} : {component}</span>)
            queryPanels.push(<span>&nbsp;&nbsp;</span>)
          }
        });
        // const totalLabel = Object.keys(compMap).join('');
        // Object.keys(compMap).map(key=> queryPanels.push(<Col key={key} span={parseInt(22 * key.length / totalLabel.length)} style={{minWidth:100+key.length*10}}>{key} : {compMap[key]}</Col>));
        if (queryPanels.length > 0) {
          // queryPanels.push(<Col key='_fw_buttonspan' span={1}></Col>)
          // queryPanels.push(<Col key='_fw_querybutton' span={1}><Button type='primary' onClick={(e)=>view.refresh()}>搜索</Button></Col>)
          queryPanels.push(<span><Button type='primary' onClick={(e)=>view.refresh()}>搜索</Button></span>)
        }
      }
      // queryPanels.push(<Col key='expanded' span={24} style={{ textAlign: 'right' }}>
      // {queryFields.length>3?<a style={{ marginLeft: 8, fontSize: 12 }} onClick={(e)=>view.setState({queryPanelExpanded:!view.state.queryPanelExpanded})}>
      // {view.state.queryPanelExpanded? '关闭':'展开'} <Icon type={view.state.queryPanelExpanded?'up':'down'} />
      // </a>:null}
      // </Col>);
    }
    return queryPanels;
}


export function buildGroupMenus(view, styles, group) {
  if (!view.getLayout()) {
    console.info('can not find layout', view);
    return null;
  }
  const actions = view.getLayout().otherActions[group];
  if (!actions) {
    return null;
  }
  return actions.map(act=> {
    const queryInput = [];
    if (act.id === 'searchGrp' || act.id === 'gridSearchGrp' || act.id === 'searchList') {
      queryInput.push(
        <Input key={act.id} style={{width:'150px'}}
          size={view.state.buttonSize}
          className={styles.queryValue} 
          defaultValue={view.state.fwParam.queryValue} 
          onPressEnter={(e)=>view.handleAction(e, 'searchList')}
          onChange={(e)=>view.setState({fwParam:{...view.state.fwParam, queryValue:e.target.value}})}
        />
      );
    }
    if (act.tag == 'group') {
      const subActions = act.children.filter(sa=>sa.visible);
      if (subActions.length > 1) {
        const subActionWrapper = (
          <Menu onClick={(e)=>view.handleAction(e)}>
            {subActions.filter((_,index)=>(!act.showDefault||index>0)).map(sa=><Menu.Item key={sa.id}><Icon type={sa.icon} />{sa.label}</Menu.Item>)}
          </Menu>);

        if (act.showDefault) {
          return (
            <span key={act.id} style={{ marginLeft: 10 }}>
              {queryInput}
              <Dropdown.Button key={act.id} size={view.state.buttonSize} onClick={(e)=>view.handleAction(e, act.children[0].id)} overlay={subActionWrapper}>
                <Icon type={act.children[0].icon} />{act.children[0].label}
              </Dropdown.Button>
            </span>
          );
        } else {
          return (
            <span  key={act.id} style={{ marginLeft: 10 }}>
              {queryInput}
              <Dropdown overlay={subActionWrapper}>
                <Button size={view.state.buttonSize}>
                  <Icon type={act.icon} />{act.label} <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          )
        }
      } else if (subActions.length == 1) {
        return  (
          <span key={subActions[0].id} style={{ marginLeft: 10 }}>
            {queryInput}
            <Button key={subActions[0].id} size={view.state.buttonSize} onClick={(e)=>view.handleAction(e,subActions[0].id)}>
            <Icon type={subActions[0].icon} />{subActions[0].label}
            </Button>
          </span>
        );
      }
    } else {
        if (act.visible) {
          return  (
            <span key={act.id} style={{ marginLeft: 10 }}>
              {queryInput}
              <Button key={act.id} size={view.state.buttonSize} onClick={(e)=>view.handleAction(e, act.id)}>
                <Icon type={act.icon} />{act.label}
              </Button>
            </span>
          );
        }
    }
  });
}

export function buildGridMenus(view, styles, haveQueryColumns) {
  if (!view.getLayout()) {
    console.info('can not find layout', view);
    return null;
  }
  return view.getLayout().displayActions.map(act=> {
    const queryInput = [];
    if (act.id === 'searchGrp' || act.id === 'gridSearchGrp' || act.id === 'searchList') {
      if (haveQueryColumns) {
        return null;
      }
      queryInput.push(
        <Input key={act.id} style={{width:'150px'}}
          size={view.state.buttonSize}
          className={styles.queryValue} 
          defaultValue={view.state.fwParam.queryValue} 
          onPressEnter={(e)=>view.handleAction(e, 'searchList')}
          onChange={(e)=>view.setState({fwParam:{...view.state.fwParam, queryValue:e.target.value}})}
        />
      );
    }
    if (act.tag == 'group') {
      const subActions = act.children.filter(sa=>sa.visible);
      if (subActions.length > 1) {
        const subActionWrapper = (
          <Menu onClick={(e)=>view.handleAction(e)}>
            {subActions.filter((_,index)=>(!act.showDefault||index>0)).map(sa=><Menu.Item key={sa.id}><Icon type={sa.icon} />{sa.label}</Menu.Item>)}
          </Menu>);

        if (act.showDefault) {
          return (
            <span key={act.id} style={{ marginLeft: 10 }}>
              {queryInput}
              <Dropdown.Button key={act.id} size={view.state.buttonSize} onClick={(e)=>view.handleAction(e, act.children[0].id)} overlay={subActionWrapper}>
                <Icon type={act.children[0].icon} />{act.children[0].label}
              </Dropdown.Button>
            </span>
          );
        } else {
          return (
            <span  key={act.id} style={{ marginLeft: 10 }}>
              {queryInput}
              <Dropdown overlay={subActionWrapper}>
                <Button size={view.state.buttonSize}>
                  <Icon type={act.icon} />{act.label} <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          )
        }
      } else if (subActions.length == 1) {
        let result = null;
        if (haveQueryColumns) {
          result = 
          <span key={subActions[0].id} style={{ marginLeft: 10 }}>
            {queryInput}
            <a key={subActions[0].id} size={view.state.buttonSize} onClick={(e)=>view.handleAction(e,subActions[0].id)}>
            <Icon type={subActions[0].icon} />{subActions[0].label}
            </a>
          </span>
        } else {
          result = 
          <span key={subActions[0].id} style={{ marginLeft: 10 }}>
            {queryInput}
            <Button key={subActions[0].id} size={view.state.buttonSize} onClick={(e)=>view.handleAction(e,subActions[0].id)}>
            <Icon type={subActions[0].icon} />{subActions[0].label}
            </Button>
          </span>;
        }
        return result;
      }
    } else {
        if (act.visible) {
          if (act.ui) {
            const actionEntry = getActionEntry(view, act.click);
            return actionEntry.layout(view, act.id, null, -1);
          } else {
            let result = null;
            if (haveQueryColumns) {
              result = 
              <span key={act.id} style={{ marginLeft: 10 }}>
                {queryInput}
                <a key={act.id} size={view.state.buttonSize} onClick={(e)=>view.handleAction(e, act.id)}>
                  <Icon type={act.icon} />{act.label}
                </a>
              </span>
            } else {
              result = 
              <span key={act.id} style={{ marginLeft: 10 }}>
                {queryInput}
                <Button key={act.id} size={view.state.buttonSize} onClick={(e)=>view.handleAction(e, act.id)}>
                  <Icon type={act.icon} />{act.label}
                </Button>
              </span>
            }
            return result;
          }
        }
    }
  });
}

export function buildDetailMenus(view) {
  
  if (!view.getLayout()) {
    console.info('can not find layout', view);
    return null;
  }
  const menus =view.getLayout().actions.filter(act=>true).map((act,index)=> {
    const queryInput = [];
    if (act.id === 'searchGrp' || act.id === 'gridSearchGrp' || act.id === 'searchList') {
      queryInput.push(
        <Input key={act.id} className={styles.queryValue} defaultValue={view.state.fwParam.queryValue} onChange={(e)=>view.setState({fwParam:{...view.state.fwParam, queryValue:e.target.value}})} /> );
    }
    if (act.tag == 'group') {
      const subActions = act.children.filter(sa=>sa.visible);
      if (subActions.length > 1) {
        const subActionWrapper = (<Menu onClick={(e)=>view.handleAction(e)}>
            {subActions.filter((_,index)=>(!act.showDefault||index>0)).map(sa=><Menu.Item key={sa.id}><Icon type={sa.icon} />{sa.label}</Menu.Item>)}
        </Menu>);

        if (act.showDefault) {
          return (
            <span key={act.id}>
              {queryInput}
              <Dropdown.Button key={act.id} onClick={(e)=>view.handleAction(e, act.children[0].id)} overlay={subActionWrapper}>
                {act.children[0].icon?<Icon type={act.children[0].icon} />:null}{act.children[0].label}
              </Dropdown.Button>
            </span>
          );
        } else {
          return (
            <span  key={act.id}>
              {queryInput}
              <Dropdown overlay={subActionWrapper}>
                <Button style={{ marginLeft: 8 }}>
                  {act.icon?<Icon type={act.icon} />:null}{act.label} <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          )
        }
      } else if (subActions.length == 1) {
          return (<span key={subActions[0].id}>
              {queryInput}
              <Button type={index==0?"primary":"default"} key={subActions[0].id} style={{ marginLeft: 8 }} onClick={(e)=>view.handleAction(e,subActions[0].id)}>
                {subActions[0].icon?<Icon type={subActions[0].icon} />:null}{subActions[0].label}
              </Button>
            </span>
          );
      }
    } else {
        if (act.visible) {
          return (<span key={act.id}>
              {queryInput}
              <Button type={index==0?"primary":"default"} key={act.id} style={{ marginLeft: 8, marginRight:20 }} onClick={(e)=>view.handleAction(e, act.id)}>
                {act.icon?<Icon type={act.icon} />:null}{act.label}
              </Button>
            </span>
          );
        }
    }
  });
  return menus.reverse();
}