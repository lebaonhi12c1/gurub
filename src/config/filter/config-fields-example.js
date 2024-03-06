// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'contract',
    sort:
    [
        {
            label: 'Ngày bắt đầu',
            name: 'contract_begin',
        },
        {
            label: 'Ngày kết thúc',
            name: 'contract_end',
        },
        {
            label: 'Giá trị hợp đồng',
            name: 'contract_value',
            
        },
        {
            label: 'Trạng thái hợp đồng',
            name: 'status',
        },
        {
            label: 'Mã hợp đồng',
            name: 'code',
        },
        {
            label: 'Dịch vụ',
            name: 'type',
        },
        {
            label: 'Nhân viên kinh doanh',
            name: 'staff_business_display_name',
        },
        {
            label: 'Nhân viên kỹ thuật',
            name: 'staff_advertiser_display_name',
        },
    ],
    search:
    [
        
        {
            label: 'Ngày bắt đầu',
            type: 'date',
            name: 'contract_begin',
            
        },
        {
            label: 'Ngày kết thúc',
            type: 'date',
            name: 'contract_end', 
        },
        {
            label: 'Giá trị hợp đồng',
            type: 'number',
            name: 'contract_value',
            
        },
        {
            label: 'Trạng thái hợp đồng',
            type: 'select',
            name: 'status',
        },
        {
            label: 'Mã hợp đồng',
            type: 'text',
            name: 'code',
        },
        {
            label: 'Dịch vụ',
            type: 'select',
            name: 'type',
        },
        {
            label: 'Nhân viên kinh doanh',
            type: 'text',
            name: 'staff_business_display_name',
        },
        {
            label: 'Nhân viên kỹ thuật',
            type: 'text',
            name: 'staff_advertiser_display_name',
        },
    ]
}

export default config