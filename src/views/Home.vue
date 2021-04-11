<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <scan :is_scan="is_scan" :height="480" :width="720"></scan>
    <button @click="start">开始</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Scan from "@/components/Scan.vue"

@Options({
  components: {
    HelloWorld,
    Scan
  },
})
export default class Home extends Vue {
  is_scan=false
  start():void{
    this.is_scan=!this.is_scan
  }
}
</script>
