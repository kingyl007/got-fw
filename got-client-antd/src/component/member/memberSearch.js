import {connect} from 'dva';
import {Component} from 'react';
import {Select, Modal,Spin} from 'antd';
import {getMemberList} from '../../service/memberinput/memberInputService';

const Option = Select.Option;
class MemberSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberOptions: [],
            value:undefined,
            fetching: false,
        };

         this.timeout=null;
         this.currentValue='';
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    refresh = () => {
        //获取车品牌列表，如果获取失败不报错，不赋值
        getMemberList().then(data => {
            if (data.data.success) {
                let options = [];
                for (let member of data.data.memberList) {
                    options.push(<Option key={member.SID} value={member.NAME}>{member.NAME}</Option>);
                }

                this.setState({memberOptions:options});
            }
        }).catch(err => {
            message.error('获取会员列表失败，请联系系统管理员！', 10);
        });
    }

    /**
     * 选择会员响应函数
     * @param value 选择值
     * @param option 选择的会员号和车号
     */
    handleChange=(value, option)=> {
        this.setState({value:value});
        if (option && value) {
            this.props.selectedMember(option.key, value);
        }
    }

    handleSearch = (value) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.currentValue = value;
        this.timeout = setTimeout(this.searchMember, 300);
    }


    searchMember=()=> {
        this.setState({fetching:true,memberOptions:null});
        getMemberList({"queryValue":this.currentValue}).then(data => {
            if (data.data.success) {
                let options = [];
                for (let member of data.data.memberList) {
                    options.push(<Option key={member.SID} value={member.NAME}>{member.NAME}</Option>);
                }

                this.setState({memberOptions: options,fetching:false});
            }
        }).catch(err => {
            this.setState({fetching:false});
            message.error('获取会员列表失败，请联系系统管理员！', 10);

        });
    }

    render() {
        return (

            <Select
                showSearch
                value={this.state.value}
                placeholder="会员名/手机号/车牌号/VIN码/微信openid"
                defaultActiveFirstOption={false}
                style={{width: 270, borderRadius: '50px'}}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
            >
                {this.state.memberOptions}
            </Select>
        );
    }
}
export default MemberSearch;
