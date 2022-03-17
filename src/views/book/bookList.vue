<template>
  <el-main>
    <!--搜索栏 -->
    <el-form :model="listParm" :inline="true" size="small">
      <el-form-item>
        <el-select v-model="listParm.categoryId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入图书名称"
          v-model="listParm.bookName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入书架号"
          v-model="listParm.bookPlaceNum"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入作者"
          v-model="listParm.bookAuther"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" icon="el-icon-close" @click="closeBtn"
          >重置</el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableData" border stripe>
      <el-table-column label="图书名称" prop="bookName"></el-table-column>
      <el-table-column label="图书分类" prop="categoryName"></el-table-column>
      <el-table-column label="书架号" prop="bookPlaceNum"></el-table-column>
      <el-table-column label="作者" prop="bookAuther"></el-table-column>
      <el-table-column label="出版社" prop="bookProduct"></el-table-column>
      <el-table-column label="价格" prop="bookPrice"></el-table-column>
      <el-table-column label="库存" prop="bookStore"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="default" @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="default"
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
  </el-main>
</template>

<script>
import { getListApi, getCateListApi } from "@/api/book";
export default {
  data() {
    return {
      //下拉数据
      options:[],
      //表格高度
      tableHeight: 0,
      //表格数据
      tableData: [],
      //列表查询参数
      listParm: {
        currentPage: 1,
        pageSize: 10,
        categoryId: "",
        bookName: "",
        bookPlaceNum: "",
        bookAuther: "",
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
    this.getCateList();
  },
  methods: {
    //查询分类列表
    async getCateList() {
      let res = await getCateListApi();
      if (res && res.code == 200) {
        console.log(res);
        this.options = res.data;
      }
    },
    //页数改变时触发
    currentChange(val) {},
    //页容量改变时触发
    sizeChange(val) {},
    //删除按钮
    deleteBtn(row) {},
    //编辑按钮
    editBtn(row) {},
    //新增按钮
    addBtn() {},
    //重置按钮
    closeBtn() {},
    //搜索按钮
    searchBtn() {},
  },
};
</script>

<style lang="scss" scoped>
</style>