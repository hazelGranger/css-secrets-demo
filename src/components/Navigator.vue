<template lang="html">
  <div class="navigator">
    <h2>Index 目录</h2>
    <ul class="chapter">
      <li v-for="dir in dirs">
        <a href="#" class="chapter-link"></a>
        <router-link to="/bgAndBorders">{{dir.chapter}}</router-link>
        <ul class="section">
          <li v-for="sec in dir.sections">
            <a href="#" class="section-link">{{sec}}</a>
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
    // position: absolute;
    // left: -100%;
    width: 350px;
    // border: 6px solid #ff0066;
    // border-radius: 16px;
    // background: #ffebf3;
    // box-shadow: #ff0066 8px 0px 20px -5px;
    .chapter{
      & > li{
        padding: 15px;
        font-size: 15px;
        &:hover{
          .section{
            max-height: 100%;
            transform: translateY(0px);
            opacity: 1;
          }
        }
        .chapter-link{
          color: #ff0066;
          opacity: 0.8;
        }
      }
    }
    .section{
      max-height: 0;
      overflow: hidden;
      transform: translateY(-20px);
      opacity: 0;
      transition: opacity .3s ease-in-out,transform .3s ease-in-out;
      .section-link{
        color: #ff0066;
        opacity: 0.8;
      }
      & > li {
        padding: 15px;
        font-size: 14px;
      }
    }
  }
</style>
