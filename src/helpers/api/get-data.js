
import fetch from '../../helpers/fetch'
import { getToastError, getToastSuccess } from "../toast"
import response_message from "../../config/response-message"
import _get from "lodash/get"

export const get = async (url, arg, fake_data={},message = "Server đang bảo trì", mode='public', isMessageError = true)=>
{
    try {
        if( "development" === process.env.NODE_ENV )
        {
            return fake_data
            
        }
        const response_data = await fetch.make().get(url, arg)

        if(_get(response_data,'status') ==  'error'  &&  isMessageError )
        {
            getToastError(_get(response_message,`${mode}.${response_data.message}.message`), 2500)
            return
        } 


        return response_data
    } 
    
    catch (error) {
        getToastError(message, 2500)
        return 
    }
}


export const post = async (url, body, arg, fake_data={}, message_success = "Thêm thành công", mode='public', isMessageSuccess = true, isMessageError = true,message = "Server đang bảo trì")=>
{
    try {
        if( "development" === process.env.NODE_ENV )
        {
            getToastSuccess(message_success, 2500)
            return fake_data
            
        }
        const response_data = await fetch.make().post(url,body, arg)

        if((_get(response_data,'status') ==  'error' || !response_data) && isMessageError )
        {
            if(_get(response_data,'status') ==  'error')
            {
             
                for (const key in  _get(response_data,'data.errors') ) 
                {
                    if (_get(response_data,`data.errors[${key}]`)) {
                        const errorArray = _get(response_data,'data.errors')[key];
                        if(Array.isArray(errorArray) )
                        {
                            errorArray.forEach(errorMessage => {
                                getToastError(errorMessage, 3500)
                            });

                        }
                        else
                        {
                            getToastError(errorArray, 3500)
                        }
                        
                    }
                }
                
                getToastError(_get(response_message,`${mode}.${response_data.message}.message`), 2500)
                return response_data
            } 
            return
        } 

        if(_get(response_data,'status') ==  'success' && isMessageSuccess)
        {
            getToastSuccess(message_success, 2500)
        } 
        return response_data
    } 
    
    catch (error) {
        getToastError(message, 2500)
        return 
    }
}


export const put = async (url,body, arg, fake_data={}, message_success = "Cập nhật thành công",message = "Server đang bảo trì")=>
{
    try {
        if( "development" === process.env.NODE_ENV )
        {
            getToastSuccess(message_success, 2500)
            return fake_data
            
        }
        const response_data = await fetch.make().put(url,body, arg)

        if(_get(response_data,'status') ==  'error' || !response_data )
        {
            getToastError(_get(response_message,`public.${response_data.message}.message`), 2500)
            return response_data
        } 

        if(_get(response_data,'status') ==  'success')
        {
            getToastSuccess(message_success, 2500)
        } 
        
        return response_data
    } 
    
    catch (error) {
        getToastError(message, 2500)
        return 
    }
}
export const remove = async (url, 
    arg={
        authHeader: true, 
    }, 
    fake_data={}, 
    message_success = "Xóa thành công",
    mode='public',
    message = "Server đang bảo trì", )=>
{
    try {
        if( "development" === process.env.NODE_ENV )
        {
            getToastSuccess(message_success, 2500)
            return fake_data
            
        }
        const response_data = await fetch.make().delete(url, arg)

        if(_get(response_data,'status') ==  'error' || !response_data)
        {
            if(_get(response_data,'status') ==  'error')
            {
                if(_get(response_data,'data.errors'))
                {
                    for (const key in  _get(response_data,'data.errors') ) 
                    {
                        if (_get(response_data,`data.errors[${key}]`)) {
                            const errorArray = _get(response_data,'data.errors')[key];
                            if(Array.isArray(errorArray) )
                            {
                                errorArray.forEach(errorMessage => {
                                    getToastError(errorMessage, 3500)
                                });

                            }
                            else
                            {
                                getToastError(errorArray, 3500)
                                
                            }
                            
                        }
                    }
                    return
                }
                
                getToastError(_get(response_message,`${mode}.${response_data.message}.message`), 2500)
            } 
            return
        } 

        getToastSuccess(message_success, 2500)
        return response_data
    } 
    
    catch (error) {
        getToastError(message, 2500)
        return 
    }
}