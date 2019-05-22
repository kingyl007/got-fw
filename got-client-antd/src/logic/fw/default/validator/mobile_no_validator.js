import * as got from '../../../got';

/**
 * 校验输入值是否符合格式
 * @param {*} value 待校验的值
 * @param {*} record 待操作记录，对于列表来说就是对应的行
 * @param {*} index 待操作记录索引
 * @param {*} column 对应列定义
 * @param {*} view 画面实例
 * @returns true校验通过，false校验不通过
 */
export function validate(value, record, index, column, view) {
  if (value) {
    return got.validMobileNo(value);
  }
  return true;
}

/**
 * 校验错误时的提示信息
 * @param {*} value 待校验的值
 * @param {*} record 待操作记录，对于列表来说就是对应的行
 * @param {*} index 待操作记录索引
 * @param {*} column 对应列定义
 * @param {*} view 画面实例
 * @returns true校验通过，false校验不通过
 */
export function errorMsg(value, record, index, column, view) {
  return "请输入正确的" + column.label;
}