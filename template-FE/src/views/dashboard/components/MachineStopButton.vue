<template>
    <CButton
        class="mb-3"
        style="width: 100%; font-size: 18px; font-weight: bold"
        color="primary"
        @click="$emit('click')"
        shape="rounded-pill"
    >
        Machine Stop Input
    </CButton>
</template>

<script setup>
import { CButton } from '@coreui/vue'

defineEmits(['click'])
</script>