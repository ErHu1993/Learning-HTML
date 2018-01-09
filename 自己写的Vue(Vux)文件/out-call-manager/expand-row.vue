<style scoped>
    .expand-row{
        margin-left: 15px;
    }

</style>
<template>
    <div class="expand-row">
    </div>
</template>
<script>
    export default {
      data () {
        return {
          getButtonShow: true
        }
      },
      props: {
        row: Object
      },
      created () {
        this.getVoice()
      },
      methods: {
        getVoice () {
          var _this = this
          this.$getImageUrlFromOSS(this.row.downloadUrl, function (source) {
            _this.createAudio(source)
          })
        },
        createAudio (source) {
          var audio = document.createElement('AUDIO')
          audio.setAttribute('src', source)
          audio.setAttribute('controls', 'controls')
          document.getElementsByClassName('expand-row')[0].appendChild(audio)
        }
      }
    }
</script>
