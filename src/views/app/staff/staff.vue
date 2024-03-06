<script>

import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import StaffService from '../../../services/staff.service'

import config from '../../../config/filter/field/staff-fields'
import status_customer from '../../../config/status/status-staff'
import staff_type from '../../../config/type/course-typ'
import contactType from '../../../config/type/contact-type'
import statusStaff from '../../../config/status/status-staff'
import zoneType from '../../../config/type/zone-type'
// import Swal from "sweetalert2";

import PageHeader from "@/components/page-header";
import FadeContainer from "../../../components/ui/fade-container.vue";
import CardReport from "../../../components/ui/card/card-report.vue";
import NoresultTable from '../../../components/ui/noresult-table.vue';
import Pagination from '../../../components/ui/pagination/pagination.vue';
import Avatar from '../../../components/ui/avatar/avatar.vue';
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";
import RightSidebar from '../../../components/ui/modal/right-sidebar.vue'
import Text from '../../../components/ui/text.vue'
export default {

    data() {
        return {
            title: "Danh sách nhân viên",
            perPage: 1,
            currentPage: 1,
            total_page: 1,
            limit: 25,
            isLoading: false,
            isLoadingStatistics: false,
            eventSidebarModal: false,
            info_customer: {},
            filters: [],
            order: [],
            config_filter: config,
            status_customer,
            staff_type,
            contactType,
            statusStaff,
            zoneType,
            customer_report: {
                total:{
                    id: 1,
                    label: "Tổng nhân viên",
                    icon: "bx bxs-group",
                    counter: 0,
                    style: 'bg-soft-success text-success'
                },
                google:{
                    id: 3,
                    label: "nhân viên google",
                    icon: "bx bxl-google",
                    counter: 0,
                    style: 'bg-soft-danger text-danger'
                },
                facebook:{
                    id: 4,
                    label: "nhân viên facebook",
                    icon: "bx bxl-facebook",
                    counter: 0,
                    style: 'bg-soft-info text-info'
                },
            },
            fields: [
                {
                    key: 'id',
                    label: 'Mã nhân viên',
                    stickyColumn: true, 
                    tdClass: 'text-info fw-medium text-end', 
                    thClass: 'text-end',
                    class: 'bg-light'

                },
                {
                    key: 'display_name',
                    label: 'Tên nhân viên',
                    thClass: 'bg-light ',
                    tdClass: 'text-info'
                },
                {
                    key: 'phone',
                    label: 'Số điện thoại',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end'
                },
                {
                    key: 'email',
                    label: 'Email',
                    thClass: 'bg-light '
                },
                {
                    key: 'type',
                    label: 'Chức vụ',
                    thClass: 'bg-light',
                    
                },
                {
                    key: 'zone',
                    label: 'Nơi làm việc',
                    thClass: 'bg-light',
                    
                },
                {
                    key: 'specialization',
                    label: 'Chuyên môn',
                    thClass: 'bg-light',
                    
                },
                {
                    key: 'status',
                    label: 'Trạng thái',
                    tdClass: 'text-center',
                    thClass: 'bg-light text-center',
                    
                },
                {
                    key: 'action',
                    label: 'Hành động',
                    thClass: 'bg-light text-center',
                    tdClass: 'text-center'
                },
            ],
            items: [],
        };
    },
    components: {
        PageHeader,
        FadeContainer,
        CardReport,
        NoresultTable,
        Pagination,
        FilterContainer,
        Avatar,
        RightSidebar,
        Text,
    },

    methods: {
        _isEmpty(item) {
            return _isEmpty(item)
        },
        _get(item, ref, auto = null) {
            return _get(item, ref, auto)
        },
        async getDataTable () {  
            this.isLoading = true
            const res = await StaffService.getStaff({
                filters: this.filters,
                orders: this.order,
                pagination: {
                    page: this.currentPage,
                    limit: this.limit
                }
            })
            this.items = _get(res, 'data.data', [])
            this.perPage = _get(res,'data.per_page', 1),
            this.total_page = _get(res,'data.total', 1),
            this.isLoading = false
        },

        async getStaffStatistics() {
            this.isLoadingStatistics = true
            const res = await StaffService.getStaffStatistics()
            this.customer_report.total.counter = _get(res, 'data.total', 0)
            this.customer_report.google.counter = _get(res, 'data.total_google', 0)
            this.customer_report.facebook.counter = _get(res, 'data.total_facebook', 0)
            this.isLoadingStatistics = false
        },

        setPage(value) {
            this.currentPage = value
        },

        onOpen(item) {
            this.info_customer = item
            this.eventSidebarModal = true
        },
        onClose() {
            this.eventSidebarModal = false
        },

        setFilters(value) {
            this.filters = value.filters
            this.order = value.orders
            this.currentPage = 1
            if(value.callApi)
            {
                this.getDataTable()
            }
        },

        handleToDetail(url) {
            this.onClose()
            this.$router.push(url)
        },
        
        // handleDelete(item) {
        //     Swal.fire({
        //         title: "Bạn có muốn xoá?",
        //         text: "Điều này sẽ không thể hoàn tác",
        //         icon: "warning",
        //         showCancelButton: true,
        //         cancelButtonColor: "#f46a6a",
        //         confirmButtonColor: "#34c38f",
        //         confirmButtonText: "Đồng ý!",
        //         cancelButtonText: 'Hủy'
        //     }).then((result) => {
        //         if (result.value) {
        //             Swal.fire("Deleted!", "Your file has been deleted.", "success");
        //         }
        //     })
        // }
    },

    mounted() {
        this.getDataTable()
        this.getStaffStatistics()
    },
    
    computed: {
        staff_table_data: {
            get() {
                return this.items.map(item =>{
                    return {
                        ...item,
                        action: item.id
                    }
                })
            }
        }
    },

    watch: {
        currentPage: {
            handler() {
                this.getDataTable()
            }
        }
    }
};
</script>

