<script>

import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import FadeContainer from "../../../components/ui/fade-container.vue";
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import NoresultTable from '../../../components/ui/noresult-table.vue';
import OrderService from '../../../services/order.service'
import Pagination from '../../../components/ui/pagination/pagination.vue'
import status_order from '../../../config/status/status-order'
import Avatar from "../../../components/ui/avatar/avatar.vue"
import Text from "../../../components/ui/text.vue"
import moment from "moment"
import { reactive } from "vue";
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";
import config from '../../../config/filter/field/order-fields'
import CardReport from "../../../components/ui/card/card-report.vue";

export default {
    setup() {
        return reactive({

            status_order,
            moment
        })
    },

    data() {
        return {

            // loading
            isLoading: false,
            isLoadingStatistics: false,


            //fields table
            fields:  [
                { key: 'code', label: 'Mã đơn hàng', stickyColumn: true, tdClass: 'bg-light text-info fw-medium text-nowrap', thClass: 'bg-light text-nowrap' },
                { key: 'status', label: 'Trạng thái', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center ',  thStyle: "min-width: 150px"},
                { key: 'representative', label: 'Người đại diện', thClass: 'bg-light text-start text-nowrap', tdClass: 'text-nowrap', },
                
                { key: 'quantity', label: 'Số lượng học viên', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end'},
                // { key: 'courses', label: 'Khóa học', thClass: 'bg-light text-nowrap text-start', tdClass: 'text-nowrap text-start',  thStyle: "min-width: 100px",},
                { key: 'price', label: 'Giá trị đơn', thClass: 'bg-light text-end text-nowrap', tdClass: 'text-nowrap text-end  text-danger fw-medium',   thStyle: "min-width: 120px"},
                { key: 'created_at', label: 'Ngày lập đơn', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', },
                { key: 'created_by', label: 'Người lập đơn', thClass: 'bg-light text-start text-nowrap', tdClass: 'text-nowrap',},
                { key: 'payment_date', label: 'Ngày thanh toán', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', },
                { key: 'payment', label: 'Tình trạng thanh toán', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center',},
                { key: 'approved_by', label: 'Người duyệt đơn', thClass: 'bg-light text-start text-nowrap', tdClass: 'text-nowrap'},
                { key: 'action', label: 'Hành động', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center',  thStyle: "min-width: 130px"}
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

        };
    },
    components: 
    {
        PageHeader,
        FadeContainer,
        NoresultTable,
        Pagination,
        Avatar,
        Text,
        FilterContainer,
        CardReport
    },
 
    methods: {
        isEmpty(item) {
            return _isEmpty(item)
        },

        get(item, ref, auto = null) {
            return _get(item, ref, auto)  
        },

        mergeArray(array1, array2)
        {

            return array1.map(item1 => {
                const matchingItem = array2.find(item2 => item2.name === item1.name);
                if (matchingItem) {
                    return {
                        name: item1.name,
                        value: matchingItem.value
                    };
                } 
                else 
                {
                    return item1;
                }
            }).concat(array2.filter(item2 => !array1.some(item1 => item1.name === item2.name)));

        },
   

        handleDelete(value) {
            Swal.fire({
                title: JSON.stringify(value),
                text: "Bạn có chắc sẽ khóa đơn hàng này khỏi hệ thống?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#f46a6a",
                confirmButtonColor: "#34c38f",
                cancelButtonText: "Hủy",
                confirmButtonText: "Đồng ý",
            }).then((result) => {
                if (result.value) {

                    Swal.fire("Đã xóa!", "Bạn đã xóa đơn hàng này khỏi hệ thống.", "success");
                }
            });
        },

        handleUpdateStatusOrder(value) {
            Swal.fire({
                title: 'Cập nhật đơn hàng',
                text: "Bạn có muốn cập nhật trạng thái của đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#f46a6a",
                confirmButtonColor: "#34c38f",
                cancelButtonText: "Hủy",
                confirmButtonText: "Đồng ý",
            }).then((result) => {
                if (result.value) {
                    this.updateStatusOrder(value.id, {status: value.status})
                }
            });
        },

        async getDataTable() {
            this.isLoading = true;
            let resonse = await OrderService.getOrders({
                filters: this.filters,
                orders: this.orders,
                pagination: {
                    page: this.currentPage,
                    limit: this.page.per_page
                }
            })

            this.items_data_table = resonse

            this.page.per_page = this.get(this.items_data_table, 'data.per_page', 25)
            this.page.total = this.get(this.items_data_table, 'data.total', 0)
            this.page.from = this.get(this.items_data_table, 'data.from', 0)
            this.page.to = this.get(this.items_data_table, 'data.to', 0)

            this.isLoading = false;

        },

        async fetchDataStatistic() 
        {
            this.isLoadingStatistic = true;
            // this.items_data_statistic = await OrderService.getstatistic()
            this.items_data_statistic = {}

            this.isLoadingStatistic = false;

        },


        async setPage(value) 
        {
            this.currentPage = value
        },

   
        setFilters(value) {
            this.filters = value.filters
            this.orders = this.mergeArray([
                {
                    name: "created_at",
                    value: "desc"
                },
            ],value.orders._rawValue)


            if( this.get(this.items_data_table, "message")=="NO_CONTENT")
            {
                this.page.per_page = 1
            }

            if(value.callApi)
            {
                this.getDataTable()
            }
        },
       
        async updateStatusOrder(id, status) {
            const res = await OrderService.updateStatusOrder(id, status)
            if(_get(res, 'status') == 'error'){
                return 
            }
            await this.getDataTable()
        },


    },


    watch: {
        "currentPage"() 
        {
            this.getDataTable();
        },

        
        "page.per_page"() {
            if (!this.items_data_table || this.get(this.items_data_table, "message")=="NO_CONTENT") {
                return
            }
            this.getDataTable();
        },
    },

    async mounted() {
        this.fetchDataStatistic()
        this.getDataTable()  
    },

};
</script>

<template>
    <FadeContainer>
        <PageHeader title="Đơn hàng"  />
        <b-row>
            <b-col xl="4" md="12" >
                <CardReport title="Doanh thu trong tháng" :number="Number(0)" :isLoading="isLoadingStatistics">
                    <div class="avatar-md d-flex justify-content-center align-items-center bg-soft-info text-info rounded">
                        <i class="fs-1 bx bx-bitcoin"></i>
                    </div>
                </CardReport>
            </b-col>
            <b-col xl="4" md="12" >
                <CardReport title="Học viên mới trong tháng" :number="Number(0)" :isLoading="isLoadingStatistics">
                    <div class="avatar-md d-flex justify-content-center align-items-center bg-soft-success text-success rounded">
                        <i class="fs-1 bx bxs-group"></i>
                    </div>
                </CardReport>
            </b-col>
            <b-col xl="4" md="12" >
                <CardReport title="Đơn mới trong tháng" :number="Number(0)" :isLoading="isLoadingStatistics">
                    <div class="avatar-md d-flex justify-content-center align-items-center bg-soft-secondary text-secondary rounded">
                        <i class="fs-1 bx bx-list-check fs-1"></i>
                    </div>
                </CardReport>
            </b-col>
        </b-row>

        <b-row>
            <b-col lg="12">
                <b-card no-body id="invoiceList">
                    <b-card-header class="border-0">
                        <div class="d-flex align-items-center">
                            <h5 class="card-title mb-0 flex-grow-1">Danh sách đơn hàng</h5>
                            <router-link to="/orders/create">
                                <b-button variant="success" size="md">
                                    <i class="ri-add-line align-middle me-1"></i>
                                    Tạo đơn hàng
                                </b-button>
                            </router-link>
                        </div>
                    </b-card-header>
    
                    <b-card-body class="bg-soft-light border border-dashed border-start-0 border-end-0">
                        <FilterContainer :config="config_filter" @handleFilter="setFilters"/>
                    </b-card-body>
                    <b-card-body >
                        <b-table
                            v-if="isLoading"
                            sticky-header hover striped bordered data-simplebar responsive
                            style="height: calc(100vh - 328px)"
                            :fields="fields"
                            :items="Array(25).fill().map((item) => ({ code: item }))"
                        >
                            <template
                                v-for="(field, index) in fields"
                                :key="`${get(field, 'key')}${index}`"
                                v-slot:[`cell(${field.key})`]
                            >
                                <div class="placeholder placeholder-glow rounded w-100">
                                    &nbsp;
                                </div>
                            </template>
                        </b-table>
                        <b-table
                            v-else
                            sticky-header striped bordered responsive data-simplebar show-empty
                            :hover="!isEmpty(items_data_table)"
                            :items="get(items_data_table, 'data.data',[])"
                            :fields="fields"
                            style="height: calc(100vh - 328px)"
                        >
                            <template #empty>
                                <NoresultTable/>
                            </template>

                            <template #cell(code)="data">
                                <router-link :to="'/orders/' + data.item.id" class="link-info">
                                    {{ get(data, 'value') }}
                                </router-link>
                            </template>

                            <template #cell(representative)="data">
                                <div class="d-flex align-items-center gap-2">
                                    <Avatar :name="get(data, 'value.display_name')" size="xxs"/>
                          
                                    <Text :text="get(data, 'value.display_name')" css="text-nowrap text-secondary"/>
                                </div>
                            </template>

                            <template #cell(created_by)="data">
                                <div class="d-flex align-items-center gap-2" v-if="data.item.created_by">
                                    <Avatar :name="get(data, 'value.display_name')" size="xxs"/>
                                    <Text :text="get(data, 'value.display_name')" css="text-nowrap"/>
                                </div>
                                <div v-else>
                                    -
                                </div>
                            </template>

                            <template #cell(created_at)="data">
                                <span >
                                    {{ moment(get(data, 'value', )*1000).format('DD/MM/YYYY') || '--/--/----' }} 
                                    <span class="text-muted fs-10 fw-medium">
                                        {{ moment(get(data, 'value', )*1000).format('HH:mm:ss')}}
                                    </span>
                                </span>
                            </template>

                            <template #cell(price)="data">
                                <span class="text-end ">
                                    {{ get(data, 'value',0).toLocaleString('vn') }}
                                </span>
                            </template>

                            <template #cell(employee)="data">
                                <div class="d-flex align-items-center gap-2">
                                    <Avatar size="xxs" :name="get(data.value, 'display_name', 'Đang cập nhật')" :src="get(data.value, 'avatar_url', '')"/>
                                    <Text :text="get(data.value, 'display_name', 'Đang cập nhật')"/>
                                </div>
                            </template>

                            <template #cell(payment)="data">
                                <b-badge v-if="data.item.payment_date" variant="success">
                                    Đã thanh toán
                                </b-badge>
                                <b-badge v-else variant="danger">
                                    Chưa thanh toán
                                </b-badge>
                            </template>

                            <template #cell(amount)="data">
                                <span class="text-end ">
                                    {{ Number(get(data, 'value',0)).toLocaleString('vn') }}
                                </span>
                            </template>
                            
                            <template #cell(approved_by)="data">
                                <div class="d-flex align-items-center gap-2" v-if="data.value">
                                    <Avatar :name="get(data, 'value.display_name')" size="xxs"/>
                                    <router-link :to="`/staffs/${get(data, 'value.id')}`" 
                                        class="link-secondary"
                                    >
                                    <Text :text="get(data, 'value.display_name')" css="text-nowrap"/>
                                    </router-link>
                                </div>
                                <div v-else>
                                    -
                                </div>
                            </template>


                            <template #cell(payment_date)="data">
                                <span v-if="data.value">
                                    {{ moment(get(data, 'value', )).format('DD/MM/YYYY')  }}
                                </span>
                                <span v-else>
                                    {{  '--/--/----'}}
                                </span>

                            </template>

                            <template #cell(status)="data">
                                <!-- <span class="badge rounded-pill text-uppercase" :class="get(label_course, data.value+'.class', 'badge-soft-warning')">
                                    {{ get(label_course, data.value+'.text', 'Đang cập nhật') }}
                                </span> -->
                                <b-badge v-if="get(data.item, 'status') == 'completed' || get(data.item, 'status') == 'cancelled'" :variant="get(status_order, get(data.item, 'status')+'.variant', 'badge-soft-warning')">
                                    {{ get(status_order, data.value+'.label', 'Đang cập nhật') }}
                                </b-badge>
                                <b-dropdown 
                                    v-if="get(data.item, 'status') == 'pending' || get(data.item, 'status') == 'processing'"
                                    split  id="dropdown-1" size="sm" 
                                    :variant="get(status_order, data.value+'.class', 'badge-soft-warning')" 
                                    :text="get(status_order, data.value+'.label', 'Đang cập nhật')" class="py-n1 fs-10"
                                >
                                    <b-dropdown-item v-if="data.value == 'pending'"
                                        @click="handleUpdateStatusOrder({
                                            id: get(data.item, 'id'),
                                            status: 'processing'
                                        })"
                                    >
                                        <div class="text-primary">
                                            Xác nhận đơn

                                        </div>
                                    </b-dropdown-item>
                                    <b-dropdown-item v-if="data.value == 'processing'"
                                        @click="handleUpdateStatusOrder({
                                            id: get(data.item, 'id'),
                                            status: 'completed'
                                        })"
                                    >
                                        <div>
                                           Hoàn thành
                                        </div>
                                    </b-dropdown-item>
                                    <b-dropdown-item v-if="data.value == 'processing'|| data.value == 'pending'"
                                        @click="handleUpdateStatusOrder({
                                            id: get(data.item, 'id'),
                                            status: 'cancelled'
                                        })"
                                    >
                                        <div class="text-danger">
                                            Hủy đơn
                                        </div>
                                    </b-dropdown-item>
                                </b-dropdown>
                            </template>

                            
                            
                            <template #cell(action)="data">
                                <ul class="list-inline hstack gap-2 mb-0 d-flex justify-content-center">
                                    <!-- <li 
                                        class="list-inline-item" 
                                        v-b-tooltip.hover="{title: 'Xác nhận đơn'}"
                                    >
                                        <span class="cursor-pointer text-success d-inline-block" disabled="true" v-if="data.item.status == 'pending'">
                                            <i class="ri-checkbox-circle-fill fs-16"></i>
                                        </span>
                                        <span class=" text-success d-inline-block"  v-else style="opacity: 0.6; cursor: not-allowed">
                                            <i class="ri-checkbox-circle-fill fs-16"></i>
                                        </span>
                                    </li>
                                    <li 
                                        class="list-inline-item" 
                                        v-b-tooltip.hover="{title: 'Hủy đơn'}"
                                    >
                                        <span class="cursor-pointer text-danger d-inline-block" disabled="true" v-if="data.item.status == 'pending' || data.item.status == 'processing'">
                                            <i class="bx bxs-x-circle fs-16"></i>
                                        </span>
                                        <span class=" text-danger d-inline-block"  v-else style="opacity: 0.6; cursor: not-allowed">
                                            <i class="bx bxs-x-circle fs-16"></i>
                                        </span>
                                    </li> -->  
                                    <li 
                                        class="list-inline-item" 
                                        v-b-tooltip.hover="{title: 'Xem chi tiết'}"
                                    >
                                        <router-link :to="'/orders/' + get(data, 'item.id')" class="text-primary d-inline-block">
                                            <i class="ri-eye-fill fs-16"></i>
                                        </router-link>
                                    </li> 
                                    <li class="list-inline-item edit" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-trigger="hover"
                                        data-bs-placement="top" 
                                        v-b-tooltip.hover="{title: 'Cập nhật'}"
                                    >
                                        <!-- <b-link variant="text-primary" class="d-inline-block edit-item-btn" @click="editdata(data)">
                                            <i class="ri-pencil-fill fs-16"></i>
                                        </b-link> -->
                                        <router-link variant="text-primary" class="d-inline-block edit-item-btn"
                                                :to="'/orders/' + get(data, 'item.id')"
                                        >
                                            <i class="ri-pencil-fill fs-16"></i>
                                        </router-link>
                                    </li>
                                  </ul>
                            </template>
                        </b-table>
                        
                        <div class="d-flex justify-content-between align-items-center px-2">
                            <div>
                                <i>Hiển thị</i>
                                <div class="mx-2" style="display: inline-block; min-width: 50px">
                                    <b-form-select
                                        class="text-size bg-light border-0"
                                        :disabled="isLoading"
                                        v-model="page.per_page"
                                    >
                                        <b-form-select-option :value="25">25</b-form-select-option>
                                        <b-form-select-option :value="50">50</b-form-select-option>
                                        <b-form-select-option :value="100">100</b-form-select-option>
                                        <b-form-select-option :value="200">200</b-form-select-option>
                                    </b-form-select>
                                </div>
                                <i>
                                    đơn hàng từ <b>{{ page.from }}</b>-<b>{{ page.to }}</b>
                                    trên tổng số <b>{{ page.total }}</b> đơn hàng
                                </i>
                            </div>
                            <div>
                                <Pagination
                                    :currentPage="currentPage" 
                                    @update:currentPage="currentPage = $event" 
                                    :rows="Number(page.total)" 
                                    :perPage="page.per_page"
                                    :is_disabled="isLoading"
                                /> 
                            </div>
                        </div>
                   
    
                </b-card-body>
            </b-card>
        </b-col>
        </b-row>
    </FadeContainer>
  

   
</template>
