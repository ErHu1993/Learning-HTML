<style scoped>
    .box{
        background-color: #fbf9fe;
    }

    .section-title {
        margin-top: 0px;
        margin-bottom: 0px;
        height: 30px;
        overflow: hidden;
    }

    .section-title span {
        display: inline-block;
        margin-top: 10px;
    }

    .section-title img {
        float:right;
        margin-top: 10px;
        width: 20px;
        height:20px;
    }

</style>

<template>
    <div class="box">
        <incomeHeader :headerModel='headerModel'></incomeHeader>
        <incomeChart
        :chartWidth='chartWidth'
        :chartOption='chartOption'
        :chartTitle='chartTitle'
        chartId='allowance'
        ></incomeChart>
        <group-title slot="title" v-show='!noData' class="section-title">
            <span>{{dateTimeModel}}</span>
            <img src="../../assets/date-icon.png" @click='showDatetime = true'>
        </group-title>
        <popup v-model="showDatetime">
            <datetime-view
            v-model='dateTimeModel'
            :min-year='dateMinYear'
            :max-year='dateMaxYear'
            format='YYYY-MM'
            @change='dateTimeChange'>
            </datetime-view>
        </popup>
        <incomeList
        :category=3
        :dateParam='dateTimeModel | formatDateParam'
        :noData='noData'
        :marginTop='250' >
        </incomeList>
    </div>
</template>

<script>
import incomeHeader from '@/views/component-views/income-header.vue'
import incomeChart from '@/views/component-views/income-chart.vue'
import incomeList from '@/views/component-views/income-list.vue'

import { GroupTitle, DatetimeView, Popup } from 'vux'

export default {

  data () {
    return {
      headerModel: {
        headerTitle: '今日保费 (元)',
        incomeAmount: '0.00',
        footerTitle: '累计保费 0.00 万'
      },
      noData: true,
      chartOption: null,
      chartWidth: null,
      chartTitle: '今日保费',
      showDatetime: false,
      dateMinYear: 2017,
      dateMaxYear: new Date().getFullYear(),
      dateTimeModel: new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
    }
  },

  components: {
    incomeHeader,
    incomeChart,
    incomeList,
    GroupTitle,
    DatetimeView,
    Popup
  },

  filters: {
            // 时间格式化
    formatDateParam (time) {
      var param = time.split('-').join('')
      return param
    }
  },

  mounted: function () {
    var _this = this
    this.$nextTick(function () {
      _this.getIncomeAccountData()
      _this.getIncomeChartData()
    })
  },

  methods: {
    setChartOption (chartData) {
      var xAxisData = []// x坐标
      var allowanceSeriesData = []
      for (var i = 0; i < chartData.length; i++) {
        var lineChart = chartData[i]
        xAxisData.push(lineChart.datetime)
        allowanceSeriesData.push(lineChart.major)
      }
                // 配置选项
      var option = {
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: [
          {
            left: '0px',
            right: '0px'
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: xAxisData
          }
        ],
        yAxis: [
          {
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'line',
            data: allowanceSeriesData,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                color: '#2c80e9'
              }
            }
          }
        ]
      }

      this.chartWidth = (document.body.clientWidth) / 5 * chartData.length + 'px'
      this.chartOption = option
    },

    getIncomeAccountData () {
      var _this = this
      _this.$http.get(_this.host_bdd + '/captial/v1/account')
                .then((rt) => {
                  if (rt.data.code !== 200) {
                    _this.$vux.toast.text(rt.error, 'top')
                    return
                  }
                  if (rt.data.catpitalAccount) {
                    var catpitalAccount = rt.data.catpitalAccount
                    _this.headerModel.incomeAmount =
                        catpitalAccount.dayPremiumAmount > 0 ? catpitalAccount.dayPremiumAmount : '0.00'

                    var totalNum = '0.00'
                    if (catpitalAccount.totalPremiumAmount >= 0) {
                      totalNum = catpitalAccount.totalPremiumAmount
                      this.noData = false
                    } else {
                      this.noData = true
                    }
                    _this.headerModel.footerTitle = ('累计保费 ' + totalNum + ' 万')
                  }
                })
    },

    getIncomeChartData () {
      var _this = this
      _this.$http.get(_this.host_bdd + '/captial/v1/premium/chart')
                .then((rt) => {
                  if (rt.data.code !== 200) {
                    _this.$vux.toast.text(rt.error, 'top')
                    return
                  }
                  if (rt.data.lineChart) {
                    _this.setChartOption(rt.data.lineChart)
                  }
                })
    },

    dateTimeChange () {

    }
  }
}
</script>
