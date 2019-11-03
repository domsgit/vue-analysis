/* @flow */

export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope 在本组件的作用域中渲染
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance 组件实例
  parent: VNode | void; // component placeholder node 组件占位符节点

  // strictly internal
  // 严格内部
  raw: boolean; // contains raw HTML? (server only) 包含原生的HTML?（仅用于服务端）
  isStatic: boolean; // hoisted static node 提升静态节点
  isRootInsert: boolean; // necessary for enter transition check 进入过渡检查所必需
  isComment: boolean; // empty comment placeholder? 空注释占位符
  isCloned: boolean; // is a cloned node? 是否是克隆节点？
  isOnce: boolean; // is a v-once node? 是否是v-once节点？
  asyncFactory: Function | void; // async component factory function 异步组件工厂函数
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes  供函数式节点的真实vm上下文
  fnOptions: ?ComponentOptions; // for SSR caching 服务端渲染SSR缓存
  devtoolsMeta: ?Object; // used to store functional render context for devtools 用于给devtools存储函数式渲染上下文
  fnScopeId: ?string; // functional scope id support 函数式范围ID支持

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  // 不推荐使用：向后兼容的componentInstance的别名。
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

// 新建空虚拟节点
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

// 新建文本虚拟节点
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
// 浅克隆优化
// 用于静态节点和插槽节点，因为他们需要跨多渲染层复用。复制他们，当DOM操纵在他们真实的元素引用上时以避免错误
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    // 复制子数组以避免原始突变
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
