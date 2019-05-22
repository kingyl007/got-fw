import {jsonRequest} from '../../util/request'

/**
 * 获取本月新增会员数量
 * @param args 月份
 * @returns {Promise} 本月新增会员数量
 */
export function getMonthNewMemberCount(args) {
    return jsonRequest(`/mainPage/getMonthNewMemberCount`, {
        method: 'POST',
        body: args,
    });
}


/**
 * 获取本月回厂数量
 * @param args 月份
 * @returns {Promise} 本月回厂数量
 */
export function getMonthBackMemberCount(args) {
    return jsonRequest(`/mainPage/getMonthBackMemberCount`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取本月保险收入
 * @param args 月份
 * @returns {Promise} 本月保险收入
 */
export function getMonthInsuranceMoney(args) {
    return jsonRequest(`/mainPage/getMonthInsuranceMoney`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取一年期活跃会员数量
 * @param args 空
 * @returns {Promise} 年期活跃会员数量
 */
export function getYearActiveMemberCount(args) {
    return jsonRequest(`/mainPage/getYearActiveMemberCount`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取会员等级分布数据
 * @param args 空
 * @returns {Promise} 年期活跃会员数量
 */
export function getMemberLevelData(args) {
    return jsonRequest(`/mainPage/getMemberLevelData`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取会员评分数据
 * @param args 月份
 * @returns {Promise} 会员评分数据
 */
export function getMemberRankingList(args) {
    return jsonRequest(`/mainPage/getMemberRankingList`, {
        method: 'POST',
        body: args,
    });
}


/**
 * 获取三十天回厂数据
 * @param args 空
 * @returns {Promise} 三十天回厂数据
 */
export function getThirtyDaysBackCount(args) {
    return jsonRequest(`/mainPage/getThirtyDaysBackCount`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取售后收入排行榜
 * @param args 月份，类型
 * @returns {Promise} 售后收入排行榜
 */
export function getMonthMoney(args) {
    return jsonRequest(`/mainPage/getMonthMoney`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取会员地址信息
 * @param args 空
 * @returns {Promise} 会员地址信息
 */
export function getMemberLocalList(args) {
    return jsonRequest(`/mainPage/getMemberLocalList`, {
        method: 'POST',
        body: args,
    });
}
























