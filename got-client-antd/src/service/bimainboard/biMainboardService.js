import {jsonRequest} from '../../util/request'

/**
 * 获取计划今日邀约提醒数
 * @param args 提醒类型
 * @returns {Promise} 计划今日邀约提醒数
 */
export function getTodayRemindCount(args) {
    return jsonRequest(`/mainBoard/getTodayRemindCount`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取今日邀约数
 * @param args 空
 * @returns {Promise} 获取今日邀约数
 */
export function getTodayMoney(args) {
    return jsonRequest(`/mainBoard/getTodayMoney`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取今日新增会员
 * @param args 空
 * @returns {Promise} 获取今日新增会员
 */
export function getTodayNewMemberList(args) {
    return jsonRequest(`/mainBoard/getTodayNewMemberList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取今日新增会员到店距离
 * @param args 空
 * @returns {Promise} 获取今日新增会员到店距离
 */
export function getNewToShopDistanceList(args) {
    return jsonRequest(`/mainBoard/getNewToShopDistanceList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取今日服务列表
 * @param args 空
 * @returns {Promise} 今日服务列表
 */
export function getTodayServiceList(args) {
    return jsonRequest(`/mainBoard/getTodayServiceList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取今日服务时间列表
 * @param args 空
 * @returns {Promise} 今日服务时间列表
 */
export function getTodayServiceTimeList(args) {
    return jsonRequest(`/mainBoard/getTodayServiceTimeList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取今日服务类型列表
 * @param args 空
 * @returns {Promise} 今日服务类型表
 */
export function getTodayServiceTypeList(args) {
    return jsonRequest(`/mainBoard/getTodayServiceTypeList`, {
        method: 'POST',
        body: args,
    });
}











