<style lang='scss' scoped>
    /* mainBody */
    .main{
        height: 100%;
        background-color: #fff;
    }

    /* 代理人过滤div */
    .agent-filter__hearder{
        overflow: hidden;
        border-bottom: 2px solid #3b97f5;
        background-color: #f2f6ff;
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

    .agent-filter__hearder li:first-child{
        margin-left: 0px;
    }

    /* 代理人过滤头选中状态 */
    .agent-filter__header--unselected{
        margin-left: 10px;
        background-color: #fff;
        color: #435d77;
    }

    /* 代理人过滤头未选中状态 */
    .agent-filter__header--selected{
        margin-left: 10px;
        background-color: #3b97f5;
        color: #fff;
    }

    .agent-filter__footer{
        background-color: #fff;
        height:136px;
        position:relative;
    }

    /* 搜索联系人块 */
    .agent-filter__search{
        background-color: #f2f6ff;
        left: 20px;
        right: 20px;
        top: 20px;
        bottom: 20px;
        border: 2px solid #e5eef7;
        position: absolute;
    }

    .search-input{
        width: 200px;
        margin-left: 20px;
        display: inline-block;
        margin-top: 30px;
    }

    .search-date-picker{
        width: 250px;
        margin-left: 20px;
        display: inline-block;
        margin-top: 30px;
        position:absolute;
    }


    .search-button-reset{
         background-color: #16ce79 ;
         margin-top: 28.5px ;
         border:1px solid #16ce79;
         float:right;
         margin-right: 20px;
         width:80px;
         height:35px;
    }

    .search-button-find{
        margin-right: 20px;
        margin-top: 28.5px;
        float: right;
        width:80px;
        height:35px;
    }

    .agent-table-div{
        padding:0px 20px;
        padding-bottom: 10px;
        background-color: #fff;
    }

    .agent-page{
        text-align: right;
        margin-top:10px;
        margin-right: 20px;
    }

    /* 日期选择器宽度设置 */
    .ivu-date-picker{
        width: 200px;
    }

    .model-header{
        color:#3b97f5;
        text-align:left;
    }

    .model-content{
        font-size: 12px;
        position: relative;
        height: 25rem;
        overflow-y: auto;
    }

    .model-content div {
        margin: 5px 0px;
    }

    .model-content-image{
        float: left;
        margin-left:75px;
        width:360px;
        height:250px;
    }

    .model-content-comment{
        text-align: left;
    }

    .model-content-title{
        display: inline-block;
        text-align: left;
    }

    .model-content-div-left{
        display: inline-block;
    }

    .model-content-div-left label {
        margin-left: 10px;
    }

    .model-content-div-right{
        display: inline-block;
        position: absolute;
        left: 400px;
    }

    .model-content-div-right label {
        margin-left: 10px;
    }

    .outcome-table-div {
        padding-top: 10px;
        width: calc(100% - 20px);
    }
</style>

<template>
    <div class="main">

        <div style="background-color: #fff">
            <breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
        </div>

        <div class="agent-filter">
            <div class="agent-filter__hearder">
                <ul>
                    <li :class="(selectIndex == 1) ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showPendingReview">待审核</li>
                    <li :class="selectIndex == 2 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showApplyPass">提现成功
                    </li>
                    <li :class="selectIndex == 90 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showApplyNotPass">未通过
                    </li>
                </ul>
            </div>
            <div class="agent-filter__footer">
                <div class="agent-filter__search" >
                    <Input class='search-input' placeholder="代理人名称、手机号" v-model="searchText"
                    @on-enter="search_agent"></Input>
                    <Date-picker class='search-date-picker' type="daterange" :options="options" :value='dataPickValue' :placeholder="datePlaceholder" @on-change='searchTimeChange'></Date-picker>
                    <Button class='search-button-reset' type="info" @click='resetButtonClick'>重置</Button>
                    <Button type="primary" class='search-button-find' @click='findButtonClick'>查询</Button>
                </div>
            </div>
        </div>

        <div class="agent-table-div">
            <Table class='agent-table' :height="tableHeight" border :columns="listTitles" :data="currentData"></Table>
            <Page class='agent-page'  :total="totalPage" show-total :current="currentPage" :page-size="pageSize" show-elevator @on-change="page_size_change"></Page>
        </div>

        <Modal v-model="showReview" width="1000">
            <p slot="header" class="model-header">
                <Icon type="information-circled"></Icon>
                <span class="model-header">提现申请审核</span>
            </p>
            <div class="model-content">
                <div class="model-content-div-left">
                    <label class="model-content-title">申请时间:</label>
                    <label v-text='userCertifyInfo.createTime'></label>
                </div>
                <div class="model-content-div-right">
                    <label class="model-content-title">申请代理人:</label>
                    <label v-text='userCertifyInfo.contact'></label>
                </div>
                <br>
                <div class="model-content-div-left">
                    <label class="model-content-title">联系电话:</label>
                    <label v-text='userCertifyInfo.contactMobile'></label>
                </div>
                <div class="model-content-div-right">
                    <label class="model-content-title">提现金额 (元):</label>
                    <label v-text='userCertifyInfo.amount'></label>
                </div>
                <br>
                <div class="model-content-div-left">
                    <label class="model-content-title">手续费 (元):</label>
                    <label v-text='userCertifyInfo.serviceCharge'></label>
                </div>
                <div class="model-content-div-right">
                    <label class="model-content-title">本月提现次数:</label>
                    <label v-text='userCertifyInfo.outcomeCount'></label>
                </div>
                <br>
                <div class="model-content-div-left">
                    <label class="model-content-title">提现账户:</label>
                    <label >微信钱包</label>
                </div>
                <div class="model-content-div-right">
                    <label class="model-content-title">微信城市:</label>
                    <label v-text='userCertifyInfo.city'></label>
                </div>
                <br>
                <div class="model-content-div-left">
                    <label class="model-content-title">微信昵称:</label>
                    <label v-text='userCertifyInfo.nickName'></label>
                </div>
                <div class="model-content-div-right">
                    <label class="model-content-title">微信性别:</label>
                    <label v-text='userCertifyInfo.sex'></label>
                </div>
                <br>
                <div class="model-content-div-left">
                    <label class="model-content-title">身份证号:</label>
                    <label v-text='userCertifyInfo.agentInfo.identity'></label>
                </div>
                <div class="model-content-div-right">
                    <label class="model-content-title">民族:</label>
                    <label v-text='userCertifyInfo.agentInfo.nation'></label>
                </div>
                <br>
                <div class="model-content-div-left">
                    <label class="model-content-title">出生日期:</label>
                    <label v-text='userCertifyInfo.agentInfo.birth'></label>
                </div>
                <div class="model-content-div-right">
                    <label class="model-content-title">学历:</label>
                    <label v-text='userCertifyInfo.agentInfo.education'></label>
                </div>
                <br>
                <div class="model-content-div-left">
                    <label class="model-content-title">性别:</label>
                    <label v-text='userCertifyInfo.agentInfo.gender'></label>
                </div>
                <div class="model-content-div-right">
                    <label class="model-content-title">执业证号:</label>
                    <label v-text='userCertifyInfo.agentInfo.qualification'></label>
                </div>
                <div>
                    <label class="model-content-title">  身份证照:</label>
                    <div style="overflow:hidden;">
                        <img v-show='imageSrcFront' :src="imageSrcFront" class="model-content-image">
                        <img v-show='imageSrcBack' :src="imageSrcBack" class="model-content-image">
                    </div>
                </div>
                <div class="outcome-table-div">
                    <label class="model-content-title">  本月历次提现记录:</label>
                    <div>
                        <Table height="250" border
                        :columns="outcomeTableTitle"
                        :data="outcomeTableData">
                        </Table>
                    </div>
                </div>
                <div>
                    <label class="model-content-title">  是否通过:</label>
                    <Radio-group v-model="auditResults" @on-change='auditRadioChange'>
                        <Radio label="审核通过" ></Radio>
                        <Radio label="审核不通过"></Radio>
                        <Radio label="金额出现问题,请联系开发" ></Radio>
                    </Radio-group>
                </div>
                <div>
                    <Form ref="inforModel" style="padding-right: 10px" v-show="auditResults" :model="inforModel" :rules='rulesModel'>
                        <Form-item  prop="reviewRemark" v-show="auditResults == '审核通过'">
                            <Input v-model="inforModel.adoptRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="审核备注" :maxlength='maxlength'></Input>
                        </Form-item>
                        <Form-item  prop="failRemark" v-show="auditResults == '审核不通过'">
                            <Input v-model="inforModel.failRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写审核不通过的原因" :maxlength='maxlength'></Input>
                        </Form-item>
                    </Form>
                </div>
            </div>
            <div slot="footer">
                <Button type="success" size="default" @click="handleSure('inforModel')" :loading="loading">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

    import $ from 'jquery';
    import Breadcrumb from '@/components/layout/Breadcrumb.vue';

    export default {
        data () {
            var _this = this;
            return {
                breadcrumb: ['提现申请'],
                datePlaceholder:"申请时间",
                currentPage:1,
                pageSize:10,
                totalPage:0,
                tableHeight:'',
                searchText:"",
                selectIndex:1,
                queryConditions:null,
                startSearchTime:0,
                endSearchTime:0,
                currentData:[],
                dataPickValue:0,
                maxlength:50,
                showReview:false,
                loading: false,
                auditUserId:"",
                auditResults:"",
                inforModel:{
                    adoptRemark : "",
                    failRemark : ""
                },
                rulesModel:{
                    adoptRemark: [
                        {required: false},
                    ],
                    failRemark: [
                        {required: true, message: '请填写审核不通过的原因', trigger: 'blur'},
                        { type: 'string', message: '请填写审核不通过的原因', pattern:/.{1}/ ,trigger: 'blur' }
                    ]
                },
                userCertifyInfo:{
                    agentInfo : {

                    }
                },
                imageSrcFront:"",
                imageSrcBack:"",
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
                listTitles: [
                    {
                        title: '申请时间',
                        key: 'createTime',
                        width: 140
                    },
                    {
                        title: '申请代理人',
                        key: 'contact'
                    },
                    {
                        title: '提现金额（元）',
                        key: 'amount',
                    },
                    {
                        title: '手续费（元）',
                        key: 'serviceCharge',
                    },
                    {
                        title: '本月提现次数',
                        key: 'outcomeCount',
                        width: 120
                    },
                    {
                        title: '提现账户',
                        key: 'applyLocation',
                        width: 120
                    },
                    {
                        title: '审核状态',
                        width: 120,
                        align: 'center',
                        key: 'state',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    nativeOn: {
                                        click: function () {
                                            let bh = $(document).height();
                                            let ch = $('.ivu-modal-content').outerHeight();
                                            $('.ivu-modal').css('top', (bh - ch) / 2);
                                        }
                                    },
                                    on: {
                                        click: () => {
                                            this.showReview = true;
                                            this.clearUserInforModel();
                                            $('.model-content').animate({scrollTop:0},"slow");
                                            $('.ivu-table-body').animate({scrollTop:0},"slow");
                                            this.auditResults = '';
                                            this.inforModel.reviewRemark = "";
                                            this.getUserCertifyInfo(this.currentData[params.index].id)
                                        }
                                    }
                                }, '审核')
                                ]);
                        }
                    }
                ],
                outcomeTableTitle : [
                    {
                        title: '申请时间',
                        key: 'createTime',
                        width: 140
                    },
                    {
                        title: '提现金额（元）',
                        key: 'amount'
                    },
                    {
                        title: '手续费（元）',
                        key: 'serviceCharge'
                    },
                    {
                        title: '本月提现次数',
                        key: 'outcomeCount'
                    },
                    {
                        title: '提现账户',
                        key: 'applyLocation',
                        width: 120
                    },
                    {
                        title: '审核状态',
                        width: 120,
                        key: 'state',
                    }
                ],
                outcomeTableData: [],
            }
        },
        mounted :function(){
            this.getDataList();
        },

        updated () {
            let bh = $('.breadcrumb').outerHeight();
            let ah = $('.agent-filter').outerHeight();
            let ap = $('.agent-page').outerHeight();
            let rh = $('.js_frame_right').outerHeight();
            let leftHeight = rh - bh - ah - ap - 20;
            let tb = $('.ivu-table-tbody').outerHeight() + $('.ivu-table-header').outerHeight();
            if (tb > 0 && tb < leftHeight) {
                if ( tb < 90 ) tb = 90;
                this.tableHeight = tb;
                return;
            }
             this.tableHeight = leftHeight;
        },

        components: {
            Breadcrumb
        },

        methods :{
            getDataList : function (){
                var _this = this;
                _this.$http.get(_this.host_bdd + '/outcomeApply/v1/find', {
                    params: {
                      option: _this.selectIndex,
                      q:_this.queryConditions,
                      pn:_this.currentPage,
                      ps:_this.pageSize
                  }
              })
                .then(function (response) {
                    if (response.data.code != 200) {
                        _this.$Message.error(response.data.error);
                        return;
                    }
                    _this.currentData = response.data.outcomeApplies;
                    _this.totalPage = response.data.recordCount;
                    if (_this.currentData) {
                        for (var i = 0; i < _this.currentData.length; i++) {
                            _this.currentData[i].createTime = _this.timeFormat(new Date(_this.currentData[i].createTime * 1000),"yyyy/MM/dd hh:mm");
                            _this.currentData[i].state = _this.getApplyState(_this.currentData[i].state);
                            _this.currentData[i].applyLocation = "微信钱包";

                            var className = "current-list-table-state-default"
                            if (_this.currentData[i].state == '未通过') {
                                className = "current-list-table-state-red"
                            }else if (_this.currentData[i].state == '提现成功'){
                                className = "current-list-table-state-green"
                            }
                            _this.currentData[i].cellClassName = {
                                state: className,
                            }
                        }
                        setTimeout(function () {
                            var defaultCell = $('.current-list-table-state-default');
                            for (var i = 0; i < defaultCell.length; i++) {
                                defaultCell[i].style.color = '#495060';
                            }
                            var redCell = $('.current-list-table-state-red');
                            for (var i = 0; i < redCell.length; i++) {
                                redCell[i].style.color = 'red';
                            }
                            var greenCell = $('.current-list-table-state-green');
                            for (var i = 0; i < greenCell.length; i++) {
                                greenCell[i].style.color = 'green';
                            }
                        }, 50);
                    }
                })
            },
            getUserCertifyInfo : function (inferiorId) {
                var _this = this;
                _this.$get(_this.host_bdd + '/outcomeApply/v1/' + inferiorId + "/detail",
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.auditUserId = inferiorId;
                    _this.userCertifyInfo = rt.data.outcomeAppliyDetail;
                    if (_this.userCertifyInfo){
                        _this.userCertifyInfo.createTime = _this.timeFormat(new Date(_this.userCertifyInfo.createTime * 1000),"yyyy/MM/dd hh:mm");
                        _this.getIdentityImageSrc(_this.userCertifyInfo.agentInfo);
                        _this.outcomeTableData = _this.userCertifyInfo.applies;
                        for (var i = 0; i < _this.outcomeTableData.length; i++) {
                            _this.outcomeTableData[i].createTime = _this.timeFormat(new Date(_this.outcomeTableData[i].createTime * 1000),"yyyy/MM/dd hh:mm");
                            _this.outcomeTableData[i].state = _this.getApplyState(_this.outcomeTableData[i].state);
                            _this.outcomeTableData[i].applyLocation = "微信钱包";
                            var className = "outcome-table-state-default"
                            if (_this.outcomeTableData[i].state == '未通过') {
                                className = "outcome-table-state-red"
                            }else if (_this.outcomeTableData[i].state == '提现成功'){
                                className = "outcome-table-state-green"
                            }
                            _this.outcomeTableData[i].cellClassName = {
                                state: className,
                            }
                        }
                        setTimeout(function () {
                            var defaultCell = $('.outcome-table-state-default');
                            for (var i = 0; i < defaultCell.length; i++) {
                                defaultCell[i].style.color = '#495060';
                            }
                            var redCell = $('.outcome-table-state-red');
                            for (var i = 0; i < redCell.length; i++) {
                                redCell[i].style.color = 'red';
                            }
                            var greenCell = $('.outcome-table-state-green');
                            for (var i = 0; i < greenCell.length; i++) {
                                greenCell[i].style.color = 'green';
                            }
                        }, 50);
                    }
                });
            },
            getIdentityImageSrc : function (info){
                var _this = this;
                _this.$getImageUrlFromOSS(info.frontPath,function (rt){
                    if (rt){
                        _this.imageSrcFront = rt;
                    }
                });
                _this.$getImageUrlFromOSS(info.backPath,function (rt){
                    if (rt){
                        _this.imageSrcBack = rt;
                    }
                });
            },
            showPendingReview : function () {
                if (this.selectIndex == 1) {return;}
                this.selectIndex = 1;
                this.currentData = [];
                this.listTitles[this.listTitles.length - 1].title = '操作';
                this.listTitles[this.listTitles.length - 1].key = 'action';
                this.listTitles[this.listTitles.length - 1].render = (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            nativeOn: {
                                    click: function () {
                                        let bh = $(document).height();
                                        let ch = $('.ivu-modal-content').outerHeight();
                                        $('.ivu-modal').css('top', (bh - ch) / 2);
                                    }
                                },
                            on: {
                                click: () => {
                                    this.showReview = true;
                                    this.clearUserInforModel();
                                    $('.model-content').animate({scrollTop:0},"slow");
                                    $('.ivu-table-body').animate({scrollTop:0},"slow");
                                    this.auditResults = '';
                                    this.inforModel.reviewRemark = "";
                                    this.getUserCertifyInfo(this.currentData[params.index].id)
                                }
                            }
                        }, '审核')
                        ]);
                }
                this.search_agent();
            },
            getApplyState (state) {
                switch (state){
                    case 1 :
                    {
                        return "未审核";
                    }
                    case 2:
                    {
                        return "提现成功";
                    }
                    case 90 :
                    {
                        return "未通过";
                    }
                }
            },
            showApplyPass : function () {
                if (this.selectIndex == 2) {return;}
                this.selectIndex = 2;
                this.currentData = [];
                this.listTitles[this.listTitles.length - 1].title = '备注';
                this.listTitles[this.listTitles.length - 1].key = 'comment';
                this.listTitles[this.listTitles.length - 1].render = null;
                this.search_agent();
            },
            showApplyNotPass : function () {
                if (this.selectIndex == 90) {return;}
                this.selectIndex = 90;
                this.currentData = [];
                this.listTitles[this.listTitles.length - 1].title = '备注';
                this.listTitles[this.listTitles.length - 1].key = 'comment';
                this.listTitles[this.listTitles.length - 1].render = null;
                this.search_agent();
            },
            searchTimeChange :function (results) {
                if (typeof(results[0] === 'string') && typeof(results[1] === 'string') && results[0].length && results[1].length){
                    var arr = results[1].split('-');
                    arr[2] = parseInt(arr[2]) + 1;
                    this.startSearchTime = new Date(results[0]).getTime() / 1000;
                    this.endSearchTime = new Date(arr.join('-')).getTime() / 1000;
                }else{
                    this.startSearchTime = null;
                    this.endSearchTime = null;
                }
            },
            findButtonClick : function () {
                this.search_agent();
            },
            resetButtonClick : function () {
                if (this.dataPickValue == 0){
                    this.dataPickValue = null;
                }else{
                    this.dataPickValue = 0;
                }
                this.searchText = null;
                this.queryConditions = null;
            },
            search_agent :function () {
                this.currentPage = 1;
                var jsonObject = {
                    "createTime_ge" : this.startSearchTime ? this.startSearchTime : null,
                    "createTime_le" : this.endSearchTime ? this.endSearchTime : null,
                    "contact,contactMobile,nickName_like" : this.searchText ? this.searchText : null
                };
                this.queryConditions = JSON.stringify(jsonObject);
                this.getDataList();
            },
            auditRadioChange : function () {
                this.inforModel.adoptRemark = "";
                this.inforModel.failRemark = "";
                $('.model-content').animate({scrollTop:$('.model-content')[0].scrollHeight},"slow");
            },
            page_size_change :function (index) {
                this.currentPage = index;
                this.getDataList();
            },
            clearUserInforModel () {
                this.userCertifyInfo = {agentInfo : {}};
                this.imageSrcFront = null;
                this.imageSrcBack = null;
            },
            handleSure : function (model) {
                if (this.auditResults) {
                    if (this.auditResults == "审核通过"){
                        this.submitAudit(2,this.inforModel.adoptRemark);
                    }else if (this.auditResults == "审核不通过"){
                        this.$refs[model].validate((valid) => {
                            if (valid) {
                                this.submitAudit(90,this.inforModel.failRemark);
                            }
                        });
                    }else{
                        this.showReview = false;
                    }
                }else{
                    this.showReview = false;
                }
            },
            submitAudit : function (state,comment) {
                var _this = this;
                _this.loading = true;
                _this.$post(_this.host_bdd + '/outcomeApply/v1/audit', {
                    outcomeApplyId:_this.auditUserId,
                    state:state,
                    comment:comment,
                }, function (rt) {
                    _this.loading = false;
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.showReview = false;
                    _this.$Message.success('提交成功!');
                    _this.search_agent();
                });
            }
        }
    };
</script>
