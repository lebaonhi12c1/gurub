<script>
import _isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import moment from "moment"
import Text from '../../ui/text.vue';
import { reactive } from "vue";
import statusReceipt from '../../../config/status/status-receipt';
import payment_types from '../../../config/type/payment-type';
import labelReceipt from '../../../config/labels/label-receipt';
import config from '../../../config/filter/field/order-fields';
import NoresultTable from '../../ui/noresult-table.vue';
import Pagination from '../../ui/pagination/pagination.vue';
import Avatar from '../../ui/avatar/avatar.vue';
import status_order from '../../../config/status/status-order';
import OrderService from '../../../services/order.service';
import Swal from "sweetalert2";
export default {
    setup() {
        return reactive({
            get,
            statusReceipt,
            moment,
            payment_types,
            labelReceipt,
            status_order
        })
    },

    data() {
        return {

            // loading
            isLoading: false,
            isLoadingStatistic: false,


            //fields table
            fields:  [
                { key: 'code', label: 'Mã đơn hàng', stickyColumn: true, tdClass: ' text-info fw-medium text-nowrap', thClass: 'bg-light text-nowrap' },
                { key: 'status', label: 'Trạng thái', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center ',  thStyle: "min-width: 150px"},
                { key: 'created_at', label: 'Ngày lập đơn', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end  ', },
                { key: 'created_by', label: 'Người lập đơn', thClass: 'bg-light text-start text-nowrap', tdClass: 'text-nowrap  ',},
                { key: 'price', label: 'Giá trị đơn', thClass: 'bg-light text-end text-nowrap', tdClass: 'text-nowrap text-end   text-danger fw-medium',   thStyle: "min-width: 120px"},
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
    components: {
        NoresultTable,
        Pagination,
        Avatar,
        Text,
        // FilterContainer,
    },
 
    methods: {
        _isEmpty(item) {
            return _isEmpty(item)
        },

        percent_capacity(value1, value2){
            var percent = (Number(value1) - Number(value2));
            var result = Math.abs((percent / value2)) * 100;

            if (value2 == 0 || !value2)
            {
                return "warning"
            }

            if (!percent)
            {
                return "warning"
            }

            if(result > 0 && result <= 25)
            {
                return "success"
            }

            if(result > 25 && result < 50)
            {
                return "info"
            }

            
            if(result >= 50 && result <= 75)
            {
                return "warning"
            }

            if(result > 75 )
            {
                return "danger"
            }


        },
  

        async getDataTable() {
            this.isLoading = true;
            let resonse = await OrderService.getOrders({
                filters: [
                    {
                        name: 'status',
                        operator: '=',
                        value: 'pending'
                    }
                ],
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
            // this.items_data_statistic = await ContractService.getstatistic()

            this.isLoadingStatistic = false;

        },

        async setPage(value) 
        {
            this.currentPage = value
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
   
        setFilters(value) {
            this.filters = value.filters

            this.orders = this.mergeArray([
                {
                    name: "created_at",
                    value: "desc"
                },
            ],value.orders._rawValue)


            if(get(this.items_data_table, "message")=="NO_CONTENT")
            {
                this.page.per_page = 25
            }

            if(value.callApi)
            {
                this.getDataTable()
            }
        },

        async confirmedOrders(value){
            Swal.fire({
                title: "Xác nhận trạng thái!",
                html: "Bạn có chắc sẽ chuyển trạng thái đơn hàng này thành <b> '"+ get(status_order, value.status+'.label', 'Đang cập nhật') +"'</b> không?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#f46a6a",
                confirmButtonColor: "#34c38f",
                cancelButtonText: "Hủy",
                confirmButtonText: "Đồng ý",
            }).then(async (result) => {
                if (result.value) {
                    await OrderService.updateStatusOrder(value.id, {status: value.status})
                    await this.getDataTable()  
                }
            });
            return
        }
       
    },


    watch: {
        "currentPage"() 
        {
            this.getDataTable();
        },

        
        "page.per_page"() {
            if (!this.items_data_table || get(this.items_data_table, "message")=="NO_CONTENT") {
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
                return get(this.items_data_table,'data.data',[]).map(item => ({
                    ...item, 
                 
                }))
            }
        }
    }
};
</script>

<template>
    <b-card no-body>
        <b-card-header>
            <div class="d-flex justify-content-between align-items-center">
                <b-card-title class="mb-0 flex-grow-1 text-uppercase">ĐƠN HÀNG CHỜ DUYỆT</b-card-title>
                <b-link href="/orders"  class="fw-medium link-primary">Xem tất cả đơn hàng</b-link>
            </div>
        </b-card-header>
        <b-card-body class="mx-n3 mt-n3">
            <b-table
                v-if="isLoading"
                sticky-header hover  bordered responsive data-simplebar
                style="height: calc( 400px)"
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
                sticky-header  bordered responsive data-simplebar show-empty
                :hover="!_isEmpty(data_table_result)"
                :items="data_table_result"
                :fields="fields"
                style="height: calc(400px)"
            >
                <template #empty>
                    <NoresultTable/>
                </template>
                <template #cell(code)="data">
                    <b-link :href="'/orders/'+data.item.id">
                        <Text :text="data.item.code"/>
                    </b-link>
                </template>
    
    
                <template #cell(status)="data">
                    <!-- <span class="badge rounded-pill text-uppercase" :class="get(label_course, data.value+'.class', 'badge-soft-warning')">
                        {{ get(label_course, data.value+'.text', 'Đang cập nhật') }}
                    </span> -->
                    <b-dropdown 
                        v-if="data.value == 'pending' || data.value == 'processing'"
                        split  id="dropdown-1" size="sm" 
                        :variant="get(status_order, data.value+'.class', 'badge-soft-warning')" 
                        :text="get(status_order, data.value+'.label', 'Đang cập nhật')" class="py-n1 fs-10"
                    >
                        <b-dropdown-item v-if="data.value == 'pending'" @click="confirmedOrders({status: 'processing', id : data.item.id})">
                            <div class="text-primary">
                                Xác nhận đơn
                            </div>
                        </b-dropdown-item>
                        <b-dropdown-item v-if="data.value == 'processing'" @click="confirmedOrders({status: 'completed', id : data.item.id})">
                            <div>
                               Hoàn thành
                            </div>
                        </b-dropdown-item>
                        <b-dropdown-item v-if="data.value == 'pending'" @click="confirmedOrders({status: 'cancelled', id : data.item.id})">
                            <div class="text-danger">
                                Hủy đơn
                            </div>
                        </b-dropdown-item>
                    </b-dropdown>
                    <span class="badge rounded-pill text-uppercase p-1"  :class="get(status_order, data.value+'.class', 'badge-soft-warning')"  v-else>
                        {{ get(status_order, data.value+'.label', 'Đang cập nhật') }}
                        <!-- {{ data.value }} -->
                    </span>
                </template>
               
    
    
           
               
                <template #cell(price)="data">
                    <span class="text-end ">
                        {{ get(data, 'value',0).toLocaleString('vn') }}đ
                    </span>
                </template>

             
                <template #cell(created_by)="data">
                    <div class="d-flex align-items-center gap-2" v-if="get(data.value, 'display_name')">
                        <Avatar size="xxs" :name="get(data.value, 'display_name', 'Đang cập nhật')" :src="get(data.value, 'avatar_url', '')"/>
                        {{ get(data.value, 'display_name', 'Đang cập nhật') }}
                        <!-- <Text :text="get(data.value, 'display_name', 'Đang cập nhật')"/> -->
                    </div>
                    <div v-else class="ps-1">
                        --
                    </div>
                </template>
    
                <template #cell(created_at)="data">
                    <span >
                        {{ moment(get(data, 'value', ) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                    </span>
                </template>
   
            </b-table>
            
            <div class="d-flex justify-content-between align-items-center px-3">
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
</template>