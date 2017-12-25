<template lang="html">
  <select class="langSelector" v-model="lang" v-bind:change="changeLang()">
    <option value="cn">简体中文</option>
    <option value="en">English</option>
  </select>
</template>

<script>
export default {
  data (){
    return{
      lang: this.getBrowserLang()
    }
  },
  methods: {
    getBrowserLang() {
      if (navigator.language == "zh-CN") {
        return "cn";
      }else{
        return "en"
      }
    },
    changeLang() {
      this.$i18n.locale = this.lang;
      this.$emit('getLangFromSelector');
    }
  }
}
</script>
