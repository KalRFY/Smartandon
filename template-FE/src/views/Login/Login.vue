<template>
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100 bg-light bg-blurred">
    <div class="login-header text-center mb-4">
    </div>

    <LoginForm
      v-model:noreg="noreg"
      v-model:password="password"
      :isLoading="isLoading"
      @submit="onLogin"
    />

    <ResponseSection
      :error="error"
      :success="success"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import ResponseSection from './components/ResponseSection.vue'
import api from '@/apis/CommonAPI'

const password = ref('')
const isLoading = ref(false)
const error = ref('')
const noreg = ref('')
const success = ref('')

const onLogin = async () => {
  error.value = ''
  success.value = ''

  if (!noreg.value || !password.value) {
    error.value = 'Please fill all fields.'
    return
  }

  isLoading.value = true

  try {
    const response = await api.post('/auth/login', {
      noreg: noreg.value,
      password: password.value,
    })
    if (response?.status === 200) {
        success.value = 'Login successful!'
        setTimeout(() => {
          success.value = ''
          window.location.href = '/#/app/dashboard'
        }, 3000)
        const data = response.data
        console.log('Login data:', data)
        localStorage.setItem('token', data.token)
        noreg.value = ''
        password.value = ''
    } else {
      throw new Error(response?.response?.data?.message || 'Login failed. Please try again.')
    }
  } catch (e) {
    error.value = e.message || 'Login failed. Please try again.'
    console.error('Login error:', e)
    setTimeout(() => {
      error.value = ''
    }, 3000)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.login-header {
  max-width: 550px;
  margin: 0 auto 24px;
  text-align: center;
}

.login-header::before {
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
