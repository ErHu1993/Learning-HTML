<style scoped>
    /* mainBody */
    .main{
        height: 100%;
        background-color: #f2f6ff;
    }

    .whiteColor{
        background-color: #fff;
    }

     /* 标题 */
    .head-title {
        padding-left: 40px;
        padding-top: 20px;
        padding-bottom: 20px;
        line-height: 12px;
        font-size: 14px;
        font-weight: normal;
        background-color: #fff;
    }

    .form-input{
        width: 240px;
    }
    /* 标题 */
    .main-title {
        padding-left: 20px;
        padding-top: 31px;
        padding-bottom: 31px;
        line-height: 12px;
        font-size: 14px;
        background-color: #fff;
    }

    .upload-button{
        padding: 20px 50px;
        background-color: transparent;
        border-color: transparent;
    }

    .upload-image{
        float: left;
        width:300px;
    }

    .section-header{
        margin-top: 10px;
        background-color: #fff;
        overflow: hidden;
    }

    .form-span{
        width: 80px;
        display: inline-block;
        text-overflow:ellipsis;
        margin: 0px 10px;
    }

    .option-div{
        text-align: left;
        display: inline-block;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
    }

</style>

<template>
    <div class="main">
        <div style="background-color: #fff">
            <breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
        </div>

        <div class="whiteColor">
            <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  基本信息</h5>
            <Form ref="userModel" :model="userModel" :rules="rulesModel" inline :label-width="120">
                <Form-item label="直属上级" style="margin-left:5px;" prop="leader" v-if='userModel.leader'>
                   <Row>
                        <Col span="12" class="form-input" style="width:630px">
                             <Select
                                v-model="userModel.leader"
                                filterable
                                remote
                                :remote-method="searchTeamHeader"
                                :loading="searchLoading"
                                @on-query-change='searchQueryChange'
                                @on-change='searchSelectChange'>
                                <Option v-for="option in teamHeadList" :value="option.id" :key="option.id" :label='option.contact'>
                                    <div class="option-div" style="width:400px;">{{option.name}}</div>
                                    <div class="option-div" style="width:80px;">{{option.contact}}</div>
                                    <div class="option-div">{{option.contactMobile}}</div>
                                </Option>
                            </Select>
                        </Col>
                    </Row>
                </Form-item>
                <br/>
                <Form-item label="代理人名称" style="margin-left:20px;" prop="name">
                    <Input class="form-input" v-model="userModel.name" placeholder="请输入代理人名称"></Input>
                </Form-item>
                <Form-item label="手机号" prop="phoneNum">
                    <Input class="form-input" v-model="userModel.phoneNum" placeholder="请输入手机号号码"></Input>
                </Form-item>
                <br/>
            </Form>
        </div>

        <div class="section-header">
           <h5 class="head-title"><span style="background-color: #3a97f6;">&nbsp;</span>  认证信息</h5>
            <Form ref="auditModel" :model="auditModel" :rules="auditRules" inline :label-width="120">
                <Form-item label="身份证正面照" style="margin-left:35px;" :label-width='formLabelWidth' prop="infoId">
                     <Upload
                        multiple
                        action=""
                        type="drag"
                        style="display:inline-block"
                        :before-upload="identityFrontUpload"
                        >
                        <Button class="upload-button" v-show='!imageSrcFront' :loading='identityFrontLoading'>
                            <Icon type="ios-cloud-upload" size="100" style="color: #3399ff"></Icon>
                            <p>点击或将文件拖拽到这里上传</p>
                        </Button>
                        <img v-show='imageSrcFront' :src="imageSrcFront" class="upload-image">
                    </Upload>
                </Form-item>
                <Form-item label="身份证反面照" style="margin-left:20px;" :label-width='formLabelWidth' prop="infoId">
                     <Upload
                        multiple
                        action=""
                        type="drag"
                        :before-upload="identityBackUpload"
                        style="display:inline-block;">
                        <Button class="upload-button" v-show='!imageSrcBack' :loading='identityBackLoading'>
                            <Icon type="ios-cloud-upload" size="100" style="color: #3399ff"></Icon>
                            <p>点击或将文件拖拽到这里上传</p>
                        </Button>
                        <img v-show='imageSrcBack' :src="imageSrcBack" class="upload-image">
                    </Upload>

                 </Form-item>
                 <br/>
                 <Form-item label="真实姓名" style="margin-left:5px" prop="realName">
                    <Input class="form-input" v-model="auditModel.realName" placeholder="请输入真实姓名"></Input>
                 </Form-item>
                 <Form-item label="身份证号" prop="identity">
                    <Input class="form-input" v-model="auditModel.identity" placeholder="请输入身份证号"></Input>
                 </Form-item>
                 <br/>
                 <Form-item label="执业证号" style="margin-left:5px" prop="qualification">
                    <Input class="form-input" v-model="auditModel.qualification" placeholder="请输入执业证号"></Input>
                 </Form-item>
                 <Form-item label="出生日期" prop="birth">
                    <DatePicker class="form-input"
                        type="date"
                         v-model="auditModel.birth"
                        @on-change='birthDateChange'
                        :options="brithOption"
                        placeholder="选择日期" placement='top'>
                    </DatePicker>
                 </Form-item>
                 <br/>
                 <Form-item label="性别" style="margin-left:-22px" prop="gender">
                    <RadioGroup v-model="auditModel.gender">
                        <Radio label="男">
                        </Radio>
                        <Radio label="女">
                        </Radio>
                    </RadioGroup>
                 </Form-item>
                 <Form-item label="民族" prop="nation">
                     <Select v-model="auditModel.nation" placeholder='请选择' placement='top' style='width:145px;'>
                        <Option v-for="item in nationOtions" :value="item" :key="item"></Option>
                    </Select>
                 </Form-item>
                 <Form-item label="学历" prop="academic">
                     <Select v-model="auditModel.academic" placeholder='请选择' placement='top' style='width:140px;'>
                        <Option v-for="item in academicOptions" :value="item" :key="item"></Option>
                    </Select>
                 </Form-item>
             </Form>
             <!-- 提交返回按钮 -->
             <div style="padding-bottom: 30px; overflow: hidden;background-color: #fff">
                <Button type="primary" style="margin-right: 20px;float: right;width:80px;" :loading="loading" @click="handleSubmit()">确定</Button>
            </div>
         </div>
    </div>
