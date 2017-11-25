<template >
  <div class="wrapper">
    <navigator></navigator>
    <router-view></router-view>
  </div>
</template>
<script>
import navigator from './components/Navigator.vue'
export default {
  data() {
    return{
      title: "css-secret-demo"
    }
  },
  components :{
    navigator
  }
}
</script>
