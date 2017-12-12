<template lang="html">
  <div class="content simulateBody">
    <header>
      <h1>Welcome to the Sticky Footer Page!</h1>
    </header>
    <main>
      <p>{{para1}}</p>
      <p>{{para2}}</p>
      <p><a v-on:click="showToggle" >{{toggleText}}</a></p>
      <p v-if="showPara">{{para3}}</p>
    </main>
    <footer>
      <p>© 2017 No rights reserved.</p>
      <p>Made with ♥ by an anonymous coder.</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      para1: "Lincoln University (Māori: Te Whare Wanaka o Aoraki) is a New Zealand university that was formed in 1990 when Lincoln College, Canterbury was made independent of the University of Canterbury. Its undergraduate study areas include agriculture, commerce, computing, engineering, environment, food, forestry, horticulture, hospitality, landscape, Māori planning, property, recreation, sciences, transport and winemaking.",
      para2: "Lincoln University has a student population from more than 60 countries.[4] Its primary campus is situated on 50 hectares (123 acres) of land located about 15 km (9 mi) outside the city of Christchurch in Lincoln, Canterbury.",
      para3: "Lincoln University began life in 1878 as a School of Agriculture. From 1896 to 1961 it served students under the name \"Canterbury Agricultural College\", and offered qualifications of the University of New Zealand until that institution's demise. From 1961 to 1990, it was known as Lincoln College, a constituent college of the University of Canterbury, until achieving autonomy in 1990 as Lincoln University.[6] It is the oldest agricultural teaching institution in the Southern Hemisphere. It remains the smallest university in New Zealand and one of the 8 government universities.[7] The University is a member of the Euroleague for Life Sciences.",
      showPara: false,
      toggleText: "Show All Text"
    }
  },
  methods: {
    showToggle() {
      this.showPara = !this.showPara;
      this.toggleText = this.showPara ? "Hide the rest" : "Show All Text";
    }
  }
}
</script>

<style lang="less">
.navigator{
  display: none;
}
.content{
  margin-left: 0!important;
  padding: 0!important;
}
.simulateBody{
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
header{
  background-color: #d6e055;
  text-align: center;
  h1{
    color: #fff;
  }
}
main{
  flex: 1;
  padding: .5em calc(~"50% - 400px");
  font-size: 18px;
}
a{
  cursor: pointer;
}
footer{
  background: #333;
  color: #fff;
  padding: .5em calc(~"50% - 400px");
}
</style>
