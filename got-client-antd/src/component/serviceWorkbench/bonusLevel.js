import {Component} from 'react';

class BonusLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberLevel: 100,
            color: '',
            rgb:'',
            selectFlag:false,
        };
    }

    componentDidMount() {
        this.refreshMemberLevel(this.props.memberLevel);
    }


    //父组件数据更新时重新加载此组件
    componentWillReceiveProps(nextProps) {
        this.setState({memberLevel:nextProps.memberLevel,selectFlag:nextProps.selectFlag?nextProps.selectFlag:false});
        this.refreshMemberLevel(nextProps.memberLevel);
    }

    //level数据库类型为int
    refreshMemberLevel(level) {
        if (level === 400) {
            this.setState({memberLevel: '铂金会员', color: '#707174',rgb: 'rgba(112,113,116,0.2)'});
        } else if (level === 300) {
            this.setState({memberLevel: '金卡会员', color: '#e7c993',rgb: 'rgba(231,201,147,0.2)'});
        } else if (level === 200) {
            this.setState({memberLevel: '银卡会员', color: '#a0a8cb',rgb: 'rgba(160,168,203,0.2)'});
        } else {
            this.setState({memberLevel: '普通会员', color: '#6c8cf9',rgb: 'rgba(108,140,249,0.2)'});
        }
    }

    render() {
        return (
            <div>
                <div style={{backgroundColor: this.state.rgb, textAlign:'center', height: '26px', width: '80px',fontSize:'12px',padding:'5px',color:this.state.selectFlag?'white':this.state.color,
                borderRadius:this.props.align=='left'?'0px 47px 47px 0px':'13px'}}>
                    {this.state.memberLevel}
                </div>
            </div>);
    }
}
export default BonusLevel;
