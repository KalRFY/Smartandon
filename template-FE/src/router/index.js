import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'

// Route groups
const appRoutes = [
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
    },
  },
  {
    path: '/app/Dashboard2',
    name: 'Dashboard2',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/Dashboard2.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard2',
    },
  },
  {
    path: '/app/MTBFMTTR',
    name: 'MTBFMTTR',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/MTBFMTTR/MTBFMTTR.vue'),
    meta: {
      requiresAuth: true,
      title: 'MTBFMTTR',
    },
  },
  {
    path: '/app/RealtimeParetto',
    name: 'RealtimeParetto',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/RealtimeParetto/RealtimeParetto.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'RealtimeParetto',
    },
  },

  {
    path: '/app/DashboardDataDisplay',
    name: 'DashboardDataDisplay',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/DashboardDataDisplay.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'DashboardDataDisplay',
    },
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
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'dcDashboard',
    },
  },
  {
    path: '/app/ProblemHistory',
    name: 'ProblemHistory',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/ProblemHistory/ProblemHistory.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Problem History',
    },
  },
  {
    path: '/app/LTBSummary',
    name: 'LTBSummary',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/LTBSummary.vue'),
    meta: {
      requiresAuth: true,
      title: 'LTB Summary',
    },
  },
  /*define other routes in here*/
  {
    path: '/app/tpm-redirect',
    name: 'RedirectTPM',
    component: () =>
      import(/* webpackChunkName: "redirect-tpm" */ '@/views/RedirectTPM.vue'),
    meta: {
      requiresAuth: false,
      title: 'Redirect TPM',
    },
  },
  {
    path: '/app/order-spareparts-redirect',
    name: 'RedirectOrderSpareparts',
    component: () =>
      import(/* webpackChunkName: "redirect-order-spareparts" */ '@/views/RedirectOrderSpareparts.vue'),
    meta: {
      requiresAuth: false,
      title: 'Redirect Order Spareparts',
    },
  }
]

const authRoutes = [
  {
    path: '/auth/register',
    name: 'Register',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/Register/Register.vue'),
    meta: {
      title: 'Register',
    },
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/Login/Login.vue'),
    meta: {
      title: 'Login',
    },
  },
]

// Error pages
const errorRoutes = [
  {
    path: '/404',
    name: 'Page404',
    component: () =>
      import(/* webpackChunkName: "error-404" */ '@/views/pages/Page404'),
    meta: { title: 'Page Not Found' },
  },
  {
    path: '/500',
    name: 'Page500',
    component: () =>
      import(/* webpackChunkName: "error-500" */ '@/views/pages/Page500'),
    meta: { title: 'Server Error' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const isStandalone = process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true'
console.log('Stand alone single SPA: ', isStandalone)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: isStandalone ? DefaultLayoutStandAlone : DefaultLayout,
    redirect: () => {
      if (!isStandalone && (!localStorage.token || localStorage.token === '')) {
        window.location.href = process.env.dc + '/#/auth/login'
        return
      }
      return '/app/dashboard'
    },
    children: [...appRoutes],
  },
  ...authRoutes,
  ...errorRoutes,
]

const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000
  } catch (e) {
    return true
  }
}

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

  const token = localStorage.token
  const isLoggedIn = !!token && token !== '' && !isTokenExpired(token)
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token')
  }
  // Redirect to login only if route requires auth and not logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' })
    return
  }
  // Prevent logged in user from accessing login/register
  if ((to.name === 'Login' || to.name === 'Register') && isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }
  next()
})

export default router
