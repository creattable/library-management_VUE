import http from '@/utils/http'

//借书
export const borrowApi = async(parm) =>{
    return await http.post("/api/borrow",parm)
}