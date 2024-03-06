
import {get} from "../helpers/api/get-data"
import {getReceipts , getCourseStatistic} from "../fake_data/receipt"
import {
    API_GET_RECEIPT,
    API_GET_CONTRACT_STATISTIC,

} from "../config/api"


class ReceiptService {
 

    static async getReceipts(query)
    {
        const result = await get(API_GET_RECEIPT, 
            {
                authHeader: true, 
                query: query
            }, 
            getReceipts
        )
        return result            
    }

    static async getstatistic()
    {
        const result = await get(API_GET_CONTRACT_STATISTIC, 
            {
                authHeader: true, 
            }, 
            getCourseStatistic
        
        )
        return result            
    }



}
export default ReceiptService;