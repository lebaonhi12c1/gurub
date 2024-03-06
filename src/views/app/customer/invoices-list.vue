<script>
import NoresultTable from '../../../components/ui/noresult-table.vue';
import Pagination from '../../../components/ui/pagination/pagination.vue';
import Modal from '../../../components/ui/modal/modal.vue';
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";

import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'


import config from '../../../config/filter/field/invoice-fieids'
import status_invoice from '../../../config/status/status-invoices'
import payment_types from '../../../config/type/payment-type.js'

import moment from 'moment';
export default {
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    components: {
        NoresultTable,
        Pagination,
        Modal,
        FilterContainer,
    },

    data() {
        return {
            title: "Danh sách học viên",
            perPage: 1,
            currentPage: 1,
            total_page: 1,
            limit: 25,
            isLoading: false,
            eventModal: false,
            info_customer: {},
            filters: [],
            order: [],
            config_filter: config,
            status_invoice,
            payment_types,
            fields: [
                {
                    key: 'id',
                    thClass: 'bg-light',
                    label: 'Mã thanh toán',
                    stickyColumn: true,
                    tdClass: 'bg-light'
                },
                {
                    key: 'date',
                    thClass: 'bg-light text-end',
                    label: 'Ngày thanh toán'
                },
                {
                    key: 'amount',
                    thClass: 'bg-light text-end',
                    label: 'Số tiền thanh toán'
                },
                {
                    key: 'status',
                    thClass: 'bg-light text-center',
                    tdClass: 'text-center',
                    label: 'Trạng thái'
                },
                {
                    key: 'course',
                    thClass: 'bg-light',
                    label: 'Khóa học'
                },
                {
                    key: 'payment_type',
                    thClass: 'bg-light',
                    label: 'Loại thanh toán'
                },
            ],
            items: [],
        };
    },

    methods: {
        _isEmpty(item) {
            return _isEmpty(item)
        },
        _get(item, ref, auto = null) {
            return _get(item, ref, auto)
        },

        _moment(date) {
            return moment(date)
        },
        // async getCustomer () {  
        //     this.isLoading = true
        //     const res = await CustomerService.getInvoicesList({
        //         filters: this.filters,
        //         order: this.order,
        //         pagination: {
        //             page: this.currentPage,
        //             limit: this.limit
        //         }
        //     })
        //     this.items = _get(res, 'data.data', [])
        //     this.perPage = _get(res,'data.per_page', 1),
        //     this.total_page = _get(res,'data.total', 1),
        //     this.isLoading = false
        // },

        setPage(value) {
            this.currentPage = value
        },

        onOpen(item) {
            this.info_customer = item
            this.eventModal = true
        },
        onClose() {
            this.eventModal = false
        },

        setFilters(value) {
            this.filters = value.filters
            this.order = value.orders
            this.getCustomer()
        },
        
    },

    mounted() {
        // this.getCustomer()
    },

    watch: {
        currentPage: {
            handler() {
                this.getCustomer()
            }
        }
    }
};
</script>

<template>
    <b-row>
        <b-col lg="12">
            <b-card no-body>
                <b-card-header class="border-0">
                    <div class="d-flex align-items-center">
                        <h5 class="card-title mb-0 flex-grow-1">Thanh toán</h5>
                    </div>
                </b-card-header>
                <div class="bg-soft-light p-3 border border-dashed border-start-0 border-end-0">
                    <FilterContainer :config="config_filter" @handleFilter="setFilters"/>
                </div>
                <b-card-body>
                    <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar
                    style="height: calc(100vh - 500px)"
                    :fields="fields"
                    :items="Array(25).fill().map((item) => ({ code: item }))">
                    <template v-for="(field, index) in fields" :key="`${_get(field, 'key')}${index}`"
                        v-slot:[`cell(${field.key})`]>
                        <div class="placeholder placeholder-glow rounded w-100">
                            &nbsp;
                        </div>
                    </template>
                    </b-table>
                <b-table v-else sticky-header striped bordered responsive data-simplebar show-empty
                    style="height: calc(100vh - 500px)"
                    :hover="!_isEmpty(items)" 
                    :items="items" 
                    :fields="fields" 
                    @row-clicked="onOpen"
                >
                    <template #empty>
                        <NoresultTable />
                    </template>
                    <template #head()="scope">
                        <div class="text-nowrap">
                            {{ scope.label }}
                        </div>
                    </template>
                    <template #cell(id)="data">
                        <router-link :to="'/invoices/' + _get(data, 'item.id')" class="link-info">
                            {{ _get(data, 'item.id') }}
                        </router-link>
                    </template>
                    <template #cell(date)="data">
                        <div class="text-end">
                            {{ _moment(data.item.date).format('DD/MM/YYYY HH:mm') }}
                        </div>
                    </template>
                    <template #cell(amount)="data">
                        <div class="text-end text-danger fw-medium">
                            {{ _get(data, 'item.amount').toLocaleString('en-US') }}đ
                        </div>
                    </template>
                    <template #cell(status)="data">
                        <div class="badge rounded-pill text-uppercase"
                            :class="_get(status_invoice, `${data.item.status}.class`)"
                        >
                            {{ _get(status_invoice,`${data.item.status}.text`) }}
                        </div>
                    </template>
                    <template #cell(payment_type)="data">
                        <div class="d-flex align-items-center gap-2">
                            <i :class="_get(payment_types,`${data.item.payment_type}.icon`) + ' fs-4 ' + _get(payment_types,`${data.item.payment_type}.class`)"></i>
                            {{ _get(payment_types,`${data.item.payment_type}.text`) }}
                        </div>
                    </template>
                </b-table>
                <div class="d-flex justify-content-end mt-auto"
                    v-if="!_isEmpty(items)"
                >
                    <Pagination :currentPage="currentPage" 
                        @update:currentPage="currentPage = $event" 
                        :rows="total_page" 
                        :perPage="Number(perPage)" 
                        :is_disabled="isLoading"
                    />
                </div>
                </b-card-body>
            </b-card>
        </b-col>
    </b-row>
    <Modal :eventModal="eventModal" @update:eventModal="eventModal = $event" title="Thông tin thanh toán">
        <div>
            {{ info_customer }}
        </div>
    </Modal>
</template>