
<script>



import { converTimestampToDate, convertNumber, getData, converTimestampToDateHMS } from '../../../helpers/utils';

import isEmpty from 'lodash/isEmpty';
import ContractService from '../../../services/contract.service';

import statusContract from '../../../config/status/status-contract';
import statusInvoices from '../../../config/status/status-invoices';
import paymentService from '../../../config/type/payment-service';
import paymentType from '../../../config/type/payment-type';

import noresultTable from '../../ui/noresult-table.vue';
import Avatar from '../../ui/avatar/avatar.vue';
import Pagination from '../../ui/pagination/pagination.vue';
import RightSidebarCreate from '../../ui/modal/right-sidebar-create.vue';
import PlaceholderWraper from '../../ui/placeholder-wraper.vue';
export default {
    components: { noresultTable, Avatar, Pagination, RightSidebarCreate, PlaceholderWraper },
    data() {
        return {

            isLoading: false,

            fields: [
                {
                    key: 'code',
                    label: 'Mã hợp đồng',
                    thClass: 'bg-light text-nowrap text-uppercase text-muted',
                },
                {
                    key: 'status',
                    label: 'Trạng thái',
                    thClass: 'bg-light text-nowrap text-uppercase text-muted text-center',
                    tdClass: 'text-center',
                },
                {
                    key: 'created_at',
                    label: 'Ngày tạo',
                    thClass: 'bg-light text-nowrap text-uppercase text-muted text-end',
                    tdClass: 'text-end',
                },
                {
                    key: 'staff_business',
                    label: 'Nhân viên kinh doanh',
                    thClass: 'bg-light text-nowrap text-uppercase text-muted',
                },
                {
                    key: 'contract_begin',
                    label: 'Ngày bắt đầu',
                    thClass: 'bg-light text-nowrap text-uppercase text-muted text-end',
                    tdClass: 'text-end',
                },
                {
                    key: 'contract_end',
                    label: 'Ngày kết thúc',
                    thClass: 'bg-light text-nowrap text-uppercase text-muted text-end',
                    tdClass: 'text-end',
                },
                {
                    key: 'contract_value',
                    label: 'Giá trị hợp đồng',
                    thClass: 'bg-light text-nowrap text-uppercase text-muted text-end',
                    tdClass: 'text-end fw-medium text-danger',
                },
                {
                    key: 'action',
                    label: 'Hành động',
                    thClass: 'bg-light text-nowrap text-uppercase text-muted text-center',
                    tdClass: 'text-center fw-medium text-danger',
                },
            ],

            items: [],
            statusContract,
            perPage: 1,
            currentPage: 1,
            total_page: 1,
            limit: 25,
            page_from: 1,
            page_to: 1,
            orders: ['created_at'],
            up_down: 'asc',
            order_option: [
                {
                    item: 'code',
                    name: 'Mã hợp đồng',
                },
                {
                    item: 'created_at',
                    name: 'Ngày tạo',
                },
                {
                    item: 'status',
                    name: 'Trạng thái',
                },
                {
                    item: 'contract_value',
                    name: 'Giá trị HĐ',
                },
            ],

            limit_option: [
                { text: '25', value: 25 },
                { text: '50', value: 50 },
                { text: '100', value: 100 },
                { text: '200', value: 200 },
            ],


            //contract details
            createSidebarModal: false,
            isLoadingContractDetails: true,
            isLoadingContractDetailsReceipts: false,
            contract_id: null,
            contract_info: {},
            receipt_list: [],
            statusInvoices,
            paymentService,
            paymentType,
            receipt_fields: [
                {
                    key: 'id',
                    label: 'Mã thanh toán',
                    thClass: 'text-nowrap bg-light text-end',
                    tdClass: 'text-end text-info',

                },
                {
                    key: 'type',
                    label: 'Loại dịch vụ',
                    thClass: 'text-nowrap bg-light',
                },
                {
                    key: 'status',
                    label: 'Trạng thái',
                    thClass: 'text-nowrap bg-light text-center',
                    tdClass: 'text-center'
                },
                {
                    key: 'amount',
                    label: 'Số tiền thanh toán',
                    thClass: 'text-nowrap bg-light text-end',
                    tdClass: 'text-end',

                },
                {
                    key: 'vat',
                    label: 'Vat',
                    thClass: 'text-nowrap bg-light text-end',
                    tdClass: 'text-end',

                },
                {
                    key: 'payment_date',
                    label: 'Ngày thanh toán',
                    thClass: 'text-nowrap bg-light text-end',
                    tdClass: 'text-end',

                },
                {
                    key: 'payment_type',
                    label: 'Phương thức thanh toán',
                    thClass: 'text-nowrap bg-light',

                },
                {
                    key: 'created_at',
                    label: 'Ngày tạo',
                    thClass: 'text-nowrap bg-light text-end',
                    tdClass: 'text-end',
                },
                {
                    key: 'accountant',
                    label: 'Kế toán viên',
                    thClass: 'text-nowrap bg-light',
                },
            ]
        }
    },

    mounted() {
        this.getDataTable([
            {
                name: "created_at",
                value: "desc"
            }
        ])
    },

    methods: {
        _get(item, ref, defaultValue = '--') {
            return getData(item, ref, defaultValue)
        },

        _isEmpty(item) {
            return isEmpty(item)
        },

        _converTimestampToDate(timestamp) {
            return converTimestampToDate(timestamp)
        },

        _convertNumber(number) {
            return convertNumber(number)
        },

        _converTimestampToDateHMS(timestamp) {
            return converTimestampToDateHMS(timestamp)
        },

        async getDataTable(orders = []) {
            this.isLoading = true
            const res = await ContractService.getContract({
                filters: [
                    {
                        name: 'status',
                        operator: '=',
                        value: 'publish'
                    }
                ],
                orders: orders,
                pagination: {
                    page: this.currentPage,
                    limit: this.limit
                }
            })
            this.items = this._get(res, 'data.data', [])
            this.perPage = this._get(res, 'data.per_page', 1),
                this.total_page = this._get(res, 'data.total', 1),
                this.page_from = this._get(res, 'data.from', 1),
                this.page_to = this._get(res, 'data.to', 1),
                this.isLoading = false
        },

        onSubmit() {
            const convertData = this.orders.map(item => ({
                name: item,
                value: this.up_down,
            }))
            this.getDataTable(convertData)
        },


        openModal() {
            this.createSidebarModal = true
        },

        closeModal() {
            this.createSidebarModal = false
        },

        async getContractDetails(id) {
            this.isLoadingContractDetails = true
            const res = await ContractService.getContractDetail(id)
            if (!res) return
            this.contract_info = this._get(res, 'data')
            this.isLoadingContractDetails = false
        },
        async getContractDetailsReceipts(id) {
            this.isLoadingContractDetailsReceipts = true
            const res = await ContractService.getContractDetailReceipts(id)
            if (!res) return
            this.receipt_list = this._get(res, 'data', [])
            this.isLoadingContractDetailsReceipts = false
        },

        handleOpenContractDetailsModal(id) {
            this.contract_id = id
            this.getContractDetails(id)
            this.getContractDetailsReceipts(id)
            this.openModal()

        }
    },

    watch: {
        "currentPage"() {
            this.getDataTable();
        },

        limit: {
            deep: true,
            handler() {
                this.currentPage = 1
                this.getDataTable()
            }
        }
    }
}
</script>

