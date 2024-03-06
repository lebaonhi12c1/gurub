export default {
    status:
    [
        {
            label: 'Chờ xử lý',
            class: 'badge badge-soft-dark',
            value: 'pending',
        },
        {
            label: 'Đang xử lý',
            class: 'badge badge-soft-primary',
            value: 'processing',
        },
        {
            label: 'Đã hoàn thành',
            class: 'badge badge-soft-success',
            value: 'completed',
        },
        {
            label: 'Đã huỷ',
            class: 'badge badge-soft-danger',
            value: 'cancelled',
        },
    ],
}