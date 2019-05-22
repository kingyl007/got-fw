import {Modal, Divider, message} from 'antd';
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
  
  const ID_FIELD = this.view.getLayout().argument.treeIdField;
  const PARENT_FIELD = this.view.getLayout().argument.treeParentIdField;
  if (!this.record) {
    let selectedKey = null;
    if (this.view.state.selectedKeys && this.view.state.selectedKeys.length > 0) {
      selectedKey = this.view.state.selectedKeys[0];
    }
    let selectedNode = null;
    if (selectedKey) {
      selectedNode = this.view.findNode(selectedKey);
    }
    this.record = selectedNode;
  }
  if (this.record == null) {
    // message.info('请选择上级节点', 5);
    // return;
  } else if (!view.getLayout().argument.treeCanAddRoot) {
    // message.info('不能添加顶级节点',5);
    // return;
  }
  this.record = {...this.record, children:null};
  const fwCoord = {...this.view.getFwCoord(), view:'create'};
  if (this.view.getLayout().argument) {
    if (this.view.getLayout().argument.treeFunction) {
      fwCoord['function'] = this.view.getLayout().argument.treeFunction;
    }
  }
  const fwParam = {
    openerActionId: actionId, 
    openerFunction: this.view.getFwCoord()['function'],
    openerView: this.view.getFwCoord().view,
    oldData:{},
    newData:{},
    selectedTreeNodeId: this.record?this.record[ID_FIELD]:null, 
  };
  let UIPage = null;
  console.info('this.action', this.action);
  if (this.action.argument && this.action.argument.antdPath) {
    const antdPath = this.action.argument.antdPath;
    UIPage = require(`../../../page/${antdPath}`).default;
  } else {
    UIPage = require('../../../page/fw/create/create').default;
  }
  const layoutCallback = (layout)=> {
    // ==============zd4s业务要求=======================
    // 2.若当前未选中任何节点，则上级部门选择框禁用，只输入部门名称可提交；否则， 上级部门默认为当前所选，点击弹出下拉树同此处树结构，点击可选中任意部门作为 上级部门
    layout.columns.filter(col=>col.id == PARENT_FIELD).map(col=>col.editable=(this.record != null))
    // ================================================
    this.innerLayout = layout;
    const newDialogs = this.view.state.dialogs;
    const clientNewData = {};
    console.info('selectedNode',this.record);
    clientNewData[PARENT_FIELD] = (this.record?this.record[ID_FIELD]:this.view.state.treeData[0][ID_FIELD]);
    const visibleColumns = layout.columns.filter(col=>col.visible);
    const width = (visibleColumns.length>=5 || visibleColumns.some(col=>col.ui == 'MAP'))?'42vw':'25vw';
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
          clientNewData={clientNewData} 
          showAsDialog={true}
          onRef={(ref)=>this.onRef(ref)} 
          treeData={this.view.state.treeData}
        />
      </Modal>;
    this.view.setState({dialogs : newDialogs});
  };
  if (this.innerLayout) {
    layoutCallback(this.innerLayout);
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
      const fwParam = {...this.dialog.state.fwParam, newData, selectedData: this.record};
      this.dialog.props.saveCreateData({fwCoord:this.dialog.getFwCoord(), fwParam, callback: (result)=> {
        if (result.success) {
          if (!got.isEmpty(result.errorMsg)) {
            message.info(result.errorMsg, 10);
          } else {
            message.success('保存成功');
          }
          const {resultData} = result;
          const parentId = resultData[this.view.getLayout().argument.treeParentIdField];
          resultData.GOT_PID = parentId;
          const treeData = this.view.state.treeData;
          if (parentId) {
            const parentNode = this.view.findNode(parentId);
            console.info('parentNode', parentNode);
            if (parentNode) {
              if (parentNode.children) {
                parentNode.children.push(resultData);
              } else {
                if (parentNode.GOT_SUBCOUNT) {
                  parentNode.GOT_SUBCOUNT += 1;
                } else {
                  parentNode.GOT_SUBCOUNT = 1;
                }
              }
            } 
          } else {
            treeData.push(resultData);
          }
          this.view.setState({treeData});
          // this.view.getTreeData({});
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