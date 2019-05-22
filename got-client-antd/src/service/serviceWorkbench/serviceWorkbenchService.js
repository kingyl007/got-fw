import {jsonRequest} from '../../util/request'


/**
 * 保存回访记录
 * @param args 回访记录
 * @returns {Promise} 保存是否成功标志
 */
export function saveCallbackInfo(args) {
    return jsonRequest(`/serviceWorkbench/saveCallbackInfo`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取待办事项列表
 * @returns {Promise} 待办事项列表
 */
export function getTodoList() {
    return jsonRequest(`/serviceWorkbench/getTodoList`, {
        method: 'POST',
        body: {},
    });
}

/**
 * 获取提醒中心列表
 * @returns {Promise} 提醒中心列表
 */
export function getRemindList() {
    return jsonRequest(`/serviceWorkbench/getRemindList`, {
        method: 'POST',
        body: {},
    });
}

/**
 * 获取客服工作台右侧信息
 * @returns {Promise} 客服工作台右侧信息
 */
export function getServicePageInfo(args) {
    return jsonRequest(`/serviceWorkbench/getServicePageInfo`, {
        method: 'POST',
        body: args,
    });
}

/**
 * 获取会员相关信息，包括会员信息、车辆信息、保险信息、回访历史、历史保养
 * @param args 会员和车辆ID
 * @returns {Promise} 会员相关信息
 */
export function getRemindDetailInfo(params) {
    return jsonRequest(`/serviceWorkbench/getRemindDetailInfo`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 加入待办列表
 * @param args 会员和车辆ID
 * @returns {Promise} 会员相关信息
 */
export function addTodoList(params) {
    return jsonRequest(`/serviceWorkbench/addTodoList`, {
        method: 'POST',
        body: params,
    });
}

/**
 * 检查该提醒是否关联人员账号
 * @param params
 * @returns {Promise}
 */
export function checkRemind(params) {
    return jsonRequest(`/serviceWorkbench/checkRemind`, {
        method: 'POST',
        body: params,
    });
}