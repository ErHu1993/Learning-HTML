<style scoped>
    .box{
        background-color: #fbf9fe;
    }

    .header{
        background-color: #fff;
        text-align: center;
        padding: 15px 0px;
        background: url('../../assets/team-detail-bg.png') repeat;
        background-size: 100% auto;
    }


    .header img {
        margin: 0 auto;
        border: 2px solid #a4cbfb;
        width:1.8rem;
        height:1.8rem;
        border-radius: 0.9rem;
    }

    .header label {
        display: block;
        margin: 0 auto;
        margin-top: 5px;
        color: #fff;
    }

    .header-name {
        font-size: 15px;
    }

    .header-mobile{
        font-size: 12px;
    }

    .card {
        background-color: transparent;
    }

    .card-flex {
      display: flex;
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
        color: #fff;
        font-size: 18px;
    }

    .card-flex strong {
        height:30px;
        width:1px;
        margin: auto 0px;
        background-color: #dddddd;
    }

    .card-flex label {
        color:#dddddd;
        font-size: 14px;
    }

    .echarts-box{
        width: 100%;
        height: 170px;
        overflow: auto;
    }

    .echarts-header {
       display: block;
       border-bottom: 1px solid #e5e5e5;
       padding-top: 10px;
       padding-left: 10px;
       padding-bottom: 10px;
    }

    #echarts-premium-amount {
        height: 100%;
    }

    #echarts-commission-amount {
        height: 100%;
    }

     #echarts-policy-count {
        height: 100%;
    }

</style>

<template>
    <div class="box">
        <div class="header">
            <img :src='tenantWithAgentInfo.portrait ? tenantWithAgentInfo.portrait : placeholderHeader'>
            <label class="header-name" v-text='tenantWithAgentInfo.contact'></label>
            <label class="header-mobile" v-text='tenantWithAgentInfo.contactMobile'></label>
            <!-- <div> -->
                <card class="card">
                    <div slot="content" class="card-flex card-content">
                        <div>
                            <span>{{tenantWithAgentInfo.totalPremiumAmount | moneyFilter}}</span>
                            <br/>
                            <label>累计保费(万)</label>
                        </div>
                        <strong></strong>
                        <div>
                            <span>{{tenantWithAgentInfo.totalCommissionAmount | moneyFilter}}</span>
                            <br/>
                            <label>累计佣金(万)</label>
                        </div>
                        <strong></strong>
                        <div>
                            <span>{{tenantWithAgentInfo.totalPolicyCount}}</span>
                            <br/>
                            <label>累计保单(个)</label>
                        </div>
                    </div>
                </card>
            <!-- </div> -->
        </div>
        <group>
            <span class="echarts-header" @click='click'>每月保费</span>
            <div class="echarts-box">
                 <div id="echarts-premium-amount">

                 </div>
            </div>
            <span class="echarts-header">每月佣金</span>
            <div class="echarts-box">
                 <div id="echarts-commission-amount">

                 </div>
            </div>
            <span class="echarts-header">每月保单数</span>
            <div class="echarts-box">
                 <div id="echarts-policy-count">

                 </div>
            </div>
        </group>
    </div>
</template>

<script>
    import { Group ,Card} from 'vux'
    import echarts from 'echarts';
    import $ from 'zepto';

    export default {

        components: {
            Group,
            Card
        },

        data () {
            return {
                placeholderHeader : require('../../assets/head.png'),
                tenantWithAgentInfo : []
            }
        },

        filters : {
            // 金额判断 -- 为 0.00
            moneyFilter (money) {
                var result = "0.00";
                if (money > 0) {
                    return money;
                }
                return result;
            }
        },

        mounted () {
            var _this = this;
            this.$nextTick(function () {
                this.getMemberDetail();
                this.getPremiumChartData();
                this.getCommissionChartData();
                this.getPolicyChartData();
            });
        },

        methods : {
            click () {

            },
            getMemberDetail: function () {
                var _this = this;
                _this.$http.get(_this.host_bdd + '/agent/v1/inferior/detail/' + _this.$route.query.id).then((rt) => {
                    if (rt.data.code != 200) {
                         _this.$vux.toast.text(rt.error, 'top');
                         return;
                     }
                     if (rt.data.tenantWithAgentInfo) {
                         _this.tenantWithAgentInfo = rt.data.tenantWithAgentInfo;
                     }
                 });
            },
            //保费数据
            getPremiumChartData () {
                var _this = this;
                _this.$http.get(_this.host_bdd + '/agent/v1/inferior/detail/' + _this.$route.query.id + "/premium").then((rt) => {
                    if (rt.data.code != 200) {
                         _this.$vux.toast.text(rt.error, 'top');
                         return;
                     }
                     if (rt.data.lineChart) {
                         _this.setChartOption("echarts-premium-amount",rt.data.lineChart);
                     }
                 });
            },
            //佣金数据
            getCommissionChartData () {
                var _this = this;
                _this.$http.get(_this.host_bdd + '/agent/v1/inferior/detail/' + _this.$route.query.id + "/commission").then((rt) => {
                    if (rt.data.code != 200) {
                         _this.$vux.toast.text(rt.error, 'top');
                         return;
                     }
                     if (rt.data.lineChart) {
                         _this.setChartOption("echarts-commission-amount",rt.data.lineChart);
                     }
                 });
            },
            //保单数据
            getPolicyChartData () {
                var _this = this;
                _this.$http.get(_this.host_bdd + '/agent/v1/inferior/detail/' + _this.$route.query.id + "/policy").then((rt) => {
                    if (rt.data.code != 200) {
                         _this.$vux.toast.text(rt.error, 'top');
                         return;
                     }
                     if (rt.data.lineChart) {
                        _this.setChartOption("echarts-policy-count",rt.data.lineChart);
                     }
                 });
            },
            //设置图标数据 , 标签id
            setChartOption (tagId,chartData) {
                // 指定图表的配置项和数据
                var xAxisData = [];//x坐标
                var seriesData = [];//点坐标
                for (var i = 0; i < chartData.length; i++) {
                    xAxisData.push(chartData[i].datetime);
                    seriesData.push(chartData[i].major);
                }

                var element = document.getElementById(tagId);
                element.style.width = (document.body.clientWidth) / 5 * chartData.length  + 'px';
                $('#'+tagId).parent().scrollLeft((parseInt(element.style.width) - parseInt(document.body.clientWidth)));

                //初始化组件并绘制
                var premiumChart = echarts.init(document.getElementById(tagId));
                //配置选项
                var option = {
                    grid :[
                        {
                            left:"0px",
                            right:'0px'
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            data: xAxisData,
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
                                show:false
                            }
                        }
                    ],
                    series: [
                        {
                            type:'line',
                            data:seriesData,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color : '#2c80e9'
                                }
                            }
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                premiumChart.setOption(option);
            }
        }
    }
</script>
