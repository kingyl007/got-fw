import {Component} from 'react';
import MemberLevel from './memberLevel';
import {Map} from '../fw/map';
import { Row, Col, Button, Modal,message} from 'antd';
import {getMemberRelationInfo,getGpsLastestData} from '../../service/afterserviceplatform/afterServicePlatformService';

class MemberArrived extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberIdAndCarId:this.props.memberIdAndCarId,
            gpsNo:this.props.gpsNo,
            memberInfo:{},
            vehicleInfo:{},
            insuranceInfo:{},
            map:{},
        };

        this.getMemberInfo(this.props.memberIdAndCarId);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({memberIdAndCarId:nextProps.memberIdAndCarId,gpsNo:nextProps.gpsNo},()=>{
            this.getMemberInfo(nextProps.memberIdAndCarId);
            this.getGpsLastestData(nextProps.gpsNo);
        });
    }

    /**
     * 根据会员ID和车辆ID获取会员相关信息
     * @param memberIdAndCarId  会员和车辆ID
     */
    getMemberInfo(memberIdAndCarId){
        getMemberRelationInfo({memberIdAndCarId:memberIdAndCarId}).then(data=>{
            this.setState({
                memberInfo:data.data.memberInfo,
                vehicleInfo:data.data.vehicleInfo,
                insuranceInfo:data.data.insuranceInfo
            });
        }).catch(err=>{
            console.log(err)
        });
    }

    /**
     * 根据GPS设备ID获取最新gps数据
     * @param gpsNo GPS设备ID
     */
    getGpsLastestData(gpsNo){
        getGpsLastestData({gpsNo:gpsNo}).then(data=>{
            if(data.data.success){
                this.state.map.showPoint(this.getGpsDivData(data.data.gpsData));
               //this.state.map.setCenter({lat:data.data.gpsData.LAT2,lng:data.data.gpsData.LNG2});
            }else{
                message.error('选择会员失败，请联系系统管理员！');
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    /**
     * 获取gps显示图层
     * @param gpsData
     * @returns {{id: string, name: string, lat: *, lng: *, icon: string, infoContent: string, buttonOpts: {name: string}}}
     */
    getGpsDivData(gpsData){
        let gpsDivData =  {id:'OWNER_LOC',
            name : '',
            lat:gpsData.LAT2,
            lng:gpsData.LNG2,
            icon:require(`../../assets/member.png`),
            infoContent:'<b>GPS设备位置:</b><br>'+gpsData.VEHICLE_GPS_TIME+'<br>状态：'+gpsData.VEHICLE_STATUS_NAME+'('+(gpsData.VEHICLE_STATUS_NAME==='行驶'?gpsData.SPEED+'km/h)':gpsData.SPEED+'分钟)')+'<br>'+gpsData.ADDRESS,
            buttonOpts:{name:'GPS位置'}
        };
        return gpsDivData;
    }

    /**
     * 显示车型
     * @param value 车型
     * @returns {*} 转化后的车型
     */
    showCarType(value){
        if(null == value || ''===value ){
            return value;
        }

        return value.replace(/,/g, '/');
    }

    /**
     * 显示值
     * @param obj 对象
     * @param key key值
     * @returns {*} value值
     */
    showValue(obj,key){
        if(null == obj || 'undefined' == obj || null == obj[key] || 'undefined' == obj[key]){
            return "";
        }

        return obj[key];
    }

    /**
     * 地图加载成功执行方法
     * @param map 地图
     */
    onMapReady(ref){
        this.setState({map:ref},()=>{
            this.getGpsLastestData(this.state.gpsNo);
        });
    }

    /**
     * 显示会员资料
     */
    viewMember(){
        this.props.searchAndShowMember(this.state.memberIdAndCarId);
    }
    render() {
        return (
            <div>
                <div id='memberInfo'>
                    <Row>
                        <Col span={3}>
                            <MemberLevel sex={this.showValue(this.state.memberInfo,'SEX')} memberLevel={this.showValue(this.state.memberInfo,'LEVEL')} headImage={this.showValue(this.state.memberInfo,'WECHAT_HEADIMGURL')}/>
                        </Col>
                        <Col span={21}>
                            <Row>
                                <Col span={5}>{this.showValue(this.state.memberInfo,'NAME')}{this.showValue(this.state.memberInfo,'SEX')==='0'?'先生':'女士'}</Col>
                                <Col span={5}>{this.showValue(this.state.memberInfo,'MOBILE_NO')}</Col>
                                <Col span={9}> </Col>
                                <Col span={5} style={{paddingRight:'10px'}}>
                                    <Button type="primary" onClick={()=>this.viewMember()}>搜索并查看该会员</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>车牌：{this.showValue(this.state.vehicleInfo,'VEHICLE_NUM')}</Col>
                                <Col span={7}>里程：{this.showValue(this.state.vehicleInfo,'CURRENT_MILE')}公里</Col>
                                <Col span={9}>车型：{this.showCarType(this.showValue(this.state.vehicleInfo,'CAR_MODEL'))}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>VIN码：{this.showValue(this.state.vehicleInfo,'VIN')}</Col>
                                <Col span={7}>颜色：{this.showValue(this.state.vehicleInfo,'COLOR')}</Col>
                                <Col span={9} style={{color:'red'}}>下次保养：{this.showValue(this.state.vehicleInfo,'NEXT_MAINTAIN_DATE')}；{this.showValue(this.state.vehicleInfo,'NEXT_MAINTAIN_MILE')}公里</Col>
                            </Row>
                            <Row>
                                <Col span={8}>抢盗险到期：{this.showValue(this.state.insuranceInfo,'COMMERCIAL_INS_DUE_DATE')}</Col>
                                <Col span={7} style={{color:'red'}}>商业险到期：{this.showValue(this.state.insuranceInfo,'COMMERCIAL_INS_DUE_DATE')}</Col>
                                <Col span={9} style={{color:'red'}}>交强险到期：{this.showValue(this.state.insuranceInfo,'COMPULSORY_INS_DUE_DATE')}</Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                <div id="map" style={{width:'750px',marginTop:'10px'}}>
                    <Map
                        showQueryControl={true}
                        showCityListControl={true}
                        currentCity="北京"
                        height="50vh"
                        onRef={(ref)=>this.onMapReady(ref)}
                    />
                </div>
            </div>);
    }
}
export default MemberArrived;
