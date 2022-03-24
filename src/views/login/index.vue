<template>
  <div class="logincontainer">
    <el-form
      class="loginForm"
      :model="loginForm"
      ref="loginForm"
      :rules="rules"
      label-width="80px"
      :inline="false"
      size="normal"
    >
      <el-form-item>
        <span class="loginTitle">高校图书管理系统</span>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userType">
        <el-radio-group v-model="loginForm.userType">
          <el-radio :label="0">读者</el-radio>
          <el-radio :label="1">管理员</el-radio>
        </el-radio-group>
        <span
          @click="registerBtn"
          style="
            margin-right: 10px;
            float: right;
            color: #ff7670;
            cursor: pointer;
          "
          >读者注册</span
        >
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-button type="primary" class="mybtn" @click="onSubmit"
              >登录</el-button
            >
          </el-col>
          <el-col :span="12" :offset="0">
            <el-button class="mybtn">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- 注册弹框 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :height="dialog.height"
      :width="dialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addRef"
          :rules="registerRules"
          label-width="80px"
          size="small"
          style="margin-right: 30px"
        >
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="learnNum" label="姓名">
                <el-input v-model="addModel.learnNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" label="电话">
                <el-input v-model="addModel.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="username" label="学号">
                <el-input v-model="addModel.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="className" label="班级">
                <el-input v-model="addModel.className"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="idCard" label="身份证">
                <el-input v-model="addModel.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="password" label="密码">
                <el-input
                  type="password"
                  v-model="addModel.password"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="confirmPassword" label="确认密码">
                <el-input
                  type="password"
                  v-model="addModel.confirmPassword"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="性别">
                <el-radio-group v-model="addModel.sex">
                  <el-radio :label="'0'">男</el-radio>
                  <el-radio :label="'1'">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </div>
</template>

<script>
import { registerApi } from "@/api/reader";
import SysDialog from "@/components/dialog/SysDialog.vue";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      registerRules: {
        learnNum: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        username: [{ required: true, message: "请填写学号", trigger: "blur" }],
        idCard: [
          { required: true, message: "请填写身份证号", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请填写电话", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }],
        confirmPassword: [
          { required: true, message: "请填写确认密码", trigger: "blur" },
        ],
        className: [{ required: true, message: "请填写班级", trigger: "blur" }],
      },
      //表单属性
      addModel: {
        type: "",
        readerId: "",
        learnNum: "",
        username: "",
        idCard: "",
        sex: "",
        phone: "",
        password: "",
        confirmPassword: "",
        type: "",
        className: "",
      },
      dialog: {
        title: "读者注册",
        visible: false,
        height: 250,
        width: 650,
      },
      //登录表单绑定数据源
      loginForm: {
        username: "",
        password: "",
        userType: "", //0：读者  1： 管理员
      },
      //表单验证规则
      rules: {
        username: [
          {
            trigger: "change",
            required: true,
            message: "请输入用户名",
          },
        ],
        password: [
          {
            trigger: "change",
            required: true,
            message: "请输入密码",
          },
        ],
        userType: [
          {
            trigger: "change",
            required: true,
            message: "请选择用户类型",
          },
        ],
      },
    };
  },
  methods: {
    onConfirm() {
      if (this.addModel.password != this.addModel.confirmPassword) {
        this.$message.warning("确认密码不对!");
        return;
      }
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          let res = await registerApi(this.addModel);
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.dialog.visible = false;
          }
        }
      });
    },
    onClose() {
      this.dialog.visible = false;
    },
    //注册按钮
    registerBtn() {
      //清空表单
      this.$resetForm("addRef", this.addModel);
      this.dialog.visible = true;
    },
    //登录提交事件
    onSubmit() {
      //表单验证
      this.$refs.loginForm.validate((valid) => {
        //验证通过才提交表单
        if (valid) {
          this.loading = true;
          //调用store里面的login方法
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              //跳转路由
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style  scoped>
.logincontainer {
  height: 100%;
  background: #fff;
  background-image: url("../../assets/images/login_bg.png");
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
}
.loginForm {
  height: 350px;
  width: 450px;
  background: #fff;
  padding: 35px 25px;
  border-radius: 10px;
}
.loginTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
}
.logincontainer ::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
.mybtn {
  width: 100%;
}
</style>