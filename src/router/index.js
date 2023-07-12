import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const routes = [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    { 
      path: '/example',
      name: "example",
      component: () => import(/* webpackChunkName: "about", webpackPrefetch:true */ '../views/ExampleView.vue')
    },
    { 
      path: '/admin',
      name: "admin",
      component: () => import(/* webpackChunkName: "about", webpackPrefetch:true */ '../views/AdminView.vue')
    },
    { 
      path: '/finish',
      name: "finish",
      component: () => import(/* webpackChunkName: "about", webpackPrefetch:true */ '../views/FinishView.vue')
    },

  ]
  
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
  
  export default router
  