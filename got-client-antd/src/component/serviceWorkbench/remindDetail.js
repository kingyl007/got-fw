import {Component} from 'react';
import MemberLevel from '../member/memberLevel';
import {Form, Input, Row, Col, Radio, Select, Table, Button, Rate , Modal, Divider} from 'antd';

import styles from '../../page/projects/zd4s/serviceWorkbench.less';
import {getRemindDetailInfo, addTodoList, checkRemind} from "../../service/serviceWorkbench/serviceWorkbenchService";

class RemindDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remindDetailIndex:this.props.remindDetailIndex,
            remindDetailType:this.props.remindDetailType,
            type:this.props.type,
            memberInfo:{},
            vehicleInfo:{},
            insuranceInfo:{},
            callbackHistory:[],
            serviceHistory:[],
            insuranceHistory:[],
        };

        this.getRemindDetailInfo(this.props.remindDetailIndex);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({remindDetailIndex:nextProps.remindDetailIndex, type: nextProps.type, remindDetailType: nextProps.remindDetailType},()=>{
            this.getRemindDetailInfo(nextProps.remindDetailIndex);
        });
    }

    /**
     * 根据会员ID和车辆ID获取会员相关信息
     * @param remindDetailIndex  提醒、会员和车辆ID
     */
    getRemindDetailInfo(remindDetailIndex){
        getRemindDetailInfo({remindDetailIndex:remindDetailIndex}).then(data=>{
            this.setState({
                memberInfo:data.data.remindDetailInfo.memberInfo,
                vehicleInfo:data.data.remindDetailInfo.vehicleInfo,
                insuranceInfo:data.data.remindDetailInfo.insuranceInfo,
                callbackHistory:data.data.remindDetailInfo.callbackHistory,
                serviceHistory:data.data.remindDetailInfo.serviceHistory,
                insuranceHistory:data.data.remindDetailInfo.insuranceHistory
            });
        }).catch(err=>{
            console.log(err)
        });
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
     * 立刻跟进
     * @param e
     */
    followNow = (e) => {
        this.props.followNow();
    };

    /**
     * 加入待办
     * @param e
     */
    addTodoList = (e) => {
        this.props.addTodoList();
    };

    render() {
        //回访历史表格列名
        const callBackHistoryColumns = [{
            title: '回访时间',
            dataIndex: 'CALL_TIME',
            key: 'CALL_TIME',
            width:'15%',
        }, {
            title: '状态',
            dataIndex: 'FOLLOW_STATUS',
            key: 'FOLLOW_STATUS',
            width:'15%',
            //拼接回访记录状态
            render: function(text, record, index){
                if(text === '0'){
                    if(record.RETURN_DESIRE === '0'){
                        return  <span>待跟进&意愿弱</span>;
                    }else if(record.RETURN_DESIRE === '1'){
                        return  <span>待跟进&意愿中</span>;
                    }else{
                        return  <span>待跟进&意愿强</span>;
                    }
                }else if(text === '1'){
                    return  <span>已预约{record.PLAN_CALLBACK_DATE}</span>;
                }else{
                    return  <span>已战败</span>;
                }
            },
        }, {
            title: '计划再次回访',
            dataIndex: 'PLAN_RE_CALLBACK_DATE',
            key: 'PLAN_RE_CALLBACK_DATE',
            width:'18%',
        }, {
            title: '跟进人',
            dataIndex: 'FOLLOWER',
            key: 'FOLLOWER',
            width:'15%',
        }, {
            title: '备注',
            dataIndex: 'MEMO',
            key: 'MEMO',
        }];

        const serviceHistoryColumns = [{
            title: '保养时间',
            dataIndex: 'SERVICE_TIME',
            key: 'SERVICE_TIME',
        }, {
            title: '保养时里程(公里)',
            dataIndex: 'MILE',
            key: 'MILE',
        }, {
            title: '备注',
            dataIndex: 'MEMO',
            key: 'MEMO',
        }, {
            title: '评价',
            dataIndex: 'MEMBER_REMARKING',
            key: 'MEMBER_REMARKING',
        }, {
            title: '评分',
            dataIndex: 'MEMBER_RANKING',
            key: 'MEMBER_RANKING',
        }];

        //投保历史表格列名
        const insuranceHistoryColumns = [{
            title: '保险到期',
            dataIndex: 'INS_DUE',
            key: 'INS_DUE',
            width:'15%'
        }, {
            title: '险种',
            dataIndex: 'INS_TYPE',
            key: 'INS_TYPE',
            width:'10%',
            render: function(text, record, index){
                if(text === '1'){
                    return  <span>交强险</span>;
                }else if(text === '2'){
                    return  <span>商业险</span>;
                }else if(text === '4'){
                    return  <span>盗抢险</span>;
                }
            },
        }, {
            title: '投保来源',
            dataIndex: 'INS_SOURCE',
            key: 'INS_SOURCE',
            width:'15%',
            render: function(text, record, index){
                if(text === '1'){
                    return  <span>新车投保</span>;
                }else if(text === '2'){
                    return  <span>新车续保</span>;
                }else if(text === '3'){
                    return  <span>自店续保</span>;
                }else if(text === '4'){
                    return  <span>新拓续保</span>;
                }
            },
        }, {
            title: '保费金额(元)',
            dataIndex: 'INS_FEE',
            key: 'INS_FEE',
            width:'17%',
        }, {
            title: '保单项目',
            dataIndex: 'INS_ITEMS',
            key: 'INS_ITEMS',
        }];


        return (
            <div>
                <div id='memberInfo'>
                    <Row>
                        <Col span={3}>
                            <MemberLevel sex={this.showValue(this.state.memberInfo,'SEX')} memberLevel={this.showValue(this.state.memberInfo,'LEVEL')} headImage={this.showValue(this.state.memberInfo,'WECHAT_HEADIMGURL')}/>
                        </Col>
                        <Col span={21}>
                            <Row className={styles.memberInfo}>
                                <Col span={5}>
                                    <span className={styles.memberInfoName}>{this.showValue(this.state.memberInfo,'NAME')}</span>
                                    <span>{this.showValue(this.state.memberInfo,'SEX')==='0'?'(先生)':'(女士)'}</span>
                                </Col>
                                <Col span={19}>
                                    {this.showValue(this.state.memberInfo,'MOBILE_NO')}
                                    <Button type="primary" style={{marginLeft:30}} onClick={()=>this.followNow()}>立刻跟进</Button>
                                    <Button type="primary" style={{marginLeft:20}} onClick={()=>this.addTodoList()}>加入待办</Button>
                                </Col>
                            </Row>
                            <Row className={styles.memberInfo} style={{marginTop:15}}>
                                <Col span={10}>会员积分：{this.showValue(this.state.memberInfo,'BONUS')}</Col>
                                <Col span={7}>车牌：{this.showValue(this.state.vehicleInfo,'VEHICLE_NUM')}</Col>
                                <Col span={7}>会员来源：{this.showValue(this.state.memberInfo,'MEMBER_SOURCE')==='1'?'自店购车':'售后开拓'}</Col>
                            </Row>
                            <Row className={styles.memberInfo} style={{marginTop:7}}>
                                <Col span={10}>VIN码：{this.showValue(this.state.vehicleInfo,'VIN')}</Col>
                                <Col span={7}>车型：{this.showValue(this.state.vehicleInfo,'CAR_MODEL')}</Col>
                                <Col span={7}><span>盗抢险到期：{this.showValue(this.state.insuranceInfo,'THEFT_INS_DUS_DATE')}</span></Col>
                            </Row>
                            <div style={{width:'100%', display: this.state.type === 'service' ? 'block':'none'}}>
                                <Row className={styles.memberInfo} style={{marginTop:7}}>
                                    <Col span={10} style={{color:'red'}}>当前里程：{this.showValue(this.state.vehicleInfo,'CURRENT_MILE')}公里</Col>
                                    <Col span={14} style={{color:'red'}}>下次保养：{this.showValue(this.state.vehicleInfo,'NEXT_MAINTAIN_DATE')}；{this.showValue(this.state.vehicleInfo,'NEXT_MAINTAIN_MILE')}公里</Col>
                                </Row>
                            </div>
                            <div style={{width:'100%', display: this.state.type === 'insurance' ? 'block':'none'}}>
                                <Row className={styles.memberInfo} style={{marginTop:7}}>
                                    <Col span={10}>
                                        <span style={{color: this.state.remindDetailType === '2' || this.state.remindDetailType === '3' ? 'red':'black'}}>
                                            商业险到期：{this.showValue(this.state.insuranceInfo,'COMMERCIAL_INS_DUE_DATE')}
                                        </span>
                                    </Col>
                                    <Col span={7}>
                                        <span style={{color: this.state.remindDetailType === '1' || this.state.remindDetailType === '3'?'red':'black'}}>
                                            交强险到期：{this.showValue(this.state.insuranceInfo,'COMPULSORY_INS_DUE_DATE')}
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <div style={{maxHeight:'320px',overflow:'auto'}}>
                        <div style={{width:'100%',paddingTop:'20px'}}>
                            <p className={styles.callbackTitle}>回访记录</p>

                            <Table columns={callBackHistoryColumns} pagination={false} dataSource={this.state.callbackHistory}   size="small"/>
                        </div>


                        <div style={{width:'100%', paddingTop:'20px',display: this.state.type === 'service' ? 'block':'none'}}>
                            <p className={styles.callbackTitle}>保养记录</p>

                            <Table columns={serviceHistoryColumns} pagination={false} dataSource={this.state.serviceHistory}   size="small"/>
                        </div>

                        <div style={{width:'100%', paddingTop:'20px',display: this.state.type === 'insurance' ? 'block':'none'}}>
                            <p className={styles.callbackTitle}>投保记录</p>

                            <Table columns={insuranceHistoryColumns} pagination={false} dataSource={this.state.insuranceHistory}  size="small"/>
                        </div>
                    </div>
                </div>


            </div>);
    }
}
export default RemindDetail;
