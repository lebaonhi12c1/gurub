<script>
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import _head from 'lodash/head'

import fadeContainer from '../../../ui/fade-container.vue'
import NoresultTable from '../../../ui/noresult-table.vue'

import moment from 'moment'

// import Swal from "sweetalert2";

import { convertNumber, converTimestampToDate, convertToLowerCase } from '../../../../helpers/utils'
import CourseService from '../../../../services/course.service'
import GroupAvatar from '../../../ui/avatar/group-avatar.vue'
import courseTyp from '../../../../config/type/course-typ'
import Avatar from '../../../ui/avatar/avatar.vue'
export default {
    components: {
        fadeContainer,
        NoresultTable,
        GroupAvatar,
        Avatar,
    },
    data() {
        return {
            isLoading: false,
            courseTyp,
            search: '',
            fields: [
                {
                    key: 'id',
                    thClass: 'bg-light',
                    tdClass: 'text-info',
                    label: 'Mã đơn'
                },

                {
                    key: 'quantity',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end',
                    label: 'Số lượng học viên'
                },
                {
                    key: 'courses',
                    thClass: 'bg-light',
                    label: 'Khóa học'
                },
                {
                    key: 'price',
                    thClass: 'bg-light text-end',
                    label: 'Giá trị đơn',
                    tdClass: 'text-end text-danger'
                },
                {
                    key: 'created_at',
                    thClass: 'bg-light text-end',
                    label: 'Ngày lập đơn',
                    tdClass: 'text-end'
                },
                {
                    key: 'payment_date',
                    thClass: 'bg-light text-end',
                    label: 'Ngày thanh toán',
                    tdClass: 'text-end'
                },
                // {
                //     key: 'status',
                //     thClass: 'bg-light text-center',
                //     tdClass: 'text-center',
                //     label: 'Trạng thái'
                // },
                // {
                //     key: 'action',
                //     thClass: 'bg-light text-center',
                //     label: 'Hành động'
                // },
            ],
            items: [
                {
                    id: 'id',
                    name: 'name',
                    total_customer: 12,
                    courses: 'courses',
                    amount: 1000000,
                    created_at: 1695345597000,
                    payment_date: 1695345597000,
                    payment_status: 'paid',
                    status: 'status',
                    action: 'action',
                },

            ],
        }
    },

    computed: {
        order_data: {
            get() {
                if(this.search == '') return this.items
                return this.items.filter(item => {
                    return this._checkExist(String(item.id), this.search) || this._checkExist(String(item.price), this.search) || this._checkExist(String(this._converTimestampToDate(item.created_at)), this.search)|| this._checkExist(String(this._converTimestampToDate(item.payment_date)), this.search) || this._checkExist(String(item.quantity), this.search)
                })
            }
        }
    },

    methods: {
        _moment(date) {
            return moment(date)
        },

        _get(item, ref, auto = null) {
            return _get(item, ref, auto)
        },
        _isEmpty(item) {
            return _isEmpty(item)
        },

        _head(array) {
            return _head(array)
        },

        _convertNumber(number) {
            return convertNumber(number)
        },

        _converTimestampToDate(timestamp) {
            return converTimestampToDate(timestamp)
        },
        _convertToLowerCase(value) {
            return convertToLowerCase(value)
        },
        _checkExist(parent, value) {
            return this._convertToLowerCase(parent).includes(this._convertToLowerCase(value))
        },

        


        async getOrders() {
            this.isLoading = true
            const res = await CourseService.getCourseDetailOrders(this.$route.params.id)
            this.items = this._get(res, 'data', []).map(item => ({
                ...item,
                courses: this._get(item, 'courses', [])?.map(course => ({
                    avatar_url: _get(this.courseTyp, course.type + '.logo', ''),
                    display_name: course.name
                }))
            }))
            this.isLoading = false
        }
        // handleDelete(item) {
        //     Swal.fire({
        //         title: "Bạn có muốn xóa?",
        //         text: "Điều này sẽ không thể hoàn tác!",
        //         icon: "warning",
        //         showCancelButton: true,
        //         cancelButtonColor: "#f46a6a",
        //         confirmButtonColor: "#34c38f",
        //         confirmButtonText: "Đồng ý",
        //         cancelButtonText: 'Hủy'
        //     }).then((result) => {
        //         if (result.value) {
        //             Swal.fire("Deleted!", "Your file has been deleted.", "success");
        //         }
        //     });
        // }
    },

    mounted() {
        this.getOrders()
    },
}
</script>

