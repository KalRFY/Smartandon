<template>
    <div v-if="error" class="alert alert-danger mt-3" role="alert">
        <div class="alert-icon">❌</div>
        <span>{{ error }}</span>
    </div>

    <div v-if="success" class="alert alert-success mt-3" role="alert">
        <div class="alert-icon">✓</div>
        <span>{{ success }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
    error: {
        type: String,
        default: ''
    },
    success: {
        type: String,
        default: ''
    }
})
</script>

<style scoped>
.alert {
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  border: none;
  backdrop-filter: blur(10px);
}

.alert-danger {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #f8d7d7;
  color: #dc2626;
  z-index: 9999;
  border: 1px solid #dc2626;
  animation: fadeInOut 3s ease-in-out;
}

.alert-success {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #ddf8daac;
  color: #16a34a;
  z-index: 9999;
  border: 1px solid #16a34a;
  animation: fadeInOut 3s ease-in-out;
}

.alert-icon {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }

  10%,
  90% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
}

.mt-3 {
  margin-top: 1rem;
}
</style>