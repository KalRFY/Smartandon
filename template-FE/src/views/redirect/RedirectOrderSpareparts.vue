<template>
  <div>
    Redirecting to Order Spareparts...
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  window.location.href = 'https://iwms.toyota.co.id/StorageInquiry';
});
</script>