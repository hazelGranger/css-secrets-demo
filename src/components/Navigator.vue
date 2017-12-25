<template lang="html">
  <div class="navigator">
    <h2 class="title">
      <router-link :to="{ path: 'index'}" class="link">{{ $t('lang.bookTitle') }}</router-link>
    </h2>
    <langSelector v-on:getLangFromSelector="updateLang"></langSelector>
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
import langSelector from './LangSelector.vue'
export default {
  data(){
    return {
      dirs: this.$i18n.t('lang.directory')
    }
  },
  components: {
    langSelector
  },
  props: ['activeChapter','activeSection'],
  methods: {
    updateLang() {
      this.dirs = this.$i18n.t('lang.directory');
    }
  }
}
</script>
