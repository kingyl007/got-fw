import { connect} from 'dva';
import { Component } from 'react';
import { message, Form, Input,Row, Col, Button, InputNumber,DatePicker,Checkbox,Select,Spin,TimePicker, TreeSelect ,Tree,Radio, Upload, Icon, Layout,Cascader,Card,AutoComplete, Tooltip  } from 'antd';
import request from '../../../util/request';

import * as got from '../../../logic/got';
import * as ButtonArea from '../../../component/fw/buttonArea';
import { Map } from '../../../component/fw/map';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { TreeNode } = Tree;
const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

// formItem css 样式
const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  }
}

function mapStateToProps(state) {
  const {dispatch, fwCoord, layout} = state.fw;
  // const {fwParam} = state.create;
  return {
      loading: state.loading.models.create,
      dispatch, 
      fwCoord,
      layout,
      // fwParam,
  };
}

  const mapDispatchToProps = (dispatch) => {
    return {
      getCreateData: ({fwCoord, fwParam, callback}) => {
        dispatch({
            type: 'create/getCreateData',
            payload: {fwCoord, fwParam, callback},
        });
      },
      getRefData: ({fwCoord, fwParam, otherParams, callback}) => {
        dispatch({
            type: 'edit/getRefData',
            payload: {fwCoord, fwParam, otherParams, callback},
        });
      },
      getTreeData: ({fwCoord, fwParam, callback}) => {
        dispatch({
            type: 'tree/getTreeData',
            payload: {fwCoord, fwParam, callback},
        });
      },
      saveCreateData: ({fwCoord, fwParam, callback}) => {
        dispatch({
            type: 'create/saveCreateData',
            payload: {fwCoord, fwParam, callback},
        });
      },
    };
  };

  @connect(mapStateToProps, mapDispatchToProps)
export default class Create extends Component {
//======================= Page connected start ====================================

convertToCascadeData = (data, ref)=> {
  if (data) {
    return data.map(row=>{
      row.value = row[ref.value]; 
      row.label=row[ref.label]; 
      row.isLeaf=(!row.GOT_SUBCOUNT || row.GOT_SUBCOUNT<1); 
      if (row.children) {
        row.children = this.convertToCascadeData(row.children, ref);
      }
      return row
    });
  }
  return null;
}

loadCascaderData = (selectedOptions,col) => {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  const ref = col.valueRef;
  this.getTreeData({
    fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
    fwParam: {distinct:ref.distinct?ref.distinct:null, 
        queryColumns:ref.value+',' + ref.label + (ref.otherRefs?(',' + ref.otherRefs):'') + (ref.disableColumn?(',' + ref.disableColumn):''),
        selectedTreeNodeId:selectedOptions.map(o=>o[ref.value]).join(','), 
        selectedData:ref.useCurrentData?this.getEditedNewData():null
    },
    callback:(result)=>{
      targetOption.loading = false;
      targetOption.children = this.convertToCascadeData(result.data, ref);
      
      // colRefData.defaultOpen = true;
      this.setState({
        refData:this.state.refData
      });
    }});
}

  getTreeData = ({fwParam, fwCoord, callback}) => {
    const param = {...this.state.fwParam, openerSelectedData:{...this.props.openerSelectedData}, ...fwParam};
    this.props.getTreeData({
      fwParam:param, 
      fwCoord:{...this.getFwCoord(),...fwCoord},
      'callback':callback?callback:result=> {
        this.setState({
          treeData:result.data, 
          expandedKeys:result.data.map(node=>String(node[this.getLayout().argument.treeIdField]))
        });
      },
    });
  }
  
  renderTreeNodes = (data,valueRef) => !!data?data.map((item) => (
    <TreeNode title={item[valueRef.label]} 
      key={String(item[valueRef.value])}
      value={item[valueRef.value]}
      isLeaf={!item.GOT_SUBCOUNT || item.GOT_SUBCOUNT<1}
      dataRef={item} 
    >
      {this.renderTreeNodes(item.children, valueRef)}
    </TreeNode>
  )):null
  
  onTreeSelectLoadData = (treeNode, col, colRefData)=> new Promise((resolve) => {
    console.info('treeNode.props',treeNode);
    const realData = treeNode.props.dataRef;
    if (realData.children) {
      resolve();
      return;
    }
    console.info('realData', realData);
    this.getTreeData({
      fwCoord: {...this.getFwCoord(), 'function':col.valueRef.function, view:col.valueRef.view}, 
      fwParam: {distinct:col.valueRef.distinct?col.valueRef.distinct:null, 
          queryColumns:col.valueRef.value+',' + col.valueRef.label + (col.valueRef.otherRefs?(',' + col.valueRef.otherRefs):'') + (col.valueRef.disableColumn?(',' + col.valueRef.disableColumn):''),
          selectedTreeNodeId:treeNode.props.eventKey, 
          selectedData:col.valueRef.useCurrentData?this.getEditedNewData():null
      },
      callback:(result)=>{
        realData.children = result.data;
        colRefData.defaultOpen = true;
        console.info(colRefData.data);
        resolve();
        this.setState({
          refData:this.state.refData
        });
      }});
  })

  onCascaderChange = (col, value, selectedOptions)=> {
    console.info('onCascaderChange', col.id, value, selectedOptions);
    if (col.id == 'ADDRESS_SELECT') {
      const {fwParam, formData, manualValues } = this.state;
      if (!fwParam.newData) {
        fwParam.newData = {};
      }
      fwParam.newData[col.id] = value.join(',');
      if (!formData[col.id]) {
        formData[col.id] = {};
      }
      formData[col.id].value = value.join(',');
      manualValues[col.id] = value;
      this.setState({fwParam, manualValues, formData});
    }
  }

