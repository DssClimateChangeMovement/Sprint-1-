$.noConflict();
jQuery( document ).ready(function( $ ) {
  // Starting point
  

	new WOW().init(
		{
                      boxClass:     'wow',      // default
                      animateClass: 'animated', // default
                      offset:       100,          // default
                      mobile:       true,       // default
                      live:         true        // default
                    }
	);
	
	// wow functions
	$('.container .content').addClass('wow fadeIn').attr("data-wow-delay","0.5s");;
	
	$('ul#rotate1').quote_rotator({
		rotation_speed: 5000,                    // defaults to 5000
		pause_on_hover: false,                   // defaults to true
		randomize_first_quote: true              // defaults to false
	});

	setTimeout(function(){ 
		
		$('ul#rotate2').quote_rotator({
			rotation_speed: 5000,                    // defaults to 5000
			pause_on_hover: false,                   // defaults to true
			randomize_first_quote: true              // defaults to false
		});  	
	
	}, 2000);	
	setTimeout(function(){ 

	$('ul#rotate3').quote_rotator({
		rotation_speed: 5000,                    // defaults to 5000
		pause_on_hover: false,                   // defaults to true
		randomize_first_quote: true              // defaults to false
	});   
	},4000);	
	
	
	
	// 	menu anchor
	$(document).on('click', 'a[href^="#"]', function (event) {
	    event.preventDefault();
	
	    $('html, body').animate({
	        scrollTop: $($.attr(this, 'href')).offset().top -50
	    }, 800);
	});
	
	// sticky title section
	$("h2.title").stick_in_parent({
		recalc_every: true
	});
	$(".timeHead").stick_in_parent({
		offset_top:80
	});
	
	// open panel function
	
	$('#open').on('click', function(e){
		e.preventDefault();		
		$('#panelContent').addClass('open');
		
	});
	$('#close').on('click', function(){
		
		$('#panelContent').removeClass('open');
		
	});
	
	// Vue js file for Timeline
	var sheetUrl = 'https://spreadsheets.google.com/feeds/list/1kiNXPaFwYALxNHFq3OsmS_LDtmf9n5p6pqFxQaaairA/1/public/full?alt=json'
		var blog = new Vue({
		  el: '#timeline',
		  
		  data: {
				entries: null
			},
		  
		  watch: {
				currentPage: 'fetchData'
			},
		
		  created: function () {
		    this.fetchData()
		  },
		  
		  methods: {
		    fetchData: function () {
		      var xhr = new XMLHttpRequest()
		      var self = this
		      xhr.open('GET', sheetUrl )
		      xhr.onload = function () {        
		        self.entries = JSON.parse(xhr.responseText)
		        self.entries = self.entries.feed.entry        
		        console.log(self.entry)
		      }
		      xhr.send()
		    },
		//functions
		
		  },  
		  
		})
	
});

// D3 MAPS


var width = window.innerWidth,
    height = 800;

var projection = d3.geoMercator()
   .scale(200)
    .center([45, -15])
    .translate([width/2, height/2]);
  
var path = d3.geoPath()
  .projection(projection)

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var url = "https://enjalot.github.io/wwsd/data/world/world-110m.geojson";
//var url2 = "https://enjalot.github.io/wwsd/data/world/ne_50m_populated_places_simple.geojson"
//var url3 ="https://raw.githubusercontent.com/Orestisio/testing/master/map.geojson"
//var url4 ="https://spreadsheets.google.com/feeds/cells/16rq2mXOipNbNASobF0JZ17Fe8N2xfrKO-0kDw25cPcE/4/public/values?alt=json"
var url5 = "https://climatemovements.dss.cloud/inc/json/movements.geojson";

var div = d3.select("body").append("div")
     .attr("class", "tooltip-donut")
     .style("opacity", 0);
 
 