<template>
    <b-card no-body>
        <b-card-header>
            <div class="d-flex justify-content-between align-items-center">
                <b-card-title class="mb-0 flex-grow-1 text-uppercase">
                    HỢP ĐỒNG
                    <!-- <div>
                        <BDropdown v-model="show2" variant="soft-primary" class="m-1" size="sm" auto-close="outside">
                            <template #button-content>
                                <i class='bx bx-sort'></i>
                                Sắp xếp
                            </template>
                            <b-form class="p-3"
                                @submit.prevent="onSubmit"
                            >
                                <div class="mb-2 pb-2 d-flex flex-column gap-2 border-bottom">  
                                    <div>
                                        Sắp xếp theo:
                                    </div>
                                    <div>
                                        <BFormRadio v-model="up_down" name="some-radios" value="asc">Tăng dần</BFormRadio>
                                        <BFormRadio v-model="up_down" name="some-radios" value="desc">Giảm dần</BFormRadio>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-2">
                                    <div>
                                        Tiêu chí:
                                    </div>
                                    <BFormCheckboxGroup class="mb-3 text-nowrap" value-field="item" text-field="name"
                                        v-model="orders"
                                        :options="order_option"
                                    />
                                </div>
                                <div class="text-end">
                                    <b-button size="sm" type="submit">
                                       
                                        Áp dụng
                                    </b-button>
                                </div>
                            </b-form>
                        </BDropdown>
                    </div> -->
                </b-card-title>
                <b-link href="/contracts" class="fw-medium link-primary">
                    Xem tất cả hợp đồng
                </b-link>
            </div>
        </b-card-header>
        <b-card-body class="mx-n3 mt-n3">
            <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar style="height: 362px; "
                :fields="fields" :items="Array(25).fill().map((item) => ({ code: item }))">
                <template v-for="(field, index) in fields" :key="`${_get(field, 'key')}${index}`"
                    v-slot:[`cell(${field.key})`]>
                    <div class="placeholder placeholder-glow rounded w-100">
                        &nbsp;
                    </div>
                </template>
            </b-table>
            <b-table v-else sticky-header bordered responsive data-simplebar show-empty style="height: 362px; "
                :hover="!_isEmpty(items)" :items="items" :fields="fields">
                <template #empty>
                    <noresult-table />
                </template>
                <!-- <template #head()="scope">
                <div class="text-nowrap">
                    {{ scope.label }}
                </div>
            </template> -->
                <template #cell(code)="data">
                    <div class="text-info cursor-pointer " @click="handleOpenContractDetailsModal(_get(data, 'item.id'))">
                        {{ _get(data.item, 'code') }}
                    </div>
                </template>
                <template #cell(created_at)="data">
                    <div class="d-flex align-items-center gap-2 justify-content-end">
                        {{ _converTimestampToDate(_get(data, 'item.created_at')) }}
                    </div>
                </template>
                <template #cell(contract_begin)="data">
                    <div class="d-flex align-items-center gap-2 justify-content-end">
                        {{ _converTimestampToDate(_get(data, 'item.contract_begin')) }}
                    </div>
                </template>
                <template #cell(contract_end)="data">
                    <div class="d-flex align-items-center gap-2 justify-content-end">
                        {{ _converTimestampToDate(_get(data, 'item.contract_end')) }}
                    </div>
                </template>
                <template #cell(staff_business)="data">
                    <div v-if="!data.value">
                        --
                    </div>
                    <div class="d-flex align-items-center gap-2" v-else>
                        <avatar :name="_get(data.item, 'staff_business.display_name')"
                            :image="_get(data.item, 'staff_business.avatar_url')" size="xxs" />
                        <div>
                            {{ _get(data.item, 'staff_business.display_name') }}
                        </div>
                    </div>
                </template>
                <template #cell(status)="data">
                    <b-badge :variant="_get(statusContract, _get(data.item, 'status') + '.variant', 'light')">
                        {{ _get(statusContract, _get(data.item, 'status') + '.label') }}
                    </b-badge>
                </template>
                <template #cell(contract_value)="data">
                    <div class="d-flex align-items-center gap-2 justify-content-end text-danger">
                        {{ _convertNumber(_get(data, 'item.contract_value')) }}đ
                    </div>
                </template>
                <template #cell(action)="data">
                    <span class="text-primary fw-medium cursor-pointer d-flex align-items-center justify-content-center gap-2"
                        @click="handleOpenContractDetailsModal(_get(data, 'item.id'))"
                    >
                        <i class="ri-eye-fill fs-16"></i>
                        Xem chi tiết
                    </span>
                    <!-- <router-link :to="`/contracts/${data.item.id}`"
                    class="text-primary d-flex align-items-center justify-content-center gap-2">
                    <i class="ri-eye-fill fs-16"></i>
                    Xem chi tiết
                </router-link> -->
                </template>
            </b-table>
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center justify-content-center gap-2 ms-4">
                    <span class="text-nowrap italic">Hiển thị</span>
                    <b-form-select v-model="limit" size="sm" class="bg-light" :options="limit_option">
                    </b-form-select>
                    <span class="text-nowrap italic">Hợp đồng từ <b>{{ page_from }} - {{ page_to }}</b> trên tổng số
                        <b>{{ total_page }}</b></span>
                </div>
                <div class="d-flex justify-content-end mt-auto mx-3">
                    <pagination :currentPage="currentPage" @update:currentPage="currentPage = $event" :rows="total_page"
                        :perPage="Number(perPage)" :is_disabled="isLoading" />
                </div>
            </div>
        </b-card-body>
    </b-card>

    <right-sidebar-create :title="'Thông tin chi tiết hợp đồng'" :createSidebarModal="createSidebarModal" :width="'80%'"
    @update:createSidebarModal="createSidebarModal = $event">
    <div>
        <div class="mb-4">
            <h6 class="mb-4">Thông tin hợp đồng</h6>
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));">
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">ID:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div>
                            {{ _get(contract_info, 'id', 'Đang cập nhật') }}
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Giá trị hợp đồng:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div class="text-danger">
                            {{ _convertNumber(_get(contract_info, 'contract_value', 0)) }} đ
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Ngày tạo:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div>
                            {{ _converTimestampToDate(_get(contract_info, 'created_at', 'Đang cập nhật')) }}
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Mã hợp đồng:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div>
                            {{ _get(contract_info, 'code', 'Đang cập nhật') }}
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Vat:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div>
                            {{ _convertNumber( _get(contract_info, 'vat', 0) )}} đ
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Cập nhật gần nhất:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div>
                            {{ _converTimestampToDate(_get(contract_info, 'updated_at', 'Đang cập nhật')) }}
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Người đại diện:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div class="text-primary fw-medium">
                            {{ _get(contract_info, 'representative.display_name', 'Đang cập nhật') }}
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Ngày bắt đầu:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div>
                            {{ _converTimestampToDate(_get(contract_info, 'contract_begin', 'Đang cập nhật')) }}
                        </div>
                    </placeholder-wraper>
                </div>

                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Ghi chú:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div>
                            {{ _get(contract_info, 'contract_note', 'Đang cập nhật') }}
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Trạng thái:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <b-badge :variant="_get(statusContract, _get(contract_info, 'status', 'Đang cập nhật')+ '.variant')">
                            {{ _get(statusContract, _get(contract_info, 'status', 'Đang cập nhật')+ '.label') }}
                        </b-badge>
                    </placeholder-wraper>
                </div>

                <div class="d-flex align-items-center gap-2 border-start p-2">
                    <div class="fw-medium" style="min-width: 140px;">Ngày kết thúc:</div>
                    <placeholder-wraper :isLoading="isLoadingContractDetails">
                        <div>
                            {{ _converTimestampToDate(_get(contract_info, 'contract_end', 'Đang cập nhật')) }}
                        </div>
                    </placeholder-wraper>
                </div>
                <div class="d-flex align-items-center gap-2 border-start p-2">
                </div>
            </div>
        </div>
        <div>
            <h6 class="mb-4">Danh sách thanh toán</h6>
            <b-table v-if="isLoadingContractDetailsReceipts" sticky-header hover bordered responsive data-simplebar
                style="height: calc(100vh - 328px)" :fields="fields"
                :items="Array(25).fill().map((item) => ({ code: item }))">
                <template v-for="(field, index) in fields" :key="`${get(field, 'key')}${index}`"
                    v-slot:[`cell(${field.key})`]>
                    <div class="placeholder placeholder-glow rounded w-100">
                        &nbsp;
                    </div>
                </template>
            </b-table>
            <b-table v-else sticky-header bordered responsive data-simplebar show-empty :hover="!_isEmpty(receipt_list)"
                :items="receipt_list" :fields="receipt_fields" style="max-height: calc(100vh - 328px)">
                <template #empty>
                    <NoresultTable />
                </template>
                
                <template #cell(type)="data">
                    {{ _get(paymentService, _get(data.item, 'type') + '.label') }}
                 </template>
                <template #cell(status)="data">
                   <b-badge :variant="_get(statusInvoices, _get(data.item, 'status', 'Đang cập nhật')+ '.variant', 'light')">
                            {{ _get(statusInvoices, _get(data.item, 'status', 'Đang cập nhật')+ '.label') }}
                    </b-badge>
                </template>
                <template #cell(amount)="data">
                    <div class="text-danger">
                        {{_convertNumber(_get(data.item, 'amount', 0))}} đ
                    </div>
                </template>
                <template #cell(vat)="data">
                    <div class="text-danger text-nowrap ">
                        {{_convertNumber(_get(data.item, 'vat', 0))}} đ
                    </div>
                </template>
                <template #cell(payment_date)="data">
                    <div class="text-nowrap">
                        {{_converTimestampToDateHMS(_get(data.item, 'payment_date', 'Đang cập nhật'))}}
                    </div>
                </template>
                <template #cell(payment_type)="data">
                    <div class="d-flex align-items-center gap-2">
                        <i :class="_get(paymentType,`${_get(data.item, 'payment_type')}.icon`) + ' fs-4 ' + _get(paymentType,`${_get(data.item, 'payment_type')}.class`)"></i>
                        {{ _get(paymentType,`${_get(data.item, 'payment_type')}.text`) }}
                    </div>
                </template>
                <template #cell(created_at)="data">
                    <div>
                        {{_converTimestampToDate(_get(data.item, 'payment_date', 'Đang cập nhật'))}}
                    </div>
                </template>
                <template #cell(accountant)="data">
                    <div class="d-flex align-items-center gap-2">
                        <avatar size="xxs" 
                            :src="_get(data.item, 'staff_accountant.avatar_url', '')"
                            :name="_get(data.item, 'staff_accountant.display_name')"
                        />
                        <div class="text-nowrap">
                            {{_get(data.item, 'staff_accountant.display_name')}}
                        </div>
                    </div>
                </template>
            </b-table>
        </div>
    </div>
</right-sidebar-create>

</template>

<style lang="scss" scoped></style>