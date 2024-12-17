<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <img alt="Vue logo" src="../assets/shooter.gif">
    <HelloWorld msg="Welcome to shooter platform"/>
    <HuangLi />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import HuangLi from '@/components/HuangLiView.vue'
export default defineComponent({
  name: 'HomeView',
  components: {
    HelloWorld,
    HuangLi
  }
})

</script>
