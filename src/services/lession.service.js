import {get, put} from "../helpers/api/get-data"
import {
    API_GET_LESSIONS,
    API_GET_LESSION_UPDATE,
} from "../config/api"

import { lesstions, update_success } from "../fake_data/lession";

class LessionService {
 

    static async getLessions(id,query)
    {
        const replacedEndpoint = API_GET_LESSIONS.replace(":id", id);
        const result = await get(replacedEndpoint, 
            {
                authHeader: true, 
                query: query
            }, 
            lesstions
        )
        return result            
    }

    static async updateLession(id,data) {
        const replacedIdCourse = API_GET_LESSION_UPDATE.replace(":id_course", id.course);
        const replacedEndpoint = replacedIdCourse.replace(":id_lession", id.lession);
        
        const res = await put(replacedEndpoint, data, {
            authHeader: true,
        },update_success)
        return res
    }

}
export default LessionService;