<style lang="scss" scoped>
    .group {
        padding: 0 15px;
        background: #fff;
    }

    .group + .group {
        margin: 10px 0 0;
        border-top: 1px solid #D9D9D9;
    }

    .cell {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-top: 1px solid #D9D9D9;
    }

    .cell.disabled:after {
        content: " ";
        position: absolute;
        top: 0;
        right: -15px;
        bottom: 0;
        left: -15px;
        background: rgba(0,0,0,.2);
    }

    .group .cell:first-child {
        border: 0 none;
    }

    .group .list .cell {
        border-top: 1px solid #D9D9D9;
    }

    .left {
        flex: 1;

        label {
            display: inline-block;
            width: 3.733rem;
        }
    }

    .right {
        display: block;
        padding-right: 18px;

        .select {
            color: #999;
        }
    }

    .arrow {
        position: absolute;
        top: 50%;
        right: 2px;
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-top: -5px;
        border-width: 2px 2px 0 0;
        border-color: #C8C8CD;
        border-style: solid;
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    }

    .rotate_up {
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
    }

    .rotate_down {
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
    }

    .switch {
        position: relative;
        display: block;
        width: 46px;
        height: 26px;
        border: 1px solid #DFDFDF;
        border-radius: 13px;
        background-color: #DFDFDF;
        outline: 0;
        transition: background-color 0.1s, border 0.1s;
        appearance: none;
    }

    .switch:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 44px;
        height: 24px;
        border-radius: 15px;
        background-color: #FDFDFD;
        transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    }

    .switch:after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background-color: #FFFFFF;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
    }

    .switch:checked {
        border-color: #1cd027;
        background-color: #1cd027;
    }

    .switch:checked:before {
        transform: scale(0);
    }

    .switch:checked:after {
        transform: translateX(20px);
    }

    .pd_8 {
        padding: 8px 0;
    }

    .pr0 {
        padding-right: 0;
    }

    .btn {
        display: inline-block;
        padding: 0 10px;
        line-height: 22px;
        color: #999;
        font-size: 12px;
        border: 1px solid #ccc;
        background-color: #fff;
        border-radius: 2px;
    }

    .btn.active {
        color: #fff;
        background-color: #04be02;
        border-color: #04be02;
    }

    .modal {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        background: rgba(0,0,0,.4);

        .modal-body {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60%;
            max-height: 50%;
            padding: 0 0 20px;
            transform: translate3d(-50%, -50%, 0);
            text-align: center;
            background-color: #fff;
            border-radius: 6px;
            list-style: none;

            div {
                height: calc(100% - 50px);
                padding: 0 15px;
                overflow-y: scroll;

                p {
                    line-height: 32px;
                    color: #999;
                    border-bottom: 1px solid #ccc;

                    .option {
                        display: block;
                    }
                }
            }

            .modal-title {
                margin: 0 15px;
                line-height: 50px;
                color: #333;
                border-bottom: 1px solid #ccc;
            }
        }
    }

    .agree {
        padding: 10px 15px;
        line-height: 22px;
        border-top: 1px solid #D9D9D9;

        label {
            display: block;
        }

        input {
            margin: 4px 5px 0 0;
            vertical-align: top;
        }
    }

    .xbutton {
        padding: 15px;
        background-color: #fff;
    }
</style>

