import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import VueAnalytics from 'vue-analytics'

import App from './app';
import router from './router/';
import i18n from './i18n/'
import ga from './ga/'

// import style files
require('./styles/main.less');

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(VueAnalytics,ga);

new Vue({
  el: '#css-secrets-demo',
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
