/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

// 初始化全局接口
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      // 请不要直接替换Vue.config对象，可选的方案是设置个人的配置
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 暴露所有的工具函数。
  // 注意：这些方案不考虑公开成公共接口，尽量避免使用，除非你知道使用的风险。
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  // 全局挂载 手动更新数据触发视图变化的方法
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  // 2.6 公开的observable接口
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 初始化 组件、指令、过滤
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  // 这用于标识“基本”构造函数以扩展所有纯对象
  // Weex的多实例方案中的组件。
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  // 初始化use
  initUse(Vue)
  // 初始化 混入
  initMixin(Vue)
  // 初始化 扩展
  initExtend(Vue)
  // 初始化资源注册
  initAssetRegisters(Vue)
}
