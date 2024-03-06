export default {
    type: [
        {
            label: 'Thanh toán',
            value: 'receipt_payment'
        },
        {
            label: 'Bảo lãnh',
            value: 'receipt_caution'
        },
        {
            label: 'Nhận thay mặt thanh toán',
            value: 'receipt_payment_on_behaft'
        },
        {
            label: 'Ngân sách khuyến mãi',
            value: 'promotion'
        },
        {
            label: 'Không rõ',
            value: 'unspecified'
        },
    ],
    status: [
        {
            label:  "Bản nháp",
            value: 'draft'
        },
        {
            label:  "Đã trả",
            value: 'paid'
        },
        {
            label:  "Đang hoạt động",
            value: 'publish'
        },
        {
            label:  "Không rõ",
            value: 'unspecified'
        },
    ],
    payment_type: [
        {
            value: 'cash',
            label: 'Tiền mặt',
        },
        {
            value: 'account',
            label: 'Tài khoản',
        },
        {
            value: 'none',
            label: 'Không',
        },
        {
            value: 'none',
            label: 'Không rõ',
        },
        {
            value: '',
            label: 'Rỗng',
        }
    ]
}


