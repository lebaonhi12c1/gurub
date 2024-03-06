<script>
import {
    required,
    helpers,
    maxLength 
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import FadeContainer from "../../../components/ui/fade-container.vue";
import _isEmpty from 'lodash/isEmpty'
import get from "lodash/get";
import head from "lodash/head";
import NoresultTable from '../../../components/ui/noresult-table.vue';
import Category from '../../../services/category.service'
import Pagination from '../../../components/ui/pagination/pagination.vue'
import { label_category } from '../../../config/labels/label-category'
import moment from "moment"
import { reactive } from "vue";
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";
import config from '../../../config/filter/field/category-fields'
import Avatar from "../../../components/ui/avatar/avatar.vue"
import Text from "../../../components/ui/text.vue"
import GroupAvatar from "../../../components/ui/avatar/group-avatar.vue"
import CategoryService from '../../../services/category.service';
import RightSidebarCreate from '../../../components/ui/modal/right-sidebar-create.vue';
import ButtonHandle from '../../../components/ui/button-handle.vue';
export default {
    setup() {
        return reactive({
            get,
            label_category,
            moment,
            head
        })
    },

    data() {
        return {

            // loading
            isLoading: false,
            isLoadingStatistic: false,
            isCreate: false,
            //fields table
            fields: [
                { key: 'code', label: 'Mã giáo trình', stickyColumn: true, tdClass: 'bg-light text-info fw-medium text-nowrap', thClass: 'bg-light text-nowrap', thStyle: "min-width: 160px" },
                { key: 'name', label: 'Tên giáo trình', thClass: 'bg-light text-start text-nowrap', tdClass: 'text-nowrap text-secondary', thStyle: "min-width: 300px", },
                { key: 'total_courses', label: 'Số lượng khóa học', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', },
                { key: 'total_topics', label: 'Số lượng chủ đề', thClass: 'bg-light text-end text-nowrap', tdClass: 'text-nowrap text-end', },
                { key: 'status', label: 'Trạng thái', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center', },
                { key: 'action', label: 'Hành động', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center' }
            ],

            // data 
            items_data_table: [],
            createSidebarModal: false,

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
            orders: [],

            //form create
            form: {
                id: null,
                name: '',
                status: 'draft',
                code: '',
                description: '',
            },
            status: [{ text: 'Bản nháp', value: 'draft' }, { text: 'Xuất bản', value: 'publish' }],

            modeSideBar: {
                title: "Thêm danh mục / giáo trình",
                mode: "create"
            },
            
            isEdit: false,

            //validate
            v$: useVuelidate(),
            message_error_code: [],
            value_trace_code: '',
            value_trace_message_error_code: '',

        };
    },

    validations: {
        form: {
        
            name: {
                required: helpers.withMessage("Tên không được để trống", required),
                maxLength: helpers.withMessage("Tên không được quá 60 ký tự", maxLength(60)),
            },
        }
    },


    components: {
        PageHeader,
        FadeContainer,
        NoresultTable,
        Pagination,
        FilterContainer,
        Avatar,
        Text,
        GroupAvatar,
        RightSidebarCreate,
        ButtonHandle,
    },

    methods: {
        clearValidate() {
            this.v$.$reset()
        },

        _isEmpty(item) {
            return _isEmpty(item)
        },

        percent_capacity(value1, value2) {
            var percent = (Number(value1) - Number(value2));
            var result = (percent / value2) * 100;

            if (value2 == 0 || !value2) {
                return "warning"
            }

            if (!percent) {
                return "warning"
            }

            if (result > 0 && result <= 25) {
                return "danger"
            }

            if (result > 25 && result < 50) {
                return "warning"
            }


            if (result >= 50 && result <= 75) {
                return "info"
            }

            if (result > 75) {
                return "success"
            }


        },

        handleDelete(value) {
            
            Swal.fire({
                title: "Xóa giáo trình?",
                text: "Bạn có chắc sẽ xóa giáo trình này khỏi hệ thống?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#f46a6a",
                confirmButtonColor: "#34c38f",
                cancelButtonText: "Hủy",
                confirmButtonText: "Đồng ý",
            }).then(async (result) => {
                if (result.value) {
                    await CategoryService.removeCategory(value.id)
                    this.getDataTable()
                    return
                }
            });
        },
        handleEdit(data) {
            this.modeSideBar = {
                title: "Cập nhật danh mục / giáo trình",
                mode: "edit"
            }
            this.form = {
                id: data.id,
                name: data.name,
                status: data.status,
                code: data.code,
                description: data.description,
            }

            this.createSidebarModal = true
        },

        async getDataTable() {
            this.isLoading = true;

            this.items_data_table = await Category.getCategories({
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


        async setPage(value) {
            this.currentPage = value
        },


        setFilters(value) {
            this.filters = value.filters
            this.orders = value.orders
            if( get(this.items_data_table, "message")=="NO_CONTENT")
            {
                this.page.per_page = 25
            }

            if(value.callApi)
            {
                this.getDataTable()
            }
        },

        openCreate() {
            this.clearValidate()
            this.modeSideBar = {
                title: "Thêm danh mục / giáo trình",
                mode: "create"
            }
            this.clearFormCreate()
            this.createSidebarModal = true
        },

        closeCreate() {
            this.createSidebarModal = false
        },

        // convertTocode(str) {
        //     return str
        //             .toLowerCase()
        //             .trim()
        //             .normalize("NFD")
        //             .replace(/[\u0300-\u036f]/g, "")
        //             .replace(/[^a-z0-9]+/g, "-");
        // },

        async createCategory(value) {
            this.isCreate = true
            const res = await CategoryService.createCategory(value)
            this.isCreate = false
            return res
        },

        async editCategory(value) {
            this.isCreate = true
            const res = await CategoryService.updateCategory(value, this.form.id)
            this.isCreate = false
            return res
        },

        clearFormCreate() {
            this.form = {
                name: '',
                status: 'draft',
                code: '',
                description: '',
            }
        },

        async onSubmit(event) {
            event.preventDefault()

            this.v$.$touch();

            if (this.v$.$invalid) 
            {
                return;
            } 
            var res = null;
            if (this.modeSideBar.mode == "create") {
                res = await this.createCategory(this.form)
            }
            if (this.modeSideBar.mode == "edit") {
                res = await this.editCategory(this.form)
            }

            if(get(res, 'message') == 'INVALID_INPUT')
            {
                this.value_trace_message_error_code = get(res, 'data.errors')
                this.message_error_code = get(res, 'data.errors') 
                this.value_trace_code = this.form.code
                return
            }
            this.closeCreate()
            await this.getDataTable()
        },

        checkValidate(field) {
            if (field == 'name') {
                return this.form.name != "" ? true : false
            }

            if (field == 'code') {
                return this.form.code != "" ? true : false
            }
        }
    },


    watch: {
        "currentPage"() {
            this.getDataTable();
        },

        "page.per_page"() {
            if (!this.items_data_table || get(this.items_data_table, "message")=="NO_CONTENT") {
                return
            }
            this.getDataTable();
        },

        'form.code'(){
            if(this.value_trace_code == this.form.code)
            {
                this.message_error_code = this.value_trace_message_error_code
            }
            else
            {
                this.message_error_code = []
            }
        },

        createSidebarModal() {
            if(this.createSidebarModal == false) {
                this.isEdit = false
            }
        }

    },

    async mounted() {
        await this.getDataTable()
    },

    computed: {
        name_length() {
            return this.form.name.length
        },

        items_data_table_result(){
            return this.items_data_table
        }
    }
};
</script>

<template>
    <FadeContainer>
        <PageHeader title="Danh mục / giáo trình"  />
        <b-row>
            <b-col lg="12">
                <b-card no-body id="invoiceList">
                    <b-card-header class="border-0">
                        <div class="d-flex align-items-center">
                            <h5 class="card-title mb-0 flex-grow-1">Danh sách</h5>
                            <b-button variant="success" size="md" @click="openCreate">
                                <i class="mdi mdi-plus"></i>
                                Thêm
                            </b-button>
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
                            :hover="!_isEmpty(get(items_data_table_result, 'data.data'))" :items="get(items_data_table_result, 'data.data')" :fields="fields"
                            style="height: calc(100vh - 328px)">
                            <template #empty>
                                <NoresultTable />
                            </template>

                            <template #cell(code)="data">
                                <b-link class="link-info" :to="'/categories/' + data.item.id">
                                    <Text :text="data.item.code"/>
                                </b-link>
                            </template>

                            <template #cell(revenue)="data">
                                <span>
                                    {{ Number(get(data, 'value', 0)).toLocaleString('vn') }}
                                </span>
                            </template>

                            <template #cell(employees)="data">
                                <div class="d-flex align-items-center gap-2" v-if="get(data.value, 'length', 1) == 1">
                                    <Avatar size="xxs" :name="get(head(data.value), 'display_name', 'Đang cập nhật')"
                                        :src="get(head(data.value), 'avatar_url', '')" />
                                    <Text :text="get(head(data.value), 'display_name', 'Đang cập nhật')" />
                                </div>
                                <div class="d-flex align-items-center gap-2" v-else>
                                    <GroupAvatar size="xxs" :data="get(data, 'value', [])" />
                                </div>
                            </template>

                            <template #cell(status)="data">
                                <span class="badge rounded-pill text-uppercase py-1"
                                    :class="get(label_category, data.value + '.class', 'badge-soft-warning')">
                                    {{ get(label_category, data.value + '.text', 'Đang cập nhật') }}
                                </span>
                            </template>

                        
                            <template #cell(action)="data">
                                <ul class="list-inline hstack gap-2 mb-0 d-flex justify-content-center">
                                    <li class="list-inline-item" v-b-tooltip.hover="{ title: 'Xem chi tiết' }">
                                        <router-link :to="'/categories/' + data.item.id" class="text-primary d-inline-block">
                                            <i class="ri-eye-fill fs-16"></i>
                                        </router-link>
                                    </li>
                                    <li class="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover"
                                        data-bs-placement="top" v-b-tooltip.hover="{ title: 'Cập nhật' }">
                                        <span class="text-primary cursor-pointer d-inline-block edit-item-btn"
                                            @click="handleEdit(data.item)">
                                            <i class="ri-pencil-fill fs-16"></i>
                                        </span>
                                    </li>
                                    <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
                                        data-bs-placement="top" v-b-tooltip.hover="{ title: 'Xóa' }">
                                        <span class="text-danger cursor-pointer d-inline-block remove-item-btn"
                                            @click="handleDelete(data.item)">
                                            <i class="ri-delete-bin-5-fill fs-16"></i>
                                        </span>
                                    </li>
                                </ul>
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
                                    danh mục từ <b>{{ page.from }}</b>-<b>{{ page.to }}</b>
                                    trên tổng số <b>{{ page.total }}</b> danh mục.
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
    <right-sidebar-create :title="modeSideBar.title" :createSidebarModal="createSidebarModal"
        @update:createSidebarModal="createSidebarModal = $event">
        <b-form @submit="onSubmit">
            <div>
                <h6 class="mb-1">Các thông tin cơ bản</h6>
                <p class="text-muted mb-4" v-if="modeSideBar.mode == 'create'">
                    Nhập các thông tin cơ bản để tạo giáo trình mới
                </p>

                <p class="text-muted mb-4" v-if="modeSideBar.mode == 'edit'">
                    Nhập các thông tin cơ bản để cập nhật giáo trình
                </p>
            </div>
            <b-form-group 
                id="input-group-code" 
                label="Mã giáo trình:" label-for="input-code" 
                required>
                <b-form-input id="input-code"  v-model="form.code" placeholder="Nhập mã giáo trình (nếu có) hoặc để trống nếu không có mã nào." 
                    :disabled="modeSideBar.mode == 'edit'"
                    @change="isEdit=true"
                    :class="{'is-invalid': get(message_error_code, 'code')}"
                ></b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in get(message_error_code, 'code')" 
                    :key="index"
                >
            
                    {{ item}}
                </div>

            </b-form-group>
            <div class="mb-3">
                <div class="w-100 d-flex justify-content-between">
                    <label for="input-name">
                        Tên giáo trình:
                    </label>
                    
                    <div class="text-muted fs-12 align-self-end">
                        {{name_length}}/60
                    </div>
                </div>
                <b-form-input 
                    id="input-name" v-model="form.name" placeholder="Nhập tên" 
                    @input="v$.form.name.$touch" 
                    @keydown="isEdit=true"
                    :class="{ 'is-invalid': v$.form.name.$errors.length>0 }"
                ></b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in v$.form.name.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}
                </div>
            </div>
            <b-form-group id="input-group-status" label="Trạng thái:" label-for="input-status">
                <b-form-select id="input-status" v-model="form.status" :options="status"
                    @change="isEdit=true"
                ></b-form-select>
            </b-form-group>
            <b-form-group id="input-group-description" label="Mô tả:" label-for="input-description">
                <b-form-textarea id="textarea" v-model="form.description" placeholder="Mô tả..." rows="3"
                    max-rows="6"
                    @input="isEdit=true"    
                >
                </b-form-textarea>
            </b-form-group>
            <button-handle v-if="modeSideBar.mode == 'create'" type="submit" label="Tạo giáo trình" variant="success"
                :isLoading="isCreate" />
            <button-handle v-if="modeSideBar.mode == 'edit'" type="submit" label="Cập nhật giáo trình" variant="success"
                :is_disabled="!isEdit"
                :isLoading="isCreate" 
            />
        </b-form>
    </right-sidebar-create>
</template>
