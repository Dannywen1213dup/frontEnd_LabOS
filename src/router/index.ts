import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LabOSView from '../views/LabOSView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'labos',
    component: LabOSView
  },
  {
    path: '/submit',
    name: 'submit',
    component: LabOSView
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
