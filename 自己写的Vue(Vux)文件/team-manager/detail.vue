<style scoped>

    /* mainBody */
    .main{
        background-color: #f2f6ff;
    }

    /* 标题 */
    .head-title {
        padding-left: 40px;
        padding-top: 40px;
        line-height: 12px;
        font-size: 12px;
        font-weight: normal;
        background-color: #fff;
    }

    /* 代理人过滤div */
    .agent-filter__hearder{
        overflow: hidden;
        border-bottom: 2px solid #3b97f5;
    }

    /* 代理人过滤头列表 */
    .agent-filter__hearder li{
        float: left;
        padding: 15px 30px;
        line-height: 13px;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        cursor: pointer;
    }

    /* 代理人过滤头选中状态 */
    .agent-filter__header--unselected{
        background-color: #fff;
        color: #435d77;
    }

    /* 代理人过滤头未选中状态 */
    .agent-filter__header--selected{
        background-color: #3b97f5;
        color: #fff;
    }

    .whiteColor{
        background-color: #fff;
    }

    .labels{
        display:block;
        position: relative;
    }

    .left{
        width: 128px;
        text-align: right;
        display: inline-block;
        margin-bottom: 20px;
    }

    .right{
        position: absolute;
        margin-bottom: 20px;
        left: 480px;
        width: 100px;
        text-align: right;
    }
    .left-content{
        display: inline-block;
        text-align: left;
    }

    .right-content{
        position: absolute;
        margin-bottom: 20px;
        left: 580px;
        text-align: left;
    }

    .section-header{
        margin-top: 10px;
        background-color: #fff;
        overflow: hidden;
    }

    .business-overview{
        padding-top: 20px;
        background-color: #fff;
        height: 150px;
        width: 100%;
        text-align: center;
    }

    .business-overview div{
        display: inline-block;
        margin-left: 10px;
        width: 22%;
        background-color: #f2f6ff;
        height: 120px;
        border-radius: 10px;
        text-align: center;
    }

    .business-overview p{
        padding-top:39px;
        padding-bottom: 5px;
        font-size: 25px;
    }

    .business-overview span{
        font-size: 12px;
    }

    .trend-analyse-title{
        font-size: 15px;
        display: inline-block;
        margin-left: 30px;
        padding: 0 5px;
        padding-bottom: 10px;
    }

    .trend-analyse-title--selected{
        border-bottom: 2px solid #3a97f6;
    }

    .trend-analyse-title--unselected{
        border-bottom: 0px;
    }

    .trend-analyse-charts{
        background-color: #fff;
        position: relative;
        height: 360px;
    }

    .trend-analyse-charts-title{
        padding: 20px 0px;
        margin-left: 40px;
    }

    .trend-analyse-charts-title p{
        display: inline-block;
    }

    .trend-analyse-charts-title strong {
        color: red;
    }

    .trend-analyse-chart{
        position: absolute;
        height: 260px;
        left: 40px;
        right: 20px;
        background-color: #e5e5e5;
    }

    .trend-analyse-date-picker{
        margin-top: -5px;
        width: 250px;
        margin-right: 20px;
        display: inline-block;
        float: right;
    }

    /* 表格列表 */
    .detail-table-div{
        padding:0px 20px;
        padding-bottom: 10px;
        background-color: #fff;
    }

    .agent-page{
        text-align: right;
        margin-top:10px;
        margin-right: 20px;
    }

    #echarts-amount-collect {
        width: 100%;
        height: 100%;
    }

    #echarts-amount-team{
        width: 100%;
        height: 100%;
    }

    #echarts-allowance-amount {
        width: 100%;
        height: 100%;
    }


</style>

