// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'invoice',
    sort:[
        {
            name: 'id',
            label: 'Mã thanh toán',
        },
        {
            name: 'date',
            label: 'Ngày thanh toán',
        },
        {
            name: 'amount',
            label: 'Số tiền thanh toán',
        },
        {
            name: 'status',
            label: 'Trạng thái',
        },
        {
            name: 'course',
            label: 'Khóa học',
        },
        {
            name: 'payment_type',
            label: 'Loại thanh toán',
        },
    ],
    search:[
        {
            name: 'id',
            label: 'Mã thanh toán',
            type: 'text',
        },
        {
            name: 'date',
            label: 'Ngày thanh toán',
            type: 'date',
        },
        {
            name: 'amount',
            label: 'Số tiền thanh toán',
            type: 'text',
        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select',
        },
        {
            name: 'course',
            label: 'Khóa học',
            type: 'text',
        },
        {
            name: 'payment_type',
            label: 'Loại thanh toán',
            type: 'select',
        },
    ],
}

export default config