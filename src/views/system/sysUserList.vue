<template>
  <!-- element标签，只需要当作一个普通的div看待就行了 -->
  <el-main>
    <!-- 搜索栏

    model:绑定表单的数据，通常是一个对象
    ref:相当于div的id
    rules:表单验证的规则
    label-width:表单域标签的宽度
    inline:行内表单模式，是否在同一行显示
    size:单内组件的尺寸
    icon:在官网的cion里面找图标样式
     -->
    <el-form
      :model="listParm"
      ref="searchRef"
      label-width="80px"
      :inline="true"
      size="small"
      :rules="rules"
    >
      <el-form-item>
        <el-input
          v-model="listParm.nickName"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listParm.phone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search">搜索</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670">重置</el-button>
        <el-button type="primary" @click="addBtn" icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格
    data:表格的数据
    prop:绑定的data中的那个字段
     -->
    <el-table :height="tableHeight" :data="tableData" border stripe>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editBtn"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-edit"
            size="small"
            @click="deleteBtn"
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

    <!-- 弹框 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <!-- 弹框内容
        新增或编辑弹框
        slot要和弹窗里面定义的slot name一样
         -->
      <div slot="content">
        <!-- 就是一个form表单,具体的参数上面有 -->
        <el-form
          :model="addModel"
          ref="addRef"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="small"
          style="margin-right: 40px"
        >
          <!-- 
          el-row代表一行，分为24等分
          el_col:代表行中的列,一列的span，刚好两列24
         -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="nickName" label="姓名">
                <el-input v-model="addModel.nickName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" label="电话">
                <el-input v-model="addModel.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12" prop="email" :offset="0">
              <el-form-item label="邮箱">
                <el-input v-model="addModel.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="sex" label="性别">
                <el-radio-group v-model="addModel.sex">
                  <el-radio :label="'0'">男</el-radio>
                  <el-radio :label="'1'">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="account" label="账户">
                <el-input v-model="addModel.account"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="password" label="密码">
                <el-input v-model="addModel.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
//引入弹框组件
import SysDialog from "@/components/dialog/SysDialog.vue";

export default {
  components: { SysDialog },
  //注册组件
  component: {
    SysDialog,
  },

  data() {
    return {
      //表单验证规则,必须和prop绑定的一一对应，而且必须和v-model的字段一一对应
      rules: {
        nickName: [
          {
            //触发时间
            trigger: "change",
            //是否必填
            required: true,
            message: "请填写姓名",
          },
        ],
        phone: [
          {
            //触发时间
            trigger: "change",
            //是否必填
            required: true,
            message: "请填写电话",
          },
        ],
        sex: [
          {
            //触发时间
            trigger: "change",
            //是否必填
            required: true,
            message: "请填性别",
          },
        ],
        account: [
          {
            //触发时间
            trigger: "change",
            //是否必填
            required: true,
            message: "请填写账户",
          },
        ],
        password: [
          {
            //触发时间
            trigger: "change",
            //是否必填
            required: true,
            message: "请填写密码",
          },
        ],
      },

      //弹窗表单绑定的数据
      addModel: {
        nickName: "",
        phone: "",
        email: "",
        sex: "",
        username: "",
        password: "",
      },

      //弹窗属性
      dialog: {
        title: "",
        visible: false,
        width: 630,
        height: 200,
      },

      //表格的高度
      tableHeight: 0,
      //分页列表查询的参数
      listParm: {
        nickName: "",
        phone: "",
        //第几页，默认设置成1
        currentPage: 1,
        //页容量，每页查询10条
        pageSize: 10,
        //总条数
        total: 0,
      },

      //数据表格的数据
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },

  methods: {
    //弹框关闭
    onClose() {
      this.dialog.visible = false;
    },
    //弹框确定
    onConfirm() {
      //表单验证,valid返回一个布尔类型
      this.$refs.addRef.validate((valid) => {
        if (valid) {
          this.dialog.visible = false;
        }
      });
    },

    //分页容量改变时触发(通过分页按钮操作)
    sizeChange(val) {},
    //页数改变时触发(直接点击页数时)
    currentChange(val) {},

    //编辑按钮
    editBtn() {
      //设置弹框的属性
      this.dialog.title = "编辑用户";
      this.dialog.visible = true;
    },
    //删除按钮
    deleteBtn() {},
    //新增按钮
    addBtn() {
      //设置弹框的属性
      this.dialog.title = "新增用户";
      this.dialog.visible = true;
    },
  },
  //表格的高度，固定写法
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },
};
</script>

<style lang="scss" scoped>
</style>

