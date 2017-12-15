<style lang="scss" scoped>
    .container {
        background-color: #fff;

        .flex-demo {
            display: block;
            line-height: 37px;
            border-bottom: 1px solid transparent;
        }
        .flex-demo.active span {
            display: inline-block;
            padding: 0 10px;
            border-bottom: 1px solid #333;
        }

        .list {
            border-top: 10px solid #fbf9fe;
        }

        .link {
            padding: 5px 15px;
            border-bottom: 1px solid #ccc;
        }

        a {
            color: #000;
        }

        .left {
            p {
                line-height: 24px;
            }
        }

        .box2-wrap {
          height: 300px;
          overflow: hidden;
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
    }
</style>

<template>
    <section class="container">
        <flexbox>
              <flexbox-item class="text_center">
                <a class="flex-demo" :class="{active: dealType == 'recharge'}" @click="setInoutCome('recharge')"><span>收入</span></a>
              </flexbox-item>
              <flexbox-item class="text_center">
                <a class="flex-demo" :class="{active: dealType == 'decharge'}" @click="setInoutCome('decharge')"><span>支出</span></a>
            </flexbox-item>
        </flexbox>

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
                            <p class="fs18 price" v-if="dealType == 'recharge'" style="line-height:22px;color:#01B710">
                                +{{i.deltaAmount}}<br>
                                <span class="fs12 cr_gray">交易中</span>
                            </p>
                            <p class="fs18 price cr_black" v-else>
                                -{{i.deltaAmount}}<br>
                                <span class="fs12 cr_gray">交易中</span>
                            </p>
                        </div>
                    </div>
                    <load-more tip="加载中" style="height:40px;margin-top:10px;"></load-more>
                </div>
                <div class="no_data_pd" v-if="noData">
                    <div class="no_data">
                        <i></i>
                        <p>暂时木有数据哦~</p>
                    </div>
                </div>
            </div>
        </scroller>
    </section>
</template>

<script>
import $ from 'zepto'
import { formatDate } from '@/libs/format.js'
import { Flexbox, FlexboxItem, Scroller, XButton, LoadMore } from 'vux'
export default {
  data () {
    return {
      onFetching: false,
      listHeight: 0,
      status: {
        pullupStatus: 'default'
      },
      inoutcomes: [],
      pageNumber: 0,
      pageCount: 1,
      pageSize: 20,
      dealType: this.$route.query.dealType,
      noData: false
    }
  },
  components: {
    Flexbox, FlexboxItem, Scroller, XButton, LoadMore
  },
  computed: {

  },
  filters: {
        // 时间格式化
    formatData (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  created () {
    var wh = $(window).height()
    this.listHeight = wh - 38
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({top: 0})
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
    getInoutCome (data, on) {
      data.dealTrxType = data.dealType + '-apply'

      this.$http.get(this.host_bdd + '/captial/v1/inoutcome/list', {
        params: data
      }).then((rt) => {
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        // 多页数据进行合并
        this.inoutcomes = (rt.data.inoutcomes) ? this.inoutcomes.concat(rt.data.inoutcomes) : []
        this.pageNumber = rt.data.pageNumber
        this.pageCount = rt.data.pageCount
        this.noData = this.inoutcomes.length === 0

        if (on === 'on') {
          setTimeout(() => {
            this.onFetching = false
          }, 600)
        }
      })
    },
        // 切换
    setInoutCome (dealType) {
      this.dealType = dealType
      this.initData()

      this.getInoutCome({
        dealType: this.dealType,
        pn: this.pageNumber + 1,
        ps: this.pageSize
      }, 'on')
    },
        // 到底加载
    onScrollBottom () {
      if (this.onFetching) return

      if (this.pageCount === this.pageNumber) {
        $('.weui-loadmore__tips').text('已显示全部').prev().hide()

        return
      }
      this.onFetching = true

      this.getInoutCome({
        dealType: this.dealType,
        pn: this.pageNumber + 1,
        ps: this.pageSize
      }, 'on')
    },
        // 下拉刷新
    onPulldown () {
      this.initData()
      this.getInoutCome({
        dealType: this.dealType,
        pn: this.pageNumber + 1,
        ps: this.pageSize
      }, 'on')
    },
        // 初始化
    initData () {
      this.pageNumber = 0
      this.inoutcomes = []
      this.onFetching = true
      $('.weui-loadmore__tips').text('loading').prev().show()
    }
  }
}
</script>
