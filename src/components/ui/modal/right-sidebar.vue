<script>
export default {

    props: {
        eventSidebarModal: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '',
        },
        placement: {
            type: String,
            default: 'end',
        },
        width: {
            type: String,
            default: '31.25rem'
        }
    },

    computed: {
        show_modal: {
            get() {
                return this.eventSidebarModal;
            },
            set(value) {
                this.$emit("update:eventSidebarModal", value);
            },
        },
    },

    
}
</script>

<template>
    <b-offcanvas v-model="show_modal" :placement="placement" :title="title"
        :style="{
            'width': width
        }"
    >
        <slot/>
    </b-offcanvas>
</template>


<style>
    .offcanvas-header{
        border-bottom: 1px solid #CDD3D9;
    }
</style>
