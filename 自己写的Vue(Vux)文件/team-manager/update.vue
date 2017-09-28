<style scoped>
    /* mainBody */
    .main{
        height: 100%;
        background-color: #f2f6ff;
    }

    .font_12 >{
        font-size: 25px;
        line-height: 25px;
    }

    .form-input{
        width: 240px;
    }

    /* 添加列表 */
    .updateList{
        background-color: #fff;
    }

</style>

<template>
    <div class="main">
        <div class="updateList">
        <breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
            <Form ref="userModel" :model="userModel" :rules="rulesModel" inline :label-width="100">
                <Form-item label="团员名称" prop="name">
                    <Input class="form-input" v-model="userModel.name" placeholder="请输入团员名称"></Input>
                </Form-item>
                <Form-item label="备注" prop="remark">
                    <Input class="form-input" v-model="userModel.remark" placeholder="团员备注信息（选填）"></Input>
                </Form-item>
                <Form-item label="邮箱" prop="email">
                    <Input class="form-input" v-model="userModel.email" placeholder="请输入邮箱地址"></Input>
                </Form-item>
                <!-- <br/><br/><br/><br/> -->
            </Form>

            <!-- 提交返回按钮 -->
            <div style="padding-bottom: 60px; padding-top: 30px; overflow: hidden;background-color: #fff">
             <Button type="error" style="margin-right: 20px;float: right;width:80px;" @click="handleRemove('userModel')">移除</Button>
             <Button type="info" style="background-color: #16ce79 ;border:1px solid #16ce79; float:right;margin-right: 20px;width:80px;" @click="handleBack('userModel')">返回</Button>
             <Button type="primary" style="margin-right: 20px;float: right;width:80px;" @click="handleSubmit('userModel')">保存</Button>
         </div>
     </div>
 </div>
</template>

<script>
import Breadcrumb from '@/components/layout/Breadcrumb.vue';

    export default {
        mounted :function(){
            this.$nextTick(function () {
                if (typeof(this.$route.query.user) != "undefined" && typeof(this.$route.query.user.id) != "undefined" && this.$route.query.user.id.length){
                    this.userModel.name = this.$route.query.user.name;
                    this.userModel.remark = this.$route.query.user.comment;
                    this.userModel.email = this.$route.query.user.contactMail;
                    this.userModel.id = this.$route.query.user.id;
                    return;
                }
                this.$router.go(-1);
            });
        },
        data () {
            var _this = this;
            return {
                breadcrumb: ['编辑团员'],
                userModel:{
                    id:'',
                    name:'',
                    remark:'',
                    email:''
                },
                rulesModel:{
                    remark: [
                    { required: false}
                    ],
                    name: [
                    {required: true, message: '团员名称不能为空', trigger: 'blur'},
                    ],
                    phoneNum: [
                    { required: true, message: '手机号码不能为空',trigger: 'blur' },
                    { type: 'string', message: '手机号码格式不正确', pattern:/^\d{11}$/ ,trigger: 'blur' },
                    ],
                    email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleBack :function (model) {
                if (this.userModel.name || this.userModel.email || this.userModel.phoneNum || this.userModel.remark){
                    this.$Modal.confirm({
                        title: '温馨提示',
                        content: '是否放弃编辑',
                        onOk: () => {
                            this.$router.go(-1);
                        }
                    });
                }else{
                    this.$router.push({ path: '/team-manager/list' });
                }
            },
            handleSubmit :function (model) {
                var _this = this;
                _this.$refs[model].validate((valid) => {
                    if (valid) {
                        _this.$post(_this.host_bdd + '/agency/v1/inferior/update', {
                            inferiorId:_this.userModel.id,
                            name:_this.userModel.name,
                            comment:_this.userModel.remark,
                            mail:_this.userModel.email
                        }, function (rt) {
                            if (rt.data.code != 200) {
                                _this.$Message.error(rt.data.error);
                                return;
                            }
                            _this.$router.push({ path: '/team-manager/list' });
                            _this.$Message.success('更新成功!');
                            _this.$router.go(-1);
                        });
                    } else {
                        _this.$Message.error('请完整填写信息!');
                    }
                })
            },
            handleRemove :function () {
                var _this = this;
                _this.$Modal.confirm({
                    title: '温馨提示',
                    content: '确定删除',
                    onOk: () => {
                        _this.$post(_this.host_bdd + '/agency/v1/inferior/remove', {
                            inferiorId: _this.userModel.id
                        }, function (rt) {
                           if (rt.data.code != 200) {
                            _this.$Message.error(rt.data.error);
                            return;
                        }
                        _this.$Message.success('删除成功!');
                        _this.$router.push({ path: '/team-manager/list' });
                    });
                    }
                });
            }
        },
        components: {
            Breadcrumb
        },
    }
</script>
