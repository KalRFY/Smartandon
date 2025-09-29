<template>
    <CCard style="width: 100%; height: 100%;">
        <CCardBody class="d-flex flex-column align-items-center justify-content-center">
        <CRow class="mb-3">
            <div style="text-align: center;">
            <img
                alt="Smartandon Image"
                src="../../../standalone/assets/images/icon.png"
                style="max-width: 50%; height: auto; display: inline-block;"
            />
            </div>
        </CRow>
        
        <CRow class="mb-3" style="font-size: x-large; font-weight: bold; font-family: 'Inter', sans-serif; text-align: center;">
            Smartandon
        </CRow>
        
        <CRow style="width: 100%;">
            <hr style="width: 100%;" />
        </CRow>
        
        <CRow>
            Welcome to Smartandon
        </CRow>
        </CCardBody>
    </CCard>
</template>

<script setup>
import { CCard, CCardBody, CRow } from '@coreui/vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
</style>