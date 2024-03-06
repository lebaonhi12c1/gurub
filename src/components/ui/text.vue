
<script>

export default {
    props: {
        text: {},
        css: {
            type: String,
            default: ''
        },
        truncate: {
            type: Boolean,
            default: false,
        },
    },
    setup () {
        return {}
    },

    methods: {
         _isEmpty(value) {
            if (value === undefined || value === null) {
                return true;
            }
            if (typeof value === 'string' && value.trim() === '') {
                return true;
            }
            if (Array.isArray(value) && value.length === 0) {
                return true;
            }
            if (typeof value === 'object' && Object.keys(value).length === 0) {
                return true;
            }
            return false;
        },

        checkLabel(label){
            if(this._isEmpty(label)){
                return 'Đang cập nhật'
            }
            return label
        }
    }
}
</script>

<template>
    <div
        :class="`${css}`"
    >
        <div
            class="d-flex align-item-center gap-1"
            :class="{
                'italic': _isEmpty(text),
                'text-truncate': truncate
            }"
        >
            <slot/>
            {{ checkLabel(text) }}
        </div>
    </div>
</template>


<style lang="scss" scoped>

</style>