import Vue from 'vue'
import VueI18n from 'vue-i18n';

import directory from '../data/directory.js'

Vue.use(VueI18n);

const messages = {
  en: {
    lang: {
      directory: directory.en,
      bookTitle: 'CSS Secrets Demos'
    }
  },
  cn: {
    lang: {
      directory: directory.cn,
      bookTitle: 'CSS 揭秘示例集'
    }
  }
}

const i18n = new VueI18n({
  locale: 'cn',
  messages
});

export default i18n;
