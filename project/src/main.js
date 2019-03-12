import Vue from 'vue'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'

// 引入公用样式
import './assets/styles/css/common.less'
import './assets/styles/css/iconfont.css';

// axios公用
import request from './api/request.js'

// 将request挂载在vue的显示原型上，所有vue实例对象共享
Vue.prototype.req=request;

// 路由守卫
router.beforeEach((to,from,next)=>{
  // 从浏览器获取token
  const token=window.localStorage.getItem('token');
  if(!token){
    if(to.path==='/login'){
      next();
    }else{
      next({path:'/login'})
    }
  }else{
    next();//放行
  }

})

// 使用element-ui
Vue.use(ElementUI)




Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
