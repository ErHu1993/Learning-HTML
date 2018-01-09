<style scoped>
    /* mainBody */
    .main{
        background-color: #f2f6ff;
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

    .search-button-add{
        margin-top: 7.5px;
        margin-right: 20px;
        position: relative;
        float: right;
        width:80px;
        height:35px;
    }

    .agent-table-div{
        padding:20px 20px;
        padding-bottom: 10px;
        background-color: #fff;
    }

    .agent-page{
        text-align: right;
        margin-top:10px;
        margin-right: 20px;
    }

    .option-div{
        text-align: left;
        display: inline-block;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
    }

    .model-header{
        color:#3b97f5;
        text-align:left;
    }

    .model-content{
        font-size: 12px;
        position: relative;
        height: 330px;
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

    .model-search-input{
        display: inline-block;
        width: 350px;
        margin-left: 10px;
    }

</style>

<template>
    <div class="main">
        <div style="background-color: #fff">
            <Button type="primary" class='search-button-add' @click='showImport = true'>批量导入</Button>
            <breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
        </div>

        <div class="agent-table-div">
            <Table class='agent-table' :height="tableHeight" border :columns="listTitles" :data="currentData"></Table>
            <Page class='agent-page' :total="totalPage" show-total :current="currentPage" :page-size="pageSize" show-elevator @on-change="page_size_change"></Page>
        </div>

         <!-- 弹出框样式 -->
        <Modal v-model="showImport" width="500">
            <p slot="header" class="model-header">
                <Icon type="information-circled"></Icon>
                <span class="model-header">批量导入</span>
            </p>

            <div class="model-content">
                <label class="model-content-title">导入名称:</label>
                <Input class='model-input' v-model="importModel.activityName"  placeholder="请输入本次导入名称" :maxlength='50'></Input>
                <br><br>
                <label class="model-content-title">直属上级:</label>
                <Select
                    v-model="importModel.parentId"
                    class='model-search-input'
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
                <br><br>
                <label style="float:left;">手机号码:</label>
                <Input class='model-input' v-model="importModel.contactMobiles" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="每行一个手机号码"></Input>
                </div>
            <div slot="footer">
                <Button type="success" @click="handleSure('importModel')" :loading="loading">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import $ from 'jquery'
    import Breadcrumb from '@/components/layout/Breadcrumb.vue'
    import expandRow from '@/views/team-manager/expand-add.vue'

    export default {
      data () {
        return {
          breadcrumb: ['批量导入代理人'],
          currentPage: 1,
          pageSize: 20,
          totalPage: 0,
          showImport: false,
          tableHeight: '',
          importModel: {
            activityName: '',
            parentId: '',
            contactMobiles: ''
          },
          searchLoading: false,
          loading: false,
          teamHeadList: [
          ],
          currentData: [],
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
              title: '导入时间',
              key: 'createTime',
              width: 160
            },
            {
              title: '导入名称',
              key: 'activityName'
            },
            {
              title: '直属上级真实姓名',
              key: 'parentContent',
              width: 160
            },
            {
              title: '导入总数',
              key: 'totalAccount',
              width: 120
            },
            {
              title: '接受数量',
              key: 'acceptAccount',
              width: 120
            }
          ]
        }
      },

      components: {
        Breadcrumb,
        expandRow
      },

      created () {

      },

      mounted () {
        this.getDataList()
      },

      updated () {
        let bh = $('.breadcrumb').outerHeight()
        let ap = $('.agent-page').outerHeight()
        let rh = $('.js_frame_right').outerHeight()
        let leftHeight = rh - bh - 20 - ap - 20
        this.tableHeight = this.getTableMinHeight(leftHeight)
      },

      methods: {
        getDataList: function () {
          var _this = this
          _this.$get(_this.host_bdd + '/agency/v1/inferior/import/list?pn=' + _this.currentPage +
          '&ps=' + _this.pageSize,
          function (rt) {
            if (rt.data.code !== 200) {
              _this.$Message.error(rt.data.error)
              return
            }
            _this.currentData = rt.data.tenantActivities
            _this.totalPage = rt.data.recordCount
            if (_this.currentData) {
              for (var i = 0; i < _this.currentData.length; i++) {
                if (_this.currentData[i].tenant) {
                  _this.currentData[i].parentContent = _this.currentData[i].tenant.contact
                } else {
                  _this.currentData[i].parentContent = ''
                }
                _this.currentData[i].createTime = _this.timeFormat(new Date(_this.currentData[i].createTime * 1000), 'yyyy/MM/dd hh:mm')
              }
            }
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
            _this.importModel.parentId = ''
          }
        },
        handleSure: function (model) {
          if (!this.importModel.activityName) {
            this.$Message.error('请填写本次导入的名称')
          } else if (!this.importModel.parentId) {
            this.$Message.error('请填写上级代理人')
          } else if (!this.importModel.contactMobiles) {
            this.$Message.error('请填写手机号码')
          } else {
            var haveError = false
            var phones = this.importModel.contactMobiles.split('\n')
            if (phones.length > 1) {
              for (var i = 0; i < phones.length; i++) {
                phones[i] = this.trim(phones[i])
                if (!this.phoneNumber(phones[i])) {
                  phones.splice(i, 1)
                  i = 0
                  haveError = true
                }
              }
              this.importModel.contactMobiles = phones.join('\n')
            } else {
              this.importModel.contactMobiles = this.trim(this.importModel.contactMobiles)
              if (!this.phoneNumber(this.importModel.contactMobiles)) {
                this.importModel.contactMobiles = null
                haveError = true
              }
            }

            if (haveError) {
              this.$Message.success('已删除问题手机号码,请重新检查!')
              return
            }

            var _this = this
            _this.loading = true
            _this.$post(_this.host_bdd + '/agency/v1/inferior/import', {
              activityName: _this.importModel.activityName,
              parentId: _this.importModel.parentId,
              contactMobiles: _this.importModel.contactMobiles
            }, function (rt) {
              _this.loading = false
              if (rt.data.code !== 200) {
                _this.$Message.error(rt.data.error)
                return
              }
              _this.showImport = false
              _this.$Message.success('提交成功!')
              _this.importModel = {
                activityName: '',
                parentId: '',
                contactMobiles: ''
              }
              _this.currentPage = 1
              _this.getDataList()
            })
          }
        },
            // 去左右空格;
        trim (s) {
          return s.replace(/(^\s*)|(\s*$)/g, '')
        },
        phoneNumber (s) {
          var re = new RegExp(/^1[34578]\d{9}$/)
          return re.test(s)
        },
        page_size_change: function (index) {
          this.currentPage = index
          this.getDataList()
        }
      }
    }
</script>
