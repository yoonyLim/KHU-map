import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/map/:bldg',
      name: 'bldg-map',
      component: () => import("@/views/BldgMap.vue")
    }
  ]
})

export default router
