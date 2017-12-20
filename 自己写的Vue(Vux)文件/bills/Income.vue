<style scoped>

    /* mainBody */
    .main{
        height: 100%;
        background-color: #fff;
    }

    /* 搜索联系人块 */
    .agent-filter {
        background-color: #fff;
        height:136px;
        position:relative;
    }

    .agent-filter__search{
        background-color: #f2f6ff;
        left: 20px;
        right: 20px;
        top: 20px;
        bottom: 20px;
        border: 2px solid #e5eef7;
        position: absolute;
    }

    .search-date-picker{
        width: 250px;
        display: inline-block;
        margin-left: 260px;
        margin-top: 30px;
        position:absolute;
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

    .search-select{
        width: 220px;
        margin-left: 20px;
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

    /* 表格列表 */
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

</style>

<template>
    <div class="main">

        <div style="background-color: #fff">
            <breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
        </div>

        <div class="agent-filter">
            <div class="agent-filter__search" >
                <Select
                    v-model="searchText"
                    class='search-input'
                    filterable
                    remote
                    placeholder="代理人名称、手机号"
                    :remote-method="searchTeamHeader"
                    :loading="searchLoading">
                    <Option v-for="option in teamHeadList" :value="option.id" :key="option.id" :label='option.contact'>
                        <div class="option-div" style="width:130px;">{{option.name}}</div>
                        <div class="option-div" style="width:80px;">{{option.contact}}</div>
                        <div class="option-div">{{option.contactMobile}}</div>
                    </Option>
                </Select>
                <Select class='search-select' v-model="selectIndex">
                    <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Date-picker class='search-date-picker'
                    type="daterange"
                    :options="options"
                    :value='dataPickValue'
                    :placeholder="datePlaceholder"
                    placement='left-start'
                    @on-change='searchTimeChange'>
                </Date-picker>
                <Button type="info" class="search-button-reset" @click='resetButtonClick'>重置</Button>
                <Button type="primary" class="search-button-find" @click='findButtonClick'>查询</Button>
            </div>
        </div>

        <div class="agent-table-div">
            <Table :height="tableHeight" border :columns="listTitles" :data="currentData"></Table>
            <Page class="agent-page"
                :total="totalPage" show-total
                :current="currentPage" show-elevator
                :page-size="pageSize"
                @on-change="page_size_change">
            </Page>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import Breadcrumb from '@/components/layout/Breadcrumb.vue'

    export default {
      data () {
        var _this = this
        return {
          breadcrumb: ['收入列表'],
          datePlaceholder: '选择时间',
          searchLoading: false,
          teamHeadList: [
          ],
          selectIndex: 'recharge-default',
          selectList: [
            {
              label: '收入类型',
              value: 'recharge-default'
            },
            {
              label: '佣金',
              value: 'recharge-commission'
            },
            {
              label: '津贴',
              value: 'recharge-allowance'
            },
            {
              label: '红包',
              value: 'recharge-redbag'
            }
          ],
          currentPage: 1,
          pageSize: 10,
          tableHeight: '',
          totalPage: 0,
          searchText: '',
          queryConditions: null,
          startSearchTime: 0,
          endSearchTime: 0,
          currentData: [],
          dataPickValue: 0,
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
              title: '日期',
              key: 'updateTime',
              width: 160
            },
            {
              title: '收入类型',
              key: 'realTbcTypes',
              width: 130
            },
            {
              title: '金额（元）',
              key: 'deltaAmount',
              width: 120
            },
            {
              title: '真实姓名',
              key: 'contact',
              width: 120
            },
            {
              title: '代理人名称',
              key: 'tenantName'
            },
            {
              title: '手机号',
              key: 'contactMobile',
              width: 140
            },
            {
              title: '备注',
              width: 160,
              key: 'desc2'
            }
          ]
        }
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
        this.tableHeight = this.getTableMinHeight(leftHeight)
      },

      components: {
        Breadcrumb
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
          if (searchText.length) {
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
          _this.$http.get(_this.host_bdd + '/captial/v1/inoutcome/inferior/find', {
            params: {
              dealType: 'recharge',
              realTbcTypes: _this.selectIndex,
              q: _this.queryConditions,
              pn: _this.currentPage,
              ps: _this.pageSize
            }
          })
          .then(function (response) {
            if (response.data.code !== 200) {
              _this.$Message.error(response.data.error)
              return
            }
            _this.currentData = response.data.inoutcomes
            _this.totalPage = response.data.recordCount
            if (_this.currentData) {
              for (var i = 0; i < _this.currentData.length; i++) {
                _this.currentData[i].updateTime = _this.timeFormat(new Date(_this.currentData[i].updateTime * 1000), 'yyyy/MM/dd hh:mm')
                _this.currentData[i].tenantName = _this.currentData[i].tenant.name
                _this.currentData[i].contact = _this.currentData[i].tenant.contact
                _this.currentData[i].contactMobile = _this.currentData[i].tenant.contactMobile
              }
            }
          })
        },
        searchTimeChange: function (results) {
          if (typeof (results[0] === 'string') && typeof (results[1] === 'string') && results[0].length && results[1].length) {
            this.startSearchTime = parseInt(new Date(results[0]).getTime() / 1000)
            this.endSearchTime = parseInt(new Date(results[1]).getTime() / 1000 + 24 * 3600)
          } else {
            this.startSearchTime = null
            this.endSearchTime = null
          }
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
          this.selectIndex = 'recharge-default'
          this.queryConditions = null
        },
        search_agent: function () {
          this.currentPage = 1
          var jsonObject = {
            'updateTime_ge': this.startSearchTime ? this.startSearchTime : null,
            'updateTime_le': this.endSearchTime ? this.endSearchTime : null,
            'tenantId_eq': this.searchText ? this.searchText : null
          }
          this.queryConditions = JSON.stringify(jsonObject)
          console.log('请求条件', this.queryConditions)
          this.getDataList()
        },
        auditRadioChange: function () {
          this.inforModel.adoptRemark = ''
          this.inforModel.failRemark = ''
        },
        page_size_change: function (index) {
          this.currentPage = index
          this.getDataList()
        }
      }
    }
</script>
