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
        <msg title="订单支付失败" :description="description" icon="warn"></msg>
        <div class="button">
            <x-button type="primary" link="/order">完成</x-button>
        </div>
    </section>
</template>

<script>
import { Msg, Divider, XButton } from 'vux'
export default {
  data () {
    return {
      description: '支付金额$600.00'
    }
  },
  components: {
    Msg, Divider, XButton
  },
  methods: {
    fmoney (s, n) {
      n = n > 0 && n <= 20 ? n : 2
      s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
      var l = s.split('.')[0].split('').reverse()
      var r = s.split('.')[1]
      var t = ''
      for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
      }
      return t.split('').reverse().join('') + '.' + r
    }
  }
}
</script>
