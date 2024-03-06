<script>

import PageHeader from "@/components/page-header";
import FadeContainer from "../../../components/ui/fade-container.vue";
import CardReport from "../../../components/ui/card/card-report-ver2.vue";
import { CountTo } from "vue3-count-to";
import _isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import NoresultTable from '../../../components/ui/noresult-table.vue';
import ReceiptService from '../../../services/receipt.service'
import Pagination from '../../../components/ui/pagination/pagination.vue'
import statusReceipt from '../../../config/status/status-receipt'
import Avatar from "../../../components/ui/avatar/avatar.vue"
import Text from "../../../components/ui/text.vue"
import moment from "moment"
import { reactive } from "vue";
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";
import config from '../../../config/filter/field/receipt-fields.js'
import payment_types from '../../../config/type/payment-type.js'
import labelReceipt from '../../../config/labels/label-receipt'

export default {
    setup() {
        return reactive({
            get,
            statusReceipt,
            moment,
            payment_types,
            labelReceipt
        })
    },

    data() {
        return {

            // loading
            isLoading: false,
            isLoadingStatistic: false,

            //fields table
            fields:  [
                { key: 'id', label: 'Mã thanh toán', stickyColumn: true, tdClass: 'bg-light text-info fw-medium text-nowrap text-end', thClass: 'bg-light text-nowrap',  },
                { key: 'payment_date', label: 'Ngày thanh toán', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end ', thStyle: 'min-width: 110px'},
                { key: 'contract_code', stickyColumn: true, label: 'Mã hợp đồng', thClass: 'bg-light text-nowrap text-start', tdClass: 'bg-light text-nowrap text-start', },
                { key: 'amount', label: 'Số tiền thanh toán', thClass: 'bg-light text-nowrap text-end ', tdClass: 'bg-light  text-nowrap text-end text-medium text-danger', },
                { key: 'vat_obj', label: 'Thuế giá trị gia tăng', thClass: 'bg-light text-nowrap text-end ', tdClass: 'text-nowrap text-end text-medium ', },
                { key: 'service_fee_obj', label: 'Phí dịch vụ', thClass: 'bg-light text-nowrap text-end ', tdClass: 'text-nowrap text-end text-medium ', },
                { key: 'accountant', label: 'Kế toán viên', thClass: 'bg-light text-nowrap ', tdClass: 'text-nowrap text-medium ', },
                { key: 'payment_type', label: 'Phương thức thanh toán', thClass: 'bg-light text-nowrap', tdClass: 'text-nowrap'},
                { key: 'type', label: 'Loại thanh toán', thClass: 'bg-light text-nowrap', tdClass: 'text-nowrap'},
                
                { key: 'status', label: 'Trạng thái', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center'},
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
        PageHeader,
        FadeContainer,
        CardReport,
        CountTo,
        NoresultTable,
        Pagination,
        Avatar,
        Text,
        FilterContainer,
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
            this.items_data_table = await ReceiptService.getReceipts({
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
                    vat_obj: {
                        vat: item.vat,
                        vat_rate: item.vat_rate,
                    },
                    service_fee_obj: {
                        service_fee: item.service_fee,
                        service_fee_rate: item.service_fee_rate
                    }
                }))
            }
        }
    }
};
</script>

<template>
    <FadeContainer>
        <PageHeader title="Thanh toán"  />
        <b-row>

            <b-col xl="4" md="12" >
                <CardReport title="Tổng tiền thanh toán"  :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_courses_publish', 0)" :duration="1000"></count-to>
                    </template>
                    <template  #slot2>
                        <div class="flex-shrink-0 avatar-md">
                            <div class="avatar-title bg-soft-warning text-warning fs-22 rounded">
                            <i class="ri-shopping-bag-line"></i>
                            </div>
                        </div>
                    </template>

                </CardReport>
            </b-col>
            <b-col xl="4" md="12" >
                <CardReport title="Trung bình một thanh toán"   :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_method_online', 0)" :duration="1000"></count-to>
                    </template>
                    <template  #slot2>
                        <div class="flex-shrink-0 avatar-md">
                            <div class="avatar-title bg-soft-info text-info fs-22 rounded">
                                <i class=" bx bx-money-withdraw fs-2"></i>
                            </div>
                        </div>
                    </template>

                </CardReport>
            </b-col>
            <b-col xl="4" md="12" >
                <CardReport title="Tồn nợ"  :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_zone_hcm', 0)" :duration="1000"></count-to>
                    </template>
                    <template  #slot2>
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
                            <h5 class="card-title mb-0 flex-grow-1">Danh sách thanh toán</h5>
                            
                        </div>
                    </b-card-header>
    
                    <b-card-body class="bg-soft-light border border-dashed border-start-0 border-end-0">
                        <FilterContainer :config="config_filter" @handleFilter="setFilters"/>
                    </b-card-body>
                    <b-card-body >
                        <b-table
                            v-if="isLoading"
                            sticky-header hover striped bordered responsive data-simplebar
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
                            :hover="!_isEmpty(data_table_result)"
                            :items="data_table_result"
                            :fields="fields"
                            style="height: calc(100vh - 328px)"
                        >
                            <template #empty>
                                <NoresultTable/>
                            </template>
                            <template #cell(contract_code)="data">
                                   <Text :text="data.item.contract_code"/>
                            </template>


                            <template #cell(status)="data">
                                <span class="badge rounded-pill text-uppercase" :class="get(statusReceipt, data.value+'.class', 'badge-soft-warning')">
                                    {{ get(statusReceipt, data.value+'.label', 'Đang cập nhật') }}
                                </span>
                            </template>
                           


                       
                            <template #cell(vat_obj)="data">
                                <div class="d-flex gap-2 align-items-baseline justify-content-end">
                                    <span class="text-end d-block">
                                        {{ get(data, 'value.vat',0).toLocaleString('vn') }}
                                    </span>
                                    <span class="text-end text-muted fs-12 d-block">
                                        ({{ get(data, 'value.vat_rate',0) }}%)
                                    </span>
                                </div>
                            </template>
                            <template #cell(service_fee_obj)="data">
                                <div class="d-flex gap-2 align-items-baseline justify-content-end">
                                    <span class="text-end d-block">
                                        {{ get(data, 'value.service_fee',0).toLocaleString('vn') }}
                                    </span>
                                    <span class="text-end text-muted fs-12 d-block">
                                        ({{ get(data, 'value.service_fee_rate',0) }}%)
                                    </span>
                                </div>
                            </template>
                            <template #cell(amount)="data">
                                <span class="text-end ">
                                    {{ get(data, 'value',0).toLocaleString('vn') }}
                                </span>
                            </template>
                         
                            <template #cell(accountant)="data">
                                <div class="d-flex align-items-center gap-2" v-if="get(data.value, 'display_name')">
                                    <Avatar size="xxs" :name="get(data.value, 'display_name', 'Đang cập nhật')" :src="get(data.value, 'avatar_url', '')"/>
                                    <Text :text="get(data.value, 'display_name', 'Đang cập nhật')"/>
                                </div>
                                <div v-else class="ps-1">
                                    --
                                </div>
                            </template>
                            <template #cell(payment_type)="data">
                                <div class="d-flex align-items-center gap-2">
                                    <i :class="get(payment_types,`${data.item.payment_type}.icon`) + ' fs-4 ' + get(payment_types,`${data.item.payment_type}.class`)"></i>
                                    {{ get(payment_types,`${data.item.payment_type}.text`, '--')}}
                                </div>
                            </template>
                            
                            <template #cell(type)="data">
                                <Text :text="get(labelReceipt.type, data.value+ '.text', 'Đang cập nhật')"/>
                             </template>
                         

                            <template #cell(payment_date)="data">
                                <span >
                                    {{ moment(get(data, 'value', ) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                </span>
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
                                   thanh toán từ <b>{{ page.from }}</b>-<b>{{ page.to }}</b>
                                    trên tổng số <b>{{ page.total }}</b> thanh toán
                                </i>
                            </div>
                            <div>
                                <Pagination
                                    :currentPage="currentPage" 
                                    @update:currentPage="currentPage = $event" 
                                    :rows="Number(page.total)" 
                                    :perPage="Number(page.per_page)"
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
