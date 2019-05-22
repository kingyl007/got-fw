import {jsonRequest} from '../../util/request'


/**
 * 获取待办事项列表
 * @returns {Promise} 待办事项列表
 */
export function getTodoList() {
    return jsonRequest(`/insuranceWorkbench/getTodoList`, {
        method: 'POST',
        body: {},
    });
}

/**
 * 获取提醒中心列表
 * @returns {Promise} 提醒中心列表
 */
export function getRemindList() {
    return jsonRequest(`/insuranceWorkbench/getRemindList`, {
        method: 'POST',
        body: {},
    });
}

/**
 * 保存提醒记录
 * @param args 提醒记录
 * @returns {Promise} 保存是否成功标志
 */
export function saveRemindFollowInfo(args) {
    return jsonRequest(`/insuranceWorkbench/saveRemindFollowInfo`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 保存保险记录
 * @param args 保险记录
 * @returns {Promise} 保存是否成功标志
 */
export function saveInsuranceInfo(args) {
    return jsonRequest(`/insuranceWorkbench/saveInsuranceInfo`, {
        method: 'POST',
        body: args,
    });
}


/**
 * 获取保险工作台右侧信息
 * @returns {Promise} 保险工作台右侧信息
 */
export function getInsurancePageInfo(args) {
    return jsonRequest(`/insuranceWorkbench/getInsurancePageInfo`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取消息
 * @returns {Promise} 消息
 */
export function getMessageInfo(args) {
    return jsonRequest(`/insuranceWorkbench/getMessageInfo`, {
        method: 'POST',
        body: args,
    });
}


/**
 * 更新消息状态
 * @param args
 * @returns {Promise}
 */
export function updateMsgStatus(args) {
    return jsonRequest(`/insuranceWorkbench/updateMsgStatus`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取跟进记录
 * @returns {Promise}
 */
export function getRemindFollow(args) {
    return jsonRequest(`/insuranceWorkbench/getRemindFollow`, {
        method: 'POST',
        body: args,
    });
}