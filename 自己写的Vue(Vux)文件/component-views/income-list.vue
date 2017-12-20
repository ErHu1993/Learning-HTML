<style lang="scss" scoped>
    .main-body{
        background-color: #fff;
    }

    .list {
        border-top: 10px solid #fbf9fe;
    }

    .link {
        padding: 5px 15px;
        border-bottom: 1px solid #ccc;
    }

    .left {
        p {
            line-height: 24px;
        }
    }

    .title {
        width: 48px;
        height: 48px;
        padding:0 8px;
        margin-right: 0.267rem;
        text-align: center;
        line-height: 48px;
        background-color: #ccc;
    }

    .no_data_pd p {
        text-align: center;
    }


</style>

<template>
    <div class="main-body">
        <scroller  class="list" lock-x scrollbar-y :style="{height: listHeight + 'px'}" @on-scroll-bottom="onScrollBottom" @on-pulldown-loading="onPulldown" ref="scrollerBottom" :scroll-bottom-offst="200" use-pulldown :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}"  v-model="status">
            <div class="box2">
                <div v-if="inoutcomes.length > 0">
                    <div class="clearfix link" v-for="i in inoutcomes">
                        <div class="clearfix l left">
                            <div class="l title" v-if="i.desc1.length <= 2">{{i.desc1}}</div>
                            <div class="l title" v-else style="padding-top:4px;line-height:20px;">{{i.desc1}}</div>
                            <div class="l">
                                <p>{{i.desc2}}</p>
                                <p class="fs14 cr_gray">{{i.createTime | formatData}}</p>
                            </div>
                        </div>
                        <div class="r right text_right">
                            <p class="fs18 price" style="line-height:22px;margin-top: 15px; color:#01B710">
                                +{{i.deltaAmount}}<br>
                            </p>
                        </div>
                    </div>
                    <load-more tip="加载中" style="height:40px;margin-top:10px;"></load-more>
                </div>
                <div class="no_data_pd" v-if="noData">
                    <p>越努力越幸运,要加油哦</p>
                </div>
                <div class="no_data_pd" v-else-if="emptyData">
                    <p>暂时木有数据哦~</p>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
import $ from 'zepto'
import { formatDate } from '@/libs/format.js'
import { Scroller, LoadMore } from 'vux'

export default {

  components: {
    Scroller, LoadMore
  },

  data () {
    return {
      onFetching: false,
      bottomCount: 20,
      pageNo: 0,
      listHeight: 0,
      status: {
        pullupStatus: 'default'
      },
      inoutcomes: [],
      pageNumber: 0,
      pageCount: 0,
      pageSize: 20,
      emptyData: false
    }
  },

  watch: {
    dateParam: {
      handler: function (item) {
        this.initData()
        this.getInoutCome()
      }
    }
  },

  props: {
            /**
             * 1:佣金列表  2:津贴列表  3:保费列表
             */
    category: 0,
    dateParam: '',
    marginTop: 0,
    noData: false
  },

  filters: {
            // 时间格式化
    formatData (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },

  created () {
    this.listHeight = $(window).height() - parseInt(this.marginTop)
  },

  mounted () {
    this.$nextTick(() => {
      if (this.inoutcomes.length) {
        this.$refs.scrollerBottom.reset({top: 0})
      }
      this.getInoutCome()
    })
  },

  updated () {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.donePulldown()
      this.$refs.scrollerBottom.reset()

      const boxH = $('.box2').height()
      const listH = $('.box2').closest('.list').height()
      if (boxH <= listH) {
        $('.weui-loadmore__tips')
                    .text('数据全部加载完成！')
                    .prev().hide()
                    .parent().css('margin-top', listH - boxH)
      }
    })
  },

  methods: {
    getInoutCome () {
      switch (parseInt(this.category)) {
        case 1 : {
          this.getCommissionDataList({
            month: this.dateParam,
            pn: this.pageNumber + 1,
            ps: this.pageSize
          })
          break
        }
        case 2 : {
          this.getAllowanceDataList()
          break
        }
        case 3 : {
          this.getPremiumDataList({
            month: this.dateParam,
            pn: this.pageNumber + 1,
            ps: this.pageSize
          })
          break
        }
      }
    },
            // 到底加载
    onScrollBottom () {
      if (this.onFetching) return
      if ((this.pageCount === this.pageNumber)) {
        $('.weui-loadmore__tips').text('数据全部加载完成！').prev().hide()
        return
      }
      this.onFetching = true
      this.getInoutCome()
    },
            // 下拉刷新
    onPulldown () {
      this.initData()
      this.getInoutCome()
    },
            // 初始化
    initData () {
      this.pageNumber = 0
      this.pageCount = 0
      this.inoutcomes = []
      this.onFetching = true
      $('.weui-loadmore__tips').text('loading').prev().show()
    },

    getCommissionDataList (params) {
      var _this = this
      _this.$http.get(_this.host_bdd + '/captial/v1/commission/list', {
        params: params
      }).then((rt) => {
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }
                    // 多页数据进行合并
        if (rt.data.inoutcomes) {
          _this.inoutcomes = _this.inoutcomes.concat(rt.data.inoutcomes)
          _this.pageNumber = rt.data.pageNumber
          _this.pageCount = rt.data.pageCount
        }

        _this.emptyData = _this.inoutcomes.length === 0

        setTimeout(() => {
          _this.onFetching = false
        }, 600)
      })
    },

    getAllowanceDataList () {
      var _this = this
      _this.$http.get(_this.host_bdd + '/captial/v1/allowance/list?year=' + _this.dateParam)
                .then((rt) => {
                  if (rt.data.code !== 200) {
                    _this.$vux.toast.text(rt.error, 'top')
                    return
                  }
                    // 多页数据进行合并
                  if (rt.data.inoutcomes) {
                    _this.inoutcomes = _this.inoutcomes.concat(rt.data.inoutcomes)
                  }

                  _this.emptyData = _this.inoutcomes.length === 0

                  _this.pageCount = 1
                  _this.pageNumber = 1

                  setTimeout(() => {
                    _this.onFetching = false
                  }, 600)
                })
    },

    getPremiumDataList (params) {
      var _this = this
      _this.$http.get(_this.host_bdd + '/captial/v1/premium/list', {
        params: params
      }).then((rt) => {
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }
                    // 多页数据进行合并
        if (rt.data.inoutcomes) {
          _this.inoutcomes = _this.inoutcomes.concat(rt.data.inoutcomes)
          _this.pageNumber = rt.data.pageNumber
          _this.pageCount = rt.data.pageCount
        }

        _this.emptyData = _this.inoutcomes.length === 0

        setTimeout(() => {
          _this.onFetching = false
        }, 600)
      })
    }
  }
}
</script>
