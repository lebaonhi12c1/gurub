<script>
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { coursesComputed, coursesMethods } from '../../../../state/helpers';
import OrderService from '../../../../services/order.service';
import buttonHandle from '../../../ui/button-handle.vue';
    export default {
        components: { buttonHandle },

        props: {
            customers: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                isLoadingCreate: false,
                subscribers: JSON.parse(sessionStorage.getItem('order_create_subscribers')) || {},
                label: {
                    name: 'Họ và tên:',
                    email: 'Email:',
                    phone: 'Số điện thoại:'
                },
            }
        },
        
        computed: {
            ...coursesComputed,
        },

        methods: {
            ...coursesMethods,
            _get(obj ,ref, path = null) {
                return get(obj ,ref,  path);
            },
            _isEmpty(obj) {
                return isEmpty(obj);
            },

            handlePreStep() {
                this.$emit('nextStep', 3);
            },
            handleNextStep() {
                this.$emit('nextStep', 5);
            },

            async handleCreateOrder() {
                this.isLoadingCreate = true;
                const convert_customers = this.customers?.map(item => ({
                    ...item,
                    courses: item.courses.map(course => course.id)
                }))
                const convert_data = {
                    vat: 8,
                    registrant: {
                        ...this.subscribers
                    },
                    contacts: convert_customers
                }
                const res = await OrderService.createOrder(convert_data)
                this.isLoadingCreate = false;
                if(this._get(res, 'status') != 'success') {
                    return 
                }
                sessionStorage.setItem('order_detail_route_id', this._get(res, 'data.order_id'))
                sessionStorage.removeItem('order_create_subscribers')
                sessionStorage.removeItem('order_create_customers')
                this.setCourses([])
                this.$emit('nextStep', 5);
            }
        },
    }
</script>

<template>
    <div>
        <div>
            <h5>Người đăng ký</h5>
            <ul>
                <li v-for="(item, index) in subscribers" :key="index" >
                    <div class="d-flex align-items-center gap-2">
                        <div class="fw-medium" style="min-width: 150px;">
                            {{ _get(label, index) }}
                        </div>
                        <div>
                            {{ item }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div>
            <h5>Danh sách học viên</h5>
            <b-row>
                <b-col lg="6" v-for="(item, index) in customers" :key="index" >
                    <div class="border-start ps-3">
                        <h6 class="text-primary">Học viên {{ index + 1 }}</h6>
                        <div class="d-flex align-items-center gap-2">
                            <div style="min-width: 150px;" class="fw-medium">Họ và tên:</div>
                            <div>{{ item.name }}</div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <div style="min-width: 150px;" class="fw-medium">Email:</div>
                            <div>{{ item.email }}</div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <div style="min-width: 150px;" class="fw-medium">Số điện thoại:</div>
                            <div>{{ item.phone }}</div>
                        </div>
                        <div class="d-flex align-items-start gap-2">
                            <div style="min-width: 150px;" class="fw-medium">Khóa học đăng ký:</div>
                            <ul style="list-style:decimal">
                                <li v-for="(item, index) in item.courses" :key="index">{{ item.name }}</li>
                            </ul>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
    <div class="d-flex align-items-center justify-content-between gap-3 mt-3">
        <b-button type="button" variant="light" class="btn-label left nexttab
nexttab" data-nexttab="pills-info-desc-tab"
            @click="handlePreStep"
        >
            <i class="ri-arrow-left-line label-icon align-middle me-2 fs-16"></i>
        Trở lại
        </b-button>
        <!-- <b-button variant="success" class="btn-label right nexttab
nexttab" data-nexttab="pills-info-desc-tab"
            @click="handleCreateOrder"
        >
            <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
            Tạo đơn
        </b-button> -->
        <button-handle type="button" variant="success" label="Tạo đơn" :isLoading="isLoadingCreate" @handler="handleCreateOrder"/>
    </div>
</template>

<style lang="scss" scoped>

</style>