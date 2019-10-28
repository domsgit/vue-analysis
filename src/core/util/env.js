/* @flow */

// can we use __proto__?
// __proto__ 是否可用？
export const hasProto = '__proto__' in {}

// Browser environment sniffing
// 浏览器类型探测
export const inBrowser = typeof window !== 'undefined'
export const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform
export const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android')
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios')
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
export const isPhantomJS = UA && /phantomjs/.test(UA)
export const isFF = UA && UA.match(/firefox\/(\d+)/)

// Firefox has a "watch" function on Object.prototype...
// Firfox有个"watch"方法，挂在Object.prototype上
export const nativeWatch = ({}).watch

// ???TODO???
export let supportsPassive = false
if (inBrowser) {
  try {
    const opts = {}
    Object.defineProperty(opts, 'passive', ({
      get () {
        /* istanbul ignore next */
        supportsPassive = true
      }
    }: Object)) // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts)
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
// 这个必须延后求值，因为可能vue在服务端渲染前加载设置VUE_ENV环境变量
let _isServer
// 是否是服务端渲染
export const isServerRendering = () => {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      // 检测服务端的存在并避免Webpack调整流程
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}

// detect devtools
// 检测devtools，条件为：在浏览器端+window上有__VUE_DEVTOOLS_GLOBAL_HOOK__非falsy的属性
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

// 判断是否是原生支持的
/* istanbul ignore next */
export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

// 判断是否支持Symbol
export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

// 内部实现Set，如果支持ES2015的Set，则用之，否则用垫片polyfill实现
let _Set
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  // 非标准的Set polyfill，仅支持原始类型作为值
  _Set = class Set implements SimpleSet {
    set: Object;
    constructor () {
      this.set = Object.create(null)
    }
    has (key: string | number) {
      return this.set[key] === true
    }
    add (key: string | number) {
      this.set[key] = true
    }
    clear () {
      this.set = Object.create(null)
    }
  }
}

// 定义简单的Set接口类型
export interface SimpleSet {
  has(key: string | number): boolean;
  add(key: string | number): mixed;
  clear(): void;
}

export { _Set }
