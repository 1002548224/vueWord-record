import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 消息弹框Message需要进行全局挂载，挂载到Vue上
Vue.prototype.$message = Message
// $message是个自定义属性，可以随意合法修改