<template>
<div class="main">
    <div class="whiteColor">
        <breadcrumb :breadcrumb="breadcrumbDetail">
        <Button type="primary" style="float: right;width:80px; height:35px;" @click='handleBack'>返回</Button></Breadcrumb>
    </div>
    <div class="agent-filter__hearder">
        <ul>
            <li :class="(selectIndex == 1) ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="selectIndex = 1">基本资料</li>
            <li style="margin-left:10px;" :class="selectIndex == 2 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="selectIndex = 2">个人统计
            </li>
            <li style="margin-left:10px;" :class="selectIndex == 3 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="selectIndex = 3"
                v-show='!agentDetail.expiredTime && underLevelListData'>团队统计
            </li>
        </ul>
    </div>
    <div class="base" v-show='selectIndex == 1'>
        <div class="whiteColor">
            <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  基本信息</h5>
            <div style="padding-top: 20px;" class="labels">
                <label class="left">代理人名称:     </label>
                <label class="left-content" v-text='agentDetail.name'></label>
                <label class="right">手机号:     </label>
                <label class="right-content" v-text='agentDetail.contactMobile'></label>
            </div>
            <div class="labels">
                <label class="left">直属上级:     </label>
                <label class="left-content" v-text='agentDetail.parentContent'></label>
                <label class="right">添加时间:     </label>
                <label class="right-content" v-text='agentDetail.createTime'></label>
            </div>
            <div class="labels">
                <label class="left">代理人状态:     </label>
                <label class="left-content">{{ agentDetail.state | getAgnetStatus}}</label>
                <label class="right"
                    v-show='agentDetail.expiredTime'
                    v-text='agentDetail.state == 99 ? "退出时间:     " : "移除时间:     "'>
                </label>
                <label class="right-content"
                    v-show='agentDetail.expiredTime'
                    v-text='agentDetail.expiredTime'>
                </label>
            </div>
            <div style="height:55px" v-show='!agentDetail.expiredTime'>
                <Button type="error" style="margin-right: 18px;float: right;width:80px;" @click="handleRemove()">移除</Button>
            </div>
        </div>
        <div class="section-header" v-show='tenantAgentInfo.name'>
            <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  认证信息</h5>
            <div style="display:block;position: relative; padding-top: 20px;" class="labels">
                <label class="left">真实姓名:     </label>
                <label class="left-content" v-text='tenantAgentInfo.name'></label>
                <label class="right">身份证:     </label>
                <label class="right-content" v-text='tenantAgentInfo.identity'></label>
            </div>
            <div style="display:block;position: relative;" class="labels">
                <label class="left">执业证号:     </label>
                <label class="left-content" v-text='tenantAgentInfo.qualification'></label>
                <label class="right">出生日期:     </label>
                <label class="right-content" v-text='tenantAgentInfo.birth'></label>
            </div>
            <div style="display:block;position: relative;" class="labels">
                <label class="left">性别:     </label>
                <label class="left-content" v-text='tenantAgentInfo.gender'></label>
                <label class="right">民族:     </label>
                <label class="right-content" v-text='tenantAgentInfo.nation'></label>
            </div>
            <div style="display:block;position: relative;" class="labels">
                <label class="left">学历:     </label>
                <label class="left-content" v-text='tenantAgentInfo.education'></label>
            </div>
            <div>
                <p class="labels" style="margin-left: 58px;">身份证件:     </p>
                <div style="overflow:hidden;margin-top:-20px;margin-bottom:20px;">
                    <img v-show='imageSrcFront' :src="imageSrcFront" style=" float: left;margin-left:128px;width:400px;">
                    <img v-show='imageSrcBack' :src="imageSrcBack" style="float: left;margin-left:60px;width:400px;">
                </div>
            </div>
        </div>
        <div class="section-header" v-show='!agentDetail.expiredTime && underLevelListData'>
            <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  直属下级</h5>
            <Table style="margin:20px 20px; margin-bottom: 20px;"height="230" border :columns="underLevelListTitles" :data='underLevelListData'></Table>
            <Page :total="totalPage" show-total :current="currentPage" show-elevator style="height:41px ;text-align: right; margin-top:20px;margin-right: 20px;" @on-change="page_size_change"></Page>
        </div>
    </div>

    <div class="business" v-show='selectIndex == 2'>
        <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  业绩概况</h5>
        <div class="business-overview">
            <div>
                <p>{{userStatisticsData.totalPremiumAmount | filterAmount}}</p>
                <span>累计保费金额 (万)</span>
            </div>
            <div>
                <p>{{userStatisticsData.totalPolicyCount | filterAmount}}</p>
                <span>累计保单个数 (个)</span>
            </div>
            <div>
                <p>{{userStatisticsData.totalCommissionAmount | filterAmount}}</p>
                <span>累计佣金收入 (万)</span>
            </div>
            <div>
                <p>{{userStatisticsData.totalAllowanceAmount | filterAmount}}</p>
                <span>累计津贴奖励 (万)</span>
            </div>
        </div>

        <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  趋势分析
            <span class="trend-analyse-title"
            v-for='(item, index) in ["业绩","津贴"]'
            @click='chartSelectIndex = index'
            :class="(chartSelectIndex == index) ? 'trend-analyse-title--selected' : 'trend-analyse-title--unselected'">
            {{item}}
            </span>
        </h5>
        <div class="trend-analyse-charts">
            <div class="trend-analyse-charts-title">
                <Date-picker v-show='chartSelectIndex == 0' class='trend-analyse-date-picker' type="daterange" :options="options" :value='trendDataPickValue' clearable :placeholder="trendDataPickPlaceholder" @on-change='trendSearchTimeChange' placement='left-end'>
                </Date-picker>
                <Date-picker v-show='chartSelectIndex == 1' class='trend-analyse-date-picker' type="year" :value='allowanceDataPickValue' clearable :options='allowanceOptions' :placeholder="allowanceDataPickPlaceholder" @on-change='trendSearchTimeChange' placement='left-end'>
                </Date-picker>
                <div v-if='chartSelectIndex == 0'>
                    <p>累计保费
                    <strong>{{userStatisticsChartsData.minorStatistics[0] | filterAmount}}</strong><span> 元</span>
                    </p>
                    <p>       累计保单
                        <strong>{{userStatisticsChartsData.minorStatistics[2] | filterAmount}}</strong><span> 个</span>
                    </p>
                    <p>       累计佣金收入
                        <strong>{{userStatisticsChartsData.minorStatistics[1] | filterAmount}}</strong><span> 元</span>
                    </p>
                </div>
                <div v-else>
                    <p>累计津贴奖励
                        <strong>{{userAllowanceChartsData.majorStatistics | filterAmount}}</strong><span> 元</span>
                    </p>
                </div>
            </div>
            <div v-if='chartSelectIndex == 0' class="trend-analyse-chart">
                <div id="echarts-amount-collect"></div>
            </div>
            <div v-else class="trend-analyse-chart">
               <div id="echarts-allowance-amount"></div>
            </div>
        </div>

        <div v-if='chartSelectIndex == 0' class="detail-table-div">
            <Table border :columns="statisticsTableTitle" :data="userStatisticsTableData"></Table>
            <Page class="agent-page"
                :total="detailTotalPage" show-total
                :current="detailCurrentPage" show-elevator
                :page-size="detailPageSize"
                @on-change="detail_page_size_change">
            </Page>
        </div>
        <div v-else class="detail-table-div">
            <Table border :columns="allowanceTableTitle" :data="userAllowanceTableData"></Table>
        </div>
    </div>

    <div class="business" v-show='selectIndex == 3'>
        <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  团队统计</h5>
        <div class="business-overview">
            <div>
                <p>{{teamStatisticsData.inferiorCount | filterAmount}}</p>
                <span>团队总人数 (人)</span>
            </div>
            <div>
                <p>{{teamStatisticsData.totalPremiumAmount | filterAmount}}</p>
                <span>累计保费金额 (万)</span>
            </div>
            <div>
                <p>{{teamStatisticsData.totalPolicyCount | filterAmount}}</p>
                <span>累计保单个数 (个)</span>
            </div>
            <div>
                <p>{{teamStatisticsData.totalCommissionAmount | filterAmount}}</p>
                <span>累计佣金收入 (万)</span>
            </div>
        </div>

        <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  趋势分析
            <span class="trend-analyse-title trend-analyse-title--unselected"
            v-for='(item, index) in ["  "]'>
            {{item}}
            </span>
        </h5>
        <div class="trend-analyse-charts">
            <div class="trend-analyse-charts-title">
                <Date-picker class='trend-analyse-date-picker' type="daterange" :options="options" :value='teamDataPickValue'
                 :placeholder="teamDataPickPlaceholder" clearable @on-change='teamSearchTimeChange' placement='left-end'>
                </Date-picker>
                <div>
                    <p>累计保费
                    <strong>{{teamStatisticsChartsData.minorStatistics[0] | filterAmount}}</strong><span> 元</span>
                    </p>
                    <p>       累计保单
                        <strong>{{teamStatisticsChartsData.minorStatistics[2] | filterAmount}}</strong><span> 个</span>
                    </p>
                    <p>       累计佣金收入
                        <strong>{{teamStatisticsChartsData.minorStatistics[1] | filterAmount}}</strong><span> 元</span>
                    </p>
                </div>
            </div>
            <div class="trend-analyse-chart">
                <div id="echarts-amount-team"></div>
            </div>
        </div>

        <div class="detail-table-div">
            <Table border :columns="teamStatisticsTableTitle" :data="teamStatisticsTableData"></Table>
            <Page class="agent-page"
                :total="teamTotalPage" show-total
                :current="teamCurrentPage" show-elevator
                :page-size="teamPageSize"
                @on-change="team_page_size_change">
            </Page>
        </div>
    </div>
