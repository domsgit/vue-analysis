/* @flow */

import type Watcher from './watcher'
// remove 定义在 src/shared/util.js
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * dep是可观察的，可以有多个订阅它的指令。
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++
    this.subs = []
  }

  // 新增观察者
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  // 移除观察者
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  // 评估当前目标观察者
  depend() {
    if (Dep.target) { // 如果有目标观察者
      Dep.target.addDep(this)
    }
  }

  // 观察者订阅了信息，当信息有更新，通知各个观察者
  notify() {
    // stabilize the subscriber list first
    // 稳定订阅列表
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      // 订阅列表未在同步的调用程序中排序，需要排序以按正确的顺序执行
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// 当前正在评估的目标观察者。这是全局唯一的，因为一次只有一个观察者可以评估。
Dep.target = null
const targetStack = []

// 推入目标观察者
export function pushTarget(target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

// 移除目标观察者
export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
