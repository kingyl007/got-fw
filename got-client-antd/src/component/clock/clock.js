import {Component} from 'react';
import moment from 'moment';
class Clock extends Component {
    constructor(props) {
        super(props);
        this.state={
            currentTime:'',
            currentDay:moment(new Date()).format("YYYY-MM-DD"),
            weekDay:this.getWeekDay(),
        }
    }

    componentDidMount() {
        this.timer=setInterval(()=>{
            this.showTime();
        },1000);
    }

    componentWillMount(){
        clearInterval(this.timer);
    }

    getWeekDay(){
        const arr= new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
        return arr[new Date().getDay()];
    }

    showTime(){
        this.setState({currentTime:moment(new Date()).format("HH:mm:ss")});
    }

    render() {

        return (
            <div>
                {this.state.currentDay}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.weekDay}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.currentTime}
            </div>);
    }
}
export default Clock;
