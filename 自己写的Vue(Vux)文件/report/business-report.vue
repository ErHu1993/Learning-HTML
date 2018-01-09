<style scoped>
.main {
  height: 100%;
  width: 100%;
}
</style>

<template>
    <div class="main">
      <iframe
        class="iframe"
        :src='iframeSrc'
        frameborder="0"
        width="100%"
        height="100%"
        marginheight="0"
        marginwidth="0"
        scrolling="yes">
        </iframe>
    </div>
</template>

<script>
    export default {
      data () {
        return {
          iframeSrc: ''
        }
      },
      watch: {
        '$route': function (newValue) {
          this.iframeSrc = 'http://gd.witgo.cn:8080/report/ReportServer?reportlet=' + encodeURIComponent(this.$route.query.reportlet)
        }
      },
      created () {
        this.iframeSrc = 'http://gd.witgo.cn:8080/report/ReportServer?reportlet=' + encodeURIComponent(this.$route.query.reportlet)
      }
    }
</script>
