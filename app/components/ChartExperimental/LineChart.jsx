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
                x:e.target.getAttribute('cx'),
                y:e.target.getAttribute('cy')
            }

            }
        })
    }

    render() {

        let data=[
            {day:'02-11-2016',count:180},
            {day:'02-12-2016',count:250},
            {day:'02-13-2016',count:150},
            {day:'02-14-2016',count:496},
            {day:'02-15-2016',count:140},
            {day:'02-16-2016',count:380},
            {day:'02-17-2016',count:100},
            {day:'02-18-2016',count:150}
        ]

        let color =  this.props.color
        let margin = {top: 5, right: 50, bottom: 20, left: 50}
        let w = this.state.width - (margin.left + margin.right)
        let h = this.props.height - (margin.top + margin.bottom)

        let parseDate = d3.time.format("%m-%d-%Y").parse;

        data.forEach(function (d) {
            d.date = parseDate(d.day);
        })

        let x = d3.time.scale()
            .domain(d3.extent(data, function (d) {
                return d.date;
            })).rangeRound([0, w])

        let y = d3.scale.linear()
            .domain([0,d3.max(data,function(d){
                return d.count+100;
            })]).range([h, 0])

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5)

        let xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickValues(data.map(function(d,i){
                if(i>0)
                    return d.date;
            }).splice(1))
            .ticks(4);

        let xGrid = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(5)
            .tickSize(-h, 0, 0)
            .tickFormat("");


        let yGrid = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5)
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
                return x(d.date);
            })
            .y(function (d) {
                return y(d.count);
            }).interpolate(interpolations[5])


        let transform='translate(' + margin.left + ',' + margin.top + ')'


        return (
            <div>
                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
                    <g transform={transform}>

                        <Grid h={h} grid={yGrid} gridType="y"/>
                        {/*<Grid h={h} grid={xGrid} gridType="x"/> */}

                        <Axis h={h} axis={yAxis} axisType="y" />
                        <Axis h={h} axis={xAxis} axisType="x"/>

                        <path className="line" d={line(data)} strokeLinecap="round" stroke={color}  strokeWidth="2" fill="none" />

                        <Dots data={data} x={x} y={y} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip}/>

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
