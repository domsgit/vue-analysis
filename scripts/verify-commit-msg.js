const chalk = require('chalk')
const msgPath = process.env.GIT_PARAMS
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  // 打印一空行
  console.log()
  /**
   * 错误 提交格式错误。
   * 
   * 
   * 自动生成变更日志需要正确的提交消息格式。例如：
   * 
   * feat(compiler): add 'comments' option
   * fix(v-model): handle events on blur (close #28)
   * 
   * 查看.github/COMMIT_CONVENTION.md了解更多详情。
   * 你也可以使用npm run commit来交互地生成一个提交内容。
   * 
   */
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
    chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
    `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
    `    ${chalk.green(`fix(v-model): handle events on blur (close #28)`)}\n\n` +
    chalk.red(`  See .github/COMMIT_CONVENTION.md for more details.\n`) +
    chalk.red(`  You can also use ${chalk.cyan(`npm run commit`)} to interactively generate a commit message.\n`)
  )
  // 退出
  process.exit(1)
}
