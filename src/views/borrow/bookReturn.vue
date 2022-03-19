<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="listparm" label-width="80px" :inline="true" size="small">
      <el-form-item label="学号">
        <el-input v-model="listparm.username"></el-input>
      </el-form-item>
      <el-form-item label="借书状态">
        <el-select v-model="listparm.borrowStatus" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="returnBtn"
          >批量还书</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="tables"
      :height="tableHeight"
      :data="tableData"
      border
      stripe
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="bookName" label="图书名称"> </el-table-column>
      <el-table-column prop="bookPlaceNum" label="书架号"> </el-table-column>
      <el-table-column prop="username" label="学号"> </el-table-column>
      <el-table-column prop="learnNum" label="读者"> </el-table-column>
      <el-table-column prop="className" label="班级"> </el-table-column>
      <el-table-column prop="phone" label="电话"> </el-table-column>
      <el-table-column prop="borrowTime" label="借书时间"> </el-table-column>
      <el-table-column prop="returnTime" label="还书时间"> </el-table-column>
      <el-table-column
        prop="borrowStatus"
        label="借书状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.borrowStatus == '1'">在借中</el-tag>
          <el-tag type="success" v-if="scope.row.borrowStatus == '2'"
            >已还</el-tag
          >
          <el-tag type="danger" v-if="scope.row.borrowStatus == '3'"
            >拒绝</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="alongReturnBtn(scope.row)"
            icon="el-icon-edit"
            >还书</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="exceptionReturnBtn(scope.row)"
            icon="el-icon-delete"
            >异常还书</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="listparm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="listparm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listparm.total"
      background
    >
    </el-pagination>
  </el-main>
</template>

<script>
import { returnBorrowApi, returnBooksApi } from "@/api/borrow";
export default {
  data() {
    return {
      bookIds: [],
      tableHeight: 0,
      tableData: [],
      options: [
        {
          value: "1",
          label: "在借中",
        },
        {
          value: "2",
          label: "已还",
        },
        {
          value: "3",
          label: "拒绝",
        },
      ],
      listparm: {
        currentPage: 1,
        pageSize: 10,
        username: "",
        borrowStatus: "1",
        total: 0,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },
  created() {
    this.returnBorrow();
  },
  methods: {
    //异常还书
    exceptionReturnBtn() {},
    //单独还书
    async alongReturnBtn(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确定还书吗?");
      if (confirm) {
        if (row.borrowStatus == "1") {
          //在借中的才能还书
          let obj = {};
          obj.borrowId = row.borrowId;
          obj.bookId = row.bookId;
          this.bookIds.push(obj);
          let res = await returnBooksApi(this.bookIds);
          if (res && res.code == 200) {
            this.$message.success(res.mes);
            this.returnBorrow();
          }
        }
      }
    },
    currentChange(val) {
      this.listParm.currentChange = val;
      this.returnBorrow();
    },
    sizeChange(val) {
      this.listParm.pageSize = val;
      this.returnBorrow();
    },
    searchBtn() {
      this.returnBorrow();
    },
    resetBtn() {
      this.listparm.currentPage = 1;
      this.listparm.username = "";
      this.listparm.borrowStatus = "";
      this.returnBorrow();
    },
    async returnBtn() {
      let confirm = await this.$myconfirm("确定还书吗?");
      if (confirm) {
        let datas = this.$refs.tables.selection;
        if (datas.length == 0) {
          this.$message.error("请选择要还的书");
          return;
        }
        for (let i = 0; i < datas.length; i++) {
          let obj = {};
          obj.borrowId = datas[i].borrowId;
          obj.bookId = datas[i].bookId;
          this.bookIds.push(obj);
        }
        let res = await returnBooksApi(this.bookIds);
        if (res && res.code == 200) {
          this.$message.success(res.mes);
          this.returnBorrow();
        }
      }
    },
    async returnBorrow() {
      let res = await returnBorrowApi(this.listparm);
      if (res && res.code == 200) {
        console.log(res);
        this.listparm.total = res.data.total;
        this.tableData = res.data.records;
      }
    },
  },
};
</script>

<style>
</style>