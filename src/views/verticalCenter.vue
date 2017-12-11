<template lang="html">
  <div class="content simulateBody" v-bind:class="[{bodyForFlex: id ==='flexbox1'},{myFlexBody: id === 'flexbox2'}]">
    <div class="main main1" v-if="id === 'absPos1' ">
      {{shareText}}
    </div>
    <div class="main main2" v-if="id === 'absPos2' ">
      {{shareText}}
    </div>
    <div class="main main3" v-if="id === 'viewport'">
      {{shareText}}
    </div>
    <div class="main main4" v-if="id === 'flexbox1'">
      {{shareText}}
    </div>
    <div class="main main5" v-if="id === 'flexbox2'">
      {{shareText}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      shareText: 'I am centered! Vertical centered! Horizonal centered!'
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
  padding: 0!important;
}
.simulateBody{
  width: 100%;
  height: 100%;
  background-color: rgb(214, 224, 85);
}
.bodyForFlex{
  display: flex;
}
.myFlexBody{
  display: flex;
  justify-content: center;
  align-items: center;
}
.main{
  background: #666;
  font-size: 150%;
  padding: 15px;
  color: #fff;
  text-align: center;
}
.main1{
  position: absolute;
  top: calc(~"50% - 3em");
  left: calc(~"50% - 6em");
  width: 12em;
  height: 6em;
}
.main2{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.main3{
  width: 12em;
  margin: 50vh auto 0;
  transform: translateY(-50%);
}
.main4{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12em;
  margin: auto;
}
.main5{
  width: 12em;
}
</style>
