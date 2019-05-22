
import { connect} from 'dva';
import { Component } from 'react';
import { Form, Icon, Input, Button, Row, Col, Checkbox, message } from 'antd';
require('./login.css');

const FormItem = Form.Item;


// formItem css 样式
const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 2 },
    sm: { span: 2 },
  }
}

function mapStateToProps(state) {
  const {dispatch, fwCoord, layout} = state.fw;
  return {
      loading: state.loading.models.fw,
      dispatch, 
      fwCoord,
      layout,
  };
}

  const mapDispatchToProps = (dispatch) => {
    return {
      login: ({loginData, fwCoord, callback}) => {
        dispatch({
            type: 'login/login',
            payload: {loginData, fwCoord, callback},
        });
      },
    };
  };

  @connect(mapStateToProps, mapDispatchToProps)
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        ...props,
        loginData:{},
        form:{},
      };
      if (props.showAsDialog) {
        this.state.fwParam = {...this.state.fwParam, oldData:this.props.selectedData, newData:this.props.selectedData};
      
      } else {
        console.info('edit show as page');
      }
  }
  
  componentDidMount() {
    if (!this.props.innerLayout) {
      this.setTitle()
    }
    if (this.props.onRef) {
        this.props.onRef(this);
    }
  }
  
  setTitle(newTitle) {
    const { title } = this.getLayout();
    document.title = newTitle?newTitle:title;
  }

  getLayout = () => {
    const layout = {
      title:'登录',
      columns:[{id:'CUSTOMER_ID', label:'客户号',visible:false, required:true},
              {id:'USER_ACCOUNT', label:'用户名',visible:true, required:true},
              {id:'PASSWORD', label:'密码',visible:true, required:true, type:"password"},
          ]
    }
    return layout;
    /*
    if (!this.props.innerLayout) {
      return this.props.layout;
    }
    return this.props.innerLayout;
    */
  }

  getFwCoord = () => {
      return {...this.props.fwCoord, ...this.props.innerFwCoord};
  }
    
  handleFormChange = (changedFields) => {
    Object.keys(changedFields).map(key=>this.state.loginData[key] = changedFields[key].value);
  }

  onFormRef = (form) => {
    console.info('onFormRef');
    this.props.form = form;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.state.form.validateFields((err, values) => {
      if (!err) {
        this.props.login({loginData:values, fwCoord:this.getFwCoord(), callback:(data)=>{
          if (!data.success) {
            if (data.errorMsg) {
              message.error(data.errorMsg, 5);
            }
          }
        }});
      }
    });
  }

  render() {
    const CustomizedForm = Form.create({
      onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
      },
      mapPropsToFields: (props)=> {
        const fields = {};
        this.getLayout().columns.filter(col=>col.visible).map(col=>fields[col.id] = Form.createFormField({value:this.state.loginData[col.id]}));
        return fields;
      },
      onValuesChange(props, values) {
        props.onChange(values);
      },
    })((props) => {
      this.state.form = props.form;
      const { getFieldDecorator } = props.form;
      const visibleColumns = this.getLayout().columns.filter(col=>col.visible);
      const formItems = visibleColumns.map(col=><Col span={visibleColumns.length>5?12:24} key={col.id}><FormItem {...formItemLayout} label={col.label}>
          {getFieldDecorator(col.id,{rules:[{required:col.required, message:col.label + '必需输入'}]})(<Input type={col.type} />)}</FormItem></Col>);
      return (
        <Form onSubmit={(e)=>this.handleSubmit(e)} className="login-form">
          <Row gutter={1}>{formItems}
          <Col span={24} offset={10}>
          <FormItem {...formItemLayout}>
          <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            </FormItem>
            </Col>
          
          </Row>
        </Form>
      );
    });
    return (
      <CustomizedForm onChange={this.handleFormChange} />
    )
  }
}
