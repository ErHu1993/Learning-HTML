<style scoped>

</style>

<template>
  <div class="main">
    <actionsheet
      v-model="showActionsheet"
      :menus="handleResultTitle"
      close-on-clicking-mask
      show-cancel
      @on-click-menu="handelResultClick">
    </actionsheet>
    <actionsheet
      v-model="showMessageTemplate"
      :menus="messageTemplateList"
      :close-on-clicking-mask='false'
      show-cancel
      @on-click-menu="sendMessageTemplate">
    </actionsheet>
    <actionsheet
      v-model="showRevisitPay"
      :menus="revisitPayTitle"
      :close-on-clicking-mask='false'
      :show-cancel='false'
      @on-click-menu="revisitPayClick">
    </actionsheet>
    <confirm v-if='inquirySms' v-model="inquirySms"
    @on-confirm="inquirySmsConfirm">
      <p style="text-align:left;">{{inquirySms.sms}}</p>
    </confirm>
  </div>
</template>

<script>
  import $ from 'zepto'
  import { Actionsheet, Confirm, TransferDomDirective as TransferDom } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Actionsheet, Confirm
    },
    props: {
      category: 0, // 0:保骉车险外呼 1:保骉车险回访 2:畅想人生外呼 3:畅想人生回访
      produceId: '',
      vendorId: '',
      showHandleResult: false,
      dataItem: null
    },
    watch: {
      showHandleResult: function (newValue) {
        this.showActionsheet = newValue
        if (newValue) {
          $('.weui-actionsheet__cell').css('font-size', '18px')
          $('.vux-actionsheet-menu-default').css('text-align', 'center')
          $('.vux-actionsheet-menu-default').css('font-size', '18px')
        }
      },
      showActionsheet: function (newValue) {
        this.$emit('showHandleResultChange', newValue)
      }
    },
    data () {
      return {
        handleResultTitle: [],
        showActionsheet: this.showHandleResult, // 外呼结果控制开关
        showRevisitPay: false,
        showMessageTemplate: false,
        messageTemplateList: [],
        inquirySms: null,
        revisitPayTitle: [
          {
            label: '已有支付二维码，去上传',
            code: 0
          },
          {
            label: '没有支付二维码，去生成',
            code: 1
          }
        ]
      }
    },
    created () {
      this.getHandleResultList()
    },
    updated () {
      if (this.showMessageTemplate) {
        $('.weui-actionsheet__cell').css('font-size', '12px')
        $('.vux-actionsheet-menu-default').css('text-align', 'left')
        $('.vux-actionsheet-menu-default').css('font-size', '12px')
      }
    },
    methods: {
      getHandleResultList () {
        var _this = this
        if (!(this.category % 2)) {
          // 电销
          this.$http.get(this.host_bdd + '/common/v1/code/electricitySales/job/result?produceId=' +
          this.produceId + '&vendorId=' + this.vendorId)
          .then((rt) => {
            if (rt.data.code !== 200) {
              _this.$vux.toast.text(rt.data.error, 'top')
              return
            }
            _this.handelResultData = rt.data.electricitySalesResults
            if (_this.handelResultData) {
              for (var i = 0; i < _this.handelResultData.length; i++) {
                var item = _this.handelResultData[i]
                _this.handleResultTitle.push({
                  label: item.result,
                  code: item.code,
                  salesType: item.salesType
                })
              }
            }
          })
        } else {
          // 回访
          this.$http.get(this.host_bdd + '/common/v1/code/electricitySales/visit/result?produceId=' +
          this.produceId + '&vendorId=' + this.vendorId)
          .then((rt) => {
            if (rt.data.code !== 200) {
              _this.$vux.toast.text(rt.data.error, 'top')
              return
            }
            _this.handelResultData = rt.data.electricitySalesResults
            if (_this.handelResultData) {
              for (var i = 0; i < _this.handelResultData.length; i++) {
                var item = _this.handelResultData[i]
                _this.handleResultTitle.push({
                  label: item.result,
                  code: item.code,
                  salesType: item.salesType
                })
              }
            }
          })
        }
      },
      handelResultClick (index, item) {
        if (index === 'cancel' && !item) return
        var ctaliPremiumAmount = this.dataItem.jobDetail.ctaliPremiumAmount
        var ctliPremiumAmount = this.dataItem.jobDetail.ctliPremiumAmount
        var taxPremiumAmount = this.dataItem.jobDetail.taxPremiumAmount
        var ctliProfileDesc = this.dataItem.jobDetail.ctliProfileDesc
        var premiumAmount = this.dataItem.jobDetail.premiumAmount
        var medicalInsurance = this.dataItem.jobDetail.medicalInsurance
        this.$vux.loading.show({
          text: '正在上传请求'
        })
        var _this = this
        this.$post(_this.host_bdd + '/electricitySales/v1/job/determine', {
          id: _this.dataItem.id,
          code: item.code,
          salesType: item.salesType,
          ctaliPremiumAmount: ctaliPremiumAmount > 0 ? Math.round(ctaliPremiumAmount * 100) : '',
          ctliPremiumAmount: ctliPremiumAmount > 0 ? Math.round(ctliPremiumAmount * 100) : '',
          taxPremiumAmount: taxPremiumAmount > 0 ? Math.round(taxPremiumAmount * 100) : '',
          ctliProfileDesc: ctliProfileDesc,
          medicalInsurance: medicalInsurance ? 1 : 0,
          ageGroup: _this.dataItem.jobDetail.ageGroup,
          premiumAmount: premiumAmount > 0 ? Math.round(premiumAmount * 100) : ''
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          if (!(_this.category % 2)) {
            // 电销
            _this.getMessageTemplateList(item.salesType)
          } else {
            // 回访
            if (item.salesType !== 4) {
              _this.getMessageTemplateList(item.salesType)
            } else {
              if (_this.category === 1) {
                // 保骉回访
                _this.showRevisitPay = true
              } else if (_this.category === 3) {
                // 利安回访
                _this.$emit('readyToGoLianProduct')
              }
            }
          }
        })
      },
      getMessageTemplateList (salesType) {
        var _this = this
        this.$http.get(this.host_bdd + '/electricitySales/v1/sms/list?id=' +
        this.dataItem.id + '&salesType=' + salesType)
        .then((rt) => {
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          if (rt.data.sms) {
            _this.messageTemplateList = []
            for (var i = 0; i < rt.data.sms.length; i++) {
              var item = rt.data.sms[i]
              _this.messageTemplateList.push({
                label: item.smsContent,
                salesType: item.salesType,
                smsId: item.id
              })
            }
            _this.showMessageTemplate = true
          } else {
            _this.judgeCompleteHandle(salesType)
          }
        })
      },
      sendMessageTemplate (index, item) {
        if (index === 'cancel' && !item) {
          this.judgeCompleteHandle(-1)
          return
        }
        this.$vux.loading.show({
          text: '正在发送'
        })
        var _this = this
        this.$post(_this.host_bdd + '/electricitySales/v1/sms/send', {
          id: _this.dataItem.id,
          salesType: item.salesType,
          smsId: item.smsId
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          _this.$vux.toast.text('发送成功', 'top')
          _this.judgeCompleteHandle(item.salesType)
        })
      },
      revisitPayClick (index, item) {
        var _this = this
        if (item.code) {
          // 没有二维码，去生成
          if (this.dataItem.jobDetail.inquiryUrl) {
            window.location.href = this.dataItem.jobDetail.inquiryUrl
          } else {
            this.$vux.loading.show({
              text: '正在请求数据'
            })
            this.$post(_this.host_bdd + '/electricitySales/v1/job/inquiryUrl/zhongan', {
              id: _this.dataItem.id
            }, function (rt) {
              _this.$vux.loading.hide()
              if (rt.data.code !== 200) {
                _this.$vux.toast.text(rt.data.error, 'top')
                return
              }
              window.location.href = rt.data.inquiryUrl
              _this.dataItem.jobDetail.inquiryUrl = rt.data.inquiryUrl
            })
          }
        } else {
          // 有二维码
          this.$uploadImageOnlyAlbum(function (serverId, localId) {
            _this.$vux.loading.show({
              text: '正在上传'
            })
            _this.$post(_this.host_bdd + '/electricitySales/v1/payImage/upload/zhongan', {
              id: _this.dataItem.id,
              mediaId: serverId
            }, function (rt) {
              _this.$vux.loading.hide()
              if (rt.data.code !== 200) {
                _this.$vux.toast.text(rt.data.error, 'top')
                return
              }
              if (rt.data.inquirySms) {
                _this.inquirySms = rt.data.inquirySms
              } else {
                _this.judgeCompleteHandle(-1)
              }
            })
          })
        }
      },
      inquirySmsConfirm () {
        var _this = this
        this.$vux.loading.show({
          text: '正在发送'
        })
        this.$http.post(this.host_bdd + '/electricitySales/v1/sms/post', this.inquirySms).then((rt) => {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          _this.$vux.toast.text('发送成功', 'top')
          _this.judgeCompleteHandle(3)
        })
      },
      judgeCompleteHandle (salesType) {
        if (this.category % 2) {
          // 回访  只有 salesType === 3 的时候移除
          if (salesType === 3) {
            this.$emit('completeHandle', this.dataItem.id)
          } else {
            this.$emit('completeHandle', this.dataItem.id, true)
          }
        } else {
          // 电销
          this.$emit('completeHandle', this.dataItem.id)
        }
      }
    }
  }
</script>
