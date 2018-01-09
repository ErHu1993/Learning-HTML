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

    .take-photo {
        float:right;
        display: inline-block;
        width: 28px;
        height:20px;
    }

    .remove-insured {
      float:left;
      display: inline-block;
      width: 28px;
      height:20px;
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

    .add-insured-button {
      padding: 0px 10px;
      background-color: #fff;
      margin-top: 10px;
      margin-bottom: 10px;
      height: 35px;
    }

    .weui-btn_plain-primary {
      font-size: 14px;
    }

</style>

<template>
    <div class="main">
        <group :gutter='0'>
            <group-title  class="section-title">
                <p>投保人信息</p>
                <img v-show='!hideUploadImage' src="../../../assets/camera.png" class="take-photo" @click='takePhotoToUserInformation(null, -1)'>
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
        </group>

        <group :gutter='0' v-for='(item, index) in insureds' :key='item.id'>
          <group-title  class="section-title">
              <img v-show='index > 2' src="../../../assets/delete.png"class="remove-insured"  @click='removeInsured(item, index)'>
              <p>被保人信息</p>
              <img v-show='!hideUploadImage' src="../../../assets/camera.png" class="take-photo" @click='takePhotoToUserInformation(item, index)'>
          </group-title>

          <popup-radio title="与投保人关系"
          :options="insuredRelationOptions"
          @on-change='insuredRelationChange(item, index)'
          v-model="item.insuredRelation">
          </popup-radio>

          <x-input
          title="姓名"
          placeholder="请输入被保人姓名"
          :disabled='item.insuredRelation == "本人"'
          v-model="item.name"
          text-align="right"
          placeholder-align="right"
          :is-type="userNameRules">
          </x-input>

          <x-input
          title="身份证号码"
          placeholder="请输入被保人证件号码"
          v-model="item.identity"
          :disabled='item.insuredRelation == "本人"'
          placeholder-align="right"
          text-align="right"
          @on-change='insuredIdentityChange(item, index)'
          :is-type="identityRules">
          </x-input>
          <x-switch class='switch-vertical-middle' title="有无社会基本医疗保险" v-model="item.socialInsuFlag"></x-switch>
        </group>

        <section v-if='insureds.length < 4' class="add-insured-button">
          <x-button plain type="primary" @click.native='addInsured'>添加一位被保人</x-button>
        </section>

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
                <li><p>本人自愿投保贵公司《安心 e 家医疗保障计划》，并声明以上陈述及各项细节均真实 无讹，且没有隐瞒任何重大事实以影响贵公司评估风险或接受本投保申请。  </p>
                </li>
                <li><p>本人已认真阅读《团体住院医疗保险条款(2016 版)》《附加团体门急诊医疗保险》 的所有条款，尤其是“不能获得赔偿的情形”并对贵公司就保险合同的内容说明和提示完全 理解，没有异议，申请投保。  </p>
                </li>
                <li><p>本人知晓本投保申请将构成投保人与贵公司所签署的保险合同的依据，若未能披露 与本保险相关之重大事实将可能导致贵公司不承担任何保险责任。保险合同生效日期以保险 单所载生效日期为准，贵公司承担保险责任须以投保人缴付约定保险费并经贵公司同意承保为前提。  </p>
                </li>
                <li><p>本人同意贵公司为本保险的目的收集本人的个人资料，无论该资料是从本投保申请 或其他地方所获取，并授权可由贵公司及贵公司的合作方用于该保险的投保审核;提供与该 保险有关之服务及与本人联络的用途。</p>
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
                <p>（1）适用人群：投保人18周岁-64周岁（含）；被保险人28天至64周岁（含）；  </p>
                <p>（2）职业类别：所有被保险人的职业等级应在1-4级<a class="show-pdf" @click='showPDF(0, "职业代码表")'>（6类职业表）</a>。无稳定工作，5-6类职业者拒保。</p>
                <p>（3）份数限制：一个家庭最多投保1份，且家庭中的每个被保险人仅限投保1份  </p>
                <p>（4）保险期间：一年；    </p>
                <p>（5）缴费方式：一次性缴费；    </p>
                <p>（6）投保规则:a. 家庭单时投保人必须为被保险人。b. 家庭单仅接受与投保人关系为“父母”、“子女”、“配偶”。c. 投保人的父母、子女不可同时存在于一张保单。d．生存受益人必须为本人。  </p>
                <p>（7）本保险自投保人投保支付成功后次日零时起生效。投保人投保后请尽快完成保费支付，未及时支付的订单将在投保当日24时自动失效，需重新点击购买；  </p>
                <p>（8）本产品通过互联网在全国范围内销售；  </p>
                <p>（9）本产品采用电子保单形式承保，法律效力等同于纸质保单。如果投保人需要纸质保单及发票，请拨打客服电话。若需寄送，邮费将由投保人自行承担；    </p>
                <p>（10）温馨提示：安心保险全国统一客服专线 95303；</p>
                <p>（11）如实告知：投保人如投保本保险，应依法履行如实告知义务；<a class="show-pdf" @click='showPDF(1, "违反如实告知的后果！")'>违反如实告知的后果！</a></p>
                <p>（12）投保本保险前，请投保人认真阅读产品页面展示内容以及《团体住院医疗保险条款（2016版）》《附加团体门急诊医疗保险条款》。  </p>
                <p>（13）偿付能力告知：安心财产保险有限责任公司2017年2季度核心偿付能力充足率为1049.61%，综合偿付能力充足率为1049.61%，偿付能力充足率已达到监管要求；风险综合评级告知：中国保监会发布了2017年1季度风险综合评级结果，安心财产保险有限责任公司被评定为B类。如果您还有任何疑问，请详细阅读保险条款或拨打安心保险客户服务热线 95303 进行咨询。    </p>
              </div>
            </div>
            <section class="submit-button">
                <x-button type='primary' @click.native='showAttention = false ; agreeAttentionCheck = true'>我已阅读《投保须知》</x-button>
            </section>
        </x-dialog>

        <x-dialog v-model="showProvision"
        :dialog-style="{'max-width': '90%', width: '90%' }">
            <div class="dialog-div">
              <a class="show-pdf" @click='showPDF(4, "安心e家--附加团体门急诊医疗保险")'>安心e家--附加团体门急诊医疗保险</a>
              <br>
              <br>
              <a class="show-pdf" @click='showPDF(4, "安心e家--团体住院医疗保险")'>安心e家--团体住院医疗保险</a>
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
        policyHolderEmail: '',
        policyHolderMobile: ''
      },
      insureds: [
        {
          identity: '',
          name: '',
          socialInsuFlag: false,
          insuredRelation: '本人'
        },
        {
          identity: '',
          name: '',
          socialInsuFlag: false,
          insuredRelation: '子女'
        },
        {
          identity: '',
          name: '',
          socialInsuFlag: false,
          insuredRelation: '子女'
        }
      ],
      policyHolder: {
        identity: '',
        name: ''
      },
      payUrl: '',
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
    var ehomeFlowData = this.storage.get('anxinEhomeFlowData')
    if (ehomeFlowData) {
      if (ehomeFlowData.produceId) {
        this.flowData.produceId = ehomeFlowData.produceId
      }
      if (ehomeFlowData.vendorId) {
        this.flowData.vendorId = ehomeFlowData.vendorId
      }
      if (ehomeFlowData.policyHolderEmail) {
        this.flowData.policyHolderEmail = ehomeFlowData.policyHolderEmail
      }
      if (ehomeFlowData.policyHolderMobile) {
        this.flowData.policyHolderMobile = ehomeFlowData.policyHolderMobile
      }
      if (ehomeFlowData.policyHolder) {
        this.flowData.policyHolder = ehomeFlowData.policyHolder
        this.policyHolder = ehomeFlowData.policyHolder
      }
      if (ehomeFlowData.insureds) {
        this.flowData.insureds = ehomeFlowData.insureds
        this.insureds = ehomeFlowData.insureds
      }
      if (ehomeFlowData.electricitySalesJobId) {
        this.flowData.electricitySalesJobId = ehomeFlowData.electricitySalesJobId
      }
    }
  },
  methods: {
    addInsured () {
      this.insureds.push({
        identity: '',
        name: '',
        socialInsuFlag: false,
        insuredRelation: '子女'
      })
    },
    policyHolderNameChange () {
      for (var i = 0; i < this.insureds.length; i++) {
        var insured = this.insureds[i]
        if (insured.insuredRelation === '本人') {
          insured.name = this.policyHolder.name
          this.insureds.splice(i, 1, insured) // 假装更改数组数据 强制更新dom
        }
      }
    },
    policyHolderIdentityChange () {
      for (var i = 0; i < this.insureds.length; i++) {
        var insured = this.insureds[i]
        if (insured.insuredRelation === '本人') {
          insured.identity = this.policyHolder.identity
          this.insureds.splice(i, 1, insured) // 假装更改数组数据 强制更新dom
        }
      }
    },
    insuredIdentityChange (item, index) {
      if (this.identityRules(item.identity, '被保人').valid) {
        if (item.identity.length === 18) {
          let birth =
                        item.identity.substr(6, 4) + '-' +
                        item.identity.substr(10, 2) + '-' +
                        item.identity.substr(12, 2)

          if (!this.judgeAge(birth, 0, 80)) {
            item.outAge = true
            this.$vux.toast.text('抱歉，暂时仅支持被保人0-80周岁的投保', 'top')
          } else {
            item.outAge = false
          }
        }
      }
    },
    insuredRelationChange (item, index) {
      if (item.insuredRelation === '本人') {
        var insured = {
          identity: '',
          name: '',
          socialInsuFlag: false,
          insuredRelation: '子女'
        }
        insured = $.extend(true, insured, this.policyHolder)
        insured.insuredRelation = '本人'
        this.insureds.splice(index, 1, insured) // 假装更改数组数据 强制更新dom
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
    removeInsured (item, index) {
      this.insureds.splice(index, 1)
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
    saveFlowData () {
      for (let i = 0; i < this.insureds.length; i++) {
        this.insureds[i].socialInsuFlag = Boolean(this.insureds[i].socialInsuFlag)
      }
      this.flowData.policyHolder = this.policyHolder
      this.flowData.insureds = this.insureds
      this.storage.set('anxinEhomeFlowData', this.flowData)
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
    takePhotoToUserInformation (item, index) {
      if (item && item.insuredRelation === '本人') return
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
            if (index === -1) {
              _this.policyHolder.identity = rt.data.certPersonIdentity.identity
              _this.policyHolder.name = rt.data.certPersonIdentity.name
            } else {
              item.identity = rt.data.certPersonIdentity.identity
              item.name = rt.data.certPersonIdentity.name
              _this.insureds.splice(index, 1, item) // 假装更改数组数据 强制更新dom
            }
          }
        })
      })
    },
    submitInfo () {
      if (this.userNameRules(this.policyHolder.name, '投保人')) {
        let identityValid = this.identityRules(this.policyHolder.identity, '投保人')
        if (!identityValid.valid) {
          this.$vux.toast.text(identityValid.msg, 'top')
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
        for (let i = 0; i < this.insureds.length; i++) {
          let insured = this.insureds[i]
          if (this.userNameRules(insured.name, ('第' + (i + 1) + '被投保人'))) {
            let identityValid = this.identityRules(insured.identity, ('第' + (i + 1) + '被投保人'))
            if (!identityValid.valid) {
              this.$vux.toast.text(identityValid.msg, 'top')
              return
            }
            if (insured.outAge) {
              this.$vux.toast.text('第' + (i + 1) + '被投保人' + '年龄超过投保范围', 'top')
              return
            }
          } else {
            return
          }
        }
        if (!this.agreeCheck) {
          this.$vux.toast.text('必须同意遵守投保声明，理赔须知，保险条款', 'top')
          return
        }
        this.flowData.insureds = this.insureds
        this.flowData.policyHolder = this.policyHolder
        var ehomeFlowData = {}
        ehomeFlowData = $.extend(true, ehomeFlowData, this.flowData)
        for (let i = 0; i < ehomeFlowData.insureds.length; i++) {
          ehomeFlowData.insureds[i].insuredRelation = this.getInsuredRelationType(ehomeFlowData.insureds[i].insuredRelation)
          ehomeFlowData.insureds[i].socialInsuFlag = Number(ehomeFlowData.insureds[i].socialInsuFlag)
          ehomeFlowData.insureds[i].insured = {
            identity: ehomeFlowData.insureds[i].identity,
            name: ehomeFlowData.insureds[i].name
          }
        }
        if (this.hideUploadImage) {
          ehomeFlowData.fromWhere = this.$route.query.fromWhere
          ehomeFlowData.token = this.$route.query.token
          ehomeFlowData.tokenUserId = this.$route.query.userId
        }
        this.$vux.loading.show({
          text: '正在提交数据'
        })
        var _this = this
        this.$http.post(this.host_bdd + '/lifeInsurance/v1/answern', ehomeFlowData).then((rt) => {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          _this.payUrl = rt.data.payUrl
          _this.storage.set('anxinEhomeFlowData', null)
          if (ehomeFlowData.electricitySalesJobId && rt.data.inquirySms) {
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
      this.storage.set('anxinEhomePayUrl', this.payUrl)
      this.$router.go(-1)
    }
  }
}
</script>
