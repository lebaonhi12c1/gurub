import {get} from "../helpers/api/get-data"
import {
    API_GET_CUSTOMERS
} from "../config/api"


class ClientService {


    static async getClients(query)
    {
        const result = await get(API_GET_CUSTOMERS, 
            {
                authHeader: true, 
                query: query
            }, 
            {}
        )
        return result            
    }
}
export default ClientService;