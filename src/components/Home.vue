<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu router :collapse="isCollapse" :collapse-transition="false" :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true">
            <el-submenu v-for="item in menulist" :key="item.id" :index="item.id + ''">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span v-text="item.authName"></span>
              </template>
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNacState('/' + subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span v-text="subItem.authName"></span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
</template>
<script>
export default {
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      // 被激活链接地址
      activePath: '',
      // 是否折叠
      isCollapse: false,
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/Login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.console.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNacState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  // 盒子两边有空白
  display: flex;
  justify-content: space-between;  // 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式
  padding-left: 0;                 // 取消左边的空白
  //实现纵向居中
  align-items: center;             // 定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式。
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
