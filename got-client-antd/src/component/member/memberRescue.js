import {Component} from 'react';
import MemberLevel from './memberLevel';
import {Map} from '../fw/map';
import {Row, Col, Modal} from 'antd';
import {getMemberRelationInfo,getRescueGpsLastestData} from '../../service/afterserviceplatform/afterServicePlatformService';
import copy from 'copy-to-clipboard';

class MemberRescue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberIdAndCarId:this.props.memberIdAndCarId,
            msgId:this.props.msgId,
            memberInfo:{},
            vehicleInfo:{},
            insuranceInfo:{},
            gpsData:{},
            map:{},
        };

        this.getMemberInfo(this.props.memberIdAndCarId);
        this.getGpsLastestData(this.props.msgId);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({memberIdAndCarId:nextProps.memberIdAndCarId,msgId:nextProps.msgId},()=>{
            this.getMemberInfo(nextProps.memberIdAndCarId);
            this.getGpsLastestData(nextProps.msgId);
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
     * 根据消息id获取最新gps和手机位置信息
     * @param msgId 消息ID
     */
    getGpsLastestData(msgId){
        getRescueGpsLastestData({msgId:msgId}).then(data=>{
            if(data.data.success){
                this.state.map.showPoint({...this.getGpsDivData(data.data.gpsData), centerToOverlay:true});
                this.state.map.showPoint({...this.getPhoneDivData(data.data.gpsData), centerToOverlay:false});
                this.setState({gpsData:data.data.gpsData});
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
            lat:gpsData.LAT,
            lng:gpsData.LNG,
            icon:require(`../../assets/car.png`),
            infoContent:'<b>GPS设备位置:</b><br>'+gpsData.VEHICLE_GPS_TIME+'<br>'+this.showAddress(gpsData.ADDRESS) + '<br>',
            buttonOpts:{name:'GPS位置' ,offset:{x:20, y:60}}
        };
        return gpsDivData;
    }

    /**
     * 获取gps显示图层
     * @param gpsData
     * @returns {{id: string, name: string, lat: *, lng: *, icon: string, infoContent: string, buttonOpts: {name: string}}}
     */
    getPhoneDivData(gpsData){
        console.log(gpsData)
        let gpsDivData =  {id:'OWNER_LOC1',
            name : '',
            lat:gpsData.MEMBER_LAT,
            lng:gpsData.MEMBER_LNG,
            icon:require(`../../assets/member.png`),
            infoContent:'<b>车主手机定位位置:</b><br>'+gpsData.MEMBER_PHONE_TIME+'<br>'+this.showAddress(gpsData.MEMBER_ADDRESS),
            buttonOpts:{name:'手机位置'}
        };
        return gpsDivData;
    }

    /**
     * 显示车型
     * @param value 车型
     * @returns {*} 转化后的车型
     */
    showAddress(value){
        if(null == value || ''===value ){
            return value;
        }

        return value.replace(/、/g, '');
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

    copyRescueInfo(value){
        let resuceInfo = this.showValue(this.state.memberInfo,'NAME')+(this.showValue(this.state.memberInfo,'SEX')==='0'?'先生':'女士')+', '+this.state.memberInfo.MOBILE_NO+'      车牌号：'+this.showValue(this.state.vehicleInfo,'VEHICLE_NUM')
        +'     颜色：'+this.showValue(this.state.vehicleInfo,'COLOR')+'     车型：'+this.showCarType(this.showValue(this.state.vehicleInfo,'CAR_MODEL'))+'     车主手机定位：'+this.state.gpsData.MEMBER_PHONE_TIME+' '+this.state.gpsData.MEMBER_ADDRESS
        +'     GPS设备位置：'+this.state.gpsData.VEHICLE_GPS_TIME+' '+this.state.gpsData.ADDRESS;
        copy(resuceInfo);
    }

    render() {
        return (
            <div>
                <div id='memberInfo'>
                    <Row>
                        <Col span={3}>{this.showValue(this.state.memberInfo,'NAME')}{this.showValue(this.state.memberInfo,'SEX')==='0'?'先生':'女士'}</Col>
                        <Col span={3}>{this.showValue(this.state.memberInfo,'MOBILE_NO')}</Col>
                        <Col span={4}>车牌：{this.showValue(this.state.vehicleInfo,'VEHICLE_NUM')}</Col>
                        <Col span={4}>颜色：{this.showValue(this.state.vehicleInfo,'COLOR')}</Col>
                        <Col span={5}>车型：{this.showCarType(this.showValue(this.state.vehicleInfo,'CAR_MODEL'))}</Col>
                        <Col span={5}><a onClick={()=>this.copyRescueInfo()}>复制救援信息</a></Col>
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
export default MemberRescue;
