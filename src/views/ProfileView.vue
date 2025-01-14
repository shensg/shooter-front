<template>
  <div class="personal-center-layout">
    <main class="user-info">
      <a-avatar :size="128">{{ formState.roleName }}</a-avatar>
      <h2>{{ formState.username }}</h2>
      <h4>{{ formState.nickname }}</h4>
      <p>简介：{{ formState.describe }}</p>
    </main>

    <div class="form-container">
      <a-form
        :model="formState"
        v-bind="layout"
        name="userForm"
        @finish="onFinish"
      >
        <a-form-item name="userId" style="display: none">
          <a-input v-model:value="formState.userId" type="hidden" />
        </a-form-item>
        <a-form-item name="nickname" label="昵称" >
          <a-input v-model:value="formState.nickname" />
        </a-form-item>
        <a-form-item name= "email" label="Email" >
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <!-- <a-form-item name="titleUrl" label="头像地址" >
          <a-input v-model:value="formState.titleUrl" />
        </a-form-item> -->
        <a-form-item name="describe" label="描述" >
          <a-input v-model:value="formState.describe" />
        </a-form-item>
        <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 2 }">
          <!-- <a-button type="primary" html-type="submit">提交</a-button> -->
          <a-popconfirm title="请确认是否修改" @confirm="onFinish(formState)" @cancel="cancel">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-popconfirm>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ApiService from '@/utils/index'
import { message } from 'ant-design-vue'

interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

interface User {
  userId: number;
  username: string;
  nickname: string;
  email: string;
  roleName: string;
  describe: string;
}

const formState = ref<User>({
  userId: 0,
  username: 'admin',
  nickname: '',
  email: '',
  roleName: '',
  describe: ''
})

const getCurrentUser = async () => {
  try {
    const username = localStorage.getItem('currentUser') || ''
    const response = await ApiService.get<ApiResponse<User>>('/user/getcurrent', { username })
    formState.value = response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const cancel = (e: MouseEvent) => {
  console.log(e)
  message.error('用户取消修改')
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 20 }
}

const onFinish = async (values: User) => {
  try {
    const response = await ApiService.post<ApiResponse<null>, User>('/user/modify', values)
    console.log(response.msg)
    alert('用户信息修改成功！')
  } catch (error) {
    console.error('用户信息修改失败:', error)
    alert('用户信息修改失败，请重试。')
  }
}

onMounted(() => {
  getCurrentUser()
})
</script>

<style scoped lang="scss">
.personal-center-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;

  .user-info {
    text-align: center;
    padding: 20px;
    background: #ffffff;
  }
}

.form-container {
  display: flex;
  padding-left: 35%;
  padding-right: 35%;
  flex-direction: column;
  // justify-content: center;
  // align-items: center;
  height: 100%;
  width: 100%;
}

</style>
