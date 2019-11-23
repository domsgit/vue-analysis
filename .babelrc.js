const babelPresetFlowVue = {
  plugins: [
    require('@babel/plugin-proposal-class-properties'),
    // require('@babel/plugin-syntax-flow'), // not needed, included in transform-flow-strip-types
    require('@babel/plugin-transform-flow-strip-types')
  ]
}

module.exports = {
  presets: [ // 预编译
    require('@babel/preset-env'),
    // require('babel-preset-flow-vue')
    babelPresetFlowVue
  ],
  plugins: [ // 插件
    require('babel-plugin-transform-vue-jsx'),
    require('@babel/plugin-syntax-dynamic-import')
  ],
  ignore: [ // 忽略文件
    'dist/*.js',
    'packages/**/*.js'
  ]
}