<template>
    <div class="container">
        <div class="group">
            <div class="cell pd_8" data-key="ctali">
                <div class="left">
                    <label style="font-weight:700">交强险</label>
                </div>
                <div class="right pr0"><input type="checkbox" class="switch js_plan_switch" :checked="def.ctali == 1"></div>
            </div>
            <div class="cell" :class="{disabled: (def.ctali == 0)}" data-key="ctaliTerm">
                <div class="left">
                    <label>保险起期</label>
                </div>
                <div class="right">
                    <span class="select">
                        <datetime :value="def.ctaliTerm" format="YYYY-MM-DD" :start-date="startDate" placeholder="请选择" style="padding:0;"></datetime>
                    </span>
                    <i class="arrow"></i>
                </div>
            </div>
        </div>
        <div class="group">
            <div class="cell pd_8 not" data-key="ctli">
                <div class="left">
                    <label style="font-weight:700">商业险</label>
                </div>
                <div class="right pr0"><input type="checkbox" class="switch js_plan_switch" :checked="def.ctli == 1"></div>
            </div>
            <div class="cell" :class="{disabled: def.ctli == 0}" data-key="ctliTerm">
                <div class="left">
                    <label>保险起期</label>
                </div>
                <div class="right">
                    <span class="select">
                        <datetime :value="def.ctliTerm" format="YYYY-MM-DD" :start-date="startDate" placeholder="请选择" style="padding:0;"></datetime>
                    </span>
                    <i class="arrow"></i>
                </div>
            </div>
            <div class="list" v-for="item in flowProfile.ctliSchemeConfigs" >
                <div class="cell pd_8" :class="{disabled: def.ctli == 0 || item.defaultDisable}" :data-key="item.key" :attr-prerequisite="item.prerequisite" v-if="item.type == 'radio'">
                    <div class="left">
                        <label v-if="item.regardlessKey">{{item.name}}</label>
                        <label v-else style="width:auto;">{{item.name}}</label>
                        <button class="btn js_plan_btn" :data-key="item.regardlessKey" v-if="item.regardlessKey" :class="{active: item.defaultRegardless == 1}">不计免赔</button>
                    </div>
                    <div class="right pr0">
                        <input type="checkbox" class="switch right_plan_switch" :attr-key="item.key" :checked="item.defaultOption == 1">
                    </div>
                </div>
                <div class="cell" :class="{disabled: def.ctli == 0 || item.defaultDisable}" :data-key="item.key" :attr-prerequisite="item.prerequisite" v-else>
                    <div class="left">
                        <label v-if="item.regardlessKey">{{item.name}}</label>
                        <label v-else style="width:auto;">{{item.name}}</label>
                        <button class="btn js_plan_btn" :data-key="item.regardlessKey" v-if="item.regardlessKey" :class="{active: item.defaultRegardless == 1}">不计免赔</button>
                    </div>
                    <div>
                        <a href="javascript:;" class="right js_plan_modal" :attr-key="item.key">
                            <span class="select">{{item.defaultOption}}</span><i class="arrow rotate_down"></i>
                            <div class="modal hide">
                                <div class="modal-body">
                                    <p class="modal-title">{{item.name}}</p>
                                    <div class="scroll">
                                        <p v-for="val in item.options">
                                            <span class="option">{{val}}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="agree">
            <div class="vux-check-icon js_success is_success" @click="editTermFN($event)">
                <i class="weui-icon weui_icon_circle weui-icon-circle hide"></i>
                <i class="weui-icon weui_icon_success weui-icon-success"></i>
                <span>同意光大保险代理工作人员调整保险起期</span>
            </div>
        </div>
        <div class="xbutton">
             <x-button type="primary" @click.native="submit">获取报价</x-button>
        </div>
    </div>
</template>

