/* @flow */

import {
  no,
  noop,
  identity
} from 'shared/util'

import { LIFECYCLE_HOOKS } from 'shared/constants'

// 定义配置类型
export type Config = {
  // user
  // 用户
  optionMergeStrategies: { [key: string]: Function };
  silent: boolean;
  productionTip: boolean;
  performance: boolean;
  devtools: boolean;
  errorHandler: ?(err: Error, vm: Component, info: string) => void;
  warnHandler: ?(msg: string, vm: Component, trace: string) => void;
  ignoredElements: Array<string | RegExp>;
  keyCodes: { [key: string]: number | Array<number> };

  // platform
  // 平台
  isReservedTag: (x?: string) => boolean;
  isReservedAttr: (x?: string) => boolean;
  parsePlatformTagName: (x: string) => string;
  isUnknownElement: (x?: string) => boolean;
  getTagNamespace: (x?: string) => string | void;
  mustUseProp: (tag: string, type: ?string, name: string) => boolean;

  // private
  // 私有
  async: boolean;

  // legacy
  // 历史遗留问题
  _lifecycleHooks: Array<string>;
};

export default ({
  /**
   * Option merge strategies (used in core/util/options)
   * 可选的合并策略（用于`core/util/options)
   * https://cn.vuejs.org/v2/api/#optionMergeStrategies
   * https://cn.vuejs.org/v2/guide/mixins.html#自定义选项合并策略
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   * 是否忽略取消警告。
   * https://cn.vuejs.org/v2/api/#silent
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   * 启动时是否显示生产环境提示信息
   * https://cn.vuejs.org/v2/api/#productionTip
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   * 是否开启devtools
   * https://cn.vuejs.org/v2/api/#devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   * 是否记录性能
   * https://cn.vuejs.org/v2/api/#performance
   */
  performance: false,

  /**
   * Error handler for watcher errors
   * 观察者的错误处理程序句柄
   * https://cn.vuejs.org/v2/api/#errorHandler
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   * 观察者的警告处理程序句柄
   * https://cn.vuejs.org/v2/api/#warnHandler
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   * 忽略某些自定义元素
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   * 自定义v-on用户定义键名起的别名
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   * 校验某标签是否是保留的，不能注册成组件。平台相关，可能被重写。
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   * 校验某属性是保留用的，是不能作为组件prop的。这是平台相关的，可能会被重写。
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   * 校验一个标签是否是一个未知的元素。
   * 平台依赖。
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   * 得到一个元素的命名空间
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   * 为特定平台解析成真实的标签名
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   * 校验是否某属性必须使用属性绑定，比如：value
   * 平台依赖。
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   * 异步执行更新。用在Vue测试组件中，如果设置为false，这将大大降低性能。
   */
  async: true,

  /**
   * Exposed for legacy reasons
   * 由于历史遗留问题需要导出
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
}: Config)
