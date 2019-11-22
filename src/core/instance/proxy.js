/* not type checking this file because flow doesn't play well with Proxy */
// 该文件不类型检查，因为flow对Proxy支持不友好

/**
 * 全局代理
 */

import config from 'core/config'
import { warn, makeMap, isNative } from '../util/index'

// 初始化代理
let initProxy

if (process.env.NODE_ENV !== 'production') { // 非生成环境
  // 允许的全局类型、变量、对象、函数等
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )

  // 属性方法没有找到警告
  const warnNonPresent = (target, key) => {
    // 属性或方法在实例化的时候没有找到，但在渲染阶段引用了。请确保该属性是响应式的，
    // 无论是在data配置项上，或者是用类实现的组件上，请初始化属性。
    // 查看更多：https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }

  // 属性前缀解析警告
  const warnReservedPrefix = (target, key) => {
    // 属性必须以“$data.${key}”方式访问，因为避免属性以"$"或"_"开头，以防止在Vue实例上会与内部引用冲突。
    // 查看更多：https://vuejs.org/v2/api/#data
    warn(
      `Property "${key}" must be accessed with "$data.${key}" because ` +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    )
  }

  // 是否原生支持Proxy
  const hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy)

  if (hasProxy) {
    // 是否是内置的修饰符
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    // 代理config.keyCodes，监听属性修改，避免覆盖掉内建的修饰符
    config.keyCodes = new Proxy(config.keyCodes, {
      set(target, key, value) {
        if (isBuiltInModifier(key)) {
          // 避免覆盖内建修饰符
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }

  const hasHandler = {
    // 监听是否有某属性
    has(target, key) {
      // 是否存在
      const has = key in target
      // 是否允许
      const isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
      // 不存在 且 不允许，警告
      if (!has && !isAllowed) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }

  const getHandler = {
    // 监听属性取值
    get(target, key) {
      // 属性不存在，警告
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return target[key]
    }
  }

  initProxy = function initProxy(vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      // 确定要使用哪个代理处理程序
      const options = vm.$options
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler
      // 对vm._renderProxy的代理
      vm._renderProxy = new Proxy(vm, handlers)
    } else {
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
