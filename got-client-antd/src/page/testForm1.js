import { Form, Input } from 'antd';

const FormItem = Form.Item;

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const result = {
      username: Form.createFormField({
        ...props.fields.username,
        // value: props.fields.username.value,
      }),
    };
    console.info('props to fields:', result);
    return result;
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <Form layout="inline">
      <FormItem label="Username">
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Username is required!' }],
        })(<Input />)}
      </FormItem>
    </Form>
  );
});

export default class Demo extends React.Component {
  state = {
    fields: {
      username: {
        value: 'benjycui',
      },
    },
  };

  handleFormChange = (changedFields) => {
    const newfields = {};
    Object.keys(changedFields).map(key=>{newfields[key] = {...changedFields[key]};delete newfields[key].errors});
    
    this.setState(({ fields }) => ({
      fields: { ...fields, ...newfields },
    }));
  }

  render() {
    const fields = this.state.fields;
    return (
      <div>
        <CustomizedForm fields={fields} onChange={this.handleFormChange} />
        <pre className="language-bash">
          {JSON.stringify(fields, null, 2)}
        </pre>
      </div>
    );
  }
}
