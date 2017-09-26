<style scoped>
    .card {
        padding: 15px;
        background-color: #fff;
    }

    .icon {
        width: 1.6rem;
        margin: 0 auto 0.533rem;
        border-radius: 50%;

    }

    .icon img {
        display: block;
    }

    .balance {
        padding: 0.133rem 0;
    }

    .msg {
        padding: 0.267rem 0 0;
    }

    .list {
        padding: 0.4rem 0 0;
    }

    .list > div {
        width: 33.33%;
    }

    .list > div + div {
        border-left: 1px solid #ccc;
    }

    .list > div a {
        display: block;
    }

    .submit {
        margin: 0.4rem 0 0;
        padding: 0 15px;
    }

    .kefu {
        position: absolute;
        bottom: 0;
        width: 100%;
        line-height: 40px;
    }

    .ios-help-outline {
        vertical-align: top;
        margin: 0 0 0 5px;
        line-height: 1.067rem;
        fill: #929292;
    }

    .dialog-box {
        width: 80%;
        margin: 0 auto;
        padding: 10px;
        text-align: left;
        background-color: #fff;
        border-radius: 4px;
        height: 400px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .dialog-box h3{
        text-align: center;
    }

    .dialog-box p{
        padding: 10px 5px;
    }

    .dialog-close {
        padding: 10px 0 0;
        text-align: center;
        color: #fff;
    }

    .tax-table td  {
        border-right: 1px solid #5182bb;
        border-bottom: 1px solid #5182bb;
        text-align: left;
        padding-left: 10px;
    }

    .tax-table .row1 td {
        background-color: #5182bb;
        color: #fff;
        font-size: 15px;
        font-weight: normal;
        text-align: center;
    }

    .tax-table table{
        text-align: center;
        width: 100%;
        border-top: 1px solid #5182bb;
        border-left: 1px solid #5182bb;
    }

    .tax-table .border-bottom-class {
        border-bottom: 1px solid #5182bb;
    }

    .tax-table .background-color-class {
        background-color:#b9cce3;
    }
</style>

<template>
    <section class="container">
        <section class="card">
            <div class="text_right">
                <router-link class="cr_black" to='/account/bills'>收支明细</router-link>
            </div>
            <div class="text_center">
                <router-link class="cr_black" to='/account/bills'>
                    <p class="icon"><img src="../../assets/money.png" width="100%"></p>
                    <p class="cr_black fs24">￥{{catpitalAccount.cashAmount}}</p>
                    <p class="cr_gray fs14 balance">可用余额</p>
                </router-link>
            </div>
            <div class="clearfix list">
                <div class="l text_center list-center" @click='goTransitInAmount'>
                    <p class="cr_black fs16">￥{{catpitalAccount.transitInAmount}}</p>
                    <p class="fs12 lt20 cr_black">收入待入账</p>
                </div>
                <div class="l text_center list-left" @click='goTransitOutAmount'>
                    <p class="cr_black fs16">￥{{catpitalAccount.transitOutAmount}}</p>
                    <p class="fs12 lt20 cr_black">支出待入账</p>
                </div>
                <div class="l text_center list-right">
                    <router-link to='/account/my/income'>
                        <p class="cr_black fs16">￥{{catpitalAccount.totalIncomeAmount}}</p>
                        <p class="fs12 lt20 cr_black">我的收入</p>
                    </router-link>
                </div>
            </div>
        </section>
        <section class="submit">
            <x-button type="primary" @click.native="extract">提现</x-button>
            <div class="text_center msg">账户余额可申请提现到微信</div>
        </section>
        <div class="text_center kefu">
            <p>
                <a href="javascript:;" @click="showHideTax=true">扣税说明</a>
            </p>
            客服电话 <a class="a-tel" href="tel:0551-62809739">0551-62809739</a>
        </div>
        <div v-transfer-dom>
            <x-dialog v-model="showHideTax" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', 'background-color': 'transparent'}">
                <div class="clearfix dialog-box">
                    <h3>关于代扣代缴个税的说明</h3>
                    <p>根据国家《个人所得税法》的劳务报酬所得规定，我们将对您的收入依法代扣代缴个人所得税，扣税标准如下：</p>
                    <div class="tax-table">
                        <table cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr class="row1">
                                    <td>每月累计收入</td>
                                    <td>个税计算公式</td>
                                </tr>
                                <tr>
                                    <td class="border-bottom-class background-color-class">800元及以下</td>
                                    <td class="border-bottom-class background-color-class">无需扣税</td>
                                </tr>
                                <tr>
                                    <td class="border-bottom-class">800元＜每月累计收入≤4000元</td>
                                    <td class="border-bottom-class">（每月累计收入-800）*20%</td>
                                </tr>
                                <tr>
                                    <td class="border-bottom-class background-color-class">4000元＜每月累计收入≤25000元</td>
                                    <td class="border-bottom-class background-color-class">每月累计收入*td（1-20%）*20%</td>
                                </tr>
                                <tr>
                                    <td class="border-bottom-class">25000元＜每月累计收入≤62500元</td>
                                    <td class="border-bottom-class">每月累计收入*（1-20%）*30%-2000</td>

                                </tr>
                                <tr>
                                    <td class="background-color-class">62500元以上</td>
                                    <td class="background-color-class">每月累计收入*（1-20%）*40%-7000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="dialog-close" @click="showHideTax = false">
                    <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
                </div>
            </x-dialog>
        </div>
    </section>
</template>

<script>
import { XButton, XDialog, TransferDomDirective as TransferDom   } from 'vux';

export default {
    data () {
        return {
            catpitalAccount: {},
            showHideTax: false
        }
    },
    components: {
        XButton,
        XDialog
    },
    directives: {
        TransferDom
    },
    created () {
        this.getAccount();
    },
    methods: {
        // 资金账户信息
        getAccount () {
            var _this = this;
            this.$http.get(this.host_bdd + '/captial/v1/account').then((rt) => {
                if (rt.data.code != 200) {
                    _this.$vux.toast.text(rt.data.error, 'top');
                    return;
                }

                _this.catpitalAccount = rt.data.catpitalAccount;
            });
        },
        extract () {
            var _this = this;
            this.$http.get(this.host_bdd + '/agent/v1/info').then( (rt) => {
                if (rt.data.code != 200) {
                    _this.$vux.toast.text(rt.data.error, 'top');
                    return;
                }

                if (rt.data.tenantAgentInfo.state == 1) {
                    _this.$router.push({path:'/account/apply', query:{
                        amount:_this.catpitalAccount.cashAmount,
                        outcomeCount:_this.catpitalAccount.outcomeCount
                    }});
                } else {
                    _this.$vux.toast.text('待审核状态不允许提现', 'top');
                }
            });
        },
        goTransitOutAmount () {
            this.$router.push({ path: '/account/apply-list' , query : {
                dealType : 'decharge'
            }});
        },
        goTransitInAmount () {
            this.$router.push({ path: '/account/apply-list' , query : {
                dealType : 'recharge'
            }});
        }
    }
}
</script>
