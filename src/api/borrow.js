import http from '@/utils/http'

//借书
export const borrowApi = async (parm) => {
    return await http.post("/api/borrow", parm)
}

//还书列表
export const returnBorrowApi = async (parm) => {
    return await http.get("/api/borrow/getBorrowList", parm)
}
//还书
export const returnBooksApi = async (parm) => {
    return await http.post("/api/borrow/returnBooks", parm)
}