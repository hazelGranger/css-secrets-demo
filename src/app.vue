<template >
  <div class="wrapper" >
    <navigator v-bind:activeChapter="navActiveChapter"
      v-bind:activeSection="navActiveSection"
    ></navigator>
    <router-view></router-view>
  </div>
</template>
<script>
import navigator from './components/Navigator.vue'
export default {
  data() {
    return{
      title: "css-secret-demo",
      scroll: false,
      navActiveChapter: "",
      navActiveSection: "",
      gap: 10
    }
  },
  components :{
    navigator
  },
  methods: {
    handleScroll() {
      this.scroll = window.scrollY;
      let AllSections = document.querySelectorAll('.c-section');
      let curChapter = document.querySelector('.c-chapter');
      let AllSectionsOffsetY = [];

      for (var i = 0; i < AllSections.length; i++) {
        AllSectionsOffsetY.push(AllSections[i].offsetTop);
      }

      if (curChapter) {
        this.navActiveChapter = curChapter.id;
      }else{
        return;
      }

      for (var j = 0; j < AllSectionsOffsetY.length; j++) {
        if(this.scroll + this.gap  < AllSectionsOffsetY[j]){
          this.navActiveSection = j;
          break;
        }else if (this.scroll > AllSectionsOffsetY[AllSectionsOffsetY.length-1]) {
          this.navActiveSection = AllSectionsOffsetY.length;
        }
      }
    }
  },
  created() {
    window.addEventListener('scroll',this.handleScroll);
  },
  updated(){
    this.handleScroll();
  },
  distroyed() {
    window.removeListener('scroll',this.handleScroll);
  }
}
</script>
