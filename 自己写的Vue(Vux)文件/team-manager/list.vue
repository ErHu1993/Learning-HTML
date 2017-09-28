<style scoped>
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
        margin-left: 10px;
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

    /* 添加代理人按钮 */
    .agent-add-btn{
       float:right;
       margin-right:20px;
       line-height:20px;
       width:120px;
       margin-top: 5px
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
                    <li :class="(selectIndex == 1) ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showAgenting">代理中</li>
                    <li :class="selectIndex == 90 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showRemovedAgenting">已移除
                    </li>
                    <li :class="selectIndex == 99 ? 'agent-filter__header--selected' : 'agent-filter__header--unselected'" @click="showQuitAgenting">已退出
                    </li>
                </ul>
                <Button class="agent-add-btn" type="primary" icon="plus" @click='addAgent'>添加代理人</Button>
            </div>
            <div class="agent-filter__footer">
                <!-- 筛选条件-->
                <div class="agent-filter__search" >
                    <Input class='search-input' placeholder="代理人名称、手机号" v-model="searchText" @on-enter="search_agent"></Input>
                    <Date-picker  class='search-date-picker' type="daterange" :options="options" :value='dataPickValue' :placeholder="datePlaceholder" @on-change='searchTimeChange'></Date-picker>
                    <Button type="info" class='search-button-reset' @click='resetButtonClick'>重置</Button>
                    <Button type="primary" class='search-button-find' @click='findButtonClick'>查询</Button>
                </div>
            </div>
        </div>
        <!-- 代理人列表 -->
        <div class="agent-table-div">
            <Table class='agent-table' :height="tableHeight" border :columns="listTitles" :data="currentData"></Table>
            <Page class='agent-page' :total="totalPage" show-total :current="currentPage" :page-size="pageSize" show-elevator @on-change="page_size_change"></Page>
        </div>
    </div>

</template>

<script>

    import Breadcrumb from '@/components/layout/Breadcrumb.vue';
    import expandRow from './expand-row.vue';

    export default {
        data () {
            var _this = this;
            return {
                breadcrumb: ['代理人列表'],
                currentPage:1,
                pageSize:10,
                totalPage:0,
                searchText:"",
                datePlaceholder:"添加时间",
                queryConditions:null,
                startSearchTime:0,
                endSearchTime:0,
                selectIndex:1,
                tableHeight:'',
                currentData:[],
                dataPickValue:0,
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
                    title: '代理人名称',
                    key: 'name'
                },
                {
                    title: '手机号',
                    width: 120,
                    key: 'contactMobile'
                },
                {
                    title: '直属上级',
                    key: 'parentContent'
                },
                {
                    title: '添加时间',
                    width: 140,
                    key: 'createTime',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 130,
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
                                on: {
                                    click: () => {
                                        this.$router.push({ path: '/team-manager/detail', query:{id: params.row.id}});
                                    }
                                }
                            }, '查看'),
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.delete_agent(params.index);
                                    }
                                }
                            }, '删除')
                            ]);
                    }
                }
                ]
            }
        },

        components: {
            Breadcrumb,
            expandRow
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
                            if (_this.currentData[i].parent){
                                _this.currentData[i].parentContent = _this.currentData[i].parent.name;
                            }else{
                                _this.currentData[i].parentContent = "";
                            }

                            if (_this.selectIndex == 1) {
                                _this.currentData[i].createTime = _this.timeFormat(new Date(_this.currentData[i].createTime * 1000),"yyyy/MM/dd hh:mm");
                            }else if (_this.selectIndex == 90) {
                               _this.currentData[i].expiredTime = _this.timeFormat(new Date(_this.currentData[i].expiredTime * 1000),"yyyy/MM/dd hh:mm");
                           }else if (_this.selectIndex == 99){
                            _this.currentData[i].expiredTime = _this.timeFormat(new Date(_this.currentData[i].expiredTime * 1000),"yyyy/MM/dd hh:mm");
                        }
                    }
                }
            });
            },
            showAgenting :function () {
                if (this.selectIndex == 1) {return;}
                this.selectIndex = 1;
                this.currentPage = 1,
                this.search_agent();
                this.datePlaceholder = "添加时间";
                this.listTitles[4].title = "添加时间";
                this.listTitles[4].key = "createTime";
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
                            on: {
                                click: () => {
                                    this.$router.push({ path: '/team-manager/detail', query:{id: params.row.id}});
                                }
                            }
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.delete_agent(params.index);
                                }
                            }
                        }, '删除')
                        ]);
                };
            },
            showRemovedAgenting :function () {
                if (this.selectIndex == 90) {return;}
                this.selectIndex = 90;
                this.currentPage = 1,
                this.search_agent();
                this.datePlaceholder = "移除时间";
                this.listTitles[4].title = "移除时间";
                this.listTitles[4].key = "expiredTime";
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
                            on: {
                                click: () => {
                                    this.$router.push({ path: '/team-manager/detail', query:{id: params.row.id}});
                                }
                            }
                        }, '查看')
                        ]);
                };
            },
            showQuitAgenting : function () {
                if (this.selectIndex == 99) {return;}
                this.selectIndex = 99;
                this.currentPage = 1,
                this.search_agent();
                this.datePlaceholder = "退出时间";
                this.listTitles[4].title = "退出时间";
                this.listTitles[4].key = "expiredTime";
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
                            on: {
                                click: () => {
                                    this.$router.push({ path: '/team-manager/detail', query:{id: params.row.id}});
                                }
                            }
                        }, '查看')
                        ]);
                };
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
                    this.queryConditions = null;
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
                if (this.selectIndex == 1){
                    var jsonObject = {
                        "child.createTime_ge" : this.startSearchTime ? this.startSearchTime : null,
                        "child.createTime_le" : this.endSearchTime ? this.endSearchTime : null,
                        "child.name,child.contact,child.contactMobile_like" : this.searchText ? this.searchText : null
                    };
                }else if (this.selectIndex == 90){
                    var jsonObject = {
                        "child.expiredTime_ge" : this.startSearchTime ? this.startSearchTime : null,
                        "child.expiredTime_le" : this.endSearchTime ? this.endSearchTime : null,
                        "child.name,child.contact,child.contactMobile_like" : this.searchText ? this.searchText : null
                    };
                }else if (this.selectIndex == 99){
                    var jsonObject = {
                        "child.expiredTime_ge" : this.startSearchTime ? this.startSearchTime : null,
                        "child.expiredTime_le" : this.endSearchTime ? this.endSearchTime : null,
                        "child.name,child.contact,child.contactMobile_like" : this.searchText ? this.searchText : null
                    };
                }
                this.queryConditions = JSON.stringify(jsonObject);
                this.getDataList();
            },
            addAgent : function () {
                this.$router.push({ path: '/team-manager/add' });
            },
            page_size_change :function (index) {
                this.currentPage = index;
                this.getDataList();
            },
            delete_agent (index) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '温馨提示',
                    content: '从团队移除后，将失去所有使用权限，<br/> 确定移除吗？',
                    onOk: () => {
                        _this.$post(_this.host_bdd + '/agency/v1/inferior/remove', {
                            inferiorId: _this.currentData[index].id
                        }, function (rt) {
                         if (rt.data.code != 200) {
                            _this.$Message.error(rt.data.error);
                            return;
                        }
                        _this.$Message.success('移除成功!');
                        _this.currentData.splice(index, 1);
                        _this.totalPage -= 1;
                        if (!_this.currentData.length){
                            if (_this.currentPage > 1){
                                _this.currentPage -= 1;
                            }
                        }
                        _this.getDataList();
                    });
                    }
                });
            }
        }
    };
</script>
