$(document).ready(function(){
	var url = "http://104.196.149.230:5000/data"
	var getData = function(chart) {
		var end   = new Date()
		var start = new Date()
		start.setMinutes(end.getMinutes()-1)
		$.ajax({
			url: url + '/' + start.toISOString() + '/' + end.toISOString(),
			success: function(data, textStatus, jqXHR) {
				console.log(textStatus)
				console.log(data)
				var labels = []
				var series = []
				for(var datum in data) {
					labels.push(datum.published_at)
					series.push(datum.data)
				}
				var chart_data = {
				  // A labels array that can contain any sort of values
				  labels: labels,
				  // Our series array that contains series objects or in this case series data arrays
				  series: [
				    series
				  ]
				}
				chart.update(chart_data)
			}
		})
	}
	// Create a new line chart object where as first parameter we pass in a selector
	// that is resolving to our chart container element. The Second parameter
	// is the actual data object.
	var chart = new Chartist.Line('.ct-chart', {labels:[], series:[]});

	setInterval(getData, 3000, chart)
})