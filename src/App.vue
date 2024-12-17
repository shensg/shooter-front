<template>
  <div id="app">
    <!-- 判断当前路由的meta.showMenu，若为true则显示Layout组件 -->
    <MenuView v-if="showMenu">
      <!-- 如果有Layout组件，子视图将会显示在此 -->
      <router-view />
    </MenuView>

    <router-view v-if="!showMenu" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MenuView from '@/components/MenuView.vue'

const route = useRoute()

// computed判断当前路由的meta.showMenu值，决定是否显示菜单
const showMenu = computed(() => route.meta.showMenu !== false)
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
