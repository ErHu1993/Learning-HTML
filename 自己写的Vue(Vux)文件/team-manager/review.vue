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

    /* 代理人过滤头未选中状态 */
    .agent-filter__header--unselected{
        margin-left: 10px;
        background-color: #fff;
        color: #435d77;
    }

    /* 代理人过滤头选中状态 */
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
        width: 220px;
        display: inline-block;
        margin-left: 20px;
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
        width: 220px;
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
        padding-bottom: 15px;
    }

    .model-content-comment{
        text-align: left;
    }

    .model-content-title{
        display: inline-block;
        text-align: left;
        width:70px;
    }

    .model-content-div-left{
        display: inline-block;
    }

    .model-content-div-right{
        display: inline-block;
        position: absolute;
        left: 400px;
    }

</style>

<template>
    <div class="main">
        <div style="background-color: #fff">
            <breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
        </div>
        <!-- 代理人筛选 -->
        <div class="agent-filter">
            <div class="agent-filter__hearder">
                <ul>
                    <li :class="(selectIndex == 11) ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showPendingReview">待审核</li>
                    <li :class="selectIndex == 12 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showNotPass">未通过
                    </li>
                    <li :class="selectIndex == 10 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showPendingComplete">待完善
                    </li>
                </ul>
            </div>
            <div class="agent-filter__footer">
                <div class="agent-filter__search" >
                    <Input class='search-input' placeholder="代理人名称、手机号" v-model="searchText"
                    @on-enter="search_agent"></Input>
                    <Date-picker class='search-date-picker'
                    type="daterange" :options="options" :value='dataPickValue' :placeholder="datePlaceholder"  @on-change='searchTimeChange'>
                    </Date-picker>
                    <Button class='search-button-reset' type="info"  @click='resetButtonClick'>重置</Button>
                    <Button class='search-button-find' type="primary"  @click='findButtonClick'>查询</Button>
                </div>
            </div>
        </div>

        <!-- 代理人列表 -->
        <div class="agent-table-div">
            <Table class='agent-table' :height="tableHeight" border :columns="listTitles" :data="currentData"></Table>
            <Page class='agent-page' :total="totalPage" show-total :current="currentPage" :page-size="pageSize" show-elevator @on-change="page_size_change"></Page>
        </div>

        <!-- 弹出框样式 -->
        <Modal v-model="showReview" width="1000">
            <p slot="header" class="model-header">
                <Icon type="information-circled"></Icon>
                <span class="model-header">注册申请审核</span>
            </p>

            <div class="model-content">

                <div class="model-content-div-left">
                    <label class="model-content-title">真实姓名:</label>
                    <label v-text='userCertifyInfo.name'></label>
                </div>

                <div class="model-content-div-right">
                     <label class="model-content-title">身份证号:</label>
                     <label v-text='userCertifyInfo.identity'></label>
                </div>

                <br>

                <div class="model-content-div-left">
                     <label class="model-content-title">性别:</label>
                     <label v-text='userCertifyInfo.gender'></label>
                </div>

                <div class="model-content-div-right">
                     <label class="model-content-title">民族:</label>
                     <label v-text='userCertifyInfo.nation'></label>
                </div>

                <br>

                <div class="model-content-div-left">
                     <label class="model-content-title">出生日期:</label>
                     <label v-text='userCertifyInfo.birth'></label>
                </div>

                <div class="model-content-div-right">
                     <label class="model-content-title">学历:</label>
                     <label v-text='userCertifyInfo.education'></label>
                </div>

                <br>

                <div class="model-content-div-left">
                     <label class="model-content-title">执业证号:</label>
                     <Input style='display: inline-block; width:200px;' v-if='userCertifyInfo.state == 11' class="form-input" v-model="userCertifyInfo.qualification" placeholder="请输入执业证号"></Input>
                     <label v-else v-text='userCertifyInfo.qualification'></label>
                </div>

                <div>
                     <label class="model-content-title">身份证照:</label>
                     <div class="clearfix" style="margin:-18px 0 0;">
                       <img v-show='imageSrcFront' :src="imageSrcFront" class="model-content-image">
                       <img v-show='imageSrcBack' :src="imageSrcBack" class="model-content-image">
                    </div>
                </div>

                <div>
                     <label class="model-content-title">是否通过:</label>

                     <label v-if='userCertifyInfo.state == 1'>
                        审核通过
                    </label>

                    <label v-else-if='userCertifyInfo.state == 10'>
                     等待上传审核信息
                    </label>

                    <p v-else-if='userCertifyInfo.state == 11' style='display: inline-block;'>
                         <Checkbox v-model="auditResults">审核通过</Checkbox>
                         <label style='color:red'>(注：审核不通过，即不用进行任何操作，联系并告知代理人重新提交正确资料)</label>
                    </p>

                    <label  v-else>
                        审核不通过
                    </label>
                 </div>

                 <div>
                     <Form v-if='userCertifyInfo.state == 11' style="padding-right: 10px" ref="inforModel" :model="inforModel">
                        <Form-item  prop="reviewRemark">
                            <Input  v-model="inforModel.reviewRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注" :maxlength='maxlength'></Input>
                         </Form-item>
                     </Form>
                     <div v-else>
                          <label class="model-content-title">审核备注:</label>
                          <label class="model-content-comment"  v-text='userCertifyInfo.comment'></label>
                     </div>
                 </div>
            </div>

            <div slot="footer">
                <Button type="success" @click="handleSure('inforModel')" :loading="loading">确定</Button>
            </div>
        </Modal>
