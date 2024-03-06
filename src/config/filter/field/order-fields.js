// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'order',
    sort:
    [
        {
            name: 'code',
            label: 'Mã đơn hàng',
        },
        {
            name: 'representative_name',
            label: 'Người đại diện',
        },
        {
            name: 'created_by_name',
            label: 'Người lập đơn',
        },
        {
            name: 'approved_name',
            label: 'Người duyệt đơn',
        },
        {
            name: 'quantity',
            label: 'Số lượng học viên',

        },
        
        {
            name: 'price',
            label: 'Giá trị đơn',

        },
        
        {
            name: 'created_at',
            label: 'Ngày lập đơn',

        },
        {
            name: 'payment_date',
            label: 'Ngày thanh toán',

        },
      
    ],
    search:
    [
        {
            name: 'code',
            label: 'Mã đơn hàng',
            type: 'text',
        },
        {
            name: 'representative_name',
            label: 'Người đại diện',
            type: 'text'
        },
        {
            name: 'created_by_name',
            label: 'Người lập đơn',
            type: 'text'
        },
        {
            name: 'approved_name',
            label: 'Người duyệt đơn',
            type: 'text'
        },
        {
            name: 'quantity',
            label: 'Số lượng học viên',
            type: 'number'

        },
        
        {
            name: 'price',
            label: 'Giá trị đơn',
            type: 'number'

        },
        
        {
            name: 'created_at',
            label: 'Ngày lập đơn',
            type: 'date'

        },
        {
            name: 'payment_date',
            label: 'Ngày thanh toán',
            type: 'date'

        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select'
        },
    ]
}

export default config