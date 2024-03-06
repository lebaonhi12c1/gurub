import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';


const getToastError = (title, closetime = 2000, position='top-right') =>
{
    toast.error(
        title,
        {
            autoClose: closetime,
            position: position
        },
    )
}

const getToastSuccess = (title, closetime = 2000) =>
{
    toast.success(
        title,
        {
            autoClose: closetime
        }
    )
}

export {getToastError, getToastSuccess}