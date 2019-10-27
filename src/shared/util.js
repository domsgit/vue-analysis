/* @flow */

// 冻结空对象
export const emptyObject = Object.freeze({})

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
// 这能在JS引擎中更好的性能，因为函数内联式的直言不讳
// 判断是否是undefined或是null
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

// 判断是否是定义了的，即除了undefined和null
export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}

// 判断是否严格为true
export function isTrue (v: any): boolean %checks {
  return v === true
}

// 判断是否严格为false
export function isFalse (v: any): boolean %checks {
  return v === false
}

/**
 * Check if value is primitive.
 * 判断value是否是原始类型
 */
export function isPrimitive (v: any): boolean %checks {
  return (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    // $flow-disable-line
    typeof v === 'symbol'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 * 快速object类型校验 - 主要是用来从JSON中的原始值中判断Object类型
 */
export function isObject (v: any): boolean %checks {
  return v !== null && typeof v === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 * 得到一个值的原始类型字符串，如：[object Object]
 */
export const _toString = Object.prototype.toString

// 得到原始类型
export function toRawType (value: any): string {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 * 严格校验object类型。只有原始的JavaScript对象才返回true
 */
export function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}

// 判断是否是正则
export function isRegExp (v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 * 校验val是否是一个有效的数组索引
 */
export function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

// 判断是否是Promise
// 定义了的+有then方法+有catch方法
export function isPromise (val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 * 转化一个已经渲染的值成字符串
 * 函数体内等效于：
 *    val == null ? '' : (
 *     (Array.isArray(val) || (isPlainObject(val) && (val.toString === _toString)))
 *     ? JSON.stringify(val, null, 2)
 *     : String(val)
 *    )
 * 也就是： null、undefined转成空字符串；数组和没有重定义toString方法的对象用JSON.stringify转成字符串；
 *        其他直接用String转成字符串
 */
export function toString (val: any): string {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 * 把输入的值转成数值类型以便持久化。
 * 如果转化失败，返回原始的字符。
 */
export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * 创建一个map并且返回一个校验某键名是否是在这个map上的函数
 */
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

/**
 * Check if a tag is a built-in tag.
 * 校验某标签是否是内建标签
 */
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * Check if an attribute is a reserved attribute.
 * 校验一个属性是否是一个vue内置的属性
 */
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * Remove an item from an array.
 * 移除数组中某项
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 * 校验某对象是否自身有某属性
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 * 新建一个纯函数的缓存版
 */
export function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}

/**
 * Camelize a hyphen-delimited string.
 * 把一个连字符分割的字符变成驼峰命名
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * Capitalize a string.
 * 首字母大写某字符串
 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * Hyphenate a camelCase string.
 * 驼峰命名转成连字符分割
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 * 一些bind的polyfill不支持，比如PhantomJS 1.x。技术上，不再需要这个了，
 * 毕竟原生的bind已经可以在大多数浏览器上运行良好。但是，移除它将会在PhantomJS 1.x中
 * 出现错误，所以为了兼容仍旧保留。
 */
/* istanbul ignore next */
function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

// 原生bind
function nativeBind (fn: Function, ctx: Object): Function {
  return fn.bind(ctx)
}

// 简化写法，有原生的bind就调用原生的bind，没有用polyfill
export const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind

/**
 * Convert an Array-like object to a real Array.
 * 把一个类数组对象转成一个真正的数组
 */
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 * 合并对象属性到目标对象上
 */
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 * 把一个对象数组转成一个单对象
 */
export function toObject (arr: Array<any>): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 * 不执行任何操作。
 * 根除参数，以使得Flow能够处理没有使用
 * ...rest(https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)操作符的内容
 */
export function noop (a?: any, b?: any, c?: any) {}

/**
 * Always return false.
 * 总是返回false
 */
export const no = (a?: any, b?: any, c?: any) => false

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 * 返回同一值。
 */
export const identity = (_: any) => _

/**
 * Generate a string containing static keys from compiler modules.
 * 从编译模块中生成一个包含静态key的字符串。
 */
export function genStaticKeys (modules: Array<ModuleOptions>): string {
  return modules.reduce((keys, m) => {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 * 校验两个值是否是等效----是否等效的意思就是：
 * 如果他们都是原生的对象，他们是否有同样的结构？
 * 
 * 校验过程：
 * 1. 判断是否严格相等
 * 2. 判断是否是对象
 * 2-1. 判断是否都是数组
 * 2-1-1. 递归判断数组元素
 * 2-2. 判断是否都是Date
 * 2-3. 递归判断对象同名键名的键值
 * 3. 判断String转化结果相等
 * 4. 都不是，返回false
 */
export function looseEqual (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 * 返回数组（如果值是一个原生对象，那么数组必须包含同样结构的对象）中的第一个等效值的索引，
 * 否则如果不存在，返回-1
 */
export function looseIndexOf (arr: Array<mixed>, val: mixed): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

/**
 * Ensure a function is called only once.
 * 确保一个函数只调用一次。
 */
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
