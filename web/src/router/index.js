import { createRouter, createWebHistory } from 'vue-router'
import RoleSelection from '../views/RoleSelection.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'role-selection',
      component: RoleSelection
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    }
  ]
})

export default router
