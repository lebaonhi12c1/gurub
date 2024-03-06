
import {get} from "../helpers/api/get-data"
import {getContract , getCourseStatistic} from "../fake_data/contract"
import {
    API_GET_CONTRACT,
    API_GET_CONTRACT_STATISTIC,
    API_GET_CONTRACT_DETAILS,
    API_GET_CONTRACT_DETAILS_RECEIPTS,

} from "../config/api"


class ContractService {
 

    static async getContract(query)
    {
        const result = await get(API_GET_CONTRACT, 
            {
                authHeader: true, 
                query: query
            }, 
            getContract
        
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

    static async getContractDetail(id){
        const url = API_GET_CONTRACT_DETAILS.replace(':id', id)
        const result = await get(url, 
            {
                authHeader: true, 
            }, 
            getContract
        
        )
        return result       
    }

    static async getContractDetailReceipts(id){
        const url = API_GET_CONTRACT_DETAILS_RECEIPTS.replace(':id', id)
        const result = await get(url, 
            {
                authHeader: true, 
            }, 
            getContract
        )
        return result       
    }


}
export default ContractService;