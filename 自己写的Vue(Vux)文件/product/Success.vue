<style lang="scss" scoped>
    body {
        background-color: #fff;
    }
    .container {
        margin: 10px;
    }
</style>

<template>
    <section class="container">
        <msg title="支付已提交，待确认付款" :description="description" icon="success"></msg>
        <p class="text_center cr_gray" style="margin: 0 0 20px;">确认付款后可在订单列表中查看订单状态</p>
        <div class="button">
            <x-button type="primary" @click.native="linkOrder">完成</x-button>
        </div>
    </section>
</template>

<script>
import { Msg, XButton } from 'vux'
export default {
  data () {
    return {
      orderId: '',
      premiumAmount: '',
      description: ''
    }
  },
  components: {
    Msg, XButton
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.url = from.path

      if (
                from.path === '/order/detail'
            ) {
        window.location.href = window.location.href.split('#')[0] + '#/order'
      }
    })
  },
  created () {
    this.orderId = this.$route.query.orderId
    this.premiumAmount = this.$route.query.premiumAmount
    this.description = '支付金额<span style="color:#ff9800">￥' + this.premiumAmount + '</span>'
  },
  methods: {
    linkOrder () {
      this.$router.push({
        path: '/order/detail',
        query: {
          orderId: this.orderId
        }
      })
    }
  }
}
</script>
