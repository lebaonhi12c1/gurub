<script>
    import { CountTo } from "vue3-count-to";
import PlaceholderWraper from "../placeholder-wraper.vue";
    export default {
        props: {
            title: {
                type: String,
                default: '',
            },
            number: {
                type: Number,
                default: 0
            },
            isLoading: {
                type: Boolean,
                default: false,
            }
        },
        components: {
    CountTo,
    PlaceholderWraper
}
    }
</script>

<template>
    <b-card no-body class="card-animate overflow-hidden">
        <div class="position-absolute start-0 widget-pattern" style="z-index: 0;">
            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200"
                height="120">
                <path id="Shape 8" class="s0"
                    d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
            </svg>
        </div>
        <b-card-body style="z-index:1 ;">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1 overflow-hidden">
                    <p class="text-uppercase fw-medium text-truncate mb-3" style="opacity: 0.6;">
                        {{ title }}
                    </p>
                    <h4 class="fs-22 fw-semibold ff-secondary mb-0">
                        <PlaceholderWraper :isLoading="isLoading">
                            <count-to :startVal="0" :endVal="number" :duration="1000"></count-to>
                        </PlaceholderWraper>
                    </h4>
                </div>
                <div class="flex-shrink-0">
                    <slot/>
                </div>
            </div>
        </b-card-body>
    </b-card>
</template>

<style lang="scss" scoped>

</style>