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
        width: 220px;
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
        width: 220px;
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

</style>

<template>
    <div class="main">
        <div style="background-color: #fff">
            <breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
        </div>
        <!-- 代理人筛选 -->
        <div class="agent-filter">
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
        <!-- 弹出框样式 -->
        <Modal v-model="showRemittance" width="400">
            <p slot="header" class="model-header">
                <Icon type="information-circled"></Icon>
                <span class="model-header">账户打款</span>
            </p>

            <div class="model-content">
                <label class="model-content-title">打款类型:</label>
                <Select class='model-input' v-model="remittanceModel.type">
                    <Option v-for="item in remittanceTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <br><br>
                <label class="model-content-title">打款金额:</label>
                <InputNumber class='model-input' :min="0.01" :precision='2' v-model="remittanceModel.amount"></InputNumber>

                <br><br>
                <label>打款备注:</label>
                <Form class="model-content-title" ref="remittanceModel" :model="remittanceModel">
                    <Form-item  prop="reviewRemark">
                        <Input class='model-input' v-model="remittanceModel.remark"  placeholder="请输入关于打款的备注说明" :maxlength='15'></Input>
                    </Form-item>
                </Form>
                </div>
            <div slot="footer">
                <Button type="success" @click="handleSure('remittanceModel')" :loading="loading">确定</Button>
            </div>
        </Modal>

    </div>

</template>

<script>
    import $ from 'jquery'
    import Breadcrumb from '@/components/layout/Breadcrumb.vue'
    import expandRow from '@/views/team-manager/expand-row.vue'

    export default {
      data () {
        var _this = this
        return {
          breadcrumb: ['账户打款'],
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          searchText: '',
          datePlaceholder: '添加时间',
          loading: false,
          showRemittance: false,
          remittanceModel: {
            inferiorId: '',
            type: '1',
            amount: 0.01,
            remark: ''
          },
          remittanceTypeList: [
            {
              label: '红包',
              value: '1'
            }
          ],
          queryConditions: null,
          startSearchTime: 0,
          endSearchTime: 0,
          tableHeight: '',
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
              width: 120
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
              title: '添加时间',
              width: 160,
              key: 'createTime'
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
                        this.showRemittance = true
                        this.loading = false
                        this.remittanceModel = {
                          inferiorId: '',
                          type: '1',
                          amount: 0.01,
                          remark: ''
                        }
                        this.remittanceModel.inferiorId = params.row.id
                      }
                    }
                  }, '打款')
                ])
              }
            }
          ]
        }
      },

      components: {
        Breadcrumb,
        expandRow
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

      methods: {
        toast: function (title, contet) {
          this.$Modal.info({
            title: '提示',
            content: title
          })
        },
        getDataList: function () {
          var _this = this
          _this.$http.get(_this.host_bdd + '/agency/v1/inferior/find', {
            params: {
              option: 1,
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
            _this.currentData = response.data.tenantsWithParent
            _this.totalPage = response.data.recordCount
            if (_this.currentData) {
              for (var i = 0; i < _this.currentData.length; i++) {
                if (_this.currentData[i].parent) {
                  _this.currentData[i].parentContent = _this.currentData[i].parent.name
                } else {
                  _this.currentData[i].parentContent = ''
                }
                _this.currentData[i].createTime = _this.timeFormat(new Date(_this.currentData[i].createTime * 1000), 'yyyy/MM/dd hh:mm')
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
            this.queryConditions = null
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
          this.searchText = null
          this.queryConditions = null
        },
        search_agent: function () {
          this.currentPage = 1
          var jsonObject = {
            'child.createTime_ge': this.startSearchTime ? this.startSearchTime : null,
            'child.createTime_le': this.endSearchTime ? this.endSearchTime : null,
            'child.name,child.contact,child.contactMobile_like': this.searchText ? this.searchText : null
          }
          this.queryConditions = JSON.stringify(jsonObject)
          this.getDataList()
        },
        page_size_change: function (index) {
          this.currentPage = index
          this.getDataList()
        },
        handleSure: function (model) {
          if (this.remittanceModel.remark) {
            var _this = this
            _this.loading = true
            _this.$post(_this.host_bdd + '/captial/v1/inferior/play/money', {
              inferiorId: _this.remittanceModel.inferiorId,
              option: _this.remittanceModel.type,
              amount: Math.round(_this.remittanceModel.amount * 100) + '',
              comment: _this.remittanceModel.remark
            }, function (rt) {
              _this.loading = false
              if (rt.data.code !== 200) {
                _this.$Message.error(rt.data.error)
                return
              }
              _this.showRemittance = false
              _this.$Message.success('提交成功!')
            })
          } else {
            this.$Message.error('请填写打款备注')
          }
        }
      }
    }
</script>
