import Vue from 'vue';
import VueRouter from 'vue-router';
// import VueResource from 'vue-resource'

import App from './app.vue';
// import routermaps from './router';

// import style files
require('./styles/main.less');

import Index from './views/index.vue';
import BgAndBorders from './views/bgAndBorders.vue'
import Shapes from './views/shapes.vue'
import VisualEffects from './views/visualEffects.vue'
import Typography from './views/typography.vue'
import UserExperience from './views/userExperience.vue'
import BlurDialog from './views/blurDialog.vue'
import StructureAndLayout from './views/structureAndLayout.vue'
import FluidBg from './views/fluidBg.vue'
import VerticalCenter from './views/verticalCenter.vue'
import StickyFooter from './views/stickyFooter.vue'
import TransitionsAndAnimations from './views/transitionsAndAnimations.vue'

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
},{
  path: '/typography',
  component: Typography,
  meta: { scrollToTop: true }
},{
  path: '/userExperience',
  component: UserExperience,
  meta: {scrollToTop: true }
},{
  path: '/blurDialog',
  component: BlurDialog
},{
  path: '/structureAndLayout',
  component: StructureAndLayout,
  meta: { scrollToTop: true }
},{
  path: '/fluidBg',
  component: FluidBg
},{
  path: '/verticalCenter/:id',
  component: VerticalCenter
},{
  path: '/stickyFooter',
  component: StickyFooter
},{
  path: '/transitionsAndAnimations',
  component: TransitionsAndAnimations
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
