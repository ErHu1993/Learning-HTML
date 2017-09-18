<style scoped>

    .body {
        margin: 20px;
        border-radius: 10px;
        background-color: transparent;
        text-align: center;
        -moz-box-shadow:0px 0px 13px #535353;
        -webkit-box-shadow:0px 0px 13px #535353;
        box-shadow:0px 0px 13px #535353;
        background-color: #fff;
    }

    .invite-header {
        width: 100%;
        height: 3.76rem;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .body label{
        display: block;
        font-size: 13px;
        padding: 10px;
        text-align: left;
    }

    .body span{
        margin-top: 5px;
        display: block;
        width: 100%;
        text-align: center;
        font-size: 13px;
    }

    .body p{
        width: 100%;
        padding: 2px 0px;
        text-align: center;
        background-color: #dedede;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        font-size: 13px;
    }

    .qr-div{
        text-align: center;
    }

    .qr-img {
        border: 1px solid #e5e5e5;
    }

    .invite-button {
        width: 100%;
        height: 2.587rem;
    }

</style>

<template>
    <div class="main">
        <div class="body">
            <div>
                <img class="invite-header" src="../../assets/personal-invite-head.png">
                <label class="invite-label">
                    成功邀请至少1位好友注册成为代理人，即建团成功。团队成员每月完成的保费达到一定额度时，你就可以获得平台津贴奖励啦！
                </label>
            </div>
            <div class="qr-div">
                <img class="qr-img" :src="qrImageSrc">
            </div>
            <div class="footer">
                <span>长按分享或保存专属邀请码</span>
                <img class="invite-button" src="../../assets/personal-invite-button.png" @click='share = true'>
                <p>成功邀请的信息请在我的团队中查看</p>
            </div>
        </div>

        <div :class="{hide: !share}" @click='share = false'>
            <share-tip></share-tip>
        </div>
    </div>
</template>

<script>

import ShareTip from '@/components/ShareTip.vue';
import { XButton } from 'vux'

    export default {

        data () {
            return {
                qrImageSrc : '',
                share: false
            }
        },

        created () {
            let _this = this;
            _this.$wechat.ready( function() {
                _this.$wechat.showMenuItems({
                    // 要显示的菜单项，所有menu项见附录3
                    menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
                });
            });
        },

        mounted () {

            var headerHeight = $('.invite-header').height() + $('.invite-label').height();
            var footerHeight = $('.footer').height();
            var qrHeight = document.documentElement.clientHeight - footerHeight - headerHeight - 40 - 20;
            $('.qr-img').css('width',qrHeight + 'px');
            $('.qr-img').css('height',qrHeight + 'px');
            if (this.$route.query.qrUrl){
                this.qrImageSrc = this.$route.query.qrUrl;
            }
            this.getUserInfo();
        },

        components : {
            ShareTip
        },

        methods : {
            getUserInfo: function () {
                var _this = this;
                this.$http.get(_this.host_bdd + '/agent/v1/home').then((rt) => {
                    if (rt.data.code != 200) {
                         _this.$vux.toast.text(rt.error, 'top');
                         return;
                     }
                     if (rt.data.tenantAccount && !_this.qrImageSrc) {
                         _this.qrImageSrc = _this.host_bdd + "/agent/v1/qr?tenantId=" + rt.data.tenantAccount.id + "&width=300&height=300";
                     }
                     if (rt.data.tenantAccount.sharingUrl){
                        _this.shareApp(rt.data.tenantAccount.sharingUrl);
                     }
                 });
            },
            shareApp (shareLink) {
                shareLink = "http://" + location.host + "/html/invite-reigst.html?shareLink=" + encodeURIComponent(shareLink);
                var _this = this;
                this.$wechat.ready( function () {
                     _this.$wechat.showMenuItems({
                        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
                    });

                    _this.$wechat.onMenuShareAppMessage({
                        title: '光大保险出单神器，易销售高推广费',
                        desc: '成为光大保险代理人，人人都可以创建自己的团队，轻松推广收入过万！',
                        link: shareLink,
                        imgUrl: "http://" + location.host + "/html/images/hardcoding/icon.png",
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });

                    _this.$wechat.onMenuShareTimeline({
                        title: '光大保险出单神器，易销售高推广费',
                        link: shareLink,
                        imgUrl: "http://" + location.host + "/html/images/hardcoding/icon.png",
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                });
            }
        }
}
</script>
