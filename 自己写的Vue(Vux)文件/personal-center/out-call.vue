<style lang="scss" scoped>
    .container {
        background-color: #fff;

        .list {
            // border-top: 10px solid #fbf9fe;
        }

        .out-call-cell {
          padding: 10px 0px 0px 0px;
          margin: 0 10px;
        }

        .item {
          height: 100%;
          border-radius: 10px;
          -moz-box-shadow:0px 0px 8px #535353;
          -webkit-box-shadow:0px 0px 8px #535353;
          box-shadow:0px 0px 8px #535353;
          background-color: #fff;
        }

        label {
          display: inline-block;
          overflow: hidden;
        }

        .label-left {
          width: 60px;
          margin-top: 10px;
          margin-left: 10px;
        }

        .label-left-content {
          width: calc(50% - 60px);
          word-break: break-all;
          text-overflow:ellipsis;
          white-space: nowrap;
        }

        .more{
          margin-top: 10px;
          overflow: hidden;
        }

        .more-left {
          width: 80px;
          float: left;
          margin-left: 10px;
          height: 100%;
        }

        .more-content{
          float: left;
          width: calc(100% - 100px);
        }

        .handel{
          margin: 10px 0;
          text-align: center;
        }
    }
</style>

<template>
    <section class="container">
        <scroller  class="list" lock-x scrollbar-y :style="{height: listHeight + 'px'}"  @on-pulldown-loading="onPulldown" ref="scrollerBottom" use-pulldown :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}"  v-model="status">
            <div class="box2">
                <div v-if="outCallData.length > 0">
                    <div class="out-call-cell" v-for="(item ,index) in outCallData">
                        <div class="item">
                            <label class="label-left">车主：</label>
                            <label class="label-left-content">{{item.jobDetail.owner}}</label>
                            <label class="label-right">车牌：</label>
                            <label class="label-right-content">{{item.jobDetail.plateNo}}</label>
                            <label class="label-left">交强险：</label>
                            <label class="label-left-content">{{item.jobDetail.ctaliPremiumAmount | filterAmount}}</label>
                            <label class="label-right">车船税：</label>
                            <label class="label-right-content">{{item.jobDetail.taxPremiumAmount | filterAmount}}</label>
                            <br>
                            <label class="label-left">商业险：</label>
                            <label class="label-left-content">{{item.jobDetail.ctliPremiumAmount | filterAmount}}</label>
                            <div class="more">
                              <label class="more-left">投保方案：</label>
                              <label class="more-content">{{item.jobDetail.ctliProfileDesc | filterPlan}}</label>
                            </div>
                            <div class="more">
                              <label class="more-left">优惠措施：</label>
                              <label class="more-content">{{item.jobDetail.discountDesc | filterPlan}}</label>
                            </div>
                            <div class="handel" v-model='item.secretNo'>
                              <x-button
                              type='primary'
                              mini
                              @click.native='handleResultClick(item)'
                              v-show='item.secretNo'>选择处理结果</x-button>
                              <x-button type='primary' mini @click.native='outCallHandle(item,index)'>外呼</x-button>
                              <x-button type='primary' mini @click.native='takePrice(item)'>报价</x-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="no_data_pd" v-if="noData">
                    <div class="no_data">
                        <i></i>
                        <p>暂时还没有任务, 请稍后再来~</p>
                    </div>
                </div>
            </div>
        </scroller>
        <actionsheet v-model="showHandleResult" :menus="handleResultTitle" @on-click-menu="handelResultClick"></actionsheet>
    </section>
</template>

<script>
import $ from 'zepto'
import { formatDate } from '@/libs/format.js'
import { Scroller, XButton, Actionsheet } from 'vux'
export default {
  data () {
    return {
      onFetching: false,
      showHandleResult: false,
      handelResultData: [],
      handleResultTitle: [],
      handldId: '',
      listHeight: 0,
      status: {
        pullupStatus: 'default'
      },
      outCallData: [],
      pageNumber: 0,
      pageCount: 1,
      pageSize: 20,
      dealType: 'recharge',
      noData: false
    }
  },
  components: {
    Scroller, XButton, Actionsheet
  },
  computed: {

  },
  filters: {
        // 时间格式化
    formatData (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    filterAmount (amount) {
      if (amount > 0) return amount
      return '--'
    },
    filterPlan (plan) {
      if (plan) return plan
      return '（空）'
    }
  },
  created () {
    this.listHeight = $(window).height()
    this.getHandelResultData()
  },
  mounted () {
    this.$nextTick(() => {
      this.getOutCallList()
    })
  },
  updated () {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.donePulldown()
      this.$refs.scrollerBottom.reset()

      $('.weui-loadmore__tips').parent().css('margin-top', 0) // top初始，避免再次计算
      const boxH = $('.box2').height()
      const listH = $('.box2').closest('.list').height()
      if (boxH <= listH) {
        $('.weui-loadmore__tips')
        .text('已显示全部')
        .prev().hide()
        .parent().css('margin-top', listH - boxH)
      }
    })
  },
  methods: {
    // 获取收支数据
    getOutCallList () {
      this.initData()
      this.$http.get(this.host_bdd + '/ElectricitySales/v1/job/list')
      .then((rt) => {
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        this.outCallData = rt.data.jobs
        this.noData = this.outCallData.length === 0
      })
    },
    // 下拉刷新
    onPulldown () {
      this.getOutCallList()
    },
    // 初始化
    initData () {
      this.outCallData = []
      this.onFetching = true
      $('.weui-loadmore__tips').text('loading').prev().show()
    },
    getHandelResultData () {
      var _this = this
      this.$http.get(this.host_bdd + '/common/v1/code/electricitySales/result')
      .then((rt) => {
        if (rt.data.code !== 200) {
          _this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        _this.handelResultData = rt.data.electricitySalesResults
        if (_this.handelResultData) {
          for (var i = 0; i < _this.handelResultData.length; i++) {
            var item = _this.handelResultData[i]
            _this.handleResultTitle.push({
              label: item.result,
              code: item.code,
              sales: item.sales
            })
          }
        }
      })
    },
    handelResultClick (key, item) {
      var _this = this
      this.$vux.loading.show({
        text: '正在上传请求'
      })
      this.$post(_this.host_bdd + '/ElectricitySales/v1/job/determine', {
        id: _this.handldId,
        result: item.code
      }, function (rt) {
        _this.$vux.loading.hide()
        if (rt.data.code !== 200) {
          _this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        _this.getOutCallList()
      })
    },
    outCallHandle (item, index) {
      if (item.secretNo) {
        window.location.href = 'tel:' + item.secretNo
      } else {
        var _this = this
        this.$vux.loading.show({
          text: '正在请求'
        })
        this.$post(_this.host_bdd + '/ElectricitySales/v1/job/secretNo', {
          id: item.id
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          item.secretNo = rt.data.secretNo
          _this.outCallData.splice(index, 1, item)
          if (item.secretNo) {
            window.location.href = 'tel:' + item.secretNo
          } else {
            _this.$vux.toast.text('获取号码错误', 'top')
          }
        })
      }
    },
    takePrice (item) {
      this.$router.push({
        path: '/out-call-price',
        query: {
          ElectricitySalesJob: item,
          handleResultTitle: this.handleResultTitle
        }
      })
    },
    handleResultClick (item) {
      this.showHandleResult = true
      this.handldId = item.id
    }
  }
}
</script>
