<style scoped>
    /* mainBody */
    .main{
        height: 100%;
        background-color: #fff;
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
        width: 350px ;
        display: inline-block;
        margin-left: 20px;
        margin-top: 30px;
    }

    .option-div{
        text-align: left;
        display: inline-block;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
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
        width: 250px;
    }

    .model-header{
        color:#3b97f5;
        text-align:left;
    }

    .model-content{
        font-size: 12px;
        position: relative;
        height: 160px;
        overflow-y: auto;
    }

    .model-content-title{
        display: inline-block;
    }

    .model-input{
        display: inline-block;
        width: 250px;
        margin-left: 10px;
    }

    .ivu-input-number-handler-wrap{
        display:none;
    }

</style>

<template>
    <div class="main">
        <div style="background-color: #fff">
            <breadcrumb :breadcrumb="['呼叫列表']"></Breadcrumb>
        </div>
        <div class="agent-filter">
            <div class="agent-filter__footer">
                <div class="agent-filter__search" >
                    <Select
                        v-model="searchText"
                        class='search-input'
                        filterable
                        remote
                        placeholder="姓名、手机号"
                        :remote-method="searchTeamHeader"
                        :loading="searchLoading">
                        <Option v-for="option in teamHeadList" :value="option.id" :key="option.id" :label='option.contact'>
                            <div class="option-div" style="width:130px;">{{option.name}}</div>
                            <div class="option-div" style="width:80px;">{{option.contact}}</div>
                            <div class="option-div">{{option.contactMobile}}</div>
                        </Option>
                    </Select>
                    <Date-picker class='search-date-picker'
                        type="daterange" clearable
                        :value='dataPickValue'
                        :options='options'
                        :placeholder="datePlaceholder"
                        @on-change='searchTimeChange'>
                    </Date-picker>
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
    import $ from 'jquery'
    import Breadcrumb from '@/components/layout/Breadcrumb.vue'
    import expandRow from '@/views/out-call-manager/expand-row.vue'

    export default {
      data () {
        var _this = this
        return {
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          searchText: '',
          searchTime: '',
          searchLoading: false,
          teamHeadList: [
          ],
          datePlaceholder: '添加时间',
          tableHeight: '',
          currentData: [],
          dataPickValue: 0,
          startSearchTime: 0,
          endSearchTime: 0,
          options: {
            shortcuts: [
              {
                text: '今天',
                value () {
                  const end = new Date(_this.timeFormat(new Date(), 'yyyy/MM/dd 23:59:59'))
                  const start = new Date(_this.timeFormat(new Date(), 'yyyy/MM/dd 00:00:00'))
                  return [start, end]
                }
              },
              {
                text: '昨天',
                value () {
                  const end = new Date().setTime(new Date(_this.timeFormat(new Date(), 'yyyy/MM/dd 23:59:59')).getTime() - 3600 * 24 * 1000)
                  const start = new Date().setTime(new Date(_this.timeFormat(new Date(), 'yyyy/MM/dd 00:00:00')).getTime() - 3600 * 24 * 1000)
                  return [start, end]
                }
              },
              {
                text: '最近一周',
                value () {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                  return [start, end]
                }
              },
              {
                text: '最近一月',
                value () {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                  return [start, end]
                }
              },
              {
                text: '最近三月',
                value () {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                  return [start, end]
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
                    row: params.row
                  }
                })
              }
            },
            {
              title: '产品名称',
              key: 'productName'
            },
            {
              title: '提供商',
              key: 'vendorShortName'
            },
            {
              title: '电销员姓名',
              key: 'tenantName',
              width: 110
            },
            {
              title: '电销员手机号',
              width: 130,
              key: 'tenantContactMobile'
            },
            {
              title: '顾客姓名',
              key: 'jobDetailOwner'
            },
            {
              title: '车牌号',
              key: 'jobDetailPlatNo'
            },
            {
              title: '年龄段',
              key: 'jobDetailAgeGroup'
            },
            {
              title: '拨打时间',
              key: 'callTime',
              width: 150
            },
            {
              title: '拨打时长',
              key: 'totalTime'
            },
            {
              title: '呼叫方向',
              key: 'callType'
            }
          ]
        }
      },

      components: {
        Breadcrumb
      },

      created () {
        this.resetButtonClick()
      },

      mounted: function () {
        this.getDataList()
      },

      updated () {
        let bh = $('.breadcrumb').outerHeight()
        let ah = $('.agent-filter').outerHeight()
        let ap = $('.agent-page').outerHeight()
        let rh = $('.js_frame_right').outerHeight()
        let leftHeight = rh - bh - ah - ap - 20
        this.tableHeight = this.getTableMinHeight(leftHeight, 139)

        $('.ivu-input-number-handler-wrap').css({
          display: 'none'
        })
      },

      methods: {
        toast: function (title, contet) {
          this.$Modal.info({
            title: '提示',
            content: title
          })
        },
        searchTeamHeader: function (searchText) {
          var _this = this
          _this.searchLoading = true
          if (searchText) {
            var queryConditions = {
              'child.name,child.contact,child.contactMobile_like': searchText || null
            }
            queryConditions = JSON.stringify(queryConditions)
            _this.$http.get(_this.host_bdd + '/agency/v1/inferior/find', {
              params: {
                option: 1,
                q: queryConditions,
                pn: 1,
                ps: 20
              }
            }).then(function (response) {
              _this.searchLoading = false
              if (response.data.code !== 200) {
                _this.$Message.error(response.data.error)
                return
              }
              _this.teamHeadList = response.data.tenantsWithParent
            })
          } else {
            _this.searchLoading = false
            _this.teamHeadList = []
            _this.searchText = ''
          }
        },
        getDataList: function () {
          var _this = this
          var jsonObject = {
            'r.callTime_ge': this.startSearchTime ? this.startSearchTime : null,
            'r.callTime_le': this.endSearchTime ? this.endSearchTime : null,
            'j.tenantId_eq': this.searchText ? this.searchText : null
          }
          var queryConditions = JSON.stringify(jsonObject)
          _this.$http.get(_this.host_bdd + '/electricitySales/v1/tape/find', {
            params: {
              q: queryConditions,
              pn: _this.currentPage,
              ps: _this.pageSize
            }
          })
          .then(function (response) {
            if (response.data.code !== 200) {
              _this.$Message.error(response.data.error)
              return
            }
            _this.totalPage = response.data.recordCount
            _this.currentData = response.data.salesReportLogs
            if (_this.currentData) {
              for (var i = 0; i < _this.currentData.length; i++) {
                _this.currentData[i].tenantName = _this.currentData[i].tenant.name
                _this.currentData[i].tenantContactMobile = _this.currentData[i].tenant.contactMobile
                _this.currentData[i].jobDetailOwner = _this.currentData[i].jobDetail.owner
                _this.currentData[i].jobDetailPlatNo = _this.currentData[i].jobDetail.plateNo
                _this.currentData[i].jobDetailAgeGroup = _this.currentData[i].jobDetail.ageGroup
                _this.currentData[i].totalTime = _this.currentData[i].releaseTime - _this.currentData[i].callTime
                _this.currentData[i].callTime = _this.timeFormat(new Date(_this.currentData[i].callTime * 1000), 'yyyy/MM/dd hh:mm')
                _this.currentData[i].callType = _this.getCallType(_this.currentData[i].callType)
              }
            }
          })
        },
        findButtonClick: function () {
          this.search_agent()
        },
        resetButtonClick: function () {
          if (this.dataPickValue === 0) {
            this.dataPickValue = null
          } else {
            this.dataPickValue = 0
          }
          this.searchText = ''
          this.startSearchTime = null
          this.endSearchTime = null
          this.currentPage = 1
          this.getDataList()
        },
        search_agent: function () {
          this.currentPage = 1
          this.getDataList()
        },
        searchTimeChange (results) {
          if (typeof (results[0] === 'string') && typeof (results[1] === 'string') && results[0].length && results[1].length) {
            this.startSearchTime = parseInt(new Date(results[0]).getTime() / 1000)
            this.endSearchTime = parseInt(new Date(results[1]).getTime() / 1000 + 24 * 3600)
          } else {
            this.startSearchTime = null
            this.endSearchTime = null
          }
        },
        getCallType (type) {
          switch (Number(type)) {
            case 0:
              return '主叫'
            case 1:
              return '被叫'
            case 2:
              return '短信发送'
            case 3:
              return '短信接收'
            default:
              return type
          }
        },
        page_size_change: function (index) {
          this.currentPage = index
          this.getDataList()
        }
      }
    }
</script>
