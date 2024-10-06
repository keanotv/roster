<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import * as d3 from 'd3'
import { onMounted, ref } from 'vue'

const dataRef = ref(null)
const rosterStore = useRosterStore()
const personIdToNameMap = new Map<string, string>()

onMounted(() => {
  rosterStore.crunchHistoryData()
  rosterStore.people.forEach((person) =>
    personIdToNameMap.set(person.id.toString(), person.name)
  )
  // set the dimensions and margins of the graph
  const margin = { top: 80, right: 0, bottom: 300, left: 90 },
    width = 350 - margin.left - margin.right,
    height = rosterStore.people.length * 28 - margin.top - margin.bottom

  // append the svg object to the body of the page
  const svg = d3
    .select(dataRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  //Read the data
  // Labels of row and columns -> unique identifier of the column called 'dates' and 'member'
  const dates = Array.from(new Set(rosterStore.history.map((d) => d[0])))
  const member = Array.from(
    new Set(
      (rosterStore.history as Array<Array<string>>).map(
        (d) => personIdToNameMap.get(d[1])!
      )
    )
  )

  // Build X scales and axis:
  const x = d3.scaleBand().range([0, width]).domain(dates).padding(0.05)
  svg
    .append('g')
    .style('font-size', 12)
    .attr('transform', 'translate(0, -80)')
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll('text')
    .attr('y', 0)
    .attr('x', 12)
    .attr('dy', '5')
    .attr('transform', 'rotate(90)')
    .style('text-anchor', 'start')
    .style('font-weight', 'bold')
    .select('.domain')
    .remove()

  svg
    .append('g')
    .style('font-size', 12)
    .attr('transform', `translate(0, ${height/3 - 33})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll('text')
    .attr('y', 0)
    .attr('x', 12)
    .attr('dy', '5')
    .attr('transform', 'rotate(90)')
    .style('text-anchor', 'start')
    .style('font-weight', 'bold')
    .select('.domain')
    .remove()

  svg
    .append('g')
    .style('font-size', 12)
    .attr('transform', `translate(0, ${height/3*2 - 17})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll('text')
    .attr('y', 0)
    .attr('x', 12)
    .attr('dy', '5')
    .attr('transform', 'rotate(90)')
    .style('text-anchor', 'start')
    .style('font-weight', 'bold')
    .select('.domain')
    .remove()

  svg
    .append('g')
    .style('font-size', 12)
    .attr('transform', `translate(0, ${height - 6})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll('text')
    .attr('y', 0)
    .attr('x', 12)
    .attr('dy', '5')
    .attr('transform', 'rotate(90)')
    .style('text-anchor', 'start')
    .style('font-weight', 'bold')
    .select('.domain')
    .remove()

  svg.selectAll('.domain,.tick>line').remove()

  // Build Y scales and axis:
  const y = d3.scaleBand().range([height, 0]).domain(member).padding(0.05)
  svg
    .append('g')
    .style('font-size', 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select('.domain')
    .remove()

  // Build color scale
  const myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0, 1.5])

  // add the squares
  svg
    .selectAll()
    .data(rosterStore.history, function (d) {
      return d![0] + ':' + d![1]
    })
    .join('rect')
    .attr('x', function (d) {
      return x(d[0])
    })
    .attr('y', function (d) {
      return y(personIdToNameMap.get(d[1])!)
    })
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .style('fill', function (d) {
      return myColor(Number.parseInt(d[2]))
    })
    .style('opacity', function (d) {
      return (Number.parseInt(d[2]) + 0.08) * 0.7
    })
})
</script>

<template>
  <div class="grid place-items-center">
    <div ref="dataRef"></div>
  </div>
</template>
