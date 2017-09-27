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
        display:block;position: relative;
        line-height: 12px;
        font-size: 12px;
        font-weight: 400;
    }

    .left{
        width: 128px;
        text-align: right;
        display: inline-block;
        margin-bottom: 50px;
    }

    .right{
        position: absolute;
        margin-bottom: 50px;
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
        margin-bottom: 50px;
        left: 580px;
        text-align: left;
    }

    .section-header{
        margin-top: 10px;
        background-color: #fff;
        overflow: hidden;
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
            <li style="margin-left:10px;" :class="selectIndex == 2 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="selectIndex = 2">业务统计
            </li>
        </ul>
    </div>
    <div class="base" v-if='selectIndex == 1'>
        <div class="whiteColor">
            <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  基本信息</h5>
            <div style="padding-top: 50px;" class="labels">
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
            <div style="display:block;position: relative; padding-top: 50px;" class="labels">
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
                <div style="overflow:hidden;margin-bottom: 20px;">
                    <img v-show='imageSrcFront' :src="imageSrcFront" style=" float: left;margin-left:128px;width:400px;height:300px;">
                    <img v-show='imageSrcBack' :src="imageSrcBack" style="float: left;margin-left:60px;width:400px;height:300px;">
                </div>
            </div>
        </div>
        <div class="section-header" v-show='!agentDetail.expiredTime && underLevelListData'>
            <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  直属下级</h5>
            <Table style="margin:20px 20px; margin-bottom: 20px;"height="230" border :columns="underLevelListTitles" :data='underLevelListData'></Table>
            <Page :total="totalPage" show-total :current="currentPage" show-elevator style="height:41px ;text-align: right; margin-top:20px;margin-right: 20px;" @on-change="page_size_change"></Page>
        </div>
    </div>

    <div class="business" v-if='selectIndex == 2'>
        <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  业务统计</h5>
    </div>
</div>
</template>

<script>

    import Breadcrumb from '@/components/layout/Breadcrumb.vue';

    export default {
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
        data () {
            return {
                breadcrumbDetail: ['代理人详情'],
                imageSrcFront:"",
                imageSrcBack:"",
                selectIndex : 1,
                id:'',
                totalPage:0,
                currentPage:1,
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
                underLevelListData: [
                    {
                        name:"",
                        contactMobile:"",
                        createTime:""
                    }
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

        }, filters: {
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
            }
        },
        components: {
            Breadcrumb
        },
    }
</script>