</template>

<script>
import uuidv4 from 'uuid/v4';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';

export default {

    components: {
        Breadcrumb
    },
    mounted :function(){
        var _this = this;
        this.$nextTick(function () {
            _this.$get(_this.host_bdd + '/agency/v1/detail',
                function (rt) {
                    if (rt.data.code != 200) {
                        _this.$Message.error(rt.data.error);
                        return;
                    }
                    _this.lightBigFather = rt.data.tenantWithAgentInfo;
                    _this.teamHeadList = [];
                    _this.teamHeadList.push(_this.lightBigFather);
                    _this.userModel.leader = _this.lightBigFather.contact;
                });
        });
    },
    data () {
        return {
            breadcrumb: ['添加代理人'],
            loading: false,
            formLabelWidth:120,
            searchLoading:false,
            queryConditions:null,
            lightBigFather:null,
            brithOption:{
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            identityFrontLoading:false,
            identityBackLoading:false,
            nationOtions : ["汉族","蒙古族","回族","藏族","朝鲜族","维吾尔族","苗族","壮族","满族","布依族","侗族","彝族","瑶族","白族","土家族","哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","高山族","畲族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族","土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族","乌孜别克族","京族","独龙族","德昂族","保安族","鄂温克族","俄罗斯族","塔塔尔族","裕固族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族","无法认定","外籍入国"],
            academicOptions:["本科","大专","高中及同等学历","初中及同等学历","硕士","博士","初中以下学历"],
            imageSrcFront:"",
            imageSrcBack:"",
            teamHeadList:[
            ],
            userModel:{
                name:'',
                phoneNum:'',
                leader:'',
                leaderId:'',
            },
            rulesModel:{
                leader:[
                    {required: true, message: '上级代理人不能为空', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '代理人名称不能为空', trigger: 'blur'},
                ],
                phoneNum: [
                    { required: true, message: '手机号码不能为空',trigger: 'blur' },
                    { type: 'string', message: '手机号码格式不正确', pattern:/^1[34578]\d{9}$/ ,trigger: 'blur' }
                ]
            },
            auditModel:{
                infoId:'',
                waitingAuditInfoId:'',
                realName:'',
                qualification:'',
                identity:'',
                birth:'',
                gender:'',
                nation:'',
                academic:''
            },
            auditRules: {
                infoId:[
                    {required: true, message: '请上传认证信息', trigger: 'blur'},
                ],
                realName: [
                {required: true, message: '真是姓名不能为空', trigger: 'blur'},
                ],
                qualification: [
                {required: true, message: '执业证号不能为空', trigger: 'blur'},
                ],
                identity: [
                { required: true, message: '身份证号不能为空',trigger: 'blur' },
                { type: 'string', message: '身份证号格式不正确', pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/ ,trigger: 'blur' }
                ],
                birth: [
                    {required: true, message: '出生日期不能为空', trigger: 'blur'},
                ],
                gender: [
                    {required: true, message: '性别不能为空', trigger: 'blur'},
                ],
                nation: [
                    {required: true, message: '民族不能为空', trigger: 'blur'},
                ],
                academic: [
                    {required: true, message: '学历不能为空', trigger: 'blur'},
                ],
            }
        }
    },
    methods: {
        handleSubmit :function (model) {
            var _this = this;
            _this.$refs['userModel'].validate((valid) => {
                if (valid) {
                    _this.$refs['auditModel'].validate((valid) => {
                        if (valid) {
                            _this.loading = true;
                            _this.$post(_this.host_bdd + '/agency/v1/inferior/create', {
                                superiorId:_this.userModel.leaderId,
                                name:_this.userModel.name,
                                mobile:_this.userModel.phoneNum,
                                infoId:_this.auditModel.infoId,
                                realName:_this.auditModel.realName,
                                identity:_this.auditModel.identity,
                                gender:_this.auditModel.gender,
                                nation:_this.auditModel.nation,
                                birth:_this.auditModel.birth,
                                education:_this.auditModel.academic,
                                qualification:_this.auditModel.qualification
                            }, function (rt) {
                                _this.loading = false;
                                if (rt.data.code != 200) {
                                    _this.$Message.error(rt.data.error);
                                    return;
                                }
                                _this.$router.push({ path: '/team-manager/list' });
                                _this.$Message.success('提交成功!');
                            });
                        }
                    })
                }
            });
        },
        searchTeamHeader : function (searchText) {
            var _this = this;
            _this.searchLoading = true;
            if (searchText.length){
                    _this.$http.get(_this.host_bdd + '/agency/v1/inferior/find', {
                        params: {
                          option: 1,
                          q:_this.queryConditions,
                          pn:1,
                          ps:20
                      }
                  }).then(function (response) {
                    _this.searchLoading = false;
                    if (response.data.code != 200) {
                        _this.$Message.error(response.data.error);
                        return;
                    }
                    _this.teamHeadList = response.data.tenantsWithParent;
                    if (!_this.teamHeadList){
                        _this.teamHeadList = [];
                        _this.teamHeadList.push(_this.lightBigFather);
                    }
                })
            } else {
                _this.searchLoading = false;
                _this.teamHeadList = [];
                _this.teamHeadList.push(_this.lightBigFather);
            }
        },
        searchQueryChange : function (query) {
            if (query.length){
                var jsonObject = {
                    "child.expiredTime_ge" : null,
                    "child.expiredTime_le" : null,
                    "child.name,child.contact,child.contactMobile_like" : query
                };
                this.queryConditions = JSON.stringify(jsonObject);
            }else{
                this.queryConditions = null;
                this.teamHeadList = [];
                this.teamHeadList.push(this.lightBigFather);
            }
        },
        birthDateChange (value) {
            this.auditModel.birth = value;
        },
        searchSelectChange : function (res) {
            this.userModel.leaderId = res;
        },
        identityUploadJudge (file) {
            if (file.type.indexOf('png') >= 0 || file.type.indexOf('jpeg') >= 0 || file.type.indexOf('jpg') >= 0){
                if (file.size > 1536 * 1024){
                    this.handleMaxSize(file);
                }else{
                   return true;
                }
            }else{
                this.handleFormatError(file);
            }
            return false;
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 1.5M。'
            });
        },
        createImageKey : function (file) {
            var types = file.type.split('/');
            var type = types[types.length - 1];
            var key = uuidv4();
            var name = "agent/" + key + '.' + type;
            return name;
        },
        identityFrontUpload (file) {
            if (this.identityUploadJudge(file)){
                var _this = this;
                _this.identityFrontLoading = true;
                var iamgeKey = _this.createImageKey(file);
                _this.$uploadImageToOSS(file,iamgeKey, function (cbk){
                     _this.imageSrcFront = cbk;
                     _this.$post(_this.host_bdd + '/agency/v1/inferior/info/upload', {
                            path:iamgeKey,
                            type:1,
                            infoId:_this.auditModel.waitingAuditInfoId ? _this.auditModel.waitingAuditInfoId : null
                        }, function (rt) {
                            _this.identityFrontLoading = false;
                            if (rt.data.code != 200) {
                                _this.$Message.error(rt.data.error);
                                return;
                            }

                            _this.auditModel.waitingAuditInfoId = rt.data.tenantAgentInfo.id;

                            if (rt.data.tenantAgentInfo.identity) {
                                _this.auditModel.identity = rt.data.tenantAgentInfo.identity;
                            }
                            if (rt.data.tenantAgentInfo.name) {
                                _this.auditModel.realName = rt.data.tenantAgentInfo.name;
                            }
                            if (rt.data.tenantAgentInfo.gender) {
                                 _this.auditModel.gender = rt.data.tenantAgentInfo.gender;
                            }
                            if (rt.data.tenantAgentInfo.birth) {
                                _this.auditModel.birth = rt.data.tenantAgentInfo.birth;
                            }
                            if (rt.data.tenantAgentInfo.nation) {
                                for (var i = 0; i < _this.nationOtions.length; i++) {
                                    if (_this.nationOtions[i] == rt.data.tenantAgentInfo.nation){
                                        _this.auditModel.nation = rt.data.tenantAgentInfo.nation;
                                        return;
                                    }
                                }
                                _this.auditModel.nation = _this.nationOtions[_this.nationOtions.length - 2];
                            }
                      });
                });
            }
            return false;
        },
        identityBackUpload (file) {
            if (!this.auditModel.waitingAuditInfoId) {
                this.$Message.error("请先上传正面照片");
                return;
            }
            if (this.identityUploadJudge(file)){
                var _this = this;
                _this.identityBackLoading = true;

                var iamgeKey = _this.createImageKey(file);
                _this.$uploadImageToOSS(file,iamgeKey, function (cbk){
                    _this.imageSrcBack = cbk;
                    _this.$post(_this.host_bdd + '/agency/v1/inferior/info/upload', {
                            path:iamgeKey,
                            type:2,
                            infoId:_this.auditModel.waitingAuditInfoId
                        }, function (rt) {
                            _this.identityBackLoading = false;
                            if (rt.data.code != 200) {
                                _this.$Message.error(rt.data.error);
                                return;
                            }

                            _this.auditModel.infoId = rt.data.tenantAgentInfo.id;

                            if (rt.data.tenantAgentInfo.identity) {
                                _this.auditModel.identity = rt.data.tenantAgentInfo.identity;
                            }
                            if (rt.data.tenantAgentInfo.name) {
                                _this.auditModel.realName = rt.data.tenantAgentInfo.name;
                            }
                            if (rt.data.tenantAgentInfo.gender) {
                                 _this.auditModel.gender = rt.data.tenantAgentInfo.gender;
                            }
                            if (rt.data.tenantAgentInfo.birth) {
                                _this.auditModel.birth = rt.data.tenantAgentInfo.birth;
                            }
                            if (rt.data.tenantAgentInfo.nation) {
                                for (var i = 0; i < _this.nationOtions.length; i++) {
                                    if (_this.nationOtions[i] == rt.data.tenantAgentInfo.nation){
                                        _this.auditModel.nation = rt.data.tenantAgentInfo.nation;
                                        return;
                                    }
                                }
                                _this.auditModel.nation = _this.nationOtions[_this.nationOtions.length - 2];
                            }
                      });
                });
            }
            return false;
        }
    }
}
</script>
