import http from '@/utils/http'

//列表
export const getListApi = async(parm) =>{
    return await http.get("/api/books/list",parm)
}

//查询图书列表
export const getCateListApi = async() =>{
    return await http.get("/api/category/cateList",null)
}