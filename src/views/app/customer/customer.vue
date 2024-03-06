<script>

import PageHeader from "@/components/page-header";
import FadeContainer from "../../../components/ui/fade-container.vue";
import CardReport from "../../../components/ui/card/card-report.vue";
import NoresultTable from '../../../components/ui/noresult-table.vue';
import Pagination from '../../../components/ui/pagination/pagination.vue';
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";

import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import CustomerService from '../../../services/customer.service'

import config from '../../../config/filter/field/customer-fields'
// import Swal from "sweetalert2";
import RightSidebar from '../../../components/ui/modal/right-sidebar.vue';
import Avatar from '../../../components/ui/avatar/avatar.vue';
import Text from '../../../components/ui/text.vue';
export default {

    data() {
        return {
            title: "Danh sách học viên",
            config: {
                mode: "range",
                wrap: true, // set wrap to true only when using 'input-group'
                altFormat: "M j, Y",
                altInput: true,
                dateFormat: "d M, Y",
            },
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
            customer_report: {
                total:{
                    id: 1,
                    label: "Tổng học viên",
                    icon: "bx bxs-group",
                    counter: 0,
                    style: 'bg-soft-success text-success'
                },
                google:{
                    id: 3,
                    label: "học viên google",
                    icon: "bx bxl-google",
                    counter: 0,
                    style: 'bg-soft-danger text-danger'
                },
                facebook:{
                    id: 4,
                    label: "học viên facebook",
                    icon: "bx bxl-facebook",
                    counter: 0,
                    style: 'bg-soft-info text-info'
                },
            },
            fields: [
                {
                    key: 'id',
                    label: 'Mã học viên',
                    stickyColumn: true, 
                    tdClass: 'text-info text-end fw-medium',
                    thClass: 'text-end', 
                    class: 'bg-light'
                },
                {
                    key: 'display_name',
                    label: 'Tên học viên',
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
        RightSidebar,
        Avatar,
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
            const res = await CustomerService.getCustomers({
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

        async getCustomerStatistics() {
            this.isLoadingStatistics = true
            const res = await CustomerService.getCustomersStatistics()
            this.customer_report.total.counter = this._get(res, 'data.total', 0)
            this.customer_report.google.counter = this._get(res, 'data.total_google', 0)
            this.customer_report.facebook.counter = this._get(res, 'data.total_facebook', 0)
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
        // },


        handleRoute(url) {
            this.onClose()
            this.$router.push(url)   
        }
    },

    mounted() {
        this.getDataTable()
        this.getCustomerStatistics()
    },

    computed: {
        customer_row: {
            get() {
                return this.items.map(item => {
                    return {...item, action: item.id}
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
                            <h5 class="card-title mb-0 flex-grow-1">Tất cả học viên</h5>
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
                        :hover="!_isEmpty(customer_row)" 
                        :items="customer_row" 
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
                            <router-link :to="'/students/' + _get(data, 'item.action')" class="link-info">
                                {{ _get(data, 'item.action') }}
                            </router-link>
                        </template>
                        <template #cell(display_name)="data">
                            <div class="d-flex align-items-center gap-2">
                                <Avatar :image="_get(data, 'item.avatar')" :name="_get(data, 'item.display_name')" :size="'xxs'" />
                                <router-link :to="'/students/' + _get(data, 'item.action')" class="text-nowrap link-secondary">
                                    {{ _get(data, 'item.display_name') }}
                                </router-link>
                            </div>
                        </template>
                        <template #cell(phone)="data">
                            <div class="d-flex align-items-center justify-content-end gap-2">
                               
                                <Text :text="data.item.phone" css="text-end text-nowrap"></Text>
                                <i class='bx bx-phone text-primary'></i>
                            </div>
                        </template>
                        <template #cell(email)="data">
                            <div class="d-flex align-items-center gap-2">
                                <i class='bx bx-envelope text-primary'></i>
                                <Text :text="data.item.email"></Text>
                            </div>
                        </template>
                        <template #cell(status)="data">
                            <div class="badge rounded-pill text-uppercase"
                                :class="_get(status_customer, `${data.item.status}.class`)"
                            >
                                {{ _get(status_customer,`${data.item.status}.text`) }}
                            </div>
                        </template>
                        <template #cell(action)="data">
                            <router-link :to="`/students/${data.item.id}`" class="text-primary d-flex align-items-center justify-content-center gap-2">
                                <i class="ri-eye-fill fs-16"></i>
                                Xem chi tiết
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
        <!-- <Modal :eventModal="eventModal" @update:eventModal="eventModal = $event" title="Thông tin học viên">
            <div>
                {{ info_customer }}
            </div>
        </Modal> -->
    </FadeContainer>
    <right-sidebar :eventSidebarModal="eventSidebarModal" @update:eventSidebarModal="eventSidebarModal = $event" title="Thông tin học viên">
        <div class="d-flex align-items-center flex-column gap-2">
            <avatar size="md" :name="info_customer.display_name"/>
            <h5>{{ info_customer.display_name }}</h5>
            <div class="d-flex gap-2">
                <b-button variant="danger" class="p-0" style="width: 2.5rem; height: 2.2rem;"
                    :disabled="_isEmpty(info_customer.phone)"
                >
                    <a :href="`tel:${info_customer.phone}`" v-b-tooltip.hover="{title: 'Gọi ngay'}"
                        class="d-block text-white w-100 h-100"
                    >
                        <i class=' bx bx-phone mt-1'></i>
                    </a>
                </b-button>
                
                <b-button variant="success" class="p-0" style="width: 2.5rem; height: 2.2rem;"
                    :disabled="_isEmpty(info_customer.email)"
                >
                    <a :href="`mailTo:${info_customer.email}`" v-b-tooltip.hover="{title: 'Gửi mail'}"
                        class="d-block text-white w-100 h-100"
                    >
                        <i class='bx bx-envelope mt-1'></i>
                     </a>
                </b-button>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Mã học viên:</div>
            <Text :text="_get(info_customer, 'id')"/>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Tên học viên:</div>
            <Text :text="_get(info_customer, 'display_name')"/>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Số điện thoại:</div>
            <Text :text="_get(info_customer, 'phone')"/>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <div style="min-width: 150px" class="fw-medium">Email:</div>
            <Text :text="_get(info_customer, 'email')"/>
        </div>

        <div class="d-flex justify-content-center mt-4">
            <b-button type="submit" class="btn-label right nexttab"  @click="handleRoute('/students/' + info_customer.id)">
                <i class="bx bx-chevron-right label-icon align-middle fs-16 ms-2 "></i>Xem chi tiết
            </b-button>
        </div>
    </right-sidebar>
</template>