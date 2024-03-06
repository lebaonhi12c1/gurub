<script>
import Avatar from './avatar.vue';

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        size: {
            type: String,
            default: 'xs'
        },
        number_of_show: {
            type: Number,
            default: 3
        }
    },

    components: {
        Avatar,
    },

    setup() {


        return {}
    }
}

</script>
<template>
    <div>
        <div class="avatar-group">
            <a href="javascript: void(0);" class="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top"
                v-for="(item, index) in data" :key="index"
                :class="{
                    'd-none': index > number_of_show
                }"
            > 
                <Avatar :src="item.avatar_url" 
                    :name="item.display_name" 
                    :size="size"
                />
            </a>
            <a href="javascript: void(0);" class="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top"
                v-if="data.length > number_of_show"
            >
                <Avatar :name="`${ data.length - 1 - number_of_show }+`"
                    :size="size"
                />
            </a>
        </div>
    </div>
</template>


<style lang="scss" scoped></style>