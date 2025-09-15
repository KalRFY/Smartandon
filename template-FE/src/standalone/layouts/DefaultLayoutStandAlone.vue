<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100 bg-blurred">
      <AppHeader />
      <div class="body flex-grow-1 px-3">
        <CContainer fluid>
          <router-view />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
<script>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/standalone/components/AppFooter.vue'
import AppHeader from '@/standalone/components/AppHeader.vue'
import AppSidebar from '@/standalone/components/AppSidebar.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppFooter,
    AppHeader,
    AppSidebar,
    CContainer,
  },
  setup() {
    const router = useRouter()
    const getBreadcrumbs = (route) => {
      const breadcrumbs = route.matched.map((match, index) => ({
        name: match.meta?.breadcrumb || match.name || match.path,
        path: match.path,
        active: index === route.matched.length - 1,
      }))
      // Add Home if not present
      if (breadcrumbs.length > 0 && breadcrumbs[0].name !== 'Home') {
        breadcrumbs.unshift({ name: 'Home', path: '#/dc/dashboard', active: false })
      }
      // Show only the last two items (previous and current)
      if (breadcrumbs.length > 2) {
        breadcrumbs = breadcrumbs.slice(-2)
      }
      return breadcrumbs
    }
    const updateBreadcrumbs = () => {
      const currentRoute = router.currentRoute.value
      const breadcrumbs = getBreadcrumbs(currentRoute)
      localStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs))
      // Trigger update in AppBreadcrumb
      setTimeout(() => {
        const button = document.getElementById('breadcrumbsChangeValue')
        if (button) button.click()
      }, 0)
    }
    router.afterEach(updateBreadcrumbs)
    // Update on mount
    onMounted(updateBreadcrumbs)
    return {}
  },
}
</script>
