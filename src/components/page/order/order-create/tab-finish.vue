<script>

import animationData from "@/components/widgets/lupuorrc.json";
import Lottie from '../../../widgets/lottie.vue';
export default {
    components: {
        Lottie,
    },

    data() {
        return {
            defaultOptions: { animationData: animationData },
            order_id: sessionStorage.getItem('order_detail_route_id') || '',
        }
    },

    mounted() {
        sessionStorage.removeItem('order_create_step')
    },

    methods: {
        handleCreateNew() {
            this.$emit('nextStep', 1)
        }
    }
}
</script>

<template>
    <div>
        <div class="text-center">

            <div class="mb-4">
                <lottie colors="primary:#0ab39c,secondary:#405189" :options="defaultOptions" :height="120"
                    :width="120" />
            </div>
            <h5>Hoàn thành!</h5>
            <p class="text-muted">
                Chúc mừng bạn đã tạo đơn thành công, bấm <span class="link-info cursor-pointer" @click="handleCreateNew">vào đây</span> để thêm một đơn mới, xem chi tiết đơn vừa tạo bằng cách <router-link class="link-info" :to="'orders/' + order_id">đi đến chi tiết</router-link>, hoặc xem danh sách <router-link class="link-info cursor-pointer" to="/orders">tại đây</router-link>
            </p>
        </div>
    </div>
</template>



<style lang="scss" scoped></style>