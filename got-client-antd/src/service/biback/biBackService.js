import {jsonRequest} from '../../util/request'

/**
 * 获取会员回厂趋势
 * @param args 月份
 * @returns {Promise} 会员回厂趋势数据集合
 */
export function getMemberBackCountMap(args) {
    return jsonRequest(`/biBack/getMemberBackCountMap`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 根据会员等级统计回厂月份数据
 * @param args 月份
 * @returns {Promise} 会员等级统计回厂月份数据
 */
export function getBackCountByMemberLevel(args) {
    return jsonRequest(`/biBack/getBackCountByMemberLevel`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取售后收入统计数据
 * @param args 月份
 * @returns {Promise} 售后收入统计数据
 */
export function getServiceFeeList(args) {
    return jsonRequest(`/biBack/getServiceFeeList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取提前预约和未未提前预约服务数量
 * @param args 月份
 * @returns {Promise} 提前预约和未未提前预约服务数量
 */
export function getPreAppointmentList(args) {
    return jsonRequest(`/biBack/getPreAppointmentList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取会员到店距离分布数据
 * @param args 月份
 * @returns {Promise} 会员到店距离分布数据
 */
export function getToShopDistanceList(args) {
    return jsonRequest(`/biBack/getToShopDistanceList`, {
        method: 'POST',
        body: args,
    });
}