  onAutoCompleteSelect = (col, value, option) => {
    console.info('onAutoCompleteSelect', col.id, value, option);
  }

  onSelectChange = (col, value, option) => {
    console.info('onSelectChange', col.id, value, option);
  }

  onSelectSelect = (col, value, option) => {
    console.info('onSelectSelect', col.id, value, option);
  }


  MONEY_IDS = {
  }
  getInputComponent = (col, standalone)=> {
    const {components, refData, fwParam, formData} = this.state;
    // if (components[col.id]) {
    //   return components[col.id];
    // }
    let component = null;
    const commonProps = { disabled:!col.editable, style:{width: '85%'} };
    if (standalone) {
      commonProps.value = this.state.manualValues[col.id];
    }
    let inputPrompt = '';
    let selectPrompt = '';
    if (col.editable) {
      inputPrompt = col.prompt?col.prompt:'请输入';
      selectPrompt = col.prompt?col.prompt:'请选择';
    }
    if (col.ui == 'label') {
      component = this.getDisplayValue(col);
      // if (!component) {
      //   component = <span/>
      // }
    } else if (col.type === 'MEMO') {
      component = <TextArea {...commonProps} rows={4} />
    } else if (col.ui === 'checkbox01') {
      component = <Checkbox disabled={!col.editable}  />
    } else if (col.dictionary && this.getLayout().dictList[col.dictionary]) {
      const dic = this.getLayout().dictList[col.dictionary];
      if (col.ui == 'radio') {
        // {Object.keys(dic).map(key=> <Radio key={key} value={String(key)}>{dic[key]}</Radio>)}
        component =  <RadioGroup name={col.id} {...commonProps}>
          {dic.map(row=><Radio key={row.value} value={String(row.value)}>{row.label}</Radio>)}
        </RadioGroup>
      } else if (col.ui == 'checkbox') {
        // const options = Object.keys(dic).map(key=>({value:key, label:dic[key]}));
        const options = dic;
        component = <CheckboxGroup name={col.id} {...commonProps} options={options}>
        </CheckboxGroup>
      } else {
        // {Object.keys(dic).map(key=> <Option key={key} value={key}>{dic[key]}</Option>)}
      component = <Select 
        {...commonProps}
        placeholder={selectPrompt}
        showSearch
        mode={col.multiSelect?'multiple':null}
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {dic.map(row=><Option key={row.value} value={row.value}>{row.label}</Option>)}
      </Select>
      }
    } else if (col.ui === 'TreeSelect' && col.valueRef) {
      const ref = col.valueRef;
      // const {refData, fwParam} = this.state;
      if (!refData[col.id]) {
        // console.info(fwParam.newData);
        // const defaultRow = {};
        // defaultRow[ref.value] = fwParam.newData[col.id]?fwParam.newData[col.id]:0;
        // if (col.showColumn) {
        //   // TODO 如果showColumn用逗号分隔多个字段时，也需要拼接
        //   defaultRow[ref.label] = fwParam.newData[col.showColumn];
        // }
        let parentTreeData = null;
        if (ref.function == this.props.fwParam.openerFunction && ref.view == this.props.fwParam.openerView && this.props.treeData) {
          parentTreeData = this.props.treeData;
        }
        refData[col.id] = {loading:false, data:/*col.showColumn?[defaultRow]:*/parentTreeData, queryIndex:0, defaultOpen:false};
      }
      const colRefData = refData[col.id]; // this.state.colRefData;//
      if (!colRefData.data) {
        colRefData.data = [];
        this.props.getTreeData({
          fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
          fwParam: {distinct:ref.distinct?ref.distinct:null, 
            queryColumns:ref.value+',' + ref.label + (ref.otherRefs?(',' + ref.otherRefs):'') + (ref.disableColumn?(',' + ref.disableColumn):''),
            selectedId:fwParam&&fwParam.newData&&fwParam.newData[col.id]?fwParam.newData[col.id]:null,
          },
          callback: (result) => {
            if (result.success) {

              colRefData.data = result.data;
              // console.info('result.data', colRefData.data);
              colRefData.loading = false;
              refData[col.id] = colRefData;
              this.setState({refData});
            } else {
              colRefData.data = null;
            }
          }
        });
      }
      component = <TreeSelect
        {...commonProps}
        placeholder={selectPrompt}
        notFoundContent={colRefData.loading ? <Spin size="small" /> : '无数据'}
        showArrow={true}
        showSearch={true}
        searchPlaceholder='输入搜索'
        filterTreeNode={(inputValue, treeNode)=> {
          console.info('treeNode', treeNode);
          return treeNode.props.title.indexOf(inputValue)>=0;
        }}
        treeNodeFilterProp='title'
        filterOption={false}
        loadData={treeNode => this.onTreeSelectLoadData(treeNode, col, colRefData)}
        treeExpandedKeys={colRefData.expandedKeys?colRefData.expandedKeys:colRefData.data.map(node=>String(node[ref.value]))}
        onTreeExpand={(expandedKeys)=>{colRefData.expandedKeys=expandedKeys; colRefData.defaultOpen=true; this.setState({refData:this.state.refData})}}
        defaultOpen={colRefData.defaultOpen}
        onSearch1={(val)=>{
          if (colRefData.timeout) {
            clearTimeout(colRefData.timeout);
            colRefData.timeout = null;
          }
          colRefData.currentValue = val;
          var realProcess = ()=>{
            console.info(val);
            colRefData.loading = true;
            this.props.getRefData({
              fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
              fwParam: {queryStr:val, 
                distinct:ref.distinct?ref.distinct:null, 
                queryColumns:ref.value+',' + ref.label + (ref.otherRefs?(',' + ref.otherRefs):'') + (ref.disableColumn?(',' + ref.disableColumn):''),
              },
              callback: (result) => {
                if (colRefData.currentValue == val) {
                  // colRefData = {...colRefData, data:result.data.data, loading:false};
                  colRefData.data = result.data;
                  colRefData.loading = false;
                  colRefData.defaultOpen = true;
                  formData[col.id].value = val;
                  this.setState({refData, fwParam, formData});
                }
              }
            })
          }
          colRefData.timeout = setTimeout(realProcess, 500);
        }}
        onChange={(val)=>{console.info('onChange', val)}}
      >
      {this.renderTreeNodes(colRefData.data, ref)}
      </TreeSelect>
      
    } else if (col.ui == 'Cascader' && col.valueRef) {
      const ref = col.valueRef;
      if (!refData[col.id]) {
        const defaultRow = {};
        defaultRow[ref.value] = formData[col.id]?formData[col.id].value:0;
        if (col.showColumn && formData[col.showColumn]) {
          // TODO 如果showColumn用逗号分隔多个字段时，也需要拼接
          console.info('showcolumn', col.showColumn, formData);
          defaultRow[ref.label] = formData[col.showColumn].value;
        }
        refData[col.id] = {loading:false, data:null, queryIndex:0, defaultOpen:false};
        this.setState({refData});
      }
      const colRefData = refData[col.id]; // this.state.colRefData;//
      if (!colRefData.data) {
        colRefData.data = [];
        this.props.getTreeData({
          fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
          fwParam: {distinct:ref.distinct?ref.distinct:null, 
            queryColumns:ref.value+',' + ref.label + (ref.otherRefs?(',' + ref.otherRefs):'') + (ref.disableColumn?(',' + ref.disableColumn):''),
            selectedData:ref.useCurrentData?this.getEditedNewData():null
          },
          callback: (result) => {
            if (result.success) {
              colRefData.data = this.convertToCascadeData(result.data, ref); //.map(row=>{row.value = row[ref.value]; row.label=row[ref.label]; row.isLeaf=(!row.GOT_SUBCOUNT || row.GOT_SUBCOUNT<1); return row});
              colRefData.loading = false;
              refData[col.id] = colRefData;
              this.setState({refData});
            } else {
              colRefData.data = null;
            }
          }
        });
      }
      component = <Cascader 
        {...commonProps}
        placeholder={selectPrompt}
        options={colRefData.data}
        loadData={(selectedOptions)=>this.loadCascaderData(selectedOptions, col)}
        onChange={(value, selectedOptions)=>this.onCascaderChange(col, value, selectedOptions)}
        showSearch={{ filter:(inputValue, path) => {
            return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
          } 
        }}
      />
    } else if (col.ui == 'AutoComplete' && col.valueRef) {
      const ref = col.valueRef;
      // const {refData, fwParam} = this.state;
      if (!refData[col.id]) {
        // const defaultRow = {};
        // defaultRow[ref.value] = formData[col.id]?formData[col.id].value:0;
        // if (col.showColumn && formData[col.showColumn]) {
        //   // TODO 如果showColumn用逗号分隔多个字段时，也需要拼接
        //   console.info('showcolumn', col.showColumn, formData);
        //   defaultRow[ref.label] = formData[col.showColumn].value;
        // }
        refData[col.id] = {loading:false, data:null, queryIndex:0, defaultOpen:false};
        this.setState({refData});
      }
      const colRefData = refData[col.id]; // this.state.colRefData;//
      component = <AutoComplete
        {...commonProps}
        placeholder={inputPrompt}
        dataSource={colRefData.data}
        defaultOpen={colRefData.defaultOpen}
        onSelect={(value, option)=>this.onAutoCompleteSelect(col, value, option)}
        onSearch={(val)=> {
          if (colRefData.timeout) {
            clearTimeout(colRefData.timeout);
            colRefData.timeout = null;
          }
          colRefData.currentValue = val;
          var realProcess = ()=>{
            colRefData.loading = true;
            this.props.getRefData({
              fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
              fwParam: {...this.state.fwParam, 
                queryValue:val, 
                distinct:ref.distinct?ref.distinct:null, 
                queryColumns:ref.value+',' + ref.label + (ref.otherRefs?(',' + ref.otherRefs):'') + (ref.disableColumn?(',' + ref.disableColumn):''),
                selectedData:ref.useCurrentData?this.getEditedNewData():null
              },
              callback: (result) => {
                if (colRefData.currentValue == val) {
                  const dataMap = {};
                  if (result.success) {
                    result.data.map(row=>{dataMap[row[ref.label]] = row});
                  }
                  colRefData.dataMap = dataMap;
                  colRefData.data = Object.keys(dataMap);
                  colRefData.loading = false;
                  colRefData.defaultOpen = true;
                  colRefData.autoFocus = true;
                  // fwParam.newData[col.id] = val;
                  this.setState({refData, fwParam});
                }
              }
            //*/
            })
          };
          colRefData.timeout = setTimeout(realProcess, 900);
        }
        }
      />
    } else if (col.valueRef != null) {
      const ref = col.valueRef;
      // const {refData, fwParam} = this.state;
      if (!refData[col.id]) {
        const defaultRow = {};
        defaultRow[ref.value] = formData[col.id]?formData[col.id].value:0;
        if (col.showColumn && formData[col.showColumn]) {
          // TODO 如果showColumn用逗号分隔多个字段时，也需要拼接
          console.info('showcolumn', col.showColumn, formData);
          defaultRow[ref.label] = formData[col.showColumn].value;
        }
        refData[col.id] = {loading:false, data:null, queryIndex:0, defaultOpen:false};
        this.setState({refData});
      }
      const colRefData = refData[col.id]; // this.state.colRefData;//
      if (!colRefData.data) {
        colRefData.data = [];
        this.props.getRefData({
          fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
          fwParam: {distinct:ref.distinct?ref.distinct:null, 
            queryColumns:ref.value+',' + ref.label + (ref.otherRefs?(',' + ref.otherRefs):'') + (ref.disableColumn?(',' + ref.disableColumn):''),
            selectedData:ref.useCurrentData?this.getEditedNewData():null
          },
          callback: (result) => {
            let remoteData = []
            const dataMap = {};
            if (result.success) {
              remoteData = result.data;
              if (remoteData) {
                remoteData.map(row=>dataMap[row[ref.value]] = row);
              }
            }
            if (col.showColumn) {
              console.info('showColumn', formData[col.showColumn], formData[col.id]);
              
              const selectedLabels = formData[col.showColumn]&&formData[col.showColumn].value?formData[col.showColumn].value.split(','):[];
              const selectedValues = formData[col.id]&&formData[col.id]?String(formData[col.id].value).split(','):[];
              let defaultRow = null;
              if (selectedValues.length > 0 && selectedLabels.length == selectedValues.length) {
                for(var i = 0; i < selectedValues.length; ++i) {
                  if (remoteData.some(row=>row[ref.value] == selectedValues[i])) {
                    continue;
                  }
                  defaultRow = {};
                  defaultRow[ref.value] = selectedValues[i];
                  defaultRow[ref.label] = selectedLabels[i];
                  remoteData.push(defaultRow);
                }
              }
            }
            colRefData.data = remoteData;
            colRefData.dataMap = dataMap;
            colRefData.loading = false;
            refData[col.id] = colRefData;
            this.setState({refData, formData});
          }
        });
      }
      const items = colRefData.data.map(d => <Option key={d[ref.value]} disabled={ref.disableColumn&&d[ref.disableColumn] == ref.disableValue}>{d[ref.label]}{ref.otherRefs?ref.otherRefs.split(',').map(oc=>{'/' + d[oc]}):''}</Option>);
      component = <Select
        {...commonProps}
        placeholder={selectPrompt}
        showSearch
        mode={col.multiSelect?'multiple':null}
        notFoundContent={colRefData.loading ? <Spin size="small" /> : '无数据'}
        showArrow={true}
        filterOption={false}
        labelInValue={true}
        autoFocus={colRefData.autoFocus}
        defaultOpen={colRefData.defaultOpen}
        onSelect={(value, option)=>this.onSelectSelect(col, value, option)}
        onChange={(value, option)=>this.onSelectChange(col, value, option)}
        onSearch={(val)=>{
          if (colRefData.timeout) {
            clearTimeout(colRefData.timeout);
            colRefData.timeout = null;
          }
          colRefData.currentValue = val;
          var realProcess = ()=>{
            colRefData.loading = true;
            this.props.getRefData({
              fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
              fwParam: {queryValue:val, 
                distinct:ref.distinct?ref.distinct:null, 
                queryColumns:ref.value+',' + ref.label + (ref.otherRefs?(',' + ref.otherRefs):'') + (ref.disableColumn?(',' + ref.disableColumn):''),
                selectedData:ref.useCurrentData?this.getEditedNewData():null
              },
              callback: (result) => {
                if (colRefData.currentValue == val) {
                  let remoteData = []
                  const dataMap = {};
                  if (result.success) {
                    remoteData = result.data;
                    if (remoteData) {
                      remoteData.map(row=>dataMap[row[ref.value]] = row);
                    }
                  }
                  if (col.showColumn) {
                    const selectedLabels = formData[col.showColumn]&&formData[col.showColumn].value?formData[col.showColumn].value.split(','):[];
                    const selectedValues = formData[col.id]&&formData[col.id]?String(formData[col.id].value).split(','):[];
                    let defaultRow = null;
                    if (selectedValues.length > 0 && selectedLabels.length == selectedValues.length) {
                      for(var i = 0; i < selectedValues.length; ++i) {
                        if (remoteData.some(row=>row[ref.value] == selectedValues[i])) {
                          continue;
                        }
                        defaultRow = {};
                        defaultRow[ref.value] = selectedValues[i];
                        defaultRow[ref.label] = selectedLabels[i];
                        remoteData.push(defaultRow);
                      }
                    }
                  }

                  colRefData.data = remoteData;
                  colRefData.dataMap = dataMap;
                  colRefData.loading = false;
                  colRefData.defaultOpen = true;
                  colRefData.autoFocus = true;
                  // fwParam.newData[col.id] = val;
                  this.setState({refData});
                }
              }
            //*/
            })
          };
          colRefData.timeout = setTimeout(realProcess, 500);
          /*
          this.props.getRefData({fwCoord:{...this.state.fwCoord, 'function':ref.function, view:ref.view}, 
          fwParam: {queryStr:val, distinct:ref.distinct, queryColumns:ref.value+',' + ref.label + ',' + ref.otherRefs},
          callback: (data)=>{
            console.info(data);
            colRefData = {...colRefData, data:data.data.data, loading:false};
            refData[col.id] = colRefData;
            this.setState({refData});
          }
        });
 */
        }}
      >
      {items}
      </Select>
    } else if (col.ui === 'DatePicker') {
      let disableDate = ()=>false;
      disableDate = (current) => {
        var disabled = false;
        if (col.min) {
          if (current && current < this.getRealDate(col.min).startOf('day')) {
            disabled = true;
          }
        }
        if (!disabled) {
          if (col.max) {
            if (current && current > this.getRealDate(col.max).endOf('day')) {
              disabled = true;
            }
          }
        }
        return disabled;
      }

      component = <DatePicker {...commonProps}  
        disabledDate={(current)=>disableDate(current)}
        placeholder={selectPrompt}
      />
    } else if (col.ui === 'TimePicker') {
      component = <TimePicker {...commonProps} />
    } else if (col.ui === 'InputNumber') {
      component = <InputNumber {...commonProps} 
        placeholder={inputPrompt}
      />
    } else if (col.ui === 'Upload') {
      // =============构建上传对象

      const fwCoord = {...this.getFwCoord(), view:'create'};

      const uploadFwParam = {
        openerActionId: col.id, 
        openerFunction: this.getFwCoord()['function'],
        openerView: this.getFwCoord().view,
        oldData:{},
        newData:{},
        saveType:'checkonly', // 提示后端只进行校验，不做实际导入操作
      };
      
      const args = this.objectToFormInputs({fwCoord, fwParam:uploadFwParam},null,null)
    
      const uploadProps = {
        name: col.id + '_importFile',
        action: '/fw/importData?fwCoord.project=' + this.getFwCoord().project + '&',
        data:args,
        onChange(info) {
          this.view.setState({loading:true});
          if (info.file.status !== 'uploading') {
          }
          if (info.file.status === 'done') {
            const result = info.file.response;
            // const newFwParam = this.state.fwParam;
            // newFwParam.newData = {...newFwParam.newData, ...result.resultData};
            this.view.setState({uploadedFile:info.file.name, uploadResult:null,loading:false});
            if (result.success) {
              fwParam.connectFilePath = result.connectFilePath;
              this.view.setState({fwParam});
              message.info('文件校验通过');
            } else {
              if (result.connectFilePath) {
                this.view.setState({uploadResult:<span dangerouslySetInnerHTML={{__html: '<font color="#ff0000"><a href="/fw/download?fileName=' + result.connectFilePath + '" target="_blank">上传文件有误，点此下载明细</a></font>'}}></span>});
              } else if (result.errorMsg) {
                message.error(result.errorMsg, 10);
              }
            }
          } else if (info.file.status === 'error') {
            this.view.setState({loading:false});
            message.error(`${col.label}导入错误`, 10);
          }
        },
      };
      uploadProps.view = this;
      const uploadLabel = this.state.uploadedFile?this.state.uploadedFile:(this.state.uploadShowLabel[col.id]?this.state.uploadShowLabel[col.id]:null);
      component = <Upload {...commonProps} {...uploadProps} showUploadList={false} style={{ marginLeft: 10 }}>
          <a href="javascript:;">{uploadLabel?uploadLabel:'点击上传'}</a>
        </Upload>
    } else if (col.ui == 'MAP') {
      console.info('col.ui', col.ui);
      component = <Input {...commonProps} 
      type={col.ui?col.ui:'text'}
      placeholder={col.prompt?col.prompt:'请在地图上选择'+col.label}
      onClick={(e)=>this.selectPointInMap(col.id)}
      />
    } else if (col.showColumn) {

    }
    if (!component) {
      component = <Input {...commonProps} 
        type={col.ui?col.ui:'text'}
        placeholder={inputPrompt}
        />
    }

    components[col.id] = component;
    return component;
  }

