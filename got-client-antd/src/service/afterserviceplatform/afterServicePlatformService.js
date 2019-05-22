import {jsonRequest} from '../../util/request'

/**
 * 获取会员相关信息，包括会员信息、车辆信息、保险信息、服务记录
 * @param args 会员和车辆ID
 * @returns {Promise} 会员相关信息
 */
export function getMemberRelationInfo(params) {
    return jsonRequest(`/afterServicePlatform/getMemberRelationInfo`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 保存服务记录
 * @param params 服务记录
 * @returns {Promise} 是否保存成功标志
 */
export function saveServiceInfo(params){
    return jsonRequest(`/afterServicePlatform/saveServiceInfo`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据会员ID获取服务记录
 * @param params 会员ID
 * @returns {Promise} 服务记录列表
 */
export function getServiceListByMemberId(params){
    return jsonRequest(`/afterServicePlatform/getServiceListByMemberId`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据登录用户ID获取服务记录
 * @returns {Promise} 服务记录列表
 */
export function getTodayServiceList(){
    return jsonRequest(`/afterServicePlatform/getTodayServiceList`, {
        method: 'POST',
        body: {},
    });
}

/**
 * 根据状态获取消息记录
 * @param params 状态
 * @returns {Promise} 服务记录列表
 */
export function getMsgByStatus(params){
    return jsonRequest(`/afterServicePlatform/getMsgByStatus`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据服务ID获取服务详情
 * @param params 服务ID
 * @returns {Promise} 服务详情
 */
export function getServiceDetailById(params){
    return jsonRequest(`/afterServicePlatform/getServiceDetailById`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据会员ID获取提醒记录列表
 * @param params 会员ID
 * @returns {Promise} 提醒记录列表
 */
export function getRemindAndFollowList(params){
    return jsonRequest(`/afterServicePlatform/getRemindAndFollowList`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据车辆ID更新当前里程
 * @param params 车辆ID和当前里程
 * @returns {Promise} 更新是否成标志
 */
export function updateCurrentMile(params){
    return jsonRequest(`/afterServicePlatform/updateCurrentMile`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据会员ID更新会员资料
 * @param params 会员ID和会员信息
 * @returns {Promise} 更新是否成标志
 */
export function updateMemberInfo(params){
    return jsonRequest(`/afterServicePlatform/updateMemberInfo`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据会员ID获取会员保养和投保统计数据
 * @param params 会员ID
 * @returns {Promise} 保养和投保统计数据
 */
export function getTotalServiceInfo(params){
    return jsonRequest(`/afterServicePlatform/getTotalServiceInfo`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据gps设备ID获取最新gps数据
 * @param params gps设备ID
 * @returns {Promise} gps最新数据
 */
export function getGpsLastestData(params){
    return jsonRequest(`/afterServicePlatform/getGpsLastestData`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 根据消息id获取最新gps和手机位置信息
 * @param params 消息id
 * @returns {Promise} 最新gps和手机位置信息
 */
export function getRescueGpsLastestData(params){
    return jsonRequest(`/afterServicePlatform/getRescueGpsLastestData`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 保存车牌号
 * @param params 车辆ID和车牌号
 * @returns {Promise} 是否保存成功标志
 */
export function saveCarNumer(params){
    return jsonRequest(`/afterServicePlatform/saveCarNumer`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 更新消息状态
 * @param params 消息id
 * @returns {Promise} 消息是否已读标志
 */
export function updateMsgHaveRead(params){
    return jsonRequest(`/afterServicePlatform/updateMsgHaveRead`, {
        method: 'POST',
        body: params,
    });
}










