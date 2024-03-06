<script>
    export default {
        props: {
             isLoading: {
                type: Boolean,
                defautl: false,
             },

             label: {
                type: String,
                default: 'Xác nhận',
             },

             variant: {
                type: String,
                default: 'primary',
             },

             size: {
                type: String,
                default: 'md',
             },

             type: {
                type: String,
                default: 'button',
             },
             is_disabled: {
                type: Boolean,
                default: false,
             }
        },

        methods: {
            handle() {
                this.$emit('handler')
            }
        }
    }
    
</script>


<template>
    <b-button :variant="variant"
        style="height: 40px;"
        :size="size"
        :type="type"
        :disabled="is_disabled"
        @click="type=='submit' ? ()=>{} : handle()"
    >
        <span v-if="!isLoading">
            {{label}}
        </span>
        <div class="d-flex align-items-center gap-2 fs-12 mt-1"
            v-if="isLoading"
        >
            <b-spinner label="Loading..." style="width: 0.9rem; height: 0.9rem"></b-spinner>
            Loading...
        </div>
    </b-button>
</template>

<style lang="scss" scoped>

</style>