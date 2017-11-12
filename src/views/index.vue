<template >
  <div>
    <h1>index test {{msg}}</h1>
    <navigator></navigator>
  </div>
</template>

<script>
import navigator from '../components/Navigator.vue'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    navigator
  }
}
</script>
