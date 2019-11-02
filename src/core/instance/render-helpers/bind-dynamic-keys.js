/* @flow */

// helper to process dynamic keys for dynamic arguments in v-bind and v-on.
// For example, the following template:
//
// <div id="foo" :[key]="value">
//
// compiles to the following:
//
// _c('div', { attrs: bindDynamicKeys({ "id": "app" }, [key, value]) })

// v-bind和v-on中动态参数中处理动态键的辅助函数
// 例如，下面的模板：
//
// <div id="foo" :[key]="value">
//
// 编译执行等同如下：
//
// _c('div', { attrs: bindDynamicKeys({ "id": "app" }, [key, value]) })

import { warn } from 'core/util/debug'

export function bindDynamicKeys (baseObj: Object, values: Array<any>): Object {
  for (let i = 0; i < values.length; i += 2) {
    const key = values[i]
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1]
    } else if (process.env.NODE_ENV !== 'production' && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      // null是用于显式删除绑定的特殊值
      // 警告：无效的动态指令参数（期望字符串或是null）
      warn(
        `Invalid value for dynamic directive argument (expected string or null): ${key}`,
        this
      )
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
// 将修饰符运行时标记动态附加到事件名称的辅助函数。
// 确保仅在value已经为字符串时追加，否则将强制转换为string并导致类型检查丢失。
export function prependModifier (value: any, symbol: string): any {
  return typeof value === 'string' ? symbol + value : value
}
