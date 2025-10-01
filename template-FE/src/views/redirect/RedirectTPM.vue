<template>
  <div>
    Redirecting to TPM System...
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  window.location.href = 'http://mt-system.id:9200';
});

</script>