<style scoped>

    .box{
        background-color: #fbf9fe;
    }

    .flex-div{
        background-color: #fbf9fe;
    }

    .flex-choose-div{
        margin-left: 16px;
        margin-top: 10px;
        background-color: #eef6ff;
        border: 1px solid #eef6ff;
        border-radius: 5px;
        text-align: center;
        height: 100px;
        position: relative;
    }

    .flex-choose-div i {
        display: inline-block;
        vertical-align: middle;
        height: 100%;
    }

    .flex-item p {
        margin-top: 10px;
        margin-left: 16px;
        text-align: center;
        margin-bottom: 16px;
    }


    .flex-image {
      width:100%;
      height:auto;
      vertical-align: middle;
    }

    .flex-upload-image{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0px;
        border-radius: 5px;
    }

    .cell-date span {
        display: inline-block;
        float: right;
    }

    .cell-date img {
        float: right;
        margin-left: 10px;
        width: 20px;
        height: 20px;
    }
</style>

<template>
    <div class="box">
        <group gutter="0">
            <div class="flex-div">
                <flexbox :gutter="0" v-if='category == 1'>
                    <flexbox-item class="flex-item">
                        <div class="flex-choose-div" @click='identityFrontUpload'>
                            <img class="flex-upload-image"
                            v-show='imageSrcFront'
                            :src="imageSrcFront">
                            <img class="flex-image"
                            v-show='!imageSrcFront'
                            src="../../assets/identity-front.png"><i></i>
                        </div>
                        <p>请上传身份证正面</p>
                    </flexbox-item>
                    <flexbox-item class="flex-item" style="margin-right: 16px;">
                        <div class="flex-choose-div" @click='identityBackUpload'>
                            <img class="flex-upload-image"
                            v-show='imageSrcBack'
                            :src="imageSrcBack">
                            <img class="flex-image"
                            v-show='!imageSrcBack'
                            src="../../assets/identity-back.png"><i></i>
                        </div>
                        <p>请上传身份证反面</p>
                    </flexbox-item>
                </flexbox>


                <flexbox :gutter="0" v-else-if='category == 2'>
                    <flexbox-item class="flex-item">
                        <div class="flex-choose-div" @click='identityFrontUpload'>
                            <img class="flex-upload-image"
                            v-show='imageSrcFront'
                            :src="imageSrcFront">
                            <img class="flex-image"
                            v-show='!imageSrcFront'
                            src="../../assets/identity-front.png"><i></i>
                        </div>
                        <p>身份证正面</p>
                    </flexbox-item>
                    <flexbox-item class="flex-item" style="margin-right: 16px;">
                        <div class="flex-choose-div" @click='identityBackUpload'>
                            <img class="flex-upload-image"
                            v-show='imageSrcBack'
                            :src="imageSrcBack">
                            <img class="flex-image"
                            v-show='!imageSrcBack'
                            src="../../assets/identity-back.png"><i></i>
                        </div>
                        <p>身份证反面</p>
                    </flexbox-item>
                </flexbox>

                <flexbox :gutter="0" v-else-if='category == 3'>
                    <flexbox-item class="flex-item">
                        <div class="flex-choose-div">
                            <img class="flex-upload-image"
                            v-show='imageSrcFront'
                            :src="imageSrcFront">
                            <img class="flex-image"
                            v-show='!imageSrcFront'
                            src="../../assets/idcard-placehold.png"><i></i>
                        </div>
                        <p>身份证正面</p>
                    </flexbox-item>
                    <flexbox-item class="flex-item" style="margin-right: 16px;">
                        <div class="flex-choose-div">
                            <img class="flex-upload-image"
                            v-show='imageSrcBack'
                            :src="imageSrcBack">
                            <img class="flex-image"
                            v-show='!imageSrcBack'
                            src="../../assets/idcard-placehold.png"><i></i>
                        </div>
                        <p>身份证反面</p>
                    </flexbox-item>
                </flexbox>
            </div>

            <group gutter="0">
                <x-input title="真实姓名"
                v-model="userModel.realName"
                :disabled='category == 3'
                placeholder="请输入"
                :is-type="nameRules"
                placeholder-align="right"
                text-align="right">
                </x-input>

                <x-input title="身份证号"
                v-model="userModel.identity"
                :disabled='category == 3'
                placeholder="请输入"
                :is-type="identityRules"
                placeholder-align="right"
                text-align="right">
                </x-input>

                <popup-radio title="性别"
                :options="sexOptions"
                :placeholder='userModel.sex ? "" : "请选择"'
                :readonly='category == 3'
                v-model="userModel.sex">
                </popup-radio>

                <popup-radio title="民族"
                :options="nationOtions"
                :placeholder='userModel.nation ? "" : "请选择"'
                :readonly='category == 3'
                v-model="userModel.nation">
                </popup-radio>

                <cell title="出生日期"
                class='cell-date'
                :placeholder='userModel.birthDate ? "" : "请选择"'
                @click.native='category == 3 ? showBirthDate = false : showBirthDate = true'
                :is-link='category != 3'>
                    <img src="../../assets/date-icon.png" v-show='category != 3'>
                    <span>{{userModel.birthDate}}</span>
                </cell>

                <popup v-model="showBirthDate">
                    <datetime-view
                    v-model='userModel.birthDate'
                    :min-year='1900'
                    :max-year='new Date().getFullYear()'
                    format='YYYY-MM-DD'>
                    </datetime-view>
                </popup>

                <popup-radio title="学历"
                :options="academicOptions"
                :placeholder='userModel.academic ? "" : "请选择"'
                :readonly='category == 3'
                v-model="userModel.academic">
                </popup-radio>
            </group>
        </group>
    </div>
