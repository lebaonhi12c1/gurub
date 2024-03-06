<script>
export default {

    props: {
        eventModal: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '',
        },
    },

    computed: {
        show_modal: {
            get() {
                return this.eventModal;
            },
            set(value) {
                this.$emit("update:eventModal", value);
            },
        },
    },

    
}
</script>

<template>
    <b-modal v-model="show_modal" :title="title" title-class="text-black font-18" hide-footer
    body-class="p-4" header-class="p-3 bg-soft-info" class="v-modal-custom" centered>
        <slot/>
    </b-modal>
</template>

<style lang="scss" scoped></style>