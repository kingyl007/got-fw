import { connect} from 'dva';
import { Component, Children } from 'react';
import { Table, Pagination, Divider,Popconfirm,Modal, message, Button,Row, Col,Icon,Menu,Dropdown, Input,Checkbox } from 'antd';
import router from 'umi/router';

import styles from '../grid/grid.css';
import * as ButtonArea from '../../../component/fw/buttonArea';
const CheckboxGroup = Checkbox.Group;
const HAVE = '1';
const NOT_HAVE = '0';

function mapStateToProps(state) {
  const {dispatch, fwCoord, layout} = state.fw;
  const {data, fwPage} = state.grid;
  return {
    loading: state.loading.models.grid || state.loading.models.fw,
    dispatch,
    fwCoord,
    layout,
    fwPage,
    data,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSelectData: ({fwPage, fwParam, fwCoord, callback}) => {
      dispatch({
          type: 'grid/getSelectData',
          payload: {fwPage, fwParam, fwCoord, callback},
      });
    },
    saveSelectData: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'grid/saveSelectData',
          payload: {fwCoord, fwParam, callback},
      });
    },
    deleteData: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'grid/deleteData',
          payload: {fwCoord, fwParam, callback},
      });
    },
    getGridData: ({fwPage, fwParam, fwCoord, callback}) => {
      dispatch({
          type: 'grid/getGridData',
          payload: {fwPage, fwParam, fwCoord, callback},
      });
    },
    loadLayout: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'fw/loadLayout',
          payload: {fwCoord, fwParam, callback},
      });
    },
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class RightList extends Component {
//======================= Page connected start ====================================
  getSelectData = ({fwPage, fwParam, fwCoord}) => {
    const param = {...this.state.fwParam, ...fwParam};
    this.props.getSelectData({fwPage:{...this.state.fwPage, ...fwPage}, fwParam:param, fwCoord:{...this.getFwCoord(),...fwCoord}, callback: (result)=> {
        this.setState({fwPage:result.page, data:result.data});
    }});
  }

  getGridData = ({fwPage, fwParam, fwCoord}) => {
      const param = {...this.state.fwParam, ...fwParam};
      this.props.getGridData({fwPage:{...this.state.fwPage, ...fwPage}, fwParam:param, fwCoord:{...this.getFwCoord(),...fwCoord}, callback: (result)=> {
          this.setState({fwPage:result.page, data:result.data});
      }});
  }

  pageChangeHandler =  function(pageNumber, pageSize) {
      this.getGridData({fwPage:{pageNumber, pageSize}});
  };

  OP_COL = {
      title: 'Operation',
      dataIndex: '_FW_ACTIONS',
      render: (text, record, index) => (
          <span className={styles.operation}>
              {
                  (this.getLayout().otherActions['inList']?this.getLayout().otherActions['inList']:[]).filter(act=>act.visible==true).map((act, actIndex)=>{
                    act.fw_index = actIndex;
                    return this.getActionEntry(act.click).layout(this, act.id, record, index);
                  })
              }
          </span>
      ),
  }

  COLS = [{
    title: '功能权限',
    dataIndex: 'RES_NAME',
  }]

  isResourceChecked(record) {
    if ( record.HAVE_PRIVILEGE != undefined) {
      return record.HAVE_PRIVILEGE;
    }
    return null;
  }

  getDataLevel= (fun)=>{
    if (fun.DATA_LEVEL_MAP != undefined) {
      return fun.DATA_LEVEL_MAP;
    }
    return [];
  }

  setPrivilege = (record, newValue)=> {
    const {HAVE_PRIVILEGE, DATA_LEVEL} = newValue;
    if (HAVE_PRIVILEGE != undefined) {
      record.HAVE_PRIVILEGE = HAVE_PRIVILEGE;
    }
    if (DATA_LEVEL != undefined) {
      record.DATA_LEVEL_MAP = DATA_LEVEL;
    }
    this.state.changedResource[record.PKEY] = record;
  }

  onRowCheckedChange = function(parent, record, selected, selectedRows, nativeEvent, level) {
    const havePrivilege = selected?HAVE:NOT_HAVE;
    this.setPrivilege(record, {HAVE_PRIVILEGE:havePrivilege});
    if (record.nodes) {
      record.nodes.map(node=>this.onRowCheckedChange(record, node, selected, null, nativeEvent, level+1));
    }
    if (this.state.expandedFunctions[record.PKEY]) {
      record.columnList?record.columnList.map(col=>this.setPrivilege(col, {HAVE_PRIVILEGE:havePrivilege})):null;
      record.actionList?record.actionList.map(act=>this.setPrivilege(act, {HAVE_PRIVILEGE:havePrivilege})):null;
      let dataLevelMap = this.getDataLevel(record);
      if (!dataLevelMap) {
        const dataLevelOptions = this.buildDataLevelOptions(record);
        dataLevelMap = {};
        dataLevelOptions.map(dlo=> dataLevelMap[dlo.value] = havePrivilege);
        this.setPrivilege(record, {DATA_LEVEL:dataLevelMap});
      } else {
        Object.keys(dataLevelMap).map(dlmk=>dataLevelMap[dlmk] = havePrivilege);
      }
    }
    this.setState({layout:this.state.layout});
  }

  onExpandFunction = function(expanded, record, newLayout) {
    if (!expanded) {
      return;
    }
    if (this.state.expandedFunctions[record.PKEY] && !newLayout) {
      // 已经加载过，直接显示
    } else {
      // 加载Function相关的columns 和 actions
      const fwParam = {selectedData:{...record}};
      const realLayout = newLayout?newLayout:this.getLayout();
      fwParam.selectedData[realLayout.ROLE_ID_KEY] = realLayout[realLayout.ROLE_ID_KEY];
      this.props.loadLayout({fwCoord:this.getFwCoord(), fwParam, callback:(layout)=>{
        if (layout.actionList) {
          layout.actionList.map(a=>{
            if (this.isResourceChecked(a) == null && this.isResourceChecked(record) == HAVE) {
              this.setPrivilege(a, {HAVE_PRIVILEGE:HAVE});
            } 
          });
        }
        if (layout.columnList) {
          layout.columnList.map(c=>{
            if (this.isResourceChecked(c) == null && this.isResourceChecked(record) == HAVE) {
              this.setPrivilege(c, {HAVE_PRIVILEGE:HAVE});
            } 
          });
        }
        record.actionList = layout.actionList;
        record.columnList = layout.columnList;
        this.state.expandedFunctions[record.PKEY] = record;
        this.setState({layout:this.getLayout(), expandedFunctions:this.state.expandedFunctions});
      }});
    }
  }

  onCheckGroupChange = (list, checkedValue) => {
    console.info('onCheckGroupChange', list, checkedValue);
    list.map(item=>this.setPrivilege(item, {HAVE_PRIVILEGE:checkedValue.indexOf(item.PKEY)>=0?HAVE:NOT_HAVE}));
    this.setState({layout:this.state.layout});
  }

  onCheckAllChange = (fun, list, e)=>{
    const checked = e.target.checked;
    list.map(item=>this.setPrivilege(item, {HAVE_PRIVILEGE:checked?HAVE:NOT_HAVE}));
    this.setState({layout:this.state.layout});
  }

  onDataLevelCheckGroupChange = (fun, checkedValue) => {
    let dataLevelMap = this.getDataLevel(fun);
    if (!dataLevelMap) {
      dataLevelMap = {};
      this.setPrivilege(fun, {DATA_LEVEL:dataLevelMap});
    }
    checkedValue.map(cv=> dataLevelMap[cv] = HAVE);
    Object.keys(dataLevelMap).map(dlv=>checkedValue.some(cv=>cv==dlv)?null:dataLevelMap[dlv] = NOT_HAVE);
    this.setPrivilege(fun, {DATA_LEVEL:dataLevelMap});
    this.setState({layout:this.getLayout()});
  }

  onDataLevelCheckAllChange = (fun, dataLevelOptions, e) => {
    const checked = e.target.checked;
    if (checked) {
      this.onDataLevelCheckGroupChange(fun, dataLevelOptions.map(dlo=>dlo.value));
    } else {
      this.onDataLevelCheckGroupChange(fun, []);
    }
  }

  buildDataLevelOptions = (record) => {
    const dataLevelOptions = [];
    if (record.HAVE_CUST_COL == HAVE || record.HAVE_DEPT_COL == HAVE || record.HAVE_OWNER_COL == HAVE) {
      const DATA_LEVEL = this.getLayout().dictMap.DATA_LEVEL;
      dataLevelOptions.push({label:DATA_LEVEL[0], value:'0'});
      if (record.HAVE_CUST_COL == HAVE) {
        Object.keys(DATA_LEVEL).filter(v=>v>0&&v<9).map(v=>dataLevelOptions.push({value:v, label:DATA_LEVEL[v]}));
      }
      if (record.HAVE_DEPT_COL == HAVE) {
        Object.keys(DATA_LEVEL).filter(v=>v>10&&v<19).map(v=>dataLevelOptions.push({value:v, label:DATA_LEVEL[v]}));
      }
      if (record.HAVE_OWNER_COL == HAVE) {
        Object.keys(DATA_LEVEL).filter(v=>v>20&&v<29).map(v=>dataLevelOptions.push({value:v, label:DATA_LEVEL[v]}));
      }
    }
    return dataLevelOptions;
  }

  buildFunctionSubPanels = (record)=> {
      const actionOptions = record.actionList?record.actionList.map(a=> ({label:a.RES_NAME, value:a.PKEY})):[];
      const columnOptions = record.columnList?record.columnList.map(a=> ({label:a.RES_NAME, value:a.PKEY})):[];
      const dataLevelOptions = this.buildDataLevelOptions(record);
      let actionPanel = null;
      if (actionOptions.length > 0) {
        actionPanel = (
          <div>
            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
              <Checkbox
                indeterminate={record.actionList.some(a=>this.isResourceChecked(a)== HAVE) && record.actionList.some(a=>this.isResourceChecked(a) != HAVE)}
                onChange={(e)=> this.onCheckAllChange(record, record.actionList,e)}
                checked={record.actionList.every(a=>this.isResourceChecked(a) == HAVE)}
              >
                <b>操作</b>
              </Checkbox>
            </div>
            <CheckboxGroup options={actionOptions} 
              defaultValue={record.actionList.filter(a=>this.isResourceChecked(a)==HAVE).map(a=>a.PKEY)}
              value={record.actionList.filter(a=>this.isResourceChecked(a)==HAVE).map(a=>a.PKEY)}
              onChange={(checkedValue)=>this.onCheckGroupChange(record.actionList, checkedValue)} />
              <br/>
              <br/>
          </div>
        )
      }
      let columnPanel = null;
      if (columnOptions.length > 0) {
        columnPanel = (
          <div>
            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
              <Checkbox
                indeterminate={record.columnList.some(a=>this.isResourceChecked(a)== HAVE) && record.columnList.some(a=>this.isResourceChecked(a) != HAVE)}
                onChange={(e)=> this.onCheckAllChange(record, record.columnList,e)}
                checked={record.columnList.every(a=>this.isResourceChecked(a) == HAVE)}
              >
                <b>列</b>
              </Checkbox>
            </div>
            <CheckboxGroup options={columnOptions} 
              defaultValue={record.columnList.filter(a=>this.isResourceChecked(a)==HAVE).map(a=>a.PKEY)}
              value={record.columnList.filter(a=>this.isResourceChecked(a)==HAVE).map(a=>a.PKEY)}
              onChange={(checkedValue)=>this.onCheckGroupChange(record.columnList, checkedValue)} />
              <br/>
              <br/>
          </div>
        )
      }
      let dataLevelPanel = null;
      if (dataLevelOptions.length > 0) {
        let dataLevelMap = this.getDataLevel(record);
        const havePrivilege = this.isResourceChecked(record);
        if (dataLevelMap == null) {
          dataLevelMap = {};
          dataLevelOptions.map(dlo=>dataLevelMap[dlo.value] = havePrivilege);
          this.setPrivilege(record, {DATA_LEVEL:dataLevelMap});
        }
        dataLevelPanel = (
          <div>
            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
              <Checkbox
                indeterminate={dataLevelOptions.some(dlo=>dataLevelMap[dlo.value] == HAVE) && dataLevelOptions.some(dlo=>dataLevelMap[dlo.value] != HAVE)}
                onChange={(e)=> this.onDataLevelCheckAllChange(record, dataLevelOptions,e)}
                checked={dataLevelOptions.every(dlo=>dataLevelMap[dlo.value] == HAVE)}
              >
                <b>数据权限</b>
              </Checkbox>
            </div>
            <CheckboxGroup options={dataLevelOptions} 
              defaultValue={Object.keys(dataLevelMap).filter(key=>dataLevelMap[key] == HAVE)}
              value={Object.keys(dataLevelMap).filter(key=>dataLevelMap[key] == HAVE)}
              onChange={(checkedValue)=>this.onDataLevelCheckGroupChange(record, checkedValue)} />
              <br/>
              <br/>
          </div>
        )
      }

      if (actionPanel || columnPanel || dataLevelPanel) {
        return (
          <div>
          {actionPanel}
          {columnPanel}
          {dataLevelPanel}
          </div>
          )
      } else {
        return (<div>无数据</div>)
      }
    // });
    //   // this.setState({expandedFunctions});
    //   return expandedFunctions;
  }

//======================= Page connected end ====================================
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      fwParam:{...props.fwParam},
      buttonSize: props.buttonSize?props.buttonSize:'default',
      tableSize: props.tableSize?props.tableSize:'small',
      showSelectCol:props.showSelectCol?props.showSelectCol:false,
      queryPanelExpanded:false,
      expandedAllGroup:true,
      dialogs:{},
      actionInList:[],
      changedResource:{},
      expandedFunctions: {},
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.innerLayout[nextProps.innerLayout.ROLE_ID_KEY] != this.getLayout()[this.getLayout().ROLE_ID_KEY]) {
      console.info('nextProps',nextProps);
      nextProps.innerLayout.gotResource.map(res=> {
        if (this.state.expandedFunctions[res.PKEY]) {
          this.state.expandedFunctions[res.PKEY] = res;
        }
        if (res.nodes) {
          res.nodes.map(sr=> {
            if (this.state.expandedFunctions[sr.PKEY]) {
              this.state.expandedFunctions[sr.PKEY] = sr;
            }
          });
        }
      });
      
      Object.values(this.state.expandedFunctions).map(record=> this.onExpandFunction(true, record, nextProps.innerLayout));
      this.setState({changedResource:{}, expandedAllGroup:true});
    }
  }

  componentDidMount() {
    if (!this.props.innerLayout) {
      this.setTitle()
    }
    if (this.props.onRef) {
        this.props.onRef(this);
    }
    if (this.getLayout().onQuery) {
        this.getActionEntry(this.getLayout().onQuery).logic(this, this.getLayout().onQuery, null, -1, null);
    }
  }
  
  setTitle(newTitle) {
    const { title } = this.getLayout();
    document.title = newTitle?newTitle:title;
  }

  getLayout = () => {
    if (!this.props.innerLayout) {
        return this.props.layout;
    }
    return this.props.innerLayout;
  }

  getFwCoord = () => {
    return {...this.props.fwCoord, ...this.props.innerFwCoord};
  }

  onFormRef = (form) => {
    this.props.form = form;
  }

  getActionEntry = function(logicId) {
    return ButtonArea.getActionEntry(this, logicId);
  }

  handleAction = function(e, id) {
    let actionId = null;
    let event = null;
    if (id) {
      actionId = id;
      event = e;
    } else {
      actionId = e.key;
      event = e.domEvent;
    }
    this.getActionEntry(this.getLayout().actionArgs[actionId].click).logic(this, actionId, null, -1, event);
  }

  render() {
    const menus =this.getLayout().actions.map(act=> {
      const queryInput = [];
      if (act.id === 'searchGrp' || act.id === 'gridSearchGrp' || act.id === 'searchList') {
          queryInput.push(
          <Input key={act.id} 
            size={this.state.buttonSize}
            className={styles.queryValue} 
            defaultValue={this.state.fwParam.queryValue} 
            onPressEnter={(e)=>this.handleAction(e, 'searchList')}
            onChange={(e)=>this.setState({fwParam:{...this.state.fwParam, queryValue:e.target.value}})}
          />
        );
      }
      if (act.tag == 'group') {
        const subActions = act.children.filter(sa=>sa.visible);
        if (subActions.length > 1) {
          const subActionWrapper = (
            <Menu onClick={(e)=>this.handleAction(e)}>
              {subActions.filter((_,index)=>(!act.showDefault||index>0)).map(sa=><Menu.Item key={sa.id}><Icon type={sa.icon} />{sa.label}</Menu.Item>)}
            </Menu>);

          if (act.showDefault) {
            return (
              <span key={act.id}>
                {queryInput}
                <Dropdown.Button key={act.id} size={this.state.buttonSize} onClick={(e)=>this.handleAction(e, act.children[0].id)} overlay={subActionWrapper}>
                  <Icon type={act.children[0].icon} />{act.children[0].label}
                </Dropdown.Button>
              </span>
            );
          } else {
            return (
              <span  key={act.id}>
                {queryInput}
                <Dropdown overlay={subActionWrapper}>
                  <Button style={{ marginLeft: 8 }} size={this.state.buttonSize}>
                    <Icon type={act.icon} />{act.label} <Icon type="down" />
                  </Button>
                </Dropdown>
              </span>
            )
          }
        } else if (subActions.length == 1) {
          return  (
            <span key={subActions[0].id}>
              {queryInput}
              <Button key={subActions[0].id} style={{ marginLeft: 8 }} size={this.state.buttonSize} onClick={(e)=>this.handleAction(e,subActions[0].id)}>
              <Icon type={subActions[0].icon} />{subActions[0].label}
              </Button>
            </span>
          );
        }
      } else {
          if (act.visible) {
            return  (
              <span key={act.id}>
                {queryInput}
                <Button key={act.id} type="primary" style={{ marginLeft: 8 }} size={this.state.buttonSize} onClick={(e)=>this.handleAction(e, act.id)}>
                  <Icon type={act.icon} />{act.label}
                </Button>
              </span>
            );
          }
      }
    });
    const queryPanels = [];
    // 如果检索条件超过3个则显示
    if (this.getLayout().argument && this.getLayout().argument.queryFields) {
      queryPanels.push(<Col key='expanded' span={24} style={{ textAlign: 'right' }}>
      <a style={{ marginLeft: 8, fontSize: 12 }} onClick={(e)=>this.setState({queryPanelExpanded:!this.state.queryPanelExpanded})}>
      {this.state.queryPanelExpanded? '关闭':'展开'} <Icon type={this.state.queryPanelExpanded?'up':'down'} />
      </a>
      </Col>);
    }
    // const expandedFunctions = this.buildFunctionSubPanels();
    return (
      <div className={styles.normal}>
        <div style={{width:'95%', margin:'10px'}}>
          <Row>
            {queryPanels}
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              {menus}
            </Col>
          </Row>
        </div>
        <div className="search-result-list" style={{width:'95%', margin:'10px'}}>
          <Table
            loading={this.props.loading}
            columns={this.COLS}
            dataSource={this.getLayout().gotResource}
            pagination={false}
            rowKey='PKEY'
            size={this.state.tableSize}
            bordered
            defaultExpandAllRows={this.state.expandedAllGroup}
            childrenColumnName="_EMPTY"
            rowSelection={{type:'checkbox',
              selectedRowKeys:this.getLayout().gotResource?this.getLayout().gotResource.filter(res=>this.isResourceChecked(res)== HAVE || (res.nodes && res.nodes.some(node=>this.isResourceChecked(node) == HAVE))).map(res=>res.PKEY):[],
              onSelect:(record, selected, selectedRows, nativeEvent) => this.onRowCheckedChange(null, record, selected, selectedRows, nativeEvent, 1),
              onSelectAll:(selected, selectedRows, changeRows)=> console.info('onselectAll', selected),
              getCheckboxProps:(record)=>({indeterminate:!!record.nodes&&record.nodes.some(r=>this.isResourceChecked(r)== HAVE) && record.nodes.some(r=>this.isResourceChecked(r) != HAVE)})
            }}
            expandedRowRender={recordGroup => (
              <Table style={{ margin: 0 }}
                rowSelection={{type:'checkbox',
                  selectedRowKeys:recordGroup.nodes?recordGroup.nodes.filter(res=>this.isResourceChecked(res)== HAVE).map(res=>res.PKEY):[],
                  onSelect:(record, selected, selectedRows, nativeEvent) => this.onRowCheckedChange(recordGroup, record, selected, selectedRows, nativeEvent, 2)
                }}
                columns={this.COLS} 
                dataSource={recordGroup.nodes} 
                pagination={false} 
                rowKey='PKEY'
                size="small"
                showHeader={false} 
                childrenColumnName="_EMPTY"
                onExpand={(expanded, record)=>this.onExpandFunction(expanded, record)}
                expandedRowRender={recordFunction => (
                    <div style={{ margin: 10 }}>
                      {this.buildFunctionSubPanels(recordFunction)}
                    </div>
                  )}
              />
            )}
          />
        </div>
        {Object.values(this.state.dialogs)}
      </div>
    )
  }
}