d3.json(url, function(error, countries) {
	d3.json(url5, function(error, places) {
	  if (error) console.log(error);
	  
	  console.log("geojson", countries, places);
	 
	  svg.selectAll("path")
	    .data(countries.features)
		.enter().append("path")
	    .attr("d", path);

/*
	    .on("mouseover",function(d) {
	    	console.log("just had a mouseover", d3.select(d));
	    	d3.select(this)
	      	.classed("active",true)
	  	})
	  	.on("mouseout",function(d){
	    	d3.select(this)
			.classed("active",false)
	    })
*/
	    
	  // all circle points
	  svg.selectAll("circle")
	  .data(places.features)
	  .enter().append("circle")
	  	.attr('r',5)
	    .attr('cx',function(d) { return projection(d.geometry.coordinates)[0]})
	    .attr('cy',function(d) { return projection(d.geometry.coordinates)[1]})
	    .attr("class", function (d) {
	                return d.properties.Movement.replace(/\s+/g, '');
	    })
	               
	    
	.on('mouseover', function (d) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.85');
          div.transition()
               .duration(50)
               .style("opacity", 1);
          let num =  d.properties.Movement;
		
          div.html(num)
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 15) + "px");
     })
     .on('mouseout', function (d) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1');
          div.transition()
               .duration('50')
               .style("opacity", 0);
     });	    
	   
	   
	   //
	   var collator = new Intl.Collator(undefined, {
	                numeric: true,
	                sensitivity: 'base'
	            });
	
	 // Filter on this column
	    var filter_on = 'Movement'
	
	    // Building an array with the values to filter on
	    var filter_list = d3.map(places.features, function (d) {
	        return d.properties.Movement.replace(/\s+/g, '');
	    }).keys()
	
// 		var filter_list = filter_liststr = str.replace(/\s+/g, '');
	    // Sort filter_list naturally
	    filter_list.sort(collator.compare);  
	  
	  // Building the filter checkboxes
	    d3.select("#filter")
	        .selectAll("input")
	        .data(filter_list)
	        .enter()
	        .append("label")
	        .append("input")
	        .attr("type", "checkbox")
	        .attr("class", "checkbox")
	        .attr("checked", "checked")
	        .attr("value", function (d) {
	            return d
	        })
	        .attr("id", function (d) {
	            return d
	        });
	
	    d3.selectAll("label")
	        .data(filter_list)
	        .attr("class", function (d) {
	            return "checkbox " + d
	        })
	        .append("text").text(function (d) {
	            return " " + d
	        }) 
	    
	 
	 // This function is gonna change the opacity and size of selected and unselected circles
	    function update(){
	
	      // For each check box:
	      d3.selectAll(".checkbox").each(function(d){
	        cb = d3.select(this);
	        grp = cb.property("value")
	
	        // If the box is check, I show the group
	        if(cb.property("checked")){
	          svg.selectAll("."+grp).transition().duration(800).style("opacity", .8).attr("r", 5)
	
	        // Otherwise I hide it
	        }else{
	          svg.selectAll("."+grp).transition().duration(800).style("opacity", 0).attr("r", 0)
	        }
	      })
	    }
	
	    // When a button change, I run the update function
	    d3.selectAll(".checkbox").on("change",update);
	
	    // And I initialize it at the beginning
	    update()   
	    
	    	  
	})
  
});


// SOCIAL BARS

	
function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

var csv = "https://docs.google.com/spreadsheet/pub?key=1KXqTQoCaHA9-CyCUZT6gfxnnID1qUJdgAGxoi3VA9nk&output=csv";
var csvSqr = "https://docs.google.com/spreadsheet/pub?key=1aZkacDrvu58ZPnNU5ezj_pKCCypOX6JwJ6KAxkpDmBE&output=csv";


var svgBar = d3.select("#socialBar"),
    margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = +svgBar.attr("width") - margin.left - margin.right,
    height = +svgBar.attr("height") - margin.top - margin.bottom,
    g = svgBar.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleBand()			// x = d3.scaleBand()	
    .rangeRound([0, height])	// .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var x = d3.scaleLinear()		// y = d3.scaleLinear()
    .rangeRound([0, width]);	// .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["cyan", "lightgreen", "deepskyblue", "hotpink"]);

