<script>
    export default {
        props: {
            rows: {
                type: Number,
                default: 0
            },
            perPage: {
                type: Number,
                default: 10
            },
            currentPage: {
                type: Number,
                default: 1
            },
            is_disabled: {
                type: Boolean,
                default: false,
            }
        },
        
        computed: {
            current_page: {
                get() {
                    return this.currentPage
                },
                set(value) {
                    this.$emit("update:currentPage", value);
                },
            }
        }
    }
</script>


<template>
    <b-pagination
        :disabled="is_disabled"
        v-model="current_page"
        :total-rows="Number(rows)"
        :per-page="Number(perPage)"
    ></b-pagination>
</template>

<style lang="scss" scoped>

</style>
<!-- data() {
    return {
        currentPage: 1,
    }
},

methods: {
    setPage(value) {
        this.currentPage = value
    }
} -->
<!-- <Pagination :currentPage="currentPage" @update:currentPage="currentPage = $event" :rows="100" :perPage="20"/> -->
