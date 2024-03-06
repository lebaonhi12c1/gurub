<script>
import fadeContainer from '../../../ui/fade-container.vue'
import CardReport from '../../../ui/card/card-report.vue'
import CardReportVer2 from '../../../ui/card/card-report-ver2.vue'
import { CountTo } from 'vue3-count-to'
import CategoryService from '../../../../services/category.service'
import { label_course } from '../../../../config/labels/label-course.js'

import _get from 'lodash/get'

import TopicListOverview from "../../../../components/page/category/category-detail/topic-list-overview.vue"
import PlaceholderWraper from '../../../ui/placeholder-wraper.vue'

export default {

    props: {
        data:{
            type: Object,
            default: () => ({})
        }
    },

    components: {
        fadeContainer,
        CardReport,
        CardReportVer2,
        TopicListOverview,
        CountTo,
        PlaceholderWraper
    },
    data() {
        return {
            label_course,
            staffs: [],
            isLoadingStatistic: false,
            items_data_statistic: [],

            lineCount: 0,
            isHiddenBtnSeeMore: false,

            description: this.get(this.data, 'data.description', ''),

            toggleInputDescription: false,

            disabledBtnSubmit: true,
        }
    },

    methods: {
        handleUpdate() {
            this.toggleInputDescription = !this.toggleInputDescription
            this.description = this.get(this.data,'data.description')
        },

        async fetchDataStatistic() 
        {
            this.isLoadingStatistic = true;
            this.items_data_statistic = await CategoryService.getstatistic(this.$route.params.id)

            this.isLoadingStatistic = false;

        },

        get(item, ref, _default)
        {
            let value = _get(item, ref, _default);

            if(!value)
            {
                value = _default
            }

            return value;
        },

        countLines() {
            if(!this.toggleInputDescription)
            {
                const textContainer = this.$refs.textContainer;
                const lines = textContainer.clientHeight / parseFloat(getComputedStyle(textContainer).lineHeight);
                this.lineCount = Math.floor(lines)
            }
        },

        async applyEdit() {
            const response = await CategoryService.updateCategory({
                name: this.get(this.data,'data.name'),
                code: this.get(this.data,'data.code'),
                status: this.get(this.data,'data.status'),
                description: this.description
            }, this.$route.params.id)

            this.toggleInputDescription = false

            if (!response)
            {
                this.$emit('reCallAPIGetDataDetail', {reCallAPIGetDataDetail: false})
                this.description = this.get(this.data,'data.description')
                return
            }


            this.description = this.get(response,'data.description')
            this.$emit('reCallAPIGetDataDetail',{reCallAPIGetDataDetail: true})

        },

        handleBtnCancel(){
            this.description = this.get(this.data,'data.description')
            this.toggleInputDescription = false

        }
      
    },

    mounted() {
        this.fetchDataStatistic()
    },

    watch:{
        "data": {
            handler: function() {
                // Sử dụng this.$nextTick để đảm bảo DOM đã được cập nhật
                this.$nextTick(() => {
                    this.countLines();
                    this.description = this.get(this.data,'data.description')

                });
            },
            deep: true,
        },

        "description": {
            handler: function() {
                if(this.description != this.get(this.data,'data.description'))
                {
                    this.disabledBtnSubmit = false;
                }
                else
                {
                    this.disabledBtnSubmit = true;
                }
            },
            deep: true,
        },

        "toggleInputDescription"() {
            if(!this.toggleInputDescription)
            {
                this.disabledBtnSubmit = true;
            }
        }

    }
}
</script>

