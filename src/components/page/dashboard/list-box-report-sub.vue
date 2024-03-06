<script>
import { BriefcaseIcon, AwardIcon, ClockIcon } from '@zhuowenli/vue-feather-icons';

export default {
    setup() {
        return {
            projectsWidgets: [
                {
                    id: 1,
                    feaIcon: "briefcase",
                    feaIconClass: "primary",
                    label: "Khóa học",
                    counter: "825",
                    suffix: "",
                    badgeClass: "danger",
                    icon: "ri-arrow-down-s-line",
                    percentage: "5.02 %",
                    caption: "Khóa học được tạo ra trong khoảng thời gian được chọn",
                },
                {
                    id: 2,
                    feaIcon: "award",
                    feaIconClass: "warning",
                    label: "Giảng viên",
                    counter: "7522",
                    separator: ",",
                    suffix: "",
                    badgeClass: "success",
                    icon: "ri-arrow-up-s-line",
                    percentage: "3.58 %",
                    caption: "Giảng viên hoạt động trong khoảng thời gian được chọn",
                },
                {
                    id: 3,
                    feaIcon: "clock",
                    feaIconClass: "info",
                    label: "Học viên",
                    counter: "168",
                    suffix: "m",
                    badgeClass: "danger",
                    icon: "ri-arrow-down-s-line",
                    percentage: "10.35 %",
                    caption: "Học viên theo học trong khoảng thời gian được chọn",
                },
            ],
        };
    },
    components: {
        BriefcaseIcon,
        AwardIcon,
        ClockIcon
    },
};
</script>

<template>
    <b-row >
        <b-col cols="4" v-for="(item, index) of projectsWidgets" :key="index" >
            <b-card no-body class="card-animate">
                <b-card-body>
                    <div class="d-flex align-items-center height-item">
                        <div class="avatar-md flex-shrink-0">
                            <span class="avatar-title rounded-2 fs-2" :class="{
                                'bg-soft-primary text-primary': item.feaIconClass === 'primary',
                                'bg-soft-warning text-warning': item.feaIconClass === 'warning',
                                'bg-soft-info text-info': item.feaIconClass === 'info'
                            }">
                                <template v-if="item.feaIcon == 'briefcase'">
                                    <BriefcaseIcon size="40" class="text-primary"></BriefcaseIcon>
                                </template>
    
                                <template v-if="item.feaIcon == 'award'">
                                    <AwardIcon size="40" class="text-warning"></AwardIcon>
                                </template>
    
                                <template v-if="item.feaIcon == 'clock'">
                                    <ClockIcon size="40" class="text-info"></ClockIcon>
                                </template>
                            </span>
                        </div>
                        <div class="flex-grow-1 overflow-hidden ms-4 mt-2">
                            <div class="d-flex align-items-center gap-1 mt-2 mb-n2">
                                <p class="text-uppercase fw-medium text-muted text-truncate">
                                    {{ item.label }}
                                </p>
                                <i 
                                    class='bx bx-help-circle mt-n3 text-warning cursor-pointer'
                                    v-b-tooltip.hover="{title: `${item.caption}`}"
                                ></i>

                            </div>
                            <div class="d-flex align-items-center mb-3 mt-2">
                                <h4 class="fs-3 flex-grow-1 mb-0">
                                    <span class="counter-value">{{
                                        item.counter
                                    }}</span>
                                </h4>
                           
                            </div>
                        </div>
                    </div>
                </b-card-body>
            </b-card>
        </b-col>
    </b-row>
    
</template>


<style scoped>
.height-item{
    height: 100px;
}
</style>