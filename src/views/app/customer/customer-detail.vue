<script>
import appConfig from "../../../../app.config";
import FadeContainer from "@/components/ui/fade-container.vue";
import Calendar from '../../../components/ui/calendar/calendar.vue';
import CardContainer from '../../../components/ui/card/card-container.vue';
import Avatar from '../../../components/ui/avatar/avatar.vue';
import PlaceholderWraper from '../../../components/ui/placeholder-wraper.vue';
import Text from '../../../components/ui/text.vue';
import InvoicesList from './invoices-list.vue';
import { label_course } from "../../../config/labels/label-course";

import CustomerService from '../../../services/customer.service';


import statusCustomer from "../../../config/status/status-customer";
import courseTyp from "../../../config/type/course-typ";
import contactType from "../../../config/type/contact-type";
import lesstionType from "../../../config/type/lesstion-type";

import _get from 'lodash/get'
import CardList from '../../../components/ui/card/card-list.vue';
import moment from 'moment';
import { converTimestampToDateHMS } from "../../../helpers/utils";

export default {
    page: {
        title: "Thông tin học viên",
        meta: [{ name: "description", content: appConfig.description }],
    },

    components: {
        FadeContainer,
        Calendar,
        CardContainer,
        Avatar,
        PlaceholderWraper,
        Text,
        CardList,
        InvoicesList,
    },
    data() {
        return {
            title: "Khách hàng",
            isLoading: false,
            isLoadingCourses: false,
            isLoadingLessions: false,
            customer_info: {},
            courses: [],
            statusCustomer,
            courseTyp,  
            label_course,
            contactType,
            lesstionType,
            events: [],
        }
    },

    methods: {
        _get(item, ref, auto = null) {
            return _get(item, ref, auto)
        },

        _converTimestampToDateHMS(timestamp) {
            return converTimestampToDateHMS(timestamp)
        },

        async getCustomerInfo() {
            this.isLoading = true;
            const res = await CustomerService.getCustomerDetail(this.$route.params.id);
            if(!res) return this.$router.push('/notfound')
            this.customer_info = this._get(res, 'data')
            this.isLoading = false
        },
        async getCourses() {
            this.isLoadingCourses = true
            const res = await CustomerService.getCustomerCourses(this.$route.params.id)
            this.courses = this._get( res, 'data', []).map(item =>{
                return {
                    name: item.name,
                    image: _get(courseTyp, item.type + '.logo',''),
                    sub: {
                        date: moment(item.start_date * 1000).format('DD/MM/YYYY') + ' - ' + moment(item.end_date * 1000).format('DD/MM/YYYY'),
                        method: _get(item, 'method'),
                        level: _get(item, 'level'),
                    },
                    route: '/courses/' + item.id
                }
            })
            this.isLoadingCourses = true
        },

        async getLessions() {
            this.isLoadingLessions = true
            const res = await CustomerService.getCustomerLessions(this.$route.params.id)
            this.events = this._get( res, 'data', []).map(item =>{
                return {
                    id: item.id,
                    title: item.name,
                    start: new Date(item.start_date * 1000),
                    end: new Date(item.end_date * 1000),
                    allDay: false,
                    className: this._get(lesstionType, item.type + '.class','bg-primary text-white'),
                    extendedProps: { 
                        ...item,
                        start_date: item.start_date,
                        end_date: item.end_date,
                    },
                }
            })
            this.isLoadingLessions = true
        }
    },

    mounted() {
        this.getCustomerInfo()
        this.getCourses()
        this.getLessions()
    }
};
</script>

