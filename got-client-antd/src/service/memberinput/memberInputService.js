import {jsonRequest} from '../../util/request'

/**
 * 保存会员信息
 * @param args 会员信息
 * @returns {Promise} 保存是否成功标志
 */
export function saveMemberInfo(args) {
    return jsonRequest(`/memberInput/saveMemberInfo`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取车品牌列表
 * @returns {Promise} 品牌列表
 */
export function getCarBrandList() {
    return jsonRequest(`/memberInput/getCarBrandList`, {
        method: 'POST',
        body: {},
    });
}

/**
 * 获取会员列表
 * @returns {Promise} 会员列表
 */
export function getMemberList(args) {
    return jsonRequest(`/memberInput/getMemberList`, {
        method: 'POST',
        body: args,
    });
}


