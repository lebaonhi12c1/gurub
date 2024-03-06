<script>
import courseTyp from '../../../../config/type/course-typ'
import courseLevel from '../../../../config/type/course-level';

import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty';

import { convertNumber, converTimestampToDate } from '../../../../helpers/utils';

import {
    required,
    helpers,
    email, 
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import Swal from "sweetalert2";
import Avatar from '../../../ui/avatar/avatar.vue'
import FadeContainer from '../../../ui/fade-container.vue'
import PlaceholderWraper from '../../../ui/placeholder-wraper.vue'
import Text from '../../../ui/text.vue'
import RightSidebar from '../../../ui/modal/right-sidebar.vue';
import rightSidebarUpdate from '../../../ui/modal/right-sidebar-update.vue';
import rightSidebarCreate from '../../../ui/modal/right-sidebar-create.vue';
import CourseService from '../../../../services/course.service';
import NoresultTable from '../../../ui/noresult-table.vue';
import buttonHandle from '../../../ui/button-handle.vue';
import OrderService from '../../../../services/order.service';
import CardCourseTabManager from './card-course-tab-manager.vue';
    export default {
        // props: {
        //     isLoadingDetail: {
        //         type: Boolean,
        //         default: false
        //     },
        //     info_detail: {
        //         type: Object,
        //         default: () => ({})
        //     }
        // },

        components: {
            FadeContainer,
            Avatar,
            PlaceholderWraper,
            Text,
            RightSidebar,
            rightSidebarUpdate,
            rightSidebarCreate,
            NoresultTable,
            buttonHandle,
                CardCourseTabManager
        },

        data() {
            return {
                isLoadingCourses: false,
                isLoadingUpdateCourse: false,
                isLoadingAddContact: false,
                isLoadingUpdateContact: false,
                isLoadingRemoveContact: false,
                isLoadingDetail: false,
                info_detail: {},
                courseTyp,
                courseLevel,
                Swal,
                eventSidebarModal: false,
                updateSidebarModal: false,
                createSidebarModal: false,
                show_detail: '',
                search: '',
                courseInfoToUpdate:{},
                course_list: [],
                validator: useVuelidate(),
                formAddContact: {
                    name: '',
                    email: '',
                    phone: '',
                },
                formUpdateContact: {
                    id: '',
                    name: '',
                    email: '',
                    phone: '',
                },
                active: '',
                feilds: [
                    {
                        key: 'display_name',
                        thClass: 'bg-light',
                        label: 'Họ và tên',
                    },
                    {
                        key: 'email',
                        thClass: 'bg-light',
                        label: 'Email',
                    },
                    {
                        key: 'phone',
                        thClass: 'bg-light text-end text-nowrap',
                        tdClass: 'text-end',
                        label: 'Số điện thoại',
                    },
                    {
                        key: 'action',
                        thClass: 'bg-light text-center text-nowrap',
                        tdClass: 'text-center',
                        label: 'Hành động',
                    },
                ]
            }
        },

        validations: {
            search: {
                required: helpers.withMessage("Bạn hãy nhập giá trị để tiến hành tìm kiếm", required),
            },
            formAddContact: {
                name: {
                    required: helpers.withMessage("Tên là bắt buộc", required),
                },
                email: {
                    required: helpers.withMessage("Email là bắt buộc", required),
                    email: helpers.withMessage("Email không hợp lệ", email),
                },
                phone: {
                    required: helpers.withMessage("Số điện thoại là bắt buộc", required),
                    phone_validate: helpers.withMessage("Số điện thoại không hợp lệ", function(){
                        return this._checkPhone(this.formAddContact.phone)
                    })
                }
            },

            formUpdateContact: {
                name: {
                    required: helpers.withMessage("Tên là bắt buộc", required),
                },
                email: {
                    required: helpers.withMessage("Email là bắt buộc", required),
                    email: helpers.withMessage("Email không hợp lệ", email),
                },
                phone: {
                    required: helpers.withMessage("Số điện thoại là bắt buộc", required),
                    phone_validate: helpers.withMessage("Số điện thoại không hợp lệ", function(){
                        return this._checkPhone(this.formUpdateContact.phone)
                    })
                }
            },
        },

        computed: {
            customers: {
                get() {
                    return this._get(this.info_detail, 'courses', [])?.find(item => item.id === this.active)
                }
            }
        },

        mounted() {
            this.getOrderDetail();
        },

        methods: {
            _get(value, key, defaultValue = '') {
                return get(value, key, defaultValue)
            },

            _isEmpty(value) {
                return isEmpty(value)
            },
            _convertNumber(number) {
                return convertNumber(number);
            },

            _converTimestampToDate(timestamp) {
                return converTimestampToDate(timestamp);
            },

            _checkPhone(phone) {
                 // Sử dụng biểu thức chính quy để kiểm tra số điện thoại
                const phoneRegex = /^[0-9]{10}$/; // Regex để kiểm tra định dạng số điện thoại (10 chữ số)

                // Sử dụng test() để kiểm tra xem chuỗi có khớp với regex không
                return phoneRegex.test(phone);
            },
            async getCourses(course,filters = []) {
                this.isLoadingCourses= true
                const res = await CourseService.getCourses(
                    {
                        filters: filters.concat([
                            {
                                name: 'status',
                                operator: '=',
                                value: 'publish'
                            },
                            {
                                name: 'capacity_remain ',
                                operator: '>=',
                                value: this._get(course, 'contact.length',0)
                            }
                        ]) ,
                        pagination: {
                            page: 1,
                            limit: 200,
                        }
                    }
                )

                this.course_list = this._get(res, 'data.data', [])

                this.isLoadingCourses = false
            },

            async getOrderDetail() {
                this.isLoadingDetail = true;
                let response = await OrderService.getOrderDetail(this.$route.params.id);
                this.info_detail = this._get(response, 'data', {});
                this.isLoadingDetail = false;
                this.active = this._get(this.info_detail, 'courses[0].id');
            },
                
            openUpdateCourse(){

                this.eventSidebarModal = true
            },

            closeUpdateCourse(){
                this.eventSidebarModal = false
            },

            openUpdateCustomer(customer){
                this.formUpdateContact = {
                    id: customer.id,
                    name: customer.display_name,
                    email: customer.email,
                    phone: customer.phone
                }
                this.updateSidebarModal = true
            },

            closeUpdateCustomer(){
                this.updateSidebarModal = false
            },

            openCreateCustomer(){
                this.createSidebarModal = true
            },

            closeCreateCustomer(){
                this.createSidebarModal = false
            },

            handleUpdateCourse(course){
                this.courseInfoToUpdate = course
                this.openUpdateCourse()
                this.getCourses(course)
            },
            
            async removeContact(contact) {
                this.isLoadingRemoveContact = true
                const res = await OrderService.removeContact({
                    orderId: this.$route.params.id,
                    courseId: this.active,
                    contactId: contact.id,
                })
                this.isLoadingRemoveContact = false
                if(this._get(res, 'status') != 'success' ) return

                this.getOrderDetail();
            },

            handleDeleteCustomer(customer) {
                Swal.fire({
                    title: "Bạn có muốn xóa?",
                    text: "Điều này sẽ không thể hoàn tác!",
                    icon: "warning",
                    showCancelButton: true,
                    cancelButtonColor: "#f46a6a",
                    confirmButtonColor: "#34c38f",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.value) {
                        this.removeContact(customer)
                    }
                });
            },
            
            handleDeleteCourse(course) {
                Swal.fire({
                    title: "Bạn có muốn xóa?",
                    text: "Điều này sẽ không thể hoàn tác!",
                    icon: "warning",
                    showCancelButton: true,
                    cancelButtonColor: "#f46a6a",
                    confirmButtonColor: "#34c38f",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.value) {
                        this.removeCourse(course)
                    }
                });
            },

            async handleSearchCourse(){
                this.validator.search.$validate()
                if(this.validator.search.$invalid) return
                this.getCourses(this.courseInfoToUpdate,[
                    {
                        name: 'name',
                        operator: 'like',
                        value: this.search
                    }
                ])
            },


            async changeCourse(course) {
                this.isLoadingUpdateCourse = true
                const res = await OrderService.changeCourse({
                    orderId: this.$route.params.id,
                    courseId: this._get(this.courseInfoToUpdate, 'id')
                },{new_course_id: course.id})

                this.isLoadingUpdateCourse = false
                if(this._get(res, 'status') != 'success' ) return
                this.getOrderDetail();
                this.closeUpdateCourse()
            },

            async removeCourse(course) {
                this.isLoadingRemoveCourse = true
                const res = await OrderService.removeCourse({
                    orderId: this.$route.params.id,
                    courseId: course.id
                })
                this.isLoadingRemoveCourse = false

                if(this._get(res, 'status') != 'success' ) return
                this.getOrderDetail();
            },

            handleChangeCourse(course) {
                Swal.fire({
                    title: "Bạn có muốn thay đổi khóa khọc?",
                    text: "Điều này sẽ không thể hoàn tác!",
                    icon: "warning",
                    showCancelButton: true,
                    cancelButtonColor: "#f46a6a",
                    confirmButtonColor: "#34c38f",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.value) {
                        this.changeCourse(course)
                    }
                });
            },

            _clearFormAddContact(){
                this.formAddContact = {
                    name: '',
                    email: '',
                    phone: ''
                }
            },

            async handleAddContact() {
                this.validator.formAddContact.$validate()
                if(this.validator.formAddContact.$invalid) return
                this.isLoadingAddContact = true
                const res = await OrderService.addContact({
                    orderId: this.$route.params.id,
                    courseId: this.active,
                },this.formAddContact)

                this.isLoadingAddContact = false
                if(this._get(res, 'status') != 'success' ) return
                this._clearFormAddContact()
                this.getOrderDetail();
                this.closeCreateCustomer()

            },


            // _clearFormUpdateContact(){
            //     this.formUpdateContact = {
            //         id: '',
            //         name: '',
            //         email: '',
            //         phone: ''
            //     }
            // },


            async handleUpdateContact() {
                this.validator.formUpdateContact.$validate()
                if(this.validator.formUpdateContact.$invalid) return
                this.isLoadingUpdateContact = true
                const res = await OrderService.updateContact({
                    orderId: this.$route.params.id,
                    courseId: this.active,
                    contactId: this.formUpdateContact.id
                },this.formUpdateContact)

                this.isLoadingUpdateContact = false

                if(this._get(res, 'status') != 'success' ) return
                this.getOrderDetail();
                this.closeUpdateCustomer()
            },


        }
    }
