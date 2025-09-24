<template>
    <div v-if="isLoading" class="loading-container">
        <p class="loading-text">{{ message }}</p>
    </div>
</template>

<script setup>
defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: 'Loading...',
    },
})
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.loading-text {
  font-style: italic;
  color: #6c757d;
  text-align: center;
}
</style>