import {jsonRequest} from '../../util/request'

/**
 * 获取投保收入
 * @param args 月份
 * @returns {Promise} 投保收入
 */
export function getInsuranceMemberIncomeList(args) {
    return jsonRequest(`/biInsurance/getInsuranceMemberIncomeList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取投保提醒情况
 * @param args 月份
 * @returns {Promise} 投保提醒情况
 */
export function getInsuranceRemindCountList(args) {
    return jsonRequest(`/biInsurance/getInsuranceRemindCountList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取续保提前时间
 * @param args 月份
 * @returns {Promise} 续保提前时间
 */
export function getInsuranceBeforeDaysList(args) {
    return jsonRequest(`/biInsurance/getInsuranceBeforeDaysList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取投保险种情况
 * @param args 月份
 * @returns {Promise} 投保险种情况
 */
export function getInsuranceVehicleRateList(args) {
    return jsonRequest(`/biInsurance/getInsuranceVehicleRateList`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取投保车辆总数
 * @param args 月份
 * @returns {Promise} 投保车辆总数
 */
export function getInsuranceVehicleCount(args) {
    return jsonRequest(`/biInsurance/getInsuranceVehicleCount`, {
        method: 'POST',
        body: args,
    });
}


/**
 * 获取投保来源数据
 * @param args 月份
 * @returns {Promise} 投保来源数据
 */
export function getInsuranceSourceCountList(args) {
    return jsonRequest(`/biInsurance/getInsuranceSourceCountList`, {
        method: 'POST',
        body: args,
    });
}

getInsuranceSourceCountList

