<template>
    <FadeContainer>
        <div class="profile-foreground position-relative mx-n4 mt-n4">
            <div class="profile-wid-bg">
                <img src="@/assets/images/profile-bg.jpg" alt="" class="profile-wid-img" />
            </div>
        </div>
        <div class="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <b-row class="g-4">
                <b-col cols="auto">
                    <!-- <div class="avatar-lg">
                        <img src="@/assets/images/users/avatar-1.jpg" alt="user-img" class="img-thumbnail rounded-circle" />
                    </div> -->
                    <placeholder-wraper>
                        <avatar size="lg" bg="warning" thumbnail
                            :name="_get(customer_info, 'display_name', '')"
                        />
                    </placeholder-wraper>
                </b-col>
                <b-col>
                    <div class="p-2">
                        <placeholder-wraper :isLoading="isLoading">
                            <h3 class="text-white mb-1">
                                <Text :text="_get(customer_info, 'display_name', '')" />
                            </h3>
                        </placeholder-wraper>
                        <p class="text-white-75">
                            <placeholder-wraper :isLoading="isLoading">
                                <!-- <Text :text="_get(contactType,_get(customer_info, 'type')+'.label','')" /> -->
                                Học viên
                            </placeholder-wraper>
                        </p>
                        <div class="hstack text-white-50 gap-1">
                            <div class="me-2 d-flex align-items-center">
                                <i class="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                <placeholder-wraper :isLoading="isLoading">
                                    <Text :text="_get(customer_info, 'zone', '')" />
                                </placeholder-wraper>
                            </div>
                            <div>
                                <i class="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>Ads Plus
                            </div>
                        </div>
                    </div>
                </b-col>
                <b-col cols="12" lg="auto" class="order-last order-lg-0">
                    <b-row class="text text-white-50 text-center">
                        <b-col lg="6" cols="4">
                            <!-- <div class="p-2">
                                <h4 class="text-white mb-1">24.3K</h4>
                                <p class="fs-14 mb-0">Followers</p>
                            </div> -->
                        </b-col>
                        <b-col lg="6" cols="4">
                            <!-- <div class="p-2">
                                <h4 class="text-white mb-1">1.3K</h4>
                                <p class="fs-14 mb-0">Following</p>
                            </div> -->
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </div>

        <b-row>
            <b-col lg="12">
                <div>
                    <div class="d-flex profile-wrapper">
                        <ul class="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                            <li class="nav-item">
                                <b-link class="nav-link fs-14 active" data-bs-toggle="tab" href="#overview-tab" role="tab">
                                    <i class="ri-airplay-fill d-inline-block d-md-none"></i>
                                    <span class="d-none d-md-inline-block">Tổng quan</span>
                                </b-link>
                            </li>
                            <li class="nav-item">
                                <b-link class="nav-link fs-14" data-bs-toggle="tab" href="#activities" role="tab">
                                    <i class="ri-list-unordered d-inline-block d-md-none"></i>
                                    <span class="d-none d-md-inline-block">Danh sách thanh toán</span>
                                </b-link>
                            </li>
                            <!-- <li class="nav-item">
                                <b-link class="nav-link fs-14" data-bs-toggle="tab" href="#projects" role="tab">
                                    <i class="ri-price-tag-line d-inline-block d-md-none"></i>
                                    <span class="d-none d-md-inline-block">Projects</span>
                                </b-link>
                            </li>
                            <li class="nav-item">
                                <b-link class="nav-link fs-14" data-bs-toggle="tab" href="#documents" role="tab">
                                    <i class="ri-folder-4-line d-inline-block d-md-none"></i>
                                    <span class="d-none d-md-inline-block">Documents</span>
                                </b-link>
                            </li> -->
                        </ul>
                        <!-- <div class="flex-shrink-0">
                            <div class="btn btn-success"><i class="ri-edit-box-line align-bottom"></i> Cập nhật</div>
                        </div> -->
                        <b-row class="text text-white-50 text-center">
                            <b-col lg="6" cols="4">
                                <!-- <div class="p-2">
                                    <h4 class="text-white mb-1">24.3K</h4>
                                    <p class="fs-14 mb-0">Followers</p>
                                </div> -->
                                <a :href="`tel:${_get(customer_info, 'phone', '')}`">
                                    <b-button variant="danger" class="text-nowrap" v-b-tooltip.hover="{title: 'Gọi ngay'}">
                                        <i class='bx bx-phone fs-4 mt-1'></i>
                                    </b-button>
                                </a>
                            </b-col>
                            <b-col lg="6" cols="4">
                                <!-- <div class="p-2">
                                    <h4 class="text-white mb-1">1.3K</h4>
                                    <p class="fs-14 mb-0">Following</p>
                                </div> -->
                                <a :href="`mailTo:${_get(customer_info, 'email', '')}`">
                                    <b-button variant="success" class="text-nowrap" v-b-tooltip.hover="{title: 'Gửi mail'}">
                                        <i class='bx bx-envelope fs-4 mt-1' ></i> 
                                    </b-button>
                                </a>
                            </b-col>
                        </b-row>
                    </div>
                    <div class="tab-content pt-4 text-muted">
                        <div class="tab-pane active" id="overview-tab" role="tabpanel">
                            <b-row>
                                <b-col lg="3">
                                    <b-card no-body>
                                        <b-card-body>
                                            <h5 class="card-title mb-3">Thông tin</h5>
                                            <div class="table-responsive">
                                                <table class="table table-borderless mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <th class="ps-0" scope="row">Họ và tên:</th>
                                                            <td class="text-muted">
                                                                <placeholder-wraper :isLoading="isLoading">
                                                                    <Text :text="_get(customer_info, 'display_name', '')" css="text-break"/>
                                                                </placeholder-wraper>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th class="ps-0 text-nowrap" scope="row">Số điện thoại:</th>
                                                            <td class="text-muted">
                                                                <placeholder-wraper :isLoading="isLoading">
                                                                    <Text :text="_get(customer_info, 'phone', '')" css="text-break"/>
                                                                </placeholder-wraper>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th class="ps-0" scope="row">E-mail:</th>
                                                            <td class="text-muted">
                                                                <placeholder-wraper :isLoading="isLoading">
                                                                    <Text :text="_get(customer_info, 'email', '')" css="text-break"/>
                                                                </placeholder-wraper>
                                                            </td>
                                                        </tr>
                                                        <tr v-if="_get(customer_info, 'address') ">
                                                            <th class="ps-0" scope="row">Địa chỉ:</th>
                                                            <td class="text-muted">
                                                                <placeholder-wraper :isLoading="isLoading">
                                                                    <Text :text="_get(customer_info, 'address', '')" css="text-break"/>
                                                                </placeholder-wraper>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </b-card-body>
                                    </b-card>
                                    <card-list title="Danh sách khóa học" link_to_all="/courses"
                                        :isLoading="isLoading"
                                        :data="courses"
                                        is_custom_list_item="true"
                                    >
                                        <template #slot_list_item>
                                            <li class="list-group-item list-group-item-action" v-for="(data, index) in courses" :key="index">
                                                <div class="d-flex align-items-center">
                                                    <PlaceholderWraper :isLoading="isLoading">
                                                        <Avatar :src="data.image" :name="data.name" :size="lg"/>
                                                    </PlaceholderWraper>
                                                    <div class="ms-3 flex-grow-1">
                                                        <h6 class="fs-14 mb-1">
                                                            <PlaceholderWraper :isLoading="isLoading">
                                                                <Text :text="data.name"/>
                                                            </PlaceholderWraper>
                                                        </h6>
                                                        <p class="mb-0 text-muted">
                                                            <PlaceholderWraper :isLoading="isLoading">
                                                                <div class="d-flex gap-2 italic">
                                                                    <Text :text="_get(label_course, _get(data, 'sub.method')+'.text', 'Hình thức')"/>
                                                                    - <Text :text="_get(label_course, _get(data, 'sub.level')+'.text', 'Hình thức')"/>
                                                                </div>
                                                                <Text :text="_get(data, 'sub.date')" :css="'italic'"/>
                                                            </PlaceholderWraper>
                                                        </p>
                                                    </div>
                                                    <div class="d-flex align-items-center">
                                                        <h6 class="m-0">
                                                            <PlaceholderWraper :isLoading="isLoading">
                                                                <router-link v-b-tooltip.hover="{title: 'Xem chi tiết'}" :to="data.route">
                                                                    <i class='bx bxs-show'></i>
                                                                </router-link>
                                                            </PlaceholderWraper>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </li>
                                        </template>
                                    </card-list>
                                </b-col>
                                <b-col lg="9">
                                    <card-container  title="Lịch học">
                                        <calendar :events="events"/>
                                    </card-container>
                                </b-col>
                            </b-row>
                        </div>
                        <div class="tab-pane fade" id="activities" role="tabpanel">
                            <invoices-list/>
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>
    </FadeContainer>
</template>