<template>
    <fade-container>
       <b-card no-body>
            <b-card-header>
                <div class="d-flex align-items-center justify-content-between">
                    <h5>Lịch đặt</h5>
                    <div class="d-flex align-items-center gap-3">
                        <i class="mdi mdi-magnify fs-4"></i>
                        <b-form-input style="width: 15rem;" type="search" placeholder="Nhập từ khóa bạn cần tìm"
                            v-model="search"
                        >
    
                        </b-form-input>
                        <router-link to="/orders/create">
                            <b-button variant="success">
                                <i class="mdi mdi-plus"></i>
                                Thêm lịch
                            </b-button>
                        </router-link>
                    </div>
                </div>
            </b-card-header>
            <b-card-body>
                <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar
                    style="height: calc(100vh - 500px)" :fields="fields"
                    :items="Array(25).fill().map((item) => ({ code: item }))">
                    <template v-for="(field, index) in fields" :key="`${_get(field, 'key')}${index}`"
                        v-slot:[`cell(${field.key})`]>
                        <div class="placeholder placeholder-glow rounded w-100">
                            &nbsp;
                        </div>
                    </template>
                </b-table>
                <b-table v-else sticky-header striped bordered responsive data-simplebar show-empty
                    style="height: calc(100vh - 500px)" :hover="!_isEmpty(items)" :items="order_data" :fields="fields">
                    <template #empty>
                        <noresult-table />
                    </template>
                    <template #head()="scope">
                        <div class="text-nowrap">
                            {{ scope.label }}
                        </div>
                    </template>
        
                    
                    <template #cell(courses)="data">
                        <div class="d-flex align-items-center gap-2"
                            v-if="_get(data, 'item.courses.lenght') < 2"
                        >   
                            <avatar size="xxs"
                                :src="_get(_head(_get(data, 'item.courses')), 'avatar_url')"
                                :name="_get(_head(_get(data, 'item.courses')), 'display_name', '')"
                            />
                            <div>
                                {{ _get(_head(_get(data, 'item.courses')), 'display_name')}}
                            </div>
                        </div>
                        <group-avatar size="xxs"
                            v-else
                            :data="_get(data, 'item.courses')"
                        />
                    </template>
        
                    <template #cell(price)="data">
                        {{ _convertNumber(_get(data, 'item.price')) }}đ
                    </template>
        
                    <template #cell(created_at)="data">
                        {{ _converTimestampToDate(_get(data, 'item.created_at')) }}
                    </template>
        
                    <template #cell(payment_date)="data">
                        {{ _converTimestampToDate(_get(data, 'item.payment_date')) }}
                    </template>
        
                    <template #cell(payment_status)="data">
                        <div class="d-flex align-items-center justify-content-center">
                            <b-badge variant="success" class="text-uppercase">
                                {{ _get(data, 'item.payment_status') }}
                            </b-badge>
                        </div>
                    </template>
        
                    <!-- <template #cell(status)="data">
                        <div class="d-flex align-items-center justify-content-center">
                            <b-badge variant="primary" class="text-uppercase">
                                {{ data.item.status }}
                            </b-badge>
                        </div>
                    </template> -->
        
                    <!-- <template #cell(action)="data">
                        <ul class="list-inline hstack gap-2 mb-0 d-flex justify-content-center">
                            <li class="list-inline-item" v-b-tooltip.hover="{ title: 'Xem chi tiết' }">
                                <router-link :to="`/orders/${_get(data, 'item.id')}`" class="text-primary d-inline-block">
                                    <i class="ri-eye-fill fs-16"></i>
                                </router-link>
                            </li>
                            <li class="list-inline-item" data-bs-toggle="tooltip"           data-bs-trigger="hover"
                                data-bs-placement="top" v-b-tooltip.hover="{ title: 'Xóa' }"
                            >
                                <b-link class="text-danger d-inline-block remove-item-btn" @click="handleDelete">
                                    <i class="ri-delete-bin-5-fill fs-16"></i>
                                </b-link>
                            </li>
                        </ul>
                    </template> -->
                </b-table>
            </b-card-body>
       </b-card>
    </fade-container>
</template>



<style lang="scss" scoped></style>