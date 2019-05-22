import {Component} from 'react';

class ShowBeforeTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgTime: this.props.msgTime,
            showTime:'',
        };
    }

    componentDidMount() {
        this.showTime(this.state.msgTime);
    }
    //父组件数据更新时重新加载此组件
    componentWillReceiveProps(nextProps) {
        this.showTime(nextProps.msgTime);
    }

    showTime(msgTime){
        let startTime = Date.parse(new Date(msgTime));
        let endTime = new Date();
        let usedTime = endTime - startTime;  //两个时间戳相差的毫秒数
        let days=Math.floor(usedTime/(24*3600*1000));
        if(days>0){
            this.setState({showTime:days+'天前'});
            return;
        }
        //计算出小时数
        let leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
        let hours=Math.floor(leave1/(3600*1000));
        if(hours>0){
            this.setState({showTime:hours+'小时前'});
            return;
        }
        //计算相差分钟数
        let leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        let minutes=Math.floor(leave2/(60*1000));
        if(minutes>0){
            this.setState({showTime:minutes+'分钟前'});
            return;
        }

        this.setState({showTime:'1分钟内'});
    }


    render() {
        return (
            <div>
                <div style={{fontSize:'12px'}}>
                    {this.state.showTime}
                </div>
            </div>);
    }
}
export default ShowBeforeTime;
