/* @flow */

import { toArray } from '../util/index'

// https://cn.vuejs.org/v2/api/?#Vue-use
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 已经安装了的插件有哪些？（一开始时为空数组）
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 如果该插件已经安装了，则直接返回，不继续往下走
    if (installedPlugins.indexOf(plugin) > -1) {
      // 返回Vue，以便链式调用
      return this
    }

    // additional parameters
    // 附加的参数类数组转为数组
    const args = toArray(arguments, 1)
    // 转成的数组参数前添加Vue，以便拿到Vue及其原型上的属性和方法
    args.unshift(this)
    // 执行插件
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 把该插件归入已安装的插件数组
    installedPlugins.push(plugin)
    // 返回Vue，以便链式调用
    return this
  }
}
