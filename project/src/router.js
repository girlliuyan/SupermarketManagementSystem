import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirtor:'/login',//重定向
      component: () => import('./views/Login/Login.vue')
    }, 
    // 登录
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue')
    },   
    // 后端首页
    {
      path: '/index',
      component: () => import('./views/Index/Index.vue'),
      children:[
        // 系统信息 默认的首页
        {
          path: '/index',
          name: '',
          component: () => import('./views/Systeminfo/Systeminfo.vue')
        },
         // 账号部分
         {
          path: '/index/accountadd',
          name: 'accountadd',
          component: () => import('./views/Accountadd/Accountadd.vue')
        },
        {
          path: '/index/accountmanage',
          name: 'accountmanage',
          component: () => import('./views/Accountmanage/Accountmanage.vue')
        },
        {
          path: '/index/passwordmodify',
          name: 'passwordmodify',
          component: () => import('./views/Passwordmodify/Passwordmodify.vue')
        },
        // 商品部分
        {
          path: '/index/goodsadd',
          name: 'goodsadd',
          component: () => import('./views/Goodsadd/Goodsadd.vue')
        },
        {
          path: '/index/goodsmanage',
          name: 'goodsmanage',
          component: () => import('./views/Goodsmanage/Goodsmanage.vue')
        },
        // 统计管理部分
        {
          path: '/index/salesstatistics',
          name: 'salesstatistics',
          component: () => import('./views/Salesstatistics/Salesstatistics.vue')
        },
        {
          path: '/index/stockstatistics',
          name: 'stockstatistics',
          component: () => import('./views/Stockstatistics/Stockstatistics.vue')
        }
      ]
    }
  ]
})
