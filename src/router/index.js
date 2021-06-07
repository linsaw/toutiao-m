import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/'),
    meta: { requiresAuth: false } // 添加额外自定义数据
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/home'),
        meta: { requiresAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa'),
        meta: { requiresAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video'),
        meta: { requiresAuth: false }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile/'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat/'),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

// to 访问的路由
// from 来自哪个路由
// next 放行标志
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 如果已经登录，直接通过
    if (store.state.userToken) {
      return next()
    }
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗？'
    })
      .then(() => {
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => {
        // 取消，中断路由导航
        next(false)
      })
  } else {
    next()
  }
})

export default router