  getRealDate = (str)=> {
    if (str.indexOf('{today')==0 && str.indexOf('}') == str.length - 1) {
      let offset = String(str).substring(6, str.length - 1);
      return moment().add(parseInt(offset), 'days');
    } else if (str == 'today') {
      return moment();
    } else {
      return moment(str);
    }
  }

  clearUpload = (col) => {
    const {uploadShowLabel, formData} = this.state;
    delete uploadShowLabel[col.id];
    if (formData[col.id]) {
      formData[col.id].value = null;
      formData[col.id].dirty = true;
    }
    this.setState({uploadedFile:null, uploadShowLabel, formData});
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    if (e && e.file && e.file.response) {
      // 文件上传后，如果校验不成功，认为文件名为空
      if (e.file.response.success) {
        return e && e.fileList;
      } else {
        return null;
      }
    }
    return e && e.fileList;
  }

  objectToFormInputs = function(obj, form, namespace) {
    const fd = form || {};
    let formKey;
    if (Array.isArray(obj)) {
      obj.map((ae, index)=> this.objectToFormInputs(ae, fd, (namespace?namespace:'') + '[' + index + ']'));
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
            this.objectToFormInputs(obj[property], fd, formKey);
          } else {
            // if it's a string or a File object
            fd[formKey] = new String(obj[property]).replace(/%/g, "%25").replace(/\&/g, "%26").replace(/\+/g, "%2B").replace(/\=/g, "%3D");
          }
          
        }
      }
    }
    return fd;
  };
  selectPointInMap = (id)=> {
    const {formData} = this.state;
    const col = this.getLayout().columnMap[id];
    const LATLNG = col.showColumn.split(',');
    console.info('param', LATLNG, formData);
    this.state.map.selectPoint({
      id, 
      lat:formData[LATLNG[0]]?formData[LATLNG[0]].value:36,
      lng:formData[LATLNG[1]]?formData[LATLNG[1]].value:120,
      name:col.label, 
      callback:(id, lat, lng, address, addComp)=>{
        console.info('callback', addComp, addComp.onlineStr)
        if(!formData[id]) {
          formData[id] = {};
        }
        if (!formData[LATLNG[0]]) {
          formData[LATLNG[0]] = {};
        }        
        if (!formData[LATLNG[1]]) {
          formData[LATLNG[1]] = {};
        }
        formData[id].value = addComp.onlineStr;
        formData[LATLNG[0]].value = lat;
        formData[LATLNG[1]].value = lng;
        console.info('newParam', lat, lng, formData);
        this.setState({formData});
      }
    })
  }
  
  handleFormChange = (changedFields) => {
    if (!changedFields) {
      return;
    }
    const {fwParam, formData} = this.state;
    if (!fwParam.newData) {
      fwParam.newData = {};
    }
    Object.keys(changedFields).map(key=> {
      const cf = changedFields[key];
      const col = this.getLayout().columnMap[key];
      const ui = col.ui;
      let newValue = null;
      if (cf && cf.value != null) {
        if (!this.state.formData[key]) {
          this.state.formData[key] = {};
        }
        newValue = cf.value;
        if (ui === 'DatePicker') {
          newValue = cf.value.format(col.pattern?col.pattern:'YYYY-MM-DD');
        } else if (ui === 'TimePicker') {
          newValue = cf.value.format(col.pattern?col.pattern:'HH:mm:ss');
        } else if (ui === 'checkbox01') {
          newValue = cf.value?'1':'0';
        } else if (col.dictionary) {
          if (col.ui == 'checkbox') {
            if (Array.isArray(cf.value)) {
              newValue = cf.value.join(',');
            } else {
              // DO NOTHING
            }
          } else {
            if (Array.isArray(cf.value)) {
              newValue = cf.value.join(',');
            } 
          }
        } else if (col.ui == 'Cascader') {
          if (Array.isArray(cf.value)) {
            newValue = cf.value.join(',');
            console.info('Cascader', cf.value, newValue);
          }
        } else if (col.ui == 'AutoComplete') {
          newValue = cf.value;
        } else if (col.valueRef && col.ui != 'TreeSelect') {
          if (Array.isArray(cf.value)) {
          newValue = cf.value.filter(row=>row&&row.key).map(row=>row.key).join(',');
          } else if (cf.value.key) {
            newValue = cf.value.key;
          } else {
            newValue = null;
          }
          if (col.showColumn) {
            // TODO show column可能为多列
            const showCol = this.getLayout().columnMap[col.showColumn.split(',')[0]];
            if (showCol) {
              const showValue = cf.value.map(val=>Array.isArray(val.label)?val.label[0]:val.label).join(',');
              if (!this.state.formData[showCol.id]) {
                this.state.formData[showCol.id] = {};
              }
              this.state.formData[showCol.id].value = showValue;
              // this.state.fwParam.newData[showCol.id] = showValue;
            }
          }
        } else if (col.ui === 'Upload') {
          console.info('upload', newValue);
          if (Array.isArray(newValue)) {
            newValue = newValue[0].name;
          }
        } else if (col.ui == 'MAP') {
          newValue = this.state.formData[key].value;
          cf.dirty = true;
        } else {
          if (typeof newValue == 'string') {
            newValue = newValue.trim(true);
            if (col.size > 0 && newValue.length > col.size) {
              newValue = newValue.substr(0, col.size);
            }
          }
          if (col.type == 'NUM') {
            if (typeof newValue !== 'number') {
              newValue = new String(newValue).split('').filter(c=>!got.isEmpty(c)).filter((c, index, arr) => ((index==0&&c=='-') ||
              (c=='.' && arr.filter((_,bcIndex)=>bcIndex<index).every(bc=>bc != '.')) ||
              got.isNumber(c)
              )
              ).join('');
            }
            if (col.min != undefined && col.min != null) {
              if (newValue == null || newValue < col.min) {
                newValue = col.min;
              }
            }
            if (col.max != undefined && col.max != null) {
              if (newValue > col.max) {
                newValue = col.max;
              }
            } else if (col.size) {
              if (newValue > Math.pow(10, col.size) - 1) {
                newValue = Math.pow(10, col.size) - 1;
              }
            }
          }
        }
      }
      cf.value = newValue;
      // fwParam.newData[key] = newValue;
    });
    this.setState({formData:{...this.state.formData, ...changedFields}, fwParam});
  }

  doOtherInputValidate = () => {
    return null;
  }

  getEditedNewData = () => {
    const newData = {...this.props.clientNewData, ...this.state.fwParam.newData};
    Object.keys(this.state.formData).map(key=>newData[key] = this.state.formData[key].value);
    if (this.processNewData) {
      this.processNewData(newData);
    }
    return newData;
  }

  getDisplayValue = (col)=> {
    const record = this.state.fwParam.newData;
    const index = 0;
    let text = record[col.id];
    let value = text;
    if (col.onFormat) {
      value = require(`../../../logic/${this.getLayout().clientLogicMap[col.onFormat].file}`).default(text, record, index, col, this);
    } else if (col.dictionary) {
      const display = this.getLayout().dictMap[col.dictionary][text]; 
      value =  display?display:text;
    } else if (col.showColumn) {
      value = col.showColumn.split(',').map(sc=>record[sc]).join(' ');
    }
    return <span>{value}</span>;
  }
