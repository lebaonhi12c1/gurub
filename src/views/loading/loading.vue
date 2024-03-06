<script>
        export default {
                mounted () {
                        this.$router.push('/dashboard')
                }        
        }
</script>


<template>
        <div class="fixed top-0 right-0 left-0 botton-0 d-flex align-items-center justify-content-center">
                <div id="preloader">
                        <div id="status">
                                <div class="spinner-border text-primary avatar-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                </div>
                        </div>
                </div>
        </div>
</template>

<style lang="scss" scoped>

</style>