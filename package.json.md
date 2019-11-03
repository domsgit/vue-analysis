
```json
{
  "name": "vue",
  "version": "2.6.10",
  "description": "Reactive, component-oriented view layer for modern web interfaces.",
  "scripts": {
    "build": "node scripts/build.js",
    "commit": "git-cz"
  },
  // git 钩子
  "gitHooks": {
    // git 提交前校验
    "pre-commit": "lint-staged",
    // 校验commit的注释内容
    "commit-msg": "node scripts/verify-commit-msg.js"
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "git add"
    ]
  },
  // 仓库地址
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuejs/vue.git"
  },
  "config": {
    // 提交生成更新记录
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```
