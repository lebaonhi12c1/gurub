<script>
import {
    required,
    helpers,
    maxLength,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

    
import Multiselect from "@vueform/multiselect"
import "@vueform/multiselect/themes/default.css"
import isEmpty from "lodash/isEmpty"
import get from "lodash/get"
import TopicService from "../../../../services/topic.service"
import NoresultTable from "../../../ui/noresult-table.vue"
import RightSidebarCreate from '../../../../components/ui/modal/right-sidebar-create.vue';
import ButtonHandle from '../../../../components/ui/button-handle.vue';
import Swal from "sweetalert2";
import moment from "moment"
import {label_topic} from "../../../../config/labels/label-topic"
import { getToastError } from "../../../../helpers/toast"
export default {
    props: {

    },
    data() {
        return {
            moment,
            isEmpty,
            get,
            label_topic,
            isLoading: false,
            valueMultiSelect: "Choice 2",
            isLoadingBtnSubmit: false,
            searchQuery: "",
            fields: [
                {
                    key: 'code',
                    label: 'Mã chủ đề',
                    thClass: 'bg-light text-end text-nowrap',
                    tdClass: 'text-end'
                },
                {
                    key: 'name',
                    label: 'Tên chủ đề',
                    thClass: 'bg-light text-start text-nowrap',
                    tdClass: 'text-start text-nowrap',
                },
                {
                    key: 'theory_percent',
                    label: 'Lý thuyết',
                    thClass: 'bg-light text-end text-nowrap',
                    tdClass: 'text-end',
                    sortable: true

                },
                {
                    key: 'practice_percent',
                    label: 'Thực hành',
                    thClass: 'bg-light text-end text-nowrap',
                    tdClass: 'text-end',
                    sortable: true
                },
                {
                    key: 'actual_share_percent',
                    label: 'Chia sẻ thực tế',
                    thClass: 'bg-light text-end text-nowrap',
                    tdClass: 'text-end',
                    sortable: true
                },
                {
                    key: 'created_at',
                    label: 'Ngày tạo',
                    thClass: 'bg-light text-end text-nowrap',
                    tdClass: 'text-end',
                    sortable: true
                },
                {
                    key: 'status',
                    label: 'Trạng thái',
                    thClass: 'bg-light text-center text-nowrap',
                    tdClass: 'text-center',
                    sortable: true

                },
                {
                    key: 'action',
                    label: 'Hành động',
                    thClass: 'bg-light text-center text-nowrap',
                    tdClass: 'text-center',
                },
            ],
            items_data_table: [],
            items_data_table_result: [],
            createSidebarModal: false,
            
            data_edit: {},
            editSidebarModel: false,

            modeSideBar: {
                title: "Thêm chủ đề",
                mode:"create" 
            },

            status: [{ text: ' Bản nháp', value: 'draft' }, { text: 'Xuất bản', value: 'publish' }],

            form: {
                index: null,
                name: '',
                status: 'draft',
                code: '',
                theory_percent: 0,
                practice_percent: 0,
                actual_share_percent: 0,
                description: '',
            },

            //validate
            v$: useVuelidate(),

            
        }
    },
    computed: {



    },

    validations: {
        form: {
        
            name: {
                required: helpers.withMessage("Tên không được để trống", required),
                checkDublicateName: helpers.withMessage("Tên không được trùng", function(value){
                    return this._checkDuplicateName(value, this.items_data_table)
                }),
                maxLength: helpers.withMessage("Tên chủ đề không quá 60 ký tự", maxLength(60)),
            },

            theory_percent: {
                required: helpers.withMessage("Phần trăm lý thuyết là bắt buộc", required),
                isNonNegative: helpers.withMessage("Phần trăm lý thuyết là số nguyên dương", function (value) {
                    return this.isNonNegative(value)   
                }),
                isLessThanOrEqualTo100: helpers.withMessage("Phần trăm lý thuyết là số ≤ 100", function (value) {
                    return this.isLessThanOrEqualTo100(value)   
                }),
            },
            practice_percent: {
                required: helpers.withMessage("Phần trăm thực hành là bắt buộc", required),
                isNonNegative: helpers.withMessage("Phần trăm thực hành là số nguyên dương", function (value) {
                    return this.isNonNegative(value)   
                }),
                isLessThanOrEqualTo100: helpers.withMessage("Phần trăm thực hành là số ≤ 100", function (value) {
                    return this.isLessThanOrEqualTo100(value)   
                }),
            },

            actual_share_percent: {
                required: helpers.withMessage("Phần trăm chia sẽ thực tế là bắt buộc", required),
                isNonNegative: helpers.withMessage("Phần trăm chia sẽ thực tế là số nguyên dương", function (value) {
                    return this.isNonNegative(value)   
                }),
                isLessThanOrEqualTo100: helpers.withMessage("Phần trăm chia sẽ thực tế là số ≤ 100", function (value) {
                    return this.isLessThanOrEqualTo100(value)   
                }),
            },
        }
    },


    components: {
        Multiselect,
        NoresultTable,
        RightSidebarCreate,
        ButtonHandle,
    },

    methods: 
    {

        // validations:
        _checkDuplicateName(value, array){
            if (!value || !Array.isArray(array)) {
                return true; // Không có dữ liệu hoặc không phải là một mảng, vì vậy không thể kiểm tra trùng tên
            }

            if(this.modeSideBar.mode == 'create')
            {
                return !array.some(item => this.removeVietnameseDiacritics(item.name) === this.removeVietnameseDiacritics(value));
            }


            return !array.some((item) => {
                if (item.id === this.form.id) {
                    return false; // Bỏ qua mục này và không so sánh
                }
                return this.removeVietnameseDiacritics(item.name) === this.removeVietnameseDiacritics(value);
            })

            // return false
        },


        openCreate() {
            this.clearFormCreate()
            this.v$.$reset()
            this.modeSideBar= {
                title: "Thêm chủ đề",
                mode:"create" 
            }
            this.createSidebarModal = true
        },
        closeCreate() {
            
            this.createSidebarModal = false
            this.v$.$reset()
        },

        clearFormCreate() {
            this.form = {
                name: '',
                status: 'draft',
                code: '',
                theory_percent: 0,
                practice_percent: 0,
                actual_share_percent: 0,
                description: '',
            }
        },


        async createTopic(value) {
            this.isLoadingBtnSubmit = true
            await TopicService.createTopic(this.$route.params.id,value)
            await this.fetchData()
            this.isLoadingBtnSubmit = false
        },

        async editTopic(value) {
            this.isLoadingBtnSubmit = true
            await TopicService.updateTopic(value, this.$route.params.id, this.form.id)
            await this.fetchData()
            this.isLoadingBtnSubmit = false
        },

        async onSubmit(event) {
            event.preventDefault()
            this.v$.$touch();

            if (this.v$.$invalid) 
            {
                return;
            } 

            if (!this.checkValidate('sum'))
            {
                return getToastError('Tổng phần trăm lý thuyết, thực hành, chia sẽ thực tế không đúng quy định', 2500, 'top-left')
            }
            if(this.modeSideBar.mode == "create")
            {
                await this.createTopic(this.form)
            }
            if (this.modeSideBar.mode == "edit")
            {
                await this.editTopic(this.form)
            }

            this.closeCreate()
        },

        handleEdit(data){
            this.modeSideBar= {
                title: "Sửa chủ đề",
                mode:"edit" 
            }
            this.form = {
                id: data.id,
                name: data.name,
                status: data.status,
                code: data.code,
                description: data.description,
                theory_percent: data.theory_percent ,
                practice_percent: data.practice_percent ,
                actual_share_percent: data.actual_share_percent ,
            }
            this.createSidebarModal = true
        },

        async handleDelete(value) {
            Swal.fire({
                title: "Xóa chủ đề?",
                text: "Bạn có chắc sẽ xóa chủ đề này khỏi hệ thống?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#f46a6a",
                confirmButtonColor: "#34c38f",
                cancelButtonText: "Hủy",
                confirmButtonText: "Đồng ý",
            }).then(async (result) => {
                if (result.value) {
                    await TopicService.removeTopic(this.$route.params.id, value.id)
                    await this.fetchData()  
                }
            });
        },

        async fetchData() {
            this.isLoading = true;
            let respone = await TopicService.getTopics(this.$route.params.id, {

                pagination: {
                    page: 1,
                    limit: 100
                }
            })
            this.items_data_table = get(respone, 'data.data', [])
            this.items_data_table_result = this.items_data_table

            this.isLoading = false;

        },

        removeVietnameseDiacritics(str) {
            str= String(str)
            str = str.replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g, 'a');
            str = str.replace(/[èéẻẽẹêềếểễệ]/g, 'e');
            str = str.replace(/[ìíỉĩị]/g, 'i');
            str = str.replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o');
            str = str.replace(/[ùúủũụưừứửữự]/g, 'u');
            str = str.replace(/[ỳýỷỹỵ]/g, 'y');
            str = str.replace(/đ/g, 'd');
            return str;
        },

        checkValidate(field)
        {
            if(field == 'sum')
            {
                return Number(this.form.theory_percent) + Number(this.form.practice_percent) + Number(this.form.actual_share_percent) == 100  ? true : false
            }
            if(field == 'name')
            {
                return this.form.name ? true : false
            }

            if(field == 'theory_percent')
            {
                return get(this.form, 'theory_percent',0) == 0 &&
                    isNaN(this.form.theory_percent) || 
                    Number(this.form.theory_percent) > 100 ? false : true 
            }

            if(field == 'practice_percent')
            {
                return get(this.form, 'practice_percent',0) == 0 &&
                    isNaN(this.form.practice_percent) || 
                    Number(this.form.practice_percent) > 100 ? false : true 

            }

            if(field == 'actual_share_percent')
            {
                return get(this.form, 'actual_share_percent',0) == 0 &&
                    isNaN(this.form.actual_share_percent) || 
                    Number(this.form.actual_share_percent) > 100 ? false : true 
            }
        },

        isNonNegative (value) {
            return value >= 0;
        },

        isLessThanOrEqualTo100 (value) {
            return value <= 100;
        },
    },
    watch: {
    
        "valueMultiSelect"() {
            if (!this.valueMultiSelect) {
                this.valueMultiSelect = "Choice 1"
                return
            }

        },
        "searchQuery"() 
        {
            const search = this.removeVietnameseDiacritics(String(this.searchQuery).toLowerCase());
            this.items_data_table_result = this.items_data_table.filter((data) => {
                return (
                    this.removeVietnameseDiacritics(data.name).toLowerCase().includes(search) ||
                    this.removeVietnameseDiacritics(data.code).toLowerCase().includes(search) ||
                    this.removeVietnameseDiacritics(data.description).toLowerCase().includes(search)
                );
            });
        },

        "createSidebarModal"(){
            this.v$.$reset()
            if(!this.createSidebarModal)
            {
                this.v$.$reset()
                
                this.modeSideBar= {
                    title: "Thêm chủ đề",
                    mode:"create" 
                }
            }
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>

<template>
    <b-card no-body>
        <b-card-header>
            <div class="d-flex justify-content-between">
                <h5 class="d-flex align-items-center">
                    Chủ đề
                </h5>
                <div>
                    <b-button variant="primary" @click="openCreate">
                        Thêm chủ đề
                    </b-button>
                </div>
            </div>
        </b-card-header>
        <b-card-body class="bg-soft-light border border-dashed border-start-0 border-end-0">
            <div class="d-flex justify-content-between">
                <div class="search-box">
                    <input type="text" class="form-control search" style="width: 350px" v-model="searchQuery"
                        placeholder="Nhập thông tin tìm kiếm" />
                    <i class="ri-search-line search-icon"></i>
                </div>

                <div class="d-flex justify-content-end align-items-center gap-3">
                    <div>
                        Chế độ xem:
                    </div>
                    <div style="width: 230px">

                        <Multiselect no-results-text="Không tìm thấy giá trị nào" style="z-index: 100;"
                            class="form-control" v-model="valueMultiSelect" :close-on-select="true" :searchable="true"
                            :can-clear="true" :options="[
                                { value: 'Choice 1', label: 'Chi tiết' },
                                { value: 'Choice 2', label: 'Bảng' },
                            ]" />
                    </div>
                </div>
            </div>
        </b-card-body>
        <b-card-body>
            <div class="d-flex flex-column gap-3">
                <b-row>
                    <b-col>
                        <div v-if="valueMultiSelect == 'Choice 1'">
                            <div v-if="items_data_table_result.length > 0">
                                <b-card v-for="(item, index) in items_data_table_result" :key="index">
                                    <div class="d-flex flex-column gap-2">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6>
                                                {{ item.name }}
                                                ( <span>
                                                    <span v-if="(get(item, 'theory_percent', 0)) > 0">
                                                        {{ get(item, 'theory_percent', 0) }}% lý thuyết +
                                                    </span>
                                                    <span v-if="(get(item, 'practice_percent', 0)) > 0">
                                                        {{ get(item, 'practice_percent', 0) }}% thực hành
                                                    </span>
                                                    <span v-if="Number(get(item, 'actual_share_percent', 0)) > 0">
                                                        + {{ get(item, 'actual_share_percent', 0) }}% chia sẽ thực tế
                                                    </span>
                                                </span>)
                                            </h6>
                                            <div class="dropdown">
                                                <b-link class="text-reset" href="#" data-bs-toggle="dropdown" aria-haspopup="true"
                                                  aria-expanded="false">
                                                  <span class="text-muted fs-18">
                                                    <i class="mdi mdi-dots-horizontal"></i>
                                                  </span>
                                                </b-link>
                                                <div class="dropdown-menu dropdown-menu-end">
                                                  <b-link @click="handleEdit(item)" class="dropdown-item" href="#">Sửa</b-link>
                                                  <b-link  @click="handleDelete(item)" class="dropdown-item" href="#">Xóa</b-link>
                                                </div>
                                              </div>
                                        </div>
                                        <div>
                                            {{ get(item, 'description') }}
                                        </div>
                                    </div>
                                </b-card>
                            </div>
                            <div v-else>
                                <NoresultTable />
                            </div>
                        </div>
                        <div v-if="valueMultiSelect == 'Choice 2'">
                            <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar
                                style="height: 500px" :fields="fields"
                                :items="Array(25).fill().map((item) => ({ code: item }))">
                                <template v-for="(field, index) in fields" :key="`${get(field, 'key')}${index}`"
                                    v-slot:[`cell(${field.key})`]>
                                    <div class="placeholder placeholder-glow rounded w-100">
                                        &nbsp;
                                    </div>
                                </template>
                            </b-table>
                            <b-table v-else sticky-header striped bordered responsive data-simplebar show-empty
                                :hover="!isEmpty(items_data_table)" :items="items_data_table_result" :fields="fields"
                                style="height: 400px">
                                <template #empty>
                                    <NoresultTable />
                                </template>

                                <template #cell(code)="data">
                                    <span class="link-info">
                                        {{ data.item.id }}
                                    </span>
                                </template>

                                <template #cell(theory_percent)="data">
                                    <span v-if="data.value > 0">
                                        {{ data.value }}%
                                    </span>
                                    <span v-else>
                                        -
                                    </span>
                                </template>

                                <template #cell(practice_percent)="data">
                                    <span v-if="data.value > 0">
                                        {{ data.value }}%
                                    </span>
                                    <span v-else>
                                        -
                                    </span>
                                </template>

                                <template #cell(actual_share_percent)="data">
                                    <span v-if="data.value > 0">
                                        {{ data.value }}%
                                    </span>
                                    <span v-else>
                                        -
                                    </span>
                                </template>
                                
                                <template #cell(created_at)="data">
                                    <span >
                                        {{ moment(get(data, 'value', ) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                    </span>
                                </template>

                                <template #cell(status)="data">
                                    <span class="badge rounded-pill text-uppercase" :class="get(label_topic, data.value+'.class', 'badge-soft-warning')">
                                        {{ get(label_topic, data.value+'.text', 'Đang cập nhật') }}
                                    </span>
                                </template>

                                <template #cell(action)="data">
                                    <div class="d-flex align-items-center justify-content-center gap-3">
                                        <span 
                                            style="cursor: pointer;"
                                            variant="text-primary" class="text-primary d-inline-block edit-item-btn"
                                            @click="handleEdit(data.item)"
                                        >
                                            <i class="ri-pencil-fill fs-16"></i>
                                        </span>
                                        <span class="cursor-pointer text-danger d-inline-block remove-item-btn" @click="handleDelete(data.item)">
                                            <i class="ri-delete-bin-5-fill fs-16"></i>
                                        </span>
                                    </div>
                                </template>

                            </b-table>

                        </div>
                    </b-col>
                </b-row>
            </div>
        </b-card-body>
    </b-card>
    <right-sidebar-create :title="modeSideBar.title" :createSidebarModal="createSidebarModal" width="45rem"
        @update:createSidebarModal="createSidebarModal = $event">
        <b-form @submit="onSubmit">
            <div>
                <h6 class="mb-1">Các thông tin cơ bản</h6>
                <p class="text-muted mb-4 " v-if="modeSideBar.mode=='create'">
                    Nhập các thông tin cơ bản để tạo chủ đề mới
                </p>
                <p class="text-muted mb-4 " v-if="modeSideBar.mode=='edit'">
                    Nhập các thông tin cơ bản để cập nhật chủ đề
                </p>
            </div>
            <b-form-group id="input-group-name" :label="'Tên chủ đề: (' + form.name.length + '/60)'" label-for="input-name">
                <b-form-input 
                    id="input-name" 
                    v-model="form.name" 
                    placeholder="Nhập tên" 
                    aria-describedby="input-name-feedback" 
                    @input="v$.form.name.$touch" 
                    :class="{ 'is-invalid': v$.form.name.$errors.length>0 }"
                ></b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in v$.form.name.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}
                </div>
            </b-form-group>
                <b-row>
                    <b-col>
                        <b-form-group 
                            id="input-group-number" 
                            label="Lý thuyết (%):" 
                            label-for="input-theory_percent"
                        >

                            <b-form-input 
                                type="number"
                                id="input-theory_percent" 
                                placeholder="Lý thuyết (%)" 
                                v-model="form.theory_percent" 
                                aria-describedby="input-theory_percent-feedback" 
                                @input="v$.form.theory_percent.$touch" 
                                :class="{ 'is-invalid': v$.form.theory_percent.$errors.length>0 }"
                            ></b-form-input>
                            <div 
                                class="invalid-feedback" 
                                v-for="(item, index) in v$.form.theory_percent.$errors" 
                                :key="index"
                            >
                        
                                {{ item.$message }}
                            </div>
                        </b-form-group>

                    </b-col>
                    <b-col>
                        <b-form-group id="input-group-practice_percent" label="Thực hành (%):" label-for="input-practice_percent">
                            <b-form-input 
                                id="input-practice_percent" 
                                type="number"
                                placeholder="Thực hành (%)" 
                                v-model="form.practice_percent" 
                                aria-describedby="input-practice_percent-feedback" 
                                @input="v$.form.practice_percent.$touch" 
                                :class="{ 'is-invalid': v$.form.practice_percent.$errors.length>0 }"
                            ></b-form-input>
                            <div 
                                class="invalid-feedback" 
                                v-for="(item, index) in v$.form.practice_percent.$errors" 
                                :key="index"
                            >
                        
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group id="input-group-actual_share_percent" label="Chia sẽ thực tế (%):" label-for="input-actual_share_percent">
                            <b-form-input 
                                id="input-actual_share_percent"
                                type="number"
                                placeholder="Chia sẽ thực tế (%)" 
                                v-model="form.actual_share_percent" 
                                required
                                aria-describedby="input-actual_share_percent-feedback" 
                                @input="v$.form.actual_share_percent.$touch" 
                                :class="{ 'is-invalid': v$.form.actual_share_percent.$errors.length>0 }"
                            ></b-form-input>
                            <div 
                            class="invalid-feedback" 
                                v-for="(item, index) in v$.form.actual_share_percent.$errors" 
                                :key="index"
                            >
                        
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
                <div class="fs-12 mb-2 mt-n2" 
                    v-if="!checkValidate('sum')">
                    * Lưu ý: Tổng phần trăm lý thuyết, thực hành, chia sẽ thực tế phải bằng 100
                </div>
            <b-form-group id="input-group-status" label="Trạng thái:" label-for="input-status">
                <b-form-select id="input-status" v-model="form.status" :options="status"></b-form-select>
            </b-form-group>
            <b-form-group id="input-group-description" label="Mô tả:" label-for="input-description">
                <b-form-textarea id="textarea" v-model="form.description" placeholder="Mô tả..." rows="5"
                    max-rows="6"></b-form-textarea>
            </b-form-group>
            <button-handle 
                v-if="modeSideBar.mode=='create'" 
                type="submit" 
                label="Tạo giáo trình" 
                style="cursor:pointer"
                variant="success" 
                :isLoading="isLoadingBtnSubmit" 
            />
            <button-handle 
                v-if="modeSideBar.mode=='edit'" 
                type="submit" 
                label="Sửa giáo trình" 
                style="cursor:pointer"
                variant="success" 
                :isLoading="isLoadingBtnSubmit" 
            />
        </b-form>
    </right-sidebar-create>

</template>