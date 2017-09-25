<style scoped>
    .main-body{
        background-color: #fff;
        text-align: center;
        height: 165px;
        background: url('../../assets/acount-income-bg.png') repeat;
        background-size: 100% auto;
    }

    .box p {
        text-align: center;
        line-height: 100%;
    }

    .header {
        color: #dddddd;
        font-size: 15px;
        padding-top:30px;
    }

    .incomeAmount{
        color: #fff;
        font-size: 40px;
        padding-top:15px;
    }

    .footer {
        color: #fff;
        padding-top:15px;
        font-size: 15px;
    }

</style>

<template>
    <div class="main-body">
        <p class="header"> {{headerModel.headerTitle}} </p>
        <p class="incomeAmount"> {{headerModel.incomeAmount}} </p>
        <p class="footer"> {{headerModel.footerTitle}} </p>
    </div>
</template>

<script>

    export default {

        data () {
            return {

            }
        },

        props: {
            headerModel : {
                headerTitle : String,
                incomeAmount : String,
                footerTitle : String
            }
        }
    }
</script>