</div>
</template>

<script>
    import echarts from 'echarts';
    import Breadcrumb from '@/components/layout/Breadcrumb.vue';

    export default {
        created ()  {

            this.trendDataPickPlaceholder = this.timeFormat(this.options.shortcuts[2].value()[0],"yyyy-MM-dd") +
            " - " + this.timeFormat(this.options.shortcuts[2].value()[1],"yyyy-MM-dd");
            this.allowanceDataPickPlaceholder = new Date().getFullYear() + "";
            this.teamDataPickPlaceholder = this.trendDataPickPlaceholder;

            this.startSearchTime = parseInt(this.options.shortcuts[2].value()[0].getTime() / 1000);
            this.endSearchTime = parseInt(this.options.shortcuts[2].value()[1].getTime() / 1000);

            this.teamStartSearchTime = parseInt(this.options.shortcuts[2].value()[0].getTime() / 1000);
            this.teamEndSearchTime = parseInt(this.options.shortcuts[2].value()[1].getTime() / 1000);
        },
        mounted :function(){
            this.$nextTick(function () {
                if (typeof(this.$route.query.id) != "undefined" && this.$route.query.id.length){
                    this.id = this.$route.query.id;
                    this.getUserDetail();
                    return;
                }
                this.$router.go(-1);
            })
        },
        updated () {
            if (this.selectIndex == 2) {
                this.analyseChartChange(this.chartSelectIndex);
            }else if (this.selectIndex == 3){
                this.analyseChartChange(2);
            }
        },
        watch: {
            selectIndex : function (newValue) {
                if (newValue == 2){
                    this.getUserStatisticsData();
                }else if (newValue == 3){
                    this.getTeamStatisticsData();
                }
            },
            chartSelectIndex : function (newValue) {
                if (newValue) {
                    this.getUserStatisticsChartsData(this.allowanceDataPickValue ? this.allowanceDataPickValue : this.allowanceDataPickPlaceholder);
                    this.getUserAllowanceTableData(this.allowanceDataPickValue ? this.allowanceDataPickValue : this.allowanceDataPickPlaceholder);
                } else {
                    this.getUserStatisticsChartsData();
                    this.getUserStatisticsTableData();
                }
            }
        },
        data () {
            var _this = this;
            return {
                breadcrumbDetail: ['代理人详情'],
                imageSrcFront:"",
                imageSrcBack:"",
                selectIndex : 1,
                chartSelectIndex : 0,
                id:'',
                trendDataPickValue:0,
                trendDataPickPlaceholder : '',
                allowanceDataPickValue:0,
                allowanceDataPickPlaceholder:'',
                teamDataPickValue : 0,
                teamDataPickPlaceholder : '',
                queryConditions:null,
                currentChart:null,
                startSearchTime:0,
                endSearchTime:0,
                teamStartSearchTime:0,
                teamEndSearchTime:0,
                userStatisticsData : "",
                userStatisticsChartsData : {
                    lineChart : '',
                    minorStatistics : ''
                },
                userStatisticsTableData:[],
                userAllowanceChartsData : {
                    lineChart : '',
                    majorStatistics : ''
                },
                userAllowanceTableData:[],
                teamStatisticsData : "",
                teamStatisticsChartsData : {
                    minorStatistics : '',
                    lineChart : ''
                },
                statisticsUpdating:false,
                allowanceUpdating:false,
                teamUpdating:false,
                teamStatisticsTableData:[],
                underLevelListData: [
                    {
                        name:"",
                        contactMobile:"",
                        createTime:""
                    }
                ],
                totalPage:0,
                currentPage:1,
                detailTotalPage : 0,
                detailCurrentPage : 1,
                detailPageSize : 10,
                teamTotalPage : 0,
                teamCurrentPage : 1,
                teamPageSize : 10,
                allowanceOptions : {
                    disabledDate (date) {
                        var year = date.getFullYear();
                        if (year < 2017) {
                            //禁止选
                            return true;
                        }else if (year > new Date().getFullYear()){
                            //禁止选
                            return true;
                        }else {
                            //可选
                            return false;
                        }
                    }
                },
                options: {
                    shortcuts: [
                    {
                        text: '今天',
                        value () {
                            const end = new Date(_this.timeFormat(new Date(),"yyyy/MM/dd 23:59:59"));
                            const start = new Date(_this.timeFormat(new Date(),"yyyy/MM/dd 00:00:00"))
                            return [start, end];
                        }
                    },
                    {
                        text: '昨天',
                        value () {
                            const end = new Date().setTime(new Date(_this.timeFormat(new Date(),"yyyy/MM/dd 23:59:59")).getTime() - 3600 * 24 * 1000);
                            const start = new Date().setTime(new Date(_this.timeFormat(new Date(),"yyyy/MM/dd 00:00:00")).getTime() - 3600 * 24 * 1000);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近一周',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近一月',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近三月',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            return [start, end];
                        }
                    }
                    ]
                },
                tenantAgentInfo:{
                    name:"",
                    identity:"",
                    qualification:""
                },
                agentDetail:{
                    name:"",
                    contactMobile:"",
                    location:"",
                    createTime:"",
                    parentContent:"",
                    expiredTime:"",
                    state:0,
                    parent:{
                        name:""
                    },
                },
                underLevelListTitles: [
                {
                    title: '代理人名称',
                    key: 'name'
                },
                {
                    title: '手机号',
                    key: 'contactMobile'
                },
                {
                    title: '注册时间',
                    key: 'createTime'
                }
                ],
                teamStatisticsTableTitle: [
                    {
                        title: '日期',
                        key: 'createTime',
                        width: 160
                    },
                    {
                        title: '真实姓名',
                        key: 'contact',
                        width: 110
                    },
                    {
                        title: '代理人名称',
                        key: 'tenantName',
                    },
                    {
                        title: '手机号',
                        key: 'contactMobile',
                        width: 140
                    },
                    {
                        title: '保险名称',
                        key: 'desc1',
                        width: 120
                    },
                    {
                        title: '投保人姓名',
                        key: 'desc2',

                    },
                    {
                        title: '保单金额(元)',
                        key: 'deltaAmount',
                        width: 120
                    },
                    {
                        title: '佣金(元)',
                        width: 120,
                        key: 'commission',
                    },
                ],
                statisticsTableTitle: [
                    {
                        title: '时间',
                        key: 'createTime',
                        width: 160
                    },
                    {
                        title: '保险名称',
                        key: 'desc1',
                        width: 120
                    },
                    {
                        title: '投保人姓名',
                        key: 'desc2',

                    },
                    {
                        title: '保单金额(元)',
                        key: 'deltaAmount',
                        width: 120
                    },
                    {
                        title: '佣金(元)',
                        width: 120,
                        key: 'commission',
                    },
                ],
                allowanceTableTitle: [
                    {
                        title: '日期',
                        key: 'createTime',
                    },
                    {
                        title: '收入类型',
                        key: 'desc1',
                    },
                    {
                        title: '收入描述',
                        key: 'desc2',
                    },
                    {
                        title: '金额（元）',
                        key: 'deltaAmount',
                    },
                ]
            }
        },
        methods: {
            getUserDetail :function () {
                var _this = this;
                _this.$get(_this.host_bdd + '/agency/v1/inferior/detail/' + _this.id,
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.agentDetail = rt.data.tenantWithAgentInfo;
                    _this.agentDetail.createTime = _this.timeFormat(new Date(_this.agentDetail.createTime * 1000),"yyyy/MM/dd hh:mm");
                    if (_this.agentDetail.expiredTime){
                        _this.agentDetail.expiredTime = _this.timeFormat(new Date(_this.agentDetail.expiredTime * 1000),"yyyy/MM/dd hh:mm");
                    }

                    if (_this.agentDetail.parent){
                        _this.agentDetail.parentContent = _this.agentDetail.parent.name;
                    }else{
                        _this.agentDetail.parentContent = "";
                    }
                    if (_this.agentDetail.tenantAgentInfo){
                        _this.tenantAgentInfo = _this.agentDetail.tenantAgentInfo;
                        _this.getIdentityImageSrc(_this.agentDetail.tenantAgentInfo);
                    }
                    _this.getUnderLevelListData();
                });
            },
            getUserStatisticsData () {
                var _this = this;
                _this.$get(_this.host_bdd + '/captial/v1/inferior/account/' + _this.id,
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.userStatisticsData = rt.data.catpitalAccount;
                });
                this.getUserStatisticsChartsData();
                this.getUserStatisticsTableData();
            },
            getUserStatisticsChartsData (allowanceYear) {
                var _this = this;
                if (allowanceYear){
                    //津贴
                    _this.$get(_this.host_bdd + '/captial/v1/inferior/allowance/' + _this.id
                        + '/chart?year=' + allowanceYear,
                    function (rt) {
                        if (rt.data.code != 200) {
                            _this.$Message.error(rt.data.error);
                            return;
                        }
                        _this.allowanceUpdating = false;
                        _this.userAllowanceChartsData = rt.data;
                    });
                }else {
                    //保费+保单+佣金
                    _this.$get(_this.host_bdd + '/captial/v1/inferior/kpi/' + _this.id
                        + '/chart?start=' + this.startSearchTime + '&end=' + this.endSearchTime,
                    function (rt) {
                        if (rt.data.code != 200) {
                            _this.$Message.error(rt.data.error);
                            return;
                        }
                        _this.statisticsUpdating = false;
                        _this.userStatisticsChartsData = rt.data;
                    });
                }
            },
            getUserStatisticsTableData () {
                var _this = this;
                _this.$get(_this.host_bdd + '/captial/v1/inferior/kpi/' + _this.id
                    + '/list?start=' + this.startSearchTime + '&end=' + this.endSearchTime
                    + '&pn=' + this.detailCurrentPage + '&ps=' + this.detailPageSize,
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.userStatisticsTableData = rt.data.inoutcomes;
                    if (_this.userStatisticsTableData) {
                        for (var i = 0; i < _this.userStatisticsTableData.length; i++) {
                            _this.userStatisticsTableData[i].createTime =
                            _this.timeFormat(new Date(_this.userStatisticsTableData[i].createTime * 1000),"yyyy/MM/dd hh:mm");
                        }
                        _this.detailTotalPage = rt.data.recordCount;
                    }
                });
            },
            getUserAllowanceTableData (year) {
                var _this = this;
                _this.$get(_this.host_bdd + '/captial/v1/inferior/allowance/' + _this.id
                    + '/list?year=' + year,
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.userAllowanceTableData = rt.data.inoutcomes;
                    if (_this.userAllowanceTableData) {
                        for (var i = 0; i < _this.userAllowanceTableData.length; i++) {
                            _this.userAllowanceTableData[i].createTime =
                            _this.timeFormat(new Date(_this.userAllowanceTableData[i].createTime * 1000),"yyyy/MM/dd hh:mm");
                        }
                    }
                });
            },
            getTeamStatisticsData () {
                var _this = this;
                _this.$get(_this.host_bdd + '/captial/v1/inferior/agent/' + _this.id + '/statistics',
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.teamStatisticsData = rt.data.catpitalAccount;
                });

                this.getTeamStatisticsChartsData();
                this.getTeamStatisticsTableData();
            },
            getTeamStatisticsChartsData () {
                //保费+保单+佣金
                var _this = this;
                _this.$get(_this.host_bdd + '/captial/v1/inferior/agent/kpi/' + _this.id
                    + '/chart?start=' + this.teamStartSearchTime + '&end=' + this.teamEndSearchTime,
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.teamUpdating = false;
                    _this.teamStatisticsChartsData = rt.data;
                });
            },
            getTeamStatisticsTableData () {
                 var _this = this;
                _this.$get(_this.host_bdd + '/captial/v1/inferior/agent/kpi/' + _this.id
                    + '/list?start=' + this.teamStartSearchTime + '&end=' + this.teamEndSearchTime
                    + '&pn=' + this.teamCurrentPage + '&ps=' + this.teamPageSize,
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.teamStatisticsTableData = rt.data.inoutcomes;
                    if (_this.teamStatisticsTableData) {
                        for (var i = 0; i < _this.teamStatisticsTableData.length; i++) {
                            _this.teamStatisticsTableData[i].createTime =
                            _this.timeFormat(new Date(_this.teamStatisticsTableData[i].createTime * 1000),"yyyy/MM/dd hh:mm");
                            _this.teamStatisticsTableData[i].tenantName = _this.teamStatisticsTableData[i].tenant.name;
                            _this.teamStatisticsTableData[i].contact = _this.teamStatisticsTableData[i].tenant.contact;
                            _this.teamStatisticsTableData[i].contactMobile = _this.teamStatisticsTableData[i].tenant.contactMobile;
                        }
                        _this.teamTotalPage = rt.data.recordCount;
                    }
                });
            },
            getUnderLevelListData : function () {
                var _this = this;
                _this.$http.get(_this.host_bdd + '/agency/v1/inferior/find', {
                        params: {
                          option: "1",
                          pn:_this.currentPage,
                          ps:"10",
                          superiorId:_this.id
                      }
                  })
                .then(function (response) {
                    if (response.data.code != 200) {
                        _this.$Message.error(response.data.error);
                        return;
                    }
                    _this.underLevelListData = response.data.tenantsWithParent;
                    if (_this.underLevelListData){
                        for (var i = 0; i < _this.underLevelListData.length; i++) {
                            _this.underLevelListData[i].createTime = _this.timeFormat(new Date(_this.underLevelListData[i].createTime * 1000),"yyyy/MM/dd hh:mm");
                        }
                    }
                    _this.totalPage = response.data.recordCount;
                });
            },
            getIdentityImageSrc : function (tenantAgentInfo){
                var _this = this;
                _this.$getImageUrlFromOSS(tenantAgentInfo.frontPath,function (rt){
                    if (rt){
                        _this.imageSrcFront = rt;
                    }
                });
                _this.$getImageUrlFromOSS(tenantAgentInfo.backPath,function (rt){
                    if (rt){
                        _this.imageSrcBack = rt;
                    }
                });
            },
            trendSearchTimeChange :function (results) {
                if (!this.chartSelectIndex) {
                    //佣金+保单+保费
                    if (typeof(results[0] === 'string') && typeof(results[1] === 'string') && results[0].length && results[1].length){
                        //选择年份
                        var arr = results[1].split('-');
                        arr[2] = parseInt(arr[2]) + 1;
                        this.startSearchTime = parseInt(new Date(results[0]).getTime() / 1000);
                        this.endSearchTime = parseInt(new Date(arr.join('-')).getTime() / 1000);
                    }else{
                        //默认年份
                        this.startSearchTime = parseInt(this.options.shortcuts[2].value()[0].getTime() / 1000);
                        this.endSearchTime = parseInt(this.options.shortcuts[2].value()[1].getTime() / 1000);
                    }
                    this.getUserStatisticsChartsData();
                    this.getUserStatisticsTableData();
                }else{
                    //津贴
                    if(results){
                        //选择年份
                        this.getUserStatisticsChartsData(results);
                        this.getUserAllowanceTableData(results);
                    }else{
                        //默认年份
                        this.getUserStatisticsChartsData(this.allowanceDataPickPlaceholder);
                        this.getUserAllowanceTableData(this.allowanceDataPickPlaceholder);
                    }

                }
            },
            teamSearchTimeChange :function (results) {
                if (typeof(results[0] === 'string') && typeof(results[1] === 'string') && results[0].length && results[1].length){
                    var arr = results[1].split('-');
                    arr[2] = parseInt(arr[2]) + 1;
                    this.teamStartSearchTime = parseInt(new Date(results[0]).getTime() / 1000);
                    this.teamEndSearchTime = parseInt(new Date(arr.join('-')).getTime() / 1000);
                }else{
                    this.teamStartSearchTime = parseInt(this.options.shortcuts[2].value()[0].getTime() / 1000);
                    this.teamEndSearchTime = parseInt(this.options.shortcuts[2].value()[1].getTime() / 1000);
                }
                this.getTeamStatisticsChartsData();
                this.getTeamStatisticsTableData();
            },
            analyseChartChange (index) {
                var chartId = "";
                var chartOption = null;
                if (this.echarts) this.echarts.dispose();
                switch (index) {
                    case 0 ://佣金+保费+保单
                    {
                        if (!this.userStatisticsChartsData.lineChart.length || this.statisticsUpdating) return;
                        this.statisticsUpdating = true;
                        chartId = "echarts-amount-collect";
                        var xAxisData = [];//月份
                        var premiumSeriesData = [];//保费数据
                        var policySeriesData = [];//保单个数据
                        var commissionSeriesData = [];//佣金数据
                        for (var i = 0; i < this.userStatisticsChartsData.lineChart.length; i++) {
                            var lineChart = this.userStatisticsChartsData.lineChart[i];
                            xAxisData.push(lineChart.datetime);
                            premiumSeriesData.push(lineChart.minor[0]);
                            commissionSeriesData .push(lineChart.minor[1]);
                            policySeriesData .push(lineChart.minor[2]);
                        }
                        chartOption = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross',
                                    crossStyle: {
                                        color: '#999'
                                    }
                                }
                            },
                            grid :[
                                {
                                    left:"70px",
                                    right:'70px'
                                }
                            ],
                            legend: {
                                data:['保费','佣金','保单']
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: xAxisData,
                                    offset:10
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '金额(元)',
                                    splitLine: {
                                        show: false
                                    },
                                },
                                {
                                    type: 'value',
                                    name: '保单(个)',
                                    splitLine: {
                                        show: false
                                    },
                                }
                            ],
                            series: [
                                {
                                    name:'保费',
                                    type:'bar',
                                    data:premiumSeriesData,
                                    label: {
                                        normal: {
                                            show: xAxisData.length > 14 ? false : true,
                                            position: 'insideTop'
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color : '#ff8a00'
                                        }
                                    },
                                },
                                {
                                    name:'佣金',
                                    type:'bar',
                                    data:commissionSeriesData,
                                    label: {
                                        normal: {
                                            show: xAxisData.length > 14 ? false : true,
                                            position: 'insideTop'
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color : '#2c80e9'
                                        }
                                    },
                                    barGap:'-100%'
                                },
                                {
                                    name:'保单',
                                    type:'line',
                                    yAxisIndex: 1,
                                    data:policySeriesData,
                                    label: {
                                        normal: {
                                            show: xAxisData.length > 14 ? false : true,
                                            position: 'top'
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color : 'red'
                                        }
                                    }
                                }
                            ]
                        };
                        break;
                    }
                    case 1 ://津贴
                    {
                        if (!this.userAllowanceChartsData.lineChart.length || this.allowanceUpdating) return;
                        this.allowanceUpdating = true;
                        chartId = "echarts-allowance-amount";
                        var xAxisData = [];//月份
                        var allowanceSeriesData = [];//保费数据
                        for (var i = 0; i < this.userAllowanceChartsData.lineChart.length; i++) {
                            var lineChart = this.userAllowanceChartsData.lineChart[i];
                            xAxisData.push(lineChart.datetime);
                            allowanceSeriesData.push(lineChart.major);
                        }
                        chartOption = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross',
                                    crossStyle: {
                                        color: '#999'
                                    }
                                }
                            },
                            legend: {
                                data:['津贴']
                            },
                            grid :[
                                {
                                    left:"70px",
                                    right:'70px'
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
                                    type: 'value',
                                    name: '金额(元)',
                                    splitLine: {
                                        show: false
                                    },
                                }
                            ],
                            series: [
                                {
                                    name:'津贴',
                                    type:'line',
                                    data:allowanceSeriesData,
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top'
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color : '#ff8a00'
                                        }
                                    },
                                }
                            ]
                        };
                        break;
                    }
                    //团队统计
                    case 2 : {
                        if (!this.teamStatisticsChartsData.lineChart || this.teamUpdating) return;
                        this.teamUpdating = true;
                        chartId = "echarts-amount-team";
                        var xAxisData = [];//月份
                        var premiumSeriesData = [];//保费数据
                        var policySeriesData = [];//保单个数据
                        var commissionSeriesData = [];//佣金数据
                        for (var i = 0; i < this.teamStatisticsChartsData.lineChart.length; i++) {
                            var lineChart = this.teamStatisticsChartsData.lineChart[i];
                            xAxisData.push(lineChart.datetime);
                            premiumSeriesData.push(lineChart.minor[0]);
                            commissionSeriesData .push(lineChart.minor[1]);
                            policySeriesData .push(lineChart.minor[2]);
                        }
                        chartOption = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross',
                                    crossStyle: {
                                        color: '#999'
                                    }
                                }
                            },
                            grid :[
                                {
                                    left:"70px",
                                    right:'70px'
                                }
                            ],
                            legend: {
                                data:['保费','佣金','保单']
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: xAxisData,
                                    offset:10
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '金额(元)',
                                    splitLine: {
                                        show: false
                                    },
                                },
                                {
                                    type: 'value',
                                    name: '保单(个)',
                                    splitLine: {
                                        show: false
                                    },
                                }
                            ],
                            series: [
                                {
                                    name:'保费',
                                    type:'bar',
                                    data:premiumSeriesData,
                                    label: {
                                        normal: {
                                            show: xAxisData.length > 14 ? false : true,
                                            position: 'insideTop'
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color : '#ff8a00'
                                        }
                                    },
                                },
                                {
                                    name:'佣金',
                                    type:'bar',
                                    data:commissionSeriesData,
                                    label: {
                                        normal: {
                                            show: xAxisData.length > 14 ? false : true,
                                            position: 'insideTop'
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color : '#2c80e9'
                                        }
                                    },
                                    barGap:'-100%'
                                },
                                {
                                    name:'保单',
                                    type:'line',
                                    yAxisIndex: 1,
                                    data:policySeriesData,
                                    label: {
                                        normal: {
                                            show: xAxisData.length > 14 ? false : true,
                                            position: 'top'
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color : 'red'
                                        }
                                    }
                                }
                            ]
                        };
                        break;
                    }
                }
                var oldChart = echarts.getInstanceByDom(document.getElementById(chartId));
                if (oldChart) {
                    oldChart.dispose();
                }
                 this.currentChart = echarts.init(document.getElementById(chartId));
                 this.currentChart.setOption(chartOption);
            },
            handleRemove :function () {
                var _this = this;
                _this.$Modal.confirm({
                    title: '温馨提示',
                    content: '从团队移除后，将失去所有使用权限，<br/> 确定移除吗？',
                    onOk: () => {
                        _this.$post(_this.host_bdd + '/agency/v1/inferior/remove', {
                            inferiorId: _this.id
                        }, function (rt) {
                         if (rt.data.code != 200) {
                            _this.$Message.error(rt.data.error);
                            return;
                        }
                        _this.$Message.success('移除成功!');
                        _this.$router.push({ path: '/team-manager/list' });
                    });
                    }
                });
            },
            handleBack : function () {
                this.$router.go(-1);
            },
            page_size_change :function (index) {
                this.currentPage = index;
                this.getUnderLevelListData();
            },
            detail_page_size_change :function (index) {
                this.detailCurrentPage = index;
                this.getUserStatisticsTableData();
            },
            team_page_size_change :function (index) {
                this.teamCurrentPage = index;
                this.getTeamStatisticsTableData();
            },
            getProductCategory : function (category) {
                switch (category){
                    case 1 :
                    {
                        return "车险";
                    }
                    case 2:
                    {
                        return "意外险";
                    }
                    case 3 :
                    {
                        return "健康险";
                    }
                    case 4 :
                    {
                        return "旅行险";
                    }
                    case 5 :
                    {
                        return "人寿险";
                    }
                    case 6 :
                    {
                        return "财产险";
                    }
                }
            }

        },
        filters: {
            getAgnetStatus : function (status){
                switch (status){
                    case 1 :
                    {
                        return "代理中";
                    }
                    case 10 :
                    {
                        return "待完善";
                    }
                    case 11 :
                    {
                        return "待审核";
                    }
                    case 11 :
                    {
                        return "未通过";
                    }
                    case 90 :
                    {
                        return "已移除";
                    }
                    case 91 :
                    {
                        return "已移除";
                    }
                    case 99 :
                    {
                        return "已退出";
                    }
                }
            },
            filterAmount (amount) {
                if (amount > 0) return amount;
                return "0.00";
            }
        },
        components: {
            Breadcrumb
        },
    }
</script>
