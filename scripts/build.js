const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const rollup = require('rollup')
// https://github.com/terser/terser
const terser = require('terser')

// 同步判断是否存在dist文件夹
if (!fs.existsSync('dist')) {
  // 如果不存在dist文件夹，则同步创建一个
  fs.mkdirSync('dist')
}

let builds = require('./config').getAllBuilds()

// filter builds via command line arg
// 通过命令行参数过滤需要怎么构建
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  // 默认是weex构建
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

build(builds)

function build (builds) {
  let built = 0
  const total = builds.length
  // 串口执行
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

// 构建入口
function buildEntry (config) {
  const output = config.output
  const { file, banner } = output
  // 是否是生产环境，通过文件名最后是否有min或是prod关键字来判断
  const isProd = /(min|prod)\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ output: [{ code }] }) => {
      if (isProd) {
        // 如果是生产环境，则压缩代码
        const minified = (banner ? banner + '\n' : '') + terser.minify(code, {
          toplevel: true,
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

// 构建成功写入文件
function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        // 压缩文件
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

// 求文件大小，kb为单位
function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

// 错误日志打印到控制台
function logError (e) {
  console.log(e)
}

// 控制台打印蓝色字体
function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
