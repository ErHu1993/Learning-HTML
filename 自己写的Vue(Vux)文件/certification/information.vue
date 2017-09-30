<style scoped>

    .submit-button{
        padding: 0 10px;
        margin-top: 20px;
        height: 45px;
    }

    p{
        margin: 15px;
    }

    .agree{
        margin-top: 10px;
        margin-left: 15px;
    }

    .agree a {
        color: blue;
    }

    .contact-image {
        /* width: 100%; */
        max-height: 500px;
        overflow-y:auto;
        -webkit-overflow-scrolling:touch;
    }

</style>

<template>
    <div class="box">
        <cerInformation :userModel='userModel' category=1></cerInformation>
        <div class="agree">
            <check-icon :value.sync="agreeCheck">已阅读并同意</check-icon><a @click='showContact = true'>《保险中介委托授权代理合同》</a>
        </div>
        <section class="submit-button">
            <x-button type='primary' @click.native='submitInfo'>确定</x-button>
        </section>
        <p> * 光大保险代理将保护您的隐私安全，信息仅用于代理人备案 </p>
        <div>
            <x-dialog v-model="showContact"
            :dialog-style="{'max-width': '90%', width: '90%'}">
                <div class="contact-image" @click='previewImage'>
                    <img id='img' src="../../assets/contact-image.png" width="100%">
                </div>
                <div>
                    <div @click="showContact = false">
                        <x-icon  type="ios-close-outline" size="30" ></x-icon>
                    </div>
                </div>
            </x-dialog>
        </div>
    </div>
</template>

<script>

import { XButton ,XDialog, CheckIcon} from 'vux'
import cerInformation from '@/views/component-views/cer-information.vue';

    export default {

        components: {
            XButton,
            cerInformation,
            XDialog,
            CheckIcon
        },

        data () {
            return {
                agreeCheck : true,
                showContact : false,
                contactImgUrl : '',
                userModel : {
                    infoId:'',
                    waitingAuditInfoId:'',
                    realName:'',
                    identity:'',
                    sex : '',
                    nation:'',
                    academic:'',
                    birthDate: ''//new Date().getFullYear() - 30 + "-01-01"
                },
                nameRules : function (value) {
                    return {
                      valid: value.length > 0,
                      msg: '请输入正确的姓名'
                    }
                },
                identityRules: function (value) {
                    var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
                    var result =  reg.test(value);
                    return {
                      valid: result,
                      msg: '请输入正确的身份证号'
                    }
                }
            }
        },

         mounted () {
            this.contactImgUrl = document.getElementById('img').src;
        },

        methods : {

            previewImage () {
                this.$wechat.previewImage({
                    current: '', // 当前显示图片的http链接
                    urls: [this.contactImgUrl] // 需要预览的图片http链接列表
                });
            },

            submitInfo : function () {

                if (!this.agreeCheck) {
                    this.$vux.toast.text('您没有同意《保险中介委托授权代理合同》', 'top')
                    return;
                }

                if (!this.userModel.infoId) {
                    this.$vux.toast.text('请上传身份证照片', 'top')
                    return;
                }
                if (!this.nameRules(this.userModel.realName).valid){
                    this.$vux.toast.text('请输入正确的姓名', 'top')
                    return;
                }
                if (!this.identityRules(this.userModel.identity).valid){
                    this.$vux.toast.text('请输入正确的身份证号', 'top')
                    return;
                }

                if (!this.userModel.sex){
                    this.$vux.toast.text('请输入正确的性别', 'top')
                    return;
                }

                if (!this.userModel.nation){
                    this.$vux.toast.text('请输入正确的民族', 'top')
                    return;
                }

                if (!this.userModel.birthDate){
                    this.$vux.toast.text('请输入正确的出生日期', 'top')
                    return;
                }

                if (!this.userModel.academic){
                    this.$vux.toast.text('请输入正确的学历', 'top')
                    return;
                }

                this.$vux.loading.show({
                    text: '正在提交数据'
                })
                var _this = this;
                _this.$post(_this.host_bdd + '/agent/v1/info/submit', {
                    identity:_this.userModel.identity,
                    name:_this.userModel.realName,
                    gender:_this.userModel.sex,
                    nation:_this.userModel.nation,
                    birth:_this.userModel.birthDate,
                    education:_this.userModel.academic,
                    infoId:_this.userModel.infoId
                }, function (rt) {
                    _this.$vux.loading.hide();
                    if (rt.data.code != 200) {
                        _this.$vux.toast.text(rt.data.error, 'top')
                        return;
                    }
                    _this.$router.replace('/complete');
                });
            },
        }
    }
</script>
