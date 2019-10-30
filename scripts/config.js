const path = require('path')
/**
 * 更多rollup插件查看：https://github.com/rollup/awesome
 */
// 使用buble来转化ES2015的rollup插件，更多内容查看：
// https://github.com/rollup/rollup-plugin-buble
const buble = require('rollup-plugin-buble')
// 给引入的包起别名的rollup插件，更多内容查看：
// https://github.com/rollup/rollup-plugin-alias
const alias = require('rollup-plugin-alias')
// 把CommonJS模块转成ES2015模块的rollup插件，常需要和rollup-plugin-node-resolve插件搭配，更多内容查看：
// https://github.com/rollup/rollup-plugin-commonjs
const cjs = require('rollup-plugin-commonjs')
// 打包的时候替换文件中的字符串的rollup插件，更多内容查看：
// https://github.com/rollup/rollup-plugin-replace
const replace = require('rollup-plugin-replace')
// 使用Node.js的解析算法的rollup插件，更多内容查看：
// https://github.com/rollup/rollup-plugin-node-resolve
const node = require('rollup-plugin-node-resolve')
// https://www.npmjs.com/package/rollup-plugin-flow-no-whitespace
const flow = require('rollup-plugin-flow-no-whitespace')
// 环境变量里有无VERSION，若无，以package.json中的version作为版本号
const version = process.env.VERSION || require('../package.json').version
// weex的版本号，环境变量里没有，则取自`../packages/weex-vue-framework/package.json`文件中的version
const weexVersion = process.env.WEEX_VERSION || require('../packages/weex-vue-framework/package.json').version
const featureFlags = require('./feature-flags')

// 横幅
//  包含 Vue.js的版本，版权日期，作者，MIT版权协议 这些信息
const banner =
  '/*!\n' +
  ` * Vue.js v${version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} Evan You\n` +
  ' * Released under the MIT License.\n' +
  ' */'

// weex工厂插件
const weexFactoryPlugin = {
  intro () {
    return 'module.exports = function weexFactory (exports, document) {'
  },
  outro () {
    return '}'
  }
}

const aliases = require('./alias')

// 目录映射到根目录
//  如果有定义简写，直接拿定义好了的简写，没有则映射到根目录
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