<template>
    <fade-container>
        <b-row>
            <b-col>
                <b-row>
                    <b-col xl="6" md="12">
                        <card-report-ver-2 title="SỐ LƯỢNG KHÓA HỌC" sub_title="(Đang hoạt động / Tổng số)" :number="100">
                            <template #slot1>
                                <PlaceholderWraper :isLoading="isLoadingStatistic">
                                    <count-to :startVal="0" :endVal="get(items_data_statistic,'data.total_courses_publish',0)" :duration="1000"></count-to>
                                </PlaceholderWraper>/
                                <PlaceholderWraper :isLoading="isLoadingStatistic">
                                    <count-to :startVal="0" :endVal="get(items_data_statistic,'data.total_courses',0)" :duration="1000"></count-to>
                                </PlaceholderWraper>
                            </template>
                            <template #slot2>
                                <div class="flex-shrink-0 avatar-md">
                                    <div class="avatar-title bg-soft-info text-info fs-22 rounded">
                                        <i class='bx bx-list-check fs-1'></i>
                                    </div>
                                </div>
                            </template>
                        </card-report-ver-2>
                    </b-col>
                    <b-col xl="6" md="12">
                        <CardReport  title="SỐ LƯỢNG CHỦ ĐỀ" :isLoading="isLoadingStatistic" :number="get(items_data_statistic,'data.total_topics',0)">
                            <div class="flex-shrink-0 avatar-md">
                                <div class="avatar-title bg-soft-danger text-danger fs-22 rounded">
                                <i class="ri-shopping-bag-line"></i>
                                </div>
                            </div>
                        </CardReport>

                    </b-col>

                </b-row>
                <b-card no-body>
                    <b-card-header class="d-flex align-items-center">
                        <h6 class="card-title mb-0 flex-grow-1">
                            <ul class="
                                nav nav-tabs-custom
                                rounded
                                card-header-tabs
                                border-bottom-0
                            " role="tablist"
                            >
                                <li class="nav-item">
                                    <b-link class="nav-link active fs-13" data-bs-toggle="tab" href="#overview-category" role="tab">
                                        <i class="fas fa-home"></i>
                                        Tổng quan giáo trình
                                    </b-link>
                                </li>
                                <li class="nav-item">
                                    <b-link class="nav-link fs-13" data-bs-toggle="tab" href="#list-topic" role="tab">
                                        <i class="far fa-user"></i>
                                        Danh sách chủ đề
                                    </b-link>
                                </li>
                            </ul>
                        </h6>
                    </b-card-header>
                    <b-card-body>
                        <div class="table-responsive table-card p-3">
                            <div>
                            <div class="tab-content h-100" >
                                <div class="tab-pane active" style="min-height: 120px" id="overview-category" role="tabpanel">
                                    <div class=" d-flex flex-column justify-content-between">
                                        <div class="d-flex flex-column justify-content-between h-100">
                                            <div>
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <h5 class="mb-3 mt-2 d-block">
                                                        Mô tả
                                                    </h5>
                                                    <b-button size="sm"
                                                        class="mt-n3"
                                                        @click="handleUpdate"
                                                    >
                                                        Sửa
                                                    </b-button>
                                                </div>
                                                <div 
                                                    v-html="get(data,'data.description', 'Chưa mô tả...')" 
                                                    ref="textContainer" 
                                                    :class="{'line-clamp-10': !isHiddenBtnSeeMore && lineCount >= 10} "
                                                    v-if="!toggleInputDescription"
                                                ></div >
                                                <div v-else>
                                                    <b-form-textarea
                                                        id="textarea"
                                                        v-model="description"
                                                        placeholder="Mô tả..."
                                                        rows="6"
                                                    ></b-form-textarea>
                                                    <div class="d-flex justify-content-end align-items-center mt-3">
                                                        <b-button variant="danger" size="sm" class=" me-2" @click="handleBtnCancel()">
                                                            Hủy
                                                        </b-button>
                                                        <b-button variant="success" size="sm" @click="applyEdit()" :disabled="disabledBtnSubmit">
                                                            Áp dụng
                                                        </b-button>
                                                    </div>
                                                </div>     
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-center align-items-center mt-3">
                                            <b-button variant="primary" size="sm" v-if="lineCount >= 10 && !isHiddenBtnSeeMore && !toggleInputDescription" @click="isHiddenBtnSeeMore = !isHiddenBtnSeeMore">
                                                Xem thêm mô tả
                                            </b-button>
                                            <b-button variant="primary" size="sm"  v-if="lineCount >= 10 && isHiddenBtnSeeMore && !toggleInputDescription" @click="isHiddenBtnSeeMore = !isHiddenBtnSeeMore">
                                                Ẩn bớt mô tả
                                            </b-button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tab-pane" id="list-topic" role="tabpanel">
                                    <TopicListOverview />
                                </div>
                              </div>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
    </fade-container>
</template>



<style lang="scss" scoped></style>