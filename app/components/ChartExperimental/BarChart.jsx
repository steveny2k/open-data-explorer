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
      let chart_data = this.props.chart_data
      let {chartId, barColor, yAxisTicks, yGridTicks} =  this.props


      let margin = {top: 5, right: 50, bottom: 20, left: 40}
      let w = this.state.width - (margin.left + margin.right)
      let h = this.props.height - (margin.top + margin.bottom)

      let transform='translate('+margin.left+','+margin.top+')'


      let x=d3.scale.ordinal()
            .domain(chart_data.map(function(d){
                return d.key;
            }))
            .rangeRoundBands([0,this.state.width-100],.07);

      let y = d3.scale.linear()
            .domain([0,d3.max(chart_data,function(d){
                return d.value+(d.value*.15);
            })]).range([h, 0])

      let x_domain = d3.extent(chart_data, function(d) { return d.key; })

      let xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickValues(chart_data.map(function(d,i){
                    return d.key;
            }).splice(1))

      let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(yAxisTicks)
            .tickSize(-w, 0, 0)

      let yGrid = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(yGridTicks)
            .tickSize(-w, 0, 0)
            .tickFormat("")


        return(
            <div>
                 <svg id={chartId} width={this.state.width} height={this.props.height}>
                    <g transform={transform}>
                        <Grid h={h} grid={yGrid} gridType="y"/>
                      <Axis h={h} axis={yAxis} axisType="y" />
                        <Axis h={h} axis={xAxis} axisType="x"/>
                  <Bars chart_data={chart_data} x={x} y={y} h={h} barColor={barColor} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip} />
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
