<template lang="html">
  <div class="content">
    <main v-bind:class="{deEmphasized: blurDialogShow}">
      <img src="https://cloud.githubusercontent.com/assets/1231359/14773652/5bf7c006-0adf-11e6-8712-70be89b3b97d.jpg"
      alt="[CSS Secrets 简体中文版 - 封面]" class="cover-img">
      <p>Welocome to this page!</p>
      <button v-on:click="showBlurDialog">Show Dialog</button><br>
    </main>
    <div class="dialog" v-if="blurDialogShow">
      <span class="close-btn" title="关闭" v-on:click="hideBlurDialog">X</span>
      Hello I'am a dialog!<br>
      Enjoy the Blur!
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blurDialogShow: false
    }
  },
  methods: {
    showBlurDialog() {
      this.blurDialogShow = true;
    },
    hideBlurDialog() {
      this.blurDialogShow = false;
    }
  }
}
</script>

<style lang="less">
.navigator{
  display: none;
}
.content{
  margin-left: 0!important;
}
main{
  padding: 30px;
  &.deEmphasized{
     z-index: 1;
     -webkit-filter: blur(3px);
     filter: blur(3px);
   }
}
.cover-img{
  width: 500px;
  margin-left: -80px;
}
button{
  font-size: 20px;
}
.dialog{
  position: fixed;
  width: 300px;
  height: 250px;
  top: 50%;
  left: 50%;
  margin: -150px;
  z-index: 2;
  border: 1px solid silver;
  border-radius: 6px;
  box-shadow: 0 0.2em 0.5em rgba(0,0,0,.5), 0 0 0 100vmax rgba(0,0,0,.2);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  .close-btn{
    position: absolute;
    top: 10px;
    right: 10px;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
