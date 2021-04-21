import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  // 模板
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      // 首页
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home')
      },
      // 内容管理
      {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article')
      },
      // 素材管理
      {
        path: '/image',
        name: 'image',
        component: () => import('@/views/image')
      },
      // 发布文章
      {
        path: '/publish',
        name: 'publish',
        component: () => import('@/views/publish')
      },
      // 评论管理
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/comment')
      },
      // 粉丝管理
      {
        path: '/fans',
        name: 'fans',
        component: () => import('@/views/fans')
      },
      // 个人设置
      {
        path: '/setting',
        name: 'setting',
        component: () => import('@/views/setting')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 解决 冗余导航报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 路由拦截器
router.beforeEach((to, from, next) => {
  const user = window.localStorage.getItem('userToken')
  if (to.path !== '/login') {
    if (user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
