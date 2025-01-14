import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import Layout from '@/components/LayoutView.vue' // Ensure the Layout component is imported correctly
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView, // Use Layout here for the home route
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'), // Use Layout here for the home route
    meta: { requiresAuth: true }
  },
  {
    path: '/refreshcdn',
    name: 'refreshcdn',
    component: () => import('@/views/RefreshCdnView.vue'), // Use Layout here for the home route
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/role',
  //   name: 'role',
  //   component: () => import('@/views/RoleView.vue'), // Use Layout here for the home route
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { showMenu: false }
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken') // 判断是否存在 token
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 如果需要登录但没有 token，跳转到登录页
    next('/login')
  } else if (to.name === 'login' && isAuthenticated) {
    // 如果已登录，访问 login 页面就跳转到首页
    next('/')
  } else {
    next() // 放行
  }
})

export default router
