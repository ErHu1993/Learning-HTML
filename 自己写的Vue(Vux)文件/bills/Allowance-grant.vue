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

    .search-button-grant{
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
            <breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
        </div>
        <div class="agent-filter">
            <div class="agent-filter__footer">
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
                    <Date-picker class='search-date-picker'
                        type="month" clearable
                        :value='dataPickValue'
                        :options='options'
                        :placeholder="datePlaceholder"
                        @on-change='searchTimeChange'>
                    </Date-picker>
                    <Button type="primary" v-show='canIssue' :loading="grantLoading" class='search-button-grant' @click='grantButtonClick'>发放</Button>
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

    export default {
      data () {
        return {
          breadcrumb: ['津贴发放'],
          currentPage: 1,
          pageSize: 10,
          canIssue: false,
          grantLoading: false,
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
          options: {
            disabledDate (chooseDate) {
              var nowDate = new Date()
              if (chooseDate.getFullYear() < 2017) {
                            // 禁止选
                return true
              } else if (chooseDate.getFullYear() > nowDate.getFullYear()) {
                            // 禁止选
                return true
              } else {
                            // 可选
                if (chooseDate.getFullYear() === nowDate.getFullYear()) {
                  if (chooseDate.getMonth() > nowDate.getMonth()) {
                    return true
                  } else {
                    return false
                  }
                } else {
                  return false
                }
              }
            }
          },
          listTitles: [
            {
              title: '真实姓名',
              key: 'contact',
              width: 95
            },
            {
              title: '手机号',
              width: 130,
              key: 'contactMobile'
            },
            {
              title: '当月保费',
              key: 'premiumAmount',
              width: 110
            },
            {
              title: '当月佣金',
              key: 'inferiorCommissionAmount',
              width: 100
            },
            {
              title: '当月保单数量',
              key: 'inferiorOrderCount'
            },
            {
              title: '当月团员保费',
              key: 'inferiorPremiumAmount',
              width: 110
            },
            {
              title: '当月团员佣金',
              key: 'inferiorCommissionAmount',
              width: 100
            },
            {
              title: '当月团员保单数量',
              key: 'inferiorOrderCount'
            },
            {
              title: '当月新增团员数量',
              key: 'newInferiorCount'
            },
            {
              title: '团员数量',
              key: 'inferiorCount'
            },
            {
              title: '应发金额',
              key: 'dueAllowanceAmount',
              width: 95
            },
            {
              title: '实发金额',
              key: 'action',
              width: 110,
              render: (h, params) => {
                if (params.row.state === 1) {
                  return h('div', [
                    h('InputNumber', {
                      props: {
                        type: 'text',
                        size: 'small',
                        step: 100,
                        min: 0,
                        precision: 2,
                        value: params.row.realAmount
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        input: (newRealAmont) => {
                          // 修改了调用接口
                          newRealAmont = Number(newRealAmont)
                          if (params.row.realAmount !== newRealAmont) {
                            params.row.realAmount = newRealAmont
                            var _this = this
                            _this.loading = true
                            _this.$http.post(_this.host_bdd + '/order/v1/allowance/issue/update', $.param({
                              id: params.row.id,
                              actAllowanceAmount: Math.round(newRealAmont * 100)
                            }), {
                              headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                              }
                            })
                            .then(function (rt) {
                              _this.loading = false
                              if (rt.data.code !== 200) {
                                _this.$Message.error(rt.data.error)
                                params.row.realAmount = Number(params.row.actAllowanceAmount)
                                return
                              }
                              _this.$Message.success('修改成功!')
                              params.row.realAmount = newRealAmont
                              params.row.actAllowanceAmount = newRealAmont
                            })
                            .catch(function () {
                              _this.loading = false
                              _this.$Message.error('网络错误')
                              params.row.realAmount = Number(params.row.actAllowanceAmount)
                            })
                          }
                        }
                      }
                    })
                  ])
                } else {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'text',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      }
                    }, params.row.actAllowanceAmount)
                  ])
                }
              }
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
          var montheq = null
          if (this.dataPickValue) {
            montheq = this.dataPickValue.split('-').join('')
          } else {
            montheq = this.datePlaceholder.split('-').join('')
          }
          var jsonObject = {
            'month_eq': montheq,
            'tenantId_eq': this.searchText ? this.searchText : null
          }
          _this.$http.get(_this.host_bdd + '/order/v1/allowance/issue/find', {
            params: {
              q: JSON.stringify(jsonObject),
              pn: _this.currentPage,
              ps: _this.pageSize
            }
          })
          .then(function (response) {
            if (response.data.code !== 200) {
              _this.$Message.error(response.data.error)
              return
            }
            _this.currentData = response.data.tenantMonthlyInventories
            _this.canIssue = Boolean(response.data.canIssue)
            _this.totalPage = response.data.recordCount
            if (_this.currentData) {
              for (var i = 0; i < _this.currentData.length; i++) {
                _this.currentData[i].contact = _this.currentData[i].tenant.contact
                _this.currentData[i].contactMobile = _this.currentData[i].tenant.contactMobile
                if (_this.currentData[i].actAllowanceAmount > 0) {
                  _this.currentData[i].realAmount = Number(_this.currentData[i].actAllowanceAmount)
                } else {
                  _this.currentData[i].realAmount = 0.00
                  _this.currentData[i].actAllowanceAmount = 0.00
                }
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

          var nowDate = new Date()
          var nowYear = nowDate.getFullYear()
          var nowMonth = nowDate.getMonth() + 1
          if (nowMonth === 1) {
            nowMonth = 12
            nowYear -= 1
          } else {
            nowMonth -= 1
          }
          if (nowMonth < 10) nowMonth = '0' + nowMonth
          this.datePlaceholder = nowYear + '-' + nowMonth
          this.dataPickValue = this.datePlaceholder
          this.currentPage = 1
          this.getDataList()
        },
        grantButtonClick  () {
          var _this = this
          _this.grantLoading = true

          var month = null
          if (this.dataPickValue) {
            month = this.dataPickValue.split('-').join('')
          } else {
            month = this.datePlaceholder.split('-').join('')
          }
          _this.$post(_this.host_bdd + '/order/v1/allowance/issue', {
            month: month
          }, function (rt) {
            _this.loading = false
            if (rt.data.code !== 200) {
              _this.$Message.error(rt.data.error)
              return
            }
            _this.$Message.success('发放成功!')
            _this.canIssue = false
            _this.grantLoading = false
            _this.currentPage = 1
            _this.getDataList()
          })
        },
        search_agent: function () {
          this.currentPage = 1
          this.getDataList()
        },
        searchTimeChange (value) {
          this.dataPickValue = value
        },
        page_size_change: function (index) {
          this.currentPage = index
          this.getDataList()
        }
      }
    }
</script>
