<style scoped>
    .box{
        background-color: #fbf9fe;
    }

    .submit-button{
        padding: 0 10px;
        margin-top: 20px;
        height: 45px;
    }
</style>

<template>
    <div class="box">
        <group>
            <x-input title="用户名"
            v-model="userInfo.nickName"
            :placeholder="userInfo.nickName"
            placeholder-align="right"
            text-align="right"
            :show-clear='false'
            :is-type="nameRules"></x-input>
            <cell title="手机号" is-link @click.native='changeMobile'>
                <div slot="value">
                    <span>{{userInfo.mobile}}</span>
                </div>
            </cell>
            <x-textarea title='个人宣言' :max="50" :height='70' v-model='userInfo.comment' placeholder="请输入个人宣言"></x-textarea>
            <cell title="代理认证" is-link :link='{path:"/personal/detail"}'>
                <div slot="value">
                    <span>{{userInfo.state}}</span>
                </div>
            </cell>
        </group>
        <section class="submit-button">
            <x-button type="primary" @click.native='submitInfo'>更新资料</x-button>
        </section>
    </div>
</template>

<script>
    import {Group, Cell, XInput, XButton, XTextarea} from 'vux'

    export default {

      components: {
        Group,
        Cell,
        XInput,
        XButton,
        XTextarea
      },

      data () {
        return {
          userInfo: {
            nickName: '',
            mobile: '',
            state: '',
            comment: ''
          },
          nameRules: function (value) {
            return {
              valid: value.length >= 2 && value.length < 30,
              msg: '请输入正确的用户名'
            }
          }
        }
      },

      mounted: function () {
        var _this = this
        this.$nextTick(function () {
          _this.getHomeInfo()
          _this.getCertificationInfo()
        })
      },

      methods: {
        getHomeInfo: function () {
          var _this = this
          _this.$http.get(_this.host_bdd + '/agent/v1/home').then((rt) => {
            if (rt.data.code !== 200) {
              _this.$vux.toast.text(rt.error, 'top')
              return
            }
            if (rt.data.tenantAccount) {
              if (rt.data.tenantAccount.user) {
                _this.userInfo.nickName = rt.data.tenantAccount.user.name
                _this.userInfo.mobile = rt.data.tenantAccount.user.mobile
                _this.userInfo.comment = rt.data.tenantAccount.comment
              }
            }
          })
        },
        getCertificationInfo: function () {
          var _this = this
          _this.$http.get(_this.host_bdd + '/agent/v1/info').then((rt) => {
            if (rt.data.code !== 200) {
              _this.$vux.toast.text(rt.error, 'top')
              return
            }
            if (rt.data.tenantAgentInfo) {
              if (rt.data.tenantAgentInfo.state) {
                _this.userInfo.state = _this.getAgentStatus(rt.data.tenantAgentInfo.state)
              }
            }
          })
        },
        getAgentStatus: function (state) {
          switch (state) {
            case 1 :
              {
                return '已认证'
              }
            case 10 :
              {
                return '审核中'
              }
            case 11 :
              {
                return '审核中'
              }
            case 12 :
              {
                return '审核中'
              }
            default :
              {
                return '审核中'
              }
          }
        },
        changeMobile: function () {
          this.$router.push({path: '/change/mobile'})
        },
        submitInfo: function () {
          if (!this.nameRules(this.userInfo.nickName).valid) {
            this.$vux.toast.text('请输入正确的姓名', 'top')
            return
          }

          if (!this.userInfo.comment) {
            this.$vux.toast.text('请输入个人宣言', 'top')
            return
          }

          this.$vux.loading.show({
            text: '正在提交数据'
          })
          var _this = this
          _this.$post(_this.host_bdd + '/agent/v1/update', {
            nickName: _this.userInfo.nickName,
            comment: _this.userInfo.comment
          }, function (rt) {
            _this.$vux.loading.hide()
            if (rt.data.code !== 200) {
              _this.$vux.toast.text(rt.data.error, 'top')
              return
            }
            _this.$vux.toast.text('更新成功', 'top')
            _this.$router.go(-1)
          })
        }
      }
    }
</script>
