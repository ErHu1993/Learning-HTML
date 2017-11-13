<style scoped>

  .main {
    margin-top: 0;
  }

  .a-tel {
    color: #008000
  }

  .footer {
    background-color: #fff;
    border-top: 1px solid #1f72d9;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
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

  .hidden-btn{
    background: url('../../assets/out-call-show-down.png') no-repeat;
    background-size:  100% auto;
    margin: 0px auto;
    position: fixed;
    height: 20px;
    width: 42px;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>

<template>
  <div class="main">
    <div class="iframe-wrap JS_iframe">
      <iframe class="iframe" :src='iframeSrc' frameborder="0" width="100%" height="100%" marginheight="0" marginwidth="0" scrolling="no"></iframe>
    </div>
    <img :src="backgroundImage" class="hidden-btn" @click='hiddenButtonClick'>
    <div class="footer" v-show='showFooter'>
      <div class="item">
          <label class="label-left">车主：</label>
          <label class="label-left-content">{{ElectricitySalesJob.jobDetail.owner}}</label>
          <label class="label-right">车牌：</label>
          <label class="label-right-content">{{ElectricitySalesJob.jobDetail.plateNo}}</label>
          <group gutter='0'>
              <x-input title="商业险金额：" placeholder='请输入' name="mobile" keyboard="number" v-model='inputNumber'>
                  <x-button slot="right" type='primary' mini @click.native='getIncentives()'>获取优惠措施</x-button>
              </x-input>
          </group>
          <div class="more">
            <label class="more-left">优惠措施：</label>
            <label class="more-content">{{discountDesc | filterPlan}}</label>
          </div>
          <div class="label-right" style="text-align:center">

          </div>
          <div class="handel">
            <x-button type='primary' mini @click.native='showHandleResult = true'>选择处理结果</x-button>
            <x-button type='primary' mini @click.native='outCallHandle'>外呼</x-button>
          </div>
      </div>
    </div>
    <actionsheet v-model="showHandleResult" :menus="handleResultTitle" @on-click-menu="handelResultClick"></actionsheet>
  </div>
</template>

<script>
import $ from 'zepto'
import { Group, Cell, XButton, Actionsheet, XInput } from 'vux'

export default {
  data () {
    return {
      showHandleResult: false,
      handleResultData: [],
      handleResultTitle: [],
      iframeSrc: '',
      showFooter: 'true',
      footerHeight: '',
      inputNumber: '',
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
    Group, Cell, XButton, Actionsheet, XInput
  },
  mounted () {
    this.$nextTick(() => {
      $('.iframe').width($(window).width())
      $('.JS_iframe').width($(window).width())
      $('.JS_iframe').height($(window).height())
      this.footerHeight = $('.footer').height()
      $('.hidden-btn').css('bottom', this.footerHeight)
    })
  },
  created () {
    this.$nextTick(() => {
      if (this.$route.query.ElectricitySalesJob instanceof Object) {
        this.handleResultTitle = this.$route.query.handleResultTitle
        this.ElectricitySalesJob = this.$route.query.ElectricitySalesJob
        this.discountDesc = this.$route.query.ElectricitySalesJob.jobDetail.discountDesc
        if (this.ElectricitySalesJob.jobDetail.inquiryUrl) {
          this.iframeSrc = this.ElectricitySalesJob.jobDetail.inquiryUrl
        } else {
          var _this = this
          this.$vux.loading.show({
            text: '正在请求数据'
          })
          this.$post(_this.host_bdd + '/ElectricitySales/v1/job/inquiryUrl', {
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
        this.$router.replace({path: '/out-call'})
      }
    })
  },
  methods: {
    handelResultClick (key, item) {
      var _this = this
      this.$vux.loading.show({
        text: '正在上传请求'
      })
      this.$post(_this.host_bdd + '/ElectricitySales/v1/job/determine', {
        id: _this.ElectricitySalesJob.id,
        result: item.code
      }, function (rt) {
        _this.$vux.loading.hide()
        if (rt.data.code !== 200) {
          _this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        _this.$router.replace({path: '/out-call'})
      })
    },
    getIncentives () {
      var number = Number(this.inputNumber)
      if (number > 0) {
        var _this = this
        this.$vux.loading.show({
          text: '正在获取'
        })
        this.$post(_this.host_bdd + '/ElectricitySales/v1/job/discountDesc', {
          ctliPremiumAmount: number * 100,
          id: _this.ElectricitySalesJob.id
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          _this.discountDesc = rt.data.discountDesc
        })
      } else {
        this.$vux.toast.text('请输入正确的商业险金额', 'top')
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
        this.$post(_this.host_bdd + '/ElectricitySales/v1/job/secretNo', {
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
        this.backgroundImage = require('../../assets/out-call-show-down.png')
      } else {
        $('.hidden-btn').css('bottom', 0)
        $('.footer').height(0)
        this.backgroundImage = require('../../assets/out-call-show-up.png')
      }
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
