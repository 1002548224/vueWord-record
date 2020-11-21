<!-- 商品分类 -->
<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <!-- 卡片视图区域 -->
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- “添加分类”按钮区域 -->
            <!-- “添加分类”按钮区域 -->
            <!-- “添加分类”按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <!-- 表格区域 -->
            <!-- 表格区域 -->
            <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
              <!-- 是否有效 -->
              <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                <i class="el-icon-error" v-else style="color: lightred"></i>
              </template>
              <!-- 排序 -->
              <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
              </template>
              <!-- 操作 -->
              <template slot="opt" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row, scope.row.cat_id)">删除</el-button>
              </template>
            </tree-table>
            <!-- 分页区域 -->
            <!-- 分页区域 -->
            <!-- 分页区域 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
        </el-card>
        <!-- “添加分类”的对话框 -->
        <!-- “添加分类”的对话框 -->
        <!-- “添加分类”的对话框 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addCateDialogVisible"
          width="50%"
          @close="addCateDialogClosed">
          <!-- “添加分类”的表单 -->
          <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
              <!-- options用来指定数据源 -->
              <!-- props用来指定配置对象 -->
              <el-cascader
                expand-trigger="hover"
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged"
                clearable
                change-on-select></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>
        <!-- “编辑分类”的表单 -->
        <el-dialog
          title="添加分类"
          :visible.sync="editCateDialogVisible"
          width="50%"
          @close="addCateDialogClosed">
         <el-form :model="editForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editForm.cat_name"></el-input>
            </el-form-item>
         </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCate">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      catelist: [],
      //   总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: ''
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
          prop: 'cat_level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // “添加分类”对话框
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      // “添加分类”的表单数据对象
      addCateForm: {},
      // 将要添加的分类的名称
      cat_name: '',
      cat_pid: 0,
      cat_level: 0, //  分类的等级，默认添加1级分类
      // 添加分类表单中的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类ID数组
      selectedKeys: [],
      // 编辑分类框的对象
      editForm: {},
      // 编辑的分类id
      editID: 0
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败！')
      console.log(res.data)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories',
        {
          params:
          {
            type: 2
          }
        })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败!')
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 如果selectedKeys 数组中的 length 大于0， 证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        // 预校验失败
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 编辑分类
    async showEditDialog (id) {
      this.editCateDialogVisible = true
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询分类信息失败！')
      this.$message.success('成功得到该条分类信息！')
      this.editForm = res.data
      console.log(this.editForm)
    },
    editCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑分类名称失败！')
        this.$message.success('编辑分类名称成功！')
        this.editCateDialogVisible = false
        this.getCateList()
      })
    },
    // 删除分类
    async removeCateById (cate, id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败！')
      this.$message.success('删除分类成功！')
      this.getCateList()
    }
  },
  created () {
    this.getCateList()
  }
}

</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
