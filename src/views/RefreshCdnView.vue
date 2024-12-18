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
      :rows="14"
      :placeholder="inputPlaceholder"
      :maxlength="2048"
    />
    <a-button type="primary" class="submit-button" @click="submitInput">提交</a-button>
  </div>
</template>

<script lang="ts" setup>
import ApiService from '@/utils'
import { ref, computed } from 'vue'

interface ApiResponse<T> {
  code: number
  data: T
  msg: string
}

const value = ref('')
const activeInput = ref<'aliyun' | 'cloudflare'>('aliyun')

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

  const postData = { code: 200, data: valueList, msg: '' }
  const platform = activeInput.value

  try {
    const endpoint =
      platform === 'aliyun' ? '/refresh/aliyun' : '/refresh/cloudflare'

    const response = await ApiService.post<ApiResponse<null>, typeof postData>(
      endpoint,
      postData
    )

    if (response.code === 200) {
      alert(`提交成功！\n${platform === 'aliyun' ? '阿里云' : 'CloudFlare'} 内容：\n${valueList}`)
      value.value = ''
    } else {
      alert(`提交异常！\n内容：\n${valueList}`)
    }
  } catch (error) {
    alert(`提交失败！\n错误：${error}`)
  }
}

const inputPlaceholder = computed(() =>
  activeInput.value === 'aliyun'
    ? '请输入需要刷新的完整地址！！！\n阿里云CDN：http://example.com/cat/a.png'
    : '请输入需要刷新的完整地址！！！\nCloudFlareCDN：https://example.com/cat/a.png'
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
