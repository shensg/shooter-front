<template>
  <div class="form-container">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]">
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import ApiService from '@/utils'
import router from '@/router'
import { jwtDecode } from 'jwt-decode'

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true
})

interface LoginResponse {
  token: string;
}

const onFinish = async (values: FormState) => {
  try {
    const response = await ApiService.post<LoginResponse, FormState>('/login', values)

    if (response.token) {
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('currentUser', values.username)
    }

    router.push('/')
  } catch (error) {
    console.error('Login failed: ', error)
    alert('Login failed, please try again!')
  }
}

const onFinishFailed = (errorInfo: unknown) => {
  console.log('Failed: ', errorInfo)
  alert('Form submission failed, please check your inputs.')
}
</script>

<style scoped lang="scss">
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
</style>
