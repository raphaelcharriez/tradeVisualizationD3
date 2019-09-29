import * as d3 from 'd3'
import React, { Component } from 'react'
import './tradeFlower.css'


class TradeFlower extends Component {
    constructor(props){
      super(props)
      this.createCanvas = this.createD3Flower.bind(this)
      
    }
    
    componentDidUpdate() {
        this.createD3Flower(
            this.props.id,
            this.props.name,
            this.props.countryBalance,
            this.props.width - 10,
            this.props.height - 10,
            this.props.trade ? this.props.trade : false,
            this.props.products ? this.props.products  : [],
            this.props.selectedCountry ? this.props.selectedCountry : "",
            this.props
        )
    }
  
    render() {

        const mainStyle = {
            width: `${this.props.width}px`,
            eight: `${this.props.heigh}px`,
        };

        return ( 
            <div id={this.props.id} style={mainStyle}>
                <div id="sequence" style={{width: `${this.props.width/3}px`}}></div>
                <div id="chart">
                    <div id="explanation" style={{top:`${(this.props.height-50)/2}px`, left: `${(this.props.width-130)/2}px` }}>
                    <span id="percentage"></span><br/>
                    </div>
                </div>
            </div>
        );
    }

    createD3Flower(id, name, data, width, height, trade, products, selectedCountry, props){
        var widget=d3.select("#"+id)
        // reset on re-render
        widget.select("#chart").selectAll("svg").remove();
        
        // Dimensions of sunburst.
        var radius = Math.min(width, height) / 2;

        // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
        var b = {
            w: 50, h: 30, s: 20, t: 20
        };

        // Mapping of step names to colors.
        var colors = ["#1F4B99", "#2C5F9C", "#3A729E", "#4B84A0", "#6096A1", "#78A8A2", "#93B9A2", "#B3C8A2", "#D7D7A1", "#FFE39F", "#F8CE87", "#F0B971", "#E7A55D", "#DD914A", "#D27D3A", "#C66A2C", "#B9561F", "#AC4115", "#9E2B0E"]   // Total size of all segments; we set this later, after loading the data.
        var totalSize = 0; 

        var vis = widget.select("#chart").append("svg:svg")
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("id", "container")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var partition = d3.partition()
            .size([2 * Math.PI, radius * radius]);

        var arc = d3.arc()
            .startAngle(function(d) { return d.x0; })
            .endAngle(function(d) { return d.x1; })
            .innerRadius(function(d) { return Math.sqrt(d.y0); })
            .outerRadius(function(d) { return Math.sqrt(d.y1); });

        // Use d3.text and d3.csvParseRows so that we do not need to have a header
        // row, and can receive the csv as an array of arrays.
        
   
        var json = buildHierarchy(data, name, trade);
        createVisualization(json);

        // Main function to draw and set up the visualization, once we have the data.
        function createVisualization(json) {

        // Basic setup of page elements.
        initializeBreadcrumbTrail();
        drawLegend();
        widget.select("#togglelegend").on("click", toggleLegend);

        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.
        vis.append("svg:circle")
            .attr("r", radius)
            .style("opacity", 0);

        // Turn the data into a d3 hierarchy and calculate the sums.
        var root = d3.hierarchy(json)
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.value - a.value; });
        
        // For efficiency, filter nodes to keep only those large enough to see.
        var nodes = partition(root).descendants()
            .filter(function(d) {
                return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
            });

        var path = vis.data([json]).selectAll("path")
            .data(nodes)
            .enter().append("svg:path")
            .attr("display", function(d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function(d) { 
                return d.data.name === selectedCountry.countryCode ? "#9179F2" : colors[9+ Math.round(d.data.colorIndex)];
            })
            .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("click", handleClick);
        
        function handleClick(d) { 
            if(trade && props.selectProducts && props.clearProducts){
                props.clearProducts();
                var i = products.map(d => {return d.commodityCode}).indexOf(d.data.name)
                props.selectProducts([products[i]]);
            }
            if (props.onClick){
                props.onClick({country: d.data.label, countryCode: d.data.name});
            }
        }
        // Add the mouseleave handler to the bounding circle.
        widget.select("#container").on("mouseleave", mouseleave);

        // Get total size of the tree = value of root node from partition.
        totalSize = path.datum().value;
        };

        // Fade all but the current sequence, and show it in the breadcrumb trail.
        function mouseover(d) {
        
            var percentage = (100 * d.value / totalSize).toPrecision(3);
            var percentageString = percentage + "%";
            var dolla_value = (d.value / Math.pow(10,9)).toFixed(2)  + "B$"
            if (percentage < 0.1) {
                percentageString = "< 0.1%";
            }
            var i = products.map(d => {return d.commodityCode}).indexOf(d.data.name)
            var details = i>-1 ? percentageString + ' ' + products[i].commodity : percentageString + ' ' + d.data.name
            widget.select("#percentage")
                .text(details.slice(0,100))
            
            widget.select("#explanation")
                .style("visibility", "");

            var sequenceArray = d.ancestors().reverse();
            sequenceArray.shift(); // remove root node from the array
            updateBreadcrumbs(sequenceArray, dolla_value);

            // Fade all the segments.
            widget.select("#chart").selectAll("path")
                .style("opacity", 0.3);

            // Then highlight only those that are an ancestor of the current segment.
            vis.selectAll("path")
                .filter(function(node) {
                            return (sequenceArray.indexOf(node) >= 0);
                        })
                .style("opacity", 1);
            
        }

