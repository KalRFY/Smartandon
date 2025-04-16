<<<<<<< HEAD
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'

// Route groups
const appRoutes = [
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Dashboard'
    }
  },
  // Add the uncommented Quality Operational route
  // {
  //   path: '/qdc/quality-operational',
  //   name: 'QualityOperational',
  //   component: () => import(/* webpackChunkName: "quality-operational" */ '@/views/qdc/QualityOperational.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Quality Operational'
  //   }
  // },
  // New route
  {
    path: '/dc/dashboard',
    name: 'dcDashboard',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'dcDashboard'
    }
  },
  {
    path: '/app/problem-history',
    name: 'problemHistory',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/problem-history/index.vue'),
    meta: {
      requiresAuth: true,
      title: 'Problem History'
    }
  },
  /*define other routes in here*/
]

// Error pages
const errorRoutes = [
  {
    path: '/404',
    name: 'Page404',
    component: () => import(/* webpackChunkName: "error-404" */ '@/views/pages/Page404'),
    meta: { title: 'Page Not Found' }
  },
  {
    path: '/500',
    name: 'Page500',
    component: () => import(/* webpackChunkName: "error-500" */ '@/views/pages/Page500'),
    meta: { title: 'Server Error' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const isStandalone = process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true'
console.log("Stand alone single SPA: ", isStandalone)

=======
console.log('router/index.js')
import { createRouter, createWebHashHistory, Route } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'
/*define const other in here*/

console.log(process.env.VUE_APP_STANDALONE_SINGLE_SPA)
>>>>>>> 399612856cceb38ca2fc3398b4a07a9db0a3befd
const routes = [
  {
    path: '/',
    name: 'Home',
<<<<<<< HEAD
    component: isStandalone ? DefaultLayoutStandAlone : DefaultLayout,
    redirect: () => {
      if (!isStandalone && (!localStorage.id_token || localStorage.id_token === '')) {
        window.location.href = process.env.dc + '/#/sc/login'
        return
      }
      return '/app/dashboard'
    },
    children: [
      ...appRoutes
    ],
  },
  ...errorRoutes
=======
    component:
      process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true'
        ? DefaultLayoutStandAlone
        : DefaultLayout,
    redirect:  ( process.env.VUE_APP_STANDALONE_SINGLE_SPA!=='true' && (!localStorage.id_token || localStorage.id_token == '' )) ? 
      () => {
        window.location.href = process.env.dc+'/#/sc/login' 
        // return '/redirectingToLogin' // not important since redirecting
      }: '/app/dashboard',
    children: [
      {
        path: '/app/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/app/Dashboard2',
        name: 'Dashboard2',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/app/MTBFMTTR',
        name: 'MTBFMTTR',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/app/RealtimeParetto',
        name: 'RelatimeParetto',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/app/LTBReport',
        name: 'LTBReport',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/app/ProblemHistory',
        name: 'ProblemHistory',
        component: () => import('@/views/Dashboard.vue'),
      },
      

      // URL
      // {
      //   path: '/qdc/quality-operational',
      //   name: 'Quality Operational',
      //   component: () => import('@/views/qdc/QualityOperational.vue'),
      // },

/*define other in here*/
    ],
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/pages/Page404'),
  },
  {
    path: '/500',
    name: 'Page500',
    component: () => import('@/views/pages/Page500'),
  },
>>>>>>> 399612856cceb38ca2fc3398b4a07a9db0a3befd
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

<<<<<<< HEAD
// Navigation guards for authentication
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = `Template MFG - ${to.meta.title}`
  }
  
  // Check authentication
  if (to.meta.requiresAuth && !isStandalone && (!localStorage.id_token || localStorage.id_token === '')) {
    window.location.href = process.env.dc + '/#/sc/login'
    return
  }
  
  next()
})

=======
>>>>>>> 399612856cceb38ca2fc3398b4a07a9db0a3befd
export default router
