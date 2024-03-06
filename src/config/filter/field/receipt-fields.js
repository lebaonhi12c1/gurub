const config = 
{
    host: 'receipt',
    sort:
    [
        {
            name: 'id',
            label: 'Mã thanh toán',
        },
        {
            name: 'contract_code',
            label: 'Mã hợp đồng',
        },
        {
            name: 'type',
            label: 'Loại',
        },
        {
            name: 'status',
            label: 'Trạng thái',
        },
        {
            name: 'amount',
            label: 'Số tiền thanh toán',
        },
        {
            name: 'vat',
            label: 'Thuế giá trị gia tăng',
        },
        {
            name: 'service_fee',
            label: 'Phí dịch vụ',
        },
        {
            name: 'payment_date',
            label: 'Ngày thanh toán',
        },
        {
            name: 'payment_type',
            label: 'Phương thức thanh toán',
        },
        {
            name: 'accountant_display_name',
            label: 'Kế toán viên',
        },
    ],
    search:
    [
        {
            code: 'id',
            label: 'Mã thanh toán',
            type: 'text'
        },
        {
            name: 'contract_code',
            label: 'Mã hợp đồng',
            type: 'text'

        },
        {
            name: 'type',
            label: 'Loại',
            type: 'select'

        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select'

        },
        {
            name: 'amount',
            label: 'Số tiền thanh toán',
            type: 'number'

        },
        {
            name: 'vat',
            label: 'Thuế giá trị gia tăng',
            type: 'number'

        },
        {
            name: 'service_fee',
            label: 'Phí dịch vụ',
            type: 'number'

        },
        {
            name: 'payment_date',
            label: 'Ngày thanh toán',
            type: 'date'

        },
        {
            name: 'payment_type',
            label: 'Phương thức thanh toán',
            type: 'select'

        },
        {
            name: 'accountant_display_name',
            label: 'Kế toán viên',
            type: 'text'
            
        },
    ]
}

export default config