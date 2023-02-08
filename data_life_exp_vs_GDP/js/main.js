/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { LEFT:100, RIGHT:10, TOP:5, BOTTOM:200}
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP -MARGIN.BOTTOM
let currentYear = 1800

const svg = d3.select("#chart-area").append("svg")
.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

const xAxisGroup = 	g.append("g")
.attr("class", "x axis")
.attr("transform", `translate(0,${HEIGHT})`)

const yAxisGroup = 	g.append("g")
.attr("class", "y axis")

d3.json("./data/data.json").then(function(data){
	
	


		// X Label
		g.append("text")
		.attr("class", "x axis-label")
		.attr("x", WIDTH/2)
		.attr("y", HEIGHT+110)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("GDP")
	
		// Y Label
		g.append("text")
		.attr("class", "y axis-label")
		.attr("x", -(HEIGHT/2))
		.attr("y", -60)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Life Expectancy")

	d3.interval(() => {
		update(data)
	}, 80)

	update(data)

})

function update(data) {

	currentYear += 1
	
	data.forEach( function(d){
		if (Number(d.year) == currentYear) {
			dataCurrentYear = d.countries
		}
	})

	dataCurrentYear.forEach(d => {
		d.income = Number(d.income)
		d.population = Number(d.population)
		d.life_exp = Number(d.life_exp)
	})

	dataCurrentYear = dataCurrentYear.filter(d => d.income != null && d.population != null && d.life_exp != null)

	const x = d3.scaleLog()
	.domain([100, 150000])
	.range([0,WIDTH])


	const y =d3.scaleLinear()
	.domain([0, 90])
	.range([HEIGHT, 0])


	const colorScale = d3.scaleOrdinal()
	.domain(dataCurrentYear.map(d => d.country))
	.range(d3.schemeSet3)

	//X-Axis
	const xAxisCall = d3.axisBottom(x) 
	.tickValues([400,4000,40000])//X Axis Genearation
	xAxisGroup.call(xAxisCall)
	.selectAll("text")
	  .attr("y", "10")
	  .attr("x", -5)
	  .attr("text-anchor", "end")
	  
  

	//Y-axis
	const yAxisCall = d3.axisLeft(y) //Y Axis Generation
	.ticks(3)
	.tickFormat(d => d + ' years')
	yAxisGroup.call(yAxisCall)

	const circles = g.selectAll("circle")
	.data(dataCurrentYear, d => d.country)

	circles.exit().remove()

	circles.attr("cx", d => x(d.income))
	.attr("cy", d => y(d.life_exp) )
	.attr("r", d => (Math.sqrt(d.population/Math.PI)/1000))
	

	circles.enter().append("circle")
	.attr("cx", d => x(d.income))
	.attr("cy", d => y(d.life_exp) )
	.attr("r", d => (Math.sqrt(d.population/Math.PI)/1000 ))
	.attr("fill",d => colorScale(d.continent))

	console.log(currentYear)
}