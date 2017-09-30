<style scoped>
    .main-body{
        background-color: #fff;
        margin-top: 10px;
    }

    .echarts-box{
        margin-top: 10px;
        width: 100%;
        height: 170px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .echarts-header {
       display: block;
       border-bottom: 1px solid #e5e5e5;
       padding-top: 10px;
       padding-left: 10px;
       padding-bottom: 10px;
    }

    .echarts-box > div {
        height: 100%;
    }

</style>

<template>
    <div class="main-body">
        <span class="echarts-header">{{ chartTitle }}</span>
        <div class="echarts-box">
             <div id="allowance" v-if='chartId=="allowance"'>

             </div>
             <div id="income" v-if='chartId=="income"'>

             </div>
             <div id="commission" v-if='chartId=="commission"'>

             </div>
        </div>
    </div>
</template>

<script>

import echarts from 'echarts';
import $ from 'zepto';

    export default {

        data () {
            return {
                alreadyShow : false,
                premiumChart : null
            }
        },

        beforeDestroy () {
            if (this.premiumChart.dispose) {
                this.premiumChart.dispose();
            }
        },

        components: {

        },

        props: {
            chartId : null,
            chartOption : null,
            chartWidth : null,
            chartTitle : null
        },

        watch:{
            chartOption : {
                handler: function (item) {
                    if (item && this.chartWidth && !this.alreadyShow){
                        this.alreadyShow = true;
                        this.setChartOption(item,this.chartWidth);
                    }
                }
            },
            chartWidth : {
                handler: function (item){
                    if (this.chartOption && item && !this.alreadyShow){
                        this.alreadyShow = true;
                        this.setChartOption(this.chartOption,item);
                    }
                }
            }
        },

        methods : {
            //设置图标数据 , 标签id
            setChartOption (chartOption,width) {
                var chartDiv = document.getElementById(this.chartId);
                chartDiv.style.width = width;
                $('#' + this.chartId).parent().scrollLeft((parseInt(chartDiv.style.width) - parseInt(document.body.clientWidth)));
                //初始化组件并绘制
                this.premiumChart = echarts.init(chartDiv);
                // 使用刚指定的配置项和数据显示图表。
                this.premiumChart.setOption(chartOption);
            }
        }
    }
</script>