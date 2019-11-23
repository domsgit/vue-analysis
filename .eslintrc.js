module.exports = {
  root: true,
  parserOptions: { // 解析配置
    parser: require.resolve('babel-eslint'),
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: { // 环境
    es6: true,
    node: true,
    browser: true
  },
  plugins: [ // 插件
    "flowtype"
  ],
  extends: [ // 扩展
    "eslint:recommended",
    "plugin:flowtype/recommended"
  ],
  globals: { // 全局变量
    "__WEEX__": true,
    "WXEnvironment": true
  },
  rules: { // 个人定制化规则
    'no-console': process.env.NODE_ENV !== 'production' ? 0 : 2,
    'no-useless-escape': 0,
    'no-empty': 0
  }
}
