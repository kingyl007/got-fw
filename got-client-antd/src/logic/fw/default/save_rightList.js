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
 * @param {function({success:boolean, errorMsg:string})} callback 接管callback
 */
export function logic(view, actionId, record, recordIndex, event, callback) {
  console.info('saverightlist', view);
  this.view = view;
  this.action = view.getLayout().actionArgs[actionId];
  this.record = record;
  this.recordIndex = recordIndex;
  this.event = event;
  const layout = view.getLayout();
  const roleIdKey = layout.ROLE_ID_KEY;
  const roleId = layout[roleIdKey];
  const fwParam = {...this.view.state.fwParam, openerSelectedData:this.view.props.openerSelectedData};
  
  fwParam.newData = {};
  fwParam.newData[roleIdKey] = roleId;
  fwParam.newListData = [];
  const newDataMap = {};
  const toModifyMap = {}; // 要更新的资源，在保存成功后，更新本地状态
  fwParam.newListData.push(newDataMap);

  const selectedResource = view.state.selectedResource;
  console.info('selectedResource',selectedResource);
  if (selectedResource != null) {
    const passNodes = (nodes) => {
      if (nodes) {
        nodes.map(node=> {
          if (node.HAVE_PRIVILEGE == undefined 
            || node.HAVE_PRIVILEGE == null
            || (node.HAVE_PRIVILEGE == '1' && !selectedResource[node.PKEY]) 
            || (node.HAVE_PRIVILEGE != '1' && selectedResource[node.PKEY])) {
            toModifyMap[node.PKEY] = node;
            newDataMap[node.PKEY] = {HAVE_PRIVILEGE: selectedResource[node.PKEY]?'1':'0', 
            DATA_LEVEL:view.getDataLevel(node)?Object.keys(view.getDataLevel(node)).filter(key=>view.getDataLevel(node)[key]=='1').join(','):''};
          }
          passNodes(node.nodes);
        });
      }
    }
    passNodes(view.getLayout().gotResource);
  } else {
    Object.values(view.state.changedResource).map(res=> newDataMap[res.PKEY] = {HAVE_PRIVILEGE:view.isResourceChecked(res), 
      DATA_LEVEL:view.getDataLevel(res)?Object.keys(view.getDataLevel(res)).filter(key=>view.getDataLevel(res)[key]=='1').join(','):''});
  }
  const realCallback = (result)=> {
    if (result.success) {
      Object.keys(newDataMap).map(key=> toModifyMap[key].HAVE_PRIVILEGE = newDataMap[key].HAVE_PRIVILEGE);
    }
    if (callback) {
      callback(result);
    } else {
      if (result.success) {
        if (!got.isEmpty(result.errorMsg)) {
          message.info(result.errorMsg, 10);
        } else {
          message.success('保存成功');
        }
      // this.view.getGridData({});
      // this.handleCancel(e);
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
    }
  };
  this.view.props.saveSelectData({fwCoord:this.view.getFwCoord(), fwParam, callback:realCallback});
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
  // console.info('fwParam', this.dialog.props.fwParam);
  const ds = this.dialog.state.dialogs;
  delete ds[this.id];
  this.dialog.setState({dialogs: ds});
}