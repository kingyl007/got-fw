import { connect} from 'dva';
import { Component, Children } from 'react';
import { Layout, Table, Pagination, Divider,Popconfirm,Modal, message, Button,Row, Col,Icon,Menu,Dropdown, Input } from 'antd';
import router from 'umi/router';
import RightList from './right_list';

import styles from '../grid/grid.css';
import * as ButtonArea from '../../../component/fw/buttonArea';

// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Sider, Content } = Layout;

function mapStateToProps(state) {
  const {dispatch, fwCoord, layout} = state.fw;
  const {data, fwPage} = state.grid;
  return {
    loading: state.loading.models.grid,
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
export default class RoleRight extends Component {
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

  onTableRowClick = function(record) {
    if (this.state.selectedRowKeys == null || this.state.selectedRowKeys.length == 0 || this.state.selectedRowKeys[0] != record.fw_index) {
      this.setState({openerSelectedData:record, selectedRowKeys:[record.fw_index]});
      this.props.loadLayout({fwCoord:{...this.props.fwCoord, 'function':'rights', 'view':'rightList'}, fwParam:{openerSelectedData:record}, callback: (layout)=>{
        // 构造出旧数据结构和新数据结构，以便于差分更新
        layout.gotResource.map((row,index)=>{row.nodes = row.children; delete row.children});
        this.setState({rightListLayout:layout});
      }});
    }
  }
//======================= Page connected end ====================================
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      fwParam:{...props.fwParam},
      buttonSize: props.buttonSize?props.buttonSize:'small',
      tableSize: props.tableSize?props.tableSize:'middle',
      showSelectCol:props.showSelectCol?props.showSelectCol:'radio',
      queryPanelExpanded:false,
      dialogs:{},
      actionInList:[],
      selectedRowKeys:[],
      rightListLayout:{
        actions:[],
        columns:[],
        displayActions:[],
      },
    };
  }

  componentDidMount() {
    if (!this.props.innerLayout) {
      this.setTitle();
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
    const menus =this.getLayout().displayActions.map(act=> {
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
                <Button key={act.id} style={{ marginLeft: 8 }} size={this.state.buttonSize} onClick={(e)=>this.handleAction(e, act.id)}>
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
    return (
      <div className={styles.normal} style={{height:'100%'}}>
        <Layout style={{height:'100%'}}>
          <Sider width={537} style={{ overflow: 'auto', backgroundColor:'#ffffff'}}>
            <div style={{width:'95%', margin:'10px'}}>
              <Row>
                {queryPanels}
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'left'}}>
                  {menus}
                </Col>
              </Row>
            </div>
            <div className="search-result-list">
              <Table
                loading={this.props.loading}
                columns={this.getLayout().columns.filter(col=>col.visible).map(col=>{
                    if(col.id == '_FW_ACTIONS') {
                        this.OP_COL.title = col.label;
                        return this.OP_COL;
                    }
                    col.title = col.label;
                    col.dataIndex = col.id;
                    return col;
                  })
                }
                dataSource={this.state.data}
                pagination={false}
                rowKey='fw_index'
            size={this.state.tableSize}
                bordered
                rowSelection={{type:'radio', selectedRowKeys:this.state.selectedRowKeys}}
                onRow={(record) => {
                  return {
                    onClick: () => this.onTableRowClick(record),       // 点击行
                    onMouseEnter: () => {},  // 鼠标移入行
                  };
                }}
              />
              <Pagination
                  className="ant-table-pagination"
              style={{margin:'15px'}}
              size="small" showTotal={(total, range)=>`共计 ${total} 条记录`} showSizeChanger
                  total={this.state.fwPage.totalRow}
                  current={this.state.fwPage.pageNumber}
                  pageSize={this.state.fwPage.pageSize}
              onChange={(page, pageSize)=>this.pageChangeHandler(page, pageSize)}
              onShowSizeChange={(current, size)=>this.pageChangeHandler(current, size)}
              />
            </div>
          </Sider>
          <Content style={{ overflow: 'auto',  marginLeft:'20px', backgroundColor:'#ffffff'}}>
            <RightList innerLayout={this.state.rightListLayout} 
              innerFwCoord={{...this.props.fwCoord, 'function':'rights', 'view':'rightList'}}
              openerSelectedData={this.state.openerSelectedData}
              style={{ width:'90%'}}
            />
          </Content>
        </Layout>
        {Object.values(this.state.dialogs)}
      </div>
    )
  }
}
