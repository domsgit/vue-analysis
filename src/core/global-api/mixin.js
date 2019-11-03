/* @flow */

import { mergeOptions } from '../util/index'

// 初始化混入
export function initMixin (Vue: GlobalAPI) {
  // 混入定义
  Vue.mixin = function (mixin: Object) {
    // 合并混入配置项
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
