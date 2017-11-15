<style scoped>
    .box{
        background-color: #fbf9fe;
    }

    .submit-button{
        padding: 0 15px;
        margin-top: 20px;
        height: 45px;
    }

    .section-title {
        overflow: hidden;
    }

    .section-title img {
        float:right;
        margin-bottom: 6px;
        width: 28px;
        height:21px;
    }

</style>

<template>
<div class="box">
    <group>
        <group-title slot="title" class="section-title">车辆信息
            <img
            src="../../assets/camera.png"
            @click='takePhotoToCarInformation'>
        </group-title>
        <datetime
        v-model="vehicle.registerDate"
        :default-selected-value='vehicle.registerDate'
        placeholder="请选择"
        title="登记日期"
        :is-type="registerDateRules">
        </datetime>
        <x-input
        title="车架号 "
        placeholder="请输入   "
        v-model="vehicle.vin"
        text-align="right"
        placeholder-align="right"
        :is-type="carFrameNumberRules">
        </x-input>
        <x-input
        title="发动机号"
        placeholder="请输入   "
        text-align="right"
        v-model="vehicle.engineNo"
        placeholder-align="right"
        :is-type="engineNumberRules">
        </x-input>
        <x-input
        title="品牌型号"
        placeholder="请输入   "
        text-align="right"
        v-model="vehicle.model"
        placeholder-align="right"
        :is-type="carModelRules">
        </x-input>
        <x-switch class='switch-vertical-middle' title="是否过户" v-model="customer.transfered"></x-switch>
        <datetime
        v-model="customer.transferTime"
        v-show='customer.transfered'
        placeholder="请选择"
        title="过户日期"
        :is-type="transferTimeRules">
        </datetime>
    </group>
    <group>
        <group-title slot="title" class="section-title">车主信息
            <img src="../../assets/camera.png" @click='takePhotoToUserInformation(0)'>
        </group-title>
        <x-input
        title="车主姓名"
        placeholder="请输入   "
        v-model="owner.name"
        text-align="right"
        placeholder-align="right"
        @on-change='ownerNameChange'
        :is-type="userNameRules">
        </x-input>
        <x-input
        title="身份证号"
        placeholder="请输入   "
        text-align="right"
        v-model="owner.identity"
        placeholder-align="right"
        @on-change='ownerIdentityChange'
        :is-type="identityRules">
        </x-input>
        <x-input
        title="手机号码"
        placeholder="请输入   "
        text-align="right"
        v-model="customer.ownerMobile"
        @on-change='ownerMobileChange'
        placeholder-align="right"
        :is-type="mobileRules">
        </x-input>
    </group>
    <group>
        <group-title slot="title" class="section-title">
            <img src="../../assets/camera.png" @click='takePhotoToUserInformation(1)'>
            <check-icon
                :value.sync="policyHolderSameAsOwner"
                @click.native='policyHolderSameAsOwnerClick(policyHolderSameAsOwner)'
                >投保人同车主
            </check-icon>
        </group-title>
        <x-input
        v-show='!policyHolderSameAsOwner'
        title="投保人姓名"
        placeholder="请输入   "
        text-align="right"
        :disabled='policyHolderSameAsOwner'
        v-model="policyHolder.name"
        placeholder-align="right"
        :is-type="userNameRules">
        </x-input>
        <x-input
        v-show='!policyHolderSameAsOwner'
        title="身份证号"
        placeholder="请输入   "
        text-align="right"
        :disabled='policyHolderSameAsOwner'
        v-model="policyHolder.identity"
        placeholder-align="right"
        :is-type="identityRules">
        </x-input>
        <x-input
        v-show='!policyHolderSameAsOwner'
        title="手机号码"
        placeholder="请输入   "
        text-align="right"
        :disabled='policyHolderSameAsOwner'
        v-model="customer.policyHolderMobile"
        placeholder-align="right"
        :is-type="mobileRules">
        </x-input>
    </group>
    <group>
        <group-title slot="title" class="section-title">
            <img src="../../assets/camera.png" @click='takePhotoToUserInformation(2)'>
            <check-icon
                :value.sync="insuredSameAsOwner"
                @click.native='insuredSameAsOwnerClick(insuredSameAsOwner)'
                >被投保人同车主
            </check-icon>
        </group-title>
        <x-input
        v-show='!insuredSameAsOwner'
        title="被投保人姓名"
        placeholder="请输入   "
        text-align="right"
        :disabled='insuredSameAsOwner'
        v-model="insured.name"
        placeholder-align="right"
        :is-type="userNameRules">
        </x-input>
        <x-input
        v-show='!insuredSameAsOwner'
        title="身份证号"
        placeholder="请输入   "
        text-align="right"
        :disabled='insuredSameAsOwner'
        v-model="insured.identity"
        placeholder-align="right"
        :is-type="identityRules">
        </x-input>
        <x-input
        v-show='!insuredSameAsOwner'
        title="手机号码"
        placeholder="请输入   "
        text-align="right"
        :disabled='insuredSameAsOwner'
        v-model="customer.insuredMobile"
        placeholder-align="right"
        :is-type="mobileRules">
        </x-input>
    </group>
    <section class="submit-button">
        <x-button type='primary' @click.native='nextStep'>获取报价</x-button>
    </section>
