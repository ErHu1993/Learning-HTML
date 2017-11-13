<style lang="scss" scoped>
    .container {
        margin: 10px 10px 0;
        background-color: #fff;

        .cell {
            padding: 10px 15px;
            position: relative;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
        }

        .line {
            top: 40px;
            position: absolute;
            right: 15px;
            left: 15px;
            height: 1px;
            color: #d9d9d9;
            background-color: #d9d9d9;
        }

        .first {
            background-color: #F8F8F9;
        }

        .value {
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            flex: 1;
        }

        input {
            line-height: 24px;
            font-size: 14px;
            border: 0 none;
            outline: 0 none;
        }

        .blue {
            display: inline-block;
            line-height: 22px;
            color: #305BDA;
        }

        .bottom {
            padding: 0 15px;
        }

        .bottom p {
            padding: 10px 0;
        }

        .kefu {
            position: absolute;
            bottom: 0;
            width: 100%;
            line-height: 1.067rem;
        }

        .value label {
            position: absolute;
            top: 3px;
            left: 15px;
            line-height: 30px;
        }
    }

    .apply-money label {
        font-size: 24px;
    }
    .apply-money input {
        font-size: 30px;
    }

    .dialog-box {
        width: 80%;
        margin: 0 auto;
        padding: 10px;
        text-align: left;
        background-color: #fff;
        border-radius: 4px;
        height: 400px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .dialog-box h3{
        text-align: center;
    }

    .dialog-box p{
        padding: 5px 5px;
    }

    .dialog-close {
        padding: 10px 0 0;
        text-align: center;
        color: #fff;
    }

    .first div{
        display: inline-block;
        padding-bottom: 10px;
    }

    .first label{
        margin-left: 15px;
        display: block;
        line-height: 1.6;
    }

    .first-left :last-child {
        color: transparent;
        font-size: 12px;
    }

    .first-right :last-child {
        font-size: 12px;
    }

</style>

<template>
    <section class="container">
        <div class="intbody">
            <div class="first">
                <div class="first-left">
                    <label>提现至</label>
                    <label v-show='showPremiumRate'>提示:</label>
                </div>
                <div class="first-right">
                    <label style='color:#305BDA'>微信钱包</label>
                    <label class='cr_gray' v-show='showPremiumRate'>提现手续费0.1%</label>
                </div>
            </div>
            <div class="cell">
                <div class="label">
                    <label>提现金额</label>
                </div>
            </div>
            <div class="cell" style="padding:0">
                <div class="value apply-money">
                    <label>￥</label>
                    <input type="text" autocomplete="off" name="money" style="width:100%;padding-left:45px;line-height:30px;" />
                </div>
                <div class="line"></div>
            </div>
            <div class="cell">
                <div class="label"><label class="fs12 cr_gray" >{{applyContent}}</label></div>
                <div class="value text_right"><span class="blue js_all" @click="seeAll">全部提现</span></div>
            </div>
        </div>
        <div class="bottom">
            <x-button type="primary" :disabled="disabled" @click.native="setMoney">提现</x-button>
            <p class="text_center cr_gray fs12">1-3个工作日内到账</p>
        </div>
        <div class="text_center kefu">
            <p>
                <a href="javascript:;" @click="showHideRule=true">提现规则</a>
            </p>
            <p>客服电话 <a class="a-tel" href="tel:0551-62809739">0551-62809739</a></p>
        </div>
        <div v-transfer-dom>
            <x-dialog v-model="showHideRule" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', 'background-color': 'transparent'}">
                <div class="clearfix dialog-box">
                    <h3>关于提现的规则说明</h3>
                    <p>1、有犹豫期的产品在犹豫期（签收合同次日起10天之内）结束后的第一个工作日可提现，无犹豫期的产品在出单后的第一个工作日可提现；</p>
                    <p>2、每个自然月可免费提现3次，超过3次以后，每次提现将收取提现金额的0.1%为手续费，单笔手续费小于0.01元的，按照0.01收取；</p>
                    <p>3、每次提现限定提现金额不得小于0.1元；</p>
                    <p>4、手续费的计算精确到小数点后两位。例：提现188元，则收取手续费0.19元；</p>
                    <p>5、提现手续费将从可用余额中额外扣除；</p>
                    <p>6、当余额不足以支付提现手续费时，将从提现金额里直接扣除；</p>
                    <p>7、申请提现后，工作人员在1-3个工作日完成审核并打款；</p>
                    <p>8、若保单发生退保，将扣除已退保部分的佣金费用。</p>
                </div>
                <div class="dialog-close" @click="showHideRule = false">
                    <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
                </div>
            </x-dialog>
        </div>
        <div v-transfer-dom>
              <confirm v-model="showConfirm"
              title="是否要全部提现"
              @on-confirm="onConfirm">
                <p style="text-align:center;">{{ confirmTitle }}</p>
              </confirm>
        </div>
    </section>
</template>

<script>
import $ from 'zepto'
import { Group, Cell, XInput, XButton, XDialog, Confirm, TransferDomDirective as TransferDom } from 'vux'
export default {
  data () {
    return {
      money: '',
      allMoney: '',
      commission: '',
      confirmTitle: '',
      applyContent: '',
      userInfo: '',
      showConfirm: false,
      showPremiumRate: this.$route.query.outcomeCount >= 3,
      showHideRule: false,
      disabled: true
    }
  },
  components: {
    Group, Cell, XInput, XButton, XDialog, Confirm
  },
  directives: {
    TransferDom
  },
  created () {
    var _this = this

    this.allMoney = this.$route.query.amount
    this.applyContent = '可提现余额 ' + this.allMoney + ' 元'

    this.$http.get(this.host + '/bdd-home/web/auth/wxUserInfo', {
      withCredentials: true
    }).then((rt) => {
      if (rt.data.status !== 200) {
        _this.$vux.toast.text(rt.data.message, 'top')
        return
      }
      _this.userInfo = rt.data.message
    })

    this.$nextTick(() => {
      this.minHeight()

      $(window).on('resize', () => {
        this.minHeight()
      })
    })

    $(document).off('input propertychange').on('input propertychange', '[name="money"]', function () {
      let val = $.trim($(this).val())
      let number = val.replace(/[^0-9.]/g, '') // 0-9.
      let money = number.replace('..', '.') // 同时出现2个.过滤
      let float = money.split('.')

      _this.disabled = !val
      $(this).val(money)

            // 只能有一个.分割
      if (float.length > 2) {
        $(this).val(float[0] + '.' + float[1])
        return
      }

            // 小数点只保留2位
      if (float[1] && float[1].length > 2) {
        $(this).val(float[0] + '.' + float[1].substr(0, 2))
        return
      }

      if (_this.showPremiumRate && val > 0) {
        var serviceCharge = parseFloat((parseFloat(val) * 0.001).toFixed(2))
        if (serviceCharge < 0.01) {
          serviceCharge = 0.01
        }
        _this.applyContent = '额外扣除￥' + serviceCharge + '手续费'
        return
      }
      _this.applyContent = '可提现余额 ' + _this.allMoney + ' 元'
    })
  },
  methods: {
    setMoney () {
      this.money = +$('[name="money"]').val()

      if (this.money === 0) return

      if (this.money > +this.allMoney) {
        this.$vux.toast.text('提现金额超出可用余额', 'top')
        return
      }

      if (parseFloat(this.money) < 0.1) {
        this.$vux.toast.text('每笔提现金额最小为 0.1 元', 'top')
        return
      }

            // 提现金额
      var floatMoney = parseFloat(this.money)
            // 总金额
      var floatAllmoney = parseFloat(this.allMoney)
            // 手续费
      this.commission = 0.00
            // 是否需要扣除手续费
      if (this.showPremiumRate) {
                // 因为最低手续费为0.01，所以需要保留小数点后2位，且小数点后第三位四舍五入
        this.commission = parseFloat((floatMoney * 0.001).toFixed(2))
                // 如果手续费小于0.01，则按0.01收取
        if (this.commission < 0.01) {
          this.commission = 0.01
        }
                // js中 29.01 + 0.03 = 29.040000000000003 所以这里还要toFixed一下变成29.040 减法也是一样
        if (parseFloat((floatMoney + this.commission).toFixed(2)) > floatAllmoney) {
          this.confirmTitle = '剩余零钱不足以支付提现手续费 ¥ ' + this.commission +
                    '最大可提现金额为 ¥ ' + ((floatMoney - this.commission).toFixed(2))
          this.showConfirm = true
          return
        }
      }
      this.apply()
    },
    apply () {
      this.$vux.loading.show({
        text: '正在申请提现'
      })
      this.$post(this.host_bdd + '/captial/v1/outcome/apply', {
        amount: Math.round(this.money * 100),
        userInfo: this.userInfo,
        outcomeCount: (this.$route.query.outcomeCount + 1),
        serviceCharge: Math.round(this.commission * 100)
      }, (rt) => {
        this.$vux.loading.hide()
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        this.$route.query.outcomeCount += 1
        this.showPremiumRate = this.$route.query.outcomeCount >= 3

        let info = JSON.parse(this.userInfo)
        this.$router.replace({
          path: '/account/success',
          query: {
            nickname: info.nickname,
            amount: this.money
          }
        })
      })
    },
    seeAll () {
      $('[name="money"]').val(this.allMoney)
      this.disabled = false
    },
    onConfirm (msg) {
      this.money = ((parseFloat(this.money) - this.commission).toFixed(2))
      this.apply()
    },
    minHeight () {
      let ih = $('.intbody').height()
      let bh = $('.bottom').height()
      let kh = $('.kefu').height()

      $('.container').css('minHeight', ih + bh + kh)
    }
  }
}
</script>
