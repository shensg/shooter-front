<template>
  <a-affix :offset-bottom="10">
    <a-popover>
      <template #content><p>刷新阿里云CDN</p></template>
      <a-button type="primary" @click="setActiveInput('aliyun')">阿里云</a-button>
    </a-popover>

    <a-popover>
      <template #content><p>刷新CloudFlareCDN</p></template>
      <a-button type="primary" @click="setActiveInput('cloudflare')">CloudFlare</a-button>
    </a-popover>
  </a-affix>

  <div class="formt-content" v-if="activeInput">
    <a-textarea
      v-model:value="value"
      :rows="12"
      :placeholder="inputPlaceholder"
      :maxlength="2048"
    />
    <a-checkbox v-model:checked="formState.esastated">ESA</a-checkbox>
    <a-button type="primary" class="submit-button" @click="submitInput">提交</a-button>
  </div>

  <div class="formt-content" v-if="activeInput">
    <h3>{{ activeInput }}上次刷新：{{ formRefreshRecord.createAt }}</h3>
    <ul>
      <li v-for="(item, index) in formRefreshRecord.record" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import ApiService from '@/utils'
import { reactive, ref, computed, watch, onMounted } from 'vue'

interface ApiResponse<T> {
  code: number
  data: T
  msg: string
}

interface FormState {
  esastated: boolean;
}

const formState = reactive<FormState>({
  esastated: false
})

interface RefreshRecord<T = unknown> {
  createAt: Date;
  record: T[];
}

const formRefreshRecord = ref<RefreshRecord>({
  createAt: new Date(),
  record: []
})

const value = ref('')
const activeInput = ref<'aliyun' | 'cloudflare'>('cloudflare')

const setActiveInput = (type: 'aliyun' | 'cloudflare') => {
  activeInput.value = type
  value.value = ''
}

const submitInput = async () => {
  if (!value.value.trim()) {
    alert('请输入完整的地址再提交！')
    return
  }

  const valueList = value.value
    .split('\n')
    .map(item => item.trim())
    .filter(item => item)

  const postData = { code: 200, data: { stated: formState.esastated, data: valueList }, msg: '' }
  const platform = activeInput.value

  try {
    const endpoint =
      platform === 'aliyun' ? '/refresh/aliyun' : '/refresh/cloudflare'

    const response = await ApiService.post<ApiResponse<null>, typeof postData>(
      endpoint,
      postData
    )

    if (response.code === 200) {
      alert(`提交成功！最快30秒内生效！\n${platform === 'aliyun' ? '阿里云' : 'CloudFlare'} 内容：\n${valueList}`)
      value.value = ''
    } else {
      alert(`提交异常！\n内容：\n${valueList}`)
    }
  } catch (error) {
    alert(`提交失败！\n错误：${error}`)
  }
}

const getRefreshRecord = async () => {
  const platform = activeInput.value

  try {
    const response = await ApiService.get<ApiResponse<RefreshRecord>>('/refresh/record/get', { platform })

    if (response.code === 200) {
      formRefreshRecord.value = response.data
    } else {
      console.error(`获取刷新记录失败：${response.msg}`)
    }
  } catch (error) {
    console.error('获取刷新历史记录失败！错误：', error)
  }
}

// 监听 activeInput 的变化，自动调用 getRefreshRecord
watch(activeInput, () => {
  getRefreshRecord()
})

onMounted(() => {
  getRefreshRecord()
})

const inputPlaceholder = computed(() =>
  activeInput.value === 'aliyun'
    ? '请不要同时提交不同域名链接，同时提交不同域名链接可能会失败！！！\n阿里云CDN：http://example.com/cat/\n最多每次提交10个链接，建议刷新文件夹！！！\n刷新时文件和文件夹不能放在一起刷新'
    : '请不要同时提交不同域名链接，同时提交不同域名链接可能会失败！！！\nCloudFlareCDN：https://example.com/cat/a.png'
)
</script>

<style scoped lang="scss">
.formt-content {
  margin-top: 20px;
  padding: 20px;
  padding-left: 100px;
  padding-right: 100px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.submit-button {
  margin-top: 10px;
  display: block;
  width: 100px;
  margin-left: auto;
  margin-right: auto;
}
</style>
