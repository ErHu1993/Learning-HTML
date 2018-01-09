<style lang="scss" scoped>
    .container {
        background-color: #fff;

        .out-call-cell {
          padding: 10px 0px 10px 0px;
          margin: 0 10px;
        }

    }
    .weui-search-bar {
        position: relative;
        margin:10px 10px;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        box-sizing: border-box;
        background-color: #fbf9fe;
    }

    .weui-search-bar.weui-search-bar_focusing .weui-search-bar__cancel-btn {
        display: block;
    }
    .weui-search-bar.weui-search-bar_focusing .weui-search-bar__label {
        display: none;
    }
    .weui-search-bar__form {
        position: relative;
        -webkit-box-flex: 1;
        -webkit-flex: auto;
              flex: auto;
        background-color: #EFEFF4;
    }
    .weui-search-bar__form:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
              transform: scale(0.5);
        -webkit-transform-origin: 0 0;
              transform-origin: 0 0;
        border-radius: 10px;
        border: 1px solid #E6E6EA;
        box-sizing: border-box;
        background: #FFFFFF;
    }
    .weui-search-bar__box {
        position: relative;
        padding-left: 30px;
        padding-right: 30px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        z-index: 1;
    }
    .weui-search-bar__box .weui-search-bar__input {
        padding: 4px 0;
        width: 100%;
        height: 30px;
        border: 0;
        font-size: 14px;
        line-height: 1.42857143em;
        box-sizing: content-box;
        background: transparent;
    }
    .weui-search-bar__box .weui-search-bar__input:focus {
        outline: none;
    }
    .weui-search-bar__box .weui-icon-search {
        position: absolute;
        left: 10px;
        top: 0;
        line-height: 38px;
    }
    .weui-search-bar__box .weui-icon-clear {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 10px;
        line-height: 28px;
    }
    .weui-search-bar__label {
        position: absolute;
        top: 1px;
        right: 1px;
        bottom: 1px;
        left: 1px;
        z-index: 2;
        border-radius: 3px;
        text-align: center;
        color: #9B9B9B;
        background: #FFFFFF;
    }
    .weui-search-bar__label span {
        display: inline-block;
        font-size: 14px;
        vertical-align: middle;
    }
    .weui-search-bar__label .weui-icon-search {
        margin-right: 5px;
    }
    .weui-search-bar__cancel-btn {
        display: none;
        margin-left: 10px;
        line-height: 28px;
        color: #FF9900;
        white-space: nowrap;
    }
    .weui-search-bar__input:not(:valid) ~ .weui-icon-clear {
        display: none;
    }

    .weui-icon-clear{
      margin-top: 5px;
    }
</style>

<template>
    <section class="container">
      <div class="weui-search-bar weui-search-bar_focusing">
          <div class="weui-search-bar__form">
              <div class="vux-search-mask" style="display: none;"></div>
              <div class="weui-search-bar__box">
                  <i class="weui-icon-search"></i>
                  <input type="search" id="search_input_6mp4g" placeholder="姓名、手机号" autocomplete="off" class="weui-search-bar__input" v-model="search">
                  <a href="javascript:" class="weui-icon-clear" v-show="search.length > 0" @click="searchClean"></a>
              </div>
              <label for="search_input_6mp4g" class="weui-search-bar__label">
              <i class="weui-icon-search"></i>
              <span>搜索</span></label>
          </div>
          <x-button mini type="primary" @click.native="searchResult" style="padding:0 10px;margin-left:10px;">搜索</x-button>
      </div>
      <scroller
        class="list"
        lock-x
        scrollbar-y
        :style="{height: listHeight + 'px'}"
        @on-pulldown-loading="onPulldown"
        ref="scrollerBottom"
        use-pulldown
        :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}"
        v-model="status">
          <div class="box2">
              <div v-if="!noData">
                  <div class="out-call-cell" v-for="(item ,index) in outCallData">
                    <outCallCell
                      :dataItem='item'
                      :category='1'
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
        v-on:readyToGoLianProduct='readyToGoLianProduct'
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
      category: 3, // 0:保骉车险外呼 1:保骉车险回访 2:畅想人生外呼 3:畅想人生回访
      produceId: '',
      search: '',
      vendorId: '',
      onFetching: false,
      searching: false,
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
    this.getOutCallList('')
  },
  updated () {
    this.$nextTick(() => {
      this.listHeight = $(window).height() - $('.weui-search-bar').height() - 20
      this.$refs.scrollerBottom.donePulldown()
      this.$refs.scrollerBottom.reset()

      var _this = this
      $(document).keydown(function (event) {
        if (event.keyCode === 13) {
          if (!_this.searching) {
            _this.searching = true
            _this.searchResult()
            setTimeout(() => {
              _this.searching = false
            }, 1500)
          }
        }
      })
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
    getOutCallList (q) {
      this.initData()
      this.$http.get(this.host_bdd + '/electricitySales/v1/return/visit/find?produceId=' +
      this.produceId + '&vendorId=' + this.vendorId + '&q=' + q)
      .then((rt) => {
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        this.outCallData = rt.data.jobs
        this.noData = !this.outCallData || this.outCallData.length === 0
      })
    },
    // 下拉刷新
    onPulldown () {
      this.searchResult()
    },
    // 初始化
    initData () {
      this.outCallData = []
      this.onFetching = true
      $('.weui-loadmore__tips').text('loading').prev().show()
    },
    searchResult () {
      let searchVal = $.trim(this.search)
      let q = null
      if (searchVal.length !== 0) {
        q = {'s.owner,s.mobile,j.secretNo_like': searchVal}
      }
      this.getOutCallList(JSON.stringify(q))
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
    searchClean () {
      this.search = ''
      this.getOutCallList('')
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
            this.getOutCallList('')
          }
          return
        }
      }
    },
    readyToGoLianProduct (selfMobile) {
      var _this = this
      this.$http.get(this.host_bdd + '/agent/v1/home').then((rt) => {
        if (rt.data.code !== 200) {
          _this.$vux.toast.text(rt.error, 'top')
          return
        }
        _this.goToToLianProduct(rt.data.tenantAccount.user.mobile)
      })
    },
    goToToLianProduct (selfMobile) {
      let birth = ''
      let gender = ''
      if (this.dataItem.jobDetail.identity.length === 18) {
        birth = this.dataItem.jobDetail.identity.substr(6, 4) + '-' +
        this.dataItem.jobDetail.identity.substr(10, 2) + '-' +
        this.dataItem.jobDetail.identity.substr(12, 2)
        if (this.dataItem.jobDetail.identity.substr(16, 1) % 2) {
          gender = '男'
        } else {
          gender = '女'
        }
      }
      var liAnFlowData = {
        'electricitySalesJobId': this.dataItem.id,
        'produceId': this.produceId,
        'vendorId': this.vendorId,
        'socialInsuFlag': this.dataItem.jobDetail.medicalInsurance,
        'policyHolder': {
          'name': this.dataItem.jobDetail.owner,
          'identity': this.dataItem.jobDetail.identity,
          'birth': birth,
          'gender': gender
        },
        'insured': {
          'name': this.dataItem.jobDetail.owner,
          'identity': this.dataItem.jobDetail.identity,
          'birth': birth,
          'gender': gender
        },
        'policyHolderMobile': selfMobile
      }
      this.storage.set('liAnFlowData', liAnFlowData)
      this.$router.push({path: '/product/lian/notice'})
    }
  }
}
</script>
