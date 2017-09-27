<style scoped>
    .expand-row{
        margin-left: 15px;
    }

</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8" class="col">
                <span class="expand-key">直属上级名称：</span>
                <span class="expand-value">{{ row.name }}</span>
            </Col>
            <Col span="8" class="col">
                <span class="expand-key">联系方式：</span>
                <span class="expand-value">{{ row.contactMobile }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>