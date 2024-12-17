<template>
  <!-- 固定在底部的按钮 -->
  <a-affix :offset-bottom="10">
    <a-button type="primary" @click="setActiveInput('aliyun')">
      阿里云
    </a-button>
    <a-button type="primary" @click="setActiveInput('cloudflare')">
      CloudFlare
    </a-button>
  </a-affix>

  <!-- 动态渲染输入框 -->
  <div class="formt-content" v-if="activeInput === 'aliyun'">
    <a-textarea
      v-model="value"
      :rows="12"
      placeholder="请输入需要刷新的完整地址！！！阿里云CDN：http://example.com/cat/a.png"
      :maxlength="2048"
    />
  </div>
  <div class="formt-content" v-if="activeInput === 'cloudflare'">
    <a-textarea
      v-model="value"
      :rows="12"
      placeholder="请输入需要刷新的完整地址！！！CloudFlareCDN：https://example.com/cat/a.png"
      :maxlength="2048"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 绑定输入框的值
const value = ref('')

// 当前激活的输入框类型
const activeInput = ref<'aliyun' | 'cloudflare'>('aliyun')

// 切换激活输入框
const setActiveInput = (type: 'aliyun' | 'cloudflare') => {
  activeInput.value = type
}
</script>

<style scoped lang="scss">
.formt-botton-container {
  margin-right: 15px;
}

.formt-content {
  margin-top: 20px;
  padding: 20px;
  padding-left: 15%;
  padding-right: 15%;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

a-button {
  margin-bottom: 10px;
}
</style>
