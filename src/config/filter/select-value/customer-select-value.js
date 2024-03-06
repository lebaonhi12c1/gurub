export default {
    status:
    [
        {
            value: 'draft',
            label: 'Đang soạn',
            class: 'dark'
        },
        
        {
            value: 'unverified',
            label: 'Chưa cấp số',
            class: 'primary'
        },
        
        {
            value: 'waitingfopprove:',
            label: 'Cấp số',
            class: 'warning'
        },
        
        {
            value: 'pending',
            label: 'Ngưng hoạt động',
            class: 'dark'
        },
        
        {
            value: 'publish',
            label: 'Đang thực hiện',
            class: 'info'
        },
        
        {
            value: 'ending',
            label: 'Đã kết thúc',
            class: 'success'
        },
        
        {
            value: 'liquidation',
            label: 'Thanh lý',
            class: 'secondary'
        },
        
        {
            value: 'remove',
            label: 'Hủy bỏ',
            class: 'danger'
        },
    ],
}