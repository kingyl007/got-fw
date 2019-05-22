import { connect} from 'dva';
import { Component, Children } from 'react';
import { Tree, Divider, Popconfirm, Button, Row, Col, Icon, Menu, Dropdown, Input, Layout } from 'antd';
import router from 'umi/router';
import * as ButtonArea from '../../../component/fw/buttonArea';

import styles from './tree.css';
const { TreeNode } = Tree;

// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Sider, Content } = Layout;

function mapStateToProps(state) {
  const {dispatch, fwCoord, layout} = state.fw;
  const {treeData} = state.tree;
  return {
    loading: state.loading.models.tree,
    dispatch,
    fwCoord,
    layout,
    treeData,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTreeData: ({fwParam, fwCoord, callback}) => {
      dispatch({
          type: 'tree/getTreeData',
          payload: {fwParam, fwCoord, callback},
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
    getEditData: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'edit/getEditData',
          payload: {fwCoord, fwParam, callback},
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
export default class TreePage extends Component {
//======================= Page connected start ====================================
  getTreeData = ({fwParam, fwCoord, callback}) => {
    const param = {...this.state.fwParam, openerSelectedData:{...this.props.openerSelectedData}, ...fwParam};
    this.props.getTreeData({
      fwParam:param, 
      fwCoord:{...this.getFwCoord(),...fwCoord},
      'callback':callback?callback:result=> {
        const firstNodeKey = result.data.length>0?result.data.filter((_,index)=>index==0).map(node=>String(node[this.getLayout().argument.treeIdField]))[0]:null;
        this.setState({
          treeData:result.data, 
          loadedKeys:{},
          selectedKeys:firstNodeKey?[firstNodeKey]:[],
          expandedKeys:firstNodeKey?[firstNodeKey]:[],
        });
        this.onTreeNodeSelected(firstNodeKey?[firstNodeKey]:[],{});
      },
    });
  }

  onTreeNodeSelected = (selectedKeys, {selected, selectedNodes, node, event})=> {
    console.info('onTreeNodeSelected', selectedKeys, selected, node, selectedNodes);
    if (selectedKeys && selectedKeys.length > 0) {
      const keyChains = String(selectedKeys[0]).split(',');
      if (keyChains.length > 1) {
        let cnode = null;
        let i = 0;
        for (; i < keyChains.length; ++i) {
          cnode = this.findNode(keyChains[i]);
          if (!cnode) {
            console.info('not found node', keyChains[i]);
            break;
          } else {
            console.info('found node', keyChains[i], cnode);
          }
        }
        if (cnode) {
          this.onTreeNodeSelected([keyChains[keyChains.length - 1]], {selected, selectedNodes, node, event});
        } else {
          // load childrens and select
          this.getTreeData({fwParam:{selectedTreeNodeId:keyChains.filter((v,index)=>index>=i-1).join(',')}, callback:(result)=>{
            cnode = this.findNode(keyChains[i-1]);
            cnode.children = result.data;
            keyChains.filter((v,index)=>index>=i-1 && index < keyChains.length - 1).map(k=>this.state.loadedKeys[k] = true);
            this.state.loadedKeys[keyChains[i-1]] = true;
            const expandedKeys = [...this.state.expandedKeys, ...keyChains.filter((v,index)=>index >= 0 && index < keyChains.length - 1)];
            this.setState({
              expandedKeys,
              treeData:this.state.treeData,
              loadedKeys:this.state.loadedKeys,
            }, ()=>this.onTreeNodeSelected([keyChains[keyChains.length - 1]], {selected, selectedNodes, node, event}));
            resolve();
        }});
        }
        return;
      }
    }
    if (this.props.onSelectTreeNode) {
      if (selectedKeys && selectedKeys.length > 0) {
        this.props.onSelectTreeNode(selectedKeys[0], this.findNode(selectedKeys[0]));
      } else {
        this.props.onSelectTreeNode(null);
      }
    }
    let selectedRecord = null;
    if (selected) {
      if (!node) {
        node = this.findNode(selectedKeys[0]);
      }
      if (node) {
        selectedRecord = node.props&&node.props.dataRef?node.props.dataRef:node;
      }
    } else {
      if (node) {
        selectedRecord = node.props&&node.props.dataRef?node.props.dataRef:node;
        selectedKeys.push(String(selectedRecord[this.getLayout().argument.treeIdField]));
      }
    }
    this.setState({selectedKeys, selectedRecord});
  }

  onTreeNodeChecked = (checkedKeys, e) => {
    const newCheckedKeys = {};
    if (checkedKeys) {
      checkedKeys.map(key=>{
        newCheckedKeys[key] = true;
      });
    }
    this.setState({newCheckedKeys});
  }

  renderTreeNodes = data => !!data?data.map((item) => (
      <TreeNode title={item[this.getLayout().argument.treeLabelField]} 
        key={String(item[this.getLayout().argument.treeIdField])}
        isLeaf={!item.GOT_SUBCOUNT || item.GOT_SUBCOUNT<1}
        dataRef={item} 
      >
        {this.renderTreeNodes(item.children)}
      </TreeNode>
    )):null

  onTreeLoadData = (treeNode)=> new Promise((resolve) => {
    console.info(treeNode.props);
    if (treeNode.props.dataRef.children) {
      this.state.loadedKeys[treeNode.props.eventKey] = true;
      resolve();
      this.setState({loadedKeys:this.state.loadedKeys})
      return;
    }
    this.getTreeData({fwParam:{selectedTreeNodeId:treeNode.props.eventKey}, callback:(result)=>{
        treeNode.props.dataRef.children = result.data;
        this.state.loadedKeys[treeNode.props.eventKey] = true;
        resolve();
        this.setState({
          treeData:this.state.treeData,
          loadedKeys:this.state.loadedKeys,
        });
    }});
  })

  findNode = (key, list) => {
    let targetList = list;
    if (targetList==undefined) {
      targetList = this.state.treeData;
    } else if (list == null || list.length < 1) {
      return null;
    }
    const matched = targetList.filter(node=>node[this.getLayout().argument.treeIdField] == key);
    if (matched.length > 0) {
      return matched[0];
    } else {
      const subFound = targetList.filter(node=>node.children && node.children.length > 0).map(node=>this.findNode(key, node.children)).filter(node=>!!node);
      if (subFound.length > 0) {
        return subFound[0];
      }
    }
    return null;
  }
//======================= Page connected end ====================================

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      dialogs:{},
      components:{},
      actionInList:[],
      fwParam:{...props.fwParam},
      buttonSize: props.buttonSize?props.buttonSize:'small',
      selectedKeys:[],
      selectedRecord:null,
      showCheckBox:props.showCheckBox?props.showCheckBox:false,
      checkStrictly:false,
      checkedKeys:{},
      expandedAllNodes:false,
      expandedKeys:[],
      loadedKeys:{},
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.info('innerFwCoord', nextProps.innerFwCoord, this.getFwCoord());
    if (!!nextProps.openerSelectedData || !! nextProps.innerLayout || !!nextProps.innerFwCoord) {
      if (nextProps.openerSelectedData != this.props.openerSelectedData
      || nextProps.innerLayout != this.props.innerLayout
      || nextProps.innerFwCoord != this.props.innerFwCoord
      ) {
        console.info('tree receive props2',nextProps);
        const layout = nextProps.innerLayout?nextProps.innerLayout:this.getLayout();
        this.state.innerLayout = layout;
        this.state.innerFwCoord = nextProps.innerFwCoord;
        this.refresh();
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
      this.getActionEntry(this.getLayout().onQuery).logic(this, this.getLayout().onQuery, null, -1, null);
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
    return {...this.props.fwCoord, ...this.props.innerFwCoord, ...this.state.innerFwCoord};
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
    this.getActionEntry(this.getLayout().actionArgs[actionId].click).logic(this, actionId, this.state.selectedRecord, -1, event);
  }

  render() {
    const menus = ButtonArea.buildGridMenus(this, styles);
    const queryPanels = ButtonArea.buildGridQueryArea(this);
    return (
      <div className={styles.normal} style={{padding:'10px'}}>
        <div style={{paddingBottom:10}}>
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
          <Tree
            checkable={this.state.showCheckBox}
            checkStrictly={this.state.checkStrictly}
            autoExpandParent={this.state.expandedAllNodes}
            selectedKeys={this.state.selectedKeys}
            onSelect={(selectedKeys, e)=>this.onTreeNodeSelected(selectedKeys, e)}
            defaultCheckedKeys={Object.keys(this.state.checkedKeys)}
            checkedKeys={Object.keys(this.state.checkedKeys)}
            onCheck={(checkedKeys, e)=>this.onTreeNodeChecked(checkedKeys, e)}
            expandedKeys={this.state.expandedKeys}
            onExpand={(expandedKeys, {expanded, node})=> this.setState({expandedKeys})}
            loadData={treeNode => this.onTreeLoadData(treeNode)}
            loadedKeys={Object.keys(this.state.loadedKeys)}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        </div>
        {Object.values(this.state.dialogs)}
      </div>
    )
  }
}
