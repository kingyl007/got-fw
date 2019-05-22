import {Modal, Divider, Icon, message,Spin, Button} from 'antd';
import * as got from '../../got';

/**
 * 当操作在列表中显示时，通过此方法构建界面元素
 * @param {*} view 画面实例
 * @param {*} actionId 操作Id
 * @param {*} record 待操作记录，对于列表来说就是对应的行
 * @param {*} recordIndex 待操作记录索引
 */
export function layout(view, actionId, record, recordIndex) {
  this.view = view;
  this.action = view.getLayout().actionArgs[actionId];
  return(
    <span key={this.action.fw_index} onClick={(event) => this.logic(view, actionId, record, recordIndex, event)}>
        <a href="javascript:;"><Icon type={this.action.icon} />{this.action.label} </a>
    </span>
  )
}

/**
 * 操作实际执行的逻辑
 * @param {*} view 画面实例
 * @param {*} actionId 操作Id
 * @param {*} record 待操作记录，对于列表来说就是对应的行
 * @param {*} recordIndex 待操作记录索引
 * @param {*} event 原始界面事件
 */
export function logic(view, actionId, record, recordIndex, event) {
  this.view = view;
  this.action = view.getLayout().actionArgs[actionId];
  this.record = record;
  this.recordIndex = recordIndex;
  this.event = event;
  
  const ID_FIELD = this.view.getLayout().argument.treeIdField;
  const PARENT_FIELD = this.view.getLayout().argument.treeParentIdField;

  if (!this.record) {
    let selectedKey = null;
    if (this.view.state.selectedKeys && this.view.state.selectedKeys.length > 0) {
      selectedKey = this.view.state.selectedKeys[0];
    }
    let selectedNode = null;
    if (selectedKey) {
      selectedNode = this.view.findNode(selectedKey);
    }
    this.record = selectedNode;
  }
  if (this.record == null) {
    message.info('请选择要编辑的节点', 5);
    return;
  } else if (!view.getLayout().argument.treeCanAddRoot) {
    // message.info('不能添加顶级节点',5);
    // return;
  }
  this.record = {...this.record, children:null};
  const fwCoord = {...this.view.getFwCoord(), view:'edit'};
  if (this.view.getLayout().argument) {
    if (this.view.getLayout().argument.treeFunction) {
      fwCoord['function'] = this.view.getLayout().argument.treeFunction;
    }
  }
  const fwParam = {
    openerActionId: actionId, 
    openerFunction: this.view.getFwCoord()['function'],
    openerView: this.view.getFwCoord().view,
    oldData:{},
    newData:{},
    selectedTreeNodeId: this.record?this.record[ID_FIELD]:null, 
    //selectedData:{...this.record.props.dataRef},
  };
  let UIPage = null;
  console.info('this.action', this.action);
  if (this.action.argument && this.action.argument.antdPath) {
    const antdPath = this.action.argument.antdPath;
    UIPage = require(`../../../page/${antdPath}`).default;
  } else {
    UIPage = require('../../../page/fw/edit/edit').default;
  }
  const filterToEditTreeData = (list, id)=> {
    if (list) {
      const newList =  list.filter(node=>node[ID_FIELD] != id).map(node=>({...node}));
      newList.map(row=> {
        if (row.children) {
          row.children = filterToEditTreeData(row.children, id);
        }
      })
      return newList;
    }
    return null;
  }
  const layoutCallback = (layout)=> {
    // ==============zd4s业务要求=======================
    // 2.若当前选中的是根节点，则上级部门选择框禁用；否则，显示为该部门上级部门名 称，点击弹出下拉树，
    // TODO 但是树中不包含当前部门及其下级部门，即不可将当前部门或 其下级部门修改为当前部门的上级部门
    layout.columns.filter(col=>col.id == PARENT_FIELD).map(col=>col.editable=(!!this.record.GOT_PID))
    // ================================================
    if (!this.innerLayout) {
      this.innerLayout = {};
    }
    this.innerLayout[actionId] = layout;
    this.view.props.getEditData({fwCoord, fwParam:{...fwParam, selectedData:this.record}, callback:(resultData)=>{
      if (resultData) {
        const toSelectTreeData = filterToEditTreeData(this.view.state.treeData, resultData[ID_FIELD]);
        const newDialogs = this.view.state.dialogs;
        const visibleColumns = layout.columns.filter(col=>col.visible);
        const width = (visibleColumns.length>=5 || visibleColumns.some(col=>col.ui == 'MAP'))?'42vw':'25vw';
        newDialogs[this.id] = 
          <Modal
            width={width}
            key={this.id}
            title={layout.title}
            visible={true}
            maskClosable={false}
            confirmLoading={this.view.props.editLoading}
            cancelText="取消" onCancel={(e)=>this.handleCancel(e)}
            okText="保存" onOk={(e) => this.handleOk(e)}
            >
            <UIPage 
              selectedData={this.record} 
              innerLayout={layout} 
              innerFwCoord={fwCoord} 
              fwParam={fwParam} 
              showAsDialog={true}
              dataManaged={true}
              initData={resultData}
              onRef={(ref)=>this.onRef(ref)}
              treeData={toSelectTreeData}
            />
          </Modal>
        this.view.setState({dialogs : newDialogs});
      } else {
          message.error('加载数据错误', 10);
      }
    }});
  };
  if (this.innerLayout && this.innerLayout[actionId]) {
    layoutCallback(this.innerLayout[actionId]);
  } else {
    this.view.props.loadLayout({fwCoord, fwParam, callback:layoutCallback});
  }
}


