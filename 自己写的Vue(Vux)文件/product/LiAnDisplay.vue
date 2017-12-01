<style scoped>

    .main {
        width: 100%;
    }

    .top{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 45px;
        left: 0;
        background-color: #1bc6d1;
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .bottom-nav {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 45px;
        width: 100%;
        overflow: hidden;
    }

    .bottom-right {
        float: right;
        background-color: #fda952;
        text-align: center;
        height: 100%;
        width: 50%;
        color: #fff;
    }

    .bottom-right span {
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
    }

    .bottom-left {
        float: left;
        text-align: center;
        height: 100%;
        margin-left: 0px;
        width: 50%;
        color: #fff;
    }

    .bottom-left span {
        display: inline-block;
        vertical-align: middle;
        color: red;
        font-size: 16px;
    }


    i {
        display: inline-block;
        vertical-align: middle;
        height: 100%;
    }

    .weui-btn {
        background-color: #fca142;
    }

    .weui-btn:after {
        border : 0px;
    }

    .weui-input{
        color : red;
    }

    .premium-span {
        position:absolute;
        left:90px;
        top:14px;
        color:red;
    }

    .lian-logo {
        text-align: center;
        background-color: #f3f5f7;
        height: 55px;
    }

    .lian-logo img{
        width: 105px;
        display: inline-block;
        vertical-align: middle;
    }

    .card-flex {
      display: flex;
    }

    .card-flex > div {
      flex: 1;
      padding: 13px 0;
      text-align: center;
    }

    .card-bottom-line {
        border-bottom: 2px solid #f4f7f9;
    }

    .card-bottom-choose {
        border-bottom: 2px solid #56b4d9;
    }

    .card-flex span {
        font-size: 15px;
        vertical-align: middle;
        display: inline-block;
        color: #56b4d9;
    }

    .card-flex strong {
        height:30px;
        width:1px;
        margin: auto 0px;
        background-color: #ebebeb;
    }

    .card-flex label{
        color:#9a9a9a;
    }

    .product-light-div {
        background-color: #fff;
        text-align: center;
    }

    .product-step-one {
        width: 120px;
        margin: 10px auto;
    }

    .product-example {
        margin: 15px 10px;
        font-size: 14px;
        border-radius: 5px;
        border: 1px solid #56b4d9;
        position: relative;
    }

    .product-user{
        overflow: hidden;
    }

    .product-user-img{
        float: left;
        width: 30px;
        margin-left: 20px;
        margin-top: 20px;
    }

    .product-user-info{
        text-align: left;
        float: left;
        margin-left: 10px;
        margin-top: 20px;
        display: inline-block;
    }


    .product-user-info span{
        margin-top: 5px;
        display: block;
    }


    .product-user-info a {
        color: #65bbdd;
    }

    .product-spend-cost {
        margin-left: 20px;
        text-align: left;
        margin-top: 10px;
    }

    .product-spend-cost span{
        margin-top: 5px;
        display: block;
    }

    .product-spend-cost a{
        color: #65bbdd;
    }

    .product-tod {
        width: 250px;
        margin: 15px auto;
    }

    .product-step-two{
        background-color: #fff;
        position:relative;
        top: -21px;
        margin: 0 auto;
        width: 125px;
        padding: 0 2.5px;
    }

    .product-step-two span {
        position: absolute;
        width: 100%;
        text-align: center;
        left: 0;
        top:  0;
        color: #65bbdd;
    }

    .product-overview{
        margin-top: 30px;
        padding-bottom: 2px;
    }

    .product-table{
        color: #65bbdd;
        font-size: 16px;
        text-align: left;
        background-color: #fff;
        padding-bottom: 5px;
    }

    .product-table-title{
        border-top: 1px solid ;
        padding:5px;
        border-right: 1px solid;
        width: 30%;
        text-align: left;
    }

    .product-table-content{
        border-top: 1px solid ;
        padding:10px;
        width: 70%;
        text-align: left;
    }

    .product-table-bg {
        background-color: #c6e7f2;
    }

    .product-question{
        margin: 0px 10px;
        margin-top: 40px;
        border-top: 2px solid #65bbdd;
    }

    .product-question-title {
        margin-top: 10px;
        text-align: left ;
    }


    .product-question-title img{
        top: 6px;
        position: relative;
    }

    .product-question-title  h2{
        display: inline;
        font-weight: normal;
        margin-left: 5px;
    }

    .product-question-content{
        margin-top: 5px;
        text-align: left;
    }

    .product-question-content span {
        color: red;
    }

    .plain-detail-title{
        background-color: #fff;
        padding: 0px 20px;
        padding-top: 20px;
    }

    .plain-detail-title h3{
        text-align: center;
        font-weight: normal;
        padding: 10px 0px;
    }

    .plain-detail-table{

    }

    .plain-table-title{
        width: 50%;
        text-align: center;
    }

    .plain-table-content{
        width: 50%;
        text-align: center;
    }


    .company{
        text-align: center;
        padding: 20px 0px;
        color: gray;
        background-color: #e9eef2;
    }

</style>

<template>
    <div class="main">
        <div class="top">
            <div class="content">
                <div><img src="../../assets/lian/li-banner.png" width='100%' style="display:block;"></div>
                <group gutter='0'>
                    <x-switch class='switch-vertical-middle'
                        title="有无社会基本医疗保险"
                        v-model="customer.haveHealthInsurance"
                        @on-change='healthInsuranceChange'>
                    </x-switch>
                    <popup-picker title="请选择您的年龄段"
                        :data="ageOtions"
                        placeholder="请选择"
                        v-model="customer.ageOption"
                        @on-change='ageOtionChange'>
                    </popup-picker>

                    <cell title='保费金额 : '>
                        <div slot="value">
                            <span class="premium-span">{{customer.premiumAccount ?  "¥ " + customer.premiumAccount : ""}}</span>
                            <x-button type="plain" mini>计算保费</x-button>
                        </div>
                    </cell>
                </group>
                <div class="lian-logo">
                    <img src="../../assets/lian/lianlog.png"><i></i>
                    <span>由利安承保并负责理赔</span>
                </div>

                <card style="margin-top: 0px;">
                    <div slot="content" class="card-flex card-content">
                        <div class="card-bottom-line" v-bind:class="{ 'card-bottom-choose' : chooseIndex == 0 }" @click='chooseIndex = 0'>
                            <span>产品亮点</span><i></i>
                        </div>
                        <strong></strong>
                        <div class="card-bottom-line" v-bind:class="{ 'card-bottom-choose' : chooseIndex == 1 }" @click='chooseIndex = 1'>
                            <span>保障计划详情</span><i></i>
                        </div>
                    </div>
                </card>
                <div v-if='!chooseIndex' class="product-light-div">
                    <img src="../../assets/lian/li-one.png" class="product-step-one">
                    <img src="../../assets/lian/li-two.png" width="95%">
                    <div class="product-example">
                        <div class="product-step-two">
                            <img src="../../assets/lian/li-twos.png" width="100%">
                        </div>
                        <div class="product-user">
                            <img src="../../assets/lian/li-two-user.png" class="product-user-img">
                            <div class="product-user-info">
                                <span>王先生，男，35岁</span>
                                <span>上海住院就医院总支出<a>2.7万元</a></span>
                            </div>
                        </div>
                        <div class="product-spend-cost">
                            <span>国家统筹承担<a>16575元</a></span>
                            <span>医保个人账户支出<a>2925</a>，现金支付<a>7500元</a></span>
                        </div>
                        <div class="product-tod">
                            <img src="../../assets/lian/li-two-fo.png" width="100%">
                        </div>
                    </div>
                    <div class="product-example product-overview">
                        <div class="product-step-two">
                            <img src="../../assets/lian/li-three.png" width="100%">
                            <span>保障概述</span>
                        </div>
                        <p style="margin-top: -15px;">适应人群：5-49周岁</p>
                        <p>（可续保至59岁）</p>
                        <div style="overflow:hidden;">
                            <span style="float:left;margin-left: 10px;">保险期限：1年</span>
                            <span style="float:right;margin-right: 10px;">年度总限额：80万</span>
                        </div>
                        <div class="product-table">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tbody v-for="item in productTableData">
                                    <tr>
                                        <td class="product-table-title"
                                        :class="{ 'product-table-bg' : item.showBgColor}">
                                        {{item.title}}</td>
                                        <td class="product-table-content"
                                        :class="{ 'product-table-bg' : item.showBgColor}">
                                            <p v-for="p in item.content">{{p}}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="product-question">
                        <div class="product-step-two">
                            <img src="../../assets/lian/li-five.png" width="100%">
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px"><i></i>
                            <h2>哪些医院可以获得理赔在保障责任范围内在保障责任范围内</h2>
                        </div>
                         <div class="product-question-content">
                            <p>在中华人民共和国境内（不含港、澳、台地区）<span>二级及以上公立医院普通部（不含特需及外宾病房）接受住院、特殊门诊的</span> ，在保障责任范围内，<span>报销合理且必须的医疗费用。</span></p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>年免赔额1万怎么理解？</h2>
                        </div>
                        <div class="product-question-content">
                            <p>我们提供市场唯一且客户利益最大化的免赔额。保单年度内被保险人从其他途径获得的医疗费用补偿，包含已从社会医疗保险、公费医疗、商业性医疗保险、其他政府机构或者社会福利机构获得医疗费用补偿，可以计入免赔额。</span></p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>买了保险后立刻就能理赔吗？</h2>
                        </div>
                        <div class="product-question-content">
                            <p class="cont-texts">您首次投保或非连续投保本保险时，被保险人因腺样体肥大、疝气、扁桃腺的疾病或女性生殖器官的疾病需要住院治疗或特殊门诊治疗的，自本保险合同生效之日起<span>90</span>日为等待期；被保险人因其他疾病需要住院治疗或特殊门诊治疗的，自本合同生效日起<span>30</span>日为等待期。</span>被保险人在等待期内发生的保险事故，我们不承担给付保险金的责任。</p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>没带医保卡理赔会受到影响吗？</h2>
                        </div>
                        <div class="product-question-content">
                            <p >治疗后请尽快前往医保所在地的医疗保险事务中心进行医保结算，之后就能正常获得赔付。若未进行医保结算申请理赔，我们将先行扣除医保范围内医疗费用的<span>20%</span>部分。</span></p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>门诊费用可以报销吗？</h2>
                        </div>
                        <div class="product-question-content">
                            <p>门诊肾透析、门诊恶性肿瘤放化疗或器官移植后的门诊抗排异治疗可以报销。</span></p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>什么是就医安排？</h2>
                        </div>
                        <div class="product-question-content">
                            <p>等待期后当被保险人初次确诊罹患癌症，可致电客服，我们可为此被保险人安排一次国内三甲医院门诊就医。</span></p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>保险到期了应该如何续保？</h2>
                        </div>
                        <div class="product-question-content">
                            <p>保险合同期满前，我们将通知您续保，届时您可根据相关提示进行操作。</span></p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>投保前已经生病可以报销吗？</h2>
                        </div>
                        <div class="product-question-content">
                            <p>不可以。本险种不接受带病投保的行为。投保前已患有的疾病以及症状，均不属于保障范围。</span></p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>我的隐私安全吗？</h2>
                        </div>
                        <div class="product-question-content">
                            <p>利安人寿严格遵守现行的关于个人信息、数据及隐私保护的法律法规，采取充分的技术手段和制度管理，保护您提供给我们的个人信息、数据及隐私不受到非法泄露或批露给未经授权的第三方。</span></p>
                        </div>

                        <div class="product-question-title">
                            <img src="../../assets/lian/lass.png" width="26px">
                            <h2>利安人寿的偿付能力和风险综合评级？</h2>
                        </div>
                        <div class="product-question-content">
                            <p>利安人寿2016年4季度综合偿付能力充足率309%，最近一个季度的风险综合评级（分类监管）结果为A级。</span></p>
                        </div>
                    </div>
                </div>
                <div v-if='chooseIndex' class="plain-detail-div">
                    <div class="plain-detail-title">
                        <p>保险涵盖医院：中国大陆地区二级或二级以上公立医院普通医疗部（不含特需及外宾病房</p>
                        <h3>计划1</h3>
                    </div>
                    <div class="product-table plain-detail-table">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tbody v-for="item in plainDetailTableData">
                                <tr>
                                    <td class="product-table-title plain-table-title"
                                    :class="{ 'product-table-bg' : item.showBgColor}">
                                    {{item.title}}</td>
                                    <td class="product-table-content plain-table-content"
                                    :class="{ 'product-table-bg' : item.showBgColor}">
                                        <p v-for="p in item.content">{{p}}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="company">
                    <p>本产品承保公司：利安人寿保险股份有限公司</p>
                    <p>再保公司：法国再保险公司</p>
                    <p>理赔服务：上海易雍健康信息咨询有限公司</p>
                </div>
            </div>
        </div>
        <div class="bottom-nav">
            <div class="bottom-left">
                <span>{{customer.premiumAccount ?  "¥ " + customer.premiumAccount : ""}}</span><i></i>
            </div>
            <div class="bottom-right" @click='insuredClick'>
                <span>立即投保</span><i></i>
            </div>
        </div>
    </div>
</template>

<script>
import {Group, Cell, XInput, Card, XButton, XSwitch, Picker, PopupPicker} from 'vux'

export default {

  components: {
    Group,
    Cell,
    Card,
    XInput,
    XSwitch,
    XButton,
    Picker,
    PopupPicker
  },

  data () {
    return {
      ageOtions: [['请选择', '5-9岁', '10-14岁', '15-19岁', '20-24岁', '25-29岁', '30-34岁', '35-39岁', '40-44岁', '45-49岁']],
      chooseIndex: 0,
      customer: {
        haveHealthInsurance: false,
        ageOption: [],
        premiumAccount: ''
      },
      productTableData: [
        {
          title: '住院医疗费',
          content: [
            '80万'
          ],
          showBgColor: true
        },
        {
          title: '特殊门诊医疗费',
          content: [
            '门诊肾透析费10万',
            '门诊癌症放疗费10万',
            '器官移植后的门诊抗排异治疗费80万'
          ],
          showBgColor: false
        },
        {
          title: '免赔费',
          content: [
            '1万',
            '从其他途径获得的补偿都可抵扣免赔额，包括医保统筹'
          ],
          showBgColor: true
        },
        {
          title: '药品范围',
          content: [
            '甲乙类药、丙类药、自费药、进口药品都可以报销（不限社保用药及医保目录）'
          ],
          showBgColor: false
        }
      ],
      plainDetailTableData: [
        {
          title: ' ',
          content: [
            '计划1'
          ],
          showBgColor: true
        },
        {
          title: '保障区域',
          content: [
            '中国大陆'
          ],
          showBgColor: false
        },
        {
          title: '年度总限额',
          content: [
            '800,000元'
          ],
          showBgColor: false
        },
        {
          title: '赔付比例',
          content: [
            '100%'
          ],
          showBgColor: false
        },
        {
          title: '年度免赔额',
          content: [
            '10,000元'
          ],
          showBgColor: false
        },
        {
          title: '住院医疗费用保险金',
          content: [
            ' '
          ],
          showBgColor: true
        },
        {
          title: '床位费、膳食费、护理费(最多180日/年)',
          content: [
            '2,000元/日'
          ],
          showBgColor: false
        },
        {
          title: '检查检验费、治疗费',
          content: [
            '同年度总限额'
          ],
          showBgColor: false
        },
        {
          title: '药品费',
          content: [
            '同年度总限额'
          ],
          showBgColor: false
        },
        {
          title: '医生费',
          content: [
            '同年度总限额'
          ],
          showBgColor: false
        },
        {
          title: '非器官移植手术费',
          content: [
            '同年度总限额'
          ],
          showBgColor: false
        },
        {
          title: '特定器官移植手术费',
          content: [
            '300,000元/年'
          ],
          showBgColor: false
        },
        {
          title: '重症监护病房床位费',
          content: [
            '同年度总限额'
          ],
          showBgColor: false
        },
        {
          title: '救护车费',
          content: [
            '同年度总限额'
          ],
          showBgColor: false
        },
        {
          title: '特殊门诊医疗费用保险金',
          content: [
            ''
          ],
          showBgColor: true
        },
        {
          title: '门诊肾透析费',
          content: [
            '100,000元/'
          ],
          showBgColor: false
        },
        {
          title: '门诊癌症放化疗费',
          content: [
            '100,000元/'
          ],
          showBgColor: false
        },
        {
          title: '器官移植后的门诊抗排异治疗费',
          content: [
            '同年度总限额'
          ],
          showBgColor: false
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    healthInsuranceChange (oldValue, newValue) {
      this.ageOtionChange(this.customer.ageOption)
    },
    ageOtionChange (value) {
      switch (value[0]) {
        case '5-9岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '652.00'
            } else {
              this.customer.premiumAccount = '1,859.00'
            }
            break
          }
        case '10-14岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '356.00'
            } else {
              this.customer.premiumAccount = '1,008.00'
            }
            break
          }
        case '15-19岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '237.00'
            } else {
              this.customer.premiumAccount = '692.00'
            }
            break
          }
        case '20-24岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '237.00'
            } else {
              this.customer.premiumAccount = '692.00'
            }
            break
          }
        case '25-29岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '356.00'
            } else {
              this.customer.premiumAccount = '1,028.00'
            }
            break
          }
        case '30-34岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '474.00'
            } else {
              this.customer.premiumAccount = '1,345.00'
            }
            break
          }
        case '35-39岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '594.00'
            } else {
              this.customer.premiumAccount = '1,661.00'
            }
            break
          }
        case '40-44岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '770.00'
            } else {
              this.customer.premiumAccount = '2,135.00'
            }
            break
          }
        case '45-49岁' :
          {
            if (this.customer.haveHealthInsurance) {
              this.customer.premiumAccount = '989.00'
            } else {
              this.customer.premiumAccount = '2769.00'
            }
            break
          }
        default :
          {
            this.customer.premiumAccount = ''
          }
      }
    },
    insuredClick () {
      var liAnFlowData = {
        'produceId': this.$route.query.produceId,
        'vendorId': this.$route.query.vendorId,
        'socialInsuFlag': this.customer.haveHealthInsurance
      }
      this.storage.set('liAnFlowData', liAnFlowData)
      this.$router.push({path: '/product/lian/notice'})
    }
  }
}
</script>
