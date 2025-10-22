<template>
  <CFooter v-if="!isMobile" class="sticky-bottom">
    <div>
      <a href="https://coreui.io" target="_blank">CoreUI</a>
      <span class="ms-1"
        >&copy; {{ new Date().getFullYear() }} creativeLabs.</span
      >
    </div>
    <div class="ms-auto">
      <span class="me-1" target="_blank">Powered by</span>
      <a href="https://coreui.io/vue">CoreUI for Vue</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 480;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  }
}
</script>