//======================= Page connected end ====================================
  constructor(props) {
    super(props);
    this.state = {
        ...props,
        loading:false,
        dialogs:{},
        form:{},
        treeData:[],
        refData:{
          COL:{
            loading:false,
            data:[],
          }
        },
        components:{},
        formData:{},
        uploadedFile:null,
        uploadResult:null,
        uploadShowLabel:{},
        manualValues:{},
      };
  }
  
  componentDidMount() {
    if (!this.props.innerLayout) {
      this.setTitle()
    }
    if (this.props.onRef) {
        this.props.onRef(this);
    }
    this.refresh();
  }

  refresh() {
    if (this.props.dataManaged) {
      // 数据被管理，不需要自己加载数据
          const {fwParam, formData, uploadShowLabel} = this.state;
          fwParam.newData = {...this.props.initData};
          fwParam.oldData = {};
          Object.keys(this.props.initData).map(key=>formData[key]={value:this.props.initData[key]});
          // this.getLayout().columns.filter(col=>col.visible).map(col=>this.getInputComponent(col));
          this.getLayout().columns.filter(col=>col.ui == 'Upload').map(col=> uploadShowLabel[col.id] = this.props.initData[col.id]);
          this.setState({fwParam:this.state.fwParam, formData, refData:{},uploadShowLabel}, ()=> {
            this.getLayout().columns.filter(col=>col.ui == 'MAP').map(col=> this.selectPointInMap(col.id));
          });
    } else {
      if (this.props.showAsDialog) {
        console.info('2',this.props.clientNewData)
        const fwParam = {...this.state.fwParam, oldData:{}, newData:this.props.clientNewData};
        this.props.getCreateData({fwCoord:this.getFwCoord(), fwParam, callback:(data)=> {
          const {fwParam, formData} = this.state;
          // 根据数据的不同，动态调整界面样式
          const dynamicLayout = data['_FW_DYNAMIC_LAYOUT'];
          delete data['_FW_DYNAMIC_LAYOUT'];
          if (dynamicLayout) {
            if (dynamicLayout.columns) {
              dynamicLayout.columns.map(col=> {
                const currentCol = this.getLayout().columnMap[col.id];
                if (currentCol) {
                  Object.keys(col).map(key=> currentCol[key] = col[key]);
                }
              })
            }
          }
          fwParam.newData = {...data};
          fwParam.oldData = {};
          Object.keys(data).map(key=>formData[key]={value:data[key]});
          // this.getLayout().columns.filter(col=>col.visible).map(col=>this.getInputComponent(col));
          this.setState({fwParam:this.state.fwParam, formData, refData:{}});
        }});
      } else {
        if (this.getLayout().onInit) {
          this.getActionEntry(this.getLayout().onInit).logic(this, this.getLayout().onInit, null, -1, null);
        }
      }
    }
  }

  componentWillUpdate() {
    
  }
  
  setTitle(newTitle) {
    const { title } = this.getLayout();
    document.title = newTitle?newTitle:title;
  }

  getLayout = () => {
    if (!!this.state.innerLayout && this.state.innerLayout != this.props.innerLayout) {
      return this.state.innerLayout;
    }
    if (!this.props.innerLayout) {
      return this.props.layout;
    }
    return this.props.innerLayout;
  }

  getFwCoord = () => {
    return {...this.props.fwCoord, ...this.props.innerFwCoord};
  }

  onFormRef = (form) => {
    this.props.form = form;
  }

  getActionEntry = function(logicId) {
    return ButtonArea.getActionEntry(this, logicId);
  }

  handleAction = function(e, id) {
    let actionId = null;
    let event = null;
    if (id) {
      actionId = id;
      event = e;
    } else {
      actionId = e.key;
      event = e.domEvent;
    }
    this.getActionEntry(this.getLayout().actionArgs[actionId].click).logic(this, actionId, null, -1, event);
  }

  FIX_WIDTH = {}

  CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
      props.onChange(changedFields);
    },
    mapPropsToFields: (props)=> {
      const fields = {};
      this.getLayout().columns.filter(col=>col.visible).map(col=> {
        let value = {...this.state.formData[col.id]};
        if (value && (value.value != null)) {
          if (col.ui === 'DatePicker') {
            value.value = value.value?moment(value.value, col.pattern?col.pattern:'YYYY-MM-DD'):value.value;
          } else if (col.ui === 'TimePicker') {
            value.value = value.value?moment(value.value, col.pattern?col.pattern:'HH:mm:ss'):value.value;
          } else if (col.ui === 'checkbox01') {
            value.value = (value.value == '1')?true:false;
          } else if (col.dictionary) {
            if (col.ui == 'checkbox') {
              if (!Array.isArray(value.value)) {
                value.value = String(value.value).split(',');
              } else {
                // DO NOTHING
              }
            } else {
              if (col.multiSelect) {
                if (value.value) {
                  value.value = String(value.value).split(',');
                } else {
                  value.value = null;
                }
              } else {
                value.value = String(value.value);
              }
            }
          } else if (col.ui == 'Cascader') {
            value.value =  String(value.value).split(',');
          } else if (col.ui == 'AutoComplete') {
            // DO NOTHING
          } else if (col.valueRef && col.ui != 'TreeSelect') {
            if (!Array.isArray(value.value)) {
              if (value.value) {
                value.value = String(value.value).split(',').map(val=>({'key':val}));
              } else {
                value.value = [];
              }
            }
            if (Array.isArray(value.value)) {
              if (col.showColumn) {
                const showValue = this.state.formData[col.showColumn.split(',')[0]];
                showValue&&showValue.value?showValue.value.split(',').map((sv, index)=>value.value.length>index?value.value[index].label=sv:null):null;
              }
            }
          } else if (col.ui == 'MAP') {
            value.value = value.value.split('、').join('');
          } else {
            if (col.type == 'NUM' && !col.dictionary) {
              if (value.value === '') {
                value.value = null;
              }
              if (value.value !== null) {
                // if (col.decimalSize > 0) {
                //   value.value = parseFloat(value.value);
                // } else {
                //   value.value = parseInt(value.value);
                // }
              }
            } else {
              value.value = String(value.value);
            }
          }
        }
        // Select 如果设置了labelInValue但value为null,则报异常，将值直接删除OK
        if ((value.value === undefined || value.value === null || value.value === '' || (Array.isArray(value.value) && value.value.length == 0))) {
          delete value.value;
        }
        fields[col.id] = Form.createFormField({...value});
      });
      return fields;
    },
    onValuesChange(props, values) {
      // console.info('onValuesChange', props, values);
    },
  })((props) => {
    this.state.form = props.form;
    const { getFieldDecorator } = props.form;
    const visibleColumns = this.getLayout().columns.filter(col=>col.visible);
    const groupedColumns = {"_default":[]};
    const groupMap = {};
    if (this.getLayout().columnGroups) {
      this.getLayout().columnGroups.map(g=>groupMap[g.id] = g);
    }
    visibleColumns.map(col=>{
      let groupId = '_default';
      if (col.group && groupMap[col.group]) {
        groupId = col.group;
      }
      if (!groupedColumns[groupId]) {
        groupedColumns[groupId] = [];
      }
      groupedColumns[groupId].push(col);
    })

    const buildFormItemFunction = (columns) => (columns?columns.map(col=> {
      const rules = [];
      let isInput = false;
      if (col.editable) {
        rules.push({required:col.required, message:'请输入' + col.label});
        if (col.type == 'NUM') {
          if (!col.dictionary && !col.valueRef) {
            isInput = true;
            if (col.max) {
              // rules.push({type:'number', max:parseInt(col.max), message:col.label + '不能超过' + col.max});
            } else if (col.size > 0) {
              // rules.push({type:'number', max:Math.pow(10, parseInt(col.size))-1, message:col.label + '不能超过' + col.size + '位'});
            }
            if (col.min) {
              // rules.push({type:'number', min:parseInt(col.min), message:col.label + '不能小于' + col.min});
            }
          }
        } else {
          if (!col.dictionary && !col.valueRef && col.ui != 'DatePicker') {
            isInput = true;
            if (col.size > 0) {
              // rules.push({max:col.size, message:col.label + '长度不能超过' + col.size});
            }
          }
        }
      }
      if (col.onValidate && this.getLayout().clientLogicMap[col.onValidate]) {
        const customValidate = require(`../../../logic/${this.getLayout().clientLogicMap[col.onValidate].file}`);
        rules.push({validator: (rule,value,callback)=>{
          const errors = [];
          if (value && !customValidate.validate(value, this.state.fwParam.newData, 0, col, this)) {
            errors.push(new Error(customValidate.errorMsg(value, this.state.fwParam.newData, 0, col, this)));
          }
          callback(errors);
        }})
      }
      const opts = {valuePropName:'value', rules};
      if (isInput) {
        opts.validateTrigger = 'onBlur';
      }
      if (col.ui =='checkbox01') {
        opts.valuePropName = 'checked';
      } else if (col.ui == 'Upload') {
        // opts.valuePropName = 'fileList';
        opts.getValueFromEvent = this.normFile;
      }
      return <Col span={(visibleColumns.length>5 || visibleColumns.some(col=>col.ui == 'MAP'))?12:24} key={col.id}>
        <FormItem {...formItemLayout} label={col.label}>
          {getFieldDecorator(col.id, opts)(this.getInputComponent(col))}
          {(col.ui == 'Upload' && (this.state.uploadedFile || this.state.uploadShowLabel[col.id]))?<Button icon='close' shape='circle' style={{marginLeft:10, width:20,height:20, fontSize:8}} onClick={()=>this.clearUpload(col)}/>:null}
          {col.tail?' '+col.tail:null}
        </FormItem>
      </Col>
    }):[]);
    let formItems = [];
    if (Object.keys(groupedColumns).length > 1) {
      ['_default',...this.getLayout().columnGroups.map(g=>g.id)].map(groupId=> {
        if (groupMap[groupId] && groupedColumns[groupId] && groupedColumns[groupId].length > 0) {
          formItems.push(<Col span={24} key={'group_' + groupId} style={{fontSize:16, marginTop:20}}><b>{groupMap[groupId].title}</b></Col>)
        }
        formItems = [...formItems, ...buildFormItemFunction(groupedColumns[groupId])];
      });
    } else {
      formItems = buildFormItemFunction(visibleColumns);
    }
    if (visibleColumns.some(col=>col.ui == 'Upload')) {
      formItems.push(
        <Col key='FW_uploadPrompt' span={24} style={{height:60, textAlign:'center'}}>
        {this.state.uploadResult}
        </Col>
      )
    }
    return (
      <Form>
        <Row gutter={1}>{formItems}</Row>
      </Form>
    );
  });

  render() {
    const CustomizedForm = this.CustomizedForm;

    return (
      <div>
      <Spin spinning={this.props.loading || this.state.loading}>
      <CustomizedForm onChange={this.handleFormChange}  />
      {this.getLayout().columns.some(col=>col.visible && col.ui == 'MAP')?
      <Map 
        height="50vh"
        showQueryControl
        onRef={(ref)=>this.setState({map:ref})}
      />:null}
      </Spin>
      {Object.values(this.state.dialogs)}
      </div>
    )
  }
}
