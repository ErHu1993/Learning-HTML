<style scoped>
    .submit-button{
        padding: 0 10px;
        margin-top: 20px;
        height: 45px;
    }

    p{
        margin: 15px;
    }

</style>

<template>
    <div class="box">
        <cerInformation :userModel='userModel'
        :category='canEdit ? 2 : 3'
        :frontImageSrc='imageSrcFront'
        :backImageSrc='imageSrcBack'>
        </cerInformation>
        <section class="submit-button" v-show='canEdit'>
            <x-button type='primary' @click.native='submitInfo'>修改信息</x-button>
        </section>
        <p v-show='canEdit'> * 光大保险代理将保护您的隐私安全，信息仅用于代理人备案 </p>
    </div>
</template>

<script>

import { XButton} from 'vux'
import cerInformation from '@/views/component-views/cer-information.vue';

    export default {

        components: {
            cerInformation,
            XButton
        },

        data () {
            return {
                canEdit : false,
                imageSrcFront:'',
                imageSrcBack:'',
                userModel:{
                    infoId:'',
                    waitingAuditInfoId:'',
                    realName:'',
                    identity:'',
                    sex : '',
                    infoId:"",
                    nation:'',
                    academic:'',
                    birthDate: ''
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

        mounted :function(){
            var _this = this;
            this.$nextTick(function () {
                _this.getCertificationInfo();
            });
        },

        methods : {

            submitInfo : function () {

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
                    _this.$vux.toast.text("提交成功", 'top')
                    _this.$router.go(-1);
                });
            },

            getCertificationInfo: function () {
                var _this = this;
                _this.$http.get(_this.host_bdd + '/agent/v1/info').then((rt) => {
                    if (rt.data.code != 200) {
                         _this.$vux.toast.text(rt.error, 'top');
                         return;
                     }
                     if (rt.data.tenantAgentInfo) {

                        _this.userModel.realName = rt.data.tenantAgentInfo.name;
                        _this.userModel.identity = rt.data.tenantAgentInfo.identity;
                        _this.userModel.sex = rt.data.tenantAgentInfo.gender;
                        _this.userModel.nation = rt.data.tenantAgentInfo.nation;
                        _this.userModel.academic = rt.data.tenantAgentInfo.education;
                        _this.userModel.infoId = rt.data.tenantAgentInfo.id;
                        _this.userModel.waitingAuditInfoId = rt.data.tenantAgentInfo.id;
                        _this.userModel.birthDate = rt.data.tenantAgentInfo.birth;

                        _this.canEdit = rt.data.tenantAgentInfo.state != 1;

                        _this.$getImageUrlFromOSS(rt.data.tenantAgentInfo.frontPath,function (rt){
                            if (rt){
                                _this.imageSrcFront = rt;
                            }
                        });
                        _this.$getImageUrlFromOSS(rt.data.tenantAgentInfo.backPath,function (rt){
                            if (rt){
                                _this.imageSrcBack = rt;
                            }
                        });
                     }
                 });
            }
        }
    }
</script>
