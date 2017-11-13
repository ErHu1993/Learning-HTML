<style lang="scss" scoped>
    body {
        background-color: #fff;
    }
    .container {
        margin: 10px;

        .table {
            padding: 10px 15px;
            margin: 0 0 20px;
            line-height: 26px;
            background-color: #f2f2f2;

            tr:first-child td {
                border-bottom: 1px solid #d9d9d9;
            }
        }
    }
</style>

<template>
    <section class="container">
        <msg title="提现申请已提交" description="次日24点前到账" icon="success"></msg>
        <div class="table">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td width="50%">提现帐号</td>
                    <td width="50%" class="text_right">{{nickname}}</td>
                </tr>
                <tr>
                    <td>提现金额</td>
                    <td class="text_right">￥{{amount}}</td>
                </tr>
            </table>
        </div>
        <div class="button">
            <x-button type="primary" link="/account">完成</x-button>
        </div>
    </section>
</template>

<script>
import { Msg, Divider, XButton } from 'vux'
export default {
  data () {
    return {
      nickname: '',
      amount: ''
    }
  },
  components: {
    Msg, Divider, XButton
  },
  created () {
    var _this = this

    _this.nickname = this.$route.query.nickname
    _this.amount = this.fmoney(this.$route.query.amount, 2)
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
