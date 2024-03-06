<script>

import _get from "lodash/get"
import Text from "../../../components/ui/text.vue"
import CourseService from "../../../services/course.service";
import { label_chart_donut_right } from "../../../config/labels/chart-donut-right";
export default {
    components: {
        Text,
        // placeholderWraper
    },
    data() {
        return {
            isLoading: false,
            label_choose: {
                label: 'Địa điểm',
                value: 'zone'
            },
            label_chart_donut_right,
            series: [],
            chartOptions: {
                plotOptions: {
                    pie:
                    {
                        donut:
                        {
                            labels:
                            {
                                show: true,
                                value:
                                {
                                    show: true,
                                    // offsetY: -6,
                                    fontSize: "18px",
                                    color: "#343a40",
                                    formatter: function (val) {
                                        return (val);
                                    },
                                },
                                total:
                                {
                                    show: true,
                                    fontSize: "15px",
                                    // offsetY: 4,
                                    label: "Tổng cộng",
                                    color: "#9599ad",
                                    fontWeight: 400,
                                    formatter: function (w) {
                                        return w.globals.seriesTotals.reduce(function (a, b) {
                                            return a + b;
                                        }, 0)
                                    },
                                },
                            },
                        },
                    },
                },
                colors: this.getChartColorsArray('["--vz-success", "--vz-primary", "--vz-warning", "--vz-danger", "--vz-info", "--vz-primary"]'),
                dataLabels:
                {
                    enabled: true,
                },
                legend:
                {
                    show: false,
                },
                yaxis:
                {
                    labels:
                    {
                        formatter: function (value) {
                            return (value);
                        },
                    },
                },
                stroke:
                {
                    lineCap: "round",
                    width: 2,
                },
            },
            colors_item: this.getChartColorsArray('["text-success", "text-primary", "text-warning", "text-danger", "text-info", "text-primary"]'),
            data: {}

        };
    },

    methods: {
        setLabel(value) {
            this.label_choose = value
        },

        get(value, ref, _default) {
            return _get(value, ref, _default);
        },
        getChartColorsArray(colors) {
            colors = JSON.parse(colors);
            return colors.map(function (value) {
                var newValue = value.replace(" ", "");
                if (newValue.indexOf(",") === -1) {
                    var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
                    if (color) {
                        color = color.replace(" ", "");
                        return color;
                    } else return newValue;
                } else {
                    var val = value.split(',');
                    if (val.length == 2) {
                        var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                        rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                        return rgbaColor;
                    } else {
                        return newValue;
                    }
                }
            });
        },

        async getData() {
            this.isLoading = true;
            this.data = await CourseService.getReportQuantityCourse({
                "query": {
                    "from": this.get(this.time_store, 'from', 0),
                    "to": this.get(this.time_store, 'to', 0),
                    "view_type": this.label_choose.value
                }
            })

            this.series = this.get(this.data, 'data.statistical', []).map((item) => {
                return item.value
            })
            this.chartOptions.labels = this.get(this.data, 'data.statistical', []).map((item) => {
                return this.get(label_chart_donut_right, this.get(item, 'name'))
            })
            this.isLoading = false;

        },
    },

    computed: {
        'is_call_api'() {
            return [this.$store.state.dashboard.date_range, this.label_choose]
        },
        'time_store'() {

            return this.$store.state.dashboard.date_range
        }
    },

    watch: {
        'is_call_api': {
            handler: function () {
                // Sử dụng this.$nextTick để đảm bảo DOM đã được cập nhật
                this.$nextTick(() => {
                    if (this.time_store.from && this.time_store.to) {
                        this.getData()
                    }

                });
            },
            deep: true,

        }
    }


};
</script>

<template>
    <b-card no-body class="b-card card-height-100 height-donut-chart">
        <b-card-header class="align-items-center d-flex">
            <b-card-title class="mb-0 flex-grow-1 line-clamp-1">SỐ LƯỢNG KHÓA HỌC</b-card-title>
            <div class="flex-shrink-0 d-flex gap-2 align-items-center">
                <span class="fw-medium">
                    Xem theo:
                </span>
                <b-dropdown 
                    style="width: 98px;"
                    size="sm" variant="soft-primary"
                    :text="label_choose.label" 
                >
                    <b-dropdown-item
                        v-if="label_choose.value != 'type'"
                        @click="setLabel({ label: 'Loại', value: 'type' })"
                    >
                        Loại
                    </b-dropdown-item>

                    <b-dropdown-item
                        v-if="label_choose.value != 'zone'"
                        @click="setLabel({ label: 'Địa điểm', value: 'zone' })"
                    >
                        Địa điểm
                    </b-dropdown-item>
                    <b-dropdown-item
                        v-if="label_choose.value != 'method'"
                        @click="setLabel({ label: 'Hình thức', value: 'method' })"
                    >
                        Hình thức
                    </b-dropdown-item>
                    <b-dropdown-item
                        v-if="label_choose.value != 'level'"
                        @click="setLabel({ label: 'Mức độ', value: 'level' })"
                    >
                        Mức độ
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </b-card-header>

        <b-card-body>
            <div class=" self-center h-100">
                <div v-if="isLoading" class="d-flex w-100 h-100 justify-content-center align-items-center">
                    <div  class=" rounded-circle placeholder placeholder-glow mt-n5"
                        style="height: 250px; width: 250px"></div>

                </div>
                <div v-else >
                    <div v-if="get(data, 'data.statistical', []).length == 0" 
                        class="d-flex flex-column gap-5 h-100 mt-5 position-relative justify-content-center align-items-center self-center">
                        <img src="../../../assets/images/donut-chart-nodata.png" style="max-height: 230px;" class="mx-auto"
                            alt="Biểu đồ chưa có dữ liệu">
                        <h5 class="mt-3 ms-2 fs-16 text-center fw-medium" >
                            Chưa có khóa học nào để thống kê!!!
                        </h5>
                    </div>
                    <div v-else>
                        <div class="d-flex justify-content-center ">
                            <apexchart class="apex-charts" dir="ltr" type="donut" height="220" :series="series"
                                :options="chartOptions">
                            </apexchart>
                        </div>
                        <div class="mt-3" >
                            <div v-if="isLoading" class="rounded placeholder placeholder-glow w-100" style="height: 130px;">
                            </div>
                            <div v-else>
                                <div style="height: 200px" data-simplebar class="px-4">
                                    <div class="d-flex justify-content-between  py-3"
                                        v-for="(item, index) in get(data, 'data.statistical', [])" :key="index"
                                        :class="{ 'border-bottom border-bottom-dashed': index != get(data, 'data.statistical', []).length - 1 }">
                                        <p class="fw-medium mb-0 d-flex gap-1 align-items-center">
                                            <i class="ri-checkbox-blank-circle-fill align-middle me-2"
                                                :class="colors_item[index]"></i>
                                            <Text :text="get(label_chart_donut_right,get(item, 'name'))"></Text>
                                        </p>
                                        <div>
                                            <span class="text-muted">{{ get(item, 'value', 0).toLocaleString('vn') }} khóa
                                                học</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </b-card-body>
    </b-card>
</template>


<style scoped>
.height-donut-chart {
    height: 528px;
}
</style>