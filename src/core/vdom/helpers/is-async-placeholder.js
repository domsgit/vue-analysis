/* @flow */

// 是否是异步占位节点
export function isAsyncPlaceholder (node: VNode): boolean {
  // 节点是注释节点 且 节点是异步工厂
  return node.isComment && node.asyncFactory
}
