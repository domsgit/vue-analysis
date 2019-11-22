import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue构造函数
// options配置参数
function Vue(options) {
  // 非生产环境，当不是用new实例化时，警告
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    // Vue是一个构造函数，必须以`new`关键字调用
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化
  this._init(options)
}

// 初始化混入
initMixin(Vue)
// 状态混入
stateMixin(Vue)
// 事件混入
eventsMixin(Vue)
// 生命周期混入
lifecycleMixin(Vue)
// 渲染混入
renderMixin(Vue)

// 导出Vue构造函数
export default Vue
