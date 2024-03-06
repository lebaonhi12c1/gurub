<script>
import TwoColumns from "./twocolumn";

export default {
        components: {
                TwoColumns
        },
};
</script>

<template>
        <div>
                <TwoColumns>
                        <slot />
                </TwoColumns>
        </div>
</template>
