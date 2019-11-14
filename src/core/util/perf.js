import { inBrowser } from './env'

export let mark
export let measure

if (process.env.NODE_ENV !== 'production') { // 非生产环境，替换掉mark和measure，用来记录性能相关的数据
  const perf = inBrowser && window.performance
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = tag => perf.mark(tag) // 性能标记
    measure = (name, startTag, endTag) => { // 性能衡量
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
      // perf.clearMeasures(name)
    }
  }
}
