
<script>

import OrderService from '../../../services/order.service'

import { converTimestampToDate, convertNumber } from '../../../helpers/utils';

import statusOrder from '../../../config/status/status-order'

import courseTyp from '../../../config/type/course-typ';

import get from 'lodash/get';
import PlaceholderWraper from '../../../components/ui/placeholder-wraper.vue';
import Text from '../../../components/ui/text.vue';
import Avatar from '../../../components/ui/avatar/avatar.vue';
import TabManager from '../../../components/page/order/order-detail/tab-manager.vue';
export default {
    components: {
        Text,
        PlaceholderWraper,
        Avatar,
        TabManager,
    },
    data() {
        return {
            isLoadingDetail: false,
            statusOrder,
            courseTyp,
            info_detail: {
                id: 1,
                created_by: {
                    id: 58,
                    display_name: "Bà. Khưu Khánh",
                    phone: "(0167)598-0300",
                    email: "pthach@phuong.pro.vn",
                },
                approved_by: {
                    id: 1,
                    display_name: "Phí Điền",
                    phone: "+84-120-118-8519",
                    email: "ngo.an@gmail.com",
                },
                status: "cancelled",
                price: 847,
                vat: 773,
                payment_date: 1173157839,
                code: "9T2Ri3t2NO",
                created_at: 1164714198,
                updated_at: 1019521633,
                representative_id: {
                    id: 1,
                    display_name: "Phí Điền",
                    phone: "+84-120-118-8519",
                    email: "ngo.an@gmail.com",
                },
                courses: {},
            },
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
            ]
            
        };
    },

    

    computed: {
        customers: {
            get() {
                return this.getCustomers(this._get(this.info_detail, 'courses', []));
            }
        }
    },

    mounted() {
        this.getOrderDetail();
    },
    methods: {
        _get(obj, path, defaultValue='') {
            return get(obj, path, defaultValue);
        },

        _converTimestampToDate(timestamp) {
            return converTimestampToDate(timestamp);
        },

        _convertNumber(number) {
            return convertNumber(number);
        },
        async getOrderDetail() {
            this.isLoadingDetail = true;
            let response = await OrderService.getOrderDetail(this.$route.params.id);
            this.info_detail = this._get(response, 'data', {});
            this.isLoadingDetail = false;
        },
    },

}
</script>

