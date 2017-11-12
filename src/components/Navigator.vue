<template lang="html">
  <ul>
    <li v-for="dir in dirs">
      {{dir.chapter}}
      <ul>
        <li v-for="sec in dir.sections">{{sec}}</li>
      </ul>
    </li>
  </ul>

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

<style lang="css">
</style>
