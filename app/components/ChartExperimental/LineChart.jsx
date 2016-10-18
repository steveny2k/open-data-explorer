import React, { Component } from 'react'
import d3 from 'd3'
import Dots from './Dots'
import Grid from './Grid'
import ToolTip from './Tooltip'
import Axis from './Axis'
import $ from 'jquery'

class LineChart extends Component {

    constructor(props) {
    super(props)
    this.state = {
            //otherChecked: false,
            tooltip:{ display:false,data:{key:'',value:''}},
            width:0,
            //selectedColumn:"",
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
        console.log(this.props);
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
                x:e.target.getAttribute('cx'),
                y:e.target.getAttribute('cy')
            }

            }
        })
    }

    render() {

        let chart_data = this.props.chart_data.slice(0)

        let {chartId, lineColor, yAxisTicks, yGridTicks, dotColorInner,dotColorOuter } =  this.props
        let margin = {top: 5, right: 50, bottom: 20, left: 50}
        let w = this.state.width - (margin.left + margin.right)
        let h = this.props.height - (margin.top + margin.bottom)

        let parseDate = d3.time.format("%m-%d-%Y").parse

        //console.log(chart_data);
        chart_data.forEach(function (d) {
            //console.log(d.key)
            d.key = parseDate(d.key)
        })


        let x = d3.time.scale()
            .domain(d3.extent(chart_data, function (d) {
                return d.key;
            })).rangeRound([0, w])

        let y = d3.scale.linear()
            .domain([0,d3.max(chart_data,function(d){
                return d.value+100;
            })]).range([h, 0])

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(yAxisTicks)

        let xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickValues(chart_data.map(function(d,i){
                if(i>0)
                    return d.key;
            }).splice(1))

        let xGrid = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(5)
            .tickSize(-h, 0, 0)
            .tickFormat("");


        let yGrid = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(yGridTicks)
            .tickSize(-w, 0, 0)
            .tickFormat("");


       let interpolations = [
            "linear",
            "step-before",
            "step-after",
            "basis",
            "basis-closed",
            "cardinal",
            "cardinal-closed"]

        let line = d3.svg.line()
        //https://www.dashingd3js.com/svg-paths-and-d3js
            .x(function (d) {
                return x(d.key);
            })
            .y(function (d) {
                return y(d.value);
            }).interpolate(interpolations[5])


        let transform='translate(' + margin.left + ',' + margin.top + ')'


        return (
            <div>
                <svg id={chartId} width={this.state.width} height={this.props.height}>
                    <g transform={transform}>

                        <Grid h={h} grid={yGrid} gridType="y"/>
                        {/*<Grid h={h} grid={xGrid} gridType="x"/> */}

                        <Axis h={h} axis={yAxis} axisType="y" />
                        <Axis h={h} axis={xAxis} axisType="x"/>

                        <path className="line" d={line(chart_data)} strokeLinecap="round" stroke={lineColor}  strokeWidth="2" fill="none" />

                        <Dots chart_data={chart_data} x={x} y={y} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip} dotColorOuter={dotColorOuter} dotColorInner={dotColorInner}/>

                        <ToolTip tooltip={this.state.tooltip}/>
                    </g>
                </svg>
            </div>
        )
    }
}

LineChart.propTypes = {
    width:React.PropTypes.number,
    height:React.PropTypes.number,
    chartId:React.PropTypes.string,
    width:React.PropTypes.number,
    height:React.PropTypes.number,
    interpolations:React.PropTypes.string

}


LineChart.defaultProps = {
    width: 800,
    height: 400,
    chartId: 'v1_chart'
}


export default LineChart
