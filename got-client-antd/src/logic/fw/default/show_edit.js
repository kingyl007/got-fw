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

  if (record == null) {
    if (this.view.state.selectedRowKeys && this.view.state.selectedRowKeys.length > 0) {
      const firstIndex = this.view.state.selectedRowKeys[0];
      this.record = this.view.state.data[firstIndex];
      this.recordIndex = firstIndex;
    }
  }
  if (!this.record && 
    (this.action.argument == null ||
       this.action.argument.needSelectData == undefined ||
        this.action.argument.needSelectData == null || 
        this.action.argument.needSelectData == '1')) {
    message.error("请选择要编辑的数据", 5);
    return;
  }

  const fwCoord = {...this.view.getFwCoord(), view:'edit'};
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
    this.view.props.getEditData({fwCoord, fwParam:{...fwParam, selectedData:this.record}, callback:(resultData)=>{
      if (!resultData) {
        resultData = {};
      }
      if (resultData) {
        // 根据数据的不同，动态调整界面样式
        const dynamicLayout = resultData['_FW_DYNAMIC_LAYOUT'];
        delete resultData['_FW_DYNAMIC_LAYOUT'];
        if (dynamicLayout) {
          if (dynamicLayout.columns) {
            dynamicLayout.columns.map(col=> {
              const currentCol = layout.columnMap[col.id];
              if (currentCol) {
                Object.keys(col).map(key=> currentCol[key] = col[key]);
              }
            })
          }
        }
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
          okText={(this.action.argument && this.action.argument.okLabel)?this.action.argument.okLabel:"保存"} onOk={(e) => this.handleOk(e)}
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
  const {formData} = this.dialog.state;
  form.validateFieldsAndScroll((error, values) => {
    if (!error) {
      if (this.dialog.doOtherInputValidate) {
        const otherErrors = this.dialog.doOtherInputValidate();
        if (otherErrors) {
          if (typeof otherErrors == 'object') {
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
      let newData = {};
      // if (this.dialog.getEditedNewData) {
      //   newData = this.dialog.getEditedNewData();
      // } else {
        newData = this.dialog.state.fwParam.newData;
        Object.keys(formData).map(key=>newData[key] = formData[key].value);
        if (this.dialog.processNewData) {
          this.dialog.processNewData(newData);
        }
      // }
      const fwParam = {...this.dialog.state.fwParam, newData};
      this.dialog.props.saveEditData({fwCoord:this.dialog.getFwCoord(), fwParam, callback: (result)=> {
        
        // 每个画面有机会进行自己的返回值处理
        if (this.dialog.processEditSaveResult) {
          this.dialog.processEditSaveResult(result);   
         }
        if (result.success) {
          if (!got.isEmpty(result.errorMsg)) {
            message.info(result.errorMsg, 10);
          } else {
            message.success('保存成功');
          }
          this.view.getGridData({});
          this.handleCancel(e);
          if (this.event.fwSourceAction && this.event.fwSourceAction.handleCancel) {
            this.event.fwSourceAction.handleCancel(3);
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