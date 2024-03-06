
<script>
    export default {
        props: {
            none_title: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: '',
            },
        }
    }
</script>

<template>
    <b-card no-body>
        <b-card-header class="d-flex align-items-center"
            v-if="!none_title"
        >
            <h6 class="card-title mb-0 flex-grow-1">
                {{ title }}
            </h6>
        </b-card-header>
        <b-card-body>
            <slot/>
        </b-card-body>
    </b-card>
</template>

<style lang="scss" scoped>

</style>