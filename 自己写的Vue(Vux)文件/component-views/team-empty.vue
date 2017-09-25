<style scoped>

    .body {
        width: 100%;
        height: auto;
        background-color: #fff;
    }

    .body img{
        width: 100%;
        height: auto;
    }

</style>

<template>
    <div class="main">
        <div class="body">
            <img :src="imageSrc">
            <div>
                <img src="../../assets/team-empty-button.png" @click='goInvite'>
            </div>
            <router-link  to='/invite'>

            </router-link>
        </div>
    </div>
</template>

<script>
    export default {

        data () {
            return {
                imageSrc : "",
            }
        },

        mounted :function(){
            this.$nextTick(function () {
                var title = this.$route.query.title;;
                if (title == "津贴明细") {
                    this.imageSrc = require("../../assets/alowance-empty.png")
                }else {
                    this.imageSrc = require("../../assets/team-list-empty.png")
                }
                document.title = title;
            });
        },
        methods : {
            goInvite () {
                this.$router.push({ path: '/invite' });
            }
        }
    }
</script>