</div>

</template>

<script>
    import $ from 'jquery';
    import Breadcrumb from '@/components/layout/Breadcrumb.vue';
    import expandRow from './expand-row.vue';

    export default {
        data () {
            var _this = this;
            return {
                breadcrumb: ['注册申请列表'],
                datePlaceholder:"添加时间",
                currentPage:1,
                pageSize:10,
                totalPage:0,
                tableHeight:'',
                searchText:"",
                selectIndex:11,
                queryConditions:null,
                startSearchTime:0,
                endSearchTime:0,
                currentData:[],
                dataPickValue:0,
                maxlength:50,
                showReview:false,
                loading: false,
                auditUserId:"",
                auditResults:false,
                inforModel:{
                    reviewRemark:""
                },
                userCertifyInfo:{
                    name:"",
                    identity:"",
                    qualification:"",
                    state:"",
                    comment:""
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
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row.parent
                            }
                        })
                    }
                },
                {
                    title: '真实姓名',
                    key: 'contact',
                    width: 120,
                },
                {
                    title: '代理人名称',
                    key: 'name'
                },
                {
                    title: '手机号',
                    width: 140,
                    key: 'contactMobile'
                },
                {
                    title: '直属上级',
                    key: 'parentContent'
                },
                {
                    title: '注册申请时间',
                    width: 160,
                    key: 'createTime',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 80,
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
                                        this.auditResults = false;
                                        this.clearUserInforModel();
                                        $('.model-content').animate({scrollTop:0},"slow");
                                        this.inforModel.reviewRemark = "";
                                        this.getUserCertifyInfo(this.currentData[params.index].id)
                                    }
                                }
                            }, '审核')
                            ]);
                    }
                }
                ]
            }
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

        mounted :function(){
            this.getDataList();
        },

        components: {
            Breadcrumb,
            expandRow
        },

        methods :{
            toast :function (title,contet) {
                this.$Modal.info({
                    title: '提示',
                    content: title
                });
            },
            getDataList : function (){
                var _this = this;
                _this.$http.get(_this.host_bdd + '/agency/v1/inferior/find', {
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
                    _this.currentData = response.data.tenantsWithParent;
                    _this.totalPage = response.data.recordCount;
                    if (_this.currentData) {
                        for (var i = 0; i < _this.currentData.length; i++) {
                            _this.currentData[i].createTime = _this.timeFormat(new Date(_this.currentData[i].createTime * 1000),"yyyy/MM/dd hh:mm");
                            if (_this.currentData[i].auditTime){
                                _this.currentData[i].auditTime = _this.timeFormat(new Date(_this.currentData[i].auditTime * 1000),"yyyy/MM/dd hh:mm");
                            }
                            if (_this.currentData[i].parent){
                                _this.currentData[i].parentContent = _this.currentData[i].parent.name;
                            }else{
                                _this.currentData[i].parentContent = "";
                            }
                        }

                    }
                })
            },
            getUserCertifyInfo : function (inferiorId) {
                var _this = this;
                _this.$get(_this.host_bdd + '/agency/v1/inferior/info/{inferiorId}?inferiorId=' + inferiorId,
                    function (rt) {
                        if (rt.data.code != 200) {
                            _this.$Message.error(rt.data.error);
                            return;
                        }
                        _this.auditUserId = inferiorId;
                        _this.userCertifyInfo = rt.data.tenantAgentInfo;
                        _this.inforModel.reviewRemark = rt.data.tenantAgentInfo.comment;
                        if (_this.userCertifyInfo){
                            _this.getIdentityImageSrc(_this.userCertifyInfo);
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
                if (this.selectIndex == 11) {return;}
                this.selectIndex = 11;
                this.search_agent();
                this.datePlaceholder = "注册申请时间";
                this.listTitles[this.listTitles.length - 2].title = "注册申请时间";
                this.listTitles[this.listTitles.length - 2].key = "createTime";
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
                                    this.auditResults = false;
                                    this.clearUserInforModel();
                                    $('.model-content').animate({scrollTop:0},"slow");
                                    this.inforModel.reviewRemark = "";
                                    this.getUserCertifyInfo(this.currentData[params.index].id)
                                }
                            }
                        }, '审核')
                        ]);
                }
            },
            showNotPass : function () {
                if (this.selectIndex == 12) {return;}
                this.selectIndex = 12;
                this.search_agent();
                this.datePlaceholder = "审核时间";
                this.listTitles[this.listTitles.length - 2].title = "审核时间";
                this.listTitles[this.listTitles.length - 2].key = "auditTime";
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
                                    this.auditResults = false;
                                    this.clearUserInforModel();
                                    $('.model-content').animate({scrollTop:0},"slow");
                                    this.inforModel.reviewRemark = "";
                                    this.getUserCertifyInfo(this.currentData[params.index].id)
                                }
                            }
                        }, '查看')
                        ]);
                }
            },
            showPendingComplete : function () {
                if (this.selectIndex == 10) {return;}
                this.selectIndex = 10;
                this.search_agent();
                this.datePlaceholder = "添加时间";
                this.listTitles[this.listTitles.length - 2].title = "添加时间";
                this.listTitles[this.listTitles.length - 2].key = "createTime";
                this.listTitles[this.listTitles.length - 1].render = null;
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
                    "child.createTime_ge" : this.startSearchTime ? this.startSearchTime : null,
                    "child.createTime_le" : this.endSearchTime ? this.endSearchTime : null,
                    "child.name,child.contact,child.contactMobile_like" : this.searchText ? this.searchText : null
                };
                this.queryConditions = JSON.stringify(jsonObject);
                this.getDataList();
            },
            page_size_change :function (index) {
                this.currentPage = index;
                this.getDataList();
            },
            clearUserInforModel () {
                this.userCertifyInfo = {
                    name:"",
                    identity:"",
                    qualification:"",
                    state:"",
                    comment:""
                };
                this.imageSrcFront = null;
                this.imageSrcBack = null;
            },
            handleSure : function (model) {
                if (this.userCertifyInfo.state == 11){
                    if (this.auditResults) {
                        if (this.userCertifyInfo.qualification) {
                            this.submitAudit(Number(this.auditResults),this.inforModel.reviewRemark);
                        }else{
                            this.$Message.success('请填写执业证号');
                        }
                    }else {
                        this.showReview = false;
                    }
                }else {
                    this.showReview = false;
                }
            },
            submitAudit : function (state,comment) {
                var _this = this;
                _this.loading = true;
                _this.$post(_this.host_bdd + '/agency/v1/inferior/audit', {
                    inferiorId:_this.auditUserId,
                    state:state,
                    comment:comment,
                    qualification:_this.userCertifyInfo.qualification
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
