<script>

import PageHeader from "@/components/page-header";
import FadeContainer from "../../../components/ui/fade-container.vue";
import CardReport from "../../../components/ui/card/card-report-ver2.vue";
import { CountTo } from "vue3-count-to";
import _isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import NoresultTable from '../../../components/ui/noresult-table.vue';
import ContractService from '../../../services/contract.service'
import Pagination from '../../../components/ui/pagination/pagination.vue'
import statusContract from '../../../config/status/status-contract'
import statusInvoices from "../../../config/status/status-invoices";
import paymentService from '../../../config/type/payment-service'
import Avatar from "../../../components/ui/avatar/avatar.vue"
import Text from "../../../components/ui/text.vue"
import moment from "moment"
import { reactive } from "vue";
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";
import config from '../../../config/filter/field/contract-fields'
import course_type from '../../../config/type/course-typ'
import zone_type from '../../../config/type/zone-type'
import RightSidebarCreate from '../../../components/ui/modal/right-sidebar-create.vue';
import { getData, converTimestampToDate, convertNumber, converTimestampToDateHMS } from "../../../helpers/utils";
import PlaceholderWraper from '../../../components/ui/placeholder-wraper.vue';
import paymentType from '../../../config/type/payment-type';
export default {
    setup() {
        return reactive({
            get,
            statusContract,
            moment,
            course_type,
            zone_type
        })
    },

    data() {
        return {

            // loading
            isLoading: false,
            isLoadingStatistic: false,
            createSidebarModal: false,

            //fields table
            fields: [
                { key: 'code', label: 'Mã hợp đồng', stickyColumn: true, tdClass: 'bg-light text-info fw-medium text-nowrap', thClass: 'bg-light text-nowrap', },
                { key: 'status', label: 'Trạng thái', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center', },
                { key: 'staff_business', label: 'Nhân viên kinh doanh', thClass: 'bg-light text-nowrap', tdClass: 'text-nowrap' },
                { key: 'contract_begin', label: 'Ngày bắt đầu', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', },
                { key: 'contract_end', label: 'Ngày kết thúc', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', },
                { key: 'vat', label: 'Thuế giá trị gia tăng', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end ', },
                { key: 'contract_value', label: 'Giá trị hợp đồng', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end text-danger fw-medium', },
                { key: 'created_at', label: 'Ngày tạo', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', thStyle: 'min-width: 140px' },
                { key: 'updated_at', label: 'Ngày cập nhật gần nhất', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', thStyle: 'min-width: 140px' },
                { key: 'action', label: 'Hành động', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center px-4', tdstyle: 'min-width: 120px;' }
            ],

            // data 
            items_data_table: [],
            items_data_statistic: {},


            //pagination
            currentPage: 1,
            page: {
                per_page: 25,
                total: 0,
                from: 0,
                to: 0,
            },

            //filter
            config_filter: config,
            filters: [],
            orders: [
                {
                    name: "created_at",
                    value: "desc"
                }
            ],

            //contract details
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
                    tdClass: 'text-end text-info bg-light',
                    stickyColumn: true
                },
                {
                    key: 'type',
                    label: 'Loại thanh toán',
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
                    label: 'VAT',
                    thClass: 'text-nowrap bg-light text-end',
                    tdClass: 'text-end',

                },
                {
                    key: 'service_fee',
                    label: 'Phí dịnh vụ',
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
        };
    },
    components: {
        PageHeader,
        FadeContainer,
        CardReport,
        CountTo,
        NoresultTable,
        Pagination,
        Avatar,
        Text,
        FilterContainer,
        RightSidebarCreate,
        PlaceholderWraper,
    },

    methods: {
        _converTimestampToDate(timestamp) {
            return converTimestampToDate(timestamp)
        },
        _convertNumber(value) {
            return convertNumber(value)
        },

        _converTimestampToDateHMS(timestamp) {
            return converTimestampToDateHMS(timestamp)
        },
        _getData(item, ref, auto = '--') {
            return getData(item, ref, auto)
        },
        _isEmpty(item) {
            return _isEmpty(item)
        },

        percent_capacity(value1, value2) {
            var percent = (Number(value1) - Number(value2));
            var result = Math.abs((percent / value2)) * 100;

            if (value2 == 0 || !value2) {
                return "warning"
            }

            if (!percent) {
                return "warning"
            }

            if (result > 0 && result <= 25) {
                return "success"
            }

            if (result > 25 && result < 50) {
                return "info"
            }


            if (result >= 50 && result <= 75) {
                return "warning"
            }

            if (result > 75) {
                return "danger"
            }


        },


        async getDataTable() {
            this.isLoading = true;
            this.items_data_table = await ContractService.getContract({
                filters: this.filters,
                orders: this.orders,
                pagination: {
                    page: this.currentPage,
                    limit: this.page.per_page
                }
            })

            this.page.per_page = get(this.items_data_table, 'data.per_page', 25)
            this.page.total = get(this.items_data_table, 'data.total', 0)
            this.page.from = get(this.items_data_table, 'data.from', 0)
            this.page.to = get(this.items_data_table, 'data.to', 0)

            this.isLoading = false;

        },

        async fetchDataStatistic() {
            this.isLoadingStatistic = true;
            // this.items_data_statistic = await ContractService.getstatistic()

            this.isLoadingStatistic = false;

        },

        async setPage(value) {
            this.currentPage = value
        },

        mergeArray(array1, array2) {

            return array1.map(item1 => {
                const matchingItem = array2.find(item2 => item2.name === item1.name);
                if (matchingItem) {
                    return {
                        name: item1.name,
                        value: matchingItem.value
                    };
                }
                else {
                    return item1;
                }
            }).concat(array2.filter(item2 => !array1.some(item1 => item1.name === item2.name)));

        },

        setFilters(value) {
            this.filters = value.filters

            this.orders = this.mergeArray([
                {
                    name: "created_at",
                    value: "desc"
                },
            ], value.orders._rawValue)


            if( get(this.items_data_table, "message")=="NO_CONTENT")
            {
                this.page.per_page = 25
            }

            if (value.callApi) {
                this.getDataTable()
            }
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
            this.contract_info = this._getData(res, 'data')
            this.isLoadingContractDetails = false
        },
        async getContractDetailsReceipts(id) {
            this.isLoadingContractDetailsReceipts = true
            const res = await ContractService.getContractDetailReceipts(id)
            if (!res) return
            this.receipt_list = this._getData(res, 'data', [])
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


        "page.per_page"() {
            if (!this.items_data_table || get(this.items_data_table, "message") == "NO_CONTENT") {
                return
            }
            this.getDataTable();
        },
    },

    async mounted() {
        await this.getDataTable()
        await this.fetchDataStatistic()
    },

    computed: {
        data_table_result: {
            get() {
                return get(this.items_data_table, 'data.data', []).map(item => ({
                    ...item, action: item.code
                }))
            }
        }
    }
};
</script>

<template>
    <FadeContainer>
        <PageHeader title="Hợp đồng" />
        <b-row>
            <b-col xl="4" md="12">
                <CardReport title="Số lượng hợp đồng" sub_title="(Đang thực hiện / Tổng số)"
                    :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_courses_publish', 0)"
                            :duration="1000"></count-to>/
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_courses', 0)"
                            :duration="1000"></count-to>
                    </template>
                    <template #slot2>
                        <div class="flex-shrink-0 avatar-md">
                            <div class="avatar-title bg-soft-warning text-warning fs-22 rounded">
                                <i class="ri-shopping-bag-line"></i>
                            </div>
                        </div>
                    </template>

                </CardReport>
            </b-col>
            <b-col xl="4" md="12">
                <CardReport title="Tổng giá trị hợp đồng" sub_title="(Đang thực hiện)" :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_method_online', 0)"
                            :duration="1000"></count-to>
                    </template>
                    <template #slot2>
                        <div class="flex-shrink-0 avatar-md">
                            <div class="avatar-title bg-soft-info text-info fs-22 rounded">
                                <i class=" bx bx-money-withdraw fs-2"></i>
                            </div>
                        </div>
                    </template>

                </CardReport>
            </b-col>
            <b-col xl="4" md="12">
                <CardReport title="Đã thanh toán" :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_zone_hcm', 0)"
                            :duration="1000"></count-to>
                    </template>
                    <template #slot2>
                        <div class="flex-shrink-0 avatar-md">
                            <div class="avatar-title bg-soft-success text-success fs-2 rounded">
                                <i class="bx bx-money"></i>
                            </div>
                        </div>
                    </template>

                </CardReport>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="12">
                <b-card no-body id="invoiceList">
                    <b-card-header class="border-0">
                        <div class="d-flex align-items-center">
                            <h5 class="card-title mb-0 flex-grow-1">Danh sách hợp đồng</h5>
                            <!-- <router-link to="/courses/create">
                                <b-button variant="success" size="md">
                                    <i class="ri-add-line align-middle me-1"></i>
                                    Thêm
                                </b-button>
                            </router-link> -->
                        </div>
                    </b-card-header>

                    <b-card-body class="bg-soft-light border border-dashed border-start-0 border-end-0">
                        <FilterContainer :config="config_filter" @handleFilter="setFilters" />
                    </b-card-body>
                    <b-card-body>
                        <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar
                            style="height: calc(100vh - 328px)" :fields="fields"
                            :items="Array(25).fill().map((item) => ({ code: item }))">
                            <template v-for="(field, index) in fields" :key="`${get(field, 'key')}${index}`"
                                v-slot:[`cell(${field.key})`]>
                                <div class="placeholder placeholder-glow rounded w-100">
                                    &nbsp;
                                </div>
                            </template>
                        </b-table>
                        <b-table v-else sticky-header striped bordered responsive data-simplebar show-empty
                            :hover="!_isEmpty(data_table_result)" :items="data_table_result" :fields="fields"
                            style="height: calc(100vh - 328px)">
                            <template #empty>
                                <NoresultTable />
                            </template>

                            <template #cell(code)="data">
                                <div class="link-info cursor-pointer"
                                    @click="handleOpenContractDetailsModal(get(data, 'item.id'))"
                                >
                                    <Text :text="data.item.code" />
                                </div>
                            </template>

                            <template #cell(status)="data">
                                <span class="badge rounded-pill text-uppercase"
                                    :class="get(statusContract, data.value + '.class', 'badge-soft-warning')">
                                    {{ get(statusContract, data.value + '.label', 'Đang cập nhật') }}
                                    <!-- {{ data.value }} -->
                                </span>
                            </template>


                          


                            <template #cell(vat)="data">
                                <span class="text-end ">
                                    {{ get(data, 'value', 0).toLocaleString('vn') }}
                                </span>
                            </template>

                            <template #cell(contract_value)="data">
                                <span class="text-end ">
                                    {{ get(data, 'value', 0).toLocaleString('vn') }}
                                </span>
                            </template>

                            <template #cell(staff_business)="data">
                                <div class="d-flex align-items-center gap-2" v-if="get(data.value, 'display_name')">
                                    <Avatar size="xxs" :name="get(data.value, 'display_name', 'Đang cập nhật')"
                                        :src="get(data.value, 'avatar_url', '')" />
                                    <Text :text="get(data.value, 'display_name', 'Đang cập nhật')" />
                                </div>
                                <div v-else class="ps-1">
                                    --
                                </div>
                            </template>

                            <template #cell(contract_begin)="data">
                                <span>
                                    {{ moment(get(data, 'value',) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                </span>
                            </template>

                            <template #cell(contract_end)="data">
                                <span>
                                    {{ moment(get(data, 'value',) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                </span>
                            </template>



                            <template #cell(created_at)="data">
                                <span>
                                    {{ moment(get(data, 'value',) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                </span>
                            </template>

                            <template #cell(updated_at)="data">
                                <span>
                                    {{ moment(get(data, 'value') * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                </span>
                            </template>
                            <template #cell(action)="data">
                                <div @click="handleOpenContractDetailsModal(get(data, 'item.id'))"
                                    class="text-primary d-flex align-items-center justify-content-center gap-2 cursor-pointer">
                                    <i class="ri-eye-fill fs-16"></i>
                                    Xem chi tiết
                                </div>
                            </template>
                        </b-table>

                        <div class="d-flex justify-content-between align-items-center px-2">
                            <div>
                                <i>Hiển thị</i>
                                <div class="mx-2" style="display: inline-block; min-width: 50px">
                                    <b-form-select class="text-size bg-light border-0" :disabled="isLoading"
                                        v-model="page.per_page">
                                        <b-form-select-option :value="25">25</b-form-select-option>
                                        <b-form-select-option :value="50">50</b-form-select-option>
                                        <b-form-select-option :value="100">100</b-form-select-option>
                                        <b-form-select-option :value="200">200</b-form-select-option>
                                    </b-form-select>
                                </div>
                                <i>
                                    hợp đồng từ <b>{{ page.from }}</b>-<b>{{ page.to }}</b>
                                    trên tổng số <b>{{ page.total }}</b> hợp đồng
                                </i>
                            </div>
                            <div>
                                <Pagination :currentPage="currentPage" @update:currentPage="currentPage = $event"
                                    :rows="Number(page.total)" :perPage="Number(page.per_page)" :is_disabled="isLoading" />
                            </div>
                        </div>


                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
    </FadeContainer>
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
                                {{ _getData(contract_info, 'id', 'Đang cập nhật') }}
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Giá trị hợp đồng:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div class="text-danger">
                                {{ _convertNumber(_getData(contract_info, 'contract_value', 0)) }} đ
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Ngày tạo:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div>
                                {{ _converTimestampToDate(_getData(contract_info, 'created_at', 'Đang cập nhật')) }}
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Mã hợp đồng:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div>
                                {{ _getData(contract_info, 'code', 'Đang cập nhật') }}
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">VAT:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div>
                                {{ _convertNumber( _getData(contract_info, 'vat', 0) )}} đ
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Cập nhật gần nhất:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div>
                                {{ _converTimestampToDate(_getData(contract_info, 'updated_at', 'Đang cập nhật')) }}
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Người đại diện:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div class="text-primary fw-medium">
                                {{ _getData(contract_info, 'representative.display_name', 'Đang cập nhật') }}
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Ngày bắt đầu:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div>
                                {{ _converTimestampToDate(_getData(contract_info, 'contract_begin', 'Đang cập nhật')) }}
                            </div>
                        </placeholder-wraper>
                    </div>

                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Ghi chú:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div>
                                {{ _getData(contract_info, 'contract_note', 'Đang cập nhật') }}
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Trạng thái:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <b-badge :variant="_getData(statusContract, _getData(contract_info, 'status', 'Đang cập nhật')+ '.variant')">
                                {{ _getData(statusContract, _getData(contract_info, 'status', 'Đang cập nhật')+ '.label') }}
                            </b-badge>
                        </placeholder-wraper>
                    </div>

                    <div class="d-flex align-items-center gap-2 border-start p-2">
                        <div class="fw-medium" style="min-width: 140px;">Ngày kết thúc:</div>
                        <placeholder-wraper :isLoading="isLoadingContractDetails">
                            <div>
                                {{ _converTimestampToDate(_getData(contract_info, 'contract_end', 'Đang cập nhật')) }}
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
                        {{ _getData(paymentService, _getData(data.item, 'type') + '.label') }}
                     </template>
                    <template #cell(status)="data">
                       <b-badge :variant="_getData(statusInvoices, _getData(data.item, 'status', 'Đang cập nhật')+ '.variant', 'light')">
                                {{ _getData(statusInvoices, _getData(data.item, 'status', 'Đang cập nhật')+ '.label') }}
                        </b-badge>
                    </template>
                    <template #cell(amount)="data">
                        <div class="text-danger">
                            {{_convertNumber(_getData(data.item, 'amount', 0))}} đ
                        </div>
                    </template>
                    <template #cell(vat)="data">
                        <div class="d-flex align-items-center justify-content-end gap-1">
                            <div class="text-danger text-nowrap ">
                                {{_convertNumber(_getData(data.item, 'vat', 0))}} đ
                            </div>
                            <div class="fs-12 text-muted">
                                ({{ _getData(data.item, 'vat_rate', 0) }}%)
                            </div>
                        </div>
                    </template>
                    <template #cell(service_fee)="data">
                        <div class="d-flex align-items-center justify-content-end gap-1">
                            <div class="text-danger text-nowrap ">
                                {{_convertNumber(_getData(data.item, 'service_fee', 0))}} đ
                            </div>
                            <div class="fs-12 text-muted">
                                ({{ _getData(data.item, 'service_fee_rate', 0) }}%)
                            </div>
                        </div>
                    </template>
                    <template #cell(payment_date)="data">
                        <div class="text-nowrap">
                            {{_converTimestampToDateHMS(_getData(data.item, 'payment_date', 'Đang cập nhật'))}}
                        </div>
                    </template>
                    <template #cell(payment_type)="data">
                        <div class="d-flex align-items-center gap-2">
                            <i :class="_getData(paymentType,`${_getData(data.item, 'payment_type')}.icon`) + ' fs-4 ' + _getData(paymentType,`${_getData(data.item, 'payment_type')}.class`)"></i>
                            {{ _getData(paymentType,`${_getData(data.item, 'payment_type')}.text`) }}
                        </div>
                    </template>
                    <template #cell(created_at)="data">
                        <div>
                            {{_converTimestampToDate(_getData(data.item, 'payment_date', 'Đang cập nhật'))}}
                        </div>
                    </template>
                    <template #cell(accountant)="data">
                        <div class="d-flex align-items-center gap-2">
                            <avatar size="xxs" 
                                :src="_getData(data.item, 'staff_accountant.avatar_url', '')"
                                :name="_getData(data.item, 'staff_accountant.display_name', 'Đang cập nhật')"
                            />
                            <div class="text-nowrap">
                                {{_getData(data.item, 'staff_accountant.display_name', 'Đang cập nhật')}}
                            </div>
                        </div>
                    </template>
                </b-table>
            </div>
        </div>
    </right-sidebar-create>
</template>
