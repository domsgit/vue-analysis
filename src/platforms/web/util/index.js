/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * Query an element selector if it's not an element already.
 * 如果还不是元素，查询元素选择器
 */
export function query (el: string | Element): Element {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      // 非生产环境警告不能找到元素
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      // 不存在，则返回一个空的元素
      return document.createElement('div')
    }
    // 存在，返回找到的元素
    return selected
  } else {
    return el
  }
}
