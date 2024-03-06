<script>
export default {

    props: {
        updateSidebarModal: {
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
                return this.updateSidebarModal;
            },
            set(value) {
                this.$emit("update:updateSidebarModal", value);
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

<!-- 

<style>
    .offcanvas-header{
        background-color: #E1F5FB;
    }
    
    .offcanvas-title{
        color: #495057;
        
    }
</style> -->

