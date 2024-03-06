// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'staff',
    sort:
    [
        {
            name: 'id',
            label: 'Mã nhân viên',
        },
        {
            name: 'display_name',
            label: 'Tên nhân viên',
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
            label: 'Chuyên môn',
            
        },
        {
            name: 'zone',
            label: 'Nơi làm việc',
            
        },
        {
            name: 'specialization',
            label: 'Kỹ năng chuyên môn',
            
        },
        {
            name: 'status',
            label: 'Trạng thái',
        },
        {
            name: 'action',
            label: 'Hành động',
        },
    ],
    search:
    [
        {
            name: 'id',
            label: 'Mã nhân viên',
            type: 'number'
        },
        {
            name: 'display_name',
            label: 'Tên nhân viên',
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
            label: 'Chức vụ',
            type: 'select'
        },
        {
            name: 'zone',
            label: 'Nơi làm việc',
            type: 'select'
            
        },
        {
            name: 'specialization',
            label: 'Kỹ năng chuyên môn',
            type: 'select'
        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select'
        },
    ]
}

export default config