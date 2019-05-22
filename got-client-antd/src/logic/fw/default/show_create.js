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
  
  const fwCoord = {...this.view.getFwCoord(), view:'create'};
  this.useSelectedData = false;
  if (this.action.argument) {
    this.useSelectedData = this.action.argument.useSelectedData;
    if (this.action.argument.function) {
      fwCoord['function'] = this.action.argument.function;
    }
    if (this.action.argument.view) {
      fwCoord['view'] = this.action.argument.view;
    }
  }
console.info('this.useSelectedData', this.useSelectedData, this.record);
  const fwParam = {
    ...this.view.state.fwParam,
    openerActionId: actionId, 
    openerFunction: this.view.getFwCoord()['function'],
    openerView: this.view.getFwCoord().view,
    openerSelectedData:this.useSelectedData?this.record:null,
    selectedTreeNodeId:this.view.props.selectedTreeNodeId?this.view.props.selectedTreeNodeId:null, 
    treeConnectColumn:this.view.props.gridToTreeField?this.view.props.gridToTreeField:null,
    oldData:{},
    newData:{},
  };
  let UIPage = null;
  if (this.action.argument && this.action.argument.antdPath) {
    const antdPath = this.action.argument.antdPath;
    UIPage = require(`../../../page/${antdPath}`).default;
  } else {
    UIPage = require('../../../page/fw/create/create').default;
  }
  const layoutCallback = (layout)=> {
    if (!this.innerLayout) {
      this.innerLayout = {};
    }
    this.innerLayout[actionId] = layout;
    
    const clientNewData = {...this.view.state.clientNewDataTemplate};
    if (this.view.props.gridToTreeField) {
      clientNewData[this.view.props.gridToTreeField] = this.view.props.selectedTreeNodeId;
    }
    this.view.props.getCreateData({fwCoord, fwParam:{...fwParam, newData:clientNewData}, callback:(resultData)=>{
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
        confirmLoading={this.view.props.createLoading}
        cancelText="取消" onCancel={(e)=>this.handleCancel(e)}
        okText="保存" onOk={(e) => this.handleOk(e)}
        >
        <UIPage 
          selectedData={{}} 
          innerLayout={layout} 
          innerFwCoord={fwCoord}
          fwParam={fwParam} 
          dataManaged={true}
          initData={resultData}
          clientNewData={resultData} 
          showAsDialog={true} 
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
      const {newData} = this.dialog.state.fwParam;
      Object.keys(formData).map(key=>newData[key] = formData[key].value);
      if (this.dialog.processNewData) {
        this.dialog.processNewData(newData);
      }
      const fwParam = {...this.dialog.state.fwParam, 
        selectedTreeNodeId:this.view.props.selectedTreeNodeId?this.view.props.selectedTreeNodeId:null, 
        treeConnectColumn:this.view.props.gridToTreeField?this.view.props.gridToTreeField:null, 
        openerActionId: this.action.id, 
        openerFunction: this.view.getFwCoord()['function'],
        openerView: this.view.getFwCoord().view,
        openerSelectedData:this.useSelectedData?this.record:null,
        oldData:{}, 
        newData
      };
      this.dialog.props.saveCreateData({fwCoord:this.dialog.getFwCoord(), fwParam, callback: (result)=> {
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
      console.info('create error', error);
    }
  });
}

export function handleCancel(e) {
  // console.info('fwParam', this.dialog.props.fwParam);
  const ds = this.view.state.dialogs;
  delete ds[this.id];
  this.view.setState({dialogs: ds});
}