<template>
    <div class="profile-foreground position-relative mx-n4 mt-n4">
        <div class="profile-wid-bg">
            <img src="@/assets/images/profile-bg.jpg" alt="" class="profile-wid-img" />
        </div>
    </div>
    <div class="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
        <b-row class="g-4">
            <b-col cols="auto">
                <div class="avatar-lg">
                    <img src="@/assets/images/order-image.png" alt="user-img" class="img-thumbnail rounded-circle"/>
                </div>
            </b-col>
            <b-col>
                <div class="p-2">
                    <h3 class="text-white mb-1">
                        <placeholder-wraper :isLoading="isLoadingDetail">
                            <Text :text="_get(info_detail, 'code')" />
                        </placeholder-wraper>
                    </h3>
                    <p class="text-white-75 d-flex align-items-center gap-2">
                        Ngày tạo: 
                        <placeholder-wraper :isLoading="isLoadingDetail">
                            <Text :text="_converTimestampToDate(_get(info_detail, 'created_at'))" />
                        </placeholder-wraper>
                    </p>
                    <!-- <div class="hstack text-white-50 gap-1">
                        <div class="me-2">
                            <i class="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>California, United
                            States
                        </div>
                        <div>
                            <i class="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>Themesbrand
                        </div>
                    </div> -->
                </div>
            </b-col>
            <b-col cols="12" lg="auto" class="order-last order-lg-0">
                <b-row class="text text-white-50 text-center">
                    <b-col lg="12" cols="4">
                        <div class="p-2 d-flex align-items-end flex-column">
                            <h3 class="text-white mb-1">
                                <placeholder-wraper :isLoading="isLoadingDetail">
                                    <b-badge variant="success">
                                        <Text :text="_convertNumber(_get(info_detail, 'price')) + 'đ'"/>
                                    </b-badge>
                                </placeholder-wraper>
                            </h3>
                            <p class="fs-14 mb-0 text-nowrap">Thành tiền</p>
                        </div>
                    </b-col>
                    <!-- <b-col lg="6" cols="4">
                        <div class="p-2">
                            <h4 class="text-white mb-1">1.3K</h4>
                            <p class="fs-14 mb-0">Following</p>
                        </div>
                    </b-col> -->
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
                                <span class="d-none d-md-inline-block">Quản lý đơn</span>
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
                        <div class="btn btn-success"><i class="ri-edit-box-line align-bottom"></i> Edit Profile</div>
                    </div> -->
                </div>
                <div class="tab-content pt-4 text-muted">
                    <div class="tab-pane active" id="overview-tab" role="tabpanel">
                        
                        <b-row>
                            <b-col lg="3">
                                <b-card no-body >
                                    <b-card-body >
                                        <h5 class="card-title mb-3">Thông tin</h5>
                                        <div class="table-responsive">
                                            <table class="table table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <th class="ps-0" scope="row">Mã đơn:</th>
                                                        <td class="text-muted">
                                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                                <Text :text="_get(info_detail, 'code', '')" css="text-break" />
                                                            </placeholder-wraper>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th class="ps-0" scope="row">Ngày tạo:</th>
                                                        <td class="text-muted">
                                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                                <Text :text="_converTimestampToDate(_get(info_detail, 'created_at', ''))" css="text-break" />
                                                            </placeholder-wraper>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th class="ps-0" scope="row">Trạng thái:</th>
                                                        <td class="text-muted">
                                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                                <div :class="_get(statusOrder, _get(info_detail, 'status', '') + '.class')"> 
                                                                    <Text :text="_get(statusOrder, _get(info_detail, 'status', '') + '.label')" css="text-break text-uppercase" />
                                                                </div>
                                                            </placeholder-wraper>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th class="ps-0" scope="row">VAT:</th>
                                                        <td class="text-muted">
                                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                                <Text :text="_convertNumber(_get(info_detail, 'vat', '')) + '%'" css="text-break"/>
                                                            </placeholder-wraper>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th class="ps-0" scope="row">Thành tiền:</th>
                                                        <td class="text-muted">
                                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                                <Text :text="_convertNumber(_get(info_detail, 'price', '')) + 'đ'" css="text-break text-danger fw-semibold"/>
                                                            </placeholder-wraper>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </b-card-body>
                                </b-card>

                            </b-col>
                            <b-col lg="9">
                                <b-row>
                                    <b-col lg="4">
                                        <b-card no-body >
                                        <b-card-body >
                                            <h5 class="card-title mb-4">Người đăng ký</h5>
                                            <div class="d-flex gap-3 mb-2">
                                                <avatar :src="_get(info_detail, 'representative_id.avatar_url')" :name="_get(info_detail, 'representative_id.display_name', '')" size="md"/>
                                               <div>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'representative_id.display_name', '')" css="text-break text-primary fw-medium"/>
                                                    </placeholder-wraper>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'representative_id.email', '')" css="text-break" />
                                                    </placeholder-wraper>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'representative_id.phone', '')" css="text-break" />
                                                    </placeholder-wraper>
                                               </div>
                                            </div>
                                        </b-card-body>
                                    </b-card>
                                    </b-col>
                                    <b-col lg="4">
                                        <b-card no-body >
                                        <b-card-body >
                                            <h5 class="card-title mb-4">Người tạo đơn</h5>
                                            <div class="d-flex gap-3 mb-2">
                                                <avatar :src="_get(info_detail, 'created_by.avatar_url')" :name="_get(info_detail, 'created_by.display_name', '')" size="md"/>
                                                <div>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'created_by.display_name', '')" css="text-break text-primary fw-medium"/>
                                                    </placeholder-wraper>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'created_by.email', '')" css="text-break" />
                                                    </placeholder-wraper>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'created_by.phone', '')" css="text-break" />
                                                    </placeholder-wraper>
                                               </div>
                                            </div>
                                        </b-card-body>
                                    </b-card>
                                    </b-col>
                                    <b-col lg="4">
                                        <b-card no-body >
                                        <b-card-body >
                                            <h5 class="card-title mb-4">Người duyệt đơn</h5>
                                            <div class="d-flex gap-3 mb-2">
                                                <avatar :src="_get(info_detail, 'approved_by.avatar_url')" :name="_get(info_detail, 'approved_by.display_name', '')" size="md"/>
                                                <div>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'approved_by.display_name', '')" css="text-break text-primary fw-medium"/>
                                                    </placeholder-wraper>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'approved_by.email', '')" css="text-break" />
                                                    </placeholder-wraper>
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="_get(info_detail, 'approved_by.phone', '')" css="text-break" />
                                                    </placeholder-wraper>
                                               </div>
                                            </div>
                                        </b-card-body>
                                    </b-card>
                                    </b-col>
                                </b-row>
                                <b-card no-body>
                                    <b-card-body>
                                        <h5 class="card-title mb-3">Danh sách các học viên</h5>
                                        <b-row>
                                            <b-col lg="12" v-for="(item, index) in _get(info_detail, 'courses')" :key="index">
                                                <div class="border-top mb-3"></div>
                                                <h6 class="d-flex align-items-center gap-2">Khóa: 
                                                    <div class="d-flex align-items-center gap-1">
                                                        <avatar :src="_get(courseTyp,_get(item, 'type') + '.logo')" :name="_get(item, 'type.name')" size="xxs"/> 
                                                        <div> {{_get(item, 'name')}}</div>
                                                    </div>
                                                </h6>
                                                <b-table bordered hover
                                                    :fields="feilds" 
                                                    :items="_get(item, 'contact')"
                                                >
                                                </b-table>
                                            </b-col>
                                        </b-row>
                                    </b-card-body>
                                </b-card>
                            </b-col>
                        </b-row>
                    </div>
                    <div class="tab-pane fade" id="activities" role="tabpanel">
                        <tab-manager :info_detail="info_detail" :isLoadingDetail="isLoadingDetail" @getOrderDetail="getOrderDetail"/>
                    </div>
                </div>
            </div>
        </b-col>
    </b-row>
</template>


<style lang="scss" scoped></style>