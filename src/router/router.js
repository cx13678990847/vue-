import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../login.vue'
//以下是采用动态路由加载，提高网站性能，在组件少的情况下不建议使用
const home = () => import('../components/home.vue')
import users from '../components/users/users.vue'
import roles from '../components/permissions/roles.vue'
import rights from '../components/permissions/rights.vue'
import goods from '../components/shop/goods.vue'
import categories from '../components/shop/categories.vue'
import params from '../components/shop/params.vue'
import add from '../components/shop/addShop.vue'
import orders from '../components/order/orderList.vue'
import reports from '../components/statistics/reports.vue'

//导入nprogress进度条插件  ----同样的模块在main.js文件中也导入了
//nprogress进度条在路由跳转时开始，在main.js中的响应拦截器中停止
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


Vue.use(VueRouter)

const router=new VueRouter({
	routes: [
	  {path: '/', redirect: '/login'},
      {path: '/login', component: login},
      { path: '/home',
        component: home,
        redirect: '/users',
        children: [
          { path: '/users', component: users},
          { path: '/roles', component: roles},
          { path: '/rights', component: rights},
          { path: '/goods', component: goods},
          { path: '/goods/add', component: add},
          { path: '/categories', component: categories},
          { path: '/params', component: params},
          { path: '/orders', component: orders},
          { path: '/reports', component: reports}
        ]
      }
	]
});

router.beforeEach((to,from,next)=>{
  let value = window.sessionStorage.getItem('token');
  if(to.path == '/login') return next();
  if(!value){
    return next('/login')
  }
  NProgress.start()
  next();
})


export default router;