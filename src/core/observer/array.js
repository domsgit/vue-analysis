/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 * 该文件没有flow校验，因为flow对数组原型的动态添加方法不友好
 */

// def 定义在 ../util/lang.js
// def 用来定义属性值和是否可数
import { def } from '../util/index'

// Array的原型
const arrayProto = Array.prototype
// array的方法（继承自Array的原型）
export const arrayMethods = Object.create(arrayProto)

// 方法补丁
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 * 拦截突变的方法并触发事件
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 缓存所有原始的方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 通知修改
    ob.dep.notify()
    return result
  })
})
