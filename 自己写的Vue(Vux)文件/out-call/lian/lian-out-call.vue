<style lang="scss" scoped>
    .container {
        background-color: #fff;

        .out-call-cell {
          padding: 10px 0px 10px 0px;
          margin: 0 10px;
        }

    }
</style>

<template>
    <section class="container">
        <scroller  class="list" lock-x scrollbar-y :style="{height: listHeight + 'px'}"  @on-pulldown-loading="onPulldown" ref="scrollerBottom" use-pulldown :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}"  v-model="status">
            <div class="box2">
                <div v-if="!noData">
                    <div class="out-call-cell" v-for="(item ,index) in outCallData">
                      <outCallCell
                        :dataItem='item'
                        :category='0'
                        v-on:handleResultClick='handleResultClick'
                        :itemIndex='index'>
                      </outCallCell>
                    </div>
                </div>
                <div class="no_data_pd" v-else>
                    <div class="no_data">
                        <i></i>
                        <p>暂时还没有任务, 请稍后再来~</p>
                    </div>
                </div>
            </div>
        </scroller>
        <callresultsheet
          :category='category'
          :produceId='produceId'
          :vendorId='vendorId'
          :showHandleResult='showHandleResult'
          v-on:showHandleResultChange='showHandleResultChange'
          v-on:completeHandle='completeHandle'
          :dataItem='dataItem'>
        </callresultsheet>
    </section>
</template>

<script>
import $ from 'zepto'
import callresultsheet from '@/views/out-call/call-result-handel.vue'
import outCallCell from '@/views/out-call/lian/lian-out-call-cell.vue'
import { Scroller, XButton } from 'vux'
export default {
  data () {
    return {
      category: 2, // 0:保骉车险外呼 1:保骉车险回访 2:畅想人生外呼 3:畅想人生回访
      produceId: '',
      vendorId: '',
      onFetching: false,
      showHandleResult: false,
      handelResultData: [],
      handleResultTitle: [],
      dataItem: Object,
      listHeight: 0,
      status: {
        pullupStatus: 'default'
      },
      outCallData: [],
      noData: false
    }
  },
  components: {
    Scroller, XButton, callresultsheet, outCallCell
  },
  filters: {
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
    this.produceId = this.$route.query.produceId
    this.vendorId = this.$route.query.vendorId
    this.getOutCallList()
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
      this.$http.get(this.host_bdd + '/electricitySales/v1/job/list?produceId=' +
      this.produceId + '&vendorId=' + this.vendorId)
      .then((rt) => {
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        for (var i = 0; i < rt.data.jobs.length; i++) {
          if (!rt.data.jobs[i].jobDetail.discountDesc) {
            rt.data.jobs[i].jobDetail.discountDesc = ''
          }
        }
        this.outCallData = rt.data.jobs
        this.noData = !this.outCallData || this.outCallData.length === 0
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
    outCallHandle (item, index) {
      if (item.secretNo) {
        window.location.href = 'tel:' + item.secretNo
      } else {
        var _this = this
        this.$vux.loading.show({
          text: '正在请求'
        })
        this.$post(_this.host_bdd + '/electricitySales/v1/job/secretNo', {
          id: item.id
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          item.secretNo = rt.data.secretNo
          _this.outCallData.splice(index, 1, item) // 假装更改数组数据 强制更新dom
          if (item.secretNo) {
            window.location.href = 'tel:' + item.secretNo
          } else {
            _this.$vux.toast.text('获取号码错误', 'top')
          }
        })
      }
    },
    showHandleResultChange (value) {
      this.showHandleResult = value
    },
    handleResultClick (index) {
      this.showHandleResult = true
      this.dataItem = this.outCallData[index]
    },
    completeHandle (id, notRemove) {
      if (notRemove) return
      for (var i = 0; i < this.outCallData.length; i++) {
        if (this.outCallData[i].id === id) {
          this.outCallData.splice(i, 1)
          if (!this.outCallData.length) {
            this.getOutCallList()
          }
          return
        }
      }
    }
  }
}
</script>
