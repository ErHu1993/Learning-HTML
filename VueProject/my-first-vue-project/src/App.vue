<template>
  <div id="app">
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

export default {
  name: 'app',
  data (){
    return {
      title:'this is a todu lisddddt',
      htlmTitle:'<h1>H1标签</h1>',
      items: Store.fetch(),
      newItem:''
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
      }
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
