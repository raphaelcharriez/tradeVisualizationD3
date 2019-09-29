import React, { Component } from 'react'
import '../App.css'
import { geoOrthographic, geoPath, geoMercator, geoNaturalEarth1 } from 'd3-geo'
import Draggable from 'react-draggable';
import { selectAll} from 'd3-selection'
import { timer } from 'd3-timer'

class WorldMap extends Component {
  constructor(props){
    super(props)
    this.canvasRef = React.createRef();
    this.createCanvas = this.createCanvas.bind(this)
    this.colorScale = ["#FFC940", "#F9BE3C", "#F3B239", "#EDA735", "#E69C32", "#DF912E", "#D9862A", "#D27B27", "#CB7023", "#C4651F", "#BC5A1C", "#B54F18", "#AD4415", "#A63811", "#9E2B0E"]
    this.importColorScale = ["#CFF3D2", "#B9E9CB", "#A6DEC5", "#93D3BF", "#83C7B9", "#73BBB5", "#65B0B0", "#59A3AC", "#4E97A9", "#448BA5", "#3C7EA2", "#3472A0", "#2D659D", "#26589B", "#1F4B99"]
    this.white = "#E1E8ED"
    this.hover = "#9179F2"
  }

  componentDidMount() {
    this.context = this.canvasRef.current.getContext('2d');
    this.createCanvas()
  }

  render() {
    const sphere = ({type: "Sphere"})
    var projection = geoOrthographic().fitExtent([[15, 15], [this.props.size[0] * 0.9, this.props.size[1]]], sphere).rotate(this.props.position)     
   
    if(this.props.projection === "2d"){
      projection = geoNaturalEarth1().fitExtent([[0, 0], [this.props.size[0], this.props.size[1]]], sphere).rotate(this.props.position)     
    } else {
       }
    const pathGenerator = geoPath().projection(projection)

    const countriesBalance = this.props.countryBalance.reduce( (obj, cb) => {
        obj[cb.reporter_iso] = {import: cb.import_value, export: cb.export_value, balance: cb.export_value- cb.import_value}
        return obj} 
      , {})
    const interval = this.props.countryBalance.reduce( (minMax, cb) => [Math.min(minMax[0], cb.export_value- cb.import_value ),Math.max(minMax[1], cb.export_value- cb.import_value)] ,  [0,0])
    
    const pickColor = (country) => {
      if (!(country in countriesBalance)){
        return this.white;
      } 
      else if (countriesBalance[country].balance > 0){ 
        return this.colorScale[Math.floor((countriesBalance[country].balance *  (this.colorScale.length-1))/ interval[1] )]
      }
      else {
        return this.importColorScale[Math.floor((countriesBalance[country].balance *  (this.importColorScale.length-1))/ interval[0] )]

      }
    
    }
    
    const countries = this.props.data
      .map((d,i) => <path
        key={"path" + i}
        d={pathGenerator(d)}
        onMouseEnter={() => {this.props.onHover(d.id)}}
        onMouseLeave={() => {this.props.onHover(this.props.selectedCountry.countryCode)}}
        onClick={() => this.props.onClick({country: "", countryCode: d.id})}
        style={{fill: this.props.hoverElement === d.id ? this.hover : pickColor(d.id), stroke: "#808080", strokeOpacity: 0.5 }}
        className="countries"
      />)
    
    const background = <rect 
      key = "map_background"
      style={{width: this.props.size[0] -30, height: this.props.size[1], fill: "#0d0d0d"}}
    />

    const hearth = <path
      key = "hearthmap"
      d={pathGenerator(sphere)}
      onDrag={() => (this.props.onDrag)}
      className="hearth"
    />
    
    const maxStrock = this.props.links.reduce((t,d)=> {return Math.max(t, d.value)}, 0);
    
    const connections = this.props.links.map((d,i) => {
    let value = Math.floor(d.value/ maxStrock * (this.colorScale.length-1)) +1 
    let color = this.colorScale[value- 1 ]
    let strokeOpacity = .5 * value / this.colorScale.length 
    let style  = {stroke: color, fill: 'none', strokeWidth:value, strokeOpacity: strokeOpacity}
    return (<path
        key={"connect" + i }
        d={pathGenerator(d)}
        style={style}
        className="route"
        freq={value}
        strokeLinecap="round"
      />)
    })
    return (
    <Draggable onStart={() => true}  onDrag={this.props.handleDrag} axis='none'>
      <div style={{position: 'relative'}}>
                <svg width={this.props.size[0]} height={this.props.size[1]}> 
                  {background}
                  {hearth}
                  {countries}
                  {connections}
                </svg>
                <canvas ref={this.canvasRef} width={this.props.size[0]} height={this.props.size[1]} 
                    style={{position: 'absolute',
                        left: '0px',
                        top: '0px',
                        zIndex : '1',
                        pointerEvents: 'none'
                    }}
                />
        </div>
    </Draggable>)

  }


  createCanvas(){
    const cx= this.context
    const width = this.props.size[0];
    const height = this.props.size[1];
    
    var freqCounter = 1;
        
    var t = timer(tick, 1000);
    var particles = [];
       
    function tick(elapsed) {
        
        particles = particles.filter(function (d) {return d.current < d.path.getTotalLength()});
       
        if (freqCounter > 10000) {
              freqCounter = 1;
        }
        

        selectAll("path.route")
            .each(
                function (d) {
                    if (freqCounter %	100 == 0) {
                    var offset = (Math.random() - .5) * 10;
                    particles.push({link: d, time: elapsed, offset: offset, path: this, speed: 1})
                }
            });
        
        particleEdgeCanvasPath(elapsed);
                freqCounter++;
        }

        
        function particleEdgeCanvasPath(elapsed) {
            cx.clearRect(0, 0, width * (1.8), height * (1.8));
            
            let colorScale = ["#FFC940", "#F9BE3C", "#F3B239", "#EDA735", "#E69C32", "#DF912E", "#D9862A", "#D27B27", "#CB7023", "#C4651F", "#BC5A1C", "#B54F18", "#AD4415", "#A63811", "#9E2B0E"]
            
            var x;
            for (x=0; x<particles.length; x++) {
                
                cx.fillStyle = "gray";
                cx.lineWidth = "2px";    
                var currentTime = elapsed - particles[x].time;
                particles[x].current = .2 * particles[x].speed * currentTime / 1000 * 400;
                var currentPos = particles[x].path.getPointAtLength(particles[x].current)
                cx.beginPath();
                cx.fillStyle = colorScale[particles[x].path.getAttribute("freq")-1];
                cx.arc(
                  currentPos.x,
                  currentPos.y + particles[x].offset,
                  Math.sqrt(1.5*particles[x].path.getAttribute("freq")),
                  0,
                  5*Math.PI
                );
                cx.fill();
            }
           
        }    
  }
}

export default WorldMap
