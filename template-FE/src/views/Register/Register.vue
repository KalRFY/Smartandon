<template>
  <div class="register-page d-flex align-items-center justify-content-center min-vh-100 bg-light bg-blurred">
    <div class="register-header text-center mb-4">
    </div>

    <RegisterForm
      v-model:name="name"
      v-model:noreg="noreg"
      v-model:phone="phone"
      :isLoading="isLoading"
      @submit="onRegister"
    />

    <ResponseSection
      :error="error"
      :success="success"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RegisterForm from './components/RegisterForm.vue'
import ResponseSection from './components/ResponseSection.vue'
import api from '@/apis/CommonAPI'

const name = ref('')
const noreg = ref('')
const phone = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const onRegister = async () => {
  error.value = ''
  success.value = ''

  if (!name.value || !noreg.value || !phone.value) {
    error.value = 'Please fill all fields.'
    return
  }

  isLoading.value = true

  try {
    const response = await api.post('/auth/register', {
      name: name.value,
      noreg: noreg.value,
      phone: phone.value,
    })
    if (response?.status === 201 || response?.status === 200) {
      success.value = 'Registration successful!'
      setTimeout(() => {
        success.value = ''
        window.location.href = '/#/app/dashboard'
      }, 3000)
      name.value = ''
      noreg.value = ''
      phone.value = ''
      setTimeout(() => {
        window.location.href = '/#/auth/login'
      }, 1000)
    } else {
      const errorData = response?.response?.data
      if (errorData && errorData.errors) {
        throw new Error(errorData.errors[0] || 'Registration failed. Please try again.')
      } else if (errorData && errorData.message) {
        throw new Error(errorData.message || 'Registration failed. Please try again.')
      } else {
        throw new Error('Registration failed. Please try again.')
      }
    }
  } catch (e) {
    error.value = e.message || 'Registration failed. Please try again.'
    setTimeout(() => {
      error.value = ''
    }, 3000)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.register-header {
  max-width: 550px;
  margin: 0 auto 24px;
  text-align: center;
}

.register-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.min-vh-100 {
  min-height: 100vh;
}

.bg-light {
  background-color: #f8f9fa;
}

.mb-4 {
  margin-bottom: 1.5rem;
}
</style>