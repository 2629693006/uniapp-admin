<template>
    <div class="aisde_top">
        <img src="..\..\assets\images\aside_top.png" alt="">
        <p>欢迎管理员!</p>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{

    }
}
</script>
<style lang="less" scoped>
.aisde_top{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 180px;
    border-bottom: 1px solid #ccc;
    img{
        width: 95px;
        height:95px;
        border-radius: 50%;
    }
    p{
        margin-top: 10px;
        color: white;
    }
}
</style>