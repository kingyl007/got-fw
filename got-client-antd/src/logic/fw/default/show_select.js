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
  const coord = {...this.view.getFwCoord(), 
    'function' : this.action.argument.selectFunction, 
    view : this.action.argument.selectView? this.action.argument.selectView:actionId};
  const fwParam = {openerFunction:this.view.getFwCoord()['function'], 
    openerView:this.view.getFwCoord()['view'],
    openerActionId:actionId,
    openerSelectedData:record,
    showAsDialog:1
  };
  console.info('fwParam', fwParam);
  const layoutCallback = (layout)=> {
    if (!this.innerLayout) {
      this.innerLayout = {};
    }
    this.innerLayout[actionId] = layout;
    const newDialogs = this.view.state.dialogs;
  let UIPage = null;
  console.info('this.action', this.action);
  if (this.action.argument && this.action.argument.antdPath) {
    const antdPath = this.action.argument.antdPath;
    UIPage = require(`../../../page/${antdPath}`).default;
  } else {
    UIPage = require(`../../../page/fw/grid/grid`).default;
  }
    newDialogs[this.id] = 
      <Modal
        width="42vw"
        key={this.id}
        title={layout.title}
        visible={true}
        maskClosable={false}
        confirmLoading={this.view.props.selectLoading}
        cancelText="取消" onCancel={(e)=>this.handleCancel(e)}
        okText="保存" onOk={(e) => this.handleOk(e)}
        >
        <UIPage 
          fwParam={fwParam}
          innerLayout={layout} 
          innerFwCoord={coord} 
          showAsDialog={true} 
          buttonSize="small" 
          tableSize="small"
          showSelectCol="checkbox"
          onRef={(ref)=>this.onRef(ref)}
        />
      </Modal>;
    this.view.setState({dialogs : newDialogs});
  };
  if (this.innerLayout && this.innerLayout[actionId]) {
    layoutCallback(this.innerLayout[actionId]);
  } else {
    this.view.props.loadLayout({fwCoord:coord, fwParam, callback:layoutCallback});
  }
}


export function handleOk(e) {
}

export function handleCancel(e) {
  // console.info('fwParam', this.dialog.props.fwParam);
  const ds = this.view.state.dialogs;
  delete ds[this.id];
  this.view.setState({dialogs: ds});
}