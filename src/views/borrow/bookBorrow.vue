<template>
  <el-main>
    <div
      style="
        margin: 0px 0px 15px 0px;
        color: #67c23a;
        font-weight: 600;
        font-size: 15px;
      "
    >
      读者信息
    </div>
    <el-card class="box-card">
      <div slot="header" style="padding: 0px" class="clearfix">
        <el-form
          :model="searchParm"
          label-width="80px"
          :inline="true"
          size="mini"
        >
          <el-form-item label="学号">
            <el-input v-model="searchParm.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="getByUserName"
              >查询</el-button
            >
            <el-button
              style="color: #ff7670"
              icon="el-icon-close"
              @click="resetBtn"
              >重置</el-button
            >
            <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="borrowBtn">借书</el-button>
            
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form
          :model="showUser"
          ref="form"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item label="姓名">
            <el-input v-model="showUser.learnNum"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="showUser.className"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="showUser.username"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="showUser.phone"></el-input>
          </el-form-item>
          <el-form-item label="证件号">
            <el-input v-model="showUser.idCard"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="showUser.sex" label="0">男</el-radio>
            <el-radio v-model="showUser.sex" label="1">女</el-radio>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="showUser.checkStatus" label="0">未审核</el-radio>
            <el-radio v-model="showUser.checkStatus" label="1">已审核</el-radio>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div
      style="
        margin: 15px 0px;
        color: #67c23a;
        font-weight: 600;
        font-size: 15px;
      "
    >
      图书列表
    </div>
    <div>
      <elt-transfer
        ref="eltTransfer"
        :show-query="true"
        :show-pagination="true"
        :pagination-call-back="paginationCallBack"
        :left-columns="leftColumns"
        :title-texts="['待选', '已选']"
        :button-texts="['添加', '删除']"
        :query-texts="['查询', '查询']"
        :table-row-key="(row) => row.bookId"
        v-model="tableData"
      >
        <!-- 可以使用插槽获取到列信息和行信息，从而进行数据的处理 -->
        <template v-slot:leftCondition>
          <el-form-item label="图书名称">
            <el-input
              v-model="listParm.bookName"
              placeholder="图书名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="图书作者">
            <el-input
              v-model="listParm.bookAuther"
              placeholder="图书作者"
            ></el-input>
          </el-form-item>
        </template>
        <template v-slot:rightCondition="{ scope }">
          <el-form-item label="名称">
            <el-input v-model="scope.bookName" placeholder="名称"></el-input>
          </el-form-item>
        </template>
      </elt-transfer>
    </div>
  </el-main>
</template>

<script>
import { getByUserNameApi } from "@/api/reader";
import { getListApi } from "@/api/book";
import eltTransfer from "elt-transfer/src/eltTransfer";
export default {
  components: {
    "elt-transfer": eltTransfer,
  },
  data() {
    return {
      tableData: [],
      leftColumns: [
        { label: "图书名称", id: "bookName", width: "120px" },
        { label: "图书分类", id: "categoryName", width: "120px" },
        { label: "书架号", id: "bookPlaceNum" },
        { label: "作者", id: "bookAuther" },
        { label: "出版社", id: "bookProduct" },
        { label: "库存", id: "bookStore" },
      ],
      //读者信息搜索框
      searchParm: {
        username: "",
      },
      showUser: {
        learnNum: "",
        username: "",
        idCard: "",
        sex: "",
        phone: "",
        className: "",
        checkStatus: "",
      },
      listParm: {
        currentPage: "",
        pageSize: "",
        bookName: "",
        bookAuther: "",
      },
    };
  },
  methods: {
    //借书按钮
    borrowBtn(){
      console.log(this.tableData)
    },
    async paginationCallBack(obj) {
      console.log(obj);
      this.listParm.currentPage = obj.pageIndex;
      this.listParm.pageSize = obj.pageSize;
      let res = await getListApi(this.listParm);
      return new Promise((resolve, reject) => {
        try {
          resolve({ total: res.data.total, data: res.data.records });
        } catch {
          reject();
        }
      });
    },
    clearTransfer() {
      this.$refs.eltTransfer.clear();
    },
    //根据学号查询读者
    async getByUserName() {
      let res = await getByUserNameApi(this.searchParm);
      console.log(res);
      if (res && res.code == 200 && res.data) {
        this.showUser = res.data;
      }
    },
    resetBtn() {
      this.searchParm.username = "";
      this.showUser.learnNum = "";
      this.showUser.username = "";
      this.showUser.idCard = "";
      this.showUser.sex = "";
      this.showUser.phone = "";
      this.showUser.className = "";
      this.showUser.checkStatus = "";
    },
  },
};
</script>

<style scoped>
::v-deep .el-card__header {
  padding: 15px 0px 0px 0px;
}
::v-deep .el-card__body {
  padding: 15px 0px 0px 0px;
}
</style>