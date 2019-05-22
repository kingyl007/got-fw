import {Component} from 'react';
import {Avatar} from 'antd';

class MemberLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isManFlag: this.props.sex === '0' || this.props.sex == 0 ? true : false,
            memberLevel: '',
            color: '',
            rgb:'',
        };
    }

    componentDidMount() {
        this.getMemberLevel(this.props.memberLevel);
    }

    //父组件数据更新时重新加载此组件
    componentWillReceiveProps(nextProps) {
        this.getManFlag(nextProps.sex);
        this.getMemberLevel(nextProps.memberLevel);
    }

    getManFlag(sex) {
        this.setState({isManFlag: sex === '0' || sex == 0});
    }

    getMemberLevel(level) {
        if (level === '400' || level === 400) {
            this.setState({memberLevel: '铂金会员', color: '#707174',rgb: 'rgba(112,113,116,0.2)'});
        } else if (level === '300' || level === 300) {
            this.setState({memberLevel: '金卡会员', color: '#e7c993',rgb: 'rgba(231,201,147,0.2)'});
        } else if (level === '200' || level === 200) {
            this.setState({memberLevel: '银卡会员', color: '#a0a8cb',rgb: 'rgba(160,168,203,0.2)'});
        } else {
            this.setState({memberLevel: '普通会员', color: '#6c8cf9',rgb: 'rgba(108,140,249,0.2)'});
        }

    }

    render() {
        let headImage = this.props.headImage;
        if (!headImage || headImage == '-') {
            headImage = require(`../../assets/member/${this.state.isManFlag?'man_head':'woman_head'}.png`);
        }
        return (
            <div>
                <div>
                    <Avatar src={headImage} style={{height:'60px',width:'60px'}}/>
                </div>
                <div style={{backgroundColor: this.state.rgb, marginTop:'5px',height: '20px', width: '60px',fontSize:'12px',color:this.state.color, textAlign:'center',borderRadius:'10px'}}>
                    {this.state.memberLevel}
                </div>
            </div>);
    }
}
export default MemberLevel;
