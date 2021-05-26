/**
 * PostCSS配置文件
 */
module.exports = {
  // 配置要使用的相关插件
  plugins: {
    // // 自动添加浏览器厂商声明浅醉，兼容不同浏览器
    // // VueCLI 已经内部默认配置了 autoprefixer
    // autoprefixer: {
    //   // browsers用来配置要兼容到的系统（浏览器）环境
    //   // 这个配置没有问题，但是控制台编译会警告
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 把 px 转换为 rem
    'postcss-pxtorem': {
      // 转换的根元素基准值
      // 正常按照设计稿来
      rootValue: 37.5,
      // 需要转换的css属性，*代表所有属性
      propList: ['*']
    }
  }
}
