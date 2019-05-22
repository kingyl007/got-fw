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
  let firstCheck = false;
  if (record == null) {
    if (this.view.state.selectedRowKeys && this.view.state.selectedRowKeys.length > 0) {
      const firstIndex = this.view.state.selectedRowKeys[0];
      this.record = this.view.state.data[firstIndex];
      this.recordIndex = firstIndex;
      firstCheck = true;
    }
  } else {
    this.record = record;
    this.recordIndex = recordIndex;
  }
  if (!this.record) {
    message.error("请选择要删除的数据", 5);
    return;
  }
  this.event = event;
  const fwParam = {...this.view.state.fwParam, newListData:[this.record]};
  const realCall = ()=>{
    this.view.props.deleteData({fwCoord:this.view.getFwCoord(), fwParam, callback:(result)=> {
      if (result.success) {
        if (!got.isEmpty(result.errorMsg)) {
          message.info(result.errorMsg, 10);
        } else {
          message.success('删除成功');
        }
        this.view.getGridData({});
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
          title: '确认要删除吗?',
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