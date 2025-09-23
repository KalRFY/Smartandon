<template>
    <div class="register-card card shadow">
        <div class="card-content d-flex">
        <div class="form-side p-4">
            <h2 class="form-title mb-2">Register</h2>
            <div class="form-subtitle mb-4">Input your credentials</div>

            <form @submit.prevent="onSubmit">
            <div class="mb-3">
                <label for="name" class="form-label ms-3">Name</label>
                <div class="input-wrapper">
                <input 
                    v-model="nameModel" 
                    type="text" 
                    class="form-control ms-3" 
                    id="name" 
                    placeholder="Enter your name" 
                    required 
                />
                </div>
            </div>

            <div class="mb-3">
                <label for="noreg" class="form-label ms-3">Noreg</label>
                <div class="input-wrapper">
                <input 
                    v-model="noregModel" 
                    type="text" 
                    class="form-control ms-3" 
                    id="noreg" 
                    placeholder="Enter your noreg"
                    required 
                />
                </div>
            </div>

            <div class="mb-4">
                <label for="phone" class="form-label ms-3">Phone</label>
                <div class="input-wrapper">
                <input 
                    v-model="phoneModel" 
                    type="tel" 
                    class="form-control ms-3" 
                    id="phone" 
                    placeholder="Enter your phone number"
                    required 
                />
                </div>
            </div>

            <button 
                type="submit" 
                class="btn btn-accent w-100 ms-3" 
                :disabled="isLoading"
            >
                <span 
                v-if="isLoading" 
                class="spinner-border spinner-border-sm me-2"
                ></span>
                <span v-else>Register</span>
            </button>
            </form>

            <div class="text-center mt-3 ms-4">
            <span>Already have an account?</span>
            <a 
                href="./#/auth/login/" 
                class="register-link ms-1"
            >Login</a>
            </div> 
        </div>

        <div class="image-side">
            <div class="image-wrapper">
            <img 
                :src="loginPhoto" 
                alt="Plant 1" 
                class="login-image" 
            />
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import loginPhoto from '@/assets/images/plant_1.jpg'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    noreg: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:name', 'update:noreg', 'update:phone', 'submit'])

const nameModel = computed({
    get: () => props.name,
    set: (value) => emit('update:name', value)
})

const noregModel = computed({
    get: () => props.noreg,
    set: (value) => emit('update:noreg', value)
})

const phoneModel = computed({
    get: () => props.phone,
    set: (value) => emit('update:phone', value)
})

const onSubmit = () => {
    emit('submit')
}
</script>

<style scoped>
.register-card {
  max-width: 1100px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.card-content {
  display: flex;
  height: 100%;
}

.form-side {
  flex: 1;
}

.form-title {
  font-size: 26px;
  font-weight: 600;
}

.form-subtitle {
  font-size: 16px;
  font-weight: 400;
}

.form-title,
.form-subtitle {
  text-align: center;
  width: 100%;
  margin-left: 13px;
}

.image-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.image-wrapper {
  width: 100%;
  max-width: 476px;
  height: 320px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.form-label {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.input-wrapper {
  position: relative;
}

.form-control {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 14px;
  width: 100%;
  box-sizing: border-box;
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
  padding: 12px;
  border-radius: 8px;
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

.register-link {
  color: #dc2626;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.d-flex {
  display: flex;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.ms-1 {
  margin-left: 0.25rem;
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

@media (max-width: 768px) {
  .register-card {
    margin: 16px;
    min-width: auto !important;
  }

  .card-content {
    flex-direction: column;
  }

  .image-side {
    display: none;
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