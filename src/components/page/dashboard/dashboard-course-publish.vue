
<script>
import SwiperCore, { Thumbs, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";

SwiperCore.use([Thumbs, Navigation, Pagination]);

import { label_course } from '../../../config/labels/label-course';
import courseTyp from "../../../config/type/course-typ";
import courseLevel from "../../../config/type/course-level";
import zoneType from "../../../config/type/zone-type";

import { getData, checkEmpty } from "../../../helpers/utils";

import PlaceholderWraper from '../../ui/placeholder-wraper.vue';
import CourseService from '../../../services/course.service';
import Avatar from '../../ui/avatar/avatar.vue';
export default {
    components: {
        Swiper,
        SwiperSlide,
        PlaceholderWraper,
        Avatar,
    },

    data() {
        return {
            isLoading: false,
            thumbsSwiper: null,
            label_course,
            courseTyp,
            courseLevel,
            zoneType,
            items: [],
        }
    },

    mounted() {
        this.getCourses()
    },

    methods: {
        _get(data, key, defaultValue = '--') {
            return getData(data, key,defaultValue);
        },

        _checkEmpty(data) {
            return checkEmpty(data)
        },
        async getCourses() {
            this.isLoading = true
            const res = await CourseService.getCourses({
                filters: [
                    {
                        name: 'status',
                        operator: '=',
                        value: 'publish'
                    },
                    {
                        name: 'stage',
                        operator: '=',
                        value: 'inprogress'
                    }
                ],
                orders: [
                    {
                        name: 'created_at',
                        value: 'desc'
                    }
                ],
                pagination: {
                    page: 1,
                    limit: 200
                }
            })

            this.items = this._get(res, 'data.data', [])

            this.isLoading = false
        }
    }
}
</script>

<template>
    <b-card no-body style="min-height: 232px;">
        <b-card-header class="d-flex align-items-center justify-content-between">
            <b-card-title class="mb-0 text-uppercase">
                Khóa học đang diễn ra
            </b-card-title>
            <div class="d-flex align-items-center gap-2">
                <b-button class="prev" size="sm" variant="primary">
                    <i class='bx bx-chevron-left fs-6 mt-1'></i>
                </b-button>
                <b-button class="next" size="sm" variant="primary">
                    <i class='bx bx-chevron-right fs-6 mt-1' ></i>
                </b-button>
            </div>
        </b-card-header>
        <b-card-body>
            <div class="swiper project-swiper">

                <swiper :slides-per-view="2" :space-between="16" :thumbs="{ swiper: thumbsSwiper }"
                    :navigation="{
                        prevEl: '.prev',
                        nextEl: '.next',
                    }"
                >
                    <swiper-slide v-for="(item, index) in items" :key="index">
                        <div class="swiper-slide">
                            <b-card no-body class="profile-project-card shadow-none profile-project-success mb-0">
                                <b-card-body class="p-4">
                                    <div class="d-flex">
                                        <div class="flex-grow-1 text-muted overflow-hidden">
                                            <h5 class="fs-15 mb-1">
                                                <b-link href="#" class="text-dark">
                                                    <placeholder-wraper :isLoading="isLoading">
                                                      <div class="text-break text-uppercase">  {{ _get(item, 'name') }}</div>
                                                    </placeholder-wraper>
                                                </b-link>
                                            </h5>
                                            <p class="text-muted text-truncate mb-0 d-flex gap-2">
                                                Sức chứa:
                                                <placeholder-wraper :isLoading="isLoading">
                                                        <span class="fw-semibold text-dark">
                                                            {{
                                                                _get(item, 'capacity.total')
                                                            }}
                                                        </span>
                                                </placeholder-wraper>
                                            </p>
                                        </div>
                                        <div class="flex-shrink-0 ms-2">
                                            <placeholder-wraper :isLoading="isLoading">
                                                <b-badge :variant="_get(label_course, _get(item , 'status') + '.variant')">
                                                    {{ _get(label_course, _get(item , 'status') + '.text') }}
                                                </b-badge>
                                            </placeholder-wraper>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <placeholder-wraper :isLoading="isLoading">
                                            {{ _get(courseTyp, _get(item, 'type') + '.label') }} - 
                                            {{ _get(courseLevel, _get(item, 'level')) }} - 
                                            {{ _get(zoneType, _get(item, 'zone'))}} - 
                                            {{ _get(item, 'method') == 'offline' ? 'Offline' : 'Online' }}
                                        </placeholder-wraper>
                                    </div>
                                    <div class="d-flex mt-4">
                                        <div class="flex-grow-1">
                                            <div class="d-flex align-items-center gap-2">
                                                <div>
                                                    <h5 class="fs-13 text-muted mb-0">
                                                        Giảng viên:
                                                    </h5>
                                                </div>
                                                <placeholder-wraper :isLoading="isLoading">
                                                   <div class="d-flex gap-2 align-items-center">
                                                        <avatar :image="_get(item, 'instructor.avatar_url')" :name="_get(item, 'instructor.display_name')" size="xxs"/>
                                                        {{ _get(item, 'instructor.display_name', 'Chưa có') }}
                                                   </div>
                                                </placeholder-wraper>
                                            </div>
                                        </div>
                                    </div>
                                </b-card-body>
                            </b-card>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
            <div class="d-flex align-items-center flex-column justify-content-center mt-n3"
                v-if="_checkEmpty(items)"
            >
                <img src="../../../assets/images/server-error.png" alt=" object-contain" style="height:141px;">
                <h6 class="fw-medium mt-2">
                    Không có khóa học nào đang diễn ra
                </h6>
            </div>
        </b-card-body>
    </b-card>
</template>

<style lang="scss" scoped></style>