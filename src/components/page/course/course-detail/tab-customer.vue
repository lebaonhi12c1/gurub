<script>
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import fadeContainer from '../../../ui/fade-container.vue'
import NoresultTable from '../../../ui/noresult-table.vue'

import moment from 'moment'
import CourseService from '../../../../services/course.service'
import { convertToLowerCase } from '../../../../helpers/utils'


export default {
    components: { 
        fadeContainer,
        NoresultTable 
    },
    data() {
        return {
            isLoading: false,
            search: '',
            status: [
                { text: 'status1', value: 'status1' },
                { text: 'status2', value: 'status2' },
            ],
            fields: [
                {
                    key: 'id',
                    thClass: 'bg-light',
                    label: 'Mã học viên',
                    stickyColumn: true,
                    tdClass: 'bg-light text-info',
                },
                {
                    key: 'display_name',
                    thClass: 'bg-light',
                    label: 'Tên học viên',
                    tdClass: 'text-secondary',
                },
                {
                    key: 'email',
                    thClass: 'bg-light text-end',
                    label: 'Email',
                    tdClass: 'text-end'
                },  
                {
                    key: 'phone',
                    thClass: 'bg-light text-end',
                    label: 'Số điện thoại',
                    tdClass: 'text-end'
                },
                {
                    key: 'payment_amount',
                    thClass: 'bg-light text-end',
                    label: 'Số tiền thanh toán',
                    tdClass: 'text-end',
                },
                {
                    key: 'action',
                    thClass: 'bg-light text-center',
                    label: 'Hành động',
                    tdClass: 'text-center',
                },
            ],
            items: [],
            
        }
    },

    
    computed: {
        customer_data: {
            get() {
                if(this.search == '') return this.items
                return this.items.filter(item => {
                    return this._checkExist(String(item.id), this.search) || this._checkExist(item.display_name, this.search) || this._checkExist(item.email, this.search) || this._checkExist(item.phone, this.search) || this._checkExist(String(item.payment_date), this.search) || this._checkExist(String(item.payment_amount), this.search)
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
        _convertToLowerCase(value) {
            return convertToLowerCase(value)
        },
        _checkExist(parent, value) {
            return this._convertToLowerCase(parent).includes(this._convertToLowerCase(value))
        },

        async getCustomers() {
            this.isLoading = true
            const res = await CourseService.getCourseDetailCustomers(this.$route.params.id)
            this.items = this._get(res, 'data', [])
            this.isLoading = false
        }

    },

    mounted() {
        this.getCustomers()
    }
}
</script>

<template>
    <fade-container>
      <b-card no-body>
            <b-card-header>
                <div class="d-flex align-items-center justify-content-between">
                    <h5>Học viên</h5>
                    <div class="d-flex align-items-center gap-3">
                        <b-form-input style="width: 15rem;" type="search" placeholder="Nhập từ khóa bạn cần tìm"
                            v-model="search"
                        >
    
                        </b-form-input>
                        <i class="mdi mdi-magnify fs-4"></i>
                    </div>
                </div>
            </b-card-header>
          <b-card-body>
                <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar
                        style="height: calc(100vh - 450px)" :fields="fields"
                        :items="Array(25).fill().map((item) => ({ code: item }))">
                        <template v-for="(field, index) in fields" :key="`${_get(field, 'key')}${index}`"
                            v-slot:[`cell(${field.key})`]>
                            <div class="placeholder placeholder-glow rounded w-100">
                                &nbsp;
                            </div>
                        </template>
                    </b-table>
                    <b-table v-else sticky-header striped bordered responsive data-simplebar show-empty
                        style="height: calc(100vh - 450px)" 
                        :hover="!_isEmpty(items)" 
                        :items="customer_data"
                        :fields="fields"
                    >
                        <template #empty>
                            <noresult-table />
                        </template>
                        <template #head()="scope">
                            <div class="text-nowrap">
                                {{ scope.label }}
                            </div>
                        </template>

                        <template #cell(payment_amount)="data">
                            <div class="d-flex justify-content-end">
                                {{ _get(data, 'item.payment_amount', '') || '--' }}
                            </div>
                        </template>

                        <template #cell(action)="data">
                            <router-link :to="`/students/${_get(data, 'item.id')}`"
                                class="d-flex align-items-center justify-content-center gap-2"
                            >
                                <i class=" mdi mdi-eye"></i>
                                Xem chi tiết
                            </router-link>
                        </template>
        
                        <template #cell(status)="data">
                            <div class="text-nowrap"
                                v-if="edit_id != _get(data, 'item.id')"
                            >
                                {{ _get(data, 'item.status') }}
                            </div>
                            <b-form-select
                                v-if="edit && edit_id == _get(data, 'item.id')"
                                id="input-status"
                                v-model="form.status"
                                :options="status"
                                required
                            ></b-form-select>
                        </template>
                    </b-table>
          </b-card-body>
      </b-card>
    </fade-container>
</template>



<style lang="scss" scoped></style>