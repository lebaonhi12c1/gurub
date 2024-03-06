// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'contract',
    sort:
    [
        {
            name: 'code',
            label: 'Mã hợp đồng',
        },
        {
            name: 'vat',
            label: 'Thuế giá trị gia tăng',
        },
        {
            name: 'staff_bussiness_display_name',
            label: 'Nhân viên kinh doanh',
        },
        {
            name: 'status',
            label: 'Trạng thái',
        },
        {
            name: 'order_code',
            label: 'Mã đơn hàng',
        },
        {
            name: 'contract_value',
            label: 'Giá trị hợp đồng',
        },
        {
            name: 'contract_begin',
            label: 'Ngày bắt đầu',
        },
     
        {
            name: 'contract_end',
            label: 'Ngày kết thúc',
        },
        {
            name: 'created_at',
            label: 'Ngày tạo',
        },
        {
            name: 'updated_at',
            label: 'Ngày cập nhật gần nhất',
        },

   
    ],
    search:
    [
        {
            name: 'code',
            label: 'Mã hợp đồng',
            type: 'text',
        },
        {
            name: 'vat',
            label: 'Thuế giá trị gia tăng',
            type: 'number'

        },

        {
            name: 'order_code',
            label: 'Mã đơn hàng',
            type: 'text'
        },
  
        {
            name: 'staff_bussiness_display_name',
            label: 'Tên nhân viên kinh doanh',
            type: 'text'
        },
        
        {
            name: 'contract_value',
            label: 'Giá trị hợp đồng',
            type: 'number'

        },

  


        {
            name: 'contract_begin',
            label: 'Ngày bắt đầu',
            type: 'date'

        },

        {
            name: 'contract_end',
            label: 'Ngày kết thúc',
            type: 'date'

        },

        {
            name: 'created_at',
            label: 'Ngày tạo',
            type: 'date'

        },

        {
            name: 'updated_at',
            label: 'Ngày cập nhật gần nhất',
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