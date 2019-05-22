import {jsonRequest} from '../../util/request'

/**
 *  获取本月新增会员数据分析集合
 * @param args 月份
 * @returns {Promise}  本月新增会员数据分析
 */
export function getNewMemberCountList(args) {
    return jsonRequest(`/biNewMember/getNewMemberCountList`, {
        method: 'POST',
        body: args,
    });
}
/**
 *  获取本月新增会员趋势集合
 * @param args 月份
 * @returns {Promise}  本月新增会员趋势分析
 */
export function getNewMemberTrendList(args) {
    return jsonRequest(`/biNewMember/getNewMemberTrendList`, {
        method: 'POST',
        body: args,
    });
}
/**
 *  获取本月新增会员车价格分布集合
 * @param args 月份
 * @returns {Promise}  本月新增会员车价格分布集合
 */
export function getNewMemberPriceList(args) {
    return jsonRequest(`/biNewMember/getNewMemberPriceList`, {
        method: 'POST',
        body: args,
    });
}
/**
 *  获取本月新增会员购车投保率
 * @param args 月份
 * @returns {Promise}  本月新增会员购车投保率
 */
export function getNewMemberInsureRatioMap(args) {
    return jsonRequest(`/biNewMember/getNewMemberInsureRatioMap`, {
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
    return jsonRequest(`/biNewMember/getToShopDistanceList`, {
        method: 'POST',
        body: args,
    });
}
