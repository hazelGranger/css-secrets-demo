<template lang="html">
  <ul class="palette">
    <li v-for="(color,index) in palette" v-bind:style="{background: color}">
      <div class="color-options">
        <a class="add" v-on:click="addColor">Add</a>
        <a class="delete" v-on:click="deleteColor(index)">Delete</a>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return{
      colors: [
	       '#D6E055',
	       '#082323', '#E6E2AF', '#A7A37E', '#EFECCA', '#046380',
   	     '#1C171D', '#FEE169', '#CDD452', '#F9722E', '#C9313D',
   	     '#2E95A3', '#50B8B4', '#C6FFFA', '#E2FFA8'
      ],
      palette: ['#D6E055']
    }
  },
  methods: {
      addColor() {
        let mycolor = this.colors.pop();
        this.palette.push(mycolor);
        this.colors.unshift(mycolor);
      },
      deleteColor(index) {
        if (this.palette.length > 1) {
          this.palette.splice(index,1);
        }
      }
  }
}
</script>

<style lang="less">
  .palette{
    display: flex;
    background: #D6E055;
    height: 200px;
    max-width: 900px;
    li{
      flex: 1;
      .color-options{
        min-height: 0;
        width: auto;
        margin: 0 10px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.7);
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        overflow: hidden;
        a{
          cursor: pointer;
          color: #fff;
          &:hover{
            text-decoration: none;
          }
          &::before{
            display: inline-block;
            text-align: center;
            height: 1.3em;
            width: 1.3em;
            margin-right: .3em;
            font-size: 16px;
            line-height: 1.3;
            background: #fff;
            border-radius: 50%;
          }
          &::after{
            content: ' color';
          }
        }
        .add{
          float: left;
          &::before{
            content: '✚';
            color: #590;
          }
        }
        .delete{
          float: right;
          &::before{
            content: '✖';
            color: #b00;
          }
        }
      }
      //只有一个元素时不显示删除
      //delete hide when only 1 item contain!
      &:only-child .delete{
        display: none;
      }
      &:first-child:nth-last-child(n+4) .color-options a::after,
      &:first-child:nth-last-child(n+4) ~ li .color-options a::after{
        content: none;
      }
      &:first-child:nth-last-child(n+6) .color-options a,
      &:first-child:nth-last-child(n+6) ~ li .color-options a{
        font-size:0;
        color: transparent;
      }
    }
  }
</style>
