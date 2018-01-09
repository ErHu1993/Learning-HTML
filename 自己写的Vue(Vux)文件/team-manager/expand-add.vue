<style scoped>

    table{
        text-align: center;
        width: 100%;
        border-top: 1px solid #e9eaec;
        border-left: 1px solid #e9eaec;
    }

    td{
        text-align: center;
        padding: 5px;
    }

    ul{
        padding: 5px;
        text-align: left;
    }

</style>
<template>
    <div>
        <div class="expand-row">
            <table cellpadding="0" cellspacing="0">
                <tbody>
                    <tr>
                        <td>已经是直属下级</td>
                        <td>待接受调整</td>
                        <td>无法导入</td>
                        <td>待成为代理人</td>
                    </tr>
                    <tr align="center">
                        <td>
                            <ul>
                                <li v-for='(item, index) in stateOne'>{{item}}</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li v-for='(item, index) in stateTwo'>{{item}}</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li v-for='(item, index) in stateThree'>{{item}}</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li v-for='(item, index) in stateFour'>{{item}}</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    export default {
      props: {
        row: Object
      },
      created () {
        this.getDetailDataList()
      },
      updated () {
        $('.ivu-table-expanded-cell').css({
          padding: '20px'
        })
      },
      data () {
        return {
          stateOne: [],
          stateTwo: [],
          stateThree: [],
          stateFour: []
        }
      },
      methods: {
        getDetailDataList () {
          var _this = this
          _this.$get(_this.host_bdd + '/agency/v1/inferior/import/detail/' + _this.row.id
                , function (rt) {
                  if (rt.data.code !== 200) {
                    _this.$Message.error(rt.data.error)
                    return
                  }
                  _this.stateOne = rt.data.stateOne
                  _this.stateTwo = rt.data.stateTwo
                  _this.stateThree = rt.data.stateThree
                  _this.stateFour = rt.data.stateFour
                })
        }
      }
    }
</script>
