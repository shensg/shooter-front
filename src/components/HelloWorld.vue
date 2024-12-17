<template>
  <div>
    <h1>{{ msg }}</h1>
    <!-- <ul>
      <li>这是一个简易的运维平台项目，可以帮忙运维人员提高效率</li>
      <li>1、集成了基础的软件包安装。</li>
      <li>2、对Kubernetes的管理，以及Kubernetes边缘大部分组件管理。</li>
      <li>3、对云原生资源进行管理。</li>
      <li>4、对于小白运维比较友好， 可以当做跳板机使用，有部分Jumpserver的功能。</li>
    </ul> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  }
})
</script>

<!-- <style scoped lang="scss">
.ul {
  list-style-position: inside;
  margin-left: 0;
  padding-left: 0;
}
.ul .li {
  margin-left: 0;
}
</style> -->
