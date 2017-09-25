<style scoped>
    .box{
        background-color: #000;
    }

    .title p {
        text-align: center;
        padding: 5px;
        color: #fff;
        font-size: 14px;
        background-color: #5b4a1f;
    }

    .content {
        background-color: #fff;
        border-radius: 5px;
        margin: 10px;
        margin-top: 20px;
    }

    .header{
        position: relative;
    }

    .header-head {
        margin-top: 30px;
        margin-left: 15px;
        border: 2px solid #a4cbfb;
        width:40px;
        height:40px;
        border-radius: 30px;
        display: inline-block;
    }

    .header-name {
        position: absolute;
        display: inline-block;
        font-size: 15px;
        top: 38px;
        margin-left: 15px;
        color: #000;
    }

    .qr-div {
        text-align: center;
    }

    .qrImage {
        width: 5rem;
        height: 5rem;
    }

    .copy-div {
        text-align: center;
    }

    .copy-button {
        width: 5rem;
        height: 1.5rem;
        border: 0px;
        background: url('../../assets/icon-copy-button.png') no-repeat;
        background-size: 100% auto;
    }

    .footer{
        padding: 10px;
    }

    .footer p {
        font-size: 13px;
    }

</style>

<template>
    <div class="box">
        <div class="title">
            <p>请在一个工作日内完成支付逾期订单自动取消</p>
        </div>

        <div class="content">
            <div class="header">
                <img class="header-head" src='../../assets/icon_alipay.png'>
                <label class="header-name">支付宝扫码支付</label>
            </div>
            <div class="qr-div">
                <img class="qr-img" :src="qrUrl">
            </div>
            <div class="copy-div">
                <button class="copy-button"
                    v-clipboard="payUrl"
                    @success="handleSuccess"
                    @error="handleError">
                </button>
            </div>
            <div class="footer">
                <p>温馨提示：<br>
                    1、将本页面截图，支付宝识别扫码或在新手机上用支付宝扫码支付；<br>
                    2、点击复制链接，打开浏览器粘贴链接，打开即可。
                </p>
            </div>
        </div>
    </div>
</template>

<script>

import { XButton } from 'vux'
import $ from 'zepto';

    export default {

        components: {
            XButton
        },

        created () {
            this.payUrl = this.$route.query.payUrl;
            this.qrUrl = this.host_bdd + "/lifeInsurance/v1/pay/qr?orderId=" + this.$route.query.orderId + "&width=300&height=300";
        },

        mounted :function(){
            var _this = this;
            this.$nextTick(function () {
                var footerHeight = $('.footer').height();
                var copyHeight = $('.copy-div').height();
                var titleHeight = $('.title').height();
                var headHeight = $('.header').height() ;
                var qrHeight = document.documentElement.clientHeight -
                footerHeight - copyHeight - titleHeight - headHeight - 40;
                $('.qr-img').css('width',qrHeight + 'px')
                $('.qr-img').css('height',qrHeight + 'px')
            });
        },

        data () {
            return {
                payUrl : '',
                qrUrl : ''
            }
        },

        methods: {
            handleSuccess(e) {
                this.$vux.toast.text("复制成功！已放入您的粘贴板。您可以手动在浏览器地址栏中粘贴打开", 'middle')
            },
            handleError(e) {
                this.$vux.toast.text("复制失败", 'middle')
            },
        }
    }
</script>