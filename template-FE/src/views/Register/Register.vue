<template>
  <div
    class="register-page d-flex align-items-center justify-content-center min-vh-100 bg-light bg-blurred"
  >
    <div
      class="register-card card shadow p-4"
      style="min-width: 240px; max-width: 550px; width: 100%"
    >
      <div class="register-header text-center mb-4 primary">
        <h2 class="register-title mb-1">Smartandon</h2>
        <h4 class="mb-0 text-accent">Register</h4>
      </div>

      <form @submit.prevent="onRegister">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <div class="input-wrapper">
            <input
              v-model="name"
              type="text"
              class="form-control"
              id="name"
              placeholder="Enter your name"
              required
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="noreg" class="form-label">Noreg</label>
          <div class="input-wrapper">
            <input
              v-model="noreg"
              type="text"
              class="form-control"
              id="noreg"
              placeholder="Enter your Noreg"
              required
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <div class="input-wrapper">
            <input
              v-model="phone"
              type="tel"
              class="form-control"
              id="phone"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-accent w-100"
          :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          <span v-else>Register</span>
        </button>
      </form>

      <div v-if="error" class="alert alert-danger mt-3" role="alert">
        <div class="alert-icon">⚠</div>
        <span>{{ error }}</span>
      </div>

      <div v-if="success" class="alert alert-success mt-3" role="alert">
        <div class="alert-icon">✓</div>
        <span>{{ success }}</span>
      </div>
      <div class="text-center mt-3">
        <span>Already have an account?</span>
        <a
          href="./#/auth/login/"
          class="ms-1"
          style="
            text-decoration: underline;
            cursor: pointer color;
            color: #dc2626;
            font-weight: bold;
          "
          >Login</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        noreg: noreg.value,
        phone: phone.value,
      }),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Registration failed. Please try again.')
    }
    success.value = 'Registration successful!'
    name.value = ''
    noreg.value = ''
    phone.value = ''
    setTimeout(() => {
      window.location.href = '/#/auth/login'
    }, 1000)
  } catch (e) {
    error.value = e.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
  background: #fbeaec;
}

.register-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 8px 16px -4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.register-header {
  background: linear-gradient(135deg, #dc2626 0%, #a61b1b 100%);
  border-radius: 16px 16px 0 0;
  padding: 32px 24px 24px;
  margin: -24px -24px 24px -24px;
  color: #fff;
  box-shadow: 0 10px 25px -5px rgba(229, 83, 83, 0.3);
  position: relative;
  overflow: hidden;
}

.register-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.brand-logo {
  position: relative;
  z-index: 1;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  font-size: 24px;
  font-weight: 700;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.logo-icon:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.register-title {
  position: relative;
  z-index: 1;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 0.25rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-accent {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  font-size: 1.1rem;
}

.form-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
}

.form-control {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-control:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
  outline: none;
  background: #ffffff;
}

.form-control::placeholder {
  color: #a0aec0;
  font-weight: 400;
}

.btn-accent {
  background: linear-gradient(135deg, #dc2626 0%, #a61b1b 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(229, 83, 83, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-accent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-accent:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 83, 83, 0.4);
}

.btn-accent:hover:not(:disabled)::before {
  opacity: 1;
}

.btn-accent:active:not(:disabled) {
  transform: translateY(0);
}

.btn-accent:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-accent span {
  position: relative;
  z-index: 1;
}

.spinner-border {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
  background: rgba(248, 113, 113, 0.1);
  color: #dc2626;
  border: 1px solid rgba(248, 113, 113, 0.2);
}

.alert-success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
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
.text-center {
  text-align: center;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-3 {
  margin-bottom: 1rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
.mt-3 {
  margin-top: 1rem;
}
.me-2 {
  margin-right: 0.5rem;
}
.w-100 {
  width: 100%;
}
.p-4 {
  padding: 1.5rem;
}
.card {
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

@media (max-width: 480px) {
  .register-card {
    margin: 16px;
    min-width: auto !important;
  }

  .register-header {
    padding: 24px 20px 20px;
    margin: -24px -24px 20px -24px;
  }

  .register-title {
    font-size: 1.8rem;
  }

  .form-control {
    padding: 12px 14px;
  }

  .btn-accent {
    padding: 14px 20px;
  }
}

* {
  transition: all 0.2s ease;
}

.form-control:focus,
.btn-accent:focus {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}
</style>
