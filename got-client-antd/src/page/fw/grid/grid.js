import { connect} from 'dva';
import { Component, Children } from 'react';
import { Table, Pagination, Divider,Popconfirm,Modal, message, Button,Row, Col,Icon,Menu,Dropdown, Input,Layout } from 'antd';
import router from 'umi/router';
import * as ButtonArea from '../../../component/fw/buttonArea';
import * as got from '../../../logic/got';

import styles from './grid.css';

// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Sider, Content } = Layout;

function mapStateToProps(state) {
  const {dispatch, fwCoord, layout} = state.fw;
  const {data, fwPage} = state.grid;
  return {
    loading: state.loading.models.grid || state.loading.models.fw,
    editLoading:state.loading.models.edit,
    dispatch,
    fwCoord,
    layout,
    fwPage,
    data,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCreateData: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'create/getCreateData',
          payload: {fwCoord, fwParam, callback},
      });
    },
    getEditData: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'edit/getEditData',
          payload: {fwCoord, fwParam, callback},
      });
    },
    saveEditData: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'edit/saveEditData',
          payload: {fwCoord, fwParam, callback},
      });
    },
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
    validDeleteData: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'grid/validDeleteData',
          payload: {fwCoord, fwParam, callback},
      });
    },
    deleteData: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'grid/deleteData',
          payload: {fwCoord, fwParam, callback},
      });
    },
    getGridData: ({fwPage, fwParam, fwCoord, otherParams, callback}) => {
      dispatch({
          type: 'grid/getGridData',
          payload: {fwPage, fwParam, fwCoord, otherParams, callback},
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
export default class Grid extends Component {
//======================= Page connected start ====================================
  getSelectData = ({fwPage, fwParam, fwCoord, selectedData}) => {
    const {columnMap} = this.getLayout();
    const {queryColumnValues} = this.state;
    const conditions = Object.keys(queryColumnValues).map(key=> {
      if (queryColumnValues[key]) {
        const col = columnMap[key];
        if (col) {
          if (col.dictionary) {
            return {field:col.id, operator:'=', value1:queryColumnValues[key]};
          } else if (col.type == 'DATE' || col.type == 'DATETIME') {
            if (queryColumnValues[key][0] && queryColumnValues[key][1]) {
              return {field:col.id, operator:'BETWEEN', value1:queryColumnValues[key][0], value2:queryColumnValues[key][1]}
            } else {
              return;
            }
          }
        }
        return {field:key, operator:'LIKE', value1:queryColumnValues[key]};
      }
    }).filter(c=>c);
    const param = {...this.state.fwParam, 
      conditions,
      openerSelectedData:{...this.props.openerSelectedData, ...selectedData}, 
      ...fwParam};
    if (selectedData) {
      this.state.fwParam.openerSelectedData = selectedData;
      this.setState({fwParam:this.state.fwParam});
    }
    this.props.getSelectData({fwPage:{...this.state.fwPage, ...fwPage}, fwParam:param, fwCoord:{...this.getFwCoord(),...fwCoord}, callback: (result)=> {
        this.setState({fwPage:result.page?result.page:{}, data:result.data});
    }});
  }

  getGridData = ({fwPage, fwParam, fwCoord, otherParams}) => {
    console.info('getGridData', JSON.stringify(this.state.otherParams));
    const {columnMap} = this.getLayout();
    const {queryColumnValues} = this.state;
    const conditions = Object.keys(queryColumnValues).map(key=> {
      if (queryColumnValues[key]) {
        const col = columnMap[key];
        if (col) {
          if (col.dictionary) {
            return {field:col.id, operator:'=', value1:queryColumnValues[key]};
          } else if (col.type == 'DATE' || col.type == 'DATETIME') {
            if (queryColumnValues[key][0] && queryColumnValues[key][1]) {
              return {field:col.id, operator:'BETWEEN', value1:queryColumnValues[key][0], value2:queryColumnValues[key][1]}
            } else {
              return;
            }
          }
        }
        return {field:key, operator:'LIKE', value1:queryColumnValues[key]};
      }
    }).filter(c=>c);
    const param = {...this.state.fwParam,
      conditions,
      selectedTreeNodeId:this.props.selectedTreeNodeId?this.props.selectedTreeNodeId:null, 
      treeConnectColumn:this.props.gridToTreeField?this.props.gridToTreeField:null, 
      ...fwParam
    };
    this.props.getGridData({
      otherParams:{...this.state.otherParams, ...otherParams}, 
      fwPage:{...this.state.fwPage, ...fwPage}, 
      fwParam:param, 
      fwCoord:{...this.getFwCoord(),...fwCoord}, 
      callback: (result)=> {
          this.setState({fwPage:result.page, data:result.data, gridResult:result});
      }
    });
  }
  
  pageChangeHandler =  function(pageNumber, pageSize) {
    this.getGridData({fwPage:{pageNumber, pageSize}});
  };

  OP_COL = {
    title: 'Operation',
    dataIndex: '_FW_ACTIONS',
    render: (text, record, index) => (
      <span key={index} className={styles.operation}>
        {
          (this.getLayout().otherActions['inList']?this.getLayout().otherActions['inList']:[]).filter(act=>act.visible==true).map((act, actIndex)=>{
            act.fw_index = actIndex;
            const actionEntry = ButtonArea.getActionEntry(this, act.click);
            if (!actionEntry.isValid || actionEntry.isValid(this, act.id, record)) {
              return <span key={actIndex}>{actIndex>0?<Divider type="vertical" />:null}{ButtonArea.getActionEntry(this, act.click).layout(this, act.id, record, index)}</span>;
            } else {
              return null;
            }
          })
        }
      </span>
    ),
  }
  handleQueryInputChange = (key, e) => {
    let value = e.target.value;
    console.info('input', key, value);
    if (value != undefined && value != null) {
      value = value.trim(true);
    }
    const {columnMap} = this.getLayout();
    let col = columnMap[key];
    if (!col) {
      const ids = key.split(',');
      if (ids && ids.length > 0) {
        col = columnMap[ids[0]];
      }
    }
    if (col && col.size) {
      value = value.substr(0, col.size);
    }
    const {queryColumnValues} = this.state;
    queryColumnValues[key] = value;
    this.setState({queryColumnValues}); 
  }
  handleQuerySelectChange = (key, value, option) => {
    console.info('select', key, value, option);
    const {queryColumnValues} = this.state;
    queryColumnValues[key] = value == undefined?null:Array.isArray(value)?value.join(','):value;
    this.setState({queryColumnValues}); 
  }
  handleQueryDateRangeChange = (key, dates, dateStrs) => {
    console.info('date', key, dates, dateStrs);
    const {queryColumnValues} = this.state;
    queryColumnValues[key] = dateStrs;
    this.setState({queryColumnValues}); 
  }
//======================= Page connected end ====================================

  constructor(props) {
    // 原则：
    // 1.作为子组件时，会传入innerLayout,innerFwCoord, fwParam,记录画面打开所用的参数
    // 2.直接打开时，会写入
    super(props);
    this.state = {
      ...props,
      gridResult:{},
      fwParam:{...props.fwParam},
      otherParams:{},
      buttonSize: props.buttonSize?props.buttonSize:'default',
      tableSize: props.tableSize?props.tableSize:'middle',
      showSelectCol:props.showSelectCol?props.showSelectCol:false,
      selectedRecord:{},
      selectedRowKeys:[],
      queryPanelExpanded:false,
      dialogs:{},
      components:{},
      actionInList:[],
      queryColumnValues:{},
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.info(nextProps.openerSelectedData != this.props.openerSelectedData,nextProps.openerSelectedData, this.props.openerSelectedData);
    if (/*!!nextProps.openerSelectedData 
        ||*/ !! nextProps.innerLayout 
        || !!nextProps.innerFwCoord 
        || !!nextProps.selectedTreeNodeId
        || !!nextProps.otherParams) {
      if (/*(nextProps.openerSelectedData != this.props.openerSelectedData) 
          ||*/ nextProps.innerLayout != this.props.innerLayout
          || nextProps.innerFwCoord != this.props.innerFwCoord
        ) {
        console.info('grid receive props2',nextProps);
        const layout = nextProps.innerLayout?nextProps.innerLayout:this.getLayout();
        this.state.innerLayout = layout;
        this.state.innerFwCoord = nextProps.innerFwCoord;
        if (layout.onQuery) {
          ButtonArea.getActionEntry(this, layout.onQuery).logic(this, layout.onQuery, null, -1, null);
        }
      }
      if (nextProps.selectedTreeNodeId != this.props.selectedTreeNodeId) {
        const {fwParam} = this.state;
        console.info('selectedTreeNodeId', nextProps.selectedTreeNodeId);
        fwParam.selectedTreeNodeId = nextProps.selectedTreeNodeId;
        this.setState({fwParam});
        this.getGridData({fwParam:{selectedTreeNodeId:nextProps.selectedTreeNodeId}});
      }
      if (nextProps.otherParams != this.props.otherParams) {
        console.info('nextOtherParams', nextProps.otherParams);
        this.setState({otherParams:nextProps.otherParams});
        this.getGridData({otherParams:nextProps.otherParams});
      }
    }
  }

  componentDidMount() {
    if (!this.props.innerLayout) {
      this.setTitle();
    }
    if (this.props.onRef) {
        this.props.onRef(this);
    }
    this.refresh();
  }

  refresh() {
    if (this.getLayout().onQuery) {
        ButtonArea.getActionEntry(this, this.getLayout().onQuery).logic(this, this.getLayout().onQuery, null, -1, null);
    }
  }
  
  setTitle(newTitle) {
    const { title } = this.getLayout();
    document.title = newTitle?newTitle:title;
  }

  getLayout = () => {
    if (!!this.state.innerLayout && this.state.innerLayout != this.props.innerLayout) {
      return this.state.innerLayout;
    }
    if (this.props.innerLayout) {
      return this.props.innerLayout;
    }
    return this.props.layout;
  }

  getFwCoord = () => {
    return {...this.props.fwCoord, ...this.props.innerFwCoord};
  }

  onFormRef = (form) => {
    this.props.form = form;
  }

  onComponentRef = (id, ref) => {
    this.state.components[id] = ref;
  }

  getComponent = (id) => {
    return this.state.components[id];
  }

  getActionEntry = (logicId) => {
    return ButtonArea.getActionEntry(this, logicId);
  }

  handleAction = function(e, id, record) {
    let actionId = null;
    let event = null;
    if (id) {
      actionId = id;
      event = e;
    } else {
      actionId = e.key;
      event = e.domEvent;
    }
    ButtonArea.getActionEntry(this, this.getLayout().actionArgs[actionId].click).logic(this, actionId, record, -1, event);
  }

  render() {
    const queryColumns = ButtonArea.buildGridQueryArea(this);
    const menus = ButtonArea.buildGridMenus(this, styles, queryColumns && queryColumns.length > 0);
    const queryPanel = queryColumns&&queryColumns.length > 0?<Row style={{whiteSpace:'nowrap', height:50, padding:10, backgroundColor:'#ffffff'}}>{queryColumns}</Row>:null;
    const headerArea = this.state.gridResult.headerData?this.state.gridResult.headerData.map((item, index)=> {
      return <span key={item.TITLE} style={{fontWeight:400}}>{index>0?<Divider type="vertical"/>:null}{item.TITLE}: <span style={{color:'rgb(51, 153, 0)', fontWeight:700}}>{item.VALUE} {item.TAIL}</span></span>
    }):null;
    return (
      <div style={{height:'100%'}}>
        <div style={{height:50+(queryColumns&&queryColumns.length > 0?50:0)}}>
          {queryPanel}
          <div style={{marginTop:10, padding:10, backgroundColor:'#ffffff'}}>
              {menus}
          </div>
        </div>
        <div className="search-result-list" style={{width:'100%', overflow:'auto', backgroundColor:'#ffffff', ...got.getFillHeight(60+(queryColumns&&queryColumns.length > 0?40:0))}}
        >
        {headerArea&&headerArea.length>0?<Row style={{padding:10, backgroundColor:'#ffffff', height:40}}>
          <Col span={24} style={{ textAlign: 'left'}}>
            {headerArea}
          </Col>
        </Row>:null}
          <Table
            loading={this.props.loading}
            columns={this.getLayout().columns.filter(col=>col.visible).map(col=>{
                if(col.id == '_FW_ACTIONS') {
                    this.OP_COL.title = col.label;
                    return this.OP_COL;
                }
                col.title = col.label;
                col.dataIndex = col.id;
                if (col.onFormat) {
                  col.render = (text, record, index) => require(`../../../logic/${this.getLayout().clientLogicMap[col.onFormat].file}`).default(text, record, index, col, this);
                } else if (col.dictionary) {
                  col.render = (text, record, index) => {
                    let labelArr = [];
                    let valueArr = [];
                    if (text != null) {
                      valueArr = String(text).split(',');
                    }
                    valueArr.map((val,idx)=> {
                        let label = null;
                        if (val != null) {
                          label = this.getLayout().dictMap[col.dictionary][val];
                        }
                        if (label == undefined || label == null) {
                          label = val;
                        }
                        if (label != null) {
                          labelArr.push(label);
                        }
                      }
                    );

                    const display = labelArr.length > 0 ? labelArr.join(','):text;
                    return display;
                  };
                } else if (col.showColumn) {
                  col.render = (text, record, index)=> col.showColumn.split(',').map(sc=>record[sc]).join(' ');
                } else {
                  if (col.type == 'NUM') {
                    col.align = 'right';
                    col.render = (text, record, index) => got.number_format(text);
                  }
                }
                return col;
              })
            }
            dataSource={this.state.data}
            pagination={false}
            rowKey='fw_index'
            size={this.state.tableSize}
            bordered
            rowSelection={this.state.showSelectCol?{
              type:this.state.showSelectCol,
              selectedRowKeys:this.state.data.filter(row=>row.selected || (row.selected == undefined && row.FW_SELECTED)).map(row=>row.fw_index),
              onSelect:(record, selected, selectedRows, nativeEvent)=> {record.selected = selected; this.setState({data:this.state.data})},
              onSelectAll:(selected, selectedRows, changeRows)=>{this.state.data.map(row=>row.selected=selected); this.setState({data:this.state.data})},
            }:null}
          />
            <Pagination
              className="ant-table-pagination"
              style={{margin:5}}
              size="small" 
              showTotal={(total, range)=>`共计 ${total} 条记录`} 
              showSizeChanger
              total={this.state.fwPage.totalRow}
              current={this.state.fwPage.pageNumber}
              pageSize={this.state.fwPage.pageSize}
              onChange={(page, pageSize)=>this.pageChangeHandler(page, pageSize)}
              onShowSizeChange={(current, size)=>this.pageChangeHandler(current, size)}
            />
        </div>
        {Object.values(this.state.dialogs)}
      </div>
    )
  }
}
