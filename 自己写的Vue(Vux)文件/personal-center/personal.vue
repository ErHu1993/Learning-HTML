<style scoped>
    .box{
        background-color: #fbf9fe;
    }

    .header > * {
        background-color: transparent;
    }

    .header{
        background: url('../../assets/personal-header-bg.png') no-repeat;
        background-size:  100% 100%;
        position: relative;
    }

    .header-head {
        margin-top: 30px;
        margin-left: 15px;
        border: 2px solid #a4cbfb;
        width:60px;
        height:60px;
        border-radius: 30px;
        display: inline-block;
    }

    .header-name {
        position: absolute;
        display: inline-block;
        font-size: 16px;
        top: 46px;
        margin-left: 15px;
        color: #fff;
    }

    .header-arow{
        margin-right: 10px;
        width: 8px;
        height: 8px;
        vertical-align: middle;
        position: relative;
        float: right;
        top: 55px;
    }

    .card-flex {
      display: flex;
    }

    .card-content {
        padding-bottom: 60px;
    }

    .card-flex > div {
      flex: 1;
      text-align: center;
      font-size: 12px;
    }

    .card-flex span {
        margin-top: 15px;
        display: block;
        color: #fff;
        font-size: 23px;
    }

    .card-flex strong {
        height:30px;
        width:1px;
        margin: auto 0px;
        background-color: #dddddd;
    }

    .card-flex label{
        color:#dddddd;
        font-size: 13px;
    }

    .weui-panel:before {
        border-top: 0px;
    }

    .group img{
        display:block;
        margin-right:10px;
        width: 20px;
    }

    .qr-header{
        margin-left: 15px;
        margin-right: 15px;
        margin-top: 15px;
        height: 1.2rem;
    }

    .qr-header-img{
        display: inline-block;
        width:48px;
        height:48px;
        border-radius: 24px;
        float: left;
    }

    .qr-header-content{
        margin-top: 5px;
        display: inline-block;
        float: left;
        margin-left: 20px;
    }

    .qr-header-content label{
        display: block;
        text-align: left;
    }

    .qr-img img{
        max-width:95%
    }

    .arrow{
        position: absolute;
        top: 50%;
        right: 2px;
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-top: -4px;
        border-width: 2px 2px 0 0;
        border-color: #C8C8CD;
        border-style: solid;
        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    }

    .weui-panel:after{
        border: 0px;
    }

    .cell-padding {
        padding: 15px 15px;
    }

</style>

<template>
    <div class="box">
        <div class="header" @click='userHeaderClick'>
            <img class="header-head" v-show='!tenantAccount.portrait' src='../../assets/head.png'>
            <img class="header-head" v-show='tenantAccount.portrait' :src='tenantAccount.portrait'>
            <label class="header-name" v-text='tenantAccount.user.name'></label>
            <div class="header-arow"><i class="arrow"></i></div>
            <card style="margin-top: 30px;">
                <div slot="content" class="card-flex card-content">
                    <div @click='gotoCashAmount'>
                        <label>我的账户 ( 元 )</label>
                        <span>{{tenantAccount.cashAmount}}</span>
                    </div>
                    <strong></strong>
                    <div @click='gotoPremiumAmount'>
                        <label>我的保费 ( 元 )</label>
                        <span>{{tenantAccount.premiumAmount}}</span>
                    </div>
                </div>
            </card>
        </div>
        <group class="group" :gutter='0'>
            <cell class='cell-padding'
                v-for="item in cellsData "
                :key="item.title"
                :title='item.title'
                is-link
                @click.native='groupCellClick(item)'>
                <img slot="icon" :src="item.icon">
            </cell>
        </group>
        <group class="group">
            <cell class='cell-padding' title="邀请好友" is-link @click.native='showQrCode'>
                <img slot="icon" src="../../assets/personal-qr.png">
            </cell>
            <cell class='cell-padding' title="联系客服">
                <img slot="icon" src="../../assets/personal-service.png">
                <div slot="value">
                    <a class="a-tel" href="tel:0551-62809739">0551-62809739</a>
                </div>
            </cell>
        </group>
        <actionsheet v-model="showInsurancePrice" :menus="insurancePriceMenus" @on-click-menu="insurancePriceClick" show-cancel></actionsheet>

    </div>
</template>

<script>
    import { Group, Cell ,XInput ,XButton ,Card ,Actionsheet} from 'vux'

    export default {

        components: {
            Group,
            Cell,
            XInput,
            XButton,
            Card,
            Actionsheet
        },

        data () {
            return {
                showQR:false,
                showInsurancePrice:false,
                insurancePriceMenus: {
                    menu1: '车险报价',
                    menu2: '报价记录'
                 },
                qrUrl:"",
                cellsData:[
                    {
                        title:"我的团队",
                        icon:require('../../assets/personal-team.png'),
                    },
                    {
                        title:"车险报价",
                        icon:require('../../assets/personal-price.png'),
                    },
                    {
                        title:"我的订单",
                        icon:require('../../assets/personal-order.png'),
                    }
                ],
                tenantAccount: {
                    portrait:"",
                    cashAmount:"",
                    premiumAmount:"",
                    user: {
                        name:"",
                        mobile:""
                    }
                }
            }
        },
        mounted :function(){
            var _this = this;
            this.$nextTick(function () {
                _this.$http.get(_this.host_bdd + '/agent/v1/info').then((rt) => {
                    if (rt.data.code != 200) {
                        _this.$vux.toast.text(rt.data.error, 'top');
                        return;
                    }
                    if (!rt.data.tenantAgentInfo) {
                        let url = location.hash.substr(1);
                        _this.$router.push({ path:'/information', query: { url:url, title: document.title } });
                        return;
                    }
                    _this.getUserInfo();
                });
            });
        },

        methods : {
            getUserInfo: function () {
                var _this = this;
                _this.$http.get(_this.host_bdd + '/agent/v1/home').then((rt) => {
                    if (rt.data.code != 200) {
                         _this.$vux.toast.text(rt.error, 'top');
                         return;
                     }
                     if (rt.data.tenantAccount) {
                         _this.tenantAccount = rt.data.tenantAccount;
                         _this.qrUrl = _this.host_bdd + "/agent/v1/qr?tenantId=" + _this.tenantAccount.id + "&width=300&height=300";
                     }
                 });
            },
            gotoCashAmount : function (event) {
                this.$router.push({ path: '/account'});
                event.cancelBubble = true;
            },
            gotoPremiumAmount : function (event) {
                this.$router.push({ path: '/account/my/premium'});
                event.cancelBubble = true;
            },
            userHeaderClick : function (event) {
                this.$router.push({ path: '/edit'});
                event.cancelBubble = true;
            },
            showQrCode : function () {
                this.$router.push({ path: '/invite' , query:{
                    qrUrl : this.qrUrl
                }});
            },
            groupCellClick : function (item) {
                if (item.title === "我的团队") {
                    if (this.tenantAccount.hasInferior){
                        this.$router.push({ path: '/team/list'});
                    }else{
                        this.$router.push({ path: '/team/empty' ,query : {
                            title : '我的团队'
                        }});
                    }
                }else if (item.title === "车险报价") {
                    this.showInsurancePrice = true;
                }else if (item.title === "我的订单"){
                    this.$router.push('/order');
                }
            },
            insurancePriceClick  : function (index) {
                if (index == "menu1"){
                    this.$router.push({ path: '/car-insurance/product-list'});
                }else if (index == "menu2"){
                    this.$router.push('/history');
                }else {
                    //取消
                }
            }
        }
    }
</script>
