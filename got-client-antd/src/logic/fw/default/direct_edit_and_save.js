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
  
  if (this.action.argument) {
    // <!-- showByColumn:根据某一列的值显示，showValue:对应要显示按钮的值，showByEmpty:值为空时是否显示， 
    // setValue:操作后要设置的值， showInColumn:将按钮直接显示在对应的列里 ，showConfirm:是否显示确认修改对话框，默认显示-->
    const {showByColumn, setValue, showConfirm, message:confirmMsg} = this.action.argument;
    if (showByColumn && setValue != undefined && setValue != null) {
      const fwParam = {
        openerActionId:actionId,
        oldData:{...record}, 
        newData:{...record}
      };
      if (fwParam.newData == setValue) {
        message.info('状态未变化');
      } else {
        fwParam.newData[showByColumn] = setValue;
        const realCall = () => {
          this.view.props.saveEditData({fwCoord:this.view.getFwCoord(), fwParam, callback:(result)=> {
            if (result.success) {
              if (!got.isEmpty(result.errorMsg)) {
              message.info(result.errorMsg, 10);
              } else {
                message.success('保存成功');
              }
              console.info('this',this);
              this.view.refresh();
              if (event.fwSourceAction) {
                event.fwSourceAction.handleCancel(3);
              } else {
                this.handleCancel(e);
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
        };
        if (showConfirm == undefined || showConfirm == null || showConfirm == '1') {
          const col = this.view.getLayout().columnMap[showByColumn];
          Modal.confirm({
            title: '确认',
            content: confirmMsg?confirmMsg:`确认要将${this.view.getLayout().keyword}设置为${this.action.label}吗？`,
            onOk() {
              realCall();
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        } else {
          realCall();
        }
      }
    }
  }
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
  // console.info('direct edit and save fwParam', this.dialog.props.fwParam);
  const ds = this.dialog.state.dialogs;
  delete ds[this.id];
  this.dialog.setState({dialogs: ds});
}

export function isValid(view, actionId, record) {
  this.view = view;
  this.action = view.getLayout().actionArgs[actionId];
  this.record = record;
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
}