// 服务端渲染（同构）(SSR) 标识
export const SSR_ATTR = 'data-server-rendered'

// 类型：组件、指令、过滤
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]

// 具体图示可以看下面链接上的图示
// https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA
// 注意： activated deactivated errorCaptured serverPrefetch 这几个
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
]