d3.csv(csv, function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);
  
  console.log(data);

  data.sort(function(a, b) { return b.total - a.total; });
  y.domain(data.map(function(d) { return d.Movements; }));
   x.domain([0, d3.max(data, function(d) { return d.total; }) ] ).nice();	// y.domain...
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    
      .attr("y", function(d) { return y(d.data.Movements); })	    //.attr("x", function(d) { return x(d.data.State); })
      .attr("x", function(d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })	          
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("height", y.bandwidth())
      .attr("class", "dataRect wow fadeInLeft") //.attr("width", x.bandwidth());

      .on("mouseover", function() { tooltip.style("display", null); })
	  .on("mouseout", function() { tooltip.style("display", "none"); })
	  .on("mousemove", function(d) {
	    var xPosition = d3.mouse(this)[0] - 10;
	    var yPosition = d3.mouse(this)[1] - 20;
	    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
	    var toolText = d[1]-d[0];
	    console.log(d[1], d[0]);
	    tooltip.select("text").text(kFormatter(toolText));
	  });						    	

  g.append("g")
      .attr("class", "axis left")
      .attr("transform", "translate(20,0)") 						//  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(y))
      .attr("text-anchor", "start")
      .attr("font-size", "1.3em")
      .attr("font-weight", "bold")
      //.attr("class", "wow fadeIn")
      ;									//   .call(d3.axisBottom(x));
      
  g.append("g")
      .attr("class", "axis")
	  .attr("transform", "translate(0,"+height+")")				// New line
      .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("y", 2)												//     .attr("y", 2)
      .attr("x", x(x.ticks().pop()) + 0.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Followers")
	  .attr("transform", "translate("+ (-width) +", 20)");   	// Newline

  var legend = g.append("g")
      .attr("font-family", "")
      .attr("font-size", 20)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	 .attr("transform", function(d, i) { return "translate(0," + (300 + i * 20) + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 36)
      .attr("height", 22)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 40)
      .attr("y", 11)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
      
   // Prep the tooltip bits, initial display is hidden
	var tooltip = svgBar.append("g")
	  .attr("class", "tooltip")
	  .style("display", "none");
	    
	tooltip.append("rect")
	  .attr("width", 40)
	  .attr("height", 22)
	  .attr("fill", "white")
	  .style("opacity", 0.8);
	
	tooltip.append("text")
	  .attr("x", 20)
	  .attr("dy", "1.2em")
	  .style("text-anchor", "middle")
	  .attr("font-size", "12px")
	  .attr("font-weight", "bold");
	  
	// get totals
	var totals = d3.nest()
	  .key(function(d) {
	    return d.Movements;
	  })
	  .rollup(function(d) {
	    return d3.sum(d, function(g) {
	      return g.Facebook + g.Instagram + g.Twitter + g.Youtube;
	    });
	  })
	  .entries(data);
	
	
	var totalLabels = svgBar.append('g').attr('class', 'totals');
		totalLabels.selectAll('.total')
		  .data(totals)
		  .enter()
		  
		      .append("text")
		      .attr('class', 'total')
			  .attr("text-anchor", "start")

		  .attr("y", function(d) {
		    // Retrieve the correct vertical coordinates based on the date (stored as d.key)
		    // Plus some pixel offset so that the text is centered vertically relative to bar
		    return y(d.key) + y.bandwidth() + 10;
		  })

		  .attr("x", 32)
		  .attr("xxx", function(d) {
		    // Retrieve the horizontal coordinates based on total (stored as d.value)
		    // Add 5px offset so the label does not 'stick' to end of stacked bar
		    return x(d.value) + 50;
		  })
		  .text(function(d) {
		    // Inject total as text content (stored as d.value)
		    return kFormatter(d.value);
		  })
		  .style("font-size", "16px");

});

// Checkbox Animation Setup
// .to(@target, @length, @object)
/*
var controller = new ScrollMagic.Controller();
var tl = new TimelineMax();

tl.staggerTo("input.checkbox", 1, {css:{className:"+=show"}, ease:Power2.easeOut}, 0.2);

var scene = new ScrollMagic.Scene({
  triggerElement: "#where",
  triggerHook: "onEnter"
})
  .setTween(tl)
  .addIndicators({
    colorTrigger: "white",
    colorStart: "white",
    colorEnd: "white",
    indent: 40
  })
  .addTo(controller);
  
// // This function is gonna change the opacity and size of selected and unselected circles
function showPoints(){

  // For each check box:
  d3.selectAll("input.checkbox").each(function(d){
    cbs = d3.select(this);
    

    // If the box is check, I show the group
    if(cb.hasClass("show")){
      cbs.attr("checked", "checked");

    // Otherwise I hide it
    }else{
		cbs.attr("checked", null);    }
  })
}
showPoints();
*/