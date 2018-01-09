<style scoped>
  .main {
    height: 100%;
    border-radius: 10px;
    -moz-box-shadow:0px 0px 8px #535353;
    -webkit-box-shadow:0px 0px 8px #535353;
    box-shadow:0px 0px 8px #535353;
    background-color: #fff;
    padding-bottom: 10px;
  }

  .premium-span {
      position:absolute;
      right:15px;
      top:10px;
      color:red;
  }

  .handel {
    text-align: center;
  }

</style>

<template>
  <div class="main">
    <cell v-if='category == 1' title="最近回访时间" :value='dataItem.updateTime | formatData'></cell>
    <group gutter='0'>
      <cell title="姓名" :value='dataItem.jobDetail.owner'></cell>
      <cell title="出生日期" :value='dataItem.jobDetail.identity | getBirthDay'></cell>
      <x-switch class='switch-vertical-middle'
          title="有无社会基本医疗保险"
          v-model="medicalInsurance"
          @on-change='ageOptionChange'>
      </x-switch>
      <popup-picker title="请选择您的年龄段"
          :data="ageOption"
          placeholder="请选择"
          v-model="ageGroup"
          @on-change='ageOptionChange'>
      </popup-picker>
      <cell title='保费金额 : '>
          <div slot="value">
              <span class="premium-span">{{premiumAmount ?  "¥ " + premiumAmount : ""}}</span>
          </div>
      </cell>
      <x-textarea
        title="优惠措施"
        v-model='dataItem.jobDetail.discountDesc'
        :rows="1"
        :show-counter="false"
        readonly autosize>
      </x-textarea>
    </group>
    <div class="handel" v-model='secretNo'>
      <x-button
      type='primary'
      mini
      @click.native='handleResultClick()'
      v-show='secretNo'>选择处理结果</x-button>
      <x-button type='primary' mini @click.native='outCallHandle()'>外呼</x-button>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/libs/format.js'
import { XButton, Group, XSwitch, Cell, PopupPicker, XTextarea } from 'vux'
export default {
  props: {
    category: '', // 0:利安外呼  1:利安回访
    itemIndex: '',
    dataItem: {
      updateTime: '',
      jobDetail: {
        ageGroup: '',
        medicalInsurance: '',
        discountDesc: '',
        owner: '',
        identity: '',
        premiumAmount: ''
      }
    }
  },
  data () {
    return {
      ageOption: [['请选择', '5-9岁', '10-14岁', '15-19岁', '20-24岁', '25-29岁', '30-34岁', '35-39岁', '40-44岁', '45-49岁']],
      ageGroup: ['请选择'],
      premiumAmount: '',
      secretNo: '',
      medicalInsurance: false
    }
  },
  components: {
    XButton, XSwitch, Cell, Group, PopupPicker, XTextarea
  },
  created () {
    this.$nextTick(function () {
      this.secretNo = this.dataItem.secretNo
      this.ageGroup = this.getAgeGroup(this.dataItem.jobDetail.ageGroup)
      this.dataItem.jobDetail.ageGroup = this.ageGroup[0]
      this.medicalInsurance = !!this.dataItem.jobDetail.medicalInsurance
      this.ageOptionChange()
    })
  },
  methods: {
    getAgeGroup (ageGroup) {
      if (ageGroup) return [ageGroup]
      if (this.dataItem.jobDetail.identity.length === 18) {
        var age = new Date().getFullYear() - this.dataItem.jobDetail.identity.substr(6, 4) + 1
        for (var i = 0; i < this.ageOption[0].length; i++) {
          let group = this.ageOption[0][i]
          let arr = group.split('-')
          if (arr.length === 2) {
            if (age >= arr[0] && age <= arr[1].split('岁')[0]) {
              return [group]
            }
          }
        }
        return ['请选择']
      }
      return ['请选择']
    },
    getDiscountDesc () {
      var _this = this
      this.$post(_this.host_bdd + '/electricitySales/v1/job/discountDesc', {
        id: _this.dataItem.id,
        medicalInsurance: _this.dataItem.jobDetail.medicalInsurance ? 1 : 0,
        ageGroup: _this.ageGroup[0],
        premiumAmount: Math.round(Number(_this.dataItem.jobDetail.premiumAmount) * 100)
      }, function (rt) {
        _this.$vux.loading.hide()
        if (rt.data.code !== 200) {
          _this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        _this.dataItem.jobDetail.discountDesc = rt.data.discountDesc
      })
    },
    ageOptionChange () {
      this.dataItem.jobDetail.medicalInsurance = this.medicalInsurance
      switch (this.ageGroup[0]) {
        case '5-9岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '652.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '1859.00'
            }
            break
          }
        case '10-14岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '356.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '1008.00'
            }
            break
          }
        case '15-19岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '237.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '692.00'
            }
            break
          }
        case '20-24岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '237.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '692.00'
            }
            break
          }
        case '25-29岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '356.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '1028.00'
            }
            break
          }
        case '30-34岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '474.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '1345.00'
            }
            break
          }
        case '35-39岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '594.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '1661.00'
            }
            break
          }
        case '40-44岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '770.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '2135.00'
            }
            break
          }
        case '45-49岁' :
          {
            if (this.dataItem.jobDetail.medicalInsurance) {
              this.dataItem.jobDetail.premiumAmount = '989.00'
            } else {
              this.dataItem.jobDetail.premiumAmount = '2769.00'
            }
            break
          }
        default :
          {
            this.dataItem.jobDetail.premiumAmount = ''
            break
          }
      }
      this.premiumAmount = this.dataItem.jobDetail.premiumAmount
      if (this.dataItem.jobDetail.premiumAmount) {
        this.getDiscountDesc()
      }
    },
    handleResultClick () {
      this.$emit('handleResultClick', this.itemIndex)
    },
    outCallHandle () {
      if (this.dataItem.secretNo) {
        window.location.href = 'tel:' + this.dataItem.secretNo
      } else {
        var _this = this
        this.$vux.loading.show({
          text: '正在请求'
        })
        this.$post(this.host_bdd + '/electricitySales/v1/job/secretNo', {
          id: _this.dataItem.id
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          _this.dataItem.secretNo = rt.data.secretNo
          _this.secretNo = rt.data.secretNo
          if (_this.dataItem.secretNo) {
            window.location.href = 'tel:' + _this.dataItem.secretNo
          } else {
            _this.$vux.toast.text('获取号码错误', 'top')
          }
        })
      }
    }
  },
  filters: {
    // 时间格式化
    formatData (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    filterAmount (amount) {
      if (amount > 0) return amount
      return '--'
    },
    filterPlan (plan) {
      if (plan) return plan
      return '（空）'
    },
    getBirthDay (identity) {
      if (identity.length === 18) {
        let birth = identity.substr(6, 4) + '-' + identity.substr(10, 2) + '-' + identity.substr(12, 2)
        return birth
      } else {
        return '（空）'
      }
    }
  }
}
</script>