</template>

<script>

import { Group, Cell ,XInput,Box,Icon,XButton ,PopupRadio,Flexbox, FlexboxItem, DatetimeView, Popup} from 'vux'

    export default {

        components: {
            Group,
            Cell,
            XInput,
            Box,
            Icon,
            Flexbox,
            FlexboxItem,
            PopupRadio,
            DatetimeView,
            Popup,
            XButton
        },

        props: {
             /**
             * 1:提交认证信息  2:修改认证信息  3:展示认证信息
             */
            category : 0,
            frontImageSrc:'',
            backImageSrc:'',
            userModel : {
                realName:'',
                identity:'',
                sex:'',
                waitingAuditInfoId:"",
                infoId:"",
                nation:'',
                academic:'',
                birthDate:''
            },
        },

        watch:{
            frontImageSrc : {
                handler: function (value) {
                    this.imageSrcFront = value;
                }
            },
            backImageSrc : {
                handler: function (value){
                    this.imageSrcBack = value;
                }
            }
        },

        data () {
            return {
                showBirthDate:false,
                imageSrcFront:"",
                imageSrcBack:"",
                sexOptions : ['男','女'],
                nationOtions : ["汉族","蒙古族","回族","藏族","朝鲜族","维吾尔族","苗族","壮族","满族","布依族","侗族","彝族","瑶族","白族","土家族","哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","高山族","畲族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族","土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族","乌孜别克族","京族","独龙族","德昂族","保安族","鄂温克族","俄罗斯族","塔塔尔族","裕固族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族","无法认定","外籍入国"],
                academicOptions : ["本科","大专","高中及同等学历","初中及同等学历","硕士","博士","初中以下学历"],
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
            this.$nextTick(function () {
                var eles = document.getElementsByClassName("flex-choose-div");
                var width = (document.body.clientWidth - 60) / 2;
                for (var i = 0; i < eles.length; i++) {
                    eles[i].style.height = width / 1.4 + 'px';
                }
            })
        },

        methods : {
            identityFrontUpload : function () {
                var _this = this;
                _this.$uploadImage( function (serverId,localId) {
                    _this.$post(_this.host_bdd + '/agent/v1/info/upload', {
                        mediaId: serverId,
                        type: 1,
                        infoId: _this.userModel.waitingAuditInfoId ? _this.userModel.waitingAuditInfoId : null
                    }, function (rt) {
                        _this.$vux.loading.hide();
                        if (rt.data.code != 200) {
                            _this.$vux.toast.text(rt.data.error, 'top');
                            return;
                        }
                        _this.getImageData(1,rt.data.tenantAgentInfo.frontPath);

                        _this.userModel.waitingAuditInfoId = rt.data.tenantAgentInfo.id;

                        if (rt.data.tenantAgentInfo.identity) {
                             _this.userModel.identity = rt.data.tenantAgentInfo.identity;
                        }
                        if (rt.data.tenantAgentInfo.name) {
                             _this.userModel.realName = rt.data.tenantAgentInfo.name;
                        }
                        if (rt.data.tenantAgentInfo.gender) {
                             _this.userModel.sex = rt.data.tenantAgentInfo.gender;
                        }
                        if (rt.data.tenantAgentInfo.birth) {
                            _this.userModel.birthDate = rt.data.tenantAgentInfo.birth;
                        }
                        if (rt.data.tenantAgentInfo.nation) {
                            for (var i = 0; i < _this.nationOtions.length; i++) {
                                if (_this.nationOtions[i] == rt.data.tenantAgentInfo.nation){
                                    _this.userModel.nation = rt.data.tenantAgentInfo.nation;
                                    return;
                                }
                            }
                            _this.userModel.nation = _this.nationOtions[_this.nationOtions.length - 2];
                        }
                    });
                });
            },
            identityBackUpload : function () {
                var _this = this;
                if (!_this.userModel.waitingAuditInfoId){
                    _this.$vux.toast.text('请先上传正面照片', 'top');
                    return;
                }
                _this.$uploadImage( function (serverId,localId) {
                    _this.$post(_this.host_bdd + '/agent/v1/info/upload', {
                        mediaId: serverId,
                        type: 2,
                        infoId: _this.userModel.waitingAuditInfoId
                    }, function (rt) {
                        _this.$vux.loading.hide();
                        if (rt.data.code != 200) {
                            _this.$vux.toast.text(rt.data.error, 'top')
                            return;
                        }

                        _this.userModel.infoId = rt.data.tenantAgentInfo.id;

                        _this.getImageData(0,rt.data.tenantAgentInfo.backPath);

                        if (rt.data.tenantAgentInfo.identity) {
                             _this.userModel.identity = rt.data.tenantAgentInfo.identity;
                        }
                        if (rt.data.tenantAgentInfo.name) {
                             _this.userModel.realName = rt.data.tenantAgentInfo.name;
                        }
                        if (rt.data.tenantAgentInfo.gender) {
                             _this.userModel.sex = rt.data.tenantAgentInfo.gender;
                        }
                        if (rt.data.tenantAgentInfo.birth) {
                            _this.userModel.birthDate = rt.data.tenantAgentInfo.birth;
                        }
                        if (rt.data.tenantAgentInfo.nation) {
                            for (var i = 0; i < _this.nationOtions.length; i++) {
                                if (_this.nationOtions[i] == rt.data.tenantAgentInfo.nation){
                                    _this.userModel.nation = rt.data.tenantAgentInfo.nation;
                                    return;
                                }
                            }
                            _this.userModel.nation = _this.nationOtions[_this.nationOtions.length - 2];
                        }
                    });
                });
            },
            getImageData : function (location,path) {
                var _this = this;
                _this.$getImageUrlFromOSS(path,function (rt){
                    if (rt){
                        if (location){
                            _this.imageSrcFront = rt;
                        }else {
                            _this.imageSrcBack = rt;
                        }
                    }else {
                        _this.$vux.toast.text('获取图片失败:' + JSON.stringify(rt), 'top');
                    }
                });
            },
        }
    }
</script>