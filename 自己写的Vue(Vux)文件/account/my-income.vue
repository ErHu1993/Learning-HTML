<style scoped>
    .box{
        background-color: #fbf9fe;
    }

    .card-flex {
      display: flex;
    }

    .card-content {
      padding: 10px 0;
    }

    .card-flex > div {
      flex: 1;
      text-align: center;
      font-size: 12px;
    }

    .card-flex span {
        font-size: 18px;
        color: #000;
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

</style>

<template>
    <div class="box">
        <incomeHeader :headerModel='headerModel'></incomeHeader>
        <incomeChart
        :chartWidth='chartWidth'
        :chartOption='chartOption'
        :chartTitle='chartTitle'
        chartId='income'>
        </incomeChart>
         <card style="margin-top: 0px;">
            <div slot="content" class="card-flex card-content">
                <div>
                    <router-link to='/account/my/commission'>
                        <span>{{headerModel.commissionAmount}}</span>
                        <br/>
                        <label>本月佣金</label>
                    </router-link>
                </div>
                <strong></strong>
                <div @click='gotoAllowance'>
                    <span>{{headerModel.allowanceAmount}}</span>
                    <br/>
                    <label>上月津贴</label>
                </div>
            </div>
        </card>
    </div>
</template>


<script>
import incomeHeader from '@/views/component-views/income-header.vue'
import incomeChart from '@/views/component-views/income-chart.vue'

import { Card } from 'vux'

export default {

  data () {
    return {
      headerModel: {
        headerTitle: '本月收入 (元)',
        incomeAmount: '0.00',
        footerTitle: '累计收入 0.00',
        commissionAmount: '0.00',
        allowanceAmount: '0.00'
      },
      chartOption: null,
      chartWidth: null,
      chartTitle: '每月收入',
      hasInferior: 1
    }
  },

  components: {
    incomeHeader,
    incomeChart,
    Card
  },

  mounted: function () {
    this.$nextTick(function () {
      this.getIncomeAccountData()
      this.getIncomeChartData()
    })
  },

  methods: {
    setChartOption (chartData) {
      var xAxisData = []// x坐标
      var incomeSeriesData = []// 点坐标
      var commissionSeriesData = []
      var allowanceSeriesData = []
      for (var i = 0; i < chartData.length; i++) {
        var lineChart = chartData[i]
        xAxisData.push(lineChart.datetime)
        incomeSeriesData.push(lineChart.major)
        commissionSeriesData.push((lineChart.minor[0]) > 0 ? lineChart.minor[0] : '')
        allowanceSeriesData.push((lineChart.minor[1]) > 0 ? lineChart.minor[1] : '')
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
        legend: {
          align: 'right',
          right: 10,
          data: ['收入', '佣金', '津贴']
        },
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
            name: '收入',
            data: incomeSeriesData,
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
          },
          {
            type: 'bar',
            name: '佣金',
            data: commissionSeriesData,
            label: {
              normal: {
                show: true,
                position: 'inside'
              }
            },
            itemStyle: {
              normal: {
                color: '#04be02'
              }
            }
          },
          {
            type: 'bar',
            name: '津贴',
            data: allowanceSeriesData,
            label: {
              normal: {
                show: true,
                position: 'inside'
              }
            },
            itemStyle: {
              normal: {
                color: '#ff8a00'
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
                        catpitalAccount.incomeAmount > 0 ? catpitalAccount.incomeAmount : '0.00'
                    _this.headerModel.footerTitle =
                        ('累计收入 ' + (catpitalAccount.totalIncomeAmount > 0 ? catpitalAccount.totalIncomeAmount : '0.00') + ' 元')
                    _this.headerModel.commissionAmount = catpitalAccount.commissionAmount
                    _this.headerModel.allowanceAmount = catpitalAccount.allowanceAmount
                    _this.hasInferior = catpitalAccount.hasInferior
                  }
                })
    },

    getIncomeChartData () {
      var _this = this
      _this.$http.get(_this.host_bdd + '/captial/v1/income/chart')
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

    gotoAllowance () {
      if (this.hasInferior) {
        this.$router.push({ path: '/account/my/allowance' })
      } else {
        this.$router.push({
          path: '/team/empty',
          query: {
            title: '津贴明细'
          }
        })
      }
    }
  }
}
</script>
