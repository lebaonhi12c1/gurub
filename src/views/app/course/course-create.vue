<script>
import PageHeader from '../../../components/page-header.vue'
import fadeContainer from '../../../components/ui/fade-container.vue'
import TabInfoCourse from '../../../components/page/course/course-create/course-single/tab-info-course.vue';
import TabPriceCourse from '../../../components/page/course/course-create/course-single/tab-price-course.vue';
import TabTimeCourse from '../../../components/page/course/course-create/course-single/tab-time-course.vue';
import TabFinish from '../../../components/page/course/course-create/course-single/tab-finish.vue';
export default {
    components: { 
        fadeContainer,
        PageHeader, 
        TabInfoCourse,
        TabPriceCourse,
        TabTimeCourse,
        TabFinish,
    },
    data() {
        return {
            
            items: [
                { text: 'Khóa học', href: '/courses' },
                { text: 'Thêm', active: true },
            ],
            tab_list_header: [
                { label: 'Thông tin khóa học', icon: 'bx bx-book-open' },
                { label: 'Tuỳ chỉnh giá', icon: 'bx bx-edit-alt' },
                { label: 'Tuỳ chỉnh thời gian', icon: 'bx bx-calendar' },
                { label: 'Hoàn thành', icon: 'bx bx-check' },
            ],
            step: JSON.parse(sessionStorage.getItem( 'step_create_course' )) || 0,
        }
    },

    methods: {
        nextStep(value) {
            this.step = value
        },
    },
    watch: {
        step(value) {
            sessionStorage.setItem('step_create_course', JSON.stringify(value))
        },
    }
   
}
</script>

<template>
    <fade-container>
        <page-header title="Thêm khóa học" :items="items" />
        <b-card no-body>
            <b-card-body class="checkout-tab">
                <b-form>
                    <div class="step-arrow-nav mt-n3 mx-n3 mb-3">
                        <ul class="nav nav-pills nav-justified custom-nav" role="tablist">
                            <li class="nav-item" role="presentation"
                                v-for="(item, index) in tab_list_header" :key="index"
                            >
                                <button class="nav-link fs-15 p-3"
                                    :class="{ 'active': step == index }"
                                >
                                    <i class="fs-16 avatar-xs d-inline-flex align-items-center justify-content-center bg-soft-primary text-primary rounded-circle align-middle me-2"
                                        :class="item.icon"
                                    ></i>
                                    {{ item.label }}
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div class="tab-content">
                        <tab-info-course v-if="step==0" @nextStep="nextStep"/>
                        <tab-price-course v-if="step==1" @nextStep="nextStep"/>
                        <tab-time-course v-if="step==2" @nextStep="nextStep"/>
                        <tab-finish v-if="step==3"  @nextStep="nextStep"/>
                    </div>
                </b-form>
            </b-card-body>
        </b-card>
    </fade-container>
</template>

<style lang="scss" scoped></style>