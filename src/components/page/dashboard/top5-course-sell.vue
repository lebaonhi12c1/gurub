
<script>
import courseLevel from '../../../config/type/course-level'
import courseTyp from '../../../config/type/course-typ'
import _get from 'lodash/get'
import moment from 'moment'
import Text from '../../ui/text.vue'
import zone_type from "../../../config/type/zone-type"

import DashboardService from "../../../services/dashboard.service"
export default {
    components: {
    Text
},

    data() {
        return {
            moment,
            DashboardService,
            courseTyp,
            zone_type,
            courseLevel,
            isLoading: false,
            data: []

        }
    },

    async mounted() {
        this.getData()
    },

    methods: {

        get(obj, path, defaultValue) {
            return _get(obj, path, defaultValue)
        },

        async getData() {
            this.isLoading = true
            const res = await DashboardService.getListTop5CourseRevenue(
                {   
                    "quantity_course": 5 // quantity_course là số lượng khóa học sẽ truyền vào để lấy ví dụ: 5 là 5 khóa học bán chạy nhất 
                }
            )
            this.data = this.get(res, 'data.data', [])
            this.isLoading = false
        },
    }
}
</script>

<template>
    <b-card no-body class="h-100">
        <b-card-header>
            <b-card-title class="mb-0 flex-grow-1 d-flex align-items-center gap-1">
                <span>
                    TOP 5 KHÓA HỌC BÁN CHẠY NHẤT
                </span>
                <div class="d-flex align-items-end">
                    <i 
                        class='bx bx-help-circle mt-auto text-warning cursor-pointer'
                        v-b-tooltip.hover="{title: `Chỉ Top 5 khóa học có doanh thu cao nhất trong 30 ngày gần nhất.`}"
                    ></i>
                </div>
            </b-card-title>
        </b-card-header>
        <b-card-body data-simplebar style="height: 750px">
            <div v-if="isLoading" class="d-flex flex-column gap-2">
                <div v-for="item in 3" :key="item" style="height: 230px;" class="w-100 rounded placeholder-glow placeholder"></div>
            </div>
            <div v-else>
                <div v-if="get(data, 'length', 0) != 0">
                    <b-card no-body class="card-height-100" style="min-height: 230px;" v-for="(item, index) of data" :key="index">
                        <b-card-body>
                            <div class="d-flex flex-column h-100">
                                <div class="d-flex mb-2">
                                    <!-- <div class="flex-shrink-0 me-3">
                                        <div class="avatar-sm bg-light p-1" >
                                            <span>
                                                <img :src="get(courseTyp, item.type+'.logo')" alt="" class="img-fluid p-1" />
                                            </span>
                                        </div>
                                    </div> -->
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h5 class="mb-1 fs-15 line-clamp-1 text-primary" >
                                                    <router-link 
                                                        to="/apps/projects-overview" v-b-tooltip.hover="{ title: `${item.name}` }"
                                                        class="link-primary text-uppercase">{{ item.name
                                                    }}</router-link>
                                                </h5>
                                                <p class="text-muted text-truncate-two-lines">
                                                    {{ get(courseTyp, item.type + '.label') }} - {{ get(courseLevel, item.level) }}
                                                </p>
                                            </div>
                                            <div class="d-flex flex-column align-items-end">
                                                <h5 class="mb-1  text-danger fs-15">
                                                    5,000,000đ
                                                </h5>
                                                <h6 class="d-flex flex-end fs-13 text-decoration-line-through">
                                                    6,000,000đ
                                                </h6>
        
                                            </div>
                                        </div>
        
                                    </div>
                                </div>
                                <div class="mt-n2 mb-1">
                                    <div class="d-flex mb-1">
                                        <div class="flex-grow-1 fs-12">
                                            <div>Địa điểm:</div>
                                        </div>
                                        <div class="flex-shrink-0">
                                            <div class="fw-medium fs-12">
                                                {{ get(zone_type, get(item, 'zone'), 'Đang cập nhật') }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex mb-2">
                                        <div class="flex-grow-1">
                                            <div>Doanh thu</div>
                                        </div>
                                        <div class="flex-shrink-0">
                                            <div class="fw-medium fs-15">
                                                {{ Number(item.revenue).toLocaleString('vn') }} vnđ
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-auto">
                                    <div class="d-flex mb-2">
                                        <div class="flex-grow-1">
                                            <div>Sức chứa</div>
                                        </div>
                                        <div class="flex-shrink-0">
                                            <div>
                                                <i class="ri-list-check align-bottom me-1 text-muted"></i>
                                                {{ item.capacity.used }}/{{ item.capacity.total }} 
                                            </div>
                                        </div>
                                    </div>
                                    <div class="progress progress-sm animated-progess">
                                        <div class="progress-bar bg-success" role="progressbar" aria-valuenow="34" aria-valuemin="0"
                                            aria-valuemax="100" :style="`width: ${100-(100/Number(item.capacity.total)*Number(item.capacity.used))}%`"></div>
                                    </div>
                                </div>
                            </div>
                        </b-card-body>
                        <b-card-footer class="bg-transparent border-top-dashed py-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex justify-content-center align-items-center">
                                    <span class="text-nowrap">
                                        Giảng viên: 
                                    </span>
                                    <span class="d-flex justify-content-center align-items-center ms-1 gap-1">
                                        <Text :text="get(item, 'instructor.display_name', 'Đang cập nhật')"/>
                                    </span>
                                </div>
                                <div class="text-muted text-nowrap">
                                    <i class="ri-calendar-event-fill me-1 align-bottom "></i>
                                    {{ moment(item.start_date*1000).format('DD/MM') }} - {{ moment(item.end_date*1000).format('DD/MM') }}
                                </div>
                            </div>
                        </b-card-footer>
                    </b-card>
                </div>
                <div class="d-flex align-items-center flex-column justify-content-center "
                    v-else
                    style="height: 600px !important;"
                >
                    <img src="../../../assets/images/server-error.png" alt=" object-contain" style="height:250px;">
                    <h6 class="fw-medium">
                        Không có khóa học nào 
                    </h6>
                </div>
            </div>
        </b-card-body>
    </b-card>
</template>