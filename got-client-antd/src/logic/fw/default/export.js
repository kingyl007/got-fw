import {Modal, Divider, Icon, message} from 'antd';
import * as got from '../../got';
import {getSimulateUserId} from '../../../util/request'

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
  // if (!this.record) {
  //   message.error("请选择要编辑的数据", 5);
  //   return;
  // }

  const {columnMap} = this.view.getLayout();
  const {queryColumnValues} = this.view.state;
  const conditions = Object.keys(queryColumnValues).map(key=> {
    if (queryColumnValues[key]) {
      const col = columnMap[key];
      if (col) {
        if (col.dictionary) {
          return {field:col.id, operator:'=', value1:queryColumnValues[key]};
        } else if (col.type == 'DATE' || col.type == 'DATETIME') {
          if (queryColumnValues[key][0] && queryColumnValues[key][1]) {
            return {field:col.id, operator:'BETWEEN', value1:queryColumnValues[key][0], value2:queryColumnValues[key][1]}
          } else {
            return;
          }
        }
      }
      return {field:key, operator:'LIKE', value1:queryColumnValues[key]};
    }
  }).filter(c=>c);
  const fwCoord = {...this.view.getFwCoord()};

  const fwParam = {
    ...this.view.state.fwParam,
    conditions,
    openerActionId: actionId, 
    openerFunction: this.view.getFwCoord()['function'],
    openerView: this.view.getFwCoord().view,
    selectedData:this.record?this.record:null,

    oldData:{},
    newData:{DATA_RANGE:0, FILE_TYPE:'xls'},
    selectedTreeNodeId:this.view.props.selectedTreeNodeId?this.view.props.selectedTreeNodeId:null, 
    treeConnectColumn:this.view.props.gridToTreeField?this.view.props.gridToTreeField:null, 
  };
  const formInputs = objectToFormInputs({...this.view.state.otherParams, fwCoord, fwParam}, null,null);
  // 模拟登录
  formInputs.su = getSimulateUserId(location.search);
  let formElement = document.createElement('form'); 
  formElement.style.display = "display:none;"; 
  formElement.method = 'post'; 
  formElement.action = `/fw/export`; 
  formElement.target = '_blank'; 
  Object.keys(formInputs).map(key=> {
    let inputElement = document.createElement('input'); 
    inputElement.type = 'hidden'; 
    inputElement.name = key; 
    inputElement.value = formInputs[key]; 
    formElement.appendChild(inputElement); 
  });

  document.body.appendChild(formElement); 
  formElement.submit(); 
  document.body.removeChild(formElement);
}

function objectToFormInputs (obj, form, namespace) {
  const fd = form || {};
  let formKey;
  if (Array.isArray(obj)) {
    obj.map((ae, index)=> objectToFormInputs(ae, fd, (namespace?namespace:'') + '[' + index + ']'));
  } else {
  for(var property in obj) {
      if(obj.hasOwnProperty(property)) {
        let key = Array.isArray(obj) ? '[]' : `[${property}]`;
        if(namespace) {
          formKey = namespace + key;
        } else {
          formKey = property;
        }
      
        // if the property is an object, but not a File, use recursivity.
        if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
          objectToFormInputs(obj[property], fd, formKey);
        } else {
          // if it's a string or a File object
          fd[formKey] = new String(obj[property]);//.replace(/%/g, "%25").replace(/\&/g, "%26").replace(/\+/g, "%2B").replace(/\=/g, "%3D");
        }
        
      }
    }
  }
  return fd;
};

export function handleOk(e) {
  const form = this.dialog.state.form;
  form.validateFieldsAndScroll((error, values) => {
    if (!error) {
      const fwParam = {...this.dialog.state.fwParam};
      
      this.dialog.props.saveEditData({fwCoord:this.dialog.getFwCoord(), fwParam, callback: (result)=> {
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