/* @flow */

import { inBrowser } from 'core/util/index'

// check whether current browser encodes a char inside attribute values
// 检查当前浏览器是否在属性值内部编码了字符
let div
function getShouldDecode (href: boolean): boolean {
  div = div || document.createElement('div')
  div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
// #3663：IE在属性值内编码了新行，而其他浏览器不会
// https://github.com/vuejs/vue/issues/3663
export const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false
// #6828: chrome encodes content in a[href]
// #6828: 谷歌允许在a[href]中有内容
// https://github.com/vuejs/vue/issues/6828
export const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false
