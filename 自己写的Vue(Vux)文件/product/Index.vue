<style lang="scss" scoped>
    .container {
        background: #fff;

        .item {
            height: 1.333rem;
            line-height: 1.333rem;
            text-align: center;
        }
    }
</style>

<template>
    <div class="container">
        <div class="item" v-for="item in product">
            <router-link :to="item.url">{{item.name}}</router-link>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      product: [
        {
          name: '保骉车险',
          url: ''
        },
        {
          name: '国寿财险',
          url: 'V002'
        }
      ]
    }
  }
}
</script>
