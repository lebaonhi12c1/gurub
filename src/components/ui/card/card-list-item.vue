
<script>
import PlaceholderWraper from '../placeholder-wraper.vue'
import Avatar from '../avatar/avatar.vue';
import Text from '../text.vue'
    export default {
        components: { 
            PlaceholderWraper,
            Avatar,
            Text,
        },
        props: {
            class_custom_sub: {
                type: String,
                default: ''
            },
            data: {
                type: Object,
                default: () => {}
            },
            size:{
                type: String,
                default: 'sm'
            },

            isLoading: {
                type: Boolean,
                default: false,
            }
        }
    }
</script>

<template>
    <div class="d-flex align-items-center">
        <PlaceholderWraper :isLoading="isLoading">
            <Avatar :src="data.image" :name="data.name" :size="size"/>
        </PlaceholderWraper>
        <div class="ms-3 flex-grow-1">
            <h6 class="fs-14 mb-1">
                <PlaceholderWraper :isLoading="isLoading">
                    <Text :text="data.name"/>
                </PlaceholderWraper>
            </h6>
            <p class="mb-0 text-muted">
                <PlaceholderWraper :isLoading="isLoading">
                    <Text :css="class_custom_sub" :text="data.sub"/>
                </PlaceholderWraper>
            </p>
        </div>
        <div class="d-flex align-items-center">
            <h6 class="m-0">
                <PlaceholderWraper :isLoading="isLoading">
                    <router-link v-b-tooltip.hover="{title: 'Xem chi tiết'}" :to="data.route">
                        <i class='bx bxs-show'></i>
                    </router-link>
                </PlaceholderWraper>
            </h6>
        </div>
    </div>
</template>


<style lang="scss" scoped>

</style>