        // Restore everything to full opacity when moving off the visualization.
        function mouseleave(d) {

        // Hide the breadcrumb trail
        widget.select("#trail")
            .style("visibility", "hidden");

        // Deactivate all segments during transition.
        widget.select("#chart").selectAll("path").on("mouseover", null);

        // Transition each segment to full opacity and then reactivate it.
        widget.select("#chart").selectAll("path")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .on("end", function() {
                    d3.select(this).on("mouseover", mouseover);
            });

        widget.select("#explanation")
            .style("visibility", "hidden");
        }

        function initializeBreadcrumbTrail() {
        // Add the svg area.
        widget.select("#sequence").selectAll("*").remove();
        var trail = widget.select("#sequence").append("svg:svg")
            .attr("width", width)
            .attr("height", 50)
            .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
            .attr("id", "endlabel")
            .style("fill", "#fff");
        }

        // Generate a string that describes the points of a breadcrumb polygon.
        function breadcrumbPoints(d, i) {
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + (b.h / 2));
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
            points.push(b.t + "," + (b.h / 2));
        }
        return points.join(" ");
        }

        // Update the breadcrumb trail to show the current sequence and percentage.
        function updateBreadcrumbs(nodeArray, percentageString) {

        // Data join; key function combines name and depth (= position in sequence).
        var trail = widget.select("#trail")
            .selectAll("g")
            .data(nodeArray, function(d) { return d.data.name + d.depth; });

        // Remove exiting nodes.
        trail.exit().remove();

        // Add breadcrumb and label for entering nodes.
        var entering = trail.enter().append("svg:g");

        entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function(d) { 
                return d.data.name === selectedCountry.countryCode ? "#9179F2" : colors[9+ Math.round(d.data.colorIndex)]; 
            })

        entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.data.name; });

        // Merge enter and update selections; set position for all nodes.
        entering.merge(trail).attr("transform", function(d, i) {
            return "translate(" + i * (b.w + b.s) + ", 0)";
        });

        // Now move and update the percentage at the end.
        widget.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(percentageString);

        // Make the breadcrumb trail visible, if it's hidden.
        widget.select("#trail")
            .style("visibility", "");

        }

        function drawLegend() {

        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        var li = {
            w: 20, h: 10, s: 3, r: 3
        };

        var legend = widget.select("#flower").append("svg:svg")
            .attr("width", li.w)
            .attr("height", d3.keys(colors).length * (li.h + li.s));

        var g = legend.selectAll("g")
            .data(d3.entries(colors))
            .enter().append("svg:g")
            .attr("transform", function(d, i) {
                    return "translate(0," + i * (li.h + li.s) + ")";
                });

        g.append("svg:rect")
            .attr("rx", li.r)
            .attr("ry", li.r)
            .attr("width", li.w)
            .attr("height", li.h)
            .style("fill", function(d) { return d.value; });

        g.append("svg:text")
            .attr("x", li.w / 2)
            .attr("y", li.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.key; });
        }

        function toggleLegend() {
        var legend = widget.select("#legend");
        if (legend.style("visibility") == "hidden") {
            legend.style("visibility", "");
        } else {
            legend.style("visibility", "hidden");
        }
        }

        function buildHierarchy(data, name, trade) {
            
            var output = { 
                "name": "export",
                "children": []
            }

            if (trade===false){
                const balances = data.reduce( (obj, cb) => {
                    obj[cb.reporter_iso] = {import: cb.import_value, export: cb.export_value, balance: cb.export_value- cb.import_value}
                    return obj} 
                  , {})
                const interval = data.reduce( (minMax, cb) => [Math.min(minMax[0], cb.export_value- cb.import_value ),Math.max(minMax[1], cb.export_value- cb.import_value)] ,  [0,0])
                const pickColor = (country) => {
                    if (!(country in balances)){
                      return undefined
                    } 
                    else if (balances[country].balance > 0){ 
                      return Math.floor((balances[country].balance) * 9 / interval[1] )
                    }
                    else {
                      return -Math.floor((balances[country].balance) * 9 / interval[0] ) 
              
                    }
                  
                }



                data.forEach((c) => {
                    output["children"].push({
                        name: c[name.name],
                        value: c[name.value],
                        children: [],
                        colorIndex: pickColor(c[name.name])
                    })
                })
            }

            else {
                data = data.sort((a,b) => (a[name.name].length > b[name.name].length) ? 1 : -1); 

                data.forEach((c) => {
                    var index=2
                    var level = output["children"]
                    while ((c[name.name].length - index) > 0){
                        if (level.map(c=>{return c.name}).indexOf(c[name.name].slice(0,index)) < 0){
                            level.push({
                                name: c[name.name].slice(0,index),
                                children: []
                            })
                        }
                        var pos = level.map(c=>{return c.name}).indexOf(c[name.name].slice(0,index))
                        index+=2
                        level = level[pos]["children"]
                    }
                    level.push({
                        name: c[name.name].slice(0,index),
                        value: c[name.value],
                        label: c["commodity"],
                        colorIndex: c["dependancy"] * 10,
                        children: []
                    })
                })
            }
            return output
        };
    }
    
}
   
export default TradeFlower
