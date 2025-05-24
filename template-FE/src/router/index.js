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
  {
    path: '/app/Dashboard2',
    name: 'Dashboard2',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/Dashboard2.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard2'
    }
  },
  {
    path: '/app/MTBFMTTR',
    name: 'MTBFMTTR',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/MTBFMTTR/MTBFMTTR.vue'),
    meta: {
      requiresAuth: true,
      title: 'MTBFMTTR'
    }
  },
  {
    path: '/app/RealtimeParetto',
    name: 'RealtimeParetto',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/RealtimeParetto/RealtimeParetto.vue'),
    meta: {
      requiresAuth: true,
      title: 'RealtimeParetto'
    }
  },

  {
    path: '/app/DashboardDataDisplay',
    name: 'DashboardDataDisplay',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/DashboardDataDisplay.vue'),
    meta: {
      requiresAuth: true,
      title: 'DashboardDataDisplay'
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
    path: '/app/ProblemHistory',
    name: 'ProblemHistory',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/ProblemHistory.vue'),
    meta: {
      requiresAuth: true,
      title: 'Problem History'
    }
  },
  {
    path: '/app/ltb-report',
    name: 'LTBReport',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/LTB/LTBReportScreen.vue'),
    meta: {
      requiresAuth: true,
      title: 'LTB Report'
    }
  },
  {
    path: '/app/ltb-summary',
    name: 'LTBSummary',
    component: () => import(/* webpackChunkName: "reports" */ '@/views/LTBSummary.vue'),
    meta: {
      requiresAuth: true,
      title: 'LTB Summary'
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

const routes = [
  {
    path: '/',
    name: 'Home',
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
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

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

export default router
