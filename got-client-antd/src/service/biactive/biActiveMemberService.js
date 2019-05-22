/**
 * Created by Administrator on 2019/1/2 0002.
 */
import {jsonRequest} from '../../util/request'

/**
 *  获取一年期活跃会员消费总额分布集合
 * @returns {Promise}  一年期活跃会员消费总额分布分析
 */
export function getMemberConsumptionList(args) {
    return jsonRequest(`/biActiveMember/getActiveMemberConsumptionList`, {
        method: 'POST',
        body: args,
    });
}
/**
 *  获取最后一次回厂会员分布数据
 * @returns {Promise} 最后一次回厂会员分布数据
 */
export function getMemberLastBackList(args) {
    return jsonRequest(`/biActiveMember/getActiveMemberLastBackList`, {
        method: 'POST',
        body: args,
    });
}
/**
 *  获取活跃会员回厂次数分布
 * @returns {Promise} 活跃会员回厂次数分布
 */
export function getMemberBackCountList(args) {
    return jsonRequest(`/biActiveMember/getActiveMemberBackCountList`, {
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
    return jsonRequest(`/biActiveMember/getMemberLevelData`, {
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
    return jsonRequest(`/biActiveMember/getToShopDistanceList`, {
        method: 'POST',
        body: args,
    });
}