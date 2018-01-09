<style scoped>
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  .main {
    margin-top: 0;
  }

  .a-tel {
    color: #008000
  }

  label {
    display: inline-block;
    overflow: hidden;
  }

  .label-left {
    width: 60px;
    margin-top: 10px;
    margin-left: 15px;
  }

  .label-left-content {
    width: calc(50% - 65px);
    word-break: break-all;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .more{
    margin-top: 10px;
    overflow: hidden;
  }

  .more-left {
    width: 100px;
    float: left;
    margin-left: 15px;
    height: 100%;
  }

  .more-content{
    float: left;
    width: calc(100% - 125px);
  }

  .more-input{
    margin-left: 5px;
    height: 30px;
  }

  .handel{
    margin: 10px 0;
    text-align: center;
  }

  .iframe-wrap {
    height: 100%;
  }

  .hidden-btn{
    position: fixed;
    height: 24px;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
  }

  .hidden-btn img{
    background: url('../../assets/out-call-show-down.png') no-repeat;
    background-size:  auto 100%;
    height: 100%;
    margin: 0px auto;
  }

  .footer {
    background-color: #fff;
    border-top: 1px solid #1f72d9;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .weui-cell {
    padding: 12px 15px;
  }
</style>

<template>
  <div class="main">
    <div class="iframe-wrap JS_iframe">
      <iframe v-if='isiOS' class="iframe" :src='iframeSrc' frameborder="0" width="100%" height="100%" marginheight="0" marginwidth="0" scrolling="no"></iframe>
      <iframe v-else class="iframe" :src='iframeSrc' frameborder="0" width="100%" height="100%" marginheight="0" marginwidth="0"></iframe>
    </div>
    <div class="hidden-btn" @click='hiddenButtonClick' onClick>
      <img :src="backgroundImage">
    </div>
    <div class="footer" v-show='showFooter'>
      <div class="item">
          <label class="label-left">车主：</label>
          <label class="label-left-content">{{ElectricitySalesJob.jobDetail.owner}}</label>
          <label class="label-right">车牌：</label>
          <label class="label-right-content">{{ElectricitySalesJob.jobDetail.plateNo}}</label>
          <group gutter='0'>
              <x-input
                title="交强险金额："
                placeholder='请输入'
                keyboard="number"
              v-model='ElectricitySalesJob.jobDetail.ctaliPremiumAmount'>
              </x-input>
              <x-input
                title="车船税金额："
                placeholder='请输入'
                keyboard="number"
                v-model='ElectricitySalesJob.jobDetail.taxPremiumAmount'>
              </x-input>
              <x-input
                title="投保方案："
                placeholder='请输入'
                v-model='ElectricitySalesJob.jobDetail.ctliProfileDesc'>
              </x-input>
              <x-input
                title="商业险金额："
                placeholder='请输入'
                keyboard="number"
                v-model='ElectricitySalesJob.jobDetail.ctliPremiumAmount'>
                  <x-button slot="right" type='primary' mini @click.native='getIncentives()'>获取优惠措施</x-button>
              </x-input>
          </group>
          <div class="more">
            <label class="more-left">优惠措施：</label>
            <label class="more-content">{{discountDesc | filterPlan}}</label>
          </div>
          <div class="handel">
            <x-button type='primary' mini @click.native='showHandleResult = true'>选择处理结果</x-button>
            <x-button type='primary' mini @click.native='outCallHandle'>外呼</x-button>
          </div>
      </div>
    </div>
    <callresultsheet
      :category='category'
      :produceId='produceId'
      :vendorId='vendorId'
      :showHandleResult='showHandleResult'
      v-on:showHandleResultChange='showHandleResultChange'
      v-on:completeHandle='completeHandle'
      :dataItem='ElectricitySalesJob'>
    </callresultsheet>
  </div>
</template>

<script>
import $ from 'zepto'
import callresultsheet from '@/views/out-call/call-result-handel.vue'
import { Group, Cell, XButton, Actionsheet, XInput } from 'vux'

export default {
  data () {
    return {
      showHandleResult: false,
      isiOS: true,
      category: 0, // 0:保骉车险外呼 1:保骉车险回访 2:畅想人生外呼 3:畅想人生回访
      produceId: '',
      vendorId: '',
      handleResultData: [],
      iframeSrc: '',
      showFooter: 'true',
      footerHeight: '',
      discountDesc: '',
      backgroundImage: require('../../assets/out-call-show-down.png'),
      ElectricitySalesJob: {
        jobDetail: {
          owner: '',
          plateNo: '',
          inquiryUrl: ''
        },
        id: ''
      }
    }
  },
  components: {
    Group, Cell, XButton, Actionsheet, XInput, callresultsheet
  },
  mounted () {
    this.$nextTick(() => {
      $('.iframe').width($(window).width())
      $('.JS_iframe').width($(window).width())
      this.footerHeight = $('.footer').height()
      $('.hidden-btn').css('bottom', this.footerHeight)
      $('.iframe-wrap').css('margin-bottom', this.footerHeight + 24 + 'px')
    })
  },
  beforeCreate () {

  },
  created () {
    this.isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    this.produceId = this.$route.query.produceId
    this.vendorId = this.$route.query.vendorId
    this.$nextTick(() => {
      if (this.$route.query.ElectricitySalesJob) {
        this.ElectricitySalesJob = JSON.parse(this.$route.query.ElectricitySalesJob)
        this.discountDesc = this.ElectricitySalesJob.jobDetail.discountDesc
        if (this.ElectricitySalesJob.jobDetail.inquiryUrl) {
          this.iframeSrc = this.ElectricitySalesJob.jobDetail.inquiryUrl
        } else {
          var _this = this
          this.$vux.loading.show({
            text: '正在请求数据'
          })
          this.$post(_this.host_bdd + '/electricitySales/v1/job/inquiryUrl/zhongan', {
            id: _this.ElectricitySalesJob.id
          }, function (rt) {
            _this.$vux.loading.hide()
            if (rt.data.code !== 200) {
              _this.$vux.toast.text(rt.data.error, 'top')
              return
            }
            _this.iframeSrc = rt.data.inquiryUrl
            _this.ElectricitySalesJob.jobDetail.inquiryUrl = rt.data.inquiryUrl
          })
        }
      } else {
        this.$router.go(-1)
      }
    })
  },
  methods: {
    getIncentives () {
      var ctaliPremiumAmount = Number(this.ElectricitySalesJob.jobDetail.ctaliPremiumAmount)
      var taxPremiumAmount = Number(this.ElectricitySalesJob.jobDetail.taxPremiumAmount)
      var ctliPremiumAmount = Number(this.ElectricitySalesJob.jobDetail.ctliPremiumAmount)
      var ctliProfileDesc = this.ElectricitySalesJob.jobDetail.ctliProfileDesc
      if (ctaliPremiumAmount > 0) {
        if (taxPremiumAmount > 0) {
          if (ctliProfileDesc) {
            if (ctliPremiumAmount > 0) {
              var _this = this
              this.$vux.loading.show({
                text: '正在获取'
              })
              this.$post(_this.host_bdd + '/electricitySales/v1/job/discountDesc', {
                id: _this.ElectricitySalesJob.id,
                ctaliPremiumAmount: Math.round(ctaliPremiumAmount * 100),
                taxPremiumAmount: Math.round(taxPremiumAmount * 100),
                ctliPremiumAmount: Math.round(ctliPremiumAmount * 100),
                ctliProfileDesc: ctliProfileDesc
              }, function (rt) {
                _this.$vux.loading.hide()
                if (rt.data.code !== 200) {
                  _this.$vux.toast.text(rt.data.error, 'top')
                  return
                }
                _this.discountDesc = rt.data.discountDesc
              })
            } else {
              this.$vux.toast.text('请输入正确商业险金额', 'top')
            }
          } else {
            this.$vux.toast.text('请输入投保方案', 'top')
          }
        } else {
          this.$vux.toast.text('请输入正确的车船税金额', 'top')
        }
      } else {
        this.$vux.toast.text('请输入正确的交强险金额', 'top')
      }
    },
    outCallHandle () {
      if (this.ElectricitySalesJob.secretNo) {
        window.location.href = 'tel:' + this.ElectricitySalesJob.secretNo
      } else {
        var _this = this
        this.$vux.loading.show({
          text: '正在请求'
        })
        this.$post(_this.host_bdd + '/electricitySales/v1/job/secretNo', {
          id: _this.ElectricitySalesJob.id
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          _this.ElectricitySalesJob.secretNo = rt.data.secretNo
          if (_this.ElectricitySalesJob.secretNo) {
            window.location.href = 'tel:' + _this.ElectricitySalesJob.secretNo
          } else {
            _this.$vux.toast.text('获取号码错误', 'top')
          }
        })
      }
    },
    hiddenButtonClick () {
      this.showFooter = !this.showFooter
      if (this.showFooter) {
        $('.footer').height(this.footerHeight)
        $('.hidden-btn').css('bottom', this.footerHeight)
        $('.iframe-wrap').css('margin-bottom', this.footerHeight + 24 + 'px')
        $('.iframe-wrap').css('height', '100%')
        this.backgroundImage = require('../../assets/out-call-show-down.png')
      } else {
        $('.hidden-btn').css('bottom', 0)
        $('.footer').height(0)
        $('.iframe-wrap').css('margin-bottom', '0')
        $('.iframe-wrap').css('height', '100%')
        this.backgroundImage = require('../../assets/out-call-show-up.png')
      }
    },
    showHandleResultChange (value) {
      this.showHandleResult = value
    },
    completeHandle (id, notRemove) {
      this.$router.go(-1)
    }
  },
  filters: {
    filterPlan (plan) {
      if (plan) return plan
      return '（空）'
    }
  }
}
</script>
