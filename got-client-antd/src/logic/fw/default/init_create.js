import {Modal, Divider, Icon} from 'antd';
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
  this.view.state.fwParam = {...this.view.state.fwParam, oldData:{...this.view.props.selectedData}, newData:{...this.view.props.selectedData}};
  this.view.props.getCreateData({fwCoord:this.view.getFwCoord(), fwParam:{selectedData:{...this.view.props.selectedData}}, callback:(data)=> {
    const formData = {};
    Object.keys(data).map(key=>formData[key]={value:data[key]});
    this.view.setState({fwParam:{...this.view.state.fwParam, oldData:{}, newData:{...data}}, formData, manualValues:{}});
    if (this.view.afterSetCreateData) {
      this.view.afterSetCreateData();
    }
  }});
}


export function handleOk(e) {
  const form = this.dialog.state.form;
  form.validateFieldsAndScroll((error, values) => {
    if (!error) {
      console.info('values', values, this.dialog.props.fwParam.oldData);
      this.dialog.props.saveEditData({fwCoord:this.dialog.getFwCoord(), fwParam:{...this.dialog.state.fwParam}, callback:(result)=> {
        if (result.success) {
          if (!got.isEmpty(result.errorMsg)) {
            message.info(result.errorMsg, 10);
          } else {
            message.success('保存成功');
          }
          this.dialog.getGridData({});
          this.handleCancel(e);
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
      console.info('error', error);
    }
  });
}

export function handleCancel(e) {
  //console.info('fwParam');
  //console.info(this.dialog.props.fwParam);
  const ds = this.dialog.state.dialogs;
  delete ds[this.id];
  this.dialog.setState({dialogs: ds});
}