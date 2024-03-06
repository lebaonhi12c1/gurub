<script>
    import animationData from "@/components/widgets/msoeawqm.json";
    import Lottie from "@/components/widgets/lottie.vue";
    export default {
        props: {
            result_query_length: {
                type: Number,
                default: 0
            },
            text: {
                type: String,
                default: 'Xin lỗi! Không tìm thấy dữ liệu nào'
            },
            sub_text: {
                type: String,
                default: 'Chúng tôi đã tìm kiếm trong cơ sở dữ liệu của bạn, nhưng không thấy dữ liệu nào.'
            },
            size: {
                type: String,
                default: 'xl'
            }

        },
        components: {
            Lottie,
        },

        data() {
            return {
                defaultOptions: {
                    animationData: animationData
                },
                
            }
        }
    }
</script>


<template>
    <div class="noresult" style="display: none" :class="{ 'd-block': result_query_length == 0 }" v-if="size == 'xl'">
        <div class="text-center">
            <lottie class="avatar-xl" colors="primary:#121331,secondary:#08a88a"
                :options="defaultOptions" :height="75" :width="75" 
            />
            <h5 class="mt-2" >{{text}}</h5>
            <p class="text-muted mb-0">{{sub_text}}</p>
        </div>
        <div class="text-center mt-3"   v-if="size=='sm'"> 
            <lottie class="avatar-xl" colors="primary:#121331,secondary:#08a88a"
                :options="defaultOptions" :height="50" :width="50" 
            />
            <h6 class="mt-2 fs-12" >{{text}}</h6>
            <p class="mb-0 mt-n1 px-2" style="font-size: 0.65rem;">{{sub_text}}</p>
        </div>
    </div>
    <div class="noresult mt-3 mb-n2" style="display: none" :class="{ 'd-block': result_query_length == 0 }" v-if="size == 'md'">
        <div class="text-center">
            <lottie class="avatar-md mb-2" colors="primary:#121331,secondary:#08a88a"
                :options="defaultOptions" :height="60" :width="60" />
            <h5 class="mt-2 fs-14">{{text}}</h5>
            <p class="text-muted px-1 pb-0 fs-12">{{sub_text}}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>