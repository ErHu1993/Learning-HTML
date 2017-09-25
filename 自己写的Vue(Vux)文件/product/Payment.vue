<style lang="scss" scoped>
    .group {
        margin: 10px 0 0;
        background-color: #fff;
    }
    .cell {
        position: relative;
        display: flex;
        align-items: center;
        padding: 5px 15px;
    }

    .left {
        flex: 1;
    }

    .button {
        margin: 0.667rem 15px 0;
    }

    .group-title {
        padding: 5px 15px;
        background-color:#ffbf43;
    }
</style>

<template>
    <div class="container">
        <div class="group-title" v-if="order.limitDesc">
            <group-title slot="title" class="text_center" style="margin:0;color:#fff;">{{order.limitDesc}}</group-title>
        </div>
        <div class="group" style="margin:0;">
            <div class="cell">
                <div class="left">
                    <label>车牌号</label>
                </div>
                <div class="right">
                    <span>{{order.plateNo}}</span>
                </div>
            </div>
            <div class="cell">
                <div class="left">
                    <label>保险名称</label>
                </div>
                <div class="right">
                    <span>{{order.vendorName}}</span>
                </div>
            </div>
            <div class="cell">
                <div class="left">
                    <label>订单时间</label>
                </div>
                <div class="right">
                    <span>{{order.createTime | formatData}}</span>
                </div>
            </div>
            <div class="cell">
                <div class="left">
                    <label>应付金额</label>
                </div>
                <div class="right">
                    <span>￥{{order.premiumAmount}}</span>
                </div>
            </div>
        </div>
        <group title="收件人信息" label-width="80px" label-margin-right="10px" label-align="left">
            <x-input title="姓名" placeholder="请输入姓名" required v-model="user.name" text-align="right" @on-change="inputChange('name')"></x-input>
            <x-input title="手机" placeholder="请输入手机号码" required is-type="china-mobile" v-model="user.phone" text-align="right" @on-change="inputChange('phone')"></x-input>
            <x-address title="所在地区" ref="address" class="js_address" placeholder="请选择省市区" v-model="user.addressValue" text-align="right" raw-value :list="addressData" @on-hide="addressChange"></x-address>
            <x-input title="详细地址" placeholder="请输入详细地址" required v-model="user.details" text-align="right" @on-change="inputChange('detail')"></x-input>
        </group>

        <div class="group">
            <div class="cell" style="padding:10px 15px;">
                <div class="left">线下支付</div>
                <div class="right">
                    <check-icon :value="true"></check-icon>
                </div>
            </div>
        </div>

        <div class="button">
            <x-button type="primary" :disabled="disabled" @click.native="submit">确定支付</x-button>
        </div>
    </div>
</template>

<script>
import { formatDate } from '@/libs/format.js';
import { GroupTitle, Group, Cell, XInput, XButton, ChinaAddressV3Data , XAddress, XTextarea, CheckIcon  } from 'vux';
export default {
    data () {
        return {
            user: {
                name: '',
                phone: '',
                addressValue: [],
                details: '',
            },
            disabled: true,
            addressData: ChinaAddressV3Data,
            orderId: '',
            order: {},
            isInput: false,
            isAddress: false,
        }
    },
    components: {
        GroupTitle, Group, Cell, XInput, XButton, ChinaAddressV3Data , XAddress, XTextarea, CheckIcon
    },
    filters: {
        formatData (time) {
            let date = new Date(time * 1000);
            return formatDate(date, 'yyyy-MM-dd');
        }
    },
    created () {
        this.orderId = this.$route.query.orderId;
        this.getOrderDetail(this.orderId);
    },
    methods: {
        addressChange (str) {
            if (!str) {
                this.isAddress = false;
            } else {
                this.isAddress = true;
            }

            if (this.isInput && this.isAddress) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        },
        inputChange (val) {
            let reg = /^1[34578]\d{9}$/;
            if (
                this.user.name.length > 0 &&
                this.user.details.length > 0 &&
                reg.test(this.user.phone)
            ) {
                this.isInput = true;
            } else {
                this.isInput = false;
            }

            if (this.isInput && this.isAddress) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        },
        getOrderDetail (id) {
            this.$http.get(this.host_bdd + '/order/v1/' + this.orderId + '/detail').then( (rt) => {
                if (rt.data.code != 200) {
                    this.$vux.toast.text(rt.data.error, 'top');
                    return;
                }

                this.order = rt.data.order;
                this.user.name = rt.data.order.ownerName;
                this.user.phone = rt.data.order.ownerMobile;
            });
        },
        submit () {
            let user = this.user,
                addressValue = document.getElementsByClassName('vux-popup-picker-value')[0].innerText.replace(/\s/g, ','),
                data = {
                orderId: this.orderId,
                name: user.name,
                mobile: user.phone,
                address: addressValue + ',' +user.details,
            };
            this.$vux.loading.show({
                text: '正在提交数据'
            })
            this.$post(this.host_bdd + '/order/v1/autoInsurance/pay', data, (rt) => {
                this.$vux.loading.hide();
                if (rt.data.code != 200) {
                    this.$vux.toast.text(rt.data.error, 'top');
                    return;
                }

                this.$router.push({
                    path:'/product/success',
                    query: {
                        orderId: this.orderId,
                        premiumAmount: this.order.premiumAmount
                    }
                })
            });
        }
    }
}
</script>
