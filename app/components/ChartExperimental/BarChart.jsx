import React, { Component } from 'react'
import d3 from 'd3'
import Grid from './Grid'
import ToolTip from './Tooltip'
import Axis from './Axis'
import $ from 'jquery'
import Bars from './Bars'

class BarChart extends Component {

    constructor(props) {
    super(props)
    this.state = {
            tooltip:{ display:false,data:{key:'',value:''}},
            width:0,
        }
    this.hideToolTip = this.hideToolTip.bind(this)
    this.showToolTip = this.showToolTip.bind(this)
    }

    componentWillMount() {
        var _self = this

        $(window).on('resize', function (e) {
         _self.updateSize()
        })

        this.setState({width: this.props.width})

    }
    componentDidMount() {
        this.updateSize()
    }
    componentWillUnmount() {
        $(window).off('resize')
    }

    updateSize () {
        var ReactDOM = require('react-dom');
        var node = ReactDOM.findDOMNode(this)
        var parentWidth = $(node).width()

        if (parentWidth < this.props.width) {
            this.setState({width: parentWidth - 20})
        }else {
            this.setState({width: this.props.width})
        }
    }

    hideToolTip(e){
        e.target.setAttribute('fill', '#7dc7f4');
        this.setState({tooltip:{ display:false,data:{key:'',value:''}}})
    }

    showToolTip(e){
        e.target.setAttribute('fill', '#FFFFFF');
        this.setState(
            {tooltip:{
            display:true,
            data: {
                key:e.target.getAttribute('data-key'),
                value:e.target.getAttribute('data-value')
                },
            pos:{
                x:e.target.getAttribute('x'),
                y:e.target.getAttribute('y')
            }

            }
        })
    }

    render() {
      let data=[
            { month:'Jan', value:800 },
            { month:'Feb', value:50 },
            { month:'Mar', value:65 },
            { month:'Apr', value:602 },
            { month:'May', value:70 },
            { month:'Jun', value:155 },
            { month:'Jul', value:280 },
            { month:'Aug', value:55 },
            { month:'Sep', value:175 },
            { month:'Oct', value:50 },
            { month:'Nov', value:160 },
            { month:'Dec', value:75 }
      ]

      let margin = {top: 5, right: 50, bottom: 20, left: 40}
      let w = this.state.width - (margin.left + margin.right)
      let h = this.props.height - (margin.top + margin.bottom)

      let transform='translate('+margin.left+','+margin.top+')'


      let x=d3.scale.ordinal()
            .domain(data.map(function(d){
                return d.month;
            }))
            .rangeRoundBands([0,this.state.width],.07);

      let y = d3.scale.linear()
            .domain([0,d3.max(data,function(d){
                return d.value+100;
            })]).range([h, 0])

      let xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")

      let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5)
            .tickSize(-w, 0, 0)

      let yGrid = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5)
            .tickSize(-w, 0, 0)
            .tickFormat("");


        return(
            <div>
                 <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
                    <g transform={transform}>
                        <Grid h={h} grid={yGrid} gridType="y"/>
                      <Axis h={h} axis={yAxis} axisType="y" />
                      <Bars data={data} x={x} y={y} h={h} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip} />
                      <ToolTip tooltip={this.state.tooltip}/>
                    </g>
                </svg>
            </div>
         )
    }
}

BarChart.defaultProps = {
    width: 800,
    height: 400,
    chartId: 'vi_chart'
}


export default BarChart
