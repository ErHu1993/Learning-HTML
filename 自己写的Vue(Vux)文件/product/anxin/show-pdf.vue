<style scoped>
    .container {
        padding:  10px;
    }

    .center-block {
        text-align: center;
    }

    .center-block img {
        display: block;
        width: 100%;
        text-align: center;
    }
</style>

<template>
<div class="container">
    <div class="center-block" v-for='item in images' >
      <img :src='item' @click='previewImage($event)'>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 0:安心综合投保须知-执业代码 1:安心综合投保须知-违反如实告知的后果 2:安心综合保险条款（A + B）3: 安心住院费用医疗保险条款（A + B）4: 安心E家 5：安心E生
      category: 0,
      images: []
    }
  },
  methods: {
    previewImage (event) {
      this.$wechat.previewImage({
        current: event.target.src,
        urls: [event.target.src]
      })
    }
  },
  created () {
    if (this.$route.query) this.category = this.$route.query.category
    if (this.$route.query) document.title = this.$route.query.title

    switch (this.category) {
      case 0:
        {
          for (let i = 1; i <= 14; i++) {
            let name = 'static/pdf-images/anxin-occupational-pdf/0_' + i + '.png'
            this.images.push(name)
          }
          break
        }
      case 1:
        {
          for (let i = 1; i <= 1; i++) {
            let name = 'static/pdf-images/violation-truthfully-informed.png'
            this.images.push(name)
          }
          break
        }
      case 2:
        {
          for (let i = 1; i <= 7; i++) {
            let name = 'static/pdf-images/anxin-compre-insure-terms/0_' + i + '.png'
            this.images.push(name)
          }
          for (let i = 1; i <= 8; i++) {
            let name = 'static/pdf-images/anxin-compre-insure-terms/1_' + i + '.png'
            this.images.push(name)
          }
          break
        }
      case 3:
        {
          for (let i = 1; i <= 8; i++) {
            let name = 'static/pdf-images/anxin-hospital-insure-terms/0_' + i + '.png'
            this.images.push(name)
          }
          for (let i = 1; i <= 8; i++) {
            let name = 'static/pdf-images/anxin-hospital-insure-terms/1_' + i + '.png'
            this.images.push(name)
          }
          break
        }
      case 4:
        {
          for (let i = 1; i <= 6; i++) {
            let name = 'static/pdf-images/anxin-ehome-insure-terms/0_' + i + '.png'
            this.images.push(name)
          }
          for (let i = 1; i <= 8; i++) {
            let name = 'static/pdf-images/anxin-ehome-insure-terms/1_' + i + '.png'
            this.images.push(name)
          }
          break
        }
      case 5:
        {
          for (let i = 1; i <= 8; i++) {
            let name = 'static/pdf-images/anxin-elife-insure-terms/0_' + i + '.png'
            this.images.push(name)
          }
          break
        }
    }
  }
}
</script>
