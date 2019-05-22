
export const showCreateInList = {
    id:'showCreateInList',
    layout: function(view, actionId, record, recordIndex) {
        this.view = view;
        this.action = view.props.layout.actionArgs[actionId];
            return(
                <span key={this.action.fw_index} onClick={(event) => this.logic(view, actionId, record, recordIndex, event)}>
                    <a href="javascript:;">{this.action.label} </a>
                </span>
            )
    },
    
    onRef: function(ref) {
        this.dialog = ref;
    },

    logic: function(view, actionId, record, recordIndex, event) {
        this.view = view;
        this.action = view.props.layout.actionArgs[actionId];
        this.record = record;
        this.recordIndex = recordIndex;
        this.event = event;
        const layoutCallback = (layout)=> {
            this.dialogLayout = layout;
            const newDialogs = this.view.state.dialogs;
            newDialogs[this.id] = 
            <Modal
                key={this.id}
                title={this.action.label}
                visible={true} 
                cancelText="取消" onCancel={(e)=>this.handleCancel(e)}
                okText="保存" onOk={(e) => this.handleOk(e)}
                >
                <Create selectedData={{}} dialogLayout={layout} showAsDialog={true}
                    onRef={(ref)=>this.onRef(ref)}/>
            </Modal>;
            this.view.setState({dialogs : newDialogs});
        };
        if (this.dialogLayout) {
            layoutCallback(this.dialogLayout);
        } else {
            this.view.props.getLayout(null,null,'create',null,null, layoutCallback);
        }
    },
    
    handleOk : function(e) {
        const form = this.dialog.state.form;
        form.validateFieldsAndScroll((error, values) => {
            if (!error) {
                console.info('values');
                console.info(values);
                console.info(this.dialog.props.fwParam.oldData);
                this.dialog.props.saveCreateData({...this.dialog.props.fwParam.oldData, ...values}, (result)=> {
                    if (result.success) {
                        message.success(result.errorMsg?result.errorMsg:'保存成功');
                        this.view.props.getGridData();
                        this.handleCancel(e);
                    } else {
                        if (result.validResultMap) {
                          const se = {};
                          Object.keys(result.validResultMap).map(key=> {se[key] = {value:values[key], errors:[new Error(result.validResultMap[key])]}});
                          form.setFields(se);
                        }
                        if (result.errorMsg) {
                            message.error(result.errorMsg, 10);
                        }
                    }
                });
            } else {
                console.info('error');
                console.info(error);
            }
        });
    },

    handleCancel : function(e) {
        console.info('fwParam');
        console.info(this.dialog.props.fwParam);
        const ds = this.view.state.dialogs;
        delete ds[this.id];
        this.view.setState({dialogs: ds});
    },
}