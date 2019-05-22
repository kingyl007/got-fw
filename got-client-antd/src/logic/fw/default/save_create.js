import {Modal, Divider, Icon, message} from 'antd';
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
  const form = this.view.state.form;
  const {formData} = this.view.state;
  form.validateFieldsAndScroll((error, values) => {
    if (!error) {
      if (this.view.doOtherInputValidate) {
        const otherErrors = this.view.doOtherInputValidate();
        if (otherErrors) {
          if (Array.isArray(otherErrors)) {
            const otherErrorFields = {};
            Object.keys(otherErrors).map(key=>{
              const beforeValue = formData[key];
              otherErrorFields[key] = {...beforeValue, errors:[new Error(otherErrors[key])]};
            });
            form.setFields(otherErrorFields);
          } else {
            message.error(otherErrors);
          }
          return;
        }
      }
      const {newData} = this.view.state.fwParam;
      Object.keys(formData).map(key=>newData[key] = formData[key].value);
      const fwParam = {...this.view.state.fwParam, oldData:{}, newData};
      console.info('final formData:', JSON.stringify(formData));
      this.view.props.saveCreateData({fwCoord:this.view.getFwCoord(), fwParam, callback:(result)=> {
        if (result.success) {
          if (!got.isEmpty(result.errorMsg)) {
            message.info(result.errorMsg, 10);
          } else {
            message.success('保存成功');
          }
          this.view.refresh();
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


export function handleOk(e) {
}

export function handleCancel(e) {
}