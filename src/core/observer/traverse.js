/* @flow */

// isObject: ../util/lang.js
// _Set: ../util/env.js
import { _Set as Set, isObject } from '../util/index'
// SimpleSet: ../util/env.js
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

// 实例化
const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 * 递归遍历一个对象以唤起所有已转换的取值器，使对象内的每个嵌套属性都被收集为“深度”依赖项。
 */
export function traverse(val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse(val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  // 非数组 且 非对象，或者 被冻结，或者 继承自VNode类，则退出
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) { // 存有，退出，不重复存
      return
    }
    seen.add(depId) // 添加
  }
  if (isA) { // 数组，递归遍历子元素检查是否需要加入依赖项
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else { // 对象，递归
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
