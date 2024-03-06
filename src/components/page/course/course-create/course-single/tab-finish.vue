
<script>
import animationData from "@/components/widgets/lupuorrc.json";
import FadeContainer from '../../../../ui/fade-container.vue';
import Lottie from '../../../../widgets/lottie.vue';
export default {
    components: {
        FadeContainer,
        Lottie,
    },

    data() {
        return {
            defaultOptions: { animationData: animationData },
        }
    },

    mounted() {
        sessionStorage.removeItem('step_create_course')
    },

    methods: {
        handleCreateNew() {
            this.$emit('nextStep', 0)
        },
    }
}
</script>

<template>
    <fade-container>
        <div class="tab-pane" id="pills-finish" role="tabpanel" aria-labelledby="pills-finish-tab">
            <div class="text-center py-5">
                <div class="mb-4">
                    <lottie colors="primary:#0ab39c,secondary:#405189" :options="defaultOptions" :height="120" :width="120" />
                </div>
                <h5>Thành công!</h5>
                <p class="text-muted">
                    Chúc mừng bạn đã thêm khóa học thành công, bấm <span class="link-info cursor-pointer" @click="handleCreateNew">vào đây</span> để thêm một khóa học mới, hoặc xem danh sách <router-link class="link-info cursor-pointer" to="/courses">tại đây</router-link>
                </p>
            </div>
        </div>
    </fade-container>
</template>

<style lang="scss" scoped></style>