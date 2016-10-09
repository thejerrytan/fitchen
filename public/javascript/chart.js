$(document).ready(function(){
	var url = "http://104.196.149.230:5000/data"
	var getData = function(chart) {
		var end   = new Date()
		var start = new Date()
		start.setMinutes(end.getMinutes()-1)
		$.ajax({
			url: url + '/' + start.toISOString() + '/' + end.toISOString(),
			success: function(data, textStatus, jqXHR) {
				// console.log(textStatus)
				var labels = []
				var series = []
				for(var i in data) {
					labels.push(moment(data[i].published_at).format('LTS'))
					series.push(data[i].data)
				}
				var chart_data = {
				  // A labels array that can contain any sort of values
				  labels: labels,
				  // Our series array that contains series objects or in this case series data arrays
				  series: [
					series
				  ]
				}
				// console.log(chart_data)
				// chart.update(chart_data)
			}
		})
	}
	// Create a new line chart object where as first parameter we pass in a selector
	// that is resolving to our chart container element. The Second parameter
	// is the actual data object.
	// var chart = new Chartist.Line('.ct-chart', {
	// 	labels:[], 
	// 	series:[],
	// 	plugins: [
	// 		Chartist.plugins.ctAxisTitle({
	// 			axisX: {
	// 				axisTitle: 'Time (s)',
	// 				axisClass: 'ct-axis-title',
	// 				offset: {
	// 					x: 0,
	// 					y: 50
	// 				},
	// 				textAnchor: 'middle'
	// 			},
	// 			axisY: {
	// 				axisTitle: 'Weight',
	// 				axisClass: 'ct-axis-title',
	// 				offset: {
	// 					x: 0,
	// 					y: 0
	// 				},
	// 				textAnchor: 'middle',
	// 				flipTitle: false
	// 			}
	// 		})
	// 	]
	// });

	setInterval(getData, 3000, chart)
})