// 构建情况列表
// 参看官方文档了解打包后的差别：https://cn.vuejs.org/v2/guide/installation.html#对不同构建版本的解释
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  // 仅运行时(CommonJS)。用于打包，如Webpack和Browserify
  // web端运行时开发构建成commonjs
  'web-runtime-cjs-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.dev.js'),
    format: 'cjs',
    env: 'development',
    banner
  },
  // web端运行时生产构建成commonjs
  'web-runtime-cjs-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.prod.js'),
    format: 'cjs',
    env: 'production',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  // 运行时+编译时 CommonJS构建（CommonJS)
  // web端运行时+编译时开发环境构建成commonjs
  'web-full-cjs-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.dev.js'),
    format: 'cjs',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // web端运行时+编译时生产环境构建成commonjs
  'web-full-cjs-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.prod.js'),
    format: 'cjs',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only ES modules build (for bundlers)
  // 仅ES模块构建运行时（打包）
  // web运行时构建成es6模块
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler ES modules build (for bundlers)
  // web端运行时+编译时构建成es6模块
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler ES modules build (for direct import in browser)
  // 运行时+编译时构建（使得在浏览器上可直接导入）
  // web端运行+编译时构建成es6模块用于浏览器端开发环境
  'web-full-esm-browser-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.browser.js'),
    format: 'es',
    transpile: false,
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler ES modules build (for direct import in browser)
  // 运行时+编译时构建（使得在浏览器上可直接导入）
  // web端运行+编译时构建成es6模块用于浏览器端生产环境
  'web-full-esm-browser-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.browser.min.js'),
    format: 'es',
    transpile: false,
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // runtime-only build (Browser)
  // 仅运行时构建（浏览器）
  // web端运行时开发环境
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // runtime-only production build (Browser)
  // 仅运行时生产构建（浏览器）
  // web端运行时生产环境
  'web-runtime-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  // Runtime+compiler development build (Browser)
  // 运行+编译开发构建（浏览器）
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler production build  (Browser)
  // 运行+编译生产构建（浏览器）
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // Web compiler (CommonJS).
  // web端构建（CommonJS)
  'web-compiler': {
    entry: resolve('web/entry-compiler.js'),
    dest: resolve('packages/vue-template-compiler/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-template-compiler/package.json').dependencies)
  },
  // Web compiler (UMD for in-browser use).
  // web端编译（编译成UMD模块，以在浏览器内联可用）
  'web-compiler-browser': {
    entry: resolve('web/entry-compiler.js'),
    dest: resolve('packages/vue-template-compiler/browser.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'VueTemplateCompiler',
    plugins: [node(), cjs()]
  },
  // Web server renderer (CommonJS).
  // web端服务端渲染(CommonJS)，开发环境
  'web-server-renderer-dev': {
    entry: resolve('web/entry-server-renderer.js'),
    dest: resolve('packages/vue-server-renderer/build.dev.js'),
    format: 'cjs',
    env: 'development',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  // web端服务端渲染，生产环境
  'web-server-renderer-prod': {
    entry: resolve('web/entry-server-renderer.js'),
    dest: resolve('packages/vue-server-renderer/build.prod.js'),
    format: 'cjs',
    env: 'production',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  // web端服务端渲染，基本环境
  'web-server-renderer-basic': {
    entry: resolve('web/entry-server-basic-renderer.js'),
    dest: resolve('packages/vue-server-renderer/basic.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'renderVueComponentToString',
    plugins: [node(), cjs()]
  },
  // web端服务端渲染webpack服务端插件
  'web-server-renderer-webpack-server-plugin': {
    entry: resolve('server/webpack-plugin/server.js'),
    dest: resolve('packages/vue-server-renderer/server-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  // web端服务端渲染webpack客户端插件
  'web-server-renderer-webpack-client-plugin': {
    entry: resolve('server/webpack-plugin/client.js'),
    dest: resolve('packages/vue-server-renderer/client-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  // Weex runtime factory
  // weex运行时工厂
  'weex-factory': {
    weex: true,
    entry: resolve('weex/entry-runtime-factory.js'),
    dest: resolve('packages/weex-vue-framework/factory.js'),
    format: 'cjs',
    plugins: [weexFactoryPlugin]
  },
  // Weex runtime framework (CommonJS).
  // weex运行时架构（CommonJS）
  'weex-framework': {
    weex: true,
    entry: resolve('weex/entry-framework.js'),
    dest: resolve('packages/weex-vue-framework/index.js'),
    format: 'cjs'
  },
  // Weex compiler (CommonJS). Used by Weex's Webpack loader.
  // weex编译（CommonJS）。用于weex的webpack加载
  'weex-compiler': {
    weex: true,
    entry: resolve('weex/entry-compiler.js'),
    dest: resolve('packages/weex-template-compiler/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/weex-template-compiler/package.json').dependencies)
  }
}

// 获取需要哪种环境的rollup配置
function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      flow(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Vue'
    },
    onwarn: (msg, warn) => {
      // 没有循环引用依赖的报错就警告提示出报错内容
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  // built-in vars
  // 内建变量vars
  const vars = {
    __WEEX__: !!opts.weex,
    __WEEX_VERSION__: weexVersion,
    __VERSION__: version
  }
  // feature flags
  // vars加入未来语法
  Object.keys(featureFlags).forEach(key => {
    vars[`process.env.${key}`] = featureFlags[key]
  })
  // build-specific env
  // vars变量加入特殊环境构建
  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(vars))

  if (opts.transpile !== false) {
    config.plugins.push(buble())
  }

  // 设置当前配置名`_name`，该属性不可枚举
  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

// 看是否有没有TARGET这个环境变量
if (process.env.TARGET) {
  // 有，则导出该环境变量的配置
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  // 获取所有情况下的配置
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
