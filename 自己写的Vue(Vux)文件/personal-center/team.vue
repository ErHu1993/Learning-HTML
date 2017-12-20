<style lang="scss" scoped>
    .box{
        background-color: #fbf9fe;
    }

    .list {
        border-top: 10px solid #fbf9fe;
    }

    .card {
        margin: 0px 10px;
        border-radius: 5px;
    }

    .card-flex {
      display: flex;
    }

    .card-content {
      padding: 10px 0;
    }

    .weui-panel:after {
        border-bottom: 0px;
    }

    .weui-panel:before{
        border-top: 0px;
    }

    .card-flex > div {
      flex: 1;
      text-align: center;
      font-size: 12px;
    }

    .card-flex span {
        font-size: 18px;
    }

    .card-flex strong {
        height:30px;
        width:1px;
        margin: auto 0px;
        background-color: #ebebeb;
    }

    .card-flex label{
        color:#9a9a9a;
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

    .cell{
        margin: 0 10px;
        margin-bottom: 10px;
        height: 60px;
        background-color: #fff;
        border-radius:5px;
    }

    .cell-header{
        display: inline-block;
        margin-top: 10px;
        margin-left: 10px;
        width:40;
        height:40px;
        border-radius: 20px;
        float: left;
    }

    .cell-content-left{
        margin-top: 10px;
        display: inline-block;
        float: left;
        margin-left: 10px;
        text-align: left;
    }

    .cell-content-right {
        display: block;
        text-align: right;
        margin-top: 10px;
        display: inline-block;
        float: right;
        margin-right: 10px;
    }

    .cell-content label{
        display: block;
    }

</style>

<template>
    <div class="box">
        <div class="weui-search-bar weui-search-bar_focusing">
            <div class="weui-search-bar__form">
                <div class="vux-search-mask" style="display: none;"></div>
                <div class="weui-search-bar__box">
                    <i class="weui-icon-search"></i>
                    <input type="search" id="search_input_6mp4g" @on-enter="searchHandle" placeholder="输入姓名或手机号搜索" autocomplete="off" class="weui-search-bar__input">
                    <a href="javascript:" class="weui-icon-clear" style="display: none"></a>
                </div>
                <label for="search_input_6mp4g" class="weui-search-bar__label">
                    <i class="weui-icon-search"></i>
                    <span>搜索</span>
                </label>
            </div>
            <x-button mini type="primary" style="padding:0 10px;margin-left:10px;" @click.native='searchHandle'>搜索</x-button>
        </div>
        <div v-show='!queryConditions'>
            <card class="card">
                <div slot="content" class="card-flex card-content">
                    <div>
                        <span>{{tenantStatistics.recordCount}}</span>
                        <br/>
                        <label>团队人数(人)</label>
                    </div>
                    <strong></strong>
                    <div>
                        <span>{{tenantStatistics.premiumAmount | moneyFilter}}</span>
                        <br/>
                        <label>本月保费(万)</label>
                    </div>
                    <strong></strong>
                    <div>
                        <span>{{tenantStatistics.prePremiumAmount | moneyFilter}}</span>
                        <br/>
                        <label>上月保费(万)</label>
                    </div>
                </div>
            </card>
        </div>

        <scroller  class="list" lock-x scrollbar-y :style="{height: listHeight + 'px'}" @on-scroll-bottom="onScrollBottom" @on-pulldown-loading="onPulldown" ref="scrollerBottom" :scroll-bottom-offst="200" use-pulldown :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}"  v-model="status">
            <div class="box2">
                <div v-if="tenantsWithParent.length > 0">
                    <div v-for="item in tenantsWithParent">
                        <div class="cell" @click='goDetail(item)'>
                            <img class="cell-header" :src='item.portrait ? item.portrait : placeholderHeader'><i></i>
                            <div class="cell-content">
                                <div class="cell-content-left">
                                    <label v-text='item.contact'></label>
                                    <label>本月佣金 {{item.commissionAmount}}</label>
                                </div>
                                <div class="cell-content-right">
                                    <label v-text='item.contactMobile'></label>
                                    <label>本月保费 {{item.premiumAmount}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <load-more tip="加载中" style="height:40px"></load-more>
                </div>
                <div v-else class="text_center">没有搜到相关结果,换个关键词试试</div>
            </div>
        </scroller>
    </div>
</template>

<script>
    import {Scroller, XButton, LoadMore, Card} from 'vux'
    import $ from 'zepto'

    export default {

      components: {
        Scroller,
        LoadMore,
        XButton,
        Card
      },

      data () {
        return {
          onFetching: true,
          listHeight: 0,
          pageNumber: 0,
          pageCount: 1,
          pageSize: 20,
          placeholderHeader: require('../../assets/head.png'),
          searchText: '',
          queryConditions: null,
          queryOption: 100,
          status: {
            pullupStatus: 'default'
          },
          tenantsWithParent: [
          ],
          tenantStatistics: {
            prePremiumAmount: '0',
            premiumAmount: '0',
            recordCount: '0'
          }
        }
      },

      filters: {
            // 金额判断 -- 为 0.00
        moneyFilter (money) {
          var result = '0.00'
          if (money > 0) {
            return money
          }
          return result
        }
      },

      created () {
        this.listHeight = $(window).height() - 58 - 67 - 10
      },

      updated () {
        this.$nextTick(() => {
          this.$refs.scrollerBottom.donePulldown()
          this.$refs.scrollerBottom.reset()
          var _this = this
          $(document).keydown(function (event) {
            if (event.keyCode === 13) {
              if (!_this.onFetching) {
                _this.onFetching = true
                _this.searchHandle()
              }
            }
          })
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

      mounted () {
        this.$nextTick(() => {
          if (this.tenantsWithParent.length) {
            this.$refs.scrollerBottom.reset({top: 0})
          }
          this.getStatisticsData()
            // this.onFetching = true;
          this.getTeamList({
            option: this.queryOption,
            q: this.queryConditions,
            pn: this.pageNumber + 1,
            ps: this.pageSize
          }, 'on')
          this.listenInputChange()
        })
      },

      methods: {
        getStatisticsData () {
          this.$http.get(this.host_bdd + '/agent/v1/inferior/statistics')
                 .then((rt) => {
                   if (rt.data.code !== 200) {
                     this.$vux.toast.text(rt.data.message, 'top')
                     return
                   }
                   if (rt.data.tenantStatistics) {
                     this.tenantStatistics = rt.data.tenantStatistics
                   }
                 })
        },
            // 获取数据
        getTeamList (data, on) {
          var _this = this
          this.$http.get(this.host_bdd + '/agent/v1/inferior/find', {
            params: data
          }).then((rt) => {
            if (rt.data.code !== 200) {
              this.$vux.toast.text(rt.data.message, 'top')
              return
            }
                    // 多页数据进行合并
            if (on === 'down') {
              this.tenantsWithParent = []
            }

            if (rt.data.tenantsWithParent) {
              this.tenantsWithParent = this.tenantsWithParent.concat(rt.data.tenantsWithParent)
              this.pageNumber = rt.data.pageNumber
              this.pageCount = rt.data.pageCount
            }
            this.tenantStatistics.recordCount = rt.data.recordCount

            setTimeout(() => {
              _this.onFetching = false
            }, 1500)
          })
        },
            // 到底加载
        onScrollBottom () {
          if (this.onFetching) {
            return
          }
          this.onFetching = true
          if (this.pageCount === this.pageNumber) {
            $('.weui-loadmore__tips').text('数据全部加载完成！').prev().hide()
            return
          }
          this.getTeamList({
            option: this.queryOption,
            q: this.queryConditions,
            pn: this.pageNumber + 1,
            ps: this.pageSize
          }, 'on')
        },
            // 下拉刷新
        onPulldown () {
          this.initData()
          this.getTeamList({
            option: this.queryOption,
            q: this.queryConditions,
            pn: this.pageNumber + 1,
            ps: this.pageSize
          }, 'down')
        },
            // 初始化
        initData () {
          this.onFetching = true
          this.pageNumber = 0
          $('.weui-loadmore__tips').text('loading').prev().show()
        },
        listenInputChange () {
          var _this = this
          var timer = setInterval(function () {
            var dateControl = document.getElementById('search_input_6mp4g')
            if (dateControl) {
              clearInterval(timer)
              dateControl.addEventListener('input', function (e) {
                _this.searchText = e.target.value
                if (!_this.searchText) {
                  _this.searchHandle()
                }
              })
            }
          }, 500)
        },
        searchHandle () {
          this.searchText = $('#search_input_6mp4g').val()
          if (this.searchText) {
            var jsonObject = {
              'child.name,child.contact,child.contactMobile_like': this.searchText
            }
            this.queryConditions = JSON.stringify(jsonObject)
            this.listHeight = $(window).height() - 58 - 10
          } else {
            this.queryConditions = null
            this.listHeight = $(window).height() - 58 - 10 - 67
          }
          this.onPulldown()
          this.$refs.scrollerBottom.reset({top: 0})
        },
        goDetail (tenantsWithParent) {
          this.$router.push({path: '/team/detail', query: {id: tenantsWithParent.id}})
        }
      }
    }
</script>
