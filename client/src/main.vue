<template lang="jade">
.body(v-if="issues")
    .explanation
        h2 Welcome to scatterbug!
        .info
            span.text This page can help you organize your GitHub issues. You can also 
            a.text(href="https://github.com/rixx/scatterbug") fork it 
            span.text on GitHub.
    .content
        svg(@click="handleIssue", ref="svg", @mousemove="dragIssue", @mouseup="stopDragging")
            defs
                radialGradient(id="RadialGradient2" cx="1" cy="1" fx="0.8" fy="1.2" r="1.3" spreadMethod="reflect")
                    stop(offset="20%",stop-color="#B34066")
                    stop(offset="80%",stop-color="#5CAA8D")
            rect(
                v-if="svgDimensions",
                x=81, y=0, :width="`${this.svgDimensions.x - 180}`", :height="`${this.svgDimensions.y - 71}`"
                fill="url(#RadialGradient2)"
            )
            path(
                v-if="svgDimensions",
                :d="`M ${this.svgDimensions.x - 100} ${this.svgDimensions.y - 70} V ${this.svgDimensions.y - 70} H 80 L 80 0`",
                fill="transparent",
                stroke="black",
            )
            text(x=-20, y=100,transform="rotate(-30)") Easy
            text(x=-100, y=200,transform="rotate(-30)") Normal
            text(x=-130, y=300,transform="rotate(-30)") Hm
            text(x=-190, y=400,transform="rotate(-30)") Oof
            text(x=-250, y=500,transform="rotate(-30)") How
            text(x=-280, y=670,transform="rotate(-30)") Now
            text(x=-130, y=760,transform="rotate(-30)") 3 days
            text(x=40, y=860,transform="rotate(-30)") 1 week
            text(x=240, y=980,transform="rotate(-30)") 2 weeks
            text(x=440, y=1090,transform="rotate(-30)") 1 month
            text(x=640, y=1210,transform="rotate(-30)") 3 months
            text(x=840, y=1310,transform="rotate(-30)") 1 year
            mappedIssue(v-if="ratios", v-for="issue in placedIssues", @mousedown.native="startDragging(issue)", :issue="issue", :ratios="ratios")
    .sidebar
        .list
            .element(v-for="issue in issues", v-if="!issue.x", @click="selectIssueFromList(issue)", :class="{active: issue === selectedIssue}")
                .number # {{ issue.number }}
                .title {{ issue.title }}
</template>
<script>
import api from 'lib/api'
import github from 'lib/github'
import MappedIssue from './mapped_issue'
import url from 'url'
export default {
    components: {
        MappedIssue,
    },
    data () {
        return {
            issues: null,
            selectedIssue: null,
            org: null,
            project: null,
            draggedIssue: null,
            ratios: null,
            svgDimensions: null,
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
            this.issues = []
            for (const issue of issues) {
                if (!issue.pull_request) {
                    if (coordinateMap[issue.number]) {
                        issue.x = coordinateMap[issue.number].x
                        issue.y = coordinateMap[issue.number].y
                    }
                    this.issues.push(issue)
                }
            }
            this.$nextTick(this.computeRatios)
        })
    },
    computed: {
        placedIssues () {
            return this.issues.filter((issue) => !!issue.x)
        },
    },
    methods: {
        computeRatios () {
            if (!this.$refs.svg) return {x: null, y: null}
            const rect = this.$refs.svg.getBoundingClientRect()
            const widthRatio = rect.width / 100
            const heightRatio = rect.height / 100
            this.ratios = {x: widthRatio, y: heightRatio}
            /* this.svgDimensions = {x: rect.width, y: rect.height} */
            this.$set(this, 'svgDimensions', {x:rect.width, y:rect.height})
        },
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
            const widthRatio = this.ratios.x
            const heightRatio = this.ratios.y

            this.$set(issue, 'x', event.offsetX/widthRatio)
            this.$set(issue, 'y', event.offsetY/heightRatio)
            if (save)
                api.saveIssue(this.org, this.project, issue.number, issue.x, issue.y)
        },
    }
}
</script>
<style lang="stylus">
body
    font-family: 'Roboto'
    margin: 0
    padding: 0
.explanation
    padding: 16px 32px
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
    text.label
        font-size: 14px
        font-weight: 500
    text
        user-select: none
    .stop1, .stop2, .stop3
        color: red
.sidebar
    display: flex
    flex-direction: column
    margin-bottom: 32px
    .list
        padding: 8px
        .element
            margin: 2px
            background-color: #efefef
            .number
                font-weight: 500
        .active
            background-color: #5caa8d
</style>
