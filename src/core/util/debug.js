/* @flow */

import config from '../config'
import { noop } from 'shared/util'

// 警告
export let warn = noop
// 提示
export let tip = noop
// 生成组件堆栈
export let generateComponentTrace = (noop: any) // work around flow check 用于通过flow校验
// 格式化组件名
export let formatComponentName = (noop: any)

// 非生产环境
if (process.env.NODE_ENV !== 'production') {
  // 是否支持console
  const hasConsole = typeof console !== 'undefined'
  // https://regexper.com/?#%2F%28%3F%3A%5E%7C%5B-_%5D%29%28%5Cw%29%2Fg
  const classifyRE = /(?:^|[-_])(\w)/g
  // aaa-bbb => AaaBbb
  // aaa_bbb => AaaBbb
  const classify = str => str
    .replace(classifyRE, c => c.toUpperCase())
    .replace(/[-_]/g, '')

  // 覆写warn
  warn = (msg, vm) => {
    const trace = vm ? generateComponentTrace(vm) : ''

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace)
    } else if (hasConsole && (!config.silent)) {
      console.error(`[Vue warn]: ${msg}${trace}`)
    }
  }

  // 覆写tip
  tip = (msg, vm) => {
    if (hasConsole && (!config.silent)) {
      console.warn(`[Vue tip]: ${msg}` + (
        vm ? generateComponentTrace(vm) : ''
      ))
    }
  }

  // 覆写formatComponentName
  formatComponentName = (vm, includeFile) => {
    if (vm.$root === vm) { // 根节点
      return '<Root>'
    }
    // vm.options -> vm.$options || vm.constructor.options -> vm
    const options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm
    // 组件名
    let name = options.name || options._componentTag
    const file = options.__file
    if (!name && file) {
      // 匹配xxx.vue，xxx不能为\或/
      // https://regexper.com/?#%2F%28%5B%5E%2F%5C%5C%5D%2B%29%5C.vue%24%2F
      const match = file.match(/([^/\\]+)\.vue$/)
      name = match && match[1]
    }

    return (
      (name ? `<${classify(name)}>` : `<Anonymous>`) +
      (file && includeFile !== false ? ` at ${file}` : '')
    )
  }

  // 重复字符串n次
  const repeat = (str, n) => {
    let res = ''
    while (n) {
      if (n % 2 === 1) res += str
      if (n > 1) str += str
      n >>= 1
    }
    return res
  }

  // 覆写generateComponentTrace
  // 打印组件树堆栈
  generateComponentTrace = vm => {
    if (vm._isVue && vm.$parent) {
      const tree = []
      let currentRecursiveSequence = 0
      while (vm) {
        if (tree.length > 0) {
          const last = tree[tree.length - 1]
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++
            vm = vm.$parent
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence]
            currentRecursiveSequence = 0
          }
        }
        tree.push(vm)
        vm = vm.$parent
      }
      return '\n\nfound in\n\n' + tree
        .map((vm, i) => `${
          i === 0 ? '---> ' : repeat(' ', 5 + i * 2)
          }${
          Array.isArray(vm)
            ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
            : formatComponentName(vm)
          }`)
        .join('\n')
    } else {
      return `\n\n(found in ${formatComponentName(vm)})`
    }
  }
}
