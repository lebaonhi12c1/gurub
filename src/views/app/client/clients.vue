<script>

import PageHeader from "@/components/page-header";
import FadeContainer from "../../../components/ui/fade-container.vue";
import NoresultTable from '../../../components/ui/noresult-table.vue';
import Pagination from '../../../components/ui/pagination/pagination.vue';
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";

import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import { converTimestampToDate } from "../../../helpers/utils";

import ClientService from "../../../services/client.service";

import clienType from '../../../config/type/client-type'

import config from '../../../config/filter/field/client-fields'
import Text from '../../../components/ui/text.vue';
import Avatar from '../../../components/ui/avatar/avatar.vue';
export default {

    data() {
        return {
            title: "Danh sách khách hàng",
            config: {
                mode: "range",
                wrap: true, // set wrap to true only when using 'input-group'
                altFormat: "M j, Y",
                altInput: true,
                dateFormat: "d M, Y",
            },
            clienType,
            perPage: 1,
            currentPage: 1,
            total_page: 1,
            limit: 25,
            isLoading: false,
            info_customer: {},
            filters: [],
            order: [],
            config_filter: config,
            fields: [
                {
                    key: 'id',
                    label: 'Mã khách hàng',
                    stickyColumn: true, 
                    tdClass: 'text-info text-end fw-medium',
                    thClass: 'text-end', 
                    class: 'bg-light'
                },
                {
                    key: 'display_name',
                    label: 'Tên khách hàng',
                    thClass: 'bg-light ',
                    tdClass: 'text-secondary'
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
                    label: 'Loại khách',
                    thClass: 'bg-light '
                },
                {
                    key: 'created_at',
                    label: 'Ngày tạo',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end',
                },
            ],
            items: [],
        };
    },
    components: {
        PageHeader,
        FadeContainer,
        NoresultTable,
        Pagination,
        FilterContainer,
        Text,
        Avatar,
    },

    methods: {
        _isEmpty(item) {
            return _isEmpty(item)
        },
        _get(item, ref, auto = '--') {
            return _get(item, ref, auto)
        },

        _converTimestampToDate(value) {
            return converTimestampToDate(value)
        },
        async getDataTable () {  
            this.isLoading = true
            const res = await ClientService.getClients({
                filters: this.filters,
                orders: this.order.concat([ 
                    {
                        name: "created_at",
                        value: 'desc',
                    }
                ]),
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

        setPage(value) {
            this.currentPage = value
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
    },

    mounted() {
        this.getDataTable()
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
            <b-col lg="12">
                <b-card no-body>
                    <b-card-header class="border-0">
                        <div class="d-flex align-items-center">
                            <h5 class="card-title mb-0 flex-grow-1">Tất cả khách hàng</h5>
                        </div>
                    </b-card-header>
                    <div class="bg-soft-light p-3 border border-dashed border-start-0 border-end-0">
                        <FilterContainer :config="config_filter" @handleFilter="setFilters"/>
                    </div>
                    <b-card-body>
                        <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar
                        style="height: calc(100vh - 430px)"
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
                        style="height: calc(100vh - 430px)"
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
                            {{ _get(data, 'item.id') }}
                        </template>
                        <template #cell(display_name)="data">      
                            <div class="d-flex align-items-center gap-2">
                                <avatar :name="_get(data.item, 'display_name')" :image="_get(data, 'item.avatar_url')"
                                    :size="'xxs'"
                                />
                                {{ _get(data, 'item.display_name') }}
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
                        <template #cell(type)="data">
                            <div class="text-start">
                                {{ _get(clienType,data.item.type) }}
                            </div>
                        </template>
                        <template #cell(created_at)="data">
                            <div class="text-end">
                                {{ _converTimestampToDate(_get(data.item, 'created_at')) }}
                            </div>
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
</template>