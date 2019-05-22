import { Select, Spin, Input, Button } from 'antd';
import debounce from 'lodash/debounce';
import {Map} from '../component/fw/map';
const Option = Select.Option;

class UserRemoteSelect extends React.Component {
  
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
    inputValue: 'Test',
  }

  fetchUser = (value) => {
    console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = body.results.map(user => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        this.setState({ data, fetching: false });
      });
  }

  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }
  onSelectPointOnMap = (id, lat, lng, address) => {
    this.setState({inputValue:address});
  }
 
  render() {
    const { fetching, data, value } = this.state;
    return (
      <div>
      <Button type="primary" onClick={()=>this.state.map.selectPoint({id:'DEMO', lat:36,lng:120,name:'门店地址', callback:(id, lat, lng, address)=>this.onSelectPointOnMap(id, lat, lng,address)})}>地图上选点</Button> 
      <Button type="primary" onClick={()=>this.state.map.setCenter({lat:36,lng:120})}>设置中心点</Button>
      <Button type="primary" onClick={()=>this.state.map.showPoint({id:'OWNER_LOC', name:'', lat:36,lng:120,icon:'http://www.gpsonline.cn/img/u5574.png', infoContent:'<b>车主手机位置:</b><br>2018-12-17 13:12<br>山东省青岛市黄岛区', buttonOpts:{name:'车主手机位置'}})}>显示车主位置</Button>
      <Button type="primary" onClick={()=>this.state.map.showPoint({id:'VEHICLE_LOC', name:'', lat:36.1,lng:120.1,icon:'http://www.gpsonline.cn/img/u2098.png', infoContent:'<b>车辆位置:</b><br>2018-12-17 13:12<br>山东省青岛市黄岛区', buttonOpts:{name:'车辆定位位置', offset:{x:20, y:60}}})}>显示车辆位置</Button>
      <Select
      mode="multiple"
      labelInValue
      value={value}
      placeholder="Select users"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={this.fetchUser}
      onChange={this.handleChange}
      style={{ width: '100%' }}
      >
      {data.map(d => <Option key={d.value}>{d.text}</Option>)}
      </Select>
      <Input defaultValue={this.state.inputValue} onChange={(e)=>this.setState({inputValue:e.target.value})}/>
      {this.state.inputValue}
      <Sub value={this.state.inputValue} />
      <Map 
        showQueryControl={true} 
        showCityListControl={true} 
        showGeolocationControl={true}
        showNavigationControl={true}
        showMapTypeControl={true}
        currentCity="北京"
        height="70vh"
        onRef={(ref)=>this.setState({map:ref})}
      />
      </div>
    );
  }
}

class Sub extends React.Component {
  render() {
    return <div>AAA {this.props.value} BBB</div>
  }
}

export default() => {
  return <UserRemoteSelect />
}