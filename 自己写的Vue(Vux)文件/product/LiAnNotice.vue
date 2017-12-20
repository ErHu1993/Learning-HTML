<style lang="scss" scoped>
    .child-view {
        overflow:hidden;
    }

    .container {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 45px;
        left: 0;
        width: 100%;
        padding: 10px;
        font-size: 16px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    header h3{
        text-align: center;
        line-height: 30px;
        padding-bottom: 8px;
    }

    li {
        padding: 3px 0px 3px 0px;
        font-size: 14px;
        text-indent: 2em;
        color: #333;
        line-height: 22px;

        a {
            color: #0099cb;
        }
    }

    .bottom {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        border-top: solid 1px #d3dee4;

        a {
            float: left;
            width: 50%;
            height: 44px;
            line-height: 44px;
            text-align: center;

            &:first-child {
                color: #0099cb;
            }

            &:last-child {
                color: #fff;
                background-color: #0099cb;
            }
        }
    }
</style>

<template>
<div>
    <section class="container">
        <header>
            <h3>健康告知：被保险人是否符合以下任意一项描述?</h3>
        </header>
        <section>
            <ul>
                <li>1. 被保险人职业是否属于《利安人寿职业分类表》中5、6、7类职业？</li>
                <li class="footer-a"><a href="http://bao.data88.cn/h5/company/eb8f3b/product/careers?productCode=4aa8f76ac9#product">《利安保险职业类别表》</a></li>
                <li>2. 被保险人是否在投保其它保险公司人身保险时，被拒保、延期、附加条件或加费承保、提出或已经得到理赔？</li>
                <li>3. 被保险人目前或过去一年内是否去医院进行过门诊的检查、服药、手术或其他治疗？过去三年内是否曾有医学检查结果异常？过去五年内是否曾住院检查或治疗？（以上三项询问不包括因顺产、剖腹产、鼻炎、急性胃肠炎、上呼吸道感染（普通感冒）导致的检查和治疗）</li>
                <li>4. 被保险人是否目前患有或曾经有过下列症状、疾病史？</li>
                <li>A. 脑、神经系统及精神方面疾病，例如：反复头痛或眩晕、癫痫、脑血管畸形、脑血管意外、帕金森氏症、脑囊肿、脊髓疾病、神经官能症、抑郁症、神经衰弱、其他精神疾患。</li>
                <li>B. 心血管系统疾病，例如：心慌、胸痛、胸闷、原因不明的晕厥、心律失常、2级以上高血压（收缩压大于160mmHg\舒张压大于100mmHg）、心肌梗塞、风湿热、室壁瘤、动脉瘤。</li>
                <li>C. 呼吸系统疾病，例如：反复咳嗽咳痰、咳血、气喘、呼吸困难、慢性支气管炎、肺气肿、哮喘、支气管扩张、尘肺、间质性肺病、肺纤维化、胸腔积液。</li>
                <li>D. 消化系统疾病，例如：肝区疼痛、黄疸、呕血、便血、食道静脉曲张、胃溃疡、十二指肠溃疡、胰腺炎、肝炎、乙肝病毒携带、多囊肝、胆石症、脾肿大、慢性或溃疡性结肠炎。</li>
                <li>E. 泌尿系统疾病，例如：尿糖阳性、血尿、蛋白尿、反复尿路感染、尿路畸形、肾移植、肾积水、肾囊肿、泌尿系结石、泌尿系外伤或手术史。</li>
                <li>F. 骨骼、肌肉、结缔组织疾病，例如：关节红肿或酸痛、关节炎、强直性脊柱炎、椎间盘增生或突出、股骨头坏死、肌营养不良症、干燥综合症、系统性红斑狼疮。</li>
                <li>G. 内分泌、血液系统疾病，例如：糖尿病、痛风、高尿酸血症、甲状腺疾病、原因不明的发热、皮肤和粘膜及齿龈出血、脾功能亢进、白血病、血友病、各类贫血、白塞氏病、紫癫。</li>
                <li>H. 五官科疾病，例如：原因不明的声音嘶哑、听力下降、耳鸣、复视、视力明显下降（800度近视以上）、美尼尔病。</li>
                <li>I. 各种肿瘤或包块，包括：癌症、肿瘤、腺瘤、息肉、囊肿、赘生物、血管瘤等。</li>
                <li>J. HIV病毒感染，艾滋病，艾滋相关综合征或其他免疫系统疾病，传染病或性病。</li>
                <li>K. 原因不明的发热、消瘦（体重一年内下降超过5公斤）、肥胖等。</li>
                <li>L. 有职业病、酒精中毒、其它物品中毒、药物滥用或服用毒品史。</li>
                <li>M. 智能障碍、失明、聋哑及言语、咀嚼或身体其他部位缺损、残疾或功能障碍。</li>
                <li>5. 2周岁以下的被保险人是否有以下情况之一：出生时体重低于2.5公斤；早产、难产或产伤、窒息等异常情况；畸形、发育迟缓、惊厥、抽搐、脑瘫、先天性和遗传性疾病。</li>
            </ul>
        </section>
    </section>
    <section class="clearfix bottom">
        <a @click='showAlert'>部分为是</a>
        <a @click='goInputInformation'>以上全否</a>
    </section>

    <alert v-model="show" title="很抱歉,被保人不满足该保险投保规定。如有疑问,请联系客服">
        <a href="tel:400-808-0080">400-808-0080</a>
    </alert>

</div>
</template>

<script>
import { Alert } from 'vux'

export default {

  components: {
    Alert
  },

  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.$nextTick(function () {
      var payUrl = this.storage.get('liAnPayUrl')
      if (payUrl && (typeof (payUrl) === 'string')) {
        this.storage.set('liAnPayUrl', null)
        if (this.$route.query.fromWhere === 'APP') {
          window.location.href = decodeURIComponent(this.getParams(payUrl.split('?')[1]).payUrl)
        } else {
          window.location.href = payUrl + '&fromWhere=' + this.$route.query.fromWhere + '&token=' +
          this.$route.query.token + '&userId=' + this.$route.query.userId
        }
      }
    })
  },
  methods: {
    getParams (paramsString) {
      // url获取，变量声明
      var arrURL = paramsString.split("&"), arrParms , key, val, getURL = {} // eslint-disable-line
      // 取值，存入对象
      for (var i = 0; i < arrURL.length; i++) {
        arrParms = arrURL[i].split('=')
        key = arrParms[0]
        val = arrParms[1]
        getURL[key] = val
      }
      return getURL
    },
    showAlert () {
      this.show = true
    },
    goInputInformation () {
      if (this.$route.query.fromWhere && this.$route.query.token && this.$route.query.userId) {
        window.location.href = window.location.origin + '/r/-LACXRSBX?fromWhere=' + this.$route.query.fromWhere + '&token=' +
        this.$route.query.token + '&userId=' + this.$route.query.userId
      } else {
        window.location.href = window.location.origin + '/r/-LACXRSBX'
      }
    }
  }

}
</script>
