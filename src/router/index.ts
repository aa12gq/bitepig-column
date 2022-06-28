import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import ColumnDetail from '@/views/ColumnDetail.vue'
import CreatePost from '@/views/CreatePost.vue'
import Edit from '@/views/Edit.vue'
import Signup from '@/views/Signup.vue'
import PostDetail from '@/views/PostDetail.vue'
import NotFound from '@/views/NotFound.vue'
import store from '@/store'
import { axios } from '@/libs/http'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit,
      meta: { requiredLogin: true }
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    },
    {
      path: '/*',
      name: 'notFound',
      components: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAleadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAleadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e)
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAleadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
