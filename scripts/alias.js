const path = require('path')

// 把目录映射到根目录
const resolve = p => path.resolve(__dirname, '../', p)

// 目录简写
//  可以实现`web`就映射到根目录下的`src/platforms/web`目录
module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc')
}
