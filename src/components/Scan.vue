<template>
  <div :style="{height:height+'px',width:width+'px'}">
    <video ref="v" autoplay :width="width" :height="height" style="position: absolute"></video>
    <canvas id="show" ref="show" :width="width" :height="height" style="position: absolute;z-index: 2"></canvas>
    <canvas id="img_base64" ref="img_base64" hidden></canvas>
  </div>
  <div>{{msg1}}</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {toRaw} from 'vue'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cv =require('../assets/opencv.js')
@Options({
  props: {
    msg: String,
    height: {
      default: 480
    },
    width:{
      default: 640
    },
    is_scan:false
  },
})
export default class Scan extends Vue {
  msg1='';
  height!:number;
  width!:number;
  face_scan:any;
  cap:any= null;
  is_scan!:boolean;
  is_updating=false;
  start_time=0;
  sleep(time:number):Promise<unknown>{
    return new Promise(resolve => setTimeout(resolve,time))
  }
  created():void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this=this
    this.createFileFromUrl("haarcascade_frontalface_default.xml", () => {
      console.log('人脸识别文件加载完成')
    });
    navigator.mediaDevices.getUserMedia({ audio: false, video: { width: this.width, height: this.height } })
        .then(function(mediaStream) {
          let video = _this.$refs.v as any;
          video.srcObject = mediaStream;
          _this.cap = new cv.VideoCapture(video);
          _this.start_show_face()
        })
  }
  show_pic(): void {
    let frame = new cv.Mat(this.height,this.width, cv.CV_8UC4);
    this.cap.read(frame)
    cv.imshow('show',frame)
  }
  private start_show_face():void{
    let begin = Date.now();
    let delay=0;
    if (this.is_scan) {
      const face_scan = toRaw(this.face_scan)
      if (toRaw(this.face_scan) === undefined) {
        this.face_scan = new cv.CascadeClassifier('haarcascade_frontalface_default.xml')
      } else {
        const frame = new cv.Mat(this.height, this.width, cv.CV_8UC4);
        this.cap.read(frame);
        const faces = new cv.RectVector();
        const msize = new cv.Size(120, 120);
        face_scan.detectMultiScale(frame, faces, 1.1, 3, 0, msize);
        let context = (this.$refs.show as any).getContext('2d')
        context.strokeStyle = "#00ee00";
        context.clearRect(0, 0, this.width, this.height)
        for (let i = 0; i < faces.size(); ++i) {
          let face = faces.get(i);
          context.strokeRect(face.x, face.y, face.width, face.height);
        }
        if (faces.size()>0 && !this.is_updating){
          this.is_updating=true
          this.start_time=begin
          cv.imshow('img_base64',frame)
          let base64:string= (this.$refs.img_base64 as any).toDataURL()
          fetch(this.$store.state.base_url+`school_system/get_ShenFenZheng_by_ImgBase64`,{
            headers:{'Content-Type': 'application/json'},
            method:'post',
            body:JSON.stringify({
              img_base64:base64
            })
          })
          .then(r=>r.json())
          .then(json=>{
            // console.log(json)
            this.msg1=json
            this.is_updating=false
            console.log(Date.now() -this.start_time)
          })
        }
        context.fill()
        frame.delete()
        faces.delete()
      }
    }
    delay = 1000/10 - (Date.now() - begin)
    this.sleep(delay).then(this.start_show_face)
  }
  //内部函数
  private createFileFromUrl(path: string, callback: any):void{
    let request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          let data = new Uint8Array(request.response);
          cv.FS_createDataFile("/", path, data, true, false, false);
          callback();
        } else {
          console.log("文件加载错误");
        }
      }
    };
    request.send();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
