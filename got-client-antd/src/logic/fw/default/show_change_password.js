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
  console.info('layout executed', this);
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
  
  // if (record == null) {
  //   if (this.view.state.selectedRowKeys && this.view.state.selectedRowKeys.length > 0) {
  //     const firstIndex = this.view.state.selectedRowKeys[0];
  //     this.record = this.view.state.data[firstIndex];
  //     this.recordIndex = firstIndex;
  //   }
  // }
  // if (!this.record && 
  //   (this.action.argument == null ||
  //      this.action.argument.needSelectData == undefined ||
  //       this.action.argument.needSelectData == null || 
  //       this.action.argument.needSelectData == '1')) {
  //   message.error("请选择要编辑的数据", 5);
  //   return;
  // }

  const fwCoord = {...this.view.getFwCoord(), view:'create'};
  if (this.action.argument) {
    if (this.action.argument.function) {
      fwCoord['function'] = this.action.argument.function;
    }
    if (this.action.argument.view) {
      fwCoord['view'] = this.action.argument.view;
    }
  }
  const fwParam = {
    openerActionId: actionId, 
    openerFunction: this.view.getFwCoord()['function'],
    openerView: this.view.getFwCoord().view,
    oldData:{},
    newData:{},
  };
  let UIPage = null;
  console.info('this.action', this.action);
  if (this.action.argument && this.action.argument.antdPath) {
    const antdPath = this.action.argument.antdPath;
    UIPage = require(`../../../page/${antdPath}`).default;
  } else {
    UIPage = require('../../../page/fw/edit/edit').default;
  }
  const layoutCallback = (layout)=> {
    if (!this.innerLayout) {
      this.innerLayout = {};
    }
    this.innerLayout[actionId] = layout;
    const newDialogs = this.view.state.dialogs;
    const visibleColumns = layout.columns.filter(col=>col.visible);
    const width = visibleColumns.length<5?'25vw':'42vw';
    newDialogs[this.id] = 
      <Modal
      width={width}
      key={this.id}
      title={layout.title}
      visible={true}
      maskClosable={false}
      cancelText="取消" onCancel={(e)=>this.handleCancel(e)}
      okText="提交" onOk={(e) => this.handleOk(e)}
      >
        <UIPage 
        selectedData={this.record} 
        innerLayout={layout} 
        innerFwCoord={fwCoord} 
        fwParam={fwParam} 
        showAsDialog={true}
        onRef={(ref)=>this.onRef(ref)}
        dataManaged={true}
        initData={{}}
        />
      </Modal>
    this.view.setState({dialogs : newDialogs});
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
      if (!newData.NEW_PASSWORD || newData.NEW_PASSWORD.length < 6) {
        message.error('新密码至少输入6位');
        return;
      }
      if (newData.NEW_PASSWORD != newData.NEW_PASSWORD2) {
        message.error('两次输入的密码不一致');
        return;
      }
      const fwParam = {...this.dialog.state.fwParam, newData};
      this.view.props.changePassword({fwCoord:this.view.getFwCoord(), otherParams:{...newData}, callback: (result)=> {
        if (result.success) {
          if (!got.isEmpty(result.errorMsg)) {
            message.info(result.errorMsg, 10);
          } else {
            message.success('修改成功');
          }
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
      console.info('change password error', error);
    }
  });
}

export function handleCancel(e) {
  // console.info('fwParam', this.dialog.props.fwParam);
  const ds = this.view.state.dialogs;
  delete ds[this.id];
  this.view.setState({dialogs: ds});
}