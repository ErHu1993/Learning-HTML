<style scoped>
    .box{
        background-color: #fbf9fe;
    }
</style>

<template>
    <div class="box">
        <msg title="提交成功资料审核中" description="1-3个工作日内将返回结果" :buttons="buttons"></msg>
    </div>
</template>

<script>

import { Msg} from 'vux'

    export default {

        components: {
            Msg
        },

        data () {
            return {
                buttons: [{
                type: 'primary',
                text: "进入" + (this.$route.query.title ? this.$route.query.title : '个人中心'),
                onClick: this.jump.bind(this)
              }]
            }
        },

        methods: {
            jump : function () {
                if (this.$route.query.url){
                    this.$router.push({ path: this.$route.query.url });
                } else {
                    this.$router.push({ path: '/personal' });
                }
            }
        }
    }
</script>