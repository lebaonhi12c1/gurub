// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'client',
    sort:
    [
        {
            name: 'id',
            label: 'Mã khách hàng',
        },
        {
            name: 'display_name',
            label: 'Tên khách hàng',
        },
        {
            name: 'phone',
            label: 'Số điện thoại',
        },
        {
            name: 'email',
            label: 'Email',
        },
        {
            name: 'type',
            label: 'Loại khách',
        },
        {
            name: 'created_at',
            label: 'Ngày tạo',
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
            label: 'Mã khách hàng',
            type: 'number'
        },
        {
            name: 'display_name',
            label: 'Tên khách hàng',
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
        {
            name: 'type',
            label: 'Loại khách',
            type: 'select'
        },
        {
            name: 'created_at',
            label: 'Ngày tạo',
            type: 'date'
        },
        // {
        //     name: 'status',
        //     label: 'Trạng thái',
        //     type: 'select'
        // },
    ]
}

export default config