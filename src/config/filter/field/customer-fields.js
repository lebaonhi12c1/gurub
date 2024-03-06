// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'customer',
    sort:
    [
        {
            name: 'id',
            label: 'Mã học viên',
        },
        {
            name: 'display_name',
            label: 'Tên học viên',
        },
        {
            name: 'phone',
            label: 'Số điện thoại',
        },
        {
            name: 'email',
            label: 'Email',
        },
        // {
        //     name: 'status',
        //     label: 'Trạng thái',
        // },
    ],
    search:
    [
        {
            name: 'id',
            label: 'Mã học viên',
            type: 'number'
        },
        {
            name: 'display_name',
            label: 'Tên học viên',
            type: 'text'

        },
        {
            name: 'phone',
            label: 'Số điện thoại',
            type: 'text'

        },
        {
            name: 'email',
            label: 'Email',
            type: 'text'

        },
        // {
        //     name: 'status',
        //     label: 'Trạng thái',
        //     type: 'select'
        // },
    ]
}

export default config