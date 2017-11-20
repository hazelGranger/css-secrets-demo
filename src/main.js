import Vue from 'vue';
import VueRouter from 'vue-router';
// import VueResource from 'vue-resource'

import App from './app.vue';
// import routermaps from './router';
require('./styles/common.less');
require('./styles/bgAndBorders.css');
require('./styles/shapes.css');
require('./styles/visualEffects.css');


import Index from './views/index.vue';
import BgAndBorders from './views/bgAndBorders.vue'
import Shapes from './views/shapes.vue'
import VisualEffects from './views/visualEffects.vue'

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
  component: BgAndBorders,
  meta: { scrollToTop: true }
},{
  path: '/shapes',
  component: Shapes,
  meta: { scrollToTop: true }
},{
  path: '/visualEffects',
  component: VisualEffects,
  meta: { scrollToTop: true }
}]

const scrollBehavior = (to,from,savedPosition) =>{
  if (savedPosition) {
    return savedPosition
  }else {
    const position = {}
    if (to.hash) {
      position.selector = to.hash
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0;
      position.y = 0;
    }
    return position
  }
}

const router = new VueRouter({
  routes,
  scrollBehavior
})

new Vue({
  el: '#css-secrets-demo',
  router,
  template: '<App/>',
  components: { App }
})
