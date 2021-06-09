<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
<!--    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
    <scan :is_scan="is_scan" ></scan>
    <el-button @click="start" type="primary">开始</el-button>
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
  created():void{
    fetch(this.$store.state.base_url+'school_system/get_ShenFenZheng_by_ImgBase64',{
      headers:{
        'Content-Type': 'application/json',
        'accept':'application/json'
      },
      method:'post',
      body:JSON.stringify({
        img_base64:'base64'
      })
    })
        .then(r=>r.json())
        .then(json=>console.log(json))
  }
}
</script>
