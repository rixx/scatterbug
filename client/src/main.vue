<template lang="jade">
.body(v-if="issues")
    .explanation Hi there
    .content
        svg(@click="handleIssue", ref="svg", @mousemove="dragIssue", @mouseup="stopDragging")
            g(v-for="issue in placedIssues", @mousedown="startDragging(issue)", :transform="`translate(${issue.x},${issue.y})`")
                circle(r=2)
                text # {{ issue.number }}
    .sidebar
        .list
            .element(v-for="issue in issues", v-if="!issue.x", @click="selectIssueFromList(issue)", :class="{active: issue === selectedIssue}")
                .number # {{ issue.number }}
                .title {{ issue.title }}
</template>
<script>
import api from 'lib/api'
import github from 'lib/github'
import url from 'url'
export default {
    data () {
        return {
            issues: null,
            selectedIssue: null,
            org: null,
            project: null,
            draggedIssue: null,
        }
    },
    mounted () {
        const url = window.location.pathname.split('/')
        this.project = url.pop()
        this.org = url.pop()
        Promise.all([
            github.getIssues(this.project, this.org),
            api.getIssues(this.project, this.org)
        ]).then(([issues, coordinates]) => {
            const coordinateMap = coordinates.reduce((acc, item) => {
                acc[item.id] = item
                return acc
            }, {})
            for (const issue of issues) {
                if (coordinateMap[issue.number]) {
                    issue.x = coordinateMap[issue.number].x
                    issue.y = coordinateMap[issue.number].y
                }
            }
            this.issues = issues
        })
    },
    computed: {
        placedIssues () {
            console.log(this.issues.filter((issue) => !!issue.x))
            return this.issues.filter((issue) => !!issue.x)
        }
    },
    methods: {
        selectIssueFromList (issue) {
            this.selectedIssue = issue
        },
        handleIssue (event) {
            if (this.selectedIssue) {
                this.relocateIssue(this.selectedIssue, event, true)
                this.selectedIssue = null
            }
        },
        startDragging (issue) {
            this.draggedIssue = issue
        },
        dragIssue (event) {
            if (this.draggedIssue)
                this.relocateIssue(this.draggedIssue, event)
        },
        stopDragging (event) {
            this.relocateIssue(this.draggedIssue, event, true)
            this.draggedIssue = null
        },
        relocateIssue(issue, event, save=false) {
            const svg = this.$refs.svg
            let point = svg.createSVGPoint()
            point.x = event.clientX
            point.y = event.clientY
            point = point.matrixTransform(svg.getScreenCTM().inverse())
            this.$set(issue, 'x', point.x)
            this.$set(issue, 'y', point.y)
            if (save)
                api.saveIssue(this.org, this.project, issue.number, issue.x, issue.y)
        }
    }
}
</script>
<style lang="stylus">
body
    font-family: 'Roboto'
    margin: 0
    padding: 0

.body
    display: grid
    height: 100vh
    grid-template-columns: auto 250px
    grid-template-rows: 200px auto
    grid-template-areas: "header header" "main sidebar"

    .explanation
        grid-area: header

    .content
        grid-area: main

    .sidebar
        grid-area: sidebar
        overflow-y: scroll
svg
    height: 100%
    width: 100%
    text
        font-size: 10px
.active
    background-color: red
</style>
