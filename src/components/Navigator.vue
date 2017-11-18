<template lang="html">
  <div class="navigator">
    <h2 class="title">
      <router-link :to="{ path: 'index'}" class="link">Index 目录</router-link>
    </h2>
    <ul class="chapter">
      <li v-for="dir in dirs">
        <router-link :to="{path: dir.componentName}" class="link">{{dir.chapter}}</router-link>
        <ul class="section">
          <li v-for="(sec,index) in dir.sections">
            <router-link :to="{ path: dir.componentName+'#c-1-'+ (index+1)}" class="link">{{sec}}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import directory from '../data/directory.js'
export default {
  data(){
    return {
      dirs: directory
    }
  }
}
</script>

<style lang="less">
  .navigator{
    position: fixed;
    //为了局部滚动
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    overflow-y: auto;
    width: 350px;
    .title{
      text-indent: 15px;
    }
    .link{
      color: #ff0066;
      opacity: 0.8;
    }
    .chapter{
      & > li{
        padding: 15px;
        font-size: 15px;
      }
    }
    .section{
      //max-height: 0;
      // overflow: hidden;
      // transform: translateY(-20px);
      // //opacity: 0;
      // transition: opacity .3s ease-in-out,transform .3s ease-in-out;
      & > li {
        padding: 15px;
        font-size: 14px;
      }
    }
  }
</style>