<script>
import $ from 'zepto'
import { formatDate } from '@/libs/format.js'
import { Datetime, XButton, CheckIcon } from 'vux'
export default {
  data () {
    return {
      commonList: [ 'China', 'Japan', 'America' ],
      startDate: '',
      flowProfile: [],
      getData: {},
      ctliProfile: {},
      flowData: {},
      def: {
        ctali: 1,
        ctaliTerm: '',
        ctli: 1,
        ctliTerm: ''
      }
    }
  },
  components: {
    Datetime, XButton, CheckIcon
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.url = from.path

      if (
                (from.path === '/history/detail' && window.location.href.split('&').length < 2) ||
                from.path === '/history'
            ) {
        window.location.href = window.location.href.split('#')[0] + '#/history'
      }
    })
  },
  created () {
    this.startDate = this.$dateFormat(new Date().getTime() / 1000, 'yyyy-MM-dd')
    this.bindEvent()

    if (this.$route.query.inquiryId) {
      this.getFlowData(this.$route.query.inquiryId)
    } else {
      this.flowData = this.storage.get('flowData')
      this.flowData.ctliProfile = {}
      this.getData = {
        produceId: this.flowData.produceId,
        vendorId: this.flowData.vendorId,
        provinceCode: this.flowData.city.parentId,
        cityCode: this.flowData.city.id
      }

      this.getEditScheme()
    }
  },
  methods: {
    editTermFN (event) {
      var $this = $(event.currentTarget)
      if ($this.is('.is_success')) {
        $this.removeClass('is_success')
        $this.find('i').eq(0).removeClass('hide').siblings('i').addClass('hide')
      } else {
        $this.addClass('is_success')
        $this.find('i').eq(1).removeClass('hide').siblings('i').addClass('hide')
      }
    },
    bindEvent () {
            // 不计免保绑定
      $(document).off('.btn').on('click.btn', '.js_plan_btn', function () {
        let $this = $(this)
        let doc = $this.parent().next().children().first()
        if (doc.is('.right_plan_switch')) {
          if (doc.prop('checked')) {
            if ($this.is('.active')) {
              $this.removeClass('active')
              return
            }
            $this.addClass('active')
          }
        } else if (doc.is('.js_plan_modal')) {
          if (doc.find('.select').text() !== '不投保') {
            if ($this.is('.active')) {
              $this.removeClass('active')
              return
            }
            $this.addClass('active')
          }
        }
      })

      $(document).off('.switch').on('click', '.right_plan_switch', function () {
        let $this = $(this)
        let button = $this.parent().prev().children().last()
        if (button.is('.active')) {
          button.removeClass('active')
        }
        let key = $this.attr('attr-key')
        let childDivs = $('[attr-prerequisite="' + key + '"]')
        for (var i = 0; i < childDivs.length; i++) {
          let item = childDivs[i]
          if ($this.prop('checked')) {
            if ($(item).is('.disabled')) { $(item).removeClass('disabled') }
          } else {
            $(item).addClass('disabled')
                        // 移除所有已选选项
            if ($(item).find('.right_plan_switch').length) {
              let $thisSwitch = $(item).find('.right_plan_switch')
              if ($thisSwitch.prop('checked')) {
                $thisSwitch.prop('checked', false)
              }
            }

            if ($(item).find('.js_plan_modal').length) {
              let $thisSelect = $(item).find('.js_plan_modal').find('.select')
              if ($thisSelect.text() !== '不投保') {
                $thisSelect.text('不投保')
              }
            }

            if ($(item).find('.js_plan_btn').length) {
              let $thisBtn = $(item).find('.js_plan_btn')
              if ($thisBtn.is('.active')) {
                $thisBtn.removeClass('active')
              }
            }
          }
        }
      })

            // 选择投保
      $(document).off('.modal').on('click.modal', '.js_plan_modal', function (event) {
        let $this = $(this)
        let $target = $(event.target)
        let $modal = $this.find('.modal')
        let isModal = $target.is('.modal')
        let isOption = $target.is('.option')

        if (!$modal.is('.hide') && isModal) {
          $modal.addClass('hide')
          return
        }

        if (isOption) {
          let val = $target.text()

          let key = $this.attr('attr-key')
          let childDivs = $('[attr-prerequisite="' + key + '"]')
          for (var i = 0; i < childDivs.length; i++) {
            let item = childDivs[i]
            if (val === '不投保') {
              $(item).addClass('disabled')

              if ($(item).find('.right_plan_switch').length) {
                let $thisSwitch = $(item).find('.right_plan_switch')
                if ($thisSwitch.prop('checked')) {
                  $thisSwitch.prop('checked', false)
                }
              }

              if ($(item).find('.js_plan_modal').length) {
                let $thisSelect = $(item).find('.js_plan_modal').find('.select')
                if ($thisSelect.text() !== '不投保') {
                  $thisSelect.text('不投保')
                }
              }

              if ($(item).find('.js_plan_btn').length) {
                let $thisBtn = $(item).find('.js_plan_btn')
                if ($thisBtn.is('.active')) {
                  $thisBtn.removeClass('active')
                }
              }
            } else {
              if ($(item).is('.disabled')) { $(item).removeClass('disabled') }
            }
          }

          if (val === '不投保') {
            let button = $target.closest('.js_plan_modal').parent().prev().children().last()
            if (button.is('.active')) {
              button.removeClass('active')
            }
          }

          $target.closest('.js_plan_modal').find('.select').text(val)
          $modal.addClass('hide')
          return
        }

        $modal.removeClass('hide')
        $this.find('.scroll').height($this.find('.modal-body').height() - 71)
      })

            // 保险选择
      $(document).off('.switch').on('click.switch', '.js_plan_switch', function () {
        let $this = $(this)
        let key = $this.closest('.cell').data('key')

        if (key === 'ctali') {
          if ($this.prop('checked')) {
            $this.closest('.cell').next().removeClass('disabled')
          } else {
            $this.closest('.cell').next().addClass('disabled')
          }
        }

        if (key === 'ctli') {
          if ($this.prop('checked')) {
            $this.closest('.group').find('.cell').not('.not').removeClass('disabled')
          } else {
            $this.closest('.group').find('.cell').not('.not').addClass('disabled')
          }
        }

        if (
                    !$('.js_plan_switch').eq(0).prop('checked') &&
                    !$('.js_plan_switch').eq(1).prop('checked')
                ) {
          $('.xbutton button').prop('disabled', true).addClass('weui-btn_disabled')
        } else {
          $('.xbutton button').prop('disabled', false).removeClass('weui-btn_disabled')
        }
      })
    },
    getEditScheme () {
      this.$http.get(this.host_bdd + '/autoInsurance/v1/flow/profile/EditScheme', {
        params: this.getData
      }).then((rt) => {
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }

        this.flowProfile = rt.data.flowProfile

        var disableKeys = []
        for (var i = 0; i < this.flowProfile.ctliSchemeConfigs.length; i++) {
          let item = this.flowProfile.ctliSchemeConfigs[i]
          if (item.key) {
            // 有key,属于约束他人
            if (item.type === 'radio') {
              // switch
              if (item.defaultOption !== '1' && item.defaultOption !== 1) {
                disableKeys.push(item.key)
              }
            } else {
              // select
              if (item.defaultOption === '不投保') {
                disableKeys.push(item.key)
              }
            }
          }
          if (item.prerequisite) {
            // 有prerequisite 属于被约束
            for (var j = 0; j < disableKeys.length; j++) {
              if (disableKeys[j] === item.prerequisite) {
                item.defaultDisable = true
              }
            }
          }
        }
      })
    },
    getFlowData (id) {
      this.$http.get(this.host_bdd + '/autoInsurance/v1/inquiry/' + id + '/flow').then((rt) => {
        if (rt.data.code !== 200) {
          this.$vux.toast.text(rt.data.error, 'top')
          return
        }
        this.flowData = rt.data.flowData
        this.flowProfile = rt.data.flowData.flowProfile

        this.def = {
          ctali: rt.data.flowData.ctali,
          ctaliTerm: (rt.data.flowData.ctaliTerm) ? this.formatData(rt.data.flowData.ctaliTerm) : '',
          ctli: rt.data.flowData.ctli,
          ctliTerm: (rt.data.flowData.ctliTerm) ? this.formatData(rt.data.flowData.ctliTerm) : ''
        }
        if (rt.data.flowData.editTerm) {
          $('.js_success').addClass('is_success')
          $('.js_success').find('i').eq(1).removeClass('hide').siblings('i').addClass('hide')
        } else {
          $('.js_success').removeClass('is_success')
          $('.js_success').find('i').eq(0).removeClass('hide').siblings('i').addClass('hide')
        }

        this.storage.set('flowData', this.flowData)
      })
    },
    submit () {
      const _this = this

      $.each($('.cell'), function (k, v) {
        let $check = $(v).find('.right [type="checkbox"]')
        let $btn = $(v).find('.left .js_plan_btn')
        let key = $(v).data('key')
        let regardlessKey = $btn.data('key')

        if ($check.length > 0) {
          _this.ctliProfile[key] = Number($check.prop('checked'))
        } else {
          _this.ctliProfile[key] = $.trim($(v).find('.select').text())
        }

        if ($btn.length > 0) {
          _this.ctliProfile[regardlessKey] = Number($btn.is('.active'))
        }
      })

      _this.storeFlowData()
    },
    storeFlowData () {
      var _this = this

      $.each(_this.ctliProfile, function (k, v) {
        if (
                    k === 'ctali' ||
                    k === 'ctli'
                ) {
          _this.flowData[k] = v
        } else if (
                    k === 'ctaliTerm' ||
                    k === 'ctliTerm'
                ) {
          _this.flowData[k] = (v === '请选择') ? null : new Date(v).getTime() / 1000
        } else {
          _this.flowData.ctliProfile[k] = v
        }
      })

      _this.flowData.editTerm = $('.js_success.is_success').length
      _this.flowData.flowProfile = this.flowProfile

      _this.postCreate()
    },
    postCreate () {
      let _this = this
      if (!_this.flowData.editTerm) {
        if (_this.flowData.ctali && !_this.flowData.ctaliTerm) {
          _this.$vux.toast.text('请选择交强险起保期', 'top')
          return
        }

        if (_this.flowData.ctli && !_this.flowData.ctliTerm) {
          _this.$vux.toast.text('请选择商业险起保期', 'top')
          return
        }
      }
      _this.$vux.loading.show({text: '正在提交数据'})
      _this.$http.post(_this.host_bdd + '/autoInsurance/v1/inquiry/create', _this.flowData).then((rt) => {
        _this.$vux.loading.hide()
        if (rt.data.code !== 200) {
          _this.$vux.loading.hide()
          _this.$vux.toast.text(rt.data.error, 'top')
          return
        }

        _this.$router.push({path: '/history/detail', query: {'inquiryId': rt.data.inquiryId}})
      })
    },
    formatData (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd')
    }
  }
}
</script>
