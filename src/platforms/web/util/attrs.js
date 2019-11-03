/* @flow */

import { makeMap } from 'shared/util'

// these are reserved for web because they are directly compiled away
// during template compilation
// 这些是为Web保留的，因为它们是在模板编译期间直接编译掉的
export const isReservedAttr = makeMap('style,class')

// attributes that should be using props for binding
// 属性需要使用props绑定
const acceptValue = makeMap('input,textarea,option,select,progress')
export const mustUseProp = (tag: string, type: ?string, attr: string): boolean => {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
}

// 可枚举属性
export const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck')

// 可编辑内容值
const isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only')

// 转化可数值
export const convertEnumeratedValue = (key: string, value: any) => {
  return isFalsyAttrValue(value) || value === 'false'
    ? 'false'
    // allow arbitrary string value for contenteditable
    // 允许任意字符串值进行可编辑
    : key === 'contenteditable' && isValidContentEditableValue(value)
      ? value
      : 'true'
}

// 布尔值属性
export const isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
)

// xlink的命名空间
export const xlinkNS = 'http://www.w3.org/1999/xlink'

// name以 xlink: 为前缀，则表示是Xlink
export const isXlink = (name: string): boolean => {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
}

// 获取xlink的属性名
export const getXlinkProp = (name: string): string => {
  return isXlink(name) ? name.slice(6, name.length) : ''
}

// 判断属性值是否是falsy
export const isFalsyAttrValue = (val: any): boolean => {
  return val == null || val === false
}
