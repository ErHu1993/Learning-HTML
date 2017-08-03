<template>
  <div id="app">
  <!-- 组件引入加传参  msgfromfather向子组件传参 -->
   <Hello msgfromfather='Hello son!' v-on:clild-tell-me-something='listeToMyBoy'></Hello>
   <h1> clild tells me :{{childWorlds}}</h1>
   <h1>{{title}}</h1>
   <h2 v-text="title"></h2>
   <h3 v-html="htlmTitle"></h3>
   <input v-model="newItem" v-on:keyup.enter="addNew()">

   <ul>
      <li v-for="item in items"  v-bind:class="{finished:item.isFinish}"  v-on:click="toggleFinish(item)">
        {{item.label}}
      </li>
   </ul>
  </div>
</template>

<script>

import Store from './Store'
import Hello from './components/Hello'

export default {
  name: 'app',
  data (){
    return {
      title:'this is a todu lisddddt',
      htlmTitle:'<h1>H1标签</h1>',
      items: Store.fetch() ? Store.fetch() : [],
      newItem:'',
      childWorlds:''
    }
  },
  watch:{
    items :{
      handler: function (items){
          Store.save(items);
      },
      deep:true
    }
  },
  methods: {
      toggleFinish: function (item) {
        item.isFinish = !item.isFinish;
       },
       addNew: function () {
        this.items.push({
          label:this.newItem,
          isFinish:false
        })
        this.newItem='';
        Store.save();
      },
      listeToMyBoy: function (msg) {
        this.childWorlds = msg;
      } 
  },
  components :{
    //添加组件Hello
    //1.import导入  2.components声明
    Hello
  }
}
</script>

<style>

.finished{
  text-decoration: underline;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
