<template>
  <CFooter v-if="!isMobile" class="sticky-bottom">
    <div>
      <a href="https://coreui.io" target="_blank">Smartandon</a>
      <span class="ms-1"
        >&copy; {{ new Date().getFullYear() }}</span
      >
    </div>
    <div class="ms-auto">
      <span class="me-1" target="_blank">Developed by</span>
      <a href="https://www.linkedin.com/in/khalif-raflika-868404246/">Khalif</a>
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
