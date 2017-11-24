<style scoped>
    .box{
        background-color: #fbf9fe;
    }

    .submit-button{
        padding: 0 10px;
        margin-top: 20px;
        height: 45px;
    }

    .weui-btn_default {
        background-color: #1AAD19;
        color :  #fff;
    }


</style>

<template>
    <div class="box">
        <group>
            <x-input v-model="newMobile" placeholder="请输入新手机号码" :is-type="phoneRules"></x-input>
            <x-input placeholder="短信验证码" v-model="verificationCode" :is-type="verificationCodeRules">
                <x-button slot="right" id='code-button' class='red' type="default" mini @click.native='sendVerificationCode'>发送验证码</x-button>
            </x-input>
        </group>
        <section class="submit-button">
           <x-button type="primary" @click.native='submitInfo'>确认提交</x-button>
        </section>
    </div>
</template>

<script>
    import $ from 'zepto'
    import {Group, XInput, XButton} from 'vux'

    export default {

      components: {
        Group,
        XButton,
        XInput
      },

      data () {
        return {
          newMobile: '',
          verificationCode: '',
          timer: null,
          totalTime: 0,
          phoneRules: function (value) {
            var reg = /^1[34578]\d{9}$/
            var result = reg.test(value)
            return {
              valid: result,
              msg: '请输入正确的手机号码'
            }
          },
          verificationCodeRules: function (value) {
            return {
              valid: value.length === 4,
              msg: '请输入正确验证码'
            }
          }
        }
      },

      methods: {
        submitInfo: function () {
          if (!this.phoneRules(this.newMobile).valid) {
            this.$vux.toast.text('请输入正确的手机号码', 'top')
            return
          }

          if (!this.verificationCodeRules(this.verificationCode).valid) {
            this.$vux.toast.text('请输入正确验证码', 'top')
            return
          }

          var _this = this
          _this.$post(_this.host_bdd + '/agent/v1/update', {
            mobile: _this.newMobile,
            authcode: _this.verificationCode
          }, function (rt) {
            _this.$vux.loading.hide()
            if (rt.data.code !== 200) {
              _this.$vux.toast.text(rt.data.error, 'top')
              return
            }
            _this.$vux.toast.text('更换成功!', 'top')
            _this.$router.go(-1)
          })
        },
        sendVerificationCode: function () {
          if (!this.phoneRules(this.newMobile).valid) {
            this.$vux.toast.text('请输入正确的手机号码', 'top')
            return
          }
          var _this = this
          _this.$post(_this.host_bdd + '/common/v1/auth/new/sms', {
            mobile: _this.newMobile
          }, function (rt) {
            _this.$vux.loading.hide()
            if (rt.data.code !== 200) {
              _this.$vux.toast.text(rt.data.error, 'top')
              return
            }
            _this.startCountDown()
            _this.$vux.toast.text('验证码发送成功!', 'top')
          })
        },
        startCountDown: function () {
          this.totalTime = 60
          $('#code-button').text(this.totalTime + '秒后重试')
          $('#code-button').attr('disabled', true)
          $('.weui-btn_default').css('background-color', '#ccc')
          $('.weui-btn_default').css('color', '#999')

          var _this = this
          this.timer = setInterval(function () {
            _this.totalTime -= 1
            $('#code-button').text(_this.totalTime + '秒后重试')
            if (_this.totalTime <= 0) {
              clearInterval(_this.timer)
              $('#code-button').text('发送验证码')
              $('#code-button').removeAttr('disabled')
              $('.weui-btn_default').css('background-color', '#1AAD19')
              $('.weui-btn_default').css('color', '#fff')
            }
          }, 1000)
        }
      }
    }
</script>
