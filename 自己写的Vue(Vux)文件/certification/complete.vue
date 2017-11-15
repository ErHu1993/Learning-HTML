<style scoped>
    .box{
        background-color: #fbf9fe;
        margin: 10px;
    }

    .box p{
        margin: 10px;
        text-align: center;
    }
</style>

<template>
    <div class="box">
        <msg title="提交成功资料审核中" description="1-3个工作日内将返回结果" :buttons="buttons">
        </msg>
        <p>温馨提示：审核通过并成为正式代理人后，才能提现哦</p>
    </div>
</template>

<script>
import {Msg} from 'vux'

export default {

  components: {
    Msg
  },

  data () {
    return {
      buttons: [{
        type: 'primary',
        text: '进入个人中心',
        onClick: this.jump.bind(this)
      }]
    }
  },

  methods: {
    jump: function () {
      this.$router.push({ path: '/personal' })
    }
  }
}
</script>