export function handleOk(e) {
  const form = this.dialog.state.form;
  form.validateFieldsAndScroll((error, values) => {
    if (!error) {
      const {formData} = this.dialog.state;
      const {newData} = this.dialog.state.fwParam;
      Object.keys(formData).map(key=>newData[key] = formData[key].value);
      const fwParam = {...this.dialog.state.fwParam, newData};
      this.dialog.props.saveEditData({fwCoord:this.dialog.getFwCoord(), fwParam, callback: (result)=> {
        if (result.success) {
          if (!got.isEmpty(result.errorMsg)) {
            message.info(result.errorMsg, 10);
          } else {
            message.success('保存成功');
          }
          try {
          // 删除旧节点，加到新节点
          const {oldData, newData} = fwParam;

          const ID_FIELD = this.view.getLayout().argument.treeIdField;
          const PARENT_FIELD = this.view.getLayout().argument.treeParentIdField;

          const oldSelectedNode = this.view.findNode(newData[ID_FIELD]);
          if (oldSelectedNode) {
            Object.keys(newData).map(key=>oldSelectedNode[key] = newData[key]);
          }
          if (oldData[PARENT_FIELD] != newData[PARENT_FIELD]) {
            // parent changed
            // delete old, and add new
            const oldParentNode = this.view.findNode(oldData[PARENT_FIELD]);
            if (oldParentNode) {
              oldParentNode.children = oldParentNode.children.filter(node=>node[ID_FIELD] != oldData[ID_FIELD]);
              if (oldParentNode.children.length == 0) {
                oldParentNode.GOT_SUBCOUNT = 0;
              }
            }
            const newParentNode = this.view.findNode(newData[PARENT_FIELD]);
            if (newParentNode) {
              if (newParentNode.children) {
                newParentNode.children.push(oldSelectedNode);
              } else {
                if (newParentNode.GOT_SUBCOUNT) {
                  newParentNode.GOT_SUBCOUNT += 1;
                } else {
                  newParentNode.GOT_SUBCOUNT = 1;
                }
              }
            } 
          }
          this.view.setState({treeData:this.view.state.treeData});
          // this.view.getTreeData({});
          this.handleCancel(e);
        }catch(e) {
          console.error(e);
        }
        } else {
          if (result.validResultMap) {
            const se = {};
            Object.keys(result.validResultMap).map(key=> {se[key] = {value:values[key], errors:[new Error(result.validResultMap[key])]}});
            form.setFields(se);
          }
          if (!got.isEmpty(result.errorMsg)) {
              message.error(result.errorMsg, 10);
          }
        }
      }});
    } else {
      console.info('edit error', error);
    }
  });
}

export function handleCancel(e) {
  // console.info('fwParam', this.dialog.props.fwParam);
  const ds = this.view.state.dialogs;
  delete ds[this.id];
  this.view.setState({dialogs: ds});
}