</script>

<template>
    <FadeContainer>
          <b-card no-body>
            <b-card-body>
                <h5 class="card-title mb-3">Quản lý thông tin đơn</h5>
                <b-row>
                    <b-col lg="3">
                        <div class="nav nav-pills flex-column gap-2 nav-pills-tab custom-verti-nav-pills text-center"
                            role="tablist" aria-orientation="vertical">
                            <div class="nav-link show d-flex align-items-center gap-2 py-3 cursor-pointer"
                                v-for="(item, index) in _get(info_detail, 'courses', [])" :key="index"
                                :class="{
                                    'active': active === _get(item,'id')
                                }"
                                @click="active = _get(item,'id')"
                            >
                                <div class="d-flex align-items-center gap-2">
                                    <div class="flex-shrink-0">
                                        <placeholder-wraper :isLoading="isLoadingDetail">
                                            <avatar :src="_get(courseTyp, _get(item, 'type', '') + '.logo', '')"
                                                :name="_get(item, 'name')" :thumbnail="true"
                                            />
                                        </placeholder-wraper>
                                    </div>
                                    <div class="d-flex flex-column">
                                        <placeholder-wraper :isLoading="isLoadingDetail">
                                            <div class="d-flex align-items-start gap-2">
                                                <Text :text="_get(item, 'name', '')" class="text-start"/>
                                            </div>
                                        </placeholder-wraper>
                                        <placeholder-wraper :isLoading="isLoadingDetail">
                                            <div class="d-flex align-items-center gap-2 fs-12">
                                                Hình thức:<Text :text="_get(item, 'method', '') == 'offline' ? 'Offline' : 'Online'"/>
                                            </div>
                                        </placeholder-wraper>
                                        <placeholder-wraper :isLoading="isLoadingDetail">
                                            <div class="d-flex align-items-center gap-2 fs-12">
                                                Cấp độ:<Text :text="_get(courseLevel,_get(item, 'level', ''))"/>
                                            </div>
                                        </placeholder-wraper>
                                    </div>
                                </div>
                                <ul class="list-inline hstack gap-2 mb-0 d-flex justify-content-center ms-auto">
                                    <li class="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover"
                                      data-bs-placement="top" v-b-tooltip.hover="{title: 'Sửa'}"
                                        @click="handleUpdateCourse(item)"
                                      >
                                      <!-- <b-link variant="text-primary" class="d-inline-block edit-item-btn" @click="editdata(data)">
                                        <i class="ri-pencil-fill fs-16"></i>
                                      </b-link> -->
                                      <div variant="text-primary" class="d-inline-block edit-item-btn"
                                      >
                                        <i class="ri-pencil-fill fs-16"></i>
                                      </div>
                                    </li>
                                    <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
                                      data-bs-placement="top" v-b-tooltip.hover="{title: 'Xóa'}"
                                        @click="handleDeleteCourse(item)"  
                                    >
                                      <b-link class="text-danger d-inline-block remove-item-btn">
                                        <i class="ri-delete-bin-5-fill fs-16"></i>
                                      </b-link>
                                    </li>
                                  </ul>
                            </div>
                        </div>
                    </b-col>
                    <b-col lg="9">
                        <div class="tab-content text-muted mt-3 mt-lg-0">
                            <div class="tab-pane fade active show" role="tabpanel"
                            >
                                <div class="d-flex align-items-center justify-content-between">
                                    <h6>Học viên</h6>
                                    <b-button variant="success"
                                        :disabled="!active"
                                        @click="openCreateCustomer"
                                    >
                                        <i class="ri-add-line"></i>
                                        Thêm
                                    </b-button>
                                </div>
                                <b-table bordered hover class="mt-3"
                                    :fields="feilds" 
                                    :items="_get(customers, 'contact', [])"
                                >
                                    <template #cell(action)="data">
                                        <ul class="list-inline hstack gap-2 mb-0 d-flex justify-content-center">
                                            <li class="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover"
                                              data-bs-placement="top" v-b-tooltip.hover="{title: 'Sửa'}"
                                                @click="openUpdateCustomer(data.item)"
                                              >
                                              <!-- <b-link variant="text-primary" class="d-inline-block edit-item-btn" @click="editdata(data)">
                                                <i class="ri-pencil-fill fs-16"></i>
                                              </b-link> -->
                                              <div variant="text-primary" class="d-inline-block edit-item-btn"
                                              >
                                                <i class="ri-pencil-fill text-primary fs-16"></i>
                                              </div>
                                            </li>
                                            <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
                                              data-bs-placement="top" v-b-tooltip.hover="{title: 'Xóa'}">
                                              <b-link class="text-danger d-inline-block remove-item-btn"
                                                @click="handleDeleteCustomer(_get(data, 'item'))"
                                              >
                                                <i class="ri-delete-bin-5-fill fs-16"></i>
                                              </b-link>
                                            </li>
                                          </ul>
                                    </template>
                                </b-table>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </b-card-body>
        </b-card>
    </FadeContainer>
    <right-sidebar :eventSidebarModal="eventSidebarModal" @update:eventSidebarModal="eventSidebarModal = $event" title="Sửa khóa học" width="45rem">
        <div class="d-flex align-items-start mb-3 gap-3">
            <div class="flex-1">
                <input type="text" class="form-control" placeholder="Tìm theo tên khóa học"
                    v-model="search"
                    :class="{
                        'is-invalid': validator.search.$errors.length > 0 
                    }"
                    @input="validator.search.$touch()"
                    @keydown.enter="handleSearchCourse"
                >
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in validator.search.$errors" 
                    :key="index"
                >
        
                    {{ item.$message }}
                </div>
            </div>
            <b-button variant="success"
                @click="handleSearchCourse"
            >
                Tìm
            </b-button>
            <b-button variant="primary"
                @click="getCourses"
            >
                Tất cả
            </b-button>
        </div>

        <div style="max-height: calc(100vh - 200px);"
        data-simplebar>
            <div v-for="(item, index) in course_list" :key="index"
                class="mb-3 p-3 border rounded"
            >
                <card-course-tab-manager :item="item"
                    :isLoadingCourses="isLoadingCourses"
                    @handleChangeCourse="handleChangeCourse"
                />
            </div>
            <NoresultTable v-if="course_list.length == 0 && !isLoadingCourses"/>
        </div>
    </right-sidebar>
    <right-sidebar-update :updateSidebarModal="updateSidebarModal" @update:updateSidebarModal="updateSidebarModal = $event" title="Sửa thông tin học viên">
        <b-form @submit="handleUpdateContact">
            <b-form-group id="input-group-name" label="Họ và tên:" label-for="input-name">
                <b-form-input id="input-name" placeholder="Nhập tên" min="0"
                    v-model="formUpdateContact.name"
                    :class="{ 'is-invalid': validator.formUpdateContact.name.$errors.length > 0 }"
                    @input="validator.formUpdateContact.name.$touch()"
                >
                </b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in validator.formUpdateContact.name.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}
                </div>
            </b-form-group>
            <b-form-group id="input-group-email" label="Email:" label-for="input-email">
                <b-form-input id="input-email" placeholder="Nhập email" min="0"
                    v-model="formUpdateContact.email"
                    :class="{ 'is-invalid': validator.formUpdateContact.email.$errors.length > 0 }"
                    @input="validator.formUpdateContact.email.$touch()"
                >
                </b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in validator.formUpdateContact.email.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}
                </div>
            </b-form-group>
            <b-form-group id="input-group-phone" label="Số điện thoại:" label-for="input-phone">
                <b-form-input id="input-phone" placeholder="Nhập số điện thoại" min="0"
                    v-model="formUpdateContact.phone"
                    :class="{ 'is-invalid': validator.formUpdateContact.phone.$errors.length > 0 }"
                    @input="validator.formUpdateContact.phone.$touch()"
                >
                </b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in validator.formUpdateContact.phone.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}
                </div>
            </b-form-group>
            <button-handle label="Cập nhật" variant="success" type="submit" :loading="isLoadingUpdateContact"/>
        </b-form>
    </right-sidebar-update>
    <right-sidebar-create :createSidebarModal="createSidebarModal" @update:createSidebarModal="createSidebarModal = $event" title="Thêm học viên">
        <b-form @submit="handleAddContact">
            <b-form-group id="input-group-name" label="Họ và tên:" label-for="input-name">
                <b-form-input id="input-name" placeholder="Nhập tên" min="0"
                    v-model="formAddContact.name"
                    :class="{ 'is-invalid': validator.formAddContact.name.$errors.length > 0 }"
                    @input="validator.formAddContact.name.$touch()"
                >
                </b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in validator.formAddContact.name.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}
                </div>
            </b-form-group>
            <b-form-group id="input-group-email" label="Email:" label-for="input-email">
                <b-form-input id="input-email" placeholder="Nhập email" min="0"
                    v-model="formAddContact.email"
                    :class="{ 'is-invalid': validator.formAddContact.email.$errors.length > 0 }"
                    @input="validator.formAddContact.email.$touch()"
                >
                </b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in validator.formAddContact.email.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}
                </div>
            </b-form-group>
            <b-form-group id="input-group-phone" label="Số điện thoại:" label-for="input-phone">
                <b-form-input id="input-phone" placeholder="Nhập số điện thoại" min="0"
                    v-model="formAddContact.phone"
                    :class="{ 'is-invalid': validator.formAddContact.phone.$errors.length > 0 }"
                    @input="validator.formAddContact.phone.$touch()"
                >
                </b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in validator.formAddContact.phone.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}
                </div>
            </b-form-group>
            <button-handle label="Thêm" variant="success" type="submit" :loading="isLoadingAddContact"/>
        </b-form>
    </right-sidebar-create>
    
</template>

<style lang="scss" scoped>
    .course-hover{
        &:hover{
            cursor: pointer;
            background-color: #f5f5f5;
            transition-duration: 200ms;
        }
    }
</style>