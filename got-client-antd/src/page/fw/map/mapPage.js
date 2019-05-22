import { connect} from 'dva';
import { Component } from 'react';
import { Form, Input,Row, Col, Button, InputNumber,DatePicker,Checkbox,Select,Spin,TimePicker, TreeSelect ,Tree,Radio, Alert   } from 'antd';
import request from '../../../util/request';
import * as ButtonArea from '../../../component/fw/buttonArea';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Map } from '../../../component/fw/map';
moment.locale('zh-cn');

const { TreeNode } = Tree;
const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;

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
  // const {fwParam} = state.edit;
  return {
      loading: state.loading.models.edit,
      dispatch, 
      fwCoord,
      layout,
      // fwParam,
  };
}

  const mapDispatchToProps = (dispatch) => {
    return {
      getEditData: ({fwCoord, fwParam, callback}) => {
        dispatch({
            type: 'edit/getEditData',
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
      saveEditData: ({fwCoord, fwParam, callback}) => {
        dispatch({
            type: 'edit/saveEditData',
            payload: {fwCoord, fwParam, callback},
        });
      },
    };
  };

  @connect(mapStateToProps, mapDispatchToProps)
export default class MapPage extends Component {
//======================= Page connected start ====================================
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
          queryColumns:col.valueRef.value+',' + col.valueRef.label + ',' + (col.valueRef.otherRefs?col.valueRef.otherRefs:''),
          selectedTreeNodeId:treeNode.props.eventKey, 
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

  getInputComponent = (col)=> {
    const {components, refData, fwParam, formData} = this.state;
    // if (components[col.id]) {
    //   return components[col.id];
    // }
    let component = null;
    const commonProps = { disabled:!col.editable, style:{width: '90%'} };
    if (col.type === 'MEMO') {
      component = <TextArea {...commonProps} rows={4} />
    }
    if (col.ui === 'checkbox01') {
      component = <Checkbox disabled={!col.editable}  />
    } else if (col.dictionary && this.getLayout().dictMap[col.dictionary]) {
      const dic = this.getLayout().dictMap[col.dictionary];
      if (col.ui == 'radio') {
        component =  <RadioGroup name={col.id} {...commonProps}>
          {Object.keys(dic).map(key=> <Radio key={key} value={key}>{dic[key]}</Radio>)}
        </RadioGroup>
      } else {
        component = <Select {...commonProps}>
          {Object.keys(dic).map(key=> <Option key={key} value={key}>{dic[key]}</Option>)}
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
        console.info('before remote call');
        colRefData.data = [];
        this.props.getTreeData({
          fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
          fwParam: {distinct:ref.distinct?ref.distinct:null, queryColumns:ref.value+',' + ref.label + ',' + (ref.otherRefs?ref.otherRefs:'')},
          callback: (result) => {
            if (result.success) {

              colRefData.data = result.data;
              console.info('result.data', colRefData.data);
              colRefData.loading = false;
              refData[col.id] = colRefData;
              this.setState({refData});
            } else {
              colRefData.data = null;
            }
          }
        });
      }
      console.info('before render ', colRefData.data);
      component = <TreeSelect
        {...commonProps}
        placeholder={col.prompt?col.prompt:'请选择'}
        notFoundContent={colRefData.loading ? <Spin size="small" /> : null}
        showArrow={true}
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
              fwParam: {queryStr:val, distinct:ref.distinct?ref.distinct:null, queryColumns:ref.value+',' + ref.label + ',' + (ref.otherRefs?ref.otherRefs:'')},
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
    } else if (col.valueRef != null) {
      const ref = col.valueRef;
      // const {refData, fwParam} = this.state;
      if (!refData[col.id]) {
        console.info(fwParam.newData);
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
        console.info('before remote call');
        colRefData.data = [];
        this.props.getRefData({
          fwCoord: {...this.getFwCoord(), 'function':ref.function, view:ref.view}, 
          fwParam: {distinct:ref.distinct?ref.distinct:null, queryColumns:ref.value+',' + ref.label + ',' + (ref.otherRefs?ref.otherRefs:'')},
          callback: (result) => {
            let remoteData = []
            if (result.success) {
              remoteData = result.data;
            }
            if (col.showColumn) {
              console.info('showColumn', formData[col.showColumn], formData[col.id]);
              
              const selectedLabels = formData[col.showColumn]&&formData[col.showColumn].value?formData[col.showColumn].value.split(','):[];
              const selectedValues = formData[col.id]&&formData[col.id].value?formData[col.id].value.split(','):[];
              let defaultRow = null;
              if (selectedValues.length > 0 && selectedLabels.length == selectedValues.length) {
                for(var i = 0; i < selectedValues.length; ++i) {
                  if (remoteData.filter(row=>row[ref.value] == selectedValues[i])) {
                    continue;
                  }
                  defaultRow = {};
                  defaultRow[ref.value] = selectedValues[i];
                  defaultRow[ref.label] = selectedLabels[i];
                  remoteData.push(defaultRow);
                }
              }
            }
            console.info('this.state.fwParam.newData', this.state.fwParam.newData);
            colRefData.data = remoteData;
            colRefData.loading = false;
            refData[col.id] = colRefData;
            this.setState({refData, formData});
          }
        });
      }
      const items = colRefData.data.map(d => <Option key={d[ref.value]}>{d[ref.label]}{ref.otherRefs?ref.otherRefs.split(',').map(oc=>{'/' + d[oc]}):''}</Option>);
      component = <Select
        {...commonProps}
        showSearch
        placeholder={col.prompt}
        mode={col.multiSelect?'multiple':null}
        notFoundContent={colRefData.loading ? <Spin size="small" /> : null}
        showArrow={true}
        filterOption={false}
        labelInValue={true}
        autoFocus={colRefData.autoFocus}
        defaultOpen={colRefData.defaultOpen}
        onBlur={()=>console.info('blur')}
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
              fwParam: {queryValue:val, distinct:ref.distinct?ref.distinct:null, queryColumns:ref.value+',' + ref.label + ',' + (ref.otherRefs?ref.otherRefs:'')},
              callback: (result) => {
                if (colRefData.currentValue == val) {
                  let remoteData = []
                  if (result.success) {
                    remoteData = result.data;
                  }
                  if (col.showColumn) {
                    const selectedLabels = formData[col.showColumn]&&formData[col.showColumn].value?formData[col.showColumn].value.split(','):[];
                    const selectedValues = formData[col.id]&&formData[col.id]?String(formData[col.id].value).split(','):[];
                    let defaultRow = null;
                    if (selectedValues.length > 0 && selectedLabels.length == selectedValues.length) {
                      for(var i = 0; i < selectedValues.length; ++i) {
                        if (remoteData.filter(row=>row[ref.value] == selectedValues[i])) {
                          continue;
                        }
                        defaultRow = {};
                        defaultRow[ref.value] = selectedValues[i];
                        defaultRow[ref.label] = selectedLabels[i];
                        remoteData.push(defaultRow);
                      }
                    }
                  }
                  console.info('this.state.fwParam.newData2', this.state.fwParam.newData);
                  colRefData.data = remoteData;
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
        onChange={(val)=>{console.info('onChange');console.info(val)}}
      >
        {items}
      </Select>
    } else if (col.ui === 'DatePicker') {
      return <DatePicker {...commonProps}/>
    } else if (col.ui === 'TimePicker') {
      return <TimePicker {...commonProps} />
    } else if (col.ui === 'InputNumber') {
      return <InputNumber {...commonProps}/>
    } else if (col.ui === 'Upload') {

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
        placeholder={col.prompt?col.prompt:'请输入'}
        />
    }

    components[col.id] = component;
    return component;
  }
  
  handleFormChange = (changedFields) => {
    if (!changedFields) {
      return;
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
        } else if (col.valueRef && col.ui != 'TreeSelect') {
          newValue = cf.value.filter(row=>row&&row.key).map(row=>row.key).join(',');
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
        } else if (col.ui == 'MAP') {
          newValue = this.state.formData[key].value;
          cf.dirty = true;
        } else {
          // if (typeof newValue == 'string') {
          //   newValue = String(newValue).trim();
          // }
        }
      }
      cf.value = newValue;
      // this.state.fwParam.newData[key] = newValue;
    });
    this.setState({formData:{...this.state.formData, ...changedFields}});
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
    return value;
  }
//======================= Page connected end ====================================
  constructor(props) {
    super(props);
    this.state = {
        ...props,
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
          const {fwParam, formData} = this.state;
          fwParam.newData = {...this.props.initData};
          fwParam.oldData = {...this.props.initData};
          Object.keys(this.props.initData).map(key=>formData[key]={value:this.props.initData[key]});
          // this.getLayout().columns.filter(col=>col.visible).map(col=>this.getInputComponent(col));
          this.setState({fwParam:this.state.fwParam, formData, refData:{}});
    } else {
      if (this.props.showAsDialog) {
        const fwParam = {...this.state.fwParam, oldData:{}, newData:{},selectedData:this.props.selectedData};
        this.props.getEditData({fwCoord:this.getFwCoord(), fwParam, callback:(data)=> {
          const {fwParam, formData} = this.state;
          fwParam.newData = {...data};
          fwParam.oldData = {...data};
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
          } else if (col.valueRef && col.ui != 'TreeSelect') {
            if (!Array.isArray(value.value)) {
              if (value.value) {
                value.value = String(value.value).split(',').map(val=>({'key':val}));
              } else {
                value.value = [];
              }
            }
            if (col.showColumn) {
              const showValue = this.state.formData[col.showColumn.split(',')[0]];
              showValue&&showValue.value?showValue.value.split(',').map((sv, index)=>value.value.length>index?value.value[index].label=sv:null):null;
            }
          } else if (col.ui == 'MAP') {
            // DO NOTHING,
          } else {
            if (col.type == 'NUM' && !col.dictionary) {
              if (col.decimalSize > 0) {
                value.value = parseFloat(value.value);
              } else {
                value.value = parseInt(value.value);
              }
            } else {
              value.value = String(value.value);
            }
          }
        }
        fields[col.id] = Form.createFormField({...value});
      });
      return fields;
    },
    onValuesChange(props, values) {
      //props.onChange(values);
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
        // if (col.editable) {
        //   rules.push({required:col.required, message:'请输入' + col.label});
        //   if (col.size > 0) {
        //     if (col.type == 'NUM') {
        //       if (!col.dictionary && !col.valueRef) {
        //         if (col.max) {
        //           rules.push({type:'number', max:parseInt(col.max), message:col.label + '不能超过' + col.max});
        //         }
        //         if (col.min) {
        //           rules.push({type:'number', min:parseInt(col.min), message:col.label + '不能小于' + col.min});
        //         }
        //       }
        //     } else {
        //       rules.push({max:col.size, message:col.label + '长度不能超过' + col.size});
        //     }
        //   }
        // }
      return <Col span={visibleColumns.length>5?12:24} key={col.id} style={{height:24}}>
        <FormItem {...formItemLayout} label={col.label}>
        {this.getDisplayValue(col)} {col.tail}
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
      <Spin spinning={false}>
      {(this.state.points && this.state.points.length == 1 && (!this.state.points[0].lat || !this.state.points[0].lng))? <Alert message="设备未定位" type="info" showIcon />:null}
      <Map height={500} {...this.props.mapOptions} points={this.state.points} />
      </Spin>
      </div>
    )
  }
}
