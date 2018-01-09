<style scoped>

    /* mainBody */
    .main{
        height: 100%;
        background-color: #fff;
    }

    .whiteColor {
      background-color: #fff;
    }

    /* 标题 */
    .head-title {
        padding-left: 20px;
        padding-top: 20px;
        font-size: 14px;
        font-weight: normal;
        background-color: #fff;
    }

    .head-title span {
      background-color: #3a97f6;
      line-height: 16px;
      height:16px;
      width:6px;
      display:inline-block;
    }

    /* 表格列表 */
    .agent-table-div{
        margin: 20px;
        background-color: #fff;
    }

    .trend-analyse-date-picker{
        width: 250px;
        margin-right: 20px;
        display: inline-block;
        float: right;
    }

    .trend-analyse-charts{
        background-color: #fff;
    }

    .breadcrumb[data-v-6f54f546] {
        border-top: 10px solid #f2f7ff;
        border-bottom: 0px;
    }

    .trend-analyse-chart{
        margin: 10px 20px;
        background-color: #f2f6ff;
    }

    #echarts-out-call-statistics {
      width: 100%;
      height: 100%;
    }

    .ivu-table-body{
      height: 160px;
    }

</style>

<template>
    <div class="main">
        <h5 class="head-title"><span>&nbsp;</span>   电销人员列表</h5>
        <div class="agent-table-div">
            <Table :height="tableHeight" border :columns="listTitles" :data="tableData"></Table>
        </div>
        <div class="whiteColor">
          <breadcrumb :breadcrumb='["电销人员状态"]'>
            <Date-picker
              class='trend-analyse-date-picker'
              type="date"
              :value='trendDataPickValue'
              :clearable='false'
              @on-change='trendDataPickTimeChange'
              placement='left-end'>
            </Date-picker>
          </Breadcrumb>
        </div>
        <div class="trend-analyse-charts">
          <div class="trend-analyse-chart">
              <div id="echarts-out-call-statistics"></div>
          </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import $ from 'jquery'
    import Breadcrumb from '@/components/layout/Breadcrumb.vue'

    export default {
      data () {
        return {
          breadcrumb: ['电销人员状态'],
          datePlaceholder: '选择时间',
          tableData: [],
          tableHeight: '',
          trendDataPickValue: 0,
          listTitles: [
            {
              title: '姓名',
              key: 'contact'
            },
            {
              title: '手机号',
              key: 'contactMobile'
            },
            {
              title: '电销任务数',
              key: 'jobCount'
            },
            {
              title: '回访任务数',
              key: 'revisitJobCount'
            }
          ],
          currentChart: null,
          statisticsChartsData: [],
          statisticsUpdating: false
        }
      },
      created () {
        this.trendDataPickValue = this.timeFormat(new Date(), 'yyyy-MM-dd')
        this.getDataList()
        this.getChartData()
      },
      mounted: function () {
      },
      updated () {

      },
      components: {
        Breadcrumb
      },
      methods: {
        getDataList: function () {
          var _this = this
          this.$get(this.host_bdd + '/electricitySales/v1/salers/list',
          function (rt) {
            if (rt.data.code !== 200) {
              _this.$Message.error(rt.data.error)
              return
            }
            if (rt.data.salers) {
              _this.tableData = rt.data.salers
              _this.tableHeight = 200
            } else {
              _this.tableData = []
            }
          })
        },
        getChartData () {
          var _this = this
          this.$get(this.host_bdd + '/electricitySales/v1/call/time/chart?date=' + this.trendDataPickValue,
          function (rt) {
            if (rt.data.code !== 200) {
              _this.$Message.error(rt.data.error)
              return
            }
            _this.statisticsUpdating = false
            _this.analyseChartChange(rt.data.salerCallTimeChart)
          })
        },
        trendDataPickTimeChange (value) {
          this.trendDataPickValue = value
          this.getChartData()
        },
        analyseChartChange (salerCallTimeChart) {
          if (this.echarts) this.echarts.dispose()
          if (!salerCallTimeChart || this.statisticsUpdating) return
          this.statisticsUpdating = true
          var chartId = 'echarts-out-call-statistics'
          var names = []
          for (var i = 0; i < salerCallTimeChart.length; i++) {
            let item = salerCallTimeChart[i]
            names.push(item.tenant.contact)
          }
          $('.trend-analyse-chart').height(names.length * 80 + 60 + 'px')

          $.getJSON('./static/timeX.json', function (hours) {
            var multiple = 3.14
            var canvasWidth = $('#echarts-out-call-statistics').width()
            if (canvasWidth) {
              multiple = canvasWidth / 354
            }
            var option = {
              tooltip: {
                position: 'top',
                formatter: function (params) {
                  return '开始时间：' + params.data[0] + ' 通话时长：' + params.data[1] + '秒'
                }
              },
              title: [],
              singleAxis: [],
              series: []
            }

            echarts.util.each(names, function (day, idx) {
              option.title.push({
                textBaseline: 'middle',
                top: (idx * 80) + 50 + 'px',
                text: day
              })
              option.singleAxis.push({
                left: 130,
                type: 'category',
                boundaryGap: false,
                data: hours,
                top: (idx * 80) + 'px',
                height: '80px'
              })
              option.series.push({
                singleAxisIndex: idx,
                coordinateSystem: 'singleAxis',
                type: 'scatter',
                data: [],
                symbolOffset: [0, '20px'],
                symbolSize: function (dataItem) {
                  return dataItem[1] * multiple
                }
              })
            })
            echarts.util.each(salerCallTimeChart, function (dataItem, index) {
              if (dataItem.items) {
                echarts.util.each(dataItem.items, function (dataItem2, index2) {
                  option.series[index].data.push([dataItem2.middleTime, dataItem2.radius])
                })
              }
            })
            var oldChart = echarts.getInstanceByDom(document.getElementById(chartId))
            if (oldChart) {
              oldChart.dispose()
            }
            this.currentChart = echarts.init(document.getElementById(chartId))
            this.currentChart.setOption(option)
          })
        }
      }
    }
</script>
