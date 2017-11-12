<template lang="jade">
g(:transform="`translate(${coordinates.x},${coordinates.y})`")
    circle(r=4)
    text.label(:id="`text-${issue.number}`", x=8, y=5, transform="rotate(-30,0,0)") # {{ issue.number }}
        title {{ issue.title }}
</template>
<script>
export default {
    props: {
        issue: Object,
        ratios: Object
    },
    data () {
        return {}
    },
    computed: {
        coordinates () {
            return {x: this.issue.x*this.ratios.x, y: this.issue.y*this.ratios.y}
        }
    },
}
</script>
