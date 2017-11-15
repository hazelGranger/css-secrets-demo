import Vue from 'vue';
import VueRouter from 'vue-router';
// import VueResource from 'vue-resource'

import App from './app.vue';
// import routermaps from './router';
require('./styles/common.less');
require('./styles/bgAndBorders.css');


import Index from './views/index.vue';
import BgAndBorders from './views/bgAndBorders.vue'

Vue.use(VueRouter)
// Vue.use(VueResource)


const routes = [{
  path: '/',
  component: Index
},{
  path: '/index',
  component: Index
},{
  path: '/bgAndBorders',
  component: BgAndBorders
}]

const router = new VueRouter({
  routes
})

new Vue({
  el: '#css-secrets-demo',
  router,
  template: '<App/>',
  components: { App }
})