</div>
</template>

<script>
import $ from 'zepto'
import {Group, Cell, XInput, Datetime, GroupTitle, XButton, XSwitch, CheckIcon} from 'vux'

export default {

  components: {
    CheckIcon,
    Group,
    Cell,
    XInput,
    Datetime,
    GroupTitle,
    XSwitch,
    XButton
  },

  mounted: function () {
    this.$nextTick(function () {
      this.quotedPriceFlowData = this.storage.get('flowData')

      this.policyHolderSameAsOwner = Boolean(this.quotedPriceFlowData.policyHolderSameAsOwner)
      this.insuredSameAsOwner = Boolean(this.quotedPriceFlowData.insuredSameAsOwner)

      if (this.quotedPriceFlowData.plateNo && this.quotedPriceFlowData.plateNo.length > 2) {
        this.customer.hasPlateNo = 1
      }
      if (this.quotedPriceFlowData.vehicle) {
        this.vehicle = this.quotedPriceFlowData.vehicle
      }
      if (this.quotedPriceFlowData.customer) {
        this.customer = this.quotedPriceFlowData.customer
        this.customer.transfered = Boolean(this.customer.transfered)
        if (this.customer.transferTime) {
          this.customer.transferTime = this.$dateFormat(this.customer.transferTime, 'yyyy-MM-dd')
        }
      }
      if (this.quotedPriceFlowData.owner) {
        this.owner = this.quotedPriceFlowData.owner
      }
      if (this.quotedPriceFlowData.policyHolder) {
        this.policyHolder = this.quotedPriceFlowData.policyHolder
      }
      if (this.quotedPriceFlowData.insured) {
        this.insured = this.quotedPriceFlowData.insured
      }
    })
  },

  data () {
    return {
      policyHolderSameAsOwner: null, // 投保人信息同车主信息
      insuredSameAsOwner: null, // 被保人信息是否同车主信息 ,
      vehicle: {
        registerDate: '', // 登记日期
        engineNo: '', // 发动机号
        vin: '', // 车架号
        model: '' // 车牌型号
      },
      customer: {
        transferTime: '', // 过户日期
        transfered: false, // 过户是否
        hasPlateNo: 0, // 是否上牌
        ownerMobile: '',
        policyHolderMobile: '',
        insuredMobile: ''
      },
      owner: {
        name: '', // 车主姓名
        identity: '' // 身份证
      },
      policyHolder: {
        name: '', // 投保人姓名
        identity: '' // 身份证
      },
      insured: {
        name: '', // 被投保人姓名
        identity: '' // 身份证
      },
      quotedPriceFlowData: {
        city: '',
        vendorId: '',
        produceId: ''
      },
      registerDateRules: function (value) {
        var valid = value.length > 0
        var msg = '请选择登记日期'
        if (!valid) {
          this.$vux.toast.text(msg, 'top')
        }
        return valid
      },
      carFrameNumberRules: function (value) {
        var valid = value.length > 0
        var msg = '请输入车架号'
        if (!valid) {
          this.$vux.toast.text(msg, 'top')
        }
        return valid
      },
      engineNumberRules: function (value) {
        var valid = value.length > 0
        var msg = '请输入发动机号'
        if (!valid) {
          this.$vux.toast.text(msg, 'top')
        }
        return valid
      },
      carModelRules: function (value) {
        var valid = value.length > 0
        var msg = '请输入车牌型号'
        if (!valid) {
          this.$vux.toast.text(msg, 'top')
        }
        return valid
      },
      transferTimeRules: function (value) {
        var valid = value.length > 0
        var msg = '请选择过户日期'
        if (!valid) {
          this.$vux.toast.text(msg, 'top')
        }
        return valid
      },
      userNameRules: function (value, user) {
        var valid = value.length > 0
        var msg = '请输入' + user + '姓名'
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

  methods: {
    takePhotoToCarInformation () {
      var _this = this
      _this.$uploadImage(function (serverId, localId) {
        _this.$post(_this.host_bdd + '/autoInsurance/v1/upload/vehicle', {
          mediaId: serverId
        }, function (rt) {
          _this.$vux.loading.hide()
          if (rt.data.code !== 200) {
            _this.$vux.toast.text(rt.data.error, 'top')
            return
          }
          if (rt.data.certVehicleLicense) {
            _this.vehicle.registerDate = rt.data.certVehicleLicense.registerDate
            _this.vehicle.engineNo = rt.data.certVehicleLicense.engineNo
            _this.vehicle.vin = rt.data.certVehicleLicense.vin
            _this.vehicle.model = rt.data.certVehicleLicense.model
          }
        })
      })
    },
    takePhotoToUserInformation (category) {
      if (category === 1 && this.policyHolderSameAsOwner) return
      if (category === 2 && this.insuredSameAsOwner) return

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
            if (category === 0) {
              _this.owner.name = rt.data.certPersonIdentity.name
              _this.owner.identity = rt.data.certPersonIdentity.identity
            } else if (category === 1) {
              _this.policyHolder.name = rt.data.certPersonIdentity.name
              _this.policyHolder.identity = rt.data.certPersonIdentity.identity
            } else if (category === 2) {
              _this.insured.name = rt.data.certPersonIdentity.name
              _this.insured.identity = rt.data.certPersonIdentity.identity
            }
          }
        })
      })
    },
    ownerNameChange () {
      if (this.policyHolderSameAsOwner) {
        this.policyHolder.name = this.owner.name
      }

      if (this.insuredSameAsOwner) {
        this.insured.name = this.owner.name
      }
    },
    ownerIdentityChange () {
      if (this.policyHolderSameAsOwner) {
        this.policyHolder.identity = this.owner.identity
      }

      if (this.insuredSameAsOwner) {
        this.insured.identity = this.owner.identity
      }
    },
    ownerMobileChange () {
      if (this.policyHolderSameAsOwner) {
        this.customer.policyHolderMobile = this.customer.ownerMobile
      }

      if (this.insuredSameAsOwner) {
        this.customer.insuredMobile = this.customer.ownerMobile
      }
    },
    policyHolderSameAsOwnerClick (value) {
      if (value) {
        this.policyHolder.name = this.owner.name
        this.policyHolder.identity = this.owner.identity
        this.customer.policyHolderMobile = this.customer.ownerMobile
      } else {
        this.policyHolder.name = null
        this.policyHolder.identity = null
        this.customer.policyHolderMobile = null
      }
    },
    insuredSameAsOwnerClick (value) {
      if (value) {
        this.insured.name = this.owner.name
        this.insured.identity = this.owner.identity
        this.customer.insuredMobile = this.customer.ownerMobile
      } else {
        this.insured.name = null
        this.insured.identity = null
        this.customer.insuredMobile = null
      }
    },
    nextStep () {
      if (this.registerDateRules(this.vehicle.registerDate) &&
                 this.carFrameNumberRules(this.vehicle.vin) &&
                 this.engineNumberRules(this.vehicle.engineNo) &&
                 this.carModelRules(this.vehicle.model) &&
                 (!this.customer.transfered || this.transferTimeRules(this.customer.transferTime)) &&
                 this.userNameRules(this.owner.name, '车主')) {
        var result = this.identityRules(this.owner.identity, '车主')
        if (!result.valid) {
          this.$vux.toast.text(result.msg, 'top')
          return
        }

        result = this.mobileRules(this.customer.ownerMobile, '车主')
        if (!result.valid) {
          this.$vux.toast.text(result.msg, 'top')
          return
        }

        result = this.userNameRules(this.policyHolder.name, '投保人')
        if (!result) {
          return
        }

        result = this.identityRules(this.policyHolder.identity, '投保人')
        if (!result.valid) {
          this.$vux.toast.text(result.msg, 'top')
          return
        }

        result = this.mobileRules(this.customer.policyHolderMobile, '投保人')
        if (!result.valid) {
          this.$vux.toast.text(result.msg, 'top')
          return
        }

        result = this.userNameRules(this.insured.name, '被投保人')
        if (!result) {
          return
        }

        result = this.identityRules(this.insured.identity, '被投保人')
        if (!result.valid) {
          this.$vux.toast.text(result.msg, 'top')
          return
        }

        result = this.mobileRules(this.customer.insuredMobile, '被投保人')
        if (!result.valid) {
          this.$vux.toast.text(result.msg, 'top')
          return
        }

                    // 合并数据
        this.quotedPriceFlowData.vehicle = this.vehicle
        if (!this.customer.transfered) {
          this.customer.transferTime = null
        }
        this.quotedPriceFlowData.customer = this.customer
        this.quotedPriceFlowData.owner = this.owner
        this.quotedPriceFlowData.policyHolderSameAsOwner = this.policyHolderSameAsOwner
        this.quotedPriceFlowData.insuredSameAsOwner = this.insuredSameAsOwner
        if (!this.policyHolderSameAsOwner) {
          this.quotedPriceFlowData.policyHolder = this.policyHolder
        }
        if (!this.insuredSameAsOwner) {
          this.quotedPriceFlowData.insured = this.insured
        }

        var flowData = {}
        flowData = $.extend(true, flowData, this.quotedPriceFlowData)
        if (flowData.customer.transfered) {
          flowData.customer.transferTime = new Date(flowData.customer.transferTime).getTime() / 1000
        }
        flowData.customer.transfered = Number(flowData.customer.transfered)
        flowData.policyHolderSameAsOwner = Number(flowData.policyHolderSameAsOwner)
        flowData.insuredSameAsOwner = Number(flowData.insuredSameAsOwner)

        this.storage.set('flowData', flowData)
        this.$router.push({path: '/product/scheme'})
      }
    }
  }
}
</script>
