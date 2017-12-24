<template lang="html">
  <div class="navigator">
    <h2 class="title">
      <router-link :to="{ path: 'index'}" class="link">{{ $t('lang.bookTitle') }}</router-link>
    </h2>
    <ul class="chapter">
      <li v-for="(dir,cIndex) in dirs">
        <router-link :to="{path: dir.componentName}" class="link"
          v-bind:class="{active: activeChapter === 'c-'+(cIndex+1)}" >{{dir.chapter}}</router-link>
        <ul class="section">
          <li v-for="(sec,sIndex) in dir.sections">
            <router-link :to="{ path: dir.componentName+ '#c-' + (cIndex+1) + '-' + (sIndex+1)}" class="link"
              v-bind:class="{active: activeSection === sIndex + 1}">{{sec}}</router-link>
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
      dirs: this.$i18n.t('lang.directory')
    }
  },
  props: ['activeChapter','activeSection']
}
</script>
