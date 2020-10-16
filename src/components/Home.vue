<!-- home组件 -->
<template>
    <div class=''>
        <el-button type='info' @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