<template>
    <FadeContainer>
        <PageHeader :title="title"/>
        <b-row>
            <b-col xl="4" md="12" v-for="(item, index) of customer_report" :key="index">
                <CardReport :title="item.label" :number="Number(item.counter)" :isLoading="isLoadingStatistics">
                    <div class="avatar-md d-flex justify-content-center align-items-center rounded"
                        :class="`${item.style}`">
                        <i class="fs-1" :class="item.icon">
                        </i>
                    </div>
                </CardReport>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="12">
                <b-card no-body>
                    <b-card-header class="border-0">
                        <div class="d-flex align-items-center">
                            <h5 class="card-title mb-0 flex-grow-1">Tất cả nhân viên</h5>
                        </div>
                    </b-card-header>
                    <div class="bg-soft-light p-3 border border-dashed border-start-0 border-end-0">
                        <FilterContainer :config="config_filter" @handleFilter="setFilters"/>
                    </div>
                    <b-card-body>
                        <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar
                        style="height: calc(100vh - 400px)"
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
                        style="height: calc(100vh - 400px)"
                        :hover="!_isEmpty(items)" 
                        :items="staff_table_data" 
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
                            <router-link class="link-info d-flex justify-content-end"
                                :to="`/staffs/${_get(data, 'item.id')}`"
                            >
                                <Text :text="_get(data, 'item.id')"/>
                            </router-link>
                        </template>
                        <template #cell(display_name)="data">
                            <div class="d-flex align-items-center gap-2">
                                <avatar :name="data.item.display_name" size="xxs"/>
                                <router-link :to="`/staffs/${_get(data, 'item.id')}`" 
                                    class="link-secondary"
                                >
                                <Text :text="_get(data, 'item.display_name')" css="text-nowrap"/>
                                </router-link>
                            </div>
                        </template>
                        <template #cell(phone)="data">
                            <div class="d-flex align-items-center justify-content-end gap-2">
                                <Text :text="_get(data, 'item.phone')" css="text-nowrap"/>
                                <i class='bx bx-phone text-primary'></i>
                            </div>
                        </template>
                        <template #cell(email)="data">
                            <div class="d-flex align-items-center gap-2">
                                <i class='bx bx-envelope text-primary'></i>
                                <Text :text="_get(data, 'item.email')"/>

                            </div>
                        </template>
                        <template #cell(type)="data">
                            <div
                            >
                                <Text :text="_get(contactType, `${_get(data, 'item.type')}.label`)" css="text-nowrap"/>
                            </div>
                        </template>
                        <template #cell(zone)="data">
                            <div
                            >
                                <Text :text="_get(zoneType, _get(data, 'item.zone'))" css="text-nowrap"/>
                            </div>
                        </template>
                        <template #cell(specialization)="data">
                            <div class="d-flex align-items-center gap-2"
                                :class="`${_get(staff_type, `${_get(data, 'item.specialization')}.class`)}`"
                            >
                                <avatar size="xxs"
                                    :name="_get(staff_type, `${_get(data, 'item.specialization')}.label`, '')"
                                    :src="_get(staff_type, `${_get(data, 'item.specialization')}.logo`)"
                                />
                                <Text :text="_get(staff_type, `${_get(data, 'item.specialization')}.label`)" css="text-nowrap"/>
                            </div>
                        </template>
                        <template #cell(status)="data">
                            <div class="badge rounded-pill"
                                :class="{
                                    'badge-soft-success': _get(data, 'item.status_contact') == 0,
                                    'badge-soft-danger': _get(data, 'item.status_contact') != 0,
                                }"
                            >
                                <div v-if="_get(data, 'item.status_contact') ==0">
                                    Đang trống
                                </div>
                                <div v-else>
                                    Đang bận
                                </div>
                            </div>
                        </template>
                        <template #cell(action)="data">
                            <router-link :to="'/staffs/' + _get(data, 'item.action')" class="text-primary d-flex align-items-center justify-content-center gap-2">
                                <i class="ri-eye-fill fs-16"></i>
                               <span class="text-nowrap"> Xem chi tiết</span>
                            </router-link>
                        </template>
                    </b-table>
                    <div class="d-flex justify-content-end mt-auto">
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
    </FadeContainer>
    <right-sidebar :eventSidebarModal="eventSidebarModal" @update:eventSidebarModal="eventSidebarModal = $event" title="Thông tin nhân viên">
        <div class="d-flex align-items-center flex-column gap-2">
            <avatar size="md" :name="info_customer.display_name"/>
            <Text :text="info_customer.display_name"/>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Mã nhân viên:</div>
            <Text :text="info_customer.id"/>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Tên nhân viên:</div>
            <Text :text="info_customer.display_name"/>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Số điện thoại:</div>
            <Text :text="info_customer.phone"/>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Email:</div>
            <Text :text="info_customer.email"/>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Chức vụ:</div>
            <div>{{ _get(contactType, `${info_customer.type}.label`) }}</div>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Nơi làm việc:</div>
            <div>{{ _get(zoneType, `${info_customer.zone}`) }}</div>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Chuyên môn:</div>
            <div :class=" _get(staff_type, `${info_customer.specialization}.class`)">
                {{ _get(staff_type, `${info_customer.specialization}.label`) }}
            </div>
        </div>
        <div class="d-flex justify-content-center mt-4">
            <b-button @click="handleToDetail('/staffs/' + this.info_customer.id)" class="btn-label right nexttab">
                <i class="bx bx-chevron-right label-icon align-middle fs-16 ms-2 "></i>Xem chi tiết
            </b-button>
        </div>
    </right-sidebar>
</template>