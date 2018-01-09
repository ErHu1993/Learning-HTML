<style scoped>
    .main {
        background-color: #fff;
    }

    .section-title {
        text-align: center;
        color: #36aed5;
        margin: 0px;
        padding: 10px;
        background-color: #e6edf0;
    }

     .section-title p{
        display: inline-block;
     }

    .section-title img {
        float:right;
        display: inline-block;
        width: 28px;
        height:21px;
    }

    .agree{
        border-top: 1px solid #e5e5e5;
        margin: 0px 15px;
        padding: 10px 0px;
    }

    .agree a {
        color: #36aed5;
    }

    .submit-button{
        padding: 0px 10px;
        background-color: #fff;
        margin-top: 10px;
        margin-bottom: 10px;
        height: 45px;
    }

    .dialog-div {
        height:400px;
        text-align: left;
        padding:15px 0;
        overflow:scroll;
        -webkit-overflow-scrolling:touch;
    }

    .dialog-div p{
      padding: 5px 10px;
    }

    .vux-x-dialog:last-child .dialog-div{
      text-align: center;
    }

</style>

<template>
    <div class="main">
        <group :gutter='0'>
            <group-title  class="section-title">
                <p>投保人信息</p>
                <img v-show='!hideUploadImage' src="../../../assets/camera.png" @click='takePhotoToUserInformation(1)'>
            </group-title>

            <x-input
            title="姓名"
            placeholder="请输入投保人姓名"
            v-model="policyHolder.name"
            text-align="right"
            placeholder-align="right"
            @on-change='policyHolderNameChange'
            :is-type="userNameRules">
            </x-input>

            <x-input
            title="身份证号码"
            placeholder="请输入投保人证件号码"
            v-model="policyHolder.identity"
            text-align="right"
            placeholder-align="right"
            @on-change='policyHolderIdentityChange'
            :is-type="identityRules">
            </x-input>

            <x-input
            title="电子邮件"
            placeholder="请输入"
            v-model="flowData.policyHolderEmail"
            text-align="right"
            placeholder-align="right"
            :is-type="userEmailRules">
            </x-input>

            <x-input
            title="手机号码"
            placeholder="请录入投保人手机号码"
            v-model="flowData.policyHolderMobile"
            placeholder-align="right"
            text-align="right"
            :is-type="mobileRules">
            </x-input>

            <group-title  class="section-title">
                <p>被保人信息</p>
                <img v-show='!hideUploadImage' src="../../../assets/camera.png" @click='takePhotoToUserInformation(2)'>
            </group-title>

            <popup-radio title="与投保人关系"
            :options="insuredRelationOptions"
            @on-change='insuredRelationChange'
            v-model="flowData.insuredRelation">
            </popup-radio>

            <x-input
            title="姓名"
            placeholder="请输入被保人姓名"
            :disabled='flowData.insuredRelation == "本人"'
            v-model="insured.name"
            text-align="right"
            placeholder-align="right"
            :is-type="userNameRules">
            </x-input>

            <x-input
            title="身份证号码"
            placeholder="请输入被保人证件号码"
            v-model="insured.identity"
            :disabled='flowData.insuredRelation == "本人"'
            placeholder-align="right"
            text-align="right"
            @on-change='insuredIdentityChange'
            :is-type="identityRules">
            </x-input>

            <x-switch class='switch-vertical-middle' title="有无社会基本医疗保险" v-model="flowData.socialInsuFlag"></x-switch>

            <div class="agree">
                <check-icon :value.sync="agreeCheck" @click.native='agreeTotalDeclare'>我已阅读并理解</check-icon>
                <a @click='showDeclare = true'>《投保声明》</a>、
                <a @click='showAttention = true'>《投保须知》</a>和
                <a @click='showProvision = true'>《保险条款》</a>，并同意遵守。
            </div>
            <section class="submit-button">
                <x-button type='primary' @click.native='submitInfo'>确定</x-button>
            </section>

            <x-dialog v-model="showDeclare"
            :dialog-style="{'max-width': '90%', width: '90%' }">
                <div class="dialog-div">
                  <ol>
                    <li><p>1.本人自愿投保贵公司《安心住院费用医疗保险（2017版）（A款）》或《安心住院费用医疗保险（2017版）（B款）》，并声明以上陈述及各 项细节均真实无讹，且没有隐瞒任何重大事实以影响贵公司评估风险或接受本投保申请。  </p>
                    </li>
                    <li><p>2.本人已认真阅读《安心财产保险有限责任公司安心住院费用医疗保险（2017版）（A款） 条款》或《安心住院费用医疗保险（2017版）（B款） 条款》的所有条款，尤其是“不能获得赔偿的情形”并对贵公司就保险合同的内容说明和提 示完全理解，没有异议，申请投保。  </p>
                    </li>
                    <li><p>3.本人知晓本投保申请将构成投保人与贵公司所签署的保险合同的依据，若未能披露 与本保险相关之重大事实将可能导致贵公司不承担任何保险责任。保险合同生效日期以保险 单所载生效日期为准，贵公司承担保险责任须以投保人缴付约定保险费并经贵公司同意承保 为前提。  </p>
                    </li>
                    <li><p>4.本人同意贵公司为本保险的目的收集本人的个人资料，无论该资料是从本投保申请 或其他地方所获取，并授权可由贵公司及贵公司的合作方用于该保险的投保审核;提供与该 保险有关之服务及与本人联络的用途。</p>
                    </li>
                  </ol>
                </div>
                <section class="submit-button">
                    <x-button type='primary' @click.native='showDeclare = false ; agreeDeclareCheck = true'>我已阅读《投保声明》</x-button>
                </section>
            </x-dialog>

            <x-dialog v-model="showAttention"
            :dialog-style="{'max-width': '90%', width: '90%'}">
                <div class="dialog-div">
                  <div class="mdFormart_box_content_index">
                    <p>（1）适用人群：投保人18周岁及以上；被保险人30天至60周岁；  </p>
                    <p>（2）从事的职业风险等级为1-4类，具体分类见<a class="show-pdf" @click='showPDF(0, "职业代码表")'>职业代码表</a>；    </p>
                    <p>（3）每人限投保一份，多投无效；  </p>
                    <p>（4）保险期间：一年；    </p>
                    <p>（5）缴费方式：一次性缴费；    </p>
                    <p>（6）投保规则:a．生存受益人必须为本人。b．被保险人与投保人必须为以下之一：本人、配偶、子女、父母；  </p>
                    <p>（7）本保险自投保人投保支付成功后次日零时起生效。投保人投保后请尽快完成保费支付，未及时支付的订单将在投保当日24时自动失效，需重新点击购买；  </p>
                    <p>（8）本产品通过互联网在全国范围内销售；  </p>
                    <p>（9）本产品采用电子保单形式承保，法律效力等同于纸质保单。如果投保人需要纸质保单及发票，请拨打客服电话。若需寄送，邮费将由投保人自行承担；    </p>
                    <p>（10）温馨提示：安心互联网保险全国统一客服专线95303；</p>
                    <p>（11）如实告知：投保人如投保本保险，应依法履行如实告知义务；<a class="show-pdf" @click='showPDF(1, "违反如实告知的后果！")'>违反如实告知的后果！</a></p>
                    <p>（12）投保本保险前，请投保人认真阅读产品页面展示内容以及《安心住院费用医疗保险（2017版）（A款）》或《安心住院费用医疗保险（2017版）（B款）》条款。  </p>
                  </div>
                </div>
                <section class="submit-button">
                    <x-button type='primary' @click.native='showAttention = false ; agreeAttentionCheck = true'>我已阅读《投保须知》</x-button>
                </section>
            </x-dialog>

            <x-dialog v-model="showProvision"
            :dialog-style="{'max-width': '90%', width: '90%' }">
                <div class="dialog-div">
                  <a class="show-pdf" @click='showPDF(3, "安心住院费用医疗保险条款（2017版）（A款）")'>安心住院费用医疗保险条款（2017版）（A款）</a>
                  <br>
                  <br>
                  <a class="show-pdf" @click='showPDF(3, "安心住院费用医疗保险条款（2017版）（B款）")'>安心住院费用医疗保险条款（2017版）（B款）</a>
                </div>
                <section class="submit-button">
                    <x-button type='primary' @click.native='showProvision = false ; agreeProvisionCheck = true'>我已阅读《保险条款》</x-button>
                </section>
            </x-dialog>
            <confirm v-if='showOutCallConfirmSms'
            v-model='showOutCallConfirmSms'
            @on-confirm="inquirySmsConfirm"
            @on-cancel="inquirySmsCancel">
              <p style="text-align:left;">{{outCallConfirmSms.sms}}</p>
            </confirm>
        </group>
    </div>
