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
  /*
  const coord = {...this.view.getFwCoord(), view:'edit'};
  const layoutCallback = (layout)=> {
      console.info('this');
      console.info(this);
      this.innerLayout = layout;
      const newDialogs = this.view.state.dialogs;
      newDialogs[this.id] = 
      <Modal
          key={this.id}
          title={this.action.label}
          visible={true} 
          cancelText="取消" onCancel={(e)=>this.handleCancel(e)}
          okText="保存" onOk={(e) => this.handleOk(e)}
          >
          <Edit selectedData={record} innerLayout={layout} innerFwCoord={coord} showAsDialog={true}
            onRef={(ref)=>this.onRef(ref)}/>
      </Modal>;
      this.view.setState({dialogs : newDialogs});
  };
  if (this.innerLayout) {
      layoutCallback(this.innerLayout);
  } else {
      this.view.props.loadLayout({fwCoord:coord, callback:layoutCallback});
  }
  */
}

/**
 * 对于对话框操作，对话框按下确定时的操作
 * @param {*} e 原始事件
 */
export function handleOk(e) {
  /*
  const form = this.dialog.state.form;
  form.validateFieldsAndScroll((error, values) => {
    if (!error) {
      console.info('values');
      console.info(values);
      console.info(this.dialog.props.fwParam.oldData);
      this.dialog.props.saveEditData({fwCoord:this.dialog.getFwCoord(), fwParam:{...this.dialog.state.fwParam}, callback:(result)=> {
        if (result.success) {
          if (!got.isEmpty(result.errorMsg)) {
            message.info(result.errorMsg, 10);
          } else {
            message.success('保存成功');
          }
          this.view.getGridData({});
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
      console.info('error');
      console.info(error);
    }
  });
  */
}

/**
 * 对于对话框操作，对话框按下取消时的操作
 * @param {*} e 原始事件
 */
export function handleCancel(e) {
  const ds = this.view.state.dialogs;
  delete ds[this.id];
  this.view.setState({dialogs: ds});
}