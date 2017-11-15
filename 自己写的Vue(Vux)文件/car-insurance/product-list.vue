<style scoped>
    .box{
        background-color: #fbf9fe;
    }

    .box-item {
        line-height: 0;
        margin: 10px;
        border-radius: 5px;
        -moz-box-shadow:0px 0px 13px #535353;
        -webkit-box-shadow:0px 0px 13px #535353;
        box-shadow:0px 0px 13px #535353;
    }

    .box-item img {
        width:100%;
        height:33%;
        border-radius:5px;
    }

    .box-item a {
        display: block;
        z-index: 2;
        height: 100%;
        width: 100%;
     }


</style>

<template>
    <div class="box">
        <div class="box-item"
        v-for="item in vendorsListData"
        @click='itemClick(item)'>
            <img :src="item.bannerSrc">
        </div>
    </div>
</template>

<script>
export default {

  mounted: function () {
    this.$nextTick(function () {
      this.getVendorsList()
    })
  },

  data () {
    return {
      vendorsListData: []
    }
  },

  methods: {

    getVendorsList: function () {
      var _this = this
      _this.$http.get(_this.host_bdd + '/autoInsurance/v1/vendors').then((rt) => {
        if (rt.data.code !== 200) {
          _this.$vux.toast.text(rt.error, 'top')
          return
        }
        if (rt.data.vendors) {
          _this.vendorsListData = rt.data.vendors
        }
      })
    },

    itemClick (item) {
      if (item.url) {
        window.location.href = item.url
      } else {
        this.$router.push({ path: '/car-insurance/quoted-price',
          query: {
            produceId: item.produceId,
            vendorId: item.id,
            bannerSrc: item.bannerSrc
          }})
      }
    }
  }
}
</script>