</template>

<script>
import $ from 'zepto'
import {Group, Cell, XInput, GroupTitle, Confirm, XButton, XSwitch, CheckIcon, PopupRadio, DatetimeView, Popup, TransferDom, XDialog} from 'vux'

export default {

  components: {
    Popup,
    CheckIcon,
    Group,
    XDialog,
    DatetimeView,
    PopupRadio,
    Cell,
    XInput,
    GroupTitle,
    XSwitch,
    XButton,
    Confirm
  },
  directives: {
    TransferDom
  },

  data () {
    return {
      agreeCheck: false,
      hideUploadImage: false,
      agreeTotalCheck: false,
      agreeDeclareCheck: false,
      agreeAttentionCheck: false,
      agreeProvisionCheck: false,
      showDeclare: false,
      showAttention: false,
      showProvision: false,
      showOutCallConfirmSms: false,
      outCallConfirmSms: '',
      insuredRelationOptions: ['本人', '父母', '配偶', '子女'],
      flowData: {
        produceId: '',
        vendorId: '',
        socialInsuFlag: false,
        policyHolderEmail: '',
        policyHolderMobile: '',
        insuredRelation: '本人'
      },
      insured: {
        identity: '',
        name: '',
        birth: ''
      },
      policyHolder: {
        identity: '',
        name: '',
        birth: ''
      },
      userNameRules: function (value, user) {
        var valid = value.length > 0
        var msg = '请输入正确的' + user + '姓名'
        if (!valid) {
          this.$vux.toast.text(msg, 'top')
        }
        return valid
      },
      identityRules: function (value, user) {
        var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
        var result = reg.test(value)
        return {
          valid: result,
          msg: '请输入正确的' + user + '身份证号'
        }
      },
      userEmailRules: function (value, user) {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        var result = reg.test(value)
        return {
          valid: result,
          msg: '请输入正确的' + user + '电子邮箱'
        }
      },
      mobileRules: function (value, user) {
        var reg = /^1[34578]\d{9}$/
        var result = reg.test(value)
        return {
          valid: result,
          msg: '请输入正确的' + user + '手机号码'
        }
      }
    }
  },

  created () {
    this.flowData.produceId = this.$route.query.produceId
    this.flowData.vendorId = this.$route.query.vendorId
    if (this.$route.query.fromWhere && this.$route.query.token && this.$route.query.userId) {
      this.hideUploadImage = true
    }
    var hospitalFlowData = this.storage.get('anxinHospitalFlowData')
    if (hospitalFlowData) {
      if (hospitalFlowData.produceId) {
        this.flowData.produceId = hospitalFlowData.produceId
      }
      if (hospitalFlowData.vendorId) {
        this.flowData.vendorId = hospitalFlowData.vendorId
      }
      if (hospitalFlowData.socialInsuFlag) {
        this.flowData.socialInsuFlag = hospitalFlowData.socialInsuFlag
      }
      if (hospitalFlowData.policyHolderEmail) {
        this.flowData.policyHolderEmail = hospitalFlowData.policyHolderEmail
      }
      if (hospitalFlowData.policyHolderMobile) {
        this.flowData.policyHolderMobile = hospitalFlowData.policyHolderMobile
      }
      if (hospitalFlowData.insuredRelation) {
        this.flowData.insuredRelation = hospitalFlowData.insuredRelation
      }
      if (hospitalFlowData.policyHolder) {
        this.flowData.policyHolder = hospitalFlowData.policyHolder
        this.policyHolder = hospitalFlowData.policyHolder
      }
      if (hospitalFlowData.insured) {
        this.flowData.insured = hospitalFlowData.insured
        this.insured = hospitalFlowData.insured
      }
      if (hospitalFlowData.electricitySalesJobId) {
        this.flowData.electricitySalesJobId = hospitalFlowData.electricitySalesJobId
      }
      this.flowData.socialInsuFlag = Boolean(hospitalFlowData.socialInsuFlag)
    }
  },
  methods: {
    policyHolderIdentityChange () {
      if (this.flowData.insuredRelation === '本人') {
        var identity = this.policyHolder.identity
        this.insured.identity = identity
      }

      if (this.identityRules(this.policyHolder.identity, '投保人').valid) {
        if (this.policyHolder.identity.length === 18) {
          this.policyHolder.birth =
                        this.policyHolder.identity.substr(6, 4) + '-' +
                        this.policyHolder.identity.substr(10, 2) + '-' +
                        this.policyHolder.identity.substr(12, 2)
        }
      }
    },
    insuredIdentityChange () {
      if (this.identityRules(this.insured.identity, '被保人').valid) {
        if (this.insured.identity.length === 18) {
          this.insured.birth =
                        this.insured.identity.substr(6, 4) + '-' +
                        this.insured.identity.substr(10, 2) + '-' +
                        this.insured.identity.substr(12, 2)

          if (!this.judgeAge(this.insured.birth, 0, 80)) {
            this.$vux.toast.text('抱歉，暂时仅支持被保人0-80周岁的投保', 'top')
          }
        }
      }
    },
    judgeAge (birth, minAge, maxAge) {
      let brithArray = birth.split('-')
      let byear = brithArray[0]
      let bmouth = brithArray[1]
      let bday = brithArray[2]
      let nowDate = new Date()
      let nyear = nowDate.getFullYear()
      let nmouth = nowDate.getMonth() + 1
      let nday = nowDate.getDate()

      if ((nyear - byear) > minAge && (nyear - byear) <= maxAge) {
        return true
      } else if ((nyear - byear) < minAge || ((nyear - byear) > (maxAge + 1))) {
        return false
      } else {
        // 两种情况  一个是 minAge岁那年 , 一个是(maxAge + 1)岁那年
        if ((nyear - byear) === minAge) {
                    // minAge岁那年岁那年
          if ((nmouth - bmouth) > 0) {
            return true
          } else if ((nmouth - bmouth) < 0) {
            return false
          } else {
            if ((nday - bday) > 0) {
              return true
            } else {
              return false
            }
          }
        } else {
                    // (maxAge + 1)岁那年
          if ((nmouth - bmouth) > 0) {
            return false
          } else if ((nmouth - bmouth) < 0) {
            return true
          } else {
            if ((nday - bday) >= 0) {
              return false
            } else {
              return true
            }
          }
        }
      }
    },
    insuredRelationChange (value) {
      if (value === '本人') {
        var policy = {}
        policy = $.extend(true, policy, this.policyHolder)
        this.insured = policy
      }
    },
    policyHolderNameChange () {
      if (this.flowData.insuredRelation === '本人') {
        var name = this.policyHolder.name
        this.insured.name = name
      }
    },
    getInsuredRelationType (relation) {
      switch (relation) {
        case '本人' : {
          return 'SELF'
        }
        case '父母' : {
          return 'PARENT'
        }
        case '配偶' : {
          return 'LOVER'
        }
        case '子女' : {
          return 'CHILD'
        }
      }
    },
    showPDF (category, title) {
      this.saveFlowData()
      this.$router.push({ path: '/show-pdf',
        query: {
          category: category,
          title: title,
          fromWhere: this.$route.query.fromWhere ? this.$route.query.fromWhere : null,
          token: this.$route.query.token ? this.$route.query.token : null,
          userId: this.$route.query.userId ? this.$route.query.userId : null
        }
      })
    },
    agreeTotalDeclare (value) {
      this.agreeCheck = false
      if (this.agreeAttentionCheck && this.agreeDeclareCheck && this.agreeProvisionCheck) {
        this.agreeTotalCheck = !this.agreeTotalCheck
        this.agreeCheck = this.agreeTotalCheck
      } else {
        if (!this.agreeDeclareCheck) {
          this.$vux.toast.text('必须点击阅读《投保声明》', 'top')
        } else if (!this.agreeAttentionCheck) {
          this.$vux.toast.text('必须点击阅读《投保须知》', 'top')
        } else {
          this.$vux.toast.text('必须点击阅读《保险条款》', 'top')
        }
        this.agreeTotalCheck = false
      }
    },
    takePhotoToUserInformation (category) {
      if (category === 2 && this.flowData.insuredRelation === '本人') return
      var _this = this
      _this.$uploadImage(function (serverId, localId) {
        _this.$post(_this.host_bdd + '/autoInsurance/v1/upload/identity', {
          mediaId: serverId
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          if (rt.data.certPersonIdentity) {
            if (category === 1) {
              _this.policyHolder.identity = rt.data.certPersonIdentity.identity
              _this.policyHolder.name = rt.data.certPersonIdentity.name
              _this.policyHolder.birth = rt.data.certPersonIdentity.birth
            } else if (category === 2) {
              _this.insured.identity = rt.data.certPersonIdentity.identity
              _this.insured.name = rt.data.certPersonIdentity.name
              _this.insured.birth = rt.data.certPersonIdentity.birth
            }
          }
        })
      })
    },
    submitInfo () {
      if (this.userNameRules(this.policyHolder.name, '投保人') &&
                this.userNameRules(this.insured.name, '被保人')) {
        var policyHolderValid = this.identityRules(this.policyHolder.identity, '投保人')
        if (!policyHolderValid.valid) {
          this.$vux.toast.text(policyHolderValid.msg, 'top')
          return
        }

        var insuredValid = this.identityRules(this.insured.identity, '被保人')
        if (!insuredValid.valid) {
          this.$vux.toast.text(insuredValid.msg, 'top')
          return
        }

        if (!this.judgeAge(this.insured.birth, 0, 80)) {
          this.$vux.toast.text('抱歉，暂时仅支持被保人0-80周岁的投保', 'top')
          return
        }

        if (!this.policyHolder.birth) {
          this.$vux.toast.text('请输入正确的投保人出生日期', 'top')
          return
        }

        if (!this.insured.birth) {
          this.$vux.toast.text('请输入正确的被保人出生日期', 'top')
          return
        }

        if (!this.userEmailRules(this.flowData.policyHolderEmail).valid) {
          this.$vux.toast.text('请输入正确的投保人电子邮件', 'top')
          return
        }

        if (!this.mobileRules(this.flowData.policyHolderMobile).valid) {
          this.$vux.toast.text('请输入正确的投保人手机号码', 'top')
          return
        }

        if (!this.agreeCheck) {
          this.$vux.toast.text('必须同意遵守投保声明，投保须知，保险条款', 'top')
          return
        }
        this.flowData.insured = this.insured
        this.flowData.policyHolder = this.policyHolder
        var hospitalFlowData = {}
        hospitalFlowData = $.extend(true, hospitalFlowData, this.flowData)
        hospitalFlowData.insuredRelation = this.getInsuredRelationType(hospitalFlowData.insuredRelation)
        hospitalFlowData.socialInsuFlag = Number(hospitalFlowData.socialInsuFlag)
        if (this.hideUploadImage) {
          hospitalFlowData.fromWhere = this.$route.query.fromWhere
          hospitalFlowData.token = this.$route.query.token
          hospitalFlowData.tokenUserId = this.$route.query.userId
        }
        this.$vux.loading.show({
          text: '正在提交数据'
        })
        var _this = this
        this.$http.post(this.host_bdd + '/lifeInsurance/v1/answern', hospitalFlowData).then((rt) => {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          _this.payUrl = rt.data.payUrl
          _this.storage.set('anxinHospitalFlowData', null)
          if (hospitalFlowData.electricitySalesJobId && rt.data.inquirySms) {
            // 电销而来
            _this.showOutCallConfirmSms = true
            _this.outCallConfirmSms = rt.data.inquirySms
          } else {
            // 正常购买
            _this.goLianComplete()
          }
        })
      }
    },
    saveFlowData () {
      this.flowData.policyHolder = this.policyHolder
      this.flowData.insured = this.insured
      this.storage.set('anxinHospitalFlowData', this.flowData)
    },
    inquirySmsConfirm () {
      var _this = this
      this.$vux.loading.show({
        text: '正在发送'
      })
      this.$http.post(this.host_bdd + '/electricitySales/v1/sms/post', this.outCallConfirmSms).then((rt) => {
        _this.$vux.loading.hide()
        if (rt.data.code !== 200) {
          _this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        _this.$vux.toast.text('发送成功', 'top')
        _this.go(-1)
      })
    },
    inquirySmsCancel () {
      this.goLianComplete()
    },
    goLianComplete () {
      this.storage.set('anxinHospitalPayUrl', this.payUrl)
      this.$router.go(-1)
    }
  }
}
</script>
