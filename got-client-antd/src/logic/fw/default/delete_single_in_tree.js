import {Popconfirm, Icon, Divider,message,Modal } from 'antd';
import * as got from '../../got';

const confirm = Modal.confirm;
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
  return (
  <Popconfirm key={this.action.fw_index} 
    title="确认要删除吗?" 
    visible={!!this.view.state.deleteConfirmVisible && this.view.state.deleteConfirmVisible[recordIndex]}
    onVisibleChange={(visible)=> {
      const deleteConfirmVisible = {...this.view.state.deleteConfirmVisible};
      deleteConfirmVisible[recordIndex] = visible;
      if (!visible) {
        this.view.setState({deleteConfirmVisible});
        return;
      }
      this.view.props.validDeleteData({fwCoord:this.view.getFwCoord(), fwParam:{...this.view.state.fwParam, newListData:[record]}, callback:(result)=> {
        if (result.success) {
          this.view.setState({deleteConfirmVisible});
        } else {
          if (!got.isEmpty(result.errorMsg)) {
            message.error(result.errorMsg, 10);
          }
        }
      }});
    }}
    onConfirm={(event) => this.logic(view, actionId, record, recordIndex, event)}
  >
    <a href="javascript:;"><Icon type={this.action.icon} />{this.action.label} </a>
  </Popconfirm>
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
    message.info('请选择要删除的节点', 5);
    return;
  } 
  
  if (!this.record.GOT_PID) {
    message.info(this.action.argument && this.action.argument.canNotDeleteRootPrompt?this.action.argument.canNotDeleteRootPrompt:'不能删除根节点', 10);
    return;
  }
  let firstCheck = true;

  this.record = {...this.record, children:null};
  const fwParam = {...this.view.state.fwParam, newListData:[this.record]};
  const realCall = ()=>{
    this.view.props.deleteData({fwCoord:this.view.getFwCoord(), fwParam, callback: (result)=> {
      if (result.success) {
        if (!got.isEmpty(result.errorMsg)) {
          message.info(result.errorMsg, 10);
        } else {
          message.success('删除成功');
        }
        try {
          const ID_FIELD = this.view.getLayout().argument.treeIdField;
          const PARENT_FIELD = this.view.getLayout().argument.treeParentIdField;
          
          const oldParentNode = this.view.findNode(this.record.GOT_PID);
          if (oldParentNode) {
            oldParentNode.children = oldParentNode.children.filter(node=>node[ID_FIELD] != this.record[ID_FIELD]);
            if (oldParentNode.children.length == 0) {
              oldParentNode.GOT_SUBCOUNT = 0;
            }
          }
          this.view.onTreeNodeSelected([this.record.GOT_PID], {selected:true, node:oldParentNode});
          this.view.setState({treeData:this.view.state.treeData});
        } catch (e) {
          console.error(e);
        }
        // this.handleCancel(e);
      } else {
        if (!got.isEmpty(result.errorMsg)) {
          message.error(result.errorMsg, 10);
        }
      }
    }});
  }
  if (firstCheck) {
    this.view.props.validDeleteData({fwCoord:this.view.getFwCoord(), fwParam, callback:(result)=> {
      if (result.success) {
        confirm({
          title: '确认要删除'+this.record[this.view.getLayout().argument.treeLabelField]+'吗?',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            realCall();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      } else {
        if (!got.isEmpty(result.errorMsg)) {
          message.error(result.errorMsg, 10);
        }
      }
    }});
  } else {
    realCall();
  }
}