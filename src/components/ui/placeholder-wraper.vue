
<script>
export default {
    props: {
        isLoading: {
            type: Boolean,
            default: false
        },
    },
    setup () {
        

        return {}
    },
}
</script>

<template>
    <div class="placeholder-glow"
        style="width: fit-content;"
    >
        <div
            :class="{
                'placeholder rounded': isLoading,
            }"
        >
            <slot/>
        </div>
    </div>
</template>


<style lang="scss" scoped>

</style>