// 写法1
// //es6 引入01.js文件
// import {getList, save} from './01.js'
// //调用方法
// getList()
// save()

//写法2
import m from './01.js'
//调用方法
m.getList()
m.save()
        
//es6 模块化写法, 但使用node.js运行前需要转化为es5代码