<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="listParm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input
          placeholder="请输入角色名称"
          v-model="listParm.roleName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtn" icon="el-icon-search">搜索</el-button>
        <el-button @click="resetBtn" icon="el-icon-close" style="color: #ff7670"
          >重置</el-button
        >
        <el-button type="primary" @click="addBtn" icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableData" border stripe>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="remark" label="角色备注"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="listParm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="listParm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listParm.total"
      background
    >
    </el-pagination>
    <!-- 新增编辑弹框 -->
    <sys-dialog
      :title="dialog.title"
      :height="dialog.height"
      :visible="dialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addRef"
          :rules="rules"
          label-width="80px"
          size="small"
        >
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleName" label="角色名称">
                <el-input v-model="addModel.roleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="角色备注">
                <el-input v-model="addModel.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from "@/components/dialog/SysDialog.vue";
import { getListApi, addRoleApi, editRoleApi, deleteRoleApi } from "@/api/role";
export default {
  // 注册组件
  components: {
    SysDialog,
  },
  data() {
    return {
      //表单验证
      rules: {
        roleName: [
          {
            trigger: "blur",
            required: true,
            message: "请填写角色名称",
          },
        ],
      },
      //表单数据
      addModel: {
        type: "", // 0：新增 1：编辑
        roleId: "",
        roleName: "",
        remark: "",
      },
      //弹框属性
      dialog: {
        title: "",
        height: 150,
        visible: false,
      },
      //表格高度
      tableHeight: 0,
      //列表查询参数
      listParm: {
        pageSize: 10,
        currentPage: 1,
        roleName: "",
        total: 0,
      },
      tableData: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },
  created() {
    this.getList();
  },
  methods: {
    //弹框确定
    onConfirm() {
      //表单验证
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          this.dialog.visible = false;
          let res = null;
          if (this.addModel.type == "0") {
            res = await addRoleApi(this.addModel);
          } else {
            res = await editRoleApi(this.addModel);
          }
          if (res && res.code == 200) {
            //信息提示
            this.$message({ type: "success", message: res.msg });
            //刷新表格
            this.getList();
          }
        }
      });
    },
    //弹框关闭
    onClose() {
      this.dialog.visible = false;
    },
    //获取列表
    async getList() {
      let res = await getListApi(this.listParm);
      if (res && res.code == 200) {
        console.log(res);
        //设置表格数据
        this.tableData = res.data.records;
        this.listParm.total = res.data.total;
      }
    },
    //页数改变时触发
    currentChange(val) {
      this.listParm.currentPage = val;
      this.getList();
    },
    //页容量改变时触发
    sizeChange(val) {
      this.listParm.pageSize = val;
      this.getList();
    },
    //删除按钮
    async deleteBtn(row) {
      //确定
      const confirm = await this.$myconfirm("确定删除该数据吗?");
      if (confirm) {
        let res = await deleteRoleApi({ roleId: row.roleId });
        if (res && res.code == 200) {
          //信息提示
          this.$message({ type: "success", message: res.msg });
          //刷新表格
          this.getList();
        }
      }
    },
    //编辑按钮
    editBtn(row) {
      //设置弹框属性
      this.dialog.visible = true;
      this.dialog.title = "新增角色";
      //清空表单数据
      this.$resetForm("addRef", this.addModel);
      //把要编辑的数据放到表单数据对象
      this.$objCoppy(row, this.addModel);
      this.addModel.type = "1"; //编辑
    },
    //新增按钮
    addBtn() {
      //设置弹框属性
      this.dialog.visible = true;
      this.dialog.title = "新增角色";
      //清空表单数据
      this.$resetForm("addRef", this.addModel);
      //设为新增
      this.addModel.type = "0";
    },
    //重置按钮
    resetBtn() {
      this.listParm.roleName = "";
      this.getList();
    },
    //搜索按钮
    searchBtn() {
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>