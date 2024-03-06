<script>
import Multiselect from "@vueform/multiselect"
import "@vueform/multiselect/themes/default.css"
import isEmpty from "lodash/isEmpty"
import get from "lodash/get"
import TopicService from "../../../../services/topic.service"
import NoresultTable from "../../../ui/noresult-table.vue"
import moment from "moment"
import { label_topic } from "../../../../config/labels/label-topic"

export default {
    props: {

    },
    data(){
        return{
            isEmpty,
            moment,
            label_topic,
            get,
            isLoading: false,
            valueMultiSelect: "Choice 1",
            fields: [
                {
                    key: 'id',
                    label: 'Mã chủ đề',
                    thClass: 'bg-light text-start text-nowrap text-end',
                    tdClass: 'text-end'
                },
                {
                    key: 'name',
                    label: 'Tên chủ đề',
                    thClass: 'bg-light text-start',
                    tdClass: 'text-start'
                },
                {
                    key: 'theory_percent',
                    label: 'Lý thuyết',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end'
                },
                {
                    key: 'practice_percent',
                    label: 'Thực hành',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end'
                },
                {
                    key: 'actual_share_percent',
                    label: 'Chia sẽ thực tế',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end'
                },
                {
                    key: 'status',
                    label: 'Trạng thái',
                    thClass: 'bg-light text-center',
                    tdClass: 'text-center',
                    sortable: true
                    
                },
                {
                    key: 'created_at',
                    label: 'Ngày tạo',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end',
                    sortable: true
                },
            ],
            items_data_table: []
        }
    },

    components: {
    Multiselect,
    NoresultTable
},

    methods: {
    async fetchData() {
            this.isLoading = true;

            this.items_data_table = await TopicService.getTopics(this.$route.params.id, {

                pagination: {
                    page: 1,
                    limit: 100
                }
            })


            this.isLoading = false;

        },
    },
    watch:{
        "valueMultiSelect"(){
            if(!this.valueMultiSelect)
            {
                this.valueMultiSelect = "Choice 1"
                return
            }

        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>

<template>
    <div class="d-flex flex-column gap-3">
        <b-row>
            <b-col>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="fs-16 fw-bold d-flex  align-items-center ">
                        Chủ đề
                    </div>
                    <div class="d-flex justify-content-end align-items-center gap-3">
                        <div>
                            Chế độ xem:
                        </div>
                        <div style="width: 230px">
            
                            <Multiselect 
                                no-results-text="Không tìm thấy giá trị nào"
                                style="z-index: 99999;"
                                class="form-control" v-model="valueMultiSelect" 
                                :close-on-select="true"
                                :searchable="true"
                                :can-clear="true"
                                :options="[
                              { value: 'Choice 1', label: 'Chi tiết' },
                              { value: 'Choice 2', label: 'Bảng' },
                            ]" />
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>
        <b-row >
            <b-col>
                <div v-if="valueMultiSelect == 'Choice 1'">
                    <div v-if="get(items_data_table,'data.data',[]).length >  0">
                        <b-card v-for="(item, index) in get(items_data_table,'data.data',[])" :key="index">
                            <div class="d-flex flex-column gap-2">
                                <h6>
                                    {{ item.name }} 
                                    ( <span>
                                        <span v-if="(get(item,'theory_percent' , 0)) > 0">
                                            {{ get(item,'theory_percent' , 0) }}% lý thuyết +
                                        </span>
                                        <span v-if="(get(item,'practice_percent' , 0)) > 0">
                                            {{ get(item,'practice_percent' , 0) }}% thực hành
                                        </span>
                                        <span v-if="Number(get(item,'actual_share_percent' , 0)) > 0">
                                            + {{ get(item,'actual_share_percent' , 0) }}% chia sẽ thực tế
                                        </span>
                                    </span>)
                                </h6>
                                <div >
                                    {{ get(item,'description') }}
                                </div>
                            </div>
                        </b-card>
                    </div>
                    <div v-else>
                        <NoresultTable />
                    </div>
                </div>
                <div v-if="valueMultiSelect == 'Choice 2'">
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
                    :hover="!isEmpty(items_data_table)"
                    :items="get(items_data_table,'data.data',[])"
                    :fields="fields"
                    style="height: calc(100vh - 328px)"
                >
                    <template #empty>
                        <NoresultTable/>
                    </template>

                    <template #cell(code)="data">
                        <span class="link-info">
                            {{ data.value }}
                        </span>
                    </template>

                    <template #cell(theory_percent)="data">
                        <span  v-if="data.value > 0">
                            {{ data.value }}%
                        </span>
                        <span  v-else>
                            -
                        </span>
                        </template>
                    
                        <template #cell(practice_percent)="data">
                            <span  v-if="data.value > 0">
                                {{ data.value }}%
                            </span>
                            <span  v-else>
                                -
                            </span>
                        </template>

                        <template #cell(actual_share_percent)="data">
                            <span  v-if="data.value > 0">
                                {{ data.value }}%
                            </span>
                            <span  v-else>
                                -
                            </span>
                        </template>
                       
                        <template #cell(created_at)="data">
                            <span >
                                {{ moment(get(data, 'value') * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                            </span>
                        </template>

                        <template #cell(status)="data">
                            <span class="badge rounded-pill text-uppercase" :class="get(label_topic, data.value+'.class', 'badge-soft-warning')">
                                {{ get(label_topic, data.value+'.text', 'Đang cập nhật') }}
                            </span>
                        </template>
        
                </b-table>

                </div>
            </b-col>
        </b-row>
    </div>
</template>