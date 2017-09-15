<style less='scss' scoped>
    .box{
        background-color: #fbf9fe;
    }

    .box-img img {
        width:100%;
        height:33%;
    }

    .submit-button{
        padding: 0 10px;
        margin-top: 20px;
        height: 45px;
    }

    .take-photo-img{
        margin-left: 10px;
        background-image: url("../../assets/camera.png");
        display: inline-block;
        background-size: 100% auto;
        vertical-align: middle;
        width: 28px;
        height: 21px
    }

</style>

<template>
    <div class="box">
        <div class="box-img">
            <img :src="bannerSrc">
        </div>
        <group>
            <popup-picker title="投保城市   "
                :data="addressData"
                :columns="2"
                v-model="addressValue"
                ref="addressPicker"
                value-text-align="left"
                @on-change='addressChange'>
            </popup-picker>
            <x-input title="车牌号码" v-model="numberPlate" :is-type="plateNoRules">
                <label slot="right">未上牌不用填</label>
                <label slot="right" class="take-photo-img" @click='takePhotoToCarInformation'></label>
            </x-input>
        </group>
        <section class="submit-button">
            <x-button type='primary' @click.native='nextStep'>下一步</x-button>
        </section>
    </div>
</template>

<script>
import $ from 'zepto';
import { Group, Cell ,XInput ,Picker,PopupPicker ,GroupTitle,XButton} from 'vux'

    export default {

        components: {
            Group,
            Cell,
            XInput,
            Picker,
            PopupPicker,
            GroupTitle,
            XButton
        },

        mounted : function() {
            var _this = this;
            _this.bannerSrc = _this.$route.query.bannerSrc;
            this.$nextTick(function () {
                _this.$http.get(_this.host_bdd + '/autoInsurance/v1/cities/vendor/'
                    + _this.$route.query.vendorId)
                .then((rt) => {
                    if (rt.data.code != 200) {
                         _this.$vux.toast.text(rt.error, 'top');
                         return;
                     }
                     if (rt.data.codeCities) {
                        _this.codeCities = rt.data.codeCities;
                        for (var i = 0; i < rt.data.codeCities.length; i++) {
                            var p =  rt.data.codeCities[i];
                            var provience = {
                                name: p.nameCn ,
                                value: p.nameCn,
                                parent: 0
                            };
                            _this.addressData.push(provience);
                            for (var j = 0; j < p.children.length; j++) {
                                 var c = p.children[j];
                                 var city = {
                                    name: c.nameCn,
                                    value: c.nameCn,
                                    parent: p.nameCn
                                };
                                _this.addressData.push(city);
                            }
                        }
                        _this.getCurrentAdress();
                     }
                 });
            });
        },

        data () {
            return {
                showAdressPicker : false,
                bannerSrc : '',
                addressValue : [],
                codeCities : [],
                currentCityCode :null,
                numberPlate : "",
                addressData : [],
                vehicle : {
                    registerDate : "", //登记日期
                    engineNo : "", //发动机号
                    vin : "", //车架号
                    model : "" //车牌型号
                },
                plateNoRules : function (value) {
                    return {
                      valid: ((value.length <= 2) || (value.length >= 7)),
                      msg : '请输入正确的车牌号码'
                    }
                },
            }
        },

        methods: {
            getCurrentAdress () {
                var _this = this;
                $.ajax({
                url: 'https://api.map.baidu.com/location/ip?ak=Do1F3sPqpyy3cRz79Y1EBqLmgKGdRS6Q&coor=bd09ll',
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'showLocation',
                success: function (rt) {
                        var cityCode = rt.content.address_detail.city_code;
                        for (var i = 0; i < _this.codeCities.length; i++) {
                            var provience = _this.codeCities[i];
                            for (var j = 0; j < provience.children.length; j++) {
                                var city = provience.children[j];
                                if (city.baiDuId == cityCode) {
                                     _this.addressValue.push(provience.nameCn);
                                     _this.addressValue.push(city.nameCn);
                                     _this.currentCityCode = city;
                                    return;
                                }
                            }
                        }
                    }
                })
            },
            takePhotoToCarInformation () {
                var _this = this;
                _this.$uploadImage( function (serverId,localId) {
                    _this.$post(_this.host_bdd + '/autoInsurance/v1/upload/vehicle', {
                        mediaId: serverId,
                    }, function (rt) {
                        _this.$vux.loading.hide();
                        if (rt.data.code != 200) {
                            _this.$vux.toast.text(rt.data.error, 'top');
                            return;
                        }
                        if (rt.data.certVehicleLicense){
                            _this.vehicle.registerDate = rt.data.certVehicleLicense.registerDate;
                            _this.vehicle.engineNo = rt.data.certVehicleLicense.engineNo;
                            _this.vehicle.vin = rt.data.certVehicleLicense.vin;
                            _this.vehicle.model = rt.data.certVehicleLicense.model;
                            _this.numberPlate = rt.data.certVehicleLicense.plateNo;
                        }
                    });
                });
            },
            addressChange (value) {
                for (var i = 0; i < this.codeCities.length; i++) {
                    var provience = this.codeCities[i];
                     if (provience.nameCn == value[0]) {
                        this.numberPlate = provience.plateCode;
                        for (var j = 0; j < provience.children.length; j++) {
                            var city = provience.children[j];
                            if (city.nameCn == value[1]) {
                                this.numberPlate += city.plateCode;
                                this.currentCityCode = city;
                                return;
                            }
                        }
                     }
                }
            },
            nextStep () {

                if (!this.plateNoRules(this.numberPlate).valid) {
                    this.$vux.toast.text('请输入正确的车牌号码', 'top')
                    return;
                }

                var flowData = {
                    vendorId : this.$route.query.vendorId,
                    produceId : this.$route.query.produceId,
                    city : this.currentCityCode
                };

                if (this.numberPlate.length > 2){
                    flowData.plateNo = this.numberPlate;
                }
                if (this.vehicle) {
                    flowData.vehicle = this.vehicle;
                }
                this.storage.set('flowData', flowData);
                this.$router.push({ path: '/car-insurance/car-information'});
            }
        